import { EditorPanelProvider } from '@/contexts/EditorPanelContext';
export { metadata } from './metadata';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
