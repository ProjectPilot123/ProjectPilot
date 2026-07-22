/* HeroVisual Component
 * Displays floating project preview cards on the right side of the hero section.
 * Uses HeroPreviewCard components positioned with CSS.
 * No images are used - everything is built with CSS and cards.
 */

import HeroPreviewCard from './HeroPreviewCard';
import './HeroVisual.css';

/* Sample project cards to display */
const previewCards = [
  {
    title: 'E-Commerce Dashboard',
    tags: ['React', 'Node.js', 'MongoDB'],
    delay: '0s',
  },
  {
    title: 'Chat Application',
    tags: ['Next.js', 'Socket.io', 'PostgreSQL'],
    delay: '0.5s',
  },
  {
    title: 'Portfolio Website',
    tags: ['TypeScript', 'CSS', 'Vite'],
    delay: '1s',
  },
];

function HeroVisual() {
  return (
    <div className="hero-visual">
      {/* Decorative background glow */}
      <div className="hero-visual-glow"></div>

      {/* Preview cards positioned absolutely within the container */}
      <div className="hero-preview-cards">
        {previewCards.map((card, index) => (
          <div
            key={index}
            className="hero-preview-wrapper"
            style={{
              top: `${index * 35}%`,
              left: `${10 + index * 15}%`,
            }}
          >
            <HeroPreviewCard
              title={card.title}
              tags={card.tags}
              delay={card.delay}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeroVisual;
