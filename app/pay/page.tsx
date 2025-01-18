'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Home, LogIn } from 'lucide-react';
import Link from 'next/link';
import { PaymentStatusDialog } from '@/components/PaymentStatusDialog';
import { useToast } from "@/hooks/use-toast"
import { debounce } from 'lodash'; // Add this import


const TOKEN_OPTIONS = [
  { tokens: 5, price: 1, savings: 0, perToken: 0.20 },
  { tokens: 10, price: 2, savings: 0, perToken: 0.20 },
  { tokens: 25, price: 4, savings: 20, perToken: 0.16 },
  { tokens: 50, price: 7, savings: 30, perToken: 0.14 },
];

function PayPalButtonWrapper({ createOrder, onApprove, onError, onCancel, disabled, selectedTokens }: any) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();

  if (isPending) {
    return <PayPalLoader />;
  }

  if (isRejected) {
    return (
      <div className="text-red-500 text-center p-4">
        Failed to load PayPal. Please refresh the page or try again later.
      </div>
    );
  }

  return (
    <div className="relative">
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        onCancel={onCancel}
        style={{layout: "vertical", shape: "rect", label: "paypal" }}
        disabled={disabled}
        forceReRender={[selectedTokens.tokens]}
      />
    </div>
  );
}

function PayPalLoader() {
  return (
    <div className="h-[150px] flex flex-col items-center justify-center gap-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-600">Loading PayPal...</p>
    </div>
  );
}

export default function PayPage() {
  const [selectedTokens, setSelectedTokens] = useState(TOKEN_OPTIONS[2]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [isChangingOption, setIsChangingOption] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const tokenParam = searchParams.get('tokens');
    if (tokenParam) {
      const option = TOKEN_OPTIONS.find(opt => opt.tokens === Number(tokenParam));
      if (option) {
        setSelectedTokens(option);
      }
    } else {
      // Default to 50 tokens if no selection
      setSelectedTokens(TOKEN_OPTIONS[3]);
    }
  }, [searchParams]);

  useEffect(() => {
    // Add a small delay to ensure PayPal script loads properly
    const timer = setTimeout(() => {
      setSdkReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateOrder = async () => {
    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokenAmount: selectedTokens.tokens,
          userID: user?.id
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      // Update PayPal script with nonce
      const scriptElement = document.querySelector('[data-namespace="paypal_sdk"]');
      if (scriptElement) {
        scriptElement.setAttribute('nonce', data.nonce);
      }
      
      return data.id;
    } catch (error) {
      toast({variant:'destructive', title: "Something went wrong"});
      throw error;
    }
  };

  const handleError = () => {
    toast({variant:'destructive', title: "Payment cancelled or failed"})
    setPaymentStatus('error');
    setIsProcessing(false);
    // Clear error status after 3 seconds
    setTimeout(() => {
      setPaymentStatus(null);
    }, 3000);
  };

  const handleCancel = () => {
    toast({variant:'destructive', title: "Payment cancelled"})
    setIsProcessing(false);
  };

  async function captureOrder(orderID: string) {
    if (!user) {
      router.push('/');
      return;
    }

    // Only set processing to true when actually capturing the payment
    setIsProcessing(true);

    try {
      const response = await fetch('/api/payments/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID,
          userID: user.id,
          tokenAmount: selectedTokens.tokens
        })
      });
      
      if (response.ok) {
        setPaymentStatus('success');
        // Wait 2 seconds before redirecting
        setTimeout(() => {
          router.push('/custom-editor');
        }, 2000);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
        toast({variant:'destructive', title: "Payment failed"});
        setPaymentStatus('error');
        // Clear error status after 3 seconds
        setTimeout(() => {
            setPaymentStatus(null);
        }, 3000);
    } finally {
      setIsProcessing(false);
    }
  }

  const initialOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
    "disable-funding": "card,credit"  // Add this line to disable card and credit options
  };

  // Debounced selection handler
  const debouncedSetSelection = useCallback(
    debounce((option) => {
      setSelectedTokens(option);
      setIsChangingOption(false);
    }, 300),
    []
  );

  // Update token selection handler
  const handleTokenSelection = (option: typeof TOKEN_OPTIONS[0]) => {
    setIsChangingOption(true);
    debouncedSetSelection(option);
  };

  // Clean up the debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetSelection.cancel();
    };
  }, [debouncedSetSelection]);

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/"
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="w-6 h-6" />
          </Link>
          
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user.email}</span>
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt="User avatar"
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24">
        <div className="container max-w-6xl mx-auto py-12 px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Purchase Tokens</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Token Options */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Package</h2>
              {TOKEN_OPTIONS.map((option) => (
                <button
                  key={option.tokens}
                  onClick={() => handleTokenSelection(option)}
                  disabled={isChangingOption}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-all",
                    isChangingOption ? "opacity-50 cursor-not-allowed" : "",
                    selectedTokens.tokens === option.tokens
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-gray-900 text-lg">
                        {option.tokens} Tokens
                      </div>
                      <div className="text-sm text-gray-500">
                        {option.tokens} Images • ${option.perToken.toFixed(2)}/token
                      </div>
                    </div>
                    <span className="font-semibold text-purple-600 text-xl">
                      ${option.price}
                    </span>
                  </div>
                  {option.savings > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                      {option.savings === 30 ? 'Best Value! ' : ''}Save {option.savings}%
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Payment Methods */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm relative">
                {!user ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-lg z-10">
                    <div className="text-center">
                      <LogIn className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">Please log in to continue</p>
                    </div>
                  </div>
                ) : !sdkReady || isChangingOption ? (
                  <PayPalLoader />
                ) : (
                  <PayPalScriptProvider options={initialOptions}>
                    <ErrorBoundary fallback={
                      <div className="text-red-500 text-center p-4">
                        Something went wrong with PayPal integration. Please refresh the page or try again later.
                      </div>
                    }>
                      <div className="relative">
                        <div className="mb-6 text-center">
                          <div className="text-xl font-semibold text-gray-900">
                            Total Payable: ${selectedTokens.price}
                          </div>
                        </div>
                        <PayPalButtonWrapper
                          createOrder={handleCreateOrder}
                          onApprove={(data: any) => captureOrder(data.orderID)}
                          onError={handleError}
                          onCancel={handleCancel}
                          disabled={!user || isProcessing}
                          selectedTokens={selectedTokens}
                        />
                        <p className="text-xs text-gray-500 mt-3 text-center">
                          * Additional PayPal charges may apply based on your currency or location
                        </p>
                        {isProcessing && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded z-50">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                              <span className="text-sm text-gray-600">Processing payment...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </ErrorBoundary>
                  </PayPalScriptProvider>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <PaymentStatusDialog 
        isOpen={paymentStatus !== null}
        status={paymentStatus || 'error'}
      />
    </div>
  );
}

// Add Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PayPal Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
