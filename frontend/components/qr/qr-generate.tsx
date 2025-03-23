// components/QRCodeGenerator.tsx
import React, { useEffect, useMemo, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

type QRCodeGeneratorProps = {
  text: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
};

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  text,
  size = 256
}) => {
  const ref = useRef(null);
  const qrCode = useMemo(
    () =>
      new QRCodeStyling({
        width: size,
        height: size,
        type: "svg",
        data: text,
        dotsOptions: {
          color: "#4267b2",
          type: "rounded",
        },
        backgroundOptions: {
          color: "#e9ebee",
        },
        imageOptions: {
          crossOrigin: "anonymous",
        },
      }),
    []
  );

  useEffect(() => {
    if (!ref.current) return;

    qrCode.append(ref.current);
  }, [qrCode]);

  return (
    <div className="p-4 rounded-2xl shadow-lg bg-gradient-to-br from-[#f5f9ff] to-[#dfeeff] inline-block">
      <div ref={ref} />
    </div>
  );
};

export default QRCodeGenerator;
