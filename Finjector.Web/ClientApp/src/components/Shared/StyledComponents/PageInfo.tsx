import React from "react";

interface PageInfoProps extends React.HTMLAttributes<HTMLDivElement> {}

const PageInfo: React.FC<PageInfoProps> = ({ children, className }, props) => {
  if (!children) {
    return null;
  }
  let divClassName = `page-info mb-3 ${className}`;
  return (
    <div {...props} className={divClassName}>
      <p>{children}</p>
    </div>
  );
};

export default PageInfo;
