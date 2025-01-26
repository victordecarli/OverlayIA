'use client';

import { EditorLayout } from '@/components/EditorLayout';
import { SideNavigation } from '@/components/SideNavigation';
import { useEditor } from '@/hooks/useEditor';
import { useEffect } from 'react';
import { TransformationPage } from '@/components/TransformationPage';

export default function TextBehindImagePage() {
  return (
    <TransformationPage
      title="Text Behind Image Transform"
      description="Add stunning text effects behind your images."
      beforeImage="/povbefore.jpg"
      afterImage="/povafter.jpg"
      beforeAlt="Original image without text behind"
      afterAlt="Image with text effect behind"
    />
  );
}
