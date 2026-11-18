import React from "react";

interface DetailsRowProps extends React.HTMLAttributes<HTMLDivElement> {
  headerColText: React.ReactNode;
  column2: React.ReactNode;
  column3?: React.ReactNode;
}

export const DetailsRow: React.FC<DetailsRowProps> = ({
  headerColText,
  column2,
  column3,
  ...props
}) => {
  return (
    <div className="row shade-hover-row text-break" {...props}>
      <dt className="col-sm-3 chartstring-info-title">{headerColText}</dt>
      <dd
        className={`${column3 ? "col-sm-3 col-md-2" : "col-sm-9"} chartstring-details-info-right mb-0`}
      >
        {column2}
      </dd>
      {column3 && (
        <dd className="col-sm-6 col-md-7 chartstring-details-info-right mb-0">
          {column3}
        </dd>
      )}
    </div>
  );
};
