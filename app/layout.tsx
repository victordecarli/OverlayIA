import './globals.css';
import { inter } from './fonts';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = {
  title: 'Transform Your Images with Cloning, Text Behind, and Background Customization - UnderlayX',
  description: 'The ultimate tool to add text and shapes behind images, remove backgrounds, clone objects, change backgrounds, and create glowing effects effortlessly. Perfect for creators and designers.',
  metadataBase: new URL('https://www.underlayx.com'),
  openGraph: {
    type: 'website',
    url: 'https://www.underlayx.com',
    title: 'Transform Your Images with Cloning, Text Behind, and Background Customization - UnderlayX',
    description: 'Add text and shapes behind images, remove backgrounds, clone objects, change backgrounds, and create glowing effects. Elevate your visuals with UnderlayX.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UnderlayX | Transform Your Images with Cloning, Text Behind, and Background Customization',
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
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
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
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-LWYW0Q03ZL" />
    </html>
  );
}
