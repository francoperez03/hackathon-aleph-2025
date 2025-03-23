"use client";

import { motion } from "framer-motion";
import { Check, Link } from "lucide-react";

interface Props {
  remainingDays: number;
  startDate: Date;
  endDate: Date;
  // paymentStatus: string;
}

export default function VpnActive({
  remainingDays,
  startDate,
  endDate,
  // paymentStatus,
}: Props) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
        <Check className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-bold text-[#333]">VPN is Active</h3>
      <p className="text-sm text-[#666] mt-1">Your VPN is currently active.</p>
      <div className="flex flex-col items-center mt-6 space-y-2">
        <p className="text-sm text-gray-600">
          Active from{" "}
          <span className="text-gray-900 font-medium">{startDate.toLocaleDateString()}</span> to{" "}
          <span className="text-gray-900 font-medium">{endDate.toLocaleDateString()}</span>
        </p>
        {/* <div className="relative w-full max-w-sm h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
            style={{ width: `${(remainingDays / 30) * 100}%` }}
            initial={{
              width:
                paymentStatus === "success"
                  ? "0%"
                  : `${(remainingDays / 30) * 100}%`,
            }}
            animate={{
              width: "100%",
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div> */}
        <p className="text-base text-gray-700">
          <span className="font-medium">{remainingDays}</span> days remaining
        </p>
      </div>
      <a
        className="mt-4 bg-primary text-white hover:bg-[#0077b3] flex items-center justify-center min-w-[220px] h-[50px] text-lg font-normal rounded-lg"
        href="https://www.google.com"
      >
        <Link className="h-5 w-5 mr-2" />
        Open VPN Portal
      </a>
    </motion.div>
  );
}
