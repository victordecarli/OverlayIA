import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Shapes Behind Image - UnderlayX AI',
  description: 'Add shapes behind your images with our intuitive editor. Create stunning designs with geometric shapes.',
  keywords: 'shapes behind image, image shape editor, shape overlay, image design tool'
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}