"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Lock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HomeProps {
  setActiveScreen: (screen: "home" | "connection" | "recommend") => void;
}

export function Home({ setActiveScreen }: HomeProps) {
  const [featureIndex, setFeatureIndex] = useState(0);
  const features = [
    { icon: <Lock className="h-6 w-6 text-[#0088cc]" />, title: "Privacy", text: "Stay anonymous, your data is yours." },
    { icon: <Zap className="h-6 w-6 text-[#0088cc]" />, title: "Speed", text: "Fast, stable, and unrestricted." },
    { icon: <Shield className="h-6 w-6 text-[#0088cc]" />, title: "Community", text: "A trusted network for digital freedom." },
  ];

  return (
    <motion.div
      className="relative flex h-full w-full flex-col items-center px-6 pt-12 pb-24 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        className="absolute top-6 right-6 flex items-center text-[#0088cc] hover:text-[#0077b3] transition"
        onClick={() => setActiveScreen("recommend")}
      >
        <UserPlus className="h-6 w-6" />
      </button>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6 text-center"
      >
        <h1 className="text-5xl font-bold tracking-tight text-[#333]">
          <span className="text-[#0088cc]">WPN</span>
        </h1>
        <p className="mt-2 text-sm text-[#666]">Access beyond borders</p>
      </motion.div>

      {/* Features Carousel */}
      <motion.div
        className="w-full max-w-xs mb-8 flex flex-col items-center text-center"
        key={featureIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-center w-14 h-14 bg-[#f5f9ff] rounded-full mb-3">
          {features[featureIndex].icon}
        </div>
        <h2 className="text-lg font-semibold text-[#333]">{features[featureIndex].title}</h2>
        <p className="text-sm text-[#666] mt-1">{features[featureIndex].text}</p>
      </motion.div>

      {/* Auto-slide for features */}
      <motion.div
        className="absolute bottom-28 flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        {features.map((_, i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${i === featureIndex ? "bg-[#0088cc]" : "bg-gray-300"}`}
            animate={{ scale: i === featureIndex ? 1.2 : 1 }}
          />
        ))}
      </motion.div>

      {/* Feature Rotation */}
      <motion.div
        className="absolute"
        animate={{ opacity: [1, 1, 0], x: [0, 0, -20] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
        onAnimationComplete={() => setFeatureIndex((prev) => (prev + 1) % features.length)}
      />

      {/* Call to Action */}
      <footer className="absolute bottom-0 w-full bg-white py-6 flex flex-col items-center shadow-md">
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
