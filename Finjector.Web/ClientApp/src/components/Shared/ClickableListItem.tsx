import React from "react";
import { useNavigate } from "react-router-dom";

interface Props extends React.LiHTMLAttributes<HTMLLIElement> {
  url: string;
}

const ClickableListItem = React.forwardRef<HTMLLIElement, Props>(
  ({ url, className, children, ...liProps }, ref) => {
    const navigate = useNavigate();

    const onChartClick = (e: React.MouseEvent<HTMLLIElement>) => {
      // don't navigate if the user was just selecting text
      const selection = window.getSelection();

      if (selection && selection.toString()) return;

      // we don't want to navigate if they clicked an interactive control
      const target = e.target as HTMLElement;

      const isActionTag = !!target.closest("a, button, input, label");

      if (!isActionTag) {
        navigate(url);
      }
    };

    return (
      <li
        {...liProps}
        ref={ref}
        className={`saved-list-item row-link is-default ${className}`}
        onClick={onChartClick}
      >
        {children}
      </li>
    );
  }
);

ClickableListItem.displayName = "ClickableListItem";

export default ClickableListItem;
