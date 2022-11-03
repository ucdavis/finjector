import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export const HomeLink = (props: Props) => {
  return (
    <Link className="back-link" to="/">
      <FontAwesomeIcon icon={faArrowLeft} />
      {props.children}
    </Link>
  );
};
