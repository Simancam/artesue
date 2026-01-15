"use client"

import type React from "react";
import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/components/login/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "sonner"

function ProtectedDashboard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col w-full">
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </SidebarInset>
      </div>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ProtectedDashboard>{children}</ProtectedDashboard>
    </AuthProvider>
    
  );
}
