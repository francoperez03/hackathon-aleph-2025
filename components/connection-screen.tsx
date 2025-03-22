"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  AlertCircle,
  Clock,
  Loader,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type VpnStatus = "active" | "expired" | "missing-recommendations" | "checking";
type PaymentStatus = "idle" | "loading" | "success" | "error";

interface ConnectionProps {
  setActiveScreen: (screen: "home" | "connection" | "recommend") => void;
}

export function Connection({ setActiveScreen }: ConnectionProps) {
  const [vpnStatus, setVpnStatus] = useState<VpnStatus>("checking");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [remainingDays, setRemainingDays] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setTimeout(() => {
      const random = Math.random();
      let status: VpnStatus;

      if (random < 0.33) {
        status = "active";
        const daysLeft = Math.floor(Math.random() * 30) + 1;
        setRemainingDays(daysLeft);
        const start = new Date();
        const end = new Date();
        end.setDate(start.getDate() + daysLeft);
        setStartDate(start.toLocaleDateString());
        setEndDate(end.toLocaleDateString());
      } else if (random < 0.66) {
        status = "expired";
      } else {
        status = "missing-recommendations";
      }

      setVpnStatus(status);
    }, 2000);
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

  return (
    <motion.div
      className="relative flex h-full w-full flex-col items-center px-6 pt-16 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="absolute top-6 left-6 flex items-center text-[#0088cc] hover:text-[#0077b3] transition"
        onClick={() => setActiveScreen("home")}
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <div className="w-full max-w-xs flex flex-col items-center text-center mb-6">
        <h1 className="text-3xl font-bold text-[#333]">VPN Status</h1>
        <p className="mt-1 text-xs text-[#666]">
          Check your current VPN access
        </p>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow w-full max-w-xs text-center">
        {vpnStatus === "checking" && (
          <motion.div
            className="flex flex-col items-center text-[#0088cc]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Loader className="h-10 w-10 animate-spin" />
            <p className="mt-3 text-sm">Checking your VPN access...</p>
          </motion.div>
        )}
        {vpnStatus === "active" && (
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
            <p className="text-sm text-[#666] mt-1">
              Your VPN is currently active.
            </p>
            <div className="flex flex-col items-center mt-6 space-y-2">
              <p className="text-sm text-gray-600">
                Active from{" "}
                <span className="text-gray-900 font-medium">{startDate}</span>{" "}
                to <span className="text-gray-900 font-medium">{endDate}</span>
              </p>
              <div className="relative w-full max-w-sm h-4 bg-gray-200 rounded-full overflow-hidden">
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
                    width:
                      vpnStatus === "active"
                        ? "100%"
                        : `${(remainingDays / 30) * 100}%`,
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>
              <p className="text-base text-gray-700">
                <span className="font-medium">{remainingDays}</span> days
                remaining
              </p>
            </div>
            <Button
              className="mt-4 bg-[#0088cc] text-white hover:bg-[#0077b3] flex items-center justify-center min-w-[220px] h-[50px] text-lg font-normal rounded-lg"
              onClick={() => window.open("https://www.google.com", "_blank")}
            >
              <Link className="h-5 w-5 mr-2" />
              Open VPN Portal
            </Button>
          </motion.div>
        )}
        {vpnStatus === "expired" && (
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
            <p className="text-sm text-[#666] mt-1">
              You need to renew your VPN access.
            </p>

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
              onClick={handlePayment}
              disabled={paymentStatus !== "idle"}
            >
              {paymentStatus === "idle" && <span>Buy More</span>}
              {paymentStatus === "loading" && (
                <>
                  <Loader className="h-5 w-5 animate-spin mr-2" />{" "}
                  <span>Processing...</span>
                </>
              )}
              {paymentStatus === "success" && <span>Payment Successful</span>}
              {paymentStatus === "error" && <span>Transaction Failed</span>}
            </motion.button>
          </motion.div>
        )}
        {vpnStatus === "missing-recommendations" && (
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#333]">
              More Recommendations Needed
            </h3>
            <p className="text-sm text-[#666] mt-1">
              You need more recommendations to access the VPN.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
