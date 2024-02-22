import React from "react";
import { Link } from "react-router-dom";

interface FinButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  to?: string; // when using it as a Link
  margin?: boolean; // removes the margin on the button
  borderless?: boolean;
}

const FinButton: React.FC<FinButtonProps> = ({
  children,
  className,
  to,
  color,
  margin = true,
  borderless = false,
  ...props
}) => {
  // default className is "btn btn-finjector ms-1"
  // if color is provided, it will add "btn-{color}" e.g. "btn-warning"
  // if margin is false, it will remove "ms-2"
  // if className is provided, it will add that className
  const classNameString = `btn btn-finjector 
  ${className ?? ""}
  ${!!color ? ` btn-${color}` : ""} 
  ${margin ? " ms-2" : ""}
  ${borderless ? "btn-borderless" : ""}`;

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

export default FinButton;
