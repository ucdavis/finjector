import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { server } from "../../../test/mocks/node";
import { ChartType, SegmentData } from "../../types";
import { buildInitialPpmSegments } from "../../util/segmentHelpers";
import PpmEntry from "./PpmEntry";

const organization: SegmentData = {
  segmentName: "organization",
  code: "1234567",
  name: "Project posting department",
  default: "0000000",
  isValid: false,
};

const existingOrganization: SegmentData = {
  ...organization,
  code: "7654321",
  name: "Existing organization",
  isValid: true,
};

const expenditureType: SegmentData = {
  segmentName: "expenditureType",
  code: "599999",
  name: "Configured expenditure type",
  default: "000000",
  isValid: true,
};

const existingExpenditureType: SegmentData = {
  ...expenditureType,
  code: "500001",
  name: "Existing expenditure type",
};

const project: SegmentData = {
  segmentName: "project",
  code: "P100000001",
  name: "First project",
  default: "0000000000",
  isValid: false,
  glPostingDepartmentCode: organization.code,
};

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  server.resetHandlers();
  server.use(
    http.get("/api/ppmsearch/project", () => HttpResponse.json([project])),
    http.get("/api/ppmsearch/tasksByProject", () => HttpResponse.json([])),
    http.get("/api/ppmsearch/organization", () =>
      HttpResponse.json([existingOrganization, organization])
    ),
    http.get("/api/ppmsearch/defaultExpenditureType", () =>
      HttpResponse.json([])
    ),
    http.get("/api/ppmsearch/expenditureType", () =>
      HttpResponse.json([expenditureType, existingExpenditureType])
    )
  );
});
afterAll(() => server.close());

const renderEntry = (
  initialOrganization?: SegmentData,
  initialExpenditureType?: SegmentData
) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const Harness = () => {
    const [segments, setSegments] = React.useState(() => ({
      ...buildInitialPpmSegments(),
      ...(initialOrganization ? { organization: initialOrganization } : {}),
      ...(initialExpenditureType
        ? { expenditureType: initialExpenditureType }
        : {}),
    }));

    return (
      <>
        <PpmEntry
          segments={segments}
          setSegment={(name, value) =>
            setSegments((current) => ({ ...current, [name]: value }))
          }
        />
        <output data-testid="organization-state">
          {JSON.stringify(segments.organization)}
        </output>
        <output data-testid="project-state">
          {JSON.stringify(segments.project)}
        </output>
        <output data-testid="expenditure-type-state">
          {JSON.stringify(segments.expenditureType)}
        </output>
      </>
    );
  };

  render(
    <QueryClientProvider client={client}>
      <Harness />
    </QueryClientProvider>
  );

  return { client, user: userEvent.setup() };
};

const readOrganization = (): SegmentData =>
  JSON.parse(screen.getByTestId("organization-state").textContent || "{}");

const readExpenditureType = (): SegmentData =>
  JSON.parse(screen.getByTestId("expenditure-type-state").textContent || "{}");

const selectProject = async (
  user: ReturnType<typeof userEvent.setup>,
  selectedProject = project
) => {
  const input = screen.getByPlaceholderText("Search for project...");
  await user.clear(input);
  await user.type(input, selectedProject.code);
  await user.click(
    await screen.findByRole("option", {
      name: new RegExp(selectedProject.code),
    })
  );
  await waitFor(() => {
    expect(
      JSON.parse(screen.getByTestId("project-state").textContent || "{}")
    ).toMatchObject({ code: selectedProject.code, isValid: true });
  });
};

const waitForOrganizationLookup = async (client: QueryClient) => {
  await waitFor(() => {
    expect(
      client.getQueryState([
        "segments",
        ChartType.PPM,
        "organization",
        organization.code,
        "",
      ])?.status
    ).toBe("success");
    expect(client.isFetching()).toBe(0);
  });
};

const waitForDefaultExpenditureType = async (client: QueryClient) => {
  await waitFor(() => {
    expect(
      client.getQueryState(["defaultExpenditureType", project.code])?.status
    ).toBe("success");
    expect(client.isFetching()).toBe(0);
  });
};

describe("PPM project organization selection", () => {
  it("fills an empty organization with the exact matching code, name, and validity", async () => {
    const { user } = renderEntry();

    await selectProject(user);

    await waitFor(() => {
      expect(readOrganization()).toMatchObject({
        code: organization.code,
        name: organization.name,
        isValid: true,
      });
      expect(
        screen.getByPlaceholderText("Search for organization...")
      ).toHaveValue(organization.code);
      expect(screen.getByText(organization.name)).toBeInTheDocument();
    });
  });

  it.each([
    { state: "selected", initialOrganization: existingOrganization },
    {
      state: "partially typed",
      initialOrganization: { ...organization, code: "7", name: "" },
    },
  ])(
    "preserves an already $state organization",
    async ({ initialOrganization }) => {
      const { client, user } = renderEntry(initialOrganization);

      await selectProject(user);
      await waitFor(() => expect(client.isFetching()).toBe(0));

      expect(readOrganization()).toEqual(initialOrganization);
      expect(
        screen.getByPlaceholderText("Search for organization...")
      ).toHaveValue(initialOrganization.code);
    }
  );

  it.each([undefined, null, "", "   "])(
    "leaves organization empty when the project department code is %s",
    async (glPostingDepartmentCode) => {
      const organizationLookup = vi.fn(() => HttpResponse.json([organization]));
      server.use(
        http.get("/api/ppmsearch/project", () =>
          HttpResponse.json([{ ...project, glPostingDepartmentCode }])
        ),
        http.get("/api/ppmsearch/organization", organizationLookup)
      );
      const { client, user } = renderEntry();

      await selectProject(user);
      await waitFor(() => expect(client.isFetching()).toBe(0));

      expect(readOrganization()).toMatchObject({ code: "", isValid: false });
      expect(organizationLookup).not.toHaveBeenCalled();
    }
  );

  it("leaves organization empty when the search has no exact department match", async () => {
    server.use(
      http.get("/api/ppmsearch/organization", () =>
        HttpResponse.json([existingOrganization])
      )
    );
    const { client, user } = renderEntry();

    await selectProject(user);
    await waitForOrganizationLookup(client);

    expect(readOrganization()).toMatchObject({ code: "", isValid: false });
    expect(
      screen.getByPlaceholderText("Search for organization...")
    ).toHaveValue("");
  });

  it("preserves text entered while the department lookup is pending", async () => {
    let finishLookup!: () => void;
    const pendingLookup = new Promise<void>((resolve) => {
      finishLookup = resolve;
    });
    const organizationLookup = vi.fn(async () => {
      await pendingLookup;
      return HttpResponse.json([organization]);
    });
    server.use(http.get("/api/ppmsearch/organization", organizationLookup));
    const { client, user } = renderEntry();

    await selectProject(user);
    await waitFor(() => expect(organizationLookup).toHaveBeenCalledOnce());
    await user.type(
      screen.getByPlaceholderText("Search for organization..."),
      "7"
    );
    finishLookup();
    await waitForOrganizationLookup(client);

    expect(readOrganization()).toMatchObject({
      code: "7",
      name: "",
      isValid: false,
    });
    expect(
      screen.getByPlaceholderText("Search for organization...")
    ).toHaveValue("7");
  });

  it("ignores a delayed department result after another project is selected", async () => {
    const otherProject = {
      ...project,
      code: "P200000002",
      name: "Second project",
      glPostingDepartmentCode: null,
    };
    let finishLookup!: () => void;
    const pendingLookup = new Promise<void>((resolve) => {
      finishLookup = resolve;
    });
    const organizationLookup = vi.fn(async () => {
      await pendingLookup;
      return HttpResponse.json([organization]);
    });
    server.use(
      http.get("/api/ppmsearch/project", () =>
        HttpResponse.json([project, otherProject])
      ),
      http.get("/api/ppmsearch/organization", organizationLookup)
    );
    const { client, user } = renderEntry();

    await selectProject(user);
    await waitFor(() => expect(organizationLookup).toHaveBeenCalledOnce());
    await selectProject(user, otherProject);
    finishLookup();
    await waitForOrganizationLookup(client);

    expect(readOrganization()).toMatchObject({ code: "", isValid: false });
    expect(
      screen.getByPlaceholderText("Search for organization...")
    ).toHaveValue("");
  });
});

describe("PPM project default expenditure type", () => {
  beforeEach(() => {
    server.use(
      http.get("/api/ppmsearch/defaultExpenditureType", () =>
        HttpResponse.json([expenditureType])
      )
    );
  });

  it("uses the configured code and name alongside the project organization", async () => {
    const { user } = renderEntry();

    await selectProject(user);

    await waitFor(() => {
      expect(readExpenditureType()).toMatchObject({
        code: "599999",
        name: expenditureType.name,
        isValid: true,
      });
      expect(
        screen.getByPlaceholderText("Search for expenditureType...")
      ).toHaveValue("599999");
      expect(screen.getByText(expenditureType.name)).toBeInTheDocument();
      expect(readOrganization()).toMatchObject({
        code: organization.code,
        isValid: true,
      });
    });
  });

  it("leaves expenditure type empty when the backend returns no default", async () => {
    server.use(
      http.get("/api/ppmsearch/defaultExpenditureType", () =>
        HttpResponse.json([])
      )
    );
    const { client, user } = renderEntry();

    await selectProject(user);
    await waitForDefaultExpenditureType(client);

    expect(readExpenditureType()).toMatchObject({ code: "", isValid: false });
    expect(
      screen.getByPlaceholderText("Search for expenditureType...")
    ).toHaveValue("");
  });

  it.each([
    { state: "selected", initialExpenditureType: existingExpenditureType },
    {
      state: "partially typed",
      initialExpenditureType: {
        ...expenditureType,
        code: "5",
        name: "",
        isValid: false,
      },
    },
  ])(
    "preserves an already $state expenditure type without requesting a default",
    async ({ initialExpenditureType }) => {
      const defaultLookup = vi.fn(() => HttpResponse.json([expenditureType]));
      server.use(
        http.get("/api/ppmsearch/defaultExpenditureType", defaultLookup)
      );
      const { client, user } = renderEntry(undefined, initialExpenditureType);

      await selectProject(user);
      await waitFor(() => expect(client.isFetching()).toBe(0));

      expect(readExpenditureType()).toEqual(initialExpenditureType);
      expect(
        screen.getByPlaceholderText("Search for expenditureType...")
      ).toHaveValue(initialExpenditureType.code);
      expect(defaultLookup).not.toHaveBeenCalled();
    }
  );

  it("applies the expenditure default when the project has no department code", async () => {
    server.use(
      http.get("/api/ppmsearch/project", () =>
        HttpResponse.json([{ ...project, glPostingDepartmentCode: null }])
      )
    );
    const { client, user } = renderEntry();

    await selectProject(user);
    await waitForDefaultExpenditureType(client);

    expect(readExpenditureType()).toMatchObject({
      code: expenditureType.code,
      name: expenditureType.name,
      isValid: true,
    });
    expect(readOrganization()).toMatchObject({ code: "", isValid: false });
  });

  it("preserves text entered while the default expenditure lookup is pending", async () => {
    let finishLookup!: () => void;
    const pendingLookup = new Promise<void>((resolve) => {
      finishLookup = resolve;
    });
    const defaultLookup = vi.fn(async () => {
      await pendingLookup;
      return HttpResponse.json([expenditureType]);
    });
    server.use(
      http.get("/api/ppmsearch/defaultExpenditureType", defaultLookup)
    );
    const { client, user } = renderEntry();

    await selectProject(user);
    await waitFor(() => expect(defaultLookup).toHaveBeenCalledOnce());
    await user.type(
      screen.getByPlaceholderText("Search for expenditureType..."),
      "5"
    );
    finishLookup();
    await waitForDefaultExpenditureType(client);

    expect(readExpenditureType()).toMatchObject({
      code: "5",
      name: "",
      isValid: false,
    });
    expect(
      screen.getByPlaceholderText("Search for expenditureType...")
    ).toHaveValue("5");
  });

  it.each(["clearing", "changing"])(
    "ignores a delayed expenditure default after %s the project",
    async (action) => {
      const otherProject = {
        ...project,
        code: "P200000002",
        name: "Second project",
      };
      let finishLookup!: () => void;
      const pendingLookup = new Promise<void>((resolve) => {
        finishLookup = resolve;
      });
      const defaultLookup = vi
        .fn(async () => HttpResponse.json<SegmentData[]>([]))
        .mockImplementationOnce(async () => {
          await pendingLookup;
          return HttpResponse.json([expenditureType]);
        });
      server.use(
        http.get("/api/ppmsearch/project", () =>
          HttpResponse.json([project, otherProject])
        ),
        http.get("/api/ppmsearch/defaultExpenditureType", defaultLookup)
      );
      const { client, user } = renderEntry();

      await selectProject(user);
      await waitFor(() => expect(defaultLookup).toHaveBeenCalledOnce());
      if (action === "clearing") {
        await user.clear(screen.getByPlaceholderText("Search for project..."));
      } else {
        await selectProject(user, otherProject);
      }
      finishLookup();
      await waitForDefaultExpenditureType(client);

      expect(readExpenditureType()).toMatchObject({ code: "", isValid: false });
      expect(
        screen.getByPlaceholderText("Search for expenditureType...")
      ).toHaveValue("");
    }
  );

  it("refreshes a cached default before filling it on project reselection", async () => {
    const { client, user } = renderEntry();
    await selectProject(user);
    await waitForDefaultExpenditureType(client);
    expect(readExpenditureType().code).toBe(expenditureType.code);

    const defaultLookup = vi.fn(() => HttpResponse.json([]));
    server.use(
      http.get("/api/ppmsearch/defaultExpenditureType", defaultLookup)
    );
    await user.clear(
      screen.getByPlaceholderText("Search for expenditureType...")
    );
    await selectProject(user);
    await waitFor(() => expect(defaultLookup).toHaveBeenCalledOnce());
    await waitForDefaultExpenditureType(client);

    expect(readExpenditureType()).toMatchObject({ code: "", isValid: false });
    expect(
      screen.getByPlaceholderText("Search for expenditureType...")
    ).toHaveValue("");
  });
});
