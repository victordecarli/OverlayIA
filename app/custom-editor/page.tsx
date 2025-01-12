'use client';

import { useEditor } from '@/hooks/useEditor';
import { useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SideNavigation } from '@/components/SideNavigation';
import { Canvas } from '@/components/Canvas';
import { EditorLayout } from '@/components/EditorLayout';

export default function EditorPage() {
  const { resetEditor } = useEditor();

  useEffect(() => {
    resetEditor();
  }, []);

  return <EditorLayout SideNavComponent={SideNavigation} />;
}
