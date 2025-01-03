import './globals.css';
import { inter } from './fonts';
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from '@next/third-parties/google';


export const metadata = {
  title: 'UnderlayX | Add Text & Shapes Behind Images | Create Glowing Effects',
  description: 'Create stunning visuals by adding text behind images, placing shapes behind objects, and creating glowing effects. Free online tool for content creators, marketers & designers. No login required.',
  metadataBase: new URL('https://www.underlayx.com'),
  openGraph: {
    type: 'website',
    url: 'https://www.underlayx.com',
    title: 'UnderlayX | Add Text & Shapes Behind Images | Create Glowing Effects',
    description: 'Create stunning visuals by adding text behind images, placing shapes behind objects, and creating glowing effects. Perfect for content creators and designers.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UnderlayX | Add Text & Shapes Behind Images',
    description: 'Create stunning visuals by adding text behind images, placing shapes behind objects, and creating glowing effects. Free online tool for designers.',
    creator: '@underlayx',
    images: ['/og-image.png'],
    site: '@underlayx',
  },
  keywords: 'text behind image, shapes behind image, glowing text effect, image editor, photo editing, background text, layered text effects',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Remove preload links since we're using Next.js Image component with priority */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </head>
      <body className={`${inter.className} bg-[#0A0A0A] min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-LWYW0Q03ZL" />
    </html>
  );
}
