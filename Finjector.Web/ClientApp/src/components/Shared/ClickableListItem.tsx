import { useNavigate } from "react-router-dom";

interface Props extends React.LiHTMLAttributes<HTMLLIElement> {
  url: string;
}

const ClickableListItem = ({ url, className, children, ...props }: Props) => {
  const navigate = useNavigate();

  const onChartClick = (e: React.MouseEvent<HTMLLIElement>) => {
    // don't navigate if the user was just selecting text
    const selection = window.getSelection();

    if (selection && selection.toString()) return;

    // we don't want to navigate if they clicked a link or icon button
    const tagName = (e.target as HTMLElement)?.tagName.toLowerCase();

    const isActionTag =
      tagName === "a" || tagName === "svg" || tagName === "path";

    if (!isActionTag) {
      navigate(url);
    }
  };

  return (
    <li
      className={`saved-list-item row-link is-default ${className}`}
      onClick={onChartClick}
      {...props} // Pass additional props like onMouseEnter
    >
      {children}
    </li>
  );
};

export default ClickableListItem;
