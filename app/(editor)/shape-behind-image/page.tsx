'use client';

import { useEffect } from 'react';
import { useEditor } from '@/hooks/useEditor';
import { EditorLayout } from '@/components/EditorLayout';
import { ShapeNavigation } from '@/components/ShapeNavigation';

export default function ShapeBehindImagePage() {
  const { resetEditor } = useEditor();

  useEffect(() => {
    resetEditor();
  }, []);

  return <EditorLayout SideNavComponent={ShapeNavigation} />;
}
