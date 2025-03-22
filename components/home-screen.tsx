"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Globe } from "lucide-react"
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
      className="flex h-full w-full flex-col items-center justify-center px-6 pt-16 pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-[#333]">
          <span className="text-[#0088cc]">WPN</span>
        </h1>
        <p className="mt-2 text-sm text-[#666]">Decentralized Private Network</p>
      </div>

      <div className="mb-12 w-full max-w-xs">
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
          className="w-full bg-[#0088cc] py-4 text-lg font-medium text-white hover:bg-[#0077b3]"
          onClick={() => setActiveScreen("connection")}
        >
          Connect
        </Button>
      </div>
    </motion.div>
  )
}

