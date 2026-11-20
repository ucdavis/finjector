import { FinQueryStatus, TeamsResponseModel } from "../../types";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faUsers,
  faSitemap,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";
import ClickableListItem from "../Shared/ClickableListItem";
import { useFinQueryStatusHandler } from "../../util/error";
import FinFunError from "../Shared/LoadingAndErrors/FinFunError";
import FinEmpty from "../Shared/LoadingAndErrors/FinEmpty";

interface Props {
  teamsInfo: TeamsResponseModel[] | undefined;
  filter: string;
  queryStatus: FinQueryStatus;
}

const TeamList = (props: Props) => {
  const { teamsInfo, queryStatus } = props;

  const queryStatusComponent = useFinQueryStatusHandler({
    queryStatus,
  });

  if (queryStatusComponent)
    return (
      <div className="chartstring-details-info">{queryStatusComponent}</div>
    );
  // if query is complete, there are no errors, and still the data is undefined.
  // this shouldn't happen, but it makes the type checker happy. :)
  if (teamsInfo === undefined) return <FinFunError />;

  if (teamsInfo.length === 0)
    return (
      <FinEmpty title="You were not found to be a member of any teams.">
        This is definitely an error, as you should be a member of your own
        Personal team. Please refresh the page and try again. If the problem
        persists, please contact support.
      </FinEmpty>
    );

  const filterLowercase = props.filter.toLowerCase();

  const filteredTeamsInfo = teamsInfo.filter((teamInfo) => {
    return teamInfo.team.name.toLowerCase().includes(filterLowercase);
  });

  const list = (
    <ul className="list-group">
      {filteredTeamsInfo.map((teamInfo) => {
        const url = `/teams/${teamInfo.team.id}`;
        return (
          <ClickableListItem
            className="fin-row saved-list-item"
            key={teamInfo.team.id}
            url={url}
          >
            <div className="fin-info d-flex flex-wrap align-items-center">
              <div className="col-12 col-md-8 px-2 text-break">
                <h2 className="row-title h5">{teamInfo.team.name}</h2>
                <p className="row-subtitle">
                  <span style={{ wordWrap: "break-word" }}>
                    {teamInfo.team.description}
                  </span>
                </p>
              </div>
              <div className="col-12 col-md-4 d-flex flex-wrap justify-content-md-end mt-2 mt-md-0">
                <div className="stat-icon">
                  <FontAwesomeIcon
                    title="Folder count in team"
                    icon={faFolder}
                  />
                  {teamInfo.folderCount}{" "}
                </div>
                <div className="stat-icon">
                  <FontAwesomeIcon title="User count in team" icon={faUsers} />
                  {teamInfo.uniqueUserPermissionCount}
                </div>
                <div className="stat-icon">
                  <FontAwesomeIcon
                    title="Chart string count in team"
                    icon={faFileLines}
                  />

                  {teamInfo.chartCount}
                </div>
              </div>
            </div>
            <div className="fin-actions">
              <Link
                className="bold-link me-3 row-link-selected-action"
                to={url}
                aria-label={`Go to Team: ${teamInfo.team.name}`}
              >
                <FontAwesomeIcon icon={faSitemap} />
                Go to Team
              </Link>
            </div>
          </ClickableListItem>
        );
      })}
    </ul>
  );

  return (
    <>
      <div role="status">
        {props.filter && (filteredTeamsInfo.length
          ? `Matching teams: ${filteredTeamsInfo.length}`
          : "No teams match your search.")}
      </div>
      {list}
    </>
  );
};

export default TeamList;
