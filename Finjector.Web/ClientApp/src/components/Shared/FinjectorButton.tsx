import React from "react";

interface FinjectorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  noMargin?: boolean;
  fill?: boolean; // fill the button with color. default to false, if true then btn-new is not applied
}

const FinjectorButton: React.FC<FinjectorButtonProps> = ({
  children,
  className,
  fill,
  ...props
}) => {
  const colorClassName = props.color ? `btn-${props.color}` : "";
  const noMarginClassName = props.noMargin ? "" : "me-3";
  const fillClassName = !fill ? "btn-new" : "";
  return (
    <button
      type="button"
      className={`btn ${fillClassName} ${className} ${colorClassName} ${noMarginClassName}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default FinjectorButton;
