'use client';

import { TransformationPage } from '@/components/TransformationPage';

export default function ChangeBackgroundPage() {
  return (
    <TransformationPage
      title="Change Background Transform"
      description="Transform your image backgrounds instantly. Replace, modify, or enhance your image backgrounds with ease."
      beforeImage="/shirtbefore.jpg"
      afterImage="/shirtafter.jpg"
      beforeAlt="Original image with default background"
      afterAlt="Image with changed background"
    />
  );
}
