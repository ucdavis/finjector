import { QRCodeSVG } from "qrcode.react";

interface DetailsQrCodeProps {
  chartSegmentString: string | undefined;
}

const DetailsQrCode = ({ chartSegmentString }: DetailsQrCodeProps) => {
  if (!chartSegmentString) {
    return null;
  }

  return (
    <div className="qr-code-container">
      <div className="qr-code-wrapper">
        <h5>Scan Chart String</h5>
        <QRCodeSVG
          value={chartSegmentString}
          size={200}
          level="M"
          includeMargin={true}
        />
        <p className="qr-code-url">{chartSegmentString}</p>
      </div>
    </div>
  );
};

export default DetailsQrCode;
