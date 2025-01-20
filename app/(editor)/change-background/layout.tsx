import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Change Background of Image - UnderlayX AI',
  description: 'Easily change the background of your images with our intuitive editor. Upload a new background and create stunning visuals in just a few clicks.',
  keywords: 'change background, image background editor, replace image background, background change tool, edit images online'
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
