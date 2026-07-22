/* FeatureCard Component
 * A reusable card for displaying a feature with an icon, title, and description.
 * Props:
 *   - icon: a simple emoji or unicode character as the icon
 *   - title: the feature name
 *   - description: a short description of the feature
 */

import './FeatureCard.css';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="feature-card">
      {/* Icon displayed as a large emoji/character */}
      <div className="feature-card-icon">{icon}</div>
      {/* Feature title */}
      <h3 className="feature-card-title">{title}</h3>
      {/* Feature description */}
      <p className="feature-card-description">{description}</p>
    </div>
  );
}

export default FeatureCard;
