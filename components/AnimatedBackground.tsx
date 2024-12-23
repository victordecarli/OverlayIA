'use client';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      <div className="absolute inset-0 bg-gradient-radial animate-gradient-slow">
        <div className="absolute inset-0 opacity-50">
          {/* Primary Gradients */}
          <div className="absolute top-1/4 -left-1/4 w-2/3 h-2/3 bg-violet-900/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/3 -right-1/4 w-2/3 h-2/3 bg-blue-900/30 rounded-full blur-3xl animate-pulse-slow-delay" />
          <div className="absolute -bottom-1/4 left-1/3 w-2/3 h-2/3 bg-indigo-900/30 rounded-full blur-3xl animate-pulse-slow" />
          
          {/* Secondary Gradients */}
          <div className="absolute top-1/2 left-1/4 w-1/2 h-1/2 bg-purple-900/20 rounded-full blur-2xl animate-pulse-slow-delay" />
          <div className="absolute bottom-1/4 right-1/3 w-1/2 h-1/2 bg-blue-800/20 rounded-full blur-2xl animate-pulse-slow" />
        </div>
      </div>
      
      {/* Overlay texture */}
      <div className="absolute inset-0 bg-[#0A0A0A]/10 backdrop-blur-[1px]" />
    </div>
  );
}
