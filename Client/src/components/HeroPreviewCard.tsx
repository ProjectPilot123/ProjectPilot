/* HeroPreviewCard Component
 * A small card that represents a generated project idea.
 * Used inside the HeroVisual to show floating project previews.
 * Props:
 *   - title: project name
 *   - tags: array of skill/tech tags
 *   - delay: CSS animation delay for staggered floating effect
 */

import './HeroPreviewCard.css';

interface HeroPreviewCardProps {
  title: string;
  tags: string[];
  delay: string;
}

function HeroPreviewCard({ title, tags, delay }: HeroPreviewCardProps) {
  return (
    <div className="hero-preview-card" style={{ animationDelay: delay }}>
      {/* Project title */}
      <div className="hero-preview-card-title">{title}</div>
      {/* Tech tags as small badges */}
      <div className="hero-preview-card-tags">
        {tags.map((tag) => (
          <span key={tag} className="hero-preview-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default HeroPreviewCard;
