import './globals.css';
import { inter } from './fonts';
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: 'UnderlayX: Creativity Made Effortless',
  description: 'Bring your ideas to life with UnderlayX AI—add text and shapes behind objects, create glowing effects, and customize stunning visuals effortlessly, all with professional-grade quality.',
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
    <html lang="en" className="bg-[#0A0A0A]">
      <body className={`${inter.className} bg-[#0A0A0A] min-h-screen`}>
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
