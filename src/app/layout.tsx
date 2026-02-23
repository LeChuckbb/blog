import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/src/app/_components/ThemeProvider";
import { ThemeToggle } from "@/src/app/_components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Github, FileText } from "lucide-react";

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

const GITHUB_URL = "https://github.com/LeChuckbb";

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
          <div className="xl:grid xl:grid-cols-[1fr_minmax(0,var(--content-max-width))_1fr] xl:min-h-screen">
            <header className="fixed top-0 left-0 right-0 z-50 h-[var(--nav-height)] bg-background/80 backdrop-blur-md border-b border-border xl:static xl:sticky xl:top-0 xl:col-start-1 xl:row-start-1 xl:h-screen xl:self-start xl:z-auto xl:bg-background xl:backdrop-blur-none xl:border-b-0 xl:border-r xl:border-border">
              {/* 모바일: 수평 배치 (xl 미만) */}
              <div className="xl:hidden mx-auto max-w-[var(--layout-max-width)] h-full px-4 md:px-6 flex items-center justify-between">
                <Link
                  href="/"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  LeChuck
                </Link>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={GITHUB_URL}
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
              {/* xl: 수직 배치, 중앙 정렬 */}
              <div className="hidden xl:flex xl:flex-col xl:h-full xl:p-6 xl:items-center">
                {/* 상단: 로고 + 테마 토글 (가로 나란히) */}
                <div className="flex items-center gap-2">
                  <Link
                    href="/"
                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    LeChuck
                  </Link>
                  <ThemeToggle />
                </div>
                {/* 네비게이션 링크 (아이콘 + 텍스트) */}
                <nav className="mt-8 flex flex-col gap-1">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    <FileText className="h-4 w-4" />
                    Posts
                  </Link>
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </nav>
              </div>
            </header>
            <main className="pt-[var(--nav-height)] xl:pt-0 xl:pl-8 xl:col-start-2 xl:col-span-2 xl:row-start-1">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
