import React from "react";
import { Link } from "react-router-dom";

interface FinjectorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  to?: string; // when using it as a Link
  noMargin?: boolean; // removes the margin on the button
}

const FinjectorButton: React.FC<FinjectorButtonProps> = ({
  children,
  className,
  to,
  color,
  noMargin,
  ...props
}) => {
  // default className is "btn btn-new ms-1"
  // if color is provided, it will add "btn-{color}" e.g. "btn-warning"
  // if noMargin is true, it will remove "ms-1"
  // if className is provided, it will add that className
  const classNameString = `btn btn-new ${className ?? ""}${
    !!color ? ` btn-${color}` : ""
  }${noMargin ? "" : " ms-2"}`;

  if (!!to) {
    return (
      <Link to={to} className={classNameString}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classNameString} {...props}>
      {children}
    </button>
  );
};

export default FinjectorButton;
