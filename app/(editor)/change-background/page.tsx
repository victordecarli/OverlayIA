'use client';

import { EditorLayout } from '@/components/EditorLayout';
import { SideNavigation } from '@/components/SideNavigation';
import { useEditor } from '@/hooks/useEditor';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function ChangeBackgroundPage() {
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
            <SideNavigation {...props} mode="change-background-only" />
          )}
          mode="change-background-only"  
        />
    );
}
