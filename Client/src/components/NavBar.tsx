/* NavBar Component
 * A sticky navigation bar with logo and links.
 * Responsive: shows hamburger menu on smaller screens.
 */

import { useState } from 'react';
import './NavBar.css';

/* The links shown in the navbar */
const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
];

function NavBar() {
  /* State to toggle mobile menu open/close */
  const [menuOpen, setMenuOpen] = useState(false);

  /* Function to close the mobile menu */
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo on the left */}
        <div className="navbar-logo">
          ProjectPilot
        </div>

        {/* Hamburger button - only visible on mobile */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {/* Three horizontal lines */}
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation links - hidden on mobile unless menu is open */}
        <ul className={`navbar-links ${menuOpen ? 'navbar-links--open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="nav-link"
                onClick={handleLinkClick}
              >
                {link.label}
              </a>
            </li>
          ))}
          {/* Auth buttons */}
          <li>
            <a href="#login" className="nav-link">Login</a>
          </li>
          <li>
            <a href="#signup" className="nav-link nav-link--accent">Sign Up</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
