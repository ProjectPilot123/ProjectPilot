import { type ReactNode } from "react";
import HeroVisual from "./HeroVisual";
import "./AuthLayout.css";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      {/* Left Panel */}
      <div className="auth-left">

        <div className="auth-brand">

          <h1 className="auth-logo">
            Project<span>Pilot</span>
          </h1>

          <p className="auth-tag">
            AI-Powered Project Recommendation
          </p>

        </div>

        <div className="auth-text">

          <h2>
            Build better projects with AI.
          </h2>

          <p>
            Tell us your skills and interests.
            ProjectPilot recommends software projects
            that match your level and help strengthen
            your portfolio.
          </p>

        </div>

        <div className="auth-hero">
          <HeroVisual />
        </div>

      </div>

      {/* Right Panel */}

      <div className="auth-right">

        <div className="auth-card">

          <h2>{title}</h2>

          <p>{subtitle}</p>

          {children}

        </div>

      </div>

    </div>
  );
}

export default AuthLayout;