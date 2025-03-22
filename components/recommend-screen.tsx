"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRScannerModal } from "./qr/qr-scanner-modal";
import QRCodeGenerator from "./qr/qr-generate";
import { MiniKit } from "@worldcoin/minikit-js";

interface RecommendProps {
  setActiveScreen: (screen: "home" | "connection" | "recommend") => void;
}

export function Recommend({ setActiveScreen }: RecommendProps) {
  const [address, setAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address) {
      setShowModal(true);
    }
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      setShowModal(false);
      setAddress("");
      setConfirmed(false);
      setActiveScreen("home");
    }, 2000);
  };

  return (
    <motion.div
      className="relative flex h-full w-full flex-col items-center justify-center px-6 pt-16 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Button */}
      <button
        className="absolute top-6 left-6 flex items-center text-[#0088cc] hover:text-[#0077b3] transition"
        onClick={() => setActiveScreen("home")}
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#333]">Recommend a User</h1>
        <p className="mt-1 text-xs text-[#666]">
          Invite to the private network
        </p>
      </div>

      <form className="mb-8 w-full max-w-xs" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="mb-2 block text-xs font-medium text-[#666]">
            WALLET ADDRESS
          </label>
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x... or .sol address"
              className="w-full rounded-lg border border-[#ddd] bg-white p-4 text-sm text-[#333] placeholder-[#aaa] focus:border-[#0088cc] focus:outline-none"
            />
            {address && (
              <button
                type="button"
                onClick={() => setAddress("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#999] hover:bg-[#f5f5f5]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <label
            className="cursor-pointer underline"
            onClick={() => setShowQRScanner(true)}
          >
            or scan a QR code
          </label>
          <QRScannerModal
            isOpen={showQRScanner}
            onScan={(address: `0x${string}`) => {
              console.log("Address: ", address);
              setAddress(address);
              setShowQRScanner(false);
            }}
          />
          <p className="mt-2 text-xs text-[#999]">
            The user will receive an invite to join WPN
          </p>
        </div>

        <Button
          type="submit"
          disabled={!address}
          className="w-full bg-[#0088cc] py-4 text-lg font-medium text-white hover:bg-[#0077b3] disabled:bg-[#ccc]"
        >
          Recommend
        </Button>
      </form>

      <AnimatePresence>
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 px-4 pb-6"
            onClick={() => !confirmed && setShowModal(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-xl border border-[#ddd] bg-white p-6 shadow-lg"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {confirmed ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0088cc]">
                    <Check className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#333]">
                    Recommendation Sent!
                  </h3>
                  <p className="mt-2 text-center text-sm text-[#666]">
                    Your invitation has been sent successfully
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-center">
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f9ff]">
                      <User className="h-5 w-5 text-[#0088cc]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#333]">
                        Confirm Recommendation
                      </h3>
                      <p className="text-sm text-[#666]">
                        This will use 1 invite credit
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 rounded-lg border border-[#eee] bg-[#f9f9f9] p-3">
                    <p className="text-sm font-medium text-[#333]">{address}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-[#ddd] bg-transparent text-[#666] hover:bg-[#f5f5f5]"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-[#0088cc] text-white hover:bg-[#0077b3]"
                      onClick={handleConfirm}
                    >
                      Confirm
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
