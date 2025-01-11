export const UseCases = () => {
  const cases = [
    {
      title: "Content Creators",
      subtitle: "Effortlessly Create Stunning Visuals",
      description: "Add shapes, text, and glow effects behind objects in your images to make captivating YouTube thumbnails, Instagram posts, and more.",
      icon: "🎥"
    },
    {
      title: "Marketers",
      subtitle: "Boost Your Campaigns",
      description: "Design high-quality visuals with custom fonts, colors, and styles to make your ads, banners, and promotional materials stand out.",
      icon: "📈"
    },
    {
      title: "Photographers",
      subtitle: "Enhance Your Photos",
      description: "Transform ordinary images into extraordinary works of art by placing text and shapes behind objects seamlessly.",
      icon: "📸"
    },
    {
      title: "Digital Artists",
      subtitle: "Unleash Your Creativity",
      description: "Experiment with colors, fonts, and effects to bring your artistic vision to life with AI-powered tools.",
      icon: "🎨"
    },
    {
      title: "Social Media",
      subtitle: "Stand Out on Every Platform",
      description: "Design engaging content for Instagram, TikTok, Facebook, and beyond in seconds.",
      icon: "📱"
    },
    {
      title: "Students & Educators",
      subtitle: "Simplify Creative Projects",
      description: "Easily design posters, presentations, and visual aids for school or teaching projects.",
      icon: "📚"
    }
  ];

  return (
    <section className="bg-black/40 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          For Every <span className="text-purple-400">Creator</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cases.map((card, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all"
            >
              <div className="text-2xl mb-4">{card.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {card.title}
              </h3>
              <h4 className="text-lg text-purple-400 font-medium mb-3">
                {card.subtitle}
              </h4>
              <p className="text-gray-400">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
