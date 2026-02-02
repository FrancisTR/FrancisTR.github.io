import type { Metadata } from "next";
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
    "Francis Tran is a Full-Stack Engineer with 4+ years of experience.",
  keywords:
    "Software Engineer, Web Development, Game Development, Machine Learning, AI",
  openGraph: {
    locale: "en_US",
    siteName: "Francis Tran",
    type: "website",
    title: "Francis Tran",
    description:
      "Francis Tran is a Full-Stack Engineer with 4+ years of experience.",
    url: "https://francistr.github.io",
    // images: [
    //   {
    //     url: "./???",
    //   },
    // ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
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
