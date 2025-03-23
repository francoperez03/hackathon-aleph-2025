"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Lock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { executeTransaction } from "@/lib/execute-transaction";

interface HomeProps {
  setActiveScreen: (screen: "home" | "connection" | "recommend") => void;
}

  
const features = [
  {
    icon: <Lock className="h-6 w-6 text-[#0088cc]" />,
    title: "Privacy",
    text: "Stay anonymous, your data is yours.",
  },
  {
    icon: <Zap className="h-6 w-6 text-[#0088cc]" />,
    title: "Speed",
    text: "Fast, stable, and unrestricted.",
  },
  {
    icon: <Shield className="h-6 w-6 text-[#0088cc]" />,
    title: "Community",
    text: "A trusted network for digital freedom.",
  },
];

export function Home({ setActiveScreen }: HomeProps) {
  const [featureIndex, setFeatureIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative flex h-full w-full flex-col items-center px-6 pt-12 pb-28"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="ghost"
        className="absolute top-6 right-6 w-10 h-10 p-0 bg-[#0088cc] hover:bg-[#0077b3] text-white shadow-md rounded-md transition-transform active:scale-95"
        onClick={() => setActiveScreen("recommend")}
      >
        <UserPlus className="h-5 w-5" />
      </Button>
      <Button
        onClick={() => {
          executeTransaction().then((x) => console.log("result: ", x));
        }}
      >
        try send transaction
      </Button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mt-20 mb-10 text-center"
      >
        <h1 className="text-5xl font-bold tracking-tight text-[#0088cc]">
          WPN
        </h1>
        <p className="mt-2 text-sm text-[#666]">Access beyond borders</p>
      </motion.div>

      <div className="w-full max-w-xs flex flex-col items-center mt-14">
        <h2 className="text-base font-semibold text-[#333] mb-3">
          Why Choose WPN?
        </h2>

        <motion.div
          className="flex flex-col items-center text-center w-full max-w-xs"
          key={featureIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center w-14 h-14 bg-[#f5f9ff] rounded-full mb-4">
            {features[featureIndex].icon}
          </div>
          <h3 className="text-lg font-semibold text-[#333]">
            {features[featureIndex].title}
          </h3>
          <p className="text-sm text-[#666] mt-1">
            {features[featureIndex].text}
          </p>
        </motion.div>

        <div className="flex space-x-2 mt-60">
          {features.map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full transition ${
                i === featureIndex ? "bg-[#0088cc] scale-110" : "bg-gray-300"
              }`}
              animate={{ scale: i === featureIndex ? 1.2 : 1 }}
            />
          ))}
        </div>
      </div>

      <footer className="absolute bottom-0 w-full py-8 flex flex-col items-center shadow-md bg-gradient-to-t from-gray-100 to-transparent">
        <div className="w-full max-w-xs">
          <Button
            className="w-full bg-[#0088cc] py-6 text-lg text-white hover:bg-[#0077b3] shadow-lg transition-transform active:scale-95"
            onClick={() => setActiveScreen("connection")}
          >
            Connect Now
          </Button>
          <p className="text-xs text-center text-[#999] mt-3">
            Secure & fast access anywhere.
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
