import React from "react";
import { Link } from "react-router-dom";

interface FinjectorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  to?: string; // when using it as a Link
  noMargin?: boolean; // removes the margin on the button
  colorFill?: boolean; // fill the button with color. makes it colorfill, ha ha ha
}

const FinjectorButton: React.FC<FinjectorButtonProps> = ({
  children,
  className,
  to,
  color,
  colorFill,
  noMargin,
  ...props
}) => {
  // default className is "btn btn-new ms-1"
  // if color is provided, it will add "btn-{color}" e.g. "btn-warning"
  // if colorFill is true, it will remove "btn-new" (which gives it the white bg, just "btn" is colored)
  // if noMargin is true, it will remove "ms-1"
  // if className is provided, it will add that className
  const classNameString = `btn ${className ?? ""} ${
    color ? `btn-${color}` : ""
  } ${colorFill ? "" : "btn-new"} ${noMargin ? "" : "ms-1"}`;

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
