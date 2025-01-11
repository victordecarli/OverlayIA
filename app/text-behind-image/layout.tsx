import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Text Behind Image - UnderlayX',
  description: 'Add text behind your images with our easy-to-use editor. Perfect for creating unique designs and compositions.',
  keywords: 'text behind image, image text editor, text overlay, image text tool'
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
