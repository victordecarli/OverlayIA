'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OverlayImagePage() {
  const router = useRouter();
      
  useEffect(() => {
    router.replace('/custom-editor');
  }, [router]);

  // Return null or a loading state since we're redirecting immediately
  return null;
}
