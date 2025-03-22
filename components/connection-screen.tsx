"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConnectionProps {
  setActiveScreen: (screen: "home" | "connection" | "recommend") => void
}

export function Connection({ setActiveScreen }: ConnectionProps) {
  const [copied, setCopied] = useState(false)
  const vpnUrl = "wpn://connect.x8j2k9.wpn.network"

  const handleCopy = () => {
    navigator.clipboard.writeText(vpnUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-center px-6 pt-16 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#333]">URL</h1>
        <p className="mt-1 text-xs text-[#666]">Your secure connection</p>
      </div>

      <div className="mb-12 w-full max-w-xs">
        <div className="relative">
          <div className="flex items-center rounded-lg border border-[#ddd] bg-white p-4">
            <input
              type="text"
              value={vpnUrl}
              readOnly
              className="w-full bg-transparent text-sm text-[#333] focus:outline-none"
            />
            <button onClick={handleCopy} className="ml-2 rounded p-1 text-[#0088cc] hover:bg-[#f5f5f5]">
              {copied ? <span className="text-xs text-green-600">Copied!</span> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[#666]">Secure Connection</span>
            <a href="#" className="flex items-center text-[#0088cc] hover:text-[#0077b3]">
              <span className="mr-1">Details</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="mb-12 w-full max-w-xs">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-[#666]">TIME REMAINING</p>
          <p className="text-xs font-medium text-[#333]">78%</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#eee]">
          <div className="h-full bg-[#0088cc]" style={{ width: "78%" }} />
        </div>
        <div className="mt-1 flex justify-between text-xs text-[#999]">
          <span>0 days</span>
          <span>30 days</span>
        </div>
      </div>

      <div className="w-full max-w-xs">
        <Button
          className="w-full bg-[#0088cc] py-4 text-lg font-medium text-white hover:bg-[#0077b3]"
          onClick={() => setActiveScreen("recommend")}
        >
          Buy More
        </Button>
      </div>
    </motion.div>
  )
}

