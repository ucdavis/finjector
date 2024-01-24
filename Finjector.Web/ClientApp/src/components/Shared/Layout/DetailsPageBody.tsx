import React from "react";

interface DetailsPageBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const DetailsPageBody: React.FC<DetailsPageBodyProps> = (
  { children, className },
  props
) => {
  if (!children) {
    return null;
  }
  let divClassName = `mb-3 ${className}`;
  return (
    <div {...props} className={divClassName}>
      {children}
    </div>
  );
};

export default DetailsPageBody;
