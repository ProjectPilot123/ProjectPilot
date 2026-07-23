import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import { login } from "../utils/auth";

import "./Auth.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    await login(email, password);
    navigate("/dashboard");
  } catch (error: any) {
    alert(
      error.response?.data?.message || "Login failed"
    );
  }
};
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue exploring AI-powered project recommendations."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />

            <span>Remember Me</span>
          </label>

          <Link to="/forgot-password" className="forgot-password">
            Forgot Password?
          </Link>
        </div>

        <div className="auth-button">
          <Button variant="primary">
            Login
          </Button>
        </div>

        <div className="auth-footer">
          <span>Don't have an account?</span>

          <Link to="/signup">
            Create Account
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;