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
  // this is in the case that we pass in something like: View Admins {forTeamName}
  const isTitle =
    typeof children === "string" ||
    typeof children === "number" ||
    (Array.isArray(children) &&
      children.every((c) => typeof c === "string" || typeof c === "number"));

  if (Array.isArray(children) && children.length > 1 && !isTitle) {
    // this will not be applied if children is a single element (such as <h1>, <div>, <>) or a string(s)
    // but if we have multiple elements, put them in a row and apply the correct styles
    divClassName += " pb-2 row justify-content-between align-items-center";
  }

  return (
    <div {...props} className={divClassName}>
      {isTitle ? <h1>{children}</h1> : children}
    </div>
  );
};

export default PageTitle;
