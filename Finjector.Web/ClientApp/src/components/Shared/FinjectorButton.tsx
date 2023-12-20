import React from "react";

interface FinjectorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  noMargin?: boolean;
  colorFill?: boolean; // fill the button with color. makes it colorfill, ha ha ha
}

const FinjectorButton: React.FC<FinjectorButtonProps> = ({
  children,
  className,
  color,
  colorFill,
  noMargin,
  ...props
}) => {
  const colorClassName = color ? `btn-${color}` : "";
  const noMarginClassName = noMargin ? "" : "ms-1";
  const colorFillClassName = !colorFill ? "btn-new" : "";
  return (
    <button
      type="button"
      className={`btn ${colorFillClassName} ${className} ${colorClassName} ${noMarginClassName}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default FinjectorButton;
