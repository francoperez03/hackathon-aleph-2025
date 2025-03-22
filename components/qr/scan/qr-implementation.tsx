import QrScanner from "@/components/qr/qr-scanner";
import { Html5QrcodeResult, QrcodeSuccessCallback } from "html5-qrcode";
import Html5QrcodePlugin from "@/components/qr/qr-scanner";
import ResultContainerPlugin from "@/components/qr/result-container";
import QRCodeGenerator from "@/components/qr/qr-generate";
import { useState } from "react";

export const FullQrComponent = () => {
  const [decodedResults, setDecodedResults] = useState<Html5QrcodeResult[]>([]);

  const onNewScanResult: QrcodeSuccessCallback = (
    decodedText,
    decodedResult
  ) => {
    console.log("App [result]", decodedResult);
    setDecodedResults((prev) => [...prev, decodedResult]);
  };
  return (
    <div style={{ backgroundColor: "black" }}>
      {decodedResults.length === 0 && (
        <Html5QrcodePlugin
          verbose={false}
          fps={30}
          qrbox={250}
          disableFlip={true}
          qrCodeSuccessCallback={onNewScanResult}
        />
      )}
      <ResultContainerPlugin results={decodedResults} />
      <QRCodeGenerator text={"textToQR"} />
    </div>
  );
};
