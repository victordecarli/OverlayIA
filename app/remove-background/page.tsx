'use client';

import { useEditor } from '@/hooks/useEditor';
import { useEffect } from 'react';
import { Canvas } from '@/components/Canvas';
import { RemoveBackgroundNavigation } from '@/components/RemoveBackgroundNavigation';
import { EditorLayout } from '@/components/EditorLayout';

export default function RemoveBackgroundPage() {
  const { resetEditor } = useEditor();

  useEffect(() => {
    resetEditor();
  }, []);

  return <EditorLayout SideNavComponent={RemoveBackgroundNavigation} />;
}
