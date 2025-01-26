'use client';

import { TransformationPage } from '@/components/TransformationPage';

export default function ShapeBehindImagePage() {
  return (
    <TransformationPage
      title="Shape Behind Image Transform"
      description="Add geometric shapes and patterns behind your images. Create stunning visual effects with customizable shapes and designs."
      beforeImage="/personbefore.jpg"
      afterImage="/personafter.jpg"
      beforeAlt="Original image without shapes"
      afterAlt="Image with shapes behind"
    />
  );
}
