"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { useCallback } from "react";
import { requestService } from "@/services/vpn-service-transactions";
import ConnectionHeader from "../connection/connection-header";
import { useRouter } from "next/navigation";

export default function VpnExpired() {
  const router = useRouter();

  const onBuyClick = useCallback(() => {
    requestService({ countryId: 1 });
  }, []);

  return (
    <motion.div
      className="relative flex h-full w-full flex-col items-center px-6 pt-16 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ConnectionHeader onBack={() => router.push("/")} />
      <div className="w-full max-w-xs flex flex-col items-center text-center mb-6">
        <h1 className="text-xl font-bold text-[#333]">Acquire VPN access</h1>
        <p className="mt-1 text-xs text-[#666]">
          Your access expired. Buy now and wait a few seconds to get access.
        </p>
      </div>

      <Button onClick={onBuyClick} variant="default" className="mt-4">
        Buy for 3USD
      </Button>
    </motion.div>
  );
}
