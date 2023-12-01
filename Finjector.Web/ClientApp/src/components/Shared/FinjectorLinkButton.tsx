import React from "react";

interface LinkButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const FinjectorLinkButton: React.FC<LinkButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      role="link"
      className={`btn ${className} link-style`}
      {...props}
    >
      {children}
    </button>
  );
};

export default FinjectorLinkButton;
