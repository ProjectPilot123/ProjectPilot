/* LandingPage Component
 * The main page that brings together all sections:
 *   1. Navbar
 *   2. Hero Section (left text + right HeroVisual)
 *   3. Features Section (4 FeatureCards)
 *   4. About Section
 *   5. Footer
 */

// import NavBar from '../components/NavBar';
import Button from '../components/Button';
import HeroVisual from '../components/HeroVisual';
import FeatureCard from '../components/FeatureCard';
import './LandingPage.css';
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";


/* Feature data - array of objects to map over */
const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Recommendations',
    description:
      'Get smart project suggestions powered by AI that match your skill level and interests.',
  },
  {
    icon: '🎯',
    title: 'Skill-Based Suggestions',
    description:
      'Projects tailored to the technologies and frameworks you already know or want to learn.',
  },
  {
    icon: '📄',
    title: 'Resume Ready Projects',
    description:
      'Build impressive projects that look great on your resume and help you stand out in interviews.',
  },
  {
    icon: '⚡',
    title: 'Fast Project Generation',
    description:
      'Generate multiple project ideas in seconds. No more spending hours deciding what to build.',
  },
];

function LandingPage() {

  const navigate = useNavigate();

  const handleGenerateProjects = () => {
  if (isAuthenticated()) {
    navigate("/dashboard");
  } else {
    navigate("/signup");
  }
};

  return (
    <>
      {/* ===== Section 2: Hero Section ===== */}
      <section className="hero" id="home">
        <div className="hero-container">
          {/* Left side: text content */}
          <div className="hero-content">
            <h1 className="hero-title">
            <div className="hero-badge">
            ✨<span>AI-Powered</span>Project Recommendation</div>
            <span className="hero-white">Project</span>
            <span className="hero-blue">Pilot</span></h1>
            <h2 className="hero-subtitle">
              Generate personalized software project ideas using AI.
            </h2>
            <p className="hero-description">
              ProjectPilot helps students and developers discover the perfect
              project to build. Simply tell us your skills and interests, and our
              AI generates personalized software project ideas that challenge you
              and boost your portfolio.
            </p>
            <div className="hero-buttons">
              <Button
                variant="primary"
                onClick={handleGenerateProjects}>
                Generate Projects
              </Button>
              <Button variant="secondary">Learn More</Button>
            </div>
          </div>

          {/* Right side: floating preview cards */}
          <div className="hero-visual-side">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ===== Section 3: Features Section ===== */}
      <section className="section" id="features">
        <div className="section-container">
        <h2 className="section-heading">Why Choose ProjectPilot?</h2>

        <p className="section-text" style={{ marginBottom: "48px" }}>
        Everything you need to find your next great project idea.</p>

        <div className="features-grid">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              />
            ))}
          </div>
         </div>
      </section>

      {/* ===== Section 4: About Section ===== */}
      <section className="section" id="about">
        <div className="section-container">

        <h2 className="section-heading about-heading">About ProjectPilot</h2>
        <div className="about-section">
        <div className="about-content">
          <p>
            Every year, thousands of students spend hours — sometimes days —
            trying to decide what project to build. Whether it is for a college
            assignment, a personal portfolio, or a hackathon, finding the right
            idea that matches your skill level is one of the biggest challenges.
          </p>
          <p>
            ProjectPilot solves this problem by using AI to generate personalized
            software project ideas based on your skills, interests, and the
            technologies you want to learn. Instead of scrolling through
            generic project lists, you get suggestions that are tailored
            specifically to you.
          </p>
          <p>
            Our goal is simple: help every developer build something meaningful
            without the stress of coming up with an idea. Let ProjectPilot be
            your personal project brainstorming assistant.
            </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Section 5: Footer ===== */}
      <footer className="footer">
        <div className="footer-container">
          {/* Footer columns */}
          <div className="footer-column">
            <h3 className="footer-logo">ProjectPilot</h3>
            <p className="footer-tagline">
              Your AI-powered project idea generator.
            </p>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-links">
              <li><a href="mailto:contact@projectpilot.com">Email Us</a></li>
              <li><a href="#">GitHub</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="footer-bottom">
          <p>&copy; 2026 ProjectPilot. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;
