import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginForm = () => {
  const { setUser } = useUser();
  const [form, setForm] = useState({ text: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Input change handler
  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.name === "email" ? e.target.value.toLowerCase() : e.target.value,
    }));
  };

  // Login validation and backend API call
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.text || !form.password) {
      toast.error("Please fill all fields!");
      return;
    }
    const isEmail = form.text.includes("@gmail.com");
    const isEmployeeCode = form.text.startsWith("EMP");

    if (isEmail) {
      if (!form.text.includes("@gmail.com")) {
        toast.error("Please enter a valid Gmail address!");
        return;
      }
    } else if (isEmployeeCode) {
      if (!form.text.startsWith("EMP")) {
        toast.error("Employee code must start with 'EMP'.");
        return;
      }
    } else {
      toast.error("Please enter a valid email or employee code.");
      return;
    }

    try {
      // API call to backend
      const res = await fetch("http://localhost:5000/sign_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: form.text, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed!");
        return;
      }
      // Example backend response: { email, name, role }
      localStorage.setItem("loggedInUser", JSON.stringify(data));
      setUser(data);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin}>
      <div className="login-title">Sign In</div>
      <input
        className="login-input"
        name="text"
        placeholder="Email/EmployeeCode"
        value={form.email}
        onChange={handleChange}
        type="text"
        required
      />
      <div className="password-row">
        <input
          className="login-input"
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          className="s tn"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      <button type="submit" className="login-btn">Log In</button>
    </form>
  );
};

export default LoginForm;
