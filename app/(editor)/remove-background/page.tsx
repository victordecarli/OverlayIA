'use client';

import { useEditor } from '@/hooks/useEditor';
import { useEffect } from 'react';
import { EditorLayout } from '@/components/EditorLayout';
import { RemoveBackgroundNavigation } from '@/components/RemoveBackgroundNavigation';

export default function RemoveBackgroundPage() {
  const { resetEditor } = useEditor();

  useEffect(() => {
    resetEditor();
  }, []);

  return <EditorLayout SideNavComponent={RemoveBackgroundNavigation} />;
}
