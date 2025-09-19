import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import { SITE_NAME } from "@/lib/utils/static_data";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend" });

export const metadata: Metadata = {
  title: `${SITE_NAME} - Digital Decision Journal`,
  description: "Make better decisions through reflection",
  icons: {
    icon: "data:image/svg+xml;base64,PHN2ZwogIGZpbGw9Im5vbmUiCiAgdmlld0JveD0iMCAwIDQ4IDQ4IgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKPgogIDxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF82XzUzNSkiPgogICAgPHBhdGgKICAgICAgY2xpcC1ydWxlPSJldmVub2RkIgogICAgICBkPSJNNDcuMjQyNiAyNEwyNCA0Ny4yNDI2TDAuNzU3MzU1IDI0TDI0IDAuNzU3MzU1TDQ3LjI0MjYgMjRaTTEyLjI0MjYgMjFIMzUuNzU3NEwyNCA5LjI0MjY0TDEyLjI0MjYgMjFaIgogICAgICBmaWxsPSJjdXJyZW50Q29sb3IiCiAgICAgIGZpbGwtcnVsZT0iZXZlbm9kZCIKICAgIC8+CiAgPC9nPgogIDxkZWZzPgogICAgPGNsaXBQYXRoIGlkPSJjbGlwMF82XzUzNSI+CiAgICAgIDxyZWN0IGZpbGw9IndoaXRlIiBoZWlnaHQ9IjQ4IiB3aWR0aD0iNDgiIC8+CiAgICA8L2NsaXBQYXRoPgogIDwvZGVmcz4KPC9zdmc+",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lexend.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Toaster />
        </NextThemesProvider>
      </body>
    </html>
  );
}
