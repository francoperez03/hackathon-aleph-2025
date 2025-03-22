import QRCodeScanner from "./qr-scanner";
import { isAddress } from "viem";

export const QRScannerModal = (props: {
  isOpen: boolean;
  onScan: (address: `0x${string}`) => void;
}) => {
  return (
    <>
      {props.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
            <QRCodeScanner
              verbose={false}
              fps={30}
              qrbox={250}
              disableFlip={true}
              qrCodeSuccessCallback={(resp) => {
                console.log("resp: ", resp);
                console.log("resp: ", isAddress(resp));

                if (isAddress(resp)) {
                  props.onScan(resp);
                }
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
