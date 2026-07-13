import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";

export const metadata = {
  title: "Buddy Script - Feed",
  description: "Social feed",
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/assets/images/logo-copy.svg",
    shortcut: "/assets/images/logo-copy.svg",
    apple: "/assets/images/logo-copy.svg",
  },
  openGraph: {
    title: "Buddy Script",
    description: "Social feed",
    siteName: "BuddyScript",
    type: "website",
    images: [
      {
        url: "/assets/images/logo-copy.svg",
        width: 20,
        height: 24,
        alt: "BuddyScript logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Buddy Script",
    description: "Social feed",
    images: ["/assets/images/logo-copy.svg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/assets/css/common.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link rel="stylesheet" href="/assets/css/responsive.css" />
        <link rel="stylesheet" href="/assets/css/feed-layout.css" />
      </head>
      <body>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
