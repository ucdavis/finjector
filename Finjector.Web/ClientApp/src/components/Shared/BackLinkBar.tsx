import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import FinjectorLinkButton from "./FinjectorLinkButton";

interface Props {
  children?: React.ReactNode;
}

export const BackLinkBar = ({ children }: Props) => {
  const navigate = useNavigate();
  const goBack = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate(-1);
  };

  return (
    <>
      <FinjectorLinkButton onClick={goBack} className="back-link">
        <FontAwesomeIcon icon={faArrowLeft} />
        {children ? children : "Back"}
      </FinjectorLinkButton>
    </>
  );
};
