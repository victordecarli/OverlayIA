'use client';

import { TransformationPage } from '@/components/TransformationPage';

export default function DrawBehindImagePage() {
  return (
    <TransformationPage
      title="Draw Behind Image Transform"
      description="Create custom drawings and effects behind your images."
      beforeImage="/drawbefore.jpg"
      afterImage="/drawafter.jpeg"
      beforeAlt="Original image without drawings"
      afterAlt="Image with custom drawings behind"
    />
  );
}
