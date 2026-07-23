import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../utils/auth";

import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";

import "./Auth.css";

function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    await signup(fullName, username,email, password);

    navigate("/dashboard");
  } catch (error: any) {
    alert(
      error.response?.data?.message || "Signup failed"
    );
  }
};

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start your journey with AI-powered project recommendations."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        {/* Username */}
        <div className="form-group">
           <label>Username</label>

           <input
           type="text"
           placeholder="Choose a username"
           value={username}
           onChange={(e) => setUsername(e.target.value)}
           required
          />
        </div>
        {/* Email */}
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

        {/* Password */}
        <div className="form-group">
          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="auth-button">
          <Button variant="primary">
            Create Account
          </Button>
        </div>

        <div className="auth-footer">
          <span>Already have an account?</span>

          <Link to="/login">
            Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default SignupPage;