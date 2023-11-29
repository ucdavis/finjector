import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface Props {
  children?: React.ReactNode;
}

export const BackLink = (props: Props) => {
  return (
    <Link to=".." className="back-link">
      <FontAwesomeIcon icon={faArrowLeft} />
      {props.children ? props.children : "Go Back"}
    </Link>
  );
};
