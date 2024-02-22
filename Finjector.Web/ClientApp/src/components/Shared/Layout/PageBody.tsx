import React from "react";

interface PageBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const PageBody: React.FC<PageBodyProps> = ({ children, className }, props) => {
  if (!children) {
    return null;
  }
  let divClassName = `mb-3 ${className ?? ""}`;
  return (
    <div {...props} className={divClassName}>
      {children}
    </div>
  );
};

export default PageBody;
