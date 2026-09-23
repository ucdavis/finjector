import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { delay, http, HttpResponse } from "msw";
import { transferableAbortController } from "node:util";
import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { server } from "../../../test/mocks/node";
import { UserAccessReportRow } from "../../models/reports/UserAccessReportRow";
import UserAccessReport from "./UserAccessReport";

const reportRows: UserAccessReportRow[] = [
  {
    teamId: 7,
    teamName: "Research",
    folderId: null,
    folderName: null,
    userId: 11,
    userName: "Alice Analyst",
    userEmail: "alice@example.test",
    roleName: "View",
    permissionSource: "Team",
  },
  {
    teamId: 7,
    teamName: "Research",
    folderId: 9,
    folderName: "Budget",
    userId: 11,
    userName: "Alice Analyst",
    userEmail: "alice@example.test",
    roleName: "View",
    permissionSource: "Inherited from team",
  },
  {
    teamId: 7,
    teamName: "Research",
    folderId: 9,
    folderName: "Budget",
    userId: 11,
    userName: "Alice Analyst",
    userEmail: "alice@example.test",
    roleName: "Edit",
    permissionSource: "Folder",
  },
  {
    teamId: 7,
    teamName: "Research",
    folderId: 9,
    folderName: "Budget",
    userId: 12,
    userName: "Bob Reviewer",
    userEmail: "bob@example.test",
    roleName: "Admin",
    permissionSource: "Folder",
  },
];

beforeAll(() => {
  // jsdom's AbortSignal is incompatible with Node's native fetch used by MSW.
  vi.stubGlobal(
    "AbortController",
    class {
      constructor() {
        return transferableAbortController();
      }
    }
  );
  server.listen({ onUnhandledRequest: "error" });
});
afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => {
  server.close();
  vi.unstubAllGlobals();
});

const renderReport = (path = "/teams/access-report") =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <MemoryRouter initialEntries={[path]}>
        <Link to="/teams/8/access-report">Other team report</Link>
        <Routes>
          <Route path="/teams/access-report" element={<UserAccessReport />} />
          <Route
            path="/teams/:teamId/access-report"
            element={<UserAccessReport />}
          />
          <Route
            path="/teams/:teamId/folders/:folderId/access-report"
            element={<UserAccessReport />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );

const respondWith = (rows: UserAccessReportRow[]) => {
  server.use(
    http.get("/api/user/permissions/report", () => HttpResponse.json(rows))
  );
};

describe("UserAccessReport", () => {
  it.each([
    ["/teams/access-report", "", "All teams and folders you administer"],
    ["/teams/7/access-report", "?teamId=7", "Team: Research"],
    [
      "/teams/7/folders/9/access-report",
      "?teamId=7&folderId=9",
      "Folder: Budget · Team: Research",
    ],
  ])(
    "requests the scope for %s without browser caching",
    async (path, query, scope) => {
      const requests: Request[] = [];
      server.use(
        http.get("/api/user/permissions/report", ({ request }) => {
          requests.push(request);
          return HttpResponse.json(
            path.includes("/folders/") ? reportRows.slice(1) : reportRows
          );
        })
      );
      renderReport(path);

      expect(await screen.findByRole("table")).toBeInTheDocument();
      expect(screen.getByText(scope)).toBeInTheDocument();
      expect(requests).toHaveLength(1);
      expect(new URL(requests[0].url).search).toBe(query);
      expect(requests[0].cache).toBe("no-store");
    }
  );

  it("shows direct and inherited permissions separately and counts unique users", async () => {
    respondWith(reportRows);
    renderReport();

    const table = await screen.findByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(5);
    expect(within(table).getAllByText("Alice Analyst")).toHaveLength(3);
    expect(within(table).getByText("Inherited from team")).toBeInTheDocument();
    expect(within(table).getByText("Team-level access")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "4 of 4 permission rows · 2 users"
    );
    expect(screen.getByText(/highest role applies/)).toBeInTheDocument();
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((cell) => cell.textContent)
    ).toEqual([
      "Team",
      "Folder",
      "User Name",
      "User Email",
      "Assigned Role",
      "Permission Source",
    ]);
  });

  it("fetches a new scope and resets the previous search", async () => {
    server.use(
      http.get("/api/user/permissions/report", ({ request }) =>
        HttpResponse.json(
          new URL(request.url).searchParams.get("teamId") === "8"
            ? [{ ...reportRows[3], teamId: 8, teamName: "Payroll" }]
            : reportRows
        )
      )
    );
    const user = userEvent.setup();
    renderReport("/teams/7/access-report");
    await screen.findByRole("table");
    await user.type(screen.getByRole("searchbox"), "Alice");
    await user.click(screen.getByRole("link", { name: "Other team report" }));

    expect(await screen.findByText("Team: Payroll")).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveValue("");
    expect(screen.getByText("Bob Reviewer")).toBeInTheDocument();
    expect(screen.queryByText("Alice Analyst")).not.toBeInTheDocument();
  });

  it("cancels an in-flight report when leaving the page", async () => {
    let requestSignal: AbortSignal | undefined;
    server.use(
      http.get("/api/user/permissions/report", async ({ request }) => {
        requestSignal = request.signal;
        await delay(100);
        return HttpResponse.json(reportRows);
      })
    );
    const view = renderReport();
    await waitFor(() => expect(requestSignal).toBeDefined());
    view.unmount();
    expect(requestSignal?.aborted).toBe(true);
  });

  it.each([
    ["RESEARCH", 4],
    ["Budget", 3],
    ["  alice analyst  ", 3],
    ["bob@example", 1],
    ["Edit", 1],
    ["Inherited from team", 1],
    ["Team-level access", 1],
  ])("filters displayed column values by %s", async (term, count) => {
    respondWith(reportRows);
    const user = userEvent.setup();
    renderReport();
    await screen.findByRole("table");

    await user.type(
      screen.getByRole("searchbox", { name: "Search user access report" }),
      term
    );
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(
      count + 1
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      `${count} of 4 permission rows`
    );
  });

  it("shows a no-match message and disables export", async () => {
    respondWith(reportRows);
    const user = userEvent.setup();
    renderReport();
    await screen.findByRole("table");

    await user.type(screen.getByRole("searchbox"), "missing person");
    expect(
      screen.getByText("No permissions match your search.")
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export CSV" })).toBeDisabled();
  });

  it("shows a loading state before an empty report", async () => {
    server.use(
      http.get("/api/user/permissions/report", async () => {
        await delay(50);
        return HttpResponse.json([]);
      })
    );
    renderReport();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export CSV" })).toBeDisabled();
    expect(
      await screen.findByText(
        "No user access to report for the teams or folders you administer."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "0 of 0 permission rows · 0 users"
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("allows a failed report to be refreshed", async () => {
    server.use(
      http.get(
        "/api/user/permissions/report",
        () => new HttpResponse(null, { status: 500 })
      )
    );
    const user = userEvent.setup();
    renderReport();

    expect(
      await screen.findByText("Unable to load user access report")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export CSV" })).toBeDisabled();
    respondWith(reportRows);
    await user.click(screen.getByRole("button", { name: "Refresh" }));
    expect(await screen.findByRole("table")).toBeInTheDocument();
  });

  it("refreshes removed permissions and disables export while refreshing", async () => {
    respondWith(reportRows);
    const user = userEvent.setup();
    renderReport();
    await screen.findByRole("table");
    server.use(
      http.get("/api/user/permissions/report", async () => {
        await delay(50);
        return HttpResponse.json([]);
      })
    );

    await user.click(screen.getByRole("button", { name: "Refresh" }));
    expect(screen.getByRole("button", { name: "Export CSV" })).toBeDisabled();
    expect(
      await screen.findByText(
        "No user access to report for the teams or folders you administer."
      )
    ).toBeInTheDocument();
    expect(screen.queryByText("Alice Analyst")).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("hides previously loaded rows when refresh loses authorization", async () => {
    respondWith(reportRows);
    const user = userEvent.setup();
    renderReport();
    await screen.findByRole("table");
    server.use(
      http.get(
        "/api/user/permissions/report",
        () => new HttpResponse(null, { status: 401 })
      )
    );

    await user.click(screen.getByRole("button", { name: "Refresh" }));
    expect(await screen.findByText("Not Authorized")).toBeInTheDocument();
    expect(screen.queryByText("Alice Analyst")).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Export CSV" })).toBeDisabled();
  });

  it("exports only filtered rows with CSV escaping and formula protection", async () => {
    const maliciousRow: UserAccessReportRow = {
      ...reportRows[2],
      teamName: "=SUM(1,2)",
      folderName: ' +CMD("folder")\nnext',
      userName: '\u0001 \t@export me "quoted"\nlast',
      userEmail: "\t-harmful@example.test",
    };
    respondWith([maliciousRow, reportRows[3]]);
    const user = userEvent.setup();
    renderReport();
    await screen.findByRole("table");
    await user.type(screen.getByRole("searchbox"), "export me");

    let downloadedBlob: Blob | undefined;
    const originalCreate = Object.getOwnPropertyDescriptor(
      URL,
      "createObjectURL"
    );
    const originalRevoke = Object.getOwnPropertyDescriptor(
      URL,
      "revokeObjectURL"
    );
    const createUrl = vi.fn((blob: Blob) => {
      downloadedBlob = blob;
      return "blob:report-download";
    });
    const revokeUrl = vi.fn();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: createUrl,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: revokeUrl,
    });
    let downloadName = "";
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function (this: HTMLAnchorElement) {
        downloadName = this.download;
        expect(this.href).toBe("blob:report-download");
      });

    try {
      await user.click(screen.getByRole("button", { name: "Export CSV" }));
      expect(click).toHaveBeenCalledOnce();
      expect(createUrl).toHaveBeenCalledOnce();
      expect(revokeUrl).toHaveBeenCalledWith("blob:report-download");
      expect(downloadName).toBe("user-access-report.csv");
      expect(downloadedBlob?.type).toBe("text/csv;charset=utf-8;");
      const csv = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsText(downloadedBlob!);
      });
      expect(csv).toContain(
        '"Team","Folder","User Name","User Email","Assigned Role","Permission Source"\r\n'
      );
      expect(csv).toContain(
        '"\'=SUM(1,2)","\' +CMD(""folder"")\nnext","\'\u0001 \t@export me ""quoted""\nlast","\'\t-harmful@example.test","Edit","Folder"'
      );
      expect(csv).not.toContain("Bob Reviewer");
      expect(
        document.querySelector('a[download="user-access-report.csv"]')
      ).toBeNull();
    } finally {
      if (originalCreate)
        Object.defineProperty(URL, "createObjectURL", originalCreate);
      else Reflect.deleteProperty(URL, "createObjectURL");
      if (originalRevoke)
        Object.defineProperty(URL, "revokeObjectURL", originalRevoke);
      else Reflect.deleteProperty(URL, "revokeObjectURL");
    }
  });
});
