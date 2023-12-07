import React from "react";

interface DetailsRowProps extends React.HTMLAttributes<HTMLDivElement> {
  header: string | null;
  children: React.ReactNode;
}

export const DetailsRow: React.FC<DetailsRowProps> = ({
  header,
  children,
  ...props
}) => {
  return (
    <div className="row" {...props}>
      <div className="col-3 coa-info-title">
        <h4>{header}</h4>
      </div>
      <div className="col-9 chartstring-details-info-right">{children}</div>
    </div>
  );
};
