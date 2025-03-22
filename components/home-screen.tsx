"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Globe, Shield, Zap, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HomeProps {
  setActiveScreen: (screen: "home" | "connection" | "recommend") => void
}

const countries = [
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "Japan", code: "JP", flag: "🇯🇵" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "Singapore", code: "SG", flag: "🇸🇬" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
]

export function Home({ setActiveScreen }: HomeProps) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0])

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center px-6 pt-12 pb-24 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-[#333]">
          <span className="text-[#0088cc]">WPN</span>
        </h1>
        <p className="mt-2 text-sm text-[#666]">Decentralized Private Network</p>
      </div>

      {/* Hero section */}
      <div className="w-full max-w-xs mb-8">
        <div className="bg-[#f5f9ff] rounded-xl p-5 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-[#0088cc] rounded-full p-2">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-lg font-semibold text-[#333] mb-2">Secure Your Connection</h2>
          <p className="text-sm text-[#666] mb-4">Keep your data private and secure every time you connect</p>
        </div>
      </div>

      {/* Features */}
      <div className="w-full max-w-xs mb-8">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-[#eee] shadow-sm">
            <div className="flex items-center mb-2">
              <Lock className="h-4 w-4 text-[#0088cc] mr-2" />
              <span className="text-sm font-medium text-[#333]">Privacy</span>
            </div>
            <p className="text-xs text-[#666]">End-to-end encrypted connection</p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-[#eee] shadow-sm">
            <div className="flex items-center mb-2">
              <Zap className="h-4 w-4 text-[#0088cc] mr-2" />
              <span className="text-sm font-medium text-[#333]">Speed</span>
            </div>
            <p className="text-xs text-[#666]">High-speed global network</p>
          </div>
        </div>
      </div>

      <div className="mb-8 w-full max-w-xs">
        <p className="mb-2 text-xs font-medium text-[#666]">SELECT LOCATION</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between border-[#ddd] bg-white py-4 text-left text-[#333] hover:bg-[#f5f5f5]"
            >
              <div className="flex items-center">
                <Globe className="mr-2 h-4 w-4 text-[#0088cc]" />
                <span className="mr-1">{selectedCountry.flag}</span>
                <span>{selectedCountry.name}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-[#0088cc]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[240px] border-[#ddd] bg-white">
            {countries.map((country) => (
              <DropdownMenuItem
                key={country.code}
                className="cursor-pointer py-2 text-[#333] hover:bg-[#f5f5f5]"
                onClick={() => setSelectedCountry(country)}
              >
                <span className="mr-2">{country.flag}</span>
                {country.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full max-w-xs">
        <Button
          className="w-full bg-[#0088cc] py-6 text-xl font-bold text-white hover:bg-[#0077b3] shadow-md"
          onClick={() => setActiveScreen("connection")}
        >
          Enter
        </Button>
        <p className="text-xs text-center text-[#999] mt-3">By continuing, you agree to our <span className="text-[#0088cc]">Terms and Conditions</span></p>
      </div>
    </motion.div>
  )
}

