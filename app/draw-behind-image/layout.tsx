import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Draw Behind Image - UnderlayX AI',
  description: 'Draw behind objects in your images with AI',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}