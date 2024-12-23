import './globals.css';
import { inter } from './fonts';

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
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
