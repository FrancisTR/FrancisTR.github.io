import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://francistr.github.io"),
  alternates: {
    canonical: "https://francistr.github.io",
  },
  title: "Francis Tran",
  description:
    "Francis Tran is a Full-Stack Developer with 4+ years of experience.",
  keywords:
    "Software Engineer, Full-Stack Developer, Web Development, Machine Learning, AI",
  openGraph: {
    locale: "en_US",
    siteName: "Francis Tran",
    type: "website",
    title: "Francis Tran",
    description:
      "Francis Tran is a Full-Stack Developer with 4+ years of experience.",
    url: "https://francistr.github.io",
    images: [
      {
        url: "/GreatBall.png",
        width: 1200,
        height: 630,
        alt: "Francis Tran - Full-Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Francis Tran",
    description: "Francis Tran is a Full-Stack Developer with 4+ years of overall professional experience.",
    images: ["/GreatBall.png"],
  },
  other: {
    "theme-color": "#005da8",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }} className="scroll-smooth dark">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
