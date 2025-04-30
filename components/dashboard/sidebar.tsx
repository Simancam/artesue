"use client"

import type * as React from "react"
import { Menu, House, Building } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSidebar } from "@/components/ui/sidebar"

interface NavItemProps {
  icon: React.ElementType
  href: string
  label: string
}

const NavItem = ({ icon: Icon, href, label }: NavItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
              isActive ? "bg-white shadow-sm" : "text-gray-500 hover:text-amber-400 hover:bg-gray-100",
            )}
          >
            <Icon className={cn("h-5 w-5", isActive ? "text-amber-400" : "")} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function AppSidebar() {
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar collapsible="none" className="w-16 border-r bg-gray-100 h-full flex-shrink-0">
      <SidebarContent className="flex flex-col items-center gap-6 pb-4 pt-0">
        <div
          className="flex h-14 w-full cursor-pointer items-center justify-center bg-amber-400 text-white hover:bg-amber-400/90"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </div>

        <div className="flex flex-col items-center gap-6">
          <NavItem icon={House} href="/propiedades" label="Propiedades" />
          <NavItem icon={Building} href="/sedes" label="Sedes" />
        </div>
      </SidebarContent>
    </Sidebar>
  )
}