import './globals.css';
import { inter } from './fonts';
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from '@next/third-parties/google';


export const metadata = {
  title: 'Transform Your Images Like Never Before - UnderlayX',
  description: 'The ultimate tool to add text and shapes behind images, remove backgrounds, clone objects, change backgrounds, and create glowing effects effortlessly. Perfect for creators and designers.',
  metadataBase: new URL('https://www.underlayx.com'),
  openGraph: {
    type: 'website',
    url: 'https://www.underlayx.com',
    title: 'Transform Your Images Like Never Before - UnderlayX',
    description: 'Add text and shapes behind images, remove backgrounds, clone objects, change backgrounds, and create glowing effects. Elevate your visuals with UnderlayX.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UnderlayX | Transform Your Images Like Never Before',
    description: 'Add text and shapes behind images, remove backgrounds, clone objects, change backgrounds, and create glowing effects effortlessly. Try it now!',
    creator: '@underlayx',
    images: ['/og-image.png'],
    site: '@underlayx',
  },
  keywords: 'text behind image, shapes behind image, remove background, clone objects, change background, glowing text effect, image editor, photo editing, advanced image editor',
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
