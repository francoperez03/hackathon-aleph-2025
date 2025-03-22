"use client"

import { HomeIcon, Globe, Users, Settings } from "lucide-react"

interface NavigationProps {
  activeScreen: "home" | "connection" | "recommend"
  setActiveScreen: (screen: "home" | "connection" | "recommend") => void
}

export function Navigation({ activeScreen, setActiveScreen }: NavigationProps) {
  const navItems = [
    { id: "home", icon: HomeIcon, label: "Home" },
    { id: "connection", icon: Globe, label: "URL" },
    { id: "recommend", icon: Users, label: "Invite" },
    // { id: "settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#eee] bg-white">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              className="relative flex flex-1 flex-col items-center justify-center py-2"
              onClick={() => item.id !== "settings" && setActiveScreen(item.id as any)}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-[#0088cc]" : "text-[#999]"}`} />
              <span className={`mt-1 text-xs ${isActive ? "text-[#0088cc]" : "text-[#999]"}`}>{item.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 h-1 w-5 -translate-x-1/2 rounded-t-full bg-[#0088cc]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

