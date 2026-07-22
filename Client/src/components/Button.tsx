/* Button Component
 * A reusable button with two variants: "primary" and "secondary".
 * Props:
 *   - children: the text inside the button
 *   - variant: "primary" (accent color bg) or "secondary" (transparent with border)
 *   - onClick: optional click handler
 */

import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
