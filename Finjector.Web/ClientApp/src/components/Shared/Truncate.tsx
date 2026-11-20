import React, { useState } from "react";

interface TruncateProps {
  maxLength?: number;
  value?: string;
}

const Truncate: React.FC<TruncateProps> = ({ maxLength = 80, value = "" }) => {
  const [expanded, setExpanded] = useState(false);
  if (!value) {
    return null;
  }

  if (value.length <= maxLength) {
    return <>{value}</>;
  }

  const truncatedText = expanded ? value : value.toString().slice(0, maxLength);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  return (
    <button
      type="button"
      aria-expanded={expanded}
      className="border-0 bg-transparent p-0 text-start text-decoration-underline"
      onClick={handleClick}
    >
      {truncatedText}
      {!expanded && "..."}
    </button>
  );
};

export default Truncate;
