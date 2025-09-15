"use client"

import { useAuth } from "@/hooks/useAuth"
import { BellIcon, UserIcon, ChevronDownIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MobileSidebar } from "@/components/MobileSidebar"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard"
      case "/history":
        return "Detection History"
      case "/alerts":
        return "Alert Management"
      case "/admin":
        return "System Administration"
      default:
        return "Smart Surveillance"
    }
  }

  return (
    <header className="h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center space-x-4">
        <MobileSidebar />
        <h1 className="text-lg md:text-xl font-semibold text-sidebar-foreground truncate">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-sidebar-foreground hover:text-sidebar-accent-foreground relative p-2"
        >
          <BellIcon className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
          >
            3
          </Badge>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-1 md:space-x-2 text-sidebar-foreground hover:text-sidebar-accent-foreground p-2"
            >
              <UserIcon className="h-5 w-5" />
              <span className="text-sm hidden sm:inline">{user?.username}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-card border-border" align="end">
            <DropdownMenuItem className="text-foreground hover:bg-muted">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-foreground hover:bg-muted">Preferences</DropdownMenuItem>
            <DropdownMenuItem onClick={logout} className="text-foreground hover:bg-muted">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
