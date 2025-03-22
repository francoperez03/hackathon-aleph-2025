"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import QRCodeGenerator from "../qr/qr-generate";

interface Props {
  address: string;
}

export default function VpnMissingRecs({ address }: Props) {
  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
        <Clock className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-bold text-[#333]">More Recommendations Needed</h3>
      <p className="text-sm text-[#666] mt-1">
        You need more recommendations to access the VPN.
      </p>
      <div>Get recommended!</div>
      <QRCodeGenerator text={address ?? "0x"} />
    </motion.div>
  );
}
