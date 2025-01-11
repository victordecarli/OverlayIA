'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthDialog } from '@/components/AuthDialog';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      if (data?.user) {
        // Redirect authenticated user to the home page or dashboard
        router.push('/');
      }
    };

    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <AuthDialog 
        isOpen={true}
        onClose={() => router.push('/')}
      />
    </div>
  );
}
