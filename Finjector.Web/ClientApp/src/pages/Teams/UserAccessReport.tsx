import React from "react";
import { useParams } from "react-router-dom";
import FinButton from "../../components/Shared/FinButton";
import PageBody from "../../components/Shared/Layout/PageBody";
import PageTitle from "../../components/Shared/Layout/PageTitle";
import { FinError } from "../../components/Shared/LoadingAndErrors/FinError";
import { SearchBar } from "../../components/Shared/SearchBar";
import { UserAccessReportRow } from "../../models/reports/UserAccessReportRow";
import { useUserAccessReport } from "../../queries/accessReportQueries";
import { useFinQueryStatus, useFinQueryStatusHandler } from "../../util/error";

const columns = [
  "Team",
  "Folder",
  "User Name",
  "User Email",
  "Assigned Role",
  "Permission Source",
];

const rowValues = (row: UserAccessReportRow) => [
  row.teamName,
  row.folderName ?? "Team-level access",
  row.userName,
  row.userEmail,
  row.roleName,
  row.permissionSource,
];

const csvCell = (value: string) => {
  // Spreadsheet programs can interpret formulas after whitespace/control characters.
  // eslint-disable-next-line no-control-regex
  const safeValue = /^[\s\u0000-\u001f\u007f-\u009f]*[=+\-@]/.test(value)
    ? `'${value}`
    : value;
  return `"${safeValue.replace(/"/g, '""')}"`;
};

const UserAccessReport: React.FC = () => {
  const { teamId, folderId } = useParams();
  const [search, setSearch] = React.useState("");
  React.useEffect(() => setSearch(""), [teamId, folderId]);
  const reportQuery = useUserAccessReport(teamId, folderId);
  const queryStatusComponent = useFinQueryStatusHandler({
    queryStatus: useFinQueryStatus(reportQuery),
    DefaultError: (
      <FinError
        title="Unable to load user access report"
        errorText="The report could not be loaded. Refresh to try again."
      />
    ),
  });
  const rows = reportQuery.isSuccess ? reportQuery.data : [];
  const searchTerm = search.trim().toLocaleLowerCase();
  const filteredRows = rows.filter((row) =>
    rowValues(row).some((value) =>
      value.toLocaleLowerCase().includes(searchTerm)
    )
  );
  const userCount = new Set(filteredRows.map((row) => row.userId)).size;
  const firstRow = rows[0];
  const scope = folderId
    ? `Folder: ${firstRow?.folderName ?? folderId} · Team: ${
        firstRow?.teamName ?? teamId
      }`
    : teamId
    ? `Team: ${firstRow?.teamName ?? teamId}`
    : "All teams and folders you administer";

  const exportCsv = () => {
    if (
      reportQuery.isFetching ||
      !reportQuery.isSuccess ||
      !filteredRows.length
    )
      return;

    const csv = [columns, ...filteredRows.map(rowValues)]
      .map((values) => values.map(csvCell).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "user-access-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageTitle>
        <div className="col-12 col-md-8">
          <h1>User Access Report</h1>
        </div>
        <div className="col-12 col-md-4 text-end">
          <FinButton
            onClick={() => reportQuery.refetch()}
            disabled={reportQuery.isFetching}
          >
            {reportQuery.isFetching ? "Refreshing…" : "Refresh"}
          </FinButton>
          <FinButton
            onClick={exportCsv}
            disabled={
              reportQuery.isFetching ||
              !reportQuery.isSuccess ||
              !filteredRows.length
            }
          >
            Export CSV
          </FinButton>
        </div>
      </PageTitle>
      <PageBody>
        <p className="lead">{scope}</p>
        <p>
          Review access to the teams and folders you administer. Team
          permissions apply to every folder in that team. Direct and inherited
          permissions are shown separately; when a user has both, the highest
          role applies (Admin, then Edit, then View).
        </p>
        {queryStatusComponent ?? (
          <>
            <SearchBar
              ariaLabel="Search user access report"
              placeholderText="Search teams, folders, users, roles or permission sources"
              search={search}
              setSearch={setSearch}
            />
            <p role="status">
              {reportQuery.isFetching
                ? "Refreshing report…"
                : `${filteredRows.length} of ${
                    rows.length
                  } permission rows · ${userCount} ${
                    userCount === 1 ? "user" : "users"
                  }`}
            </p>
            {rows.length === 0 ? (
              <p>
                No user access to report for the teams or folders you
                administer.
              </p>
            ) : filteredRows.length === 0 ? (
              <p>No permissions match your search.</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <caption className="visually-hidden">
                    User access permissions for {scope}
                  </caption>
                  <thead>
                    <tr>
                      {columns.map((column) => (
                        <th key={column} scope="col">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, index) => (
                      <tr
                        key={`${row.teamId}-${row.folderId}-${row.userId}-${row.permissionSource}-${row.roleName}-${index}`}
                      >
                        {rowValues(row).map((value, columnIndex) => (
                          <td key={columns[columnIndex]}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </PageBody>
    </div>
  );
};
export default UserAccessReport;
