import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SoftwareScout — Find & Compare the Best Software Tools",
    template: "%s | SoftwareScout",
  },
  description:
    "Compare 621+ software tools across 29 categories. Find the perfect tool for your business with detailed comparisons, pricing, and reviews.",
  openGraph: {
    title: "SoftwareScout — Find & Compare the Best Software Tools",
    description:
      "Compare 621+ software tools across 29 categories. Find the perfect tool for your business.",
    url: "https://softwarescout.xyz",
    siteName: "SoftwareScout",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoftwareScout — Find & Compare the Best Software Tools",
    description:
      "Compare 621+ software tools across 29 categories.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geist.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
