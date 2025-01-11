export const Features = () => {
  const features = [
    {
      title: "Add Shapes Behind Objects",
      description: "Effortlessly place shapes to create depth and make your images stand out.",
      icon: "🔷"
    },
    {
      title: "Place Text Behind Objects",
      description: "Use AI to position text perfectly behind objects for a professional finish.",
      icon: "✨"
    },
    {
      title: "Create Stunning Glow Effects",
      description: "Add glowing highlights to your images to make them visually striking.",
      icon: "💡"
    },
    {
      title: "Customize Design Elements",
      description: "Personalize every detail with a wide range of font styles, colors, and design options.",
      icon: "🎨"
    },
    {
      title: "High-Quality Downloads",
      description: "Save your creations in premium quality, ready for any use.",
      icon: "📥"
    },
    {
      title: "YouTube Thumbnails",
      description: "Design thumbnails that grab attention and drive clicks effortlessly.",
      icon: "🎥"
    },
    {
      title: "Social Media Posts",
      description: "Craft engaging posts for Instagram, TikTok, Facebook, and beyond in seconds.",
      icon: "📱"
    },
    {
      title: "Professional Marketing",
      description: "Build standout visuals for campaigns, promotions, and creative projects.",
      icon: "📈"
    },
    {
      title: "Enhanced Photography",
      description: "Elevate your photos with professional-grade effects and enhancements.",
      icon: "📸"
    }
  ];

  return (
    <section className="bg-black/40 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          Everything You Need for <span className="text-purple-400">Professional Designs</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all"
            >
              <div className="text-2xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
