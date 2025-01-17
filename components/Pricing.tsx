'use client';

import { Check, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthDialog } from './AuthDialog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TOKEN_OPTIONS } from './TokenPurchaseDialog';

const features = {
  free: [
    { name: 'Place Images Behind the Main Image', included: true, description: 'Add images behind your main image' },
    { name: 'Clone Image', included: true, description: 'Clone and duplicate image elements' },
    { name: 'Remove Background', included: true, description: 'Remove image backgrounds automatically' },
    { name: 'Change Background', included: true, description: 'Change image backgrounds easily' },
    { name: 'Text Behind Image', included: true, description: 'Add text behind your images' },
    { name: 'Shapes Behind Image', included: true, description: 'Place shapes behind your images' },
  ],
  paid: [
    { name: 'Place Images Behind the Main Image', included: true },
    { name: 'Clone Image', included: true },
    { name: 'Remove Background', included: true },
    { name: 'Change Background', included: true },
    { name: 'Text Behind Image', included: true },
    { name: 'Shapes Behind Image', included: true },
  ],
};

export function Pricing() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleBuyTokensClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    // Use push with absolute path
    router.push('/pay', { scroll: true });
  };

  const handleStartCreating = () => {
    router.push('/custom-editor');
  };

  return (
    <>
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/50 to-black/50 backdrop-blur-xl border-t border-white/5" />
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400">Choose the plan that works best for you</p>
          </div>
          
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Free Plan</h3>
              <p className="text-purple-400 text-lg mb-6">Get 5 free image generations</p>
              
              <div className="space-y-4 mb-8">
                {features.free.map((feature) => (
                  <div key={feature.name} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                    <div>
                      <div className="text-gray-300">{feature.name}</div>
                      <div className="text-sm text-gray-500">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {user ? (
                <button 
                  onClick={handleStartCreating}
                  className="w-full bg-purple-600 text-white rounded-lg py-3 px-4 hover:bg-purple-700 transition-colors"
                >
                  Start Creating
                </button>
              ) : (
                <button 
                  onClick={() => setShowAuthDialog(true)}
                  className="w-full bg-purple-600 text-white rounded-lg py-3 px-4 hover:bg-purple-700 transition-colors"
                >
                  Sign up with Google
                </button>
              )}
              <p className="text-sm text-gray-400 text-center mt-4">No credit card required</p>
            </div>

            {/* Token-Based Plan */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Pro Plan</h3>
              <p className="text-purple-400 text-lg mb-2">Pay-as-you-go tokens</p>
              <div className="space-y-2 mb-6">
                <p className="text-gray-400 text-sm">No Subscription, No Expiration - Buy tokens only when you need them</p>
              </div>
              
              {/* Token Cards - More Compact Layout */}
              <div className="max-w-sm mx-auto space-y-3">
                {TOKEN_OPTIONS.map((option) => (
                  <div key={option.tokens} className="p-3 bg-zinc-900/50 rounded-lg border border-white/5">
                    {/* Use the same structure as before but with TOKEN_OPTIONS data */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">{option.tokens} Tokens</h4>
                        <p className="text-xs text-gray-400">
                          {option.tokens} Images • ${option.perToken.toFixed(2)}/token
                        </p>
                        {option.savings > 0 && (
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                            {option.savings === 30 ? 'Best Value! ' : ''}Save {option.savings}%
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-400">${option.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Buy Button */}
              <div className="mt-6 mb-8 max-w-sm mx-auto">
                <button 
                  type="button"
                  onClick={handleBuyTokensClick}
                  className="w-full bg-purple-600 text-white rounded-lg py-3 px-4 hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black relative z-10"
                >
                  {user ? 'Buy Tokens Now' : 'Sign in to Buy Tokens'}
                </button>
                <p className="text-center text-sm text-gray-400 mt-2">
                  Tokens never expire • Use anytime
                </p>
              </div>

              {/* Key Features */}
              <div className="border-t border-white/10 pt-6">
                <h4 className="text-sm font-medium text-gray-400 mb-4">All Features Included:</h4>
                <div className="space-y-3">
                  {features.free.map((feature) => (
                    <div key={feature.name} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="text-gray-300">{feature.name}</div>
                        <div className="text-xs text-gray-500">{feature.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {user && (
                  <p className="text-sm text-purple-300 mt-6">
                    If you have existing tokens, purchasing more will add to your current balance
                  </p>
                )}
            </div>
          </div>
        </div>
      </section>

      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
      />
    </>
  );
}
