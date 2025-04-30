"use client";

import type * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function Navbar({ className, ...props }: NavbarProps) {
  const pathname = usePathname();

  const getTitleFromPath = (path: string) => {
    const routes: Record<string, string> = {
      "/": "Inicio",
      "/propiedades": "Propiedades",
      "/sedes": "Sedes",
    };

    return routes[path] || "Dashboard";
  };

  const title = getTitleFromPath(pathname);

  return (
    <div
      className={cn(
        "flex h-14 w-full items-center justify-between border-b bg-white px-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <div className="text-lg font-medium text-amber-400">{title}</div>
      </div>
    </div>
  );
}
