import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Remove Background from Image - UnderlayX',
  description: 'Easily remove image backgrounds with our powerful editor. Get a clean, transparent background for your images in seconds.',
  keywords: 'remove background, image background remover, transparent background, background removal tool, edit images online'
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
