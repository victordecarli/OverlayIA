'use client';

import { useEditor } from '@/hooks/useEditor';
import { useEffect } from 'react';
import { EditorLayout } from '@/components/EditorLayout';
import { CloneImageNavigation } from '@/components/CloneImageNavigation';

export default function CloneImagePage() {
  const { resetEditor } = useEditor();

  useEffect(() => {
    resetEditor();
  }, []);

  return <EditorLayout SideNavComponent={CloneImageNavigation} />;
}
