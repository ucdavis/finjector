import React, { useState } from 'react';

interface TruncateProps {
  maxLength?: number;
  value?: string;
}

const Truncate: React.FC<TruncateProps> = ({ maxLength = 80, value = '' }) => {
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
    <span
      onClick={handleClick}
      style={{
        cursor: 'pointer',
      }}
    >
      {truncatedText}
      {!expanded && '...'}
    </span>
  );
};

export default Truncate;
