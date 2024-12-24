import './globals.css';
import { inter } from './fonts';
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: 'UnderlayX AI - Text and Shapes behind Images',
  description: 'Create unique designs by adding text and shapes behind your images',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-[#0A0A0A]`}>
      <body className="min-h-screen bg-[#0A0A0A]">
        {children}
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
