"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  ShieldIcon,
  ActivityIcon,
  HistoryIcon,
  AlertTriangleIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon, // Fixed import to use MenuIcon instead of Menu
} from "@/components/icons"
import { useAuth } from "@/hooks/useAuth"

const navigation = [
  { name: "Live Detection", href: "/dashboard", icon: ActivityIcon },
  { name: "History", href: "/history", icon: HistoryIcon },
  { name: "Alerts", href: "/alerts", icon: AlertTriangleIcon },
  { name: "Admin", href: "/admin", icon: SettingsIcon },
]

export function MobileSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)
  const activeAlerts = 2 // Mock alert count

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-6 w-6" /> {/* Updated to use MenuIcon */}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
        <div className="flex h-full flex-col">
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
                  onClick={() => setOpen(false)}
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
              onClick={() => {
                logout()
                setOpen(false)
              }}
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-sidebar-foreground rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <LogOutIcon className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
