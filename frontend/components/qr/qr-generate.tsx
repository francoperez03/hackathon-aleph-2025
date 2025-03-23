"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import QRCode from "react-qr-code";

type QRCodeGeneratorProps = {
  data: string;
  size?: number;
  className?: string;
};

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  data,
  className,
  size = 250,
}) => {
  return (
    <div
      className={cn("p-4 inline-block border bg-white rounded-md", className)}
    >
      <QRCode
        size={size}
        style={{ height: size, maxWidth: size, width: "100%" }}
        fgColor="#4267b2"
        value={data}
        viewBox={"0 0 256 256"}
      />
    </div>
  );
};
