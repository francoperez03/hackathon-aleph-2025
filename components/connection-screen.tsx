"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Power } from "lucide-react"

interface ConnectionProps {
  setActiveScreen: (screen: "home" | "connection" | "recommend") => void
}

export function Connection({ setActiveScreen }: ConnectionProps) {
  const [isActive, setIsActive] = useState(false)
  const [connectionState, setConnectionState] = useState(0)
  const [pulseCount, setPulseCount] = useState(0)

  const connectionStates = ["Finding connection...", "Waiting response...", "Establishing secure channel..."]

  useEffect(() => {
    if (isActive) {
      const stateInterval = setInterval(() => {
        setConnectionState((prev) => (prev + 1) % 3)
      }, 1000)

      const redirectTimer = setTimeout(() => {
        window.location.href = "wpn://open"

        setTimeout(() => {
          setIsActive(false) // Resetear estado al inicial
          setConnectionState(0)
        }, 500)
      }, 3000)

      return () => {
        clearInterval(stateInterval)
        clearTimeout(redirectTimer)
      }
    }
  }, [isActive])

  useEffect(() => {
    if (isActive) {
      const pulseInterval = setInterval(() => {
        setPulseCount((prev) => prev + 1)
      }, 800)

      return () => clearInterval(pulseInterval)
    }
  }, [isActive])

  const handleButtonClick = () => {
    setIsActive(true)
    setPulseCount(0)
  }

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex items-center justify-center mb-12">
        {/* Sonar animation rings */}
        <AnimatePresence>
          {isActive &&
            [...Array(3)].map((_, i) => (
              <motion.div
                key={`ring-${i}-${pulseCount}`}
                className="absolute rounded-full border-2 border-[#0088cc]"
                initial={{ width: 80, height: 80, opacity: 0.8 }}
                animate={{
                  width: [80, 200],
                  height: [80, 200],
                  opacity: [0.6, 0],
                  borderWidth: [2, 1],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  ease: "easeOut",
                }}
              />
            ))}
        </AnimatePresence>

        <motion.div whileTap={{ scale: 0.95 }} className="relative z-10">
          <Button
            className={`h-20 w-20 rounded-full transition-all duration-500 ${
              isActive ? "bg-[#0088cc] text-white" : "bg-white border-2 border-[#0088cc] text-[#0088cc]"
            }`}
            onClick={handleButtonClick}
            disabled={isActive}
          >
            <motion.div
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              className="w-10 h-10 flex items-center justify-center"
            >
              {/* Icono ON/OFF */}
              <Power className={`h-10 w-10 ${isActive ? "text-white" : "text-[#0088cc]"}`} />
            </motion.div>
          </Button>
        </motion.div>
      </div>

      {/* Status text */}
      <motion.div className="text-center" animate={{ opacity: isActive ? 1 : 0.7 }}>
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.p
              key={connectionState}
              className="text-[#0088cc] font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {connectionStates[connectionState]}
            </motion.p>
          ) : (
            <motion.p
              key="default-text"
              className="text-[#666] text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              Tap the button to connect
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
