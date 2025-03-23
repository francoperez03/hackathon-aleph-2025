"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MiniKit } from "@worldcoin/minikit-js";
import { VpnService } from "@/services/vpnService";
import { PaymentStatus, VpnStatus } from "@/types";
import { requestService } from "@/services/vpnServiceTransactions";
import VpnExpired from "@/components/vpn/vpn-expired";
import VpnMissingRecs from "@/components/vpn/vpn-missing-recs";
import ConnectionHeader from "@/components/connection/connection-header";
import VpnChecking from "@/components/vpn/vpn-checking";
import VpnActive from "@/components/vpn/vpn-active";
import { useRouter } from "next/navigation";


export default function Connection() {
  const [vpnStatus, setVpnStatus] = useState<VpnStatus>("checking");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("success");
  const [remainingDays, setRemainingDays] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchVpnStatus = async () => {
      console.log(MiniKit.user);
      let address = MiniKit.user?.walletAddress;
      if (!address) {
        address = "0xc6351af7e9a0b6341bf9682488839cb0021f1fda";
      }

      const vpnService = new VpnService();
      const serviceId = 1n;

      try {
        const status = await vpnService.getVpnStatus(address, serviceId);

        if (status === "active") {
          const remaining = await vpnService.getRemainingDays(address);
          setRemainingDays(remaining);

          const start = new Date();
          const end = new Date();
          end.setDate(start.getDate() + remaining);
          setStartDate(start.toLocaleDateString());
          setEndDate(end.toLocaleDateString());

          const request = await requestService({ countryId: "1" });
          if (request?.finalPayload.status === "success") setVpnStatus(status);
        }
      } catch (err) {
        console.error("Error fetching VPN status:", err);
      }
    };

    const timeout = setTimeout(fetchVpnStatus, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const handlePayment = () => {
    setPaymentStatus("loading");
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3;
      if (isSuccess) {
        setPaymentStatus("success");
        setTimeout(() => setVpnStatus("active"), 2000);
      } else {
        setPaymentStatus("error");
        setTimeout(() => setPaymentStatus("idle"), 2000);
      }
    }, 2500);
  };

  const renderStatusComponent = () => {
    switch (vpnStatus) {
      case "checking":
        return <VpnChecking />;
      case "active":
        return (
          <VpnActive
            remainingDays={remainingDays}
            startDate={startDate}
            endDate={endDate}
            paymentStatus={paymentStatus}
          />
        );
      case "expired":
        return (
          <VpnExpired paymentStatus={paymentStatus} onPay={handlePayment} />
        );
      case "missing-recommendations":
        return <VpnMissingRecs address={MiniKit.user?.walletAddress ?? "0x"} />;
    }
  };

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
        <h1 className="text-3xl font-bold text-[#333]">VPN Status</h1>
        <p className="mt-1 text-xs text-[#666]">
          Check your current VPN access
        </p>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-xs text-center">
        {renderStatusComponent()}
      </div>
    </motion.div>
  );
}
