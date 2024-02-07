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
import { FinError } from "../Shared/LoadingAndErrors/FinError";
import FinFunError from "../Shared/LoadingAndErrors/FinFunError";

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
  // if query is complete, there are no errors, and still there are no teams returned
  if (!teamsInfo || teamsInfo.length < 1) return <FinFunError />;

  const filterLowercase = props.filter.toLowerCase();

  const filteredTeamsInfo = teamsInfo.filter((teamInfo) => {
    return teamInfo.team.name.toLowerCase().includes(filterLowercase);
  });

  return (
    <ul className="list-group">
      {filteredTeamsInfo.map((teamInfo) => {
        const url = `/teams/${teamInfo.team.id}`;
        return (
          <ClickableListItem
            className="fin-row saved-list-item"
            key={teamInfo.team.id}
            url={url}
          >
            <div className="fin-info d-flex justify-content-between align-items-center">
              <div className="col-8 ms-2 me-auto">
                <h3 className="row-title">{teamInfo.team.name}</h3>
                <p className="row-subtitle">
                  <span style={{ wordWrap: "break-word" }}>
                    {teamInfo.team.description}
                  </span>
                </p>
              </div>
              <div className="col-4 d-flex justify-content-end">
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
};

export default TeamList;
