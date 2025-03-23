"use client";

import type React from "react";
import { useCallback, useState } from "react";
import { ArrowLeft, CopyIcon, ScanQrCodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { QRCodeGenerator } from "@/components/qr/qr-generate";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RecommendPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [receiveRecommendation, setReceiveRecommendation] = useState(true);
  const [to, setTo] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const onScan = useCallback(
    (result: IDetectedBarcode[]) => {
      setTo(result[0].rawValue);
      setShowScanner(false);
    },
    [setTo]
  );

  return (
    <div className="h-screen">
      {receiveRecommendation ? (
        <div className="flex flex-col h-full pt-10">
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold text-gray-800">
              Receive recommendations
            </h1>
            <div className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
              Receive recommendations to join the VPN network
            </div>

            <div className="flex items-center justify-center mt-6 relative w-min mx-auto">
              <span className="text-sm">0x729...6d1</span>
              <Button
                size="icon"
                variant="ghost"
                className="absolute -right-10 text-muted-foreground"
              >
                <CopyIcon className="mr-2 h-4 w-4" />
              </Button>
            </div>

            <QRCodeGenerator
              size={280}
              data="0x729b0d64181920eE2232A51E6572F2B80b73B6d1"
              className="mt-4"
            />
          </div>

          <div className="p-6 space-y-4">
            <Button
              className="w-full"
              size="lg"
              onClick={() => setReceiveRecommendation(false)}
            >
              Give recommendation
            </Button>

            <Button
              className="w-full"
              variant="outline"
              size="lg"
              onClick={() => router.push("/")}
            >
              Back
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full pt-10">
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold text-gray-800">
              Give recommendation
            </h1>
            <div className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
              Invite someone you trust. Their behavior may impact your service.
            </div>

            <div>
              <div className="px-4 relative">
                <Input
                  className="mt-6 h-10"
                  placeholder="0x..."
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  type="text"
                />
                <Button
                  variant="ghost"
                  onClick={() => setShowScanner(true)}
                  className="absolute top-0.5 right-2 text-muted-foreground"
                >
                  <ScanQrCodeIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <Dialog open={showScanner} onOpenChange={setShowScanner}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Scan</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you&apos;re
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-6 h-[400px]">
                  <Scanner onScan={onScan} />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="p-6 space-y-4">
            <Button className="w-full" size="lg">
              Recommend
            </Button>

            <Button
              className="w-full"
              variant="outline"
              size="lg"
              onClick={() => setReceiveRecommendation(false)}
            >
              Back
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
