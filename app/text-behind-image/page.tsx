'use client';

import { useEffect } from 'react';
import { useEditor } from '@/hooks/useEditor';
import { EditorLayout } from '@/components/EditorLayout';
import { TextNavigation } from '@/components/TextNavigation';

export default function TextBehindImagePage() {
  const { resetEditor } = useEditor();

  useEffect(() => {
    resetEditor();
  }, []);

  return <EditorLayout SideNavComponent={TextNavigation} />;
}
