'use client';

import { EditorLayout } from '@/components/EditorLayout';
import { SideNavigation } from '@/components/SideNavigation';
import { useEditor } from '@/hooks/useEditor';
import { useEffect } from 'react';

export default function DrawPage() {
  const { resetEditor } = useEditor();
  
  useEffect(() => {
    resetEditor(true);
    return () => {      
      resetEditor(true);
    };
  }, [resetEditor]);

  return (
      <EditorLayout
        SideNavComponent={(props) => (
          <SideNavigation {...props} mode="text-only" />
        )}
        mode="text-only"  
      />
  );
}
