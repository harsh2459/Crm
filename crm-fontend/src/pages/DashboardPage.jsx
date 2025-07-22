import React from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaRegAddressCard } from "react-icons/fa"; // Import React Icons
import "../styles/DashboardPage.scss"; // Import SCSS file

const DashboardPage = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/auth");
  };

  const goToOwner = () => {
    navigate("/OwnerDashboard"); // Redirect to owner page
  };

  const goToEmployee = () => {
    navigate("/employeeDashboard"); // Redirect to employee page
  };

  return (
    <div className="dashboard-container">
      <div className="role-selection-container">
        <h2>Please select your role</h2>
        <p className="description">
          Lorem ipsum dolor sit amet consectetur. Faucibus mi congue augue purus est consequat purus pulvinar sed leo gravida etiam molestie.
        </p>

        <div className="role-options">
          <div
            className="role-option"
            onClick={goToOwner}
            role="button"
            aria-label="Select Owner Role"
          >
            <div className="role-icon">
              <FaChalkboardTeacher size={50} /> {/* Use the Teacher Icon */}
            </div>
            <p className="role-label">Owner</p>
          </div>

          <div
            className="role-option"
            onClick={goToEmployee}
            role="button"
            aria-label="Select Employee Role"
          >
            <div className="role-icon">
              <FaRegAddressCard size={50} /> {/* Use the Address Card Icon */}
            </div>
            <p className="role-label">Employee</p>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
