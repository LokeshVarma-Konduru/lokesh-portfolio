import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { personal } from "@/lib/data";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

/**
 * For the monogram alone. A high-contrast serif against the sans everything
 * else is set in is what makes three initials read as a mark rather than as
 * large text.
 */
const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
});

/**
 * Absolute URLs, which Open Graph requires — a relative image path is silently
 * dropped by every crawler. Vercel exposes the production domain at build time,
 * so a deployment needs no configuration; set NEXT_PUBLIC_SITE_URL to override
 * it once there is a custom domain.
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const title = `${personal.name} | ${personal.role}`;
const description =
  "Software Engineer with 3+ years building full-stack platforms, cloud-native microservices, and production-grade GenAI systems.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  authors: [{ name: personal.name, url: personal.linkedin }],
  creator: personal.name,
  keywords: [
    "Software Engineer",
    "Full-Stack Engineer",
    "Backend Engineer",
    "Distributed Systems",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Kubernetes",
    "LangChain",
    personal.name,
  ],
  openGraph: {
    type: "profile",
    siteName: personal.name,
    title,
    description,
    url: siteUrl,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${instrument.variable} h-full scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {/* Visitor counts, referrers and pages — no cookies, and it loads after
            everything else, so it cannot cost the hero any of its paint time. */}
        <Analytics />
      </body>
    </html>
  );
}
