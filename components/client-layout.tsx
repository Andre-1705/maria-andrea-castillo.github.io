"use client";

import type React from "react";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@/components/analytics";
import { Suspense } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <Suspense fallback={null}>
        <div className="relative min-h-screen bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black via-gray-950 to-black overflow-hidden">
          <div className="stars absolute inset-0 z-0"></div>
          <div className="absolute inset-0 bg-black/20 z-0"></div>
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Analytics />
          <Toaster />
        </div>
      </Suspense>
    </ThemeProvider>
  );
} 