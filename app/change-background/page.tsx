'use client';

import { useEditor } from '@/hooks/useEditor';
import { useEffect } from 'react';
import { EditorLayout } from '@/components/EditorLayout';
import { ChangeBackgroundNavigation } from '@/components/ChangeBackgroundNavigation';

export default function ChangeBackgroundPage() {
  const { resetEditor } = useEditor();

  useEffect(() => {
    resetEditor();
  }, []);

  return <EditorLayout SideNavComponent={ChangeBackgroundNavigation} />;
}
