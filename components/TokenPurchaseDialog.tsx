import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const TOKEN_OPTIONS = [
  { tokens: 10, price: 2, savings: 0, perToken: 0.20 },
  { tokens: 25, price: 4, savings: 20, perToken: 0.16 },
  { tokens: 50, price: 7, savings: 30, perToken: 0.14 },
];

interface TokenPurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TokenPurchaseDialog({ isOpen, onClose }: TokenPurchaseDialogProps) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(TOKEN_OPTIONS[2]); // Default to best value option

  const handlePurchase = () => {
    const option = selectedOption || TOKEN_OPTIONS[2]; // Fallback to best value if somehow nothing selected
    router.push(`/pay?tokens=${option.tokens}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            You have exhausted your tokens
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Please purchase more tokens to proceed with editing
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {TOKEN_OPTIONS.map((option) => (
            <button
              key={option.tokens}
              onClick={() => setSelectedOption(option)}
              className={cn(
                "w-full p-4 rounded-lg border text-left transition-all",
                selectedOption.tokens === option.tokens
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-800/50"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-white text-lg">
                    {option.tokens} Tokens
                  </div>
                  <div className="text-sm text-gray-400">
                    {option.tokens} Images • ${option.perToken.toFixed(2)}/token
                  </div>
                </div>
                <span className="font-semibold text-purple-400 text-xl">
                  ${option.price}
                </span>
              </div>
              {option.savings > 0 && (
                <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                  {option.savings === 30 ? 'Best Value! ' : ''}Save {option.savings}%
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <button
            onClick={handlePurchase}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-3 px-4 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
