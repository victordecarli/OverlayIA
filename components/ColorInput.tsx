'use client';

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function ColorInput({ value, onChange, label, className }: ColorInputProps) {
  return (
    <div className="relative">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-9 cursor-pointer rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 [&::-webkit-color-swatch-wrapper]:p-1 [&::-webkit-color-swatch]:rounded-md ${className}`}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-black/80 px-1 rounded">
        {value.toUpperCase()}
      </div>
    </div>
  );
}
