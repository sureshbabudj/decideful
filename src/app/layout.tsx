import type { Metadata } from "next";
import { Spline_Sans, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/lib/store/app-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const splineSans = Spline_Sans({
  variable: "--font-spline-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Decideful",
  description: "A platform for making and tracking decisions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/x-icon"
          href="data:image/svg+xml;base64,PHN2ZwogIGZpbGw9Im5vbmUiCiAgdmlld0JveD0iMCAwIDQ4IDQ4IgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKPgogIDxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF82XzUzNSkiPgogICAgPHBhdGgKICAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgICBkPSJNNDcuMjQyNiAyNEwyNCA0Ny4yNDI2TDAuNzU3MzU1IDI0TDI0IDAuNzU3MzU1TDQ3LjI0MjYgMjRaTTEyLjI0MjYgMjFIMzUuNzU3NEwyNCA5LjI0MjY0TDEyLjI0MjYgMjFaIgogICAgICBmaWxsPSJjdXJyZW50Q29sb3IiCiAgICAgIGZpbGwtcnVsZT0iZXZlbm9kZCIKICAgIC8+CiAgPC9nPgogIDxkZWZzPgogICAgPGNsaXBQYXRoIGlkPSJjbGlwMF82XzUzNSI+CiAgICAgIDxyZWN0IGZpbGw9IndoaXRlIiBoZWlnaHQ9IjQ4IiB3aWR0aD0iNDgiIC8+CiAgICA8L2NsaXBQYXRoPgogIDwvZGVmcz4KPC9zdmc+"
        />
      </head>
      <body
        className={`${splineSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider user={null}>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
