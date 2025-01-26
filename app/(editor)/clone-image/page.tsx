'use client';

import { TransformationPage } from '@/components/TransformationPage';

export default function CloneImagePage() {
  return (
    <TransformationPage
      title="Clone Image Transform"
      description="Easily clone and duplicate objects within your images. Perfect for creating repetitive patterns."
      beforeImage="/applebefore.jpg"
      afterImage="/appleafter.jpeg"
      beforeAlt="Original image before cloning"
      afterAlt="Image with cloned elements"
    />
  );
}
