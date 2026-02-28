import type { Metadata } from "next";
import localFont from "next/font/local";
import "@fontsource-variable/asta-sans";
import "./globals.css";
import "./callout.css";
import Link from "next/link";
import Image from "next/image";
import { ThemeProvider } from "@/src/app/_components/ThemeProvider";
import { ThemeToggle } from "@/src/app/_components/ThemeToggle";
import { ScrollToTop } from "@/src/app/_components/ScrollToTop";
import { Button } from "@/components/ui/button";
import { Github, FileText } from "lucide-react";
import { siteConfig } from "@/src/app/siteConfig";

const maruBuri = localFont({
  src: [
    {
      path: "./fonts/MaruBuri-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/MaruBuri-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-maruburi",
  display: "swap",
});

const d2Coding = localFont({
  src: "./fonts/D2Coding.woff2",
  variable: "--font-d2coding",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.title,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
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
        className={`${maruBuri.variable} ${d2Coding.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="xl:grid xl:grid-cols-[var(--sidebar-width)_1fr] xl:min-h-screen xl:max-w-[var(--layout-max-width)] xl:mx-auto">
            <header className="fixed top-0 left-0 right-0 z-50 h-[var(--nav-height)] bg-background/80 backdrop-blur-md border-b border-border xl:static xl:sticky xl:top-0 xl:col-start-1 xl:row-start-1 xl:h-screen xl:self-start xl:z-auto xl:bg-background xl:backdrop-blur-none xl:border-b-0 xl:border-r xl:border-border">
              {/* 모바일: 수평 배치 (xl 미만) */}
              <div className="xl:hidden mx-auto max-w-[var(--layout-max-width)] h-full px-4 md:px-6 flex items-center justify-between">
                <Link
                  href="/"
                  className={`${maruBuri.className} font-semibold text-primary hover:text-primary/80 transition-[color,transform] active:scale-95`}
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
              {/* xl: 수직 배치, 우측 정렬 */}
              <div className="hidden xl:flex xl:flex-col xl:h-full xl:py-6 xl:pl-6 xl:pr-6 xl:items-end">
                <div className="w-[160px] flex flex-col">
                  {/* 프로필 */}
                  <div className="flex items-center gap-2">
                    <Link
                      href="/"
                      className={`${maruBuri.className} text-lg font-semibold text-primary hover:text-primary/80 transition-[color,transform] active:scale-95`}
                    >
                      LeChuck
                    </Link>
                    <ThemeToggle />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    개발, 독서, 생각을 기록하는 공간
                  </p>
                  <div className="mt-3 overflow-hidden rounded-lg">
                    <Image
                      src="/og.jpg"
                      alt="LeChuck's Blog"
                      width={160}
                      height={160}
                      className="w-full h-auto"
                    />
                  </div>
                  {/* 네비게이션 */}
                  <nav className="mt-6 pt-6 border-t border-border flex flex-col gap-1">
                    <Link
                      href="/"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-[color,transform] py-1.5 px-2 rounded-md hover:bg-accent active:scale-[0.97]"
                    >
                      <FileText className="h-4 w-4" />
                      Posts
                    </Link>
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-[color,transform] py-1.5 px-2 rounded-md hover:bg-accent active:scale-[0.97]"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  </nav>
                </div>
              </div>
            </header>
            <main className="pt-[var(--nav-height)] xl:pt-0 xl:pl-16 xl:pr-10 xl:col-start-2 xl:row-start-1">
              {children}
            </main>
          </div>
          <footer className="border-t border-border mt-auto py-6 text-center text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {siteConfig.author.name}. All rights
              reserved.
            </p>
          </footer>
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
