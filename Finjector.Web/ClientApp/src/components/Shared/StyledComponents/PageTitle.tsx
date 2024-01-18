import React from "react";
interface PageTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

const PageTitle: React.FC<PageTitleProps> = (
  { title, children, className },
  props
) => {
  if (!children && !title) {
    return null;
  }
  let divClassName = `page-title mb-3 ${className ?? ""}`;

  if (!title && Array.isArray(children) && children.length > 1) {
    // this will not be applied if children is a single element (such as <h1>, <div>, <>) or if title is set
    // but if we have multiple elements, put them in a row and apply the correct styles
    divClassName += " pb-2 row justify-content-between align-items-center";
  }

  return (
    <div {...props} className={divClassName}>
      {!!title ? <h1>{title}</h1> : children}
    </div>
  );
};

export default PageTitle;
