import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://android-vault.vercel.app"),
  title: "Android Vault | Premium Interview Prep",
  description: "The ultimate knowledge base and premium interview questions for modern Android Engineers. Master architecture, Compose, security, and more.",
  keywords: [
    "Android", "Interview", "Questions", "Kotlin",
    "Jetpack Compose", "Clean Architecture", "Coroutines", "FCM"
  ],
  authors: [{ name: "Android Vault Team" }],
  openGraph: {
    title: "Android Vault | Premium Interview Prep",
    description: "Master modern Android development with premium interview questions and deep-dive lessons.",
    url: "https://android-vault.vercel.app",
    siteName: "Android Vault",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Android Vault | Premium Interview Prep",
    description: "Master modern Android development with premium interview questions and deep-dive lessons.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary/30 selection:text-primary-100`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
