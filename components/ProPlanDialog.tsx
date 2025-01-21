import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useRouter } from "next/navigation";
import { usePricing } from '@/contexts/PricingContext';
import { CountrySwitch } from './CountrySwitch';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { isSubscriptionActive } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface ProPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProPlanDialog({ isOpen, onClose }: ProPlanDialogProps) {
  const router = useRouter();
  const { selectedCountry, getPrice } = usePricing();
  const { user } = useAuth();
  const [userStatus, setUserStatus] = useState<{
    expires_at: string | null;
    free_generations_used: number;
  } | null>(null);
  const currencySymbol = selectedCountry === 'India' ? '₹' : '$';

  useEffect(() => {
    async function fetchUserStatus() {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('expires_at, free_generations_used')
          .eq('id', user.id)
          .single();
        
        setUserStatus(data);
      }
    }

    if (isOpen) {
      fetchUserStatus();
    }
  }, [isOpen, user]);

  const getMessage = () => {
    if (!userStatus) return '';
    
    if (userStatus.expires_at) {
      return isSubscriptionActive(userStatus.expires_at)
        ? "Your pro plan is currently active."
        : "Your pro plan has expired. Renew now for unlimited access.";
    }
    
    return "You've used all your free generations. Upgrade to Pro for unlimited access.";
  };

  const handleUpgrade = () => {
    router.push('/pay');
    onClose();
  };

  const getOriginalPrice = () => selectedCountry === 'India' ? 199 : 10;
  const getDiscountedPrice = () => selectedCountry === 'India' ? 99 : 6;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Upgrade to Pro Plan
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {getMessage()}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Added CountrySwitch */}
          <div className="flex justify-center">
            <CountrySwitch />
          </div>

          <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-800/50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-white text-lg">Pro Monthly Plan</div>
                <div className="text-sm text-gray-400">Unlimited generations • All features</div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className="line-through text-gray-500 text-lg">
                    {currencySymbol}{getOriginalPrice()}
                  </span>
                  <span className="font-semibold text-purple-400 text-xl">
                    {currencySymbol}{getDiscountedPrice()}
                  </span>
                </div>
                <div className="text-sm text-gray-400">/month</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                No auto-renewals
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Pay only when you need it
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                Unlimited generations
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleUpgrade}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 px-4 transition-colors"
          >
            Upgrade Now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
