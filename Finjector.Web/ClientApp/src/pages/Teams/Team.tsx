import React from "react";
import { SearchBar } from "../../components/Shared/SearchBar";
import { useGetTeam } from "../../queries/teamQueries";
import { useParams } from "react-router-dom";
import FolderList from "../../components/Teams/FolderList";
import PageBody from "../../components/Shared/Layout/PageBody";
import { FinQueryStatus } from "../../types";
import TeamTitle from "../../components/Teams/TeamTitle";
import { useFinQueryStatus } from "../../util/error";

const Team: React.FC = () => {
  // get id from url
  const { teamId = "" } = useParams<{ teamId: string }>();

  const [search, setSearch] = React.useState("");

  const teamModelQuery = useGetTeam(teamId);

  const queryStatus: FinQueryStatus = useFinQueryStatus(teamModelQuery);

  const limitedTeam = teamModelQuery.data?.team.isPersonal; // personal teams are limited

  return (
    <div>
      <TeamTitle
        teamModelData={teamModelQuery.data}
        queryStatus={queryStatus}
        teamId={teamId}
      />
      <PageBody>
        {!limitedTeam && (
          <SearchBar
            placeholderText={
              teamModelQuery.data?.team.name
                ? `Search Within ${teamModelQuery.data?.team.name}`
                : "Search Within Team"
            }
            search={search}
            setSearch={setSearch}
          />
        )}
        <FolderList
          teamModel={teamModelQuery.data}
          filter={search}
          queryStatus={queryStatus}
        />
      </PageBody>
    </div>
  );
};

export default Team;
