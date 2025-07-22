import React, { useState, useRef, useEffect } from "react";
import Stepper from "./Stepper";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiUpload, FiX } from "react-icons/fi";
import "animate.css";
import "../../styles/auth.scss";

const steps = [
  { label: "Basic Info" },
  { label: "Verify OTP" },
  { label: "Set Password" },
];

const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024;

const PasswordInput = ({
  value,
  onChange,
  placeholder = "Password",
  name = "password",
  required = true,
  show,
  setShow,
}) => {
  const [animClass, setAnimClass] = useState("");
  const handleToggle = () => {
    setAnimClass("is-hiding");
    setTimeout(() => {
      setShow((v) => !v);
      setAnimClass("is-showing");
      setTimeout(() => setAnimClass(""), 300);
    }, 120);
  };
  return (
    <div className={`password-row ${animClass}`}>
      <input
        className="login-input"
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete="off"
      />
      <button
        type="button"
        className="show-password-btn"
        tabIndex={-1}
        aria-label={show ? "Hide password" : "Show password"}
        onClick={handleToggle}
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
};

const SignupForm = () => {
  const [companies, setCompanies] = useState([]);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    gender: "",
    company: "",
    photo: null,
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Get company list from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/company/list")
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch(() => setCompanies([]));
      console.log("Company list fetched:", companies);
      
  }, []);

  // File upload logic (set only file in state)
  const handleSignupChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "mobile") {
      if (!/^\d{0,10}$/.test(value)) return;
    }
    if (name === "photo" && files && files.length > 0) {
      const file = files[0];
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        toast.error("File size exceeds 1 MB. Please choose a smaller image.");
        return;
      }
      setForm((f) => ({ ...f, photo: file }));
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      return;
    }
    setForm((f) => ({
      ...f,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
  };

  const removePhoto = () => {
    setForm((f) => ({ ...f, photo: null }));
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // STEP 1: Send OTP
  const handleSendOtp = async () => {
    if (
      !form.name ||
      !form.mobile ||
      !form.address ||
      !form.company
    ) {
      toast.warning("Please fill all fields");
      return;
    }
    if (!form.photo) {
      toast.warning("Please upload your photo");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/send_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, name: form.name }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("signup_email", form.email);
        toast.success("OTP sent to your email!");
        setOtpSent(true);
        setStep(1);
      } else {
        toast.error(data.error || "OTP send failed. Try again.");
        setOtpSent(false);
      }
    } catch {
      toast.error("Something went wrong! Try again.");
      setOtpSent(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!form.otp) {
      toast.warning("Enter the OTP sent to your email.");
      return;
    }
    const signupEmail = localStorage.getItem("signup_email");
    if (!signupEmail) {
      toast.error("Email not found. Please go back and enter your email again.");
      setStep(0);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/verify_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, otp: form.otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP verified!");
        setStep(2);
      } else {
        toast.error(data.error || "OTP verification failed.");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  // STEP 3: Complete signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.warning("Passwords do not match!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("name", form.name);
      formData.append("phone_no", form.mobile);
      formData.append("address", form.address);
      formData.append("gender", form.gender);
      formData.append("company", form.company);
      formData.append("password", form.password);
      if (form.photo) formData.append("file", form.photo);

      const res = await fetch("http://localhost:5000/sign_up", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Signup successful!");
        navigate("/");
      } else {
        toast.error(data.error || "Signup failed!");
      }
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const handlePrev = () => setStep(step - 1);

  return (
    <form className="login-form" onSubmit={handleSignup} autoComplete="off">
      <Stepper steps={steps} step={step} />
      <div>
        {step === 0 && (
          <>
            <div className="login-title">Sign Up</div>
            {/* TWO COLUMN GRID FIELDS */}
            <div className="custom-form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  className="login-input"
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  className="login-input"
                  type="email"
                  name="email"
                  placeholder="Email (only gmail allowed)"
                  value={form.email}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  className="login-input"
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={form.mobile}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  className="login-input"
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleSignupChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <div className="gender-options">
                  <label className="radio-container">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={form.gender === "Male"}
                      onChange={handleSignupChange}
                    />
                    <span className="radio-custom"></span> Male
                  </label>
                  <label className="radio-container">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={form.gender === "Female"}
                      onChange={handleSignupChange}
                    />
                    <span className="radio-custom"></span> Female
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Company</label>
                <select
                  className="login-input"
                  name="company"
                  value={form.company}
                  onChange={handleSignupChange}
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map((comp) => (
                    <option key={comp.name} value={comp.name}>
                      {comp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* File/photo upload section, untouched */}
            <div
              onClick={() => fileInputRef.current.click()}
              style={{
                border: "2px dashed #7b67ef",
                padding: "40px",
                textAlign: "center",
                cursor: "pointer",
                borderRadius: "12px",
                marginTop: "20px",
                position: "relative",
              }}
            >
              <FiUpload
                size={32}
                color="#7b67ef"
                style={{ marginBottom: "10px" }}
              />
              <div style={{ fontWeight: "600", fontSize: "1.3rem" }}>
                Drag & drop any file here
              </div>
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "1rem",
                  color: "#7b67ef",
                }}
              >
                or{" "}
                <span
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  browse file
                </span>{" "}
                from device
              </div>
              {photoPreview && (
                <button
                  type="button"
                  onClick={removePhoto}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "#fff",
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <FiX size={18} color="#7b67ef" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleSignupChange}
              style={{ display: "none" }}
              required
            />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="User Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  marginTop: "15px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "2px solid #7b67ef",
                }}
              />
            )}
            <button
              type="button"
              className="login-btn"
              onClick={handleSendOtp}
              style={{ marginTop: "20px" }}
            >
              Send OTP
            </button>
          </>
        )}
        {step === 1 && (
          <>
            <div className="login-title">OTP Verification</div>
            <input
              className="login-input"
              type="email"
              name="email"
              placeholder="Email (only gmail allowed)"
              value={form.email}
              onChange={handleSignupChange}
              required
            />
            <input
              className="login-input"
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleSignupChange}
              required
            />
            <div className="login-form-row">
              <button
                type="button"
                className="login-btn"
                onClick={handlePrev}
              >
                Back
              </button>
              <button
                type="button"
                className="login-btn"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="login-title">Set Password</div>
            <input
              className="login-input"
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleSignupChange}
              required
            />
            <input
              className="login-input"
              type="email"
              name="email"
              placeholder="Email (only gmail allowed)"
              value={form.email}
              onChange={handleSignupChange}
              required
            />
            <input
              className="login-input"
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={handleSignupChange}
              required
            />
            <input
              className="login-input"
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleSignupChange}
              required
            />
            <PasswordInput
              value={form.password}
              onChange={handleSignupChange}
              placeholder="Password"
              name="password"
              required
              show={showPassword}
              setShow={setShowPassword}
            />
            <PasswordInput
              value={form.confirmPassword}
              onChange={handleSignupChange}
              placeholder="Confirm Password"
              name="confirmPassword"
              required
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
            />
            <div className="login-form-row">
              <button
                type="button"
                className="login-btn"
                onClick={handlePrev}
              >
                Back
              </button>
              <button type="submit" className="login-btn">
                Create Account
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default SignupForm;
