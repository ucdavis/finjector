import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
  backToId?: boolean; // for returning to, say, /teams/1 instead of /teams from /teams/1/create
}

export const BackLinkBar = (props: Props) => {
  return (
    <>
      <Link
        to=".."
        className="back-link"
        relative={props.backToId ? "path" : "route"}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        {props.children ? props.children : "Go Back"}
      </Link>
      <hr />
    </>
  );
};
