import React from "react";
import { useGetSavedCharts } from "../queries/storedChartQueries";
import ImportListTeamRow from "../components/Import/ImportListTeamRow";
import { SearchBar } from "../components/Shared/SearchBar";
import PageTitle from "../components/Shared/StyledComponents/PageTitle";
import PageBody from "../components/Shared/StyledComponents/PageBody";

// Main landing screen for popup

const Import = () => {
  const [search, setSearch] = React.useState("");

  const teamGroups = useGetSavedCharts();

  const filterLowercase = search.toLowerCase();
  const filteredTeamsInfo = teamGroups.data?.filter((teamInfo) => {
    return teamInfo.team.name.toLowerCase().includes(filterLowercase);
  });

  return (
    <div>
      <PageTitle title="Import Team or Folder" />
      <PageBody>
        <SearchBar
          search={search}
          setSearch={setSearch}
          placeholderText="Search Teams or Folders to import"
        />
        <ul className="list-group">
          {filteredTeamsInfo?.map((teamGroup) => {
            return (
              <ImportListTeamRow
                key={teamGroup.team.id}
                teamGroup={teamGroup}
              />
            );
          })}
        </ul>
      </PageBody>
    </div>
  );
};

export default Import;
