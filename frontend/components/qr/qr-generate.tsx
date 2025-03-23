// components/QRCodeGenerator.tsx
import React, { useEffect, useMemo, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { cn } from "@/lib/utils";

type QRCodeGeneratorProps = {
  data: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  className?: string;
};

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  data,
  className,
  size = 250,
}) => {
  const ref = useRef(null);
  const qrCode = useMemo(
    () =>
      new QRCodeStyling({
        type: "canvas",
        shape: "square",
        width: size,
        height: size,
        data: data,
        dotsOptions: {
          color: "#4267b2",
          type: "rounded",
        },
      }),
    []
  );

  useEffect(() => {
    if (!ref.current) return;

    qrCode.append(ref.current);
  }, [qrCode]);

  return (
    <div
      className={cn("p-4 inline-block border bg-white rounded-md", className)}
    >
      <div ref={ref} />
    </div>
  );
};
