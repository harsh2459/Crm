import React, { useState } from "react";
import SignupForm from "../components/Auth/SignupForm";
import LoginForm from "../components/Auth/LoginForm";
import illustration from "../assets/image/undraw_remotely_2j6y.svg";
import "../styles/auth.scss";

const AuthPage = () => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="login-main-wrapper">
      <div className="login-illustration">
        <img src={illustration} alt="Login Illustration" />
      </div>
      <div className="login-card">
        <div className="login-tabs">
          <button className={showSignup ? "active" : ""} onClick={() => setShowSignup(true)}>Sign Up</button>
          <button className={!showSignup ? "active" : ""} onClick={() => setShowSignup(false)}>Sign In</button>
        </div>
        {showSignup ? <SignupForm /> : <LoginForm />}
      </div>
    </div>
  );
};

export default AuthPage;
