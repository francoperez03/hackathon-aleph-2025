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
      <a
        className="mt-4 bg-primary text-white hover:bg-[#0077b3] flex items-center justify-center min-w-[220px] h-[50px] text-lg font-normal rounded-lg"
        href={`ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpZeGpsS0Z3dGltMWJhOXRvczByeDBO@3.91.104.137:35942/?outline=1"`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open VPN Portal
      </a>
      <p className="mt-3 text-sm">Checking your VPN access...</p>
    </motion.div>
  );
}
