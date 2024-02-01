import React from "react";
interface PageTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  isRow?: boolean;
}

const PageTitle: React.FC<PageTitleProps> = (
  { title, children, className, isRow = false },
  props
) => {
  if (!children && !title) {
    return null;
  }
  let divClassName = `page-title mb-3 pb-2 ${className ?? ""}`;

  if ((!title && Array.isArray(children) && children.length > 1) || isRow) {
    // this will not be applied if children is a single element (such as <h1>, <div>, <>) or if title is set
    // but if we have multiple elements, put them in a row and apply the correct styles
    divClassName += " row g-0 justify-content-between align-items-center";
  }

  return (
    <div {...props} className={divClassName}>
      {!!title ? <h1>{title}</h1> : children}
    </div>
  );
};

export default PageTitle;
