'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';
import { CountrySwitch } from './CountrySwitch';
import { usePricing } from '@/contexts/PricingContext';
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { isSubscriptionActive } from '@/lib/utils';
import { AuthDialog } from './AuthDialog';

const features = {
  free: [
    "2 Free Generations",
    "Images Behind the Main Subject",
    "Clone Image Elements",
    "Remove Backgrounds",
    "Change Backgrounds",
    "Add Text Behind Images",
    "Shapes Behind Images"
  ],
  pro: [
    "Images Behind the Main Subject",
    "Clone Image Elements",
    "Remove Backgrounds",
    "Change Backgrounds",
    "Add Text Behind Images",
    "Shapes Behind Images"
  ]
};

export function Pricing() {
  const { selectedCountry, getPrice } = usePricing();
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    expires_at: string | null;
  } | null>(null);
  const currencySymbol = selectedCountry === 'India' ? '₹' : '$';

  useEffect(() => {
    async function fetchSubscriptionInfo() {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('expires_at')
          .eq('id', user.id)
          .single();
        
        setSubscriptionInfo(data);
      }
    }

    fetchSubscriptionInfo();
  }, [user]);

  const isProActive = subscriptionInfo?.expires_at && isSubscriptionActive(subscriptionInfo.expires_at);

  const renderActionButton = (plan: 'free' | 'pro') => {
    if (!user) {
      return (
        <button
          onClick={() => setShowAuthDialog(true)}
          className={`block w-full py-3 px-6 text-center ${
            plan === 'pro' 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'bg-white/10 hover:bg-white/20'
          } text-white rounded-lg font-medium transition-colors`}
        >
          Login to Start
        </button>
      );
    }

    if (isProActive) {
      return (
        <div className="text-center py-3 px-6 bg-purple-600/20 text-purple-400 rounded-lg font-medium">
          Pro Plan Active
        </div>
      );
    }

    return (
      <Link
        href={plan === 'pro' ? '/pay' : '/custom-editor'}
        className={`block w-full py-3 px-6 text-center ${
          plan === 'pro' 
            ? 'bg-purple-600 hover:bg-purple-700' 
            : 'bg-white/10 hover:bg-white/20'
        } text-white rounded-lg font-medium transition-colors`}
      >
        {plan === 'pro' ? 'Upgrade to Pro' : 'Start Free'}
      </Link>
    );
  };

  return (
    <div className="py-24 px-4 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            No subscriptions. No auto-debits. Just pay for what you need, when you need it.
          </p>
        </div>

        <CountrySwitch />

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold text-white">{currencySymbol}0</span>
              <span className="text-gray-400 ml-2">/forever</span>
            </div>
            <p className="text-gray-400 mb-6">
              Try our basic features with 2 free generations.
            </p>
            {renderActionButton('free')}
            <div className="space-y-4 mt-8">
              {features.free.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-8 backdrop-blur-sm relative">
            <div className="absolute -top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro Monthly Plan</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold text-white">
                <span className="line-through text-gray-500 text-3xl mr-2">
                  {currencySymbol}{selectedCountry === 'India' ? '199' : '10'}
                </span>
                {currencySymbol}{getPrice(6)}
              </span>
              <span className="text-gray-400 ml-2">/month</span>
            </div>
            <p className="text-gray-400 mb-6">
              Unlimited Features. No Subscriptions. Enjoy full access for a month—and renew anytime.
              <span className="block mt-2 text-purple-400">
                Limited time offer - Save {selectedCountry === 'India' ? '₹50' : '$4'} today!
              </span>
            </p>
            {renderActionButton('pro')}
            <div className="space-y-4 mt-8">
              {features.pro.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-gray-300">
                  <Check className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </div>
  );
}
