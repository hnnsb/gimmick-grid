import {FC} from "react";

interface QrCodeProps {
  url: string;
  size?: number;
}

const QrCode: FC<QrCodeProps> = ({url, size = 128}) => {
  return null;
  // return <QRCodeSVG value={url} size={size}/>;
};

export default QrCode;
