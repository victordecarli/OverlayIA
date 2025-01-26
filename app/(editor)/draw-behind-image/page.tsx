'use client';

import { TransformationPage } from '@/components/TransformationPage';

export default function DrawBehindImagePage() {
  return (
    <TransformationPage
      title="Draw Behind Image Transform"
      description="Create custom drawings and effects behind your images. Add unique artistic elements to enhance your visuals."
      beforeImage="/flowerbefore.jpg"
      afterImage="/flowerafter.jpg"
      beforeAlt="Original image without drawings"
      afterAlt="Image with custom drawings behind"
    />
  );
}
