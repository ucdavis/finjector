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
  // always has btn class, adds className if supplied
  // if color is supplied, adds btn-{color} class
  // if colorFill is false, adds btn-new class
  // if noMargin is false, adds me-3 class
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
