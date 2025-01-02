import './globals.css';
import { inter } from './fonts';
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from '@next/third-parties/google';


export const metadata = {
  title: 'UnderlayX: Creativity Made Effortless',
  description: 'Bring your ideas to life with UnderlayX. Add text and shapes behind objects, create glowing effects, and customize stunning visuals effortlessly, all with professional-grade quality.',
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
      <head />
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
