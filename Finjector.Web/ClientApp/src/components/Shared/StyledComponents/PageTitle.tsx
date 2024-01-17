import React from "react";

interface PageTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

const PageTitle: React.FC<PageTitleProps> = (
  { children, className },
  props
) => {
  if (!children) {
    return null;
  }
  let divClassName = `page-title mb-3 ${className ?? ""}`;
  if (Array.isArray(children) && children.length > 1) {
    // this will not be applied if children is a single element (such as <h1>, <div>, <>) or a string
    // but if we have multiple elements, put them in a row and apply to correct styles
    divClassName += " pb-2 row justify-content-between align-items-center";
  }
  return (
    <div {...props} className={divClassName}>
      {typeof children === "string" ? <h1>{children}</h1> : children}
    </div>
  );
};

export default PageTitle;
