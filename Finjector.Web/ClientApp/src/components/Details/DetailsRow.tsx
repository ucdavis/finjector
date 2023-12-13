import React from "react";

interface DetailsRowProps extends React.HTMLAttributes<HTMLDivElement> {
  headerColText: string | null;
  column2: React.ReactNode;
  column3?: React.ReactNode;
}

export const DetailsRow: React.FC<DetailsRowProps> = ({
  headerColText,
  column2,
  column3,
  ...props
}) => {
  const columns = !column3 ? ( // if only 2 columns
    <>
      <div className="col-9 chartstring-details-info-right">{column2}</div>
    </>
  ) : (
    // if 3
    <>
      <div className="col-3 col-md-2 chartstring-details-info-right">
        {column2}
      </div>
      <div className="col-6">
        <div className="chartstring-details-info-right">{column3}</div>
      </div>
    </>
  );

  return (
    <div className="row" {...props}>
      <div className="col-3 chartstring-info-title">
        <h4>{headerColText}</h4>
      </div>
      {columns}
    </div>
  );
};
