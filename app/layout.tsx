import './globals.css';
import * as fonts from './fonts';

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
    <html lang="en" className={`
      ${fonts.inter.variable} 
      ${fonts.roboto.variable}
      ${fonts.poppins.variable}
      ${fonts.montserrat.variable}
      ${fonts.openSans.variable}
      ${fonts.raleway.variable}
      ${fonts.playfairDisplay.variable}
      ${fonts.oswald.variable}
      ${fonts.lato.variable}
      ${fonts.notoSans.variable}
      ${fonts.nunito.variable}
      ${fonts.workSans.variable}
    `}>
      <body>{children}</body>
    </html>
  );
}
