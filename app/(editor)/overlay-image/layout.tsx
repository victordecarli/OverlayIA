import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smart Image Overlay | UnderlayX AI',
  description: 'Easily blend and overlay images with AI. Create stunning visual compositions by seamlessly combining multiple images together.',
  openGraph: {
    title: 'Smart Image Overlay | UnderlayX AI',
    description: 'Easily blend and overlay images with AI. Create stunning visual compositions by seamlessly combining multiple images together.',
  },
};

export default function OverlayImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
