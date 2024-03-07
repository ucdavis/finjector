import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Tooltip } from 'reactstrap';

interface CopyToClipboardProps {
  value: string;
  children: React.ReactNode;
  id: string;
}

const copyToClipboardDefaultMessage = 'copy to clipboard';

const CopyToClipboardHover: React.FC<CopyToClipboardProps> = ({
  value,
  children,
  id,
}) => {
  const [titleText, setTitleText] = useState<string>(
    copyToClipboardDefaultMessage,
  );
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    navigator.clipboard.writeText(value).then(() => {
      setTitleText('copied!');
      setTimeout(() => setTitleText(copyToClipboardDefaultMessage), 2000); // Reset title after 2 seconds
    });
  };

  const toggleTooltip = () => {
    if (!tooltipOpen) {
      setTooltipOpen(true);
      setIsHovering(true);
    } else {
      setTooltipOpen(false);
      setIsHovering(false);
    }
  };

  return (
    <div
      id={`copy-container-hover-${id}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className='copy-container-hover'
    >
      <div
        id={`copy-item-container-hover-${id}`}
        style={{ position: 'relative', display: 'inline-flex' }}
      >
        {children}
        <div
          id={`copy-button-hover-${id}`}
          style={{
            position: 'absolute',
            right: '-20px',
            top: 0,
            cursor: 'pointer',
            opacity: isHovering ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
          }}
          onClick={(e) => handleCopy(e)}
        >
          <FontAwesomeIcon icon={faCopy} />
        </div>
      </div>
      <Tooltip
        isOpen={tooltipOpen}
        toggle={toggleTooltip}
        placement='top'
        target={`copy-button-hover-${id}`}
      >
        {titleText}
      </Tooltip>
    </div>
  );
};

export default CopyToClipboardHover;
