export const blogPosts = {
  'text-behind-images': {
    slug: 'text-behind-images',
    title: 'How to Add Text Behind Your Image\'s Subject',
    description: 'Learn how to create stunning designs by placing text behind image subjects with UnderlayX.',
    content: `
      <p>Ever wanted to create the effect of text appearing behind the subject in your photos? With UnderlayX, it's incredibly simple. Upload your image, add your desired text, and watch the tool automatically position it behind the main subject. Whether you're crafting social media posts or enhancing a personal project, this feature adds depth and creativity to your designs.</p>
    `,
    date: '2025-01-03',
    category: 'Tutorial'
  },
  'glowing-text-effects': {
    slug: 'glowing-text-effects',
    title: 'Creating Stunning Glowing Text Effects',
    description: 'Master the art of creating eye-catching glowing text effects for your designs.',
    content: `
      <p>Adding a glowing effect to text can make your designs pop! UnderlayX lets you customize text styles, including adding vibrant color effects and shadows. Pair this with the behind-the-subject placement, and you'll have a design that stands out in any crowd. Try it now and elevate your creativity.</p>
    `,
    date: '2025-01-03',
    category: 'Design Tips'
  },
  'shapes-transform-designs': {
    slug: 'shapes-transform-designs',
    title: 'Shapes That Transform Your Designs',
    description: 'Learn how to use geometric patterns and shapes to enhance your images and create professional-looking designs.',
    content: `
      <p>Shapes aren't just for fun—they're a powerful design element. Use UnderlayX to add geometric patterns, abstract symbols, or even subtle accents behind your subject. Customize the size, color, and position for endless possibilities. Your photos will look more professional and polished in just minutes.</p>
    `,
    date: '2025-01-03',
    category: 'Design Tips'
  },

  'minimalism-in-photo-design': {
    slug: 'minimalism-in-photo-design',
    title: 'Why Minimalism Works in Photo Design',
    description: 'Discover how minimal design elements can create maximum impact in your photos.',
    content: `
      <p>Sometimes, less is more. UnderlayX empowers you to create minimalist designs by placing subtle text or shapes behind your subject. It's a simple touch that can make a big impact. Minimalist designs are not only trendy but also versatile across platforms and purposes.</p>
    `,
    date: '2025-01-03',
    category: 'Design Theory'
  },

  'layered-effects-guide': {
    slug: 'layered-effects-guide',
    title: 'Transforming Photos with Layered Effects',
    description: 'Master the art of creating depth and sophistication using layered effects in your images.',
    content: `
      <p>Layered effects, like text or shapes behind subjects, add depth and sophistication to any image. With UnderlayX, achieving this effect is easy. Just upload your photo, choose your design elements, and let the tool handle the rest. Perfect for creatives, marketers, and anyone who loves impactful visuals.</p>
    `,
    date: '2025-01-03',
    category: 'Tutorial'
  },

  'quick-photo-design-tips': {
    slug: 'quick-photo-design-tips',
    title: 'Quick Tips for Better Photo Designs',
    description: 'Essential tips and tricks to enhance your photo designs using UnderlayX.',
    content: `
      <article>
        <p>Creating stunning designs doesn't have to be complicated. Here are some essential tips:</p><br>
        <ul>
          <li>Stick to one or two fonts for a clean look</li>
          <li>Use shapes sparingly to avoid clutter</li>
          <li>Add glowing effects to highlight important details</li>
          <li>Experiment with color contrasts for text and shapes</li>
        </ul>
        <p>With UnderlayX, these design tips are easy to apply!</p>
      </article>
    `,
    date: '2025-01-03',
    category: 'Design Tips'
  },

  'text-behind-subject-popularity': {
    slug: 'text-behind-subject-popularity',
    title: 'What Makes Text Behind Subject So Popular?',
    description: 'Explore why the text-behind-subject effect has become a trending design choice in social media.',
    content: `
      <p>The text-behind-subject effect creates a seamless and professional look that's trending across social media. This effect draws attention to your subject while adding context or a creative twist. UnderlayX makes this trend accessible for everyone—no advanced editing skills required!</p>
    `,
    date: '2025-01-03',
    category: 'Trends'
  }
};

export async function getBlogPost(slug: string) {
  const post = blogPosts[slug];
  if (!post) {
    throw new Error(`Blog post ${slug} not found`);
  }
  return post;
}

export function getAllBlogPosts() {
  return Object.values(blogPosts).sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}
