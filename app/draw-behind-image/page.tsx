'use client';

import { EditorLayout } from '@/components/EditorLayout';
import { SideNavigation } from '@/components/SideNavigation';
import { EditorPanelProvider } from '@/contexts/EditorPanelContext';

export default function DrawPage() {
  return (
    <EditorPanelProvider>
      <EditorLayout
        SideNavComponent={(props) => (
          <SideNavigation {...props} mode="draw-only" />
        )}
        mode="draw-only"  
      />
    </EditorPanelProvider>
  );
}
