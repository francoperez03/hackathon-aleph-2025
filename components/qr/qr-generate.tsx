// components/QRCodeGenerator.tsx
import React from "react";
import { QRCodeSVG } from "qrcode.react";

type QRCodeGeneratorProps = {
  text: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
};

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  text,
  size = 128,
  level = "H",
}) => {
  return (
    <div style={{padding: 10, background: "white"}}>
      <QRCodeSVG value={text} size={size} level={level} />
    </div>
  );
};

export default QRCodeGenerator;
