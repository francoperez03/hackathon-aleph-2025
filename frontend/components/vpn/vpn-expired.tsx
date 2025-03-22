"use client";

import { motion } from "framer-motion";
import { AlertCircle, Loader } from "lucide-react";

interface Props {
  paymentStatus: string;
  onPay: () => void;
}

export default function VpnExpired({ paymentStatus, onPay }: Props) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-bold text-[#333]">VPN Expired</h3>
      <p className="text-sm text-[#666] mt-1">You need to renew your VPN access.</p>

      <motion.button
        className="mt-4 text-white flex items-center justify-center min-w-[220px] h-[50px] text-lg font-normal rounded-lg"
        initial={{ backgroundColor: "#0088cc" }}
        animate={{
          backgroundColor:
            paymentStatus === "success"
              ? "#22c55e"
              : paymentStatus === "error"
              ? "#ef4444"
              : "#0088cc",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onClick={onPay}
        disabled={paymentStatus !== "idle"}
      >
        {paymentStatus === "idle" && <span>Buy More</span>}
        {paymentStatus === "loading" && (
          <>
            <Loader className="h-5 w-5 animate-spin mr-2" /> <span>Processing...</span>
          </>
        )}
        {paymentStatus === "success" && <span>Payment Successful</span>}
        {paymentStatus === "error" && <span>Transaction Failed</span>}
      </motion.button>
    </motion.div>
  );
}
