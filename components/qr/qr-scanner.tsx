import { Html5QrcodeScanner, QrcodeSuccessCallback } from "html5-qrcode";
import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props: IHtml5QrCodePlugin): Html5QrcodeScannerConfig => {
  let config: Html5QrcodeScannerConfig = {
    fps: props.fps,
    qrbox: props.qrbox,
    aspectRatio: props.aspectRatio,
    disableFlip: props.disableFlip,
  };

  return config;
};

interface IHtml5QrCodePlugin {
  fps: number;
  qrbox: number;
  disableFlip: boolean;
  qrCodeSuccessCallback: QrcodeSuccessCallback;
  verbose: boolean;
  aspectRatio?: number;
}
const QRCodeScanner = (props: IHtml5QrCodePlugin) => {
  useEffect(() => {
    const config = createConfig(props);

    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      props.verbose
    );

    const scanCallback: QrcodeSuccessCallback = (decodedText, result) => {
      html5QrcodeScanner.pause();
      props.qrCodeSuccessCallback(decodedText, result);
    };
    html5QrcodeScanner.render(scanCallback, undefined);

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  return <div id={qrcodeRegionId} />;
};

export default QRCodeScanner;
