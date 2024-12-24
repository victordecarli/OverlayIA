import './globals.css';
import { inter } from './fonts';
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: 'UnderlayX - Text and Shapes behind Images',
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
      </body>
    </html>
  );
}
