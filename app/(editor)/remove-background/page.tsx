'use client';

import { TransformationPage } from '@/components/TransformationPage';

export default function RemoveBackgroundPage() {
  return (
    <TransformationPage
      title="Remove Background Transform"
      description="Remove backgrounds from your images with precision. Perfect for creating professional product photos and portraits."
      beforeImage="/shirtbefore.jpg"
      afterImage="/shirtafter.jpg"
      beforeAlt="Original image with background"
      afterAlt="Image with background removed"
    />
  );
}
