import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { siteConfig } from "@/config/siteConfig";
import { EdgeStoreProvider } from "@/lib/edgestore";

import type { Metadata } from "next";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "StudentSuccess",
    "NoteTaking",
    "AI",
    "Note-Taking App",
    "Student Notes-Hub",
    "Digital Notebooks",
    "PDF Annotation Tool",
    "AI-Powered Study",
    "Organized Learning",
    "Smart Study App",
    "College Note-Taking",
    "Study Aids",
    "Note-Taking Software",
    "Study Planner",
    "Educational Technology",
    "Student Productivity",
    "Mobile Note-Taking",
    "Study Tips",
    "Online Study Tools",
    "Study Resources",
    "Study Smarter",
    "Exam Preparation",
    "Cross-Platform Note-Taking",
  ],
  authors: [
    {
      name: "Nana A. Gaisie",
      url: "https://nana.enpeer.tech",
    },
  ],
  creator: "Nana A. Gaisie",
  metadataBase: new URL(`https://${process.env.VERCEL_URL}`),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "de-DE": "/de-DE",
      "en-GH": "/en-GB",
      "en-GB": "/en-GB",
    },
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage[0],
        width: 500,
        height: 500,
        alt: siteConfig.name,
      },
      {
        url: siteConfig.ogImage[1],
        width: 500,
        height: 500,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage[0], siteConfig.ogImage[1]],
    creator: "@nana.gaisie",
  },
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo/transparent-background/short-logo-dark.svg",
        href: "/logo/transparent-background/short-logo-dark.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo/transparent-background/short-logo.svg",
        href: "/logo/transparent-background/short-logo.svg",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ConvexClientProvider>
          <EdgeStoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="jotion-theme-2"
            >
              <Toaster position="bottom-center" />
              <ModalProvider />
              {children}
            </ThemeProvider>
          </EdgeStoreProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
