"use client";

import { motion } from "framer-motion";
import { Loader } from "lucide-react";

export default function VpnChecking() {
  return (
    <motion.div
      className="flex flex-col items-center text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Loader className="h-10 w-10 animate-spin" />
      <p className="mt-3 text-sm">Checking your VPN access...</p>
    </motion.div>
  );
}
