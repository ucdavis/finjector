import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { server } from "../../test/mocks/node";
import { fakeFolders } from "../../test/mocks/mockData";
import { ChartType, Coa, SegmentData } from "../types";
import Entry from "./Entry";
import Paste from "./Paste";

const project: SegmentData = {
  segmentName: "project",
  code: "CM00012345",
  name: "Pasted project",
  default: "0000000000",
  isValid: false,
  glPostingDepartmentCode: "1234567",
};
const otherProject = {
  ...project,
  code: "CM00012346",
  name: "Another project",
};
const organization: SegmentData = {
  segmentName: "organization",
  code: "1234567",
  name: "Posting organization",
  default: "0000000",
  isValid: false,
};
const expenditureType: SegmentData = {
  segmentName: "expenditureType",
  code: "599999",
  name: "Configured expenditure type",
  default: "000000",
  isValid: true,
};
const task: SegmentData = {
  segmentName: "task",
  code: "100001",
  name: "Only project task",
  default: "000000",
  isValid: false,
};

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  server.resetHandlers();
  server.use(
    http.get("/api/folder/folderSearchList", () =>
      HttpResponse.json(fakeFolders)
    ),
    http.get("/api/ppmsearch/project", () =>
      HttpResponse.json([otherProject, project])
    ),
    http.get("/api/ppmsearch/organization", () =>
      HttpResponse.json([organization])
    ),
    http.get("/api/ppmsearch/expenditureType", () =>
      HttpResponse.json([expenditureType])
    ),
    http.get("/api/ppmsearch/defaultExpenditureType", () =>
      HttpResponse.json([expenditureType])
    ),
    http.get("/api/ppmsearch/tasksByProject", () => HttpResponse.json([task]))
  );
});
afterAll(() => server.close());

const Location = () => {
  const location = useLocation();
  return (
    <output data-testid="location">
      {location.pathname + location.search}
    </output>
  );
};

const renderPaste = (initialEntry = "/paste", renderEntryPage = true) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Location />
        <Routes>
          <Route path="/paste" element={<Paste />} />
          <Route path="/entry" element={renderEntryPage ? <Entry /> : <></>} />
          <Route
            path="/entry/:chartSegmentString"
            element={renderEntryPage ? <Entry /> : <></>}
          />
          <Route
            path="/teams/:teamId/folders/:folderId/entry/:chartId/:chartSegmentString"
            element={<Entry />}
          />
          <Route path="/locator/entry/:id" element={<p>Chart locator</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
  return { client, user: userEvent.setup() };
};

const waitForProjectLookup = async (client: QueryClient) => {
  await waitFor(() => {
    expect(
      client.getQueryState([
        "segments",
        ChartType.PPM,
        "project",
        project.code,
        "",
      ])?.status
    ).toBe("success");
    expect(client.isFetching()).toBe(0);
  });
};

const expectDefaultsEmpty = () => {
  expect(screen.getByPlaceholderText("Search for organization...")).toHaveValue(
    ""
  );
  expect(
    screen.getByPlaceholderText("Search for expenditureType...")
  ).toHaveValue("");
  expect(screen.getByPlaceholderText("Choose a task...")).toHaveValue("");
};

describe("Paste a PPM project", () => {
  it.each(["NEXT", "Enter"])(
    "accepts a trimmed lowercase project using %s and fills its defaults",
    async (submit) => {
      const { user } = renderPaste();
      await user.type(screen.getByRole("textbox"), "  cm00012345  ");

      expect(screen.getByRole("button", { name: "NEXT" })).toBeEnabled();
      if (submit === "NEXT") {
        await user.click(screen.getByRole("button", { name: "NEXT" }));
      } else {
        await user.keyboard("{Enter}");
      }

      await waitFor(() => {
        expect(screen.getByTestId("location")).toHaveTextContent(
          `/entry?project=${project.code}`
        );
        expect(
          screen.getByPlaceholderText("Search for project...")
        ).toHaveValue(project.code);
        expect(
          screen.getByPlaceholderText("Search for organization...")
        ).toHaveValue(organization.code);
        expect(
          screen.getByPlaceholderText("Search for expenditureType...")
        ).toHaveValue(expenditureType.code);
        expect(screen.getByPlaceholderText("Choose a task...")).toHaveValue(
          task.code
        );
      });
      expect(screen.getByText(project.name)).toBeInTheDocument();
      expect(screen.getByText(organization.name)).toBeInTheDocument();
      expect(screen.getByText(expenditureType.name)).toBeInTheDocument();
      expect(screen.getByText(task.name)).toBeInTheDocument();
      expect(
        await screen.findByText("CM00012345-100001-1234567-599999")
      ).toBeInTheDocument();
      expect(
        await screen.findByText("Chart String is valid")
      ).toBeInTheDocument();
    }
  );

  it("requires an exact project match before applying defaults", async () => {
    const defaultLookup = vi.fn(() => HttpResponse.json([expenditureType]));
    const taskLookup = vi.fn(() => HttpResponse.json([task]));
    const organizationLookup = vi.fn(() => HttpResponse.json([organization]));
    server.use(
      http.get("/api/ppmsearch/project", () =>
        HttpResponse.json([otherProject])
      ),
      http.get("/api/ppmsearch/defaultExpenditureType", defaultLookup),
      http.get("/api/ppmsearch/tasksByProject", taskLookup),
      http.get("/api/ppmsearch/organization", organizationLookup)
    );
    const { client, user } = renderPaste();
    await user.type(screen.getByRole("textbox"), project.code);
    await user.click(screen.getByRole("button", { name: "NEXT" }));
    await waitForProjectLookup(client);

    expect(
      await screen.findByText(
        "No PPM project was found for that code. Search for a project to continue."
      )
    ).toBeInTheDocument();
    expectDefaultsEmpty();
    expect(defaultLookup).not.toHaveBeenCalled();
    expect(taskLookup).not.toHaveBeenCalled();
    expect(organizationLookup).not.toHaveBeenCalled();
    const input = screen.getByPlaceholderText("Search for project...");
    expect(input).toBeEnabled();
    expect(input).toHaveValue(project.code);
    expect(
      screen.getByText("Chart String is not yet valid")
    ).toBeInTheDocument();
  });

  it("keeps the project editable after the lookup fails", async () => {
    server.use(
      http.get(
        "/api/ppmsearch/project",
        () => new HttpResponse(null, { status: 500 })
      )
    );
    const { client, user } = renderPaste(`/entry?project=${project.code}`);
    await waitFor(() => {
      expect(
        client.getQueryState([
          "segments",
          ChartType.PPM,
          "project",
          project.code,
          "",
        ])?.status
      ).toBe("error");
    });

    expect(
      await screen.findByText(
        "Unable to look up that project. Search for a project to continue."
      )
    ).toBeInTheDocument();
    expectDefaultsEmpty();
    const input = screen.getByPlaceholderText("Search for project...");
    expect(input).toBeEnabled();
    await user.clear(input);
    await user.type(input, "CM");
    expect(input).toHaveValue("CM");
    expect(
      screen.queryByText(
        "Unable to look up that project. Search for a project to continue."
      )
    ).not.toBeInTheDocument();
  });

  it("does not replace manual project edits with a delayed initial lookup", async () => {
    let finishLookup!: () => void;
    const pendingLookup = new Promise<void>((resolve) => {
      finishLookup = resolve;
    });
    server.use(
      http.get("/api/ppmsearch/project", async () => {
        await pendingLookup;
        return HttpResponse.json([project]);
      })
    );
    const { client, user } = renderPaste(`/entry?project=${project.code}`);
    await waitFor(() => {
      expect(
        client.getQueryState([
          "segments",
          ChartType.PPM,
          "project",
          project.code,
          "",
        ])?.fetchStatus
      ).toBe("fetching");
    });
    const input = screen.getByPlaceholderText("Search for project...");
    await user.clear(input);
    await user.type(input, "ZZ");
    finishLookup();
    await waitForProjectLookup(client);

    expect(input).toHaveValue("ZZ");
    expectDefaultsEmpty();
  });

  it.each(["CM0001234", "CM000123456", "CM00012_45"])(
    "rejects an invalid project number %s",
    async (value) => {
      const { user } = renderPaste();
      await user.type(screen.getByRole("textbox"), value);

      expect(screen.getByRole("button", { name: "NEXT" })).toBeDisabled();
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByTestId("location")).toHaveTextContent("/paste");
    }
  );
});

describe("Existing pasted chart routes", () => {
  it.each([
    [
      "GL",
      "1311-63031-9300531-508210-44-G29-CM00000039-510139-0000-000000-000000",
    ],
    ["PPM", "CM00012345-100001-1234567-599999"],
    [
      "PPM with mixed-case funding source",
      "CM00012345-100001-1234567-599999-A000001-miXeD1",
    ],
    ["POET", "CM00012345-1234567-599999-100001"],
  ])(
    "preserves the %s chart string in the entry path",
    async (_, chartString) => {
      const { user } = renderPaste("/paste", false);
      await user.type(screen.getByRole("textbox"), `  ${chartString}  `);
      await user.click(screen.getByRole("button", { name: "NEXT" }));

      expect(screen.getByTestId("location").textContent).toBe(
        `/entry/${chartString}`
      );
    }
  );

  it.each(["42", "1234567890"])(
    "keeps a bare saved-chart entry path %s routed through the locator",
    async (chartId) => {
      renderPaste(`/entry/${chartId}`);

      await waitFor(() => {
        expect(screen.getByTestId("location").textContent).toBe(
          `/locator/entry/${chartId}`
        );
      });
      expect(screen.getByText("Chart locator")).toBeInTheDocument();
    }
  );
});

describe("Saved PPM task preservation", () => {
  const unavailableTaskCode = "900099";
  const secondTask = { ...task, code: "100002", name: "Another eligible task" };

  const mockSavedChart = (
    eligibleTasks: SegmentData[],
    projectValid = true,
    initialTaskCode = unavailableTaskCode
  ) => {
    const savedChart: Coa = {
      id: 4242,
      chartType: ChartType.PPM,
      name: "Existing PPM chart",
      segmentString: `${project.code}-${unavailableTaskCode}-${organization.code}-${expenditureType.code}`,
      folderId: fakeFolders[0].id,
      folder: fakeFolders[0],
      teamName: "Existing team",
      updated: new Date("2026-09-15T12:00:00Z"),
      canEdit: true,
    };
    const defaultLookup = vi.fn(() => HttpResponse.json([expenditureType]));
    const saveRequest = vi.fn(() => HttpResponse.json(savedChart));
    server.use(
      http.get("/api/charts/4242", () => HttpResponse.json(savedChart)),
      http.get("/api/ppmsearch/tasksByProject", () =>
        HttpResponse.json(eligibleTasks)
      ),
      http.get("/api/ppmsearch/defaultExpenditureType", defaultLookup),
      http.post("/api/charts/save", saveRequest),
      http.get("/api/ppmsearch/validate", ({ request }) => {
        const segmentString =
          new URL(request.url).searchParams.get("segmentString") || "";
        const taskValid = segmentString.split("-")[1] !== unavailableTaskCode;
        return HttpResponse.json({
          segmentString,
          segments: {
            ...(projectValid ? { project: project.code } : {}),
            ...(taskValid ? { task: segmentString.split("-")[1] } : {}),
            organization: organization.code,
            expenditureType: expenditureType.code,
          },
          validationResponse: {
            valid: projectValid && taskValid,
            errorMessages: taskValid
              ? []
              : ["The saved task is no longer available."],
          },
          warnings: [],
        });
      })
    );
    return {
      path: `/teams/1/folders/${savedChart.folderId}/entry/${savedChart.id}/${project.code}-${initialTaskCode}-${organization.code}-${expenditureType.code}`,
      defaultLookup,
      saveRequest,
    };
  };

  const waitForSavedChart = async (client: QueryClient) => {
    await waitFor(() => {
      expect(client.getQueryState(["charts", "saved", "4242"])?.status).toBe(
        "success"
      );
      expect(client.isFetching()).toBe(0);
    });
  };

  it.each([
    { result: "zero", tasks: [] as SegmentData[] },
    { result: "one different", tasks: [task] },
    { result: "multiple", tasks: [task, secondTask] },
  ])(
    "keeps an unavailable saved task invalid and visible with $result eligible tasks",
    async ({ tasks }) => {
      const { path, defaultLookup, saveRequest } = mockSavedChart(tasks);
      const { client } = renderPaste(path);
      await waitForSavedChart(client);

      expect(screen.getByPlaceholderText("Choose a task...")).toHaveValue(
        unavailableTaskCode
      );
      expect(
        screen.getByText("Chart String is not yet valid")
      ).toBeInTheDocument();
      expect(defaultLookup).not.toHaveBeenCalled();
      expect(saveRequest).not.toHaveBeenCalled();
    }
  );

  it("keeps the saved task when validation does not recognize the project", async () => {
    const { path, defaultLookup, saveRequest } = mockSavedChart([], false);
    const { client } = renderPaste(path);
    await waitForSavedChart(client);

    const input = screen.getByPlaceholderText("Choose a task...");
    expect(input).toHaveValue(unavailableTaskCode);
    expect(input).toBeDisabled();
    expect(
      screen.getByText("Chart String is not yet valid")
    ).toBeInTheDocument();
    expect(defaultLookup).not.toHaveBeenCalled();
    expect(saveRequest).not.toHaveBeenCalled();
  });

  it("updates the task input when the loaded saved value differs from the URL", async () => {
    const { path } = mockSavedChart([], true, task.code);
    const { client } = renderPaste(path);
    await waitForSavedChart(client);

    expect(screen.getByPlaceholderText("Choose a task...")).toHaveValue(
      unavailableTaskCode
    );
    expect(
      screen.getByText("Chart String is not yet valid")
    ).toBeInTheDocument();
  });

  it.each([
    { result: "one", tasks: [task] },
    { result: "multiple", tasks: [task, secondTask] },
  ])(
    "lets the user replace the unavailable saved task with $result eligible tasks",
    async ({ tasks }) => {
      const { path, saveRequest } = mockSavedChart(tasks);
      const { client, user } = renderPaste(path);
      await waitForSavedChart(client);

      const input = screen.getByPlaceholderText("Choose a task...");
      await user.clear(input);
      expect(input).toHaveValue("");
      await user.type(input, task.code.slice(0, 3));
      expect(input).toHaveValue(task.code.slice(0, 3));
      await user.type(input, task.code.slice(3));
      expect(input).toHaveValue(task.code);
      expect(
        screen.getByText("Chart String is not yet valid")
      ).toBeInTheDocument();
      await user.click(
        await screen.findByRole("option", { name: new RegExp(task.code) })
      );

      expect(input).toHaveValue(task.code);
      expect(screen.getByText(task.name)).toBeInTheDocument();
      expect(
        await screen.findByText("Chart String is valid")
      ).toBeInTheDocument();
      expect(saveRequest).not.toHaveBeenCalled();
    }
  );

  it("clears the old saved task on a project change and selects the new sole task", async () => {
    const { path, saveRequest } = mockSavedChart([]);
    server.use(
      http.get("/api/ppmsearch/tasksByProject", ({ request }) =>
        HttpResponse.json(
          new URL(request.url).searchParams.get("projectNumber") ===
            project.code
            ? []
            : [secondTask]
        )
      )
    );
    const { client, user } = renderPaste(path);
    await waitForSavedChart(client);

    const taskInput = screen.getByPlaceholderText("Choose a task...");
    expect(taskInput).toHaveValue(unavailableTaskCode);
    const projectInput = screen.getByPlaceholderText("Search for project...");
    await user.clear(projectInput);
    expect(screen.getByPlaceholderText("Choose a task...")).toHaveValue("");
    await user.type(projectInput, otherProject.code);
    await user.click(
      await screen.findByRole("option", { name: new RegExp(otherProject.code) })
    );

    await waitFor(() =>
      expect(screen.getByPlaceholderText("Choose a task...")).toHaveValue(
        secondTask.code
      )
    );
    expect(screen.getByText(secondTask.name)).toBeInTheDocument();
    expect(
      await screen.findByText("Chart String is valid")
    ).toBeInTheDocument();
    expect(saveRequest).not.toHaveBeenCalled();
  });
});
