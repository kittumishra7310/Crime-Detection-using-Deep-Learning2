"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ShieldIcon, ActivityIcon, HistoryIcon, AlertTriangleIcon, SettingsIcon, LogOutIcon } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"

const navigation = [
  { name: "Live Detection", href: "/dashboard", icon: ActivityIcon },
  { name: "History", href: "/history", icon: HistoryIcon },
  { name: "Alerts", href: "/alerts", icon: AlertTriangleIcon },
  { name: "Admin", href: "/admin", icon: SettingsIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [activeAlerts, setActiveAlerts] = useState(0)

  useEffect(() => {
    setActiveAlerts(2)
  }, [])

  return (
    <div className="hidden md:flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <ShieldIcon className="h-8 w-8 text-sidebar-primary" />
        <span className="ml-3 text-lg font-semibold text-sidebar-foreground">Smart Surveillance</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const showBadge = item.href === "/alerts" && activeAlerts > 0

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <div className="flex items-center">
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </div>
              {showBadge && (
                <Badge
                  variant="destructive"
                  className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                >
                  {activeAlerts}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={logout}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-sidebar-foreground rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOutIcon className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
