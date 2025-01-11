import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Clone Image - UnderlayX',
  description: 'Duplicate foreground images with our advanced editor. Add multiple clones, position them precisely, and create stunning designs effortlessly.',
  keywords: 'clone image, duplicate foreground, image cloning tool, edit images online, duplicate image editor'
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
