import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/src/app/_components/ThemeProvider";
import { ThemeToggle } from "@/src/app/_components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeChuck's Blog",
  description: "개발, 독서, 생각을 기록하는 공간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="fixed top-0 left-0 right-0 z-50 h-[var(--nav-height)] bg-background/80 backdrop-blur-md border-b border-border">
            <div className="mx-auto max-w-[var(--layout-max-width)] h-full px-4 md:px-6 flex items-center justify-between">
              <Link
                href="/"
                className="font-semibold text-foreground hover:text-foreground/80 transition-colors"
              >
                LeChuck
              </Link>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <Github className="h-[1.2rem] w-[1.2rem]" />
                  </a>
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </header>
          <div className="pt-[var(--nav-height)]">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
