"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "DM Sans, sans-serif",
            fontSize: "14px",
            borderRadius: "10px",
            border: "0.5px solid rgba(0,0,0,0.1)",
            boxShadow: "none",
          },
          success: { iconTheme: { primary: "#1D9E75", secondary: "#fff" } },
        }}
      />
      {children}
    </SessionProvider>
  );
}
