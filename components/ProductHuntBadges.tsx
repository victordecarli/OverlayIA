export const ProductHuntBadges = () => {
  return (
    <section className="bg-black/40 py-16 md:py-24">
        <div className="sm:flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 px-4 pb-10">
      {[
        {
          href: "https://www.producthunt.com/posts/underlayx?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-underlayx",
          src: "https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=739682&theme=light&period=weekly&topic_id=44"
        },
        {
          href: "https://www.producthunt.com/posts/underlayx?embed=true&utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-underlayx",
          src: "https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=739682&theme=light&period=daily"
        },
        {
          href: "https://www.producthunt.com/posts/underlayx?embed=true&utm_source=badge-top-post-topic-badge&utm_medium=badge&utm_souce=badge-underlayx",
          src: "https://api.producthunt.com/widgets/embed-image/v1/top-post-topic-badge.svg?post_id=739682&theme=light&period=weekly&topic_id=164"
        }
      ].map((badge, index) => (
        <a 
          key={index}
          href={badge.href}
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full sm:w-auto"
        >
          <img 
            src={badge.src}
            alt="UnderlayX - Product Hunt" 
            className="w-full max-w-[250px] h-auto mx-auto"
          />
        </a>
      ))}
    </div>
    </section>
  );
};
