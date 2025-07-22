import React from 'react';
import "../styles/EmployeeDetail.scss";

const EmployeeCard = () => {
  return (
    <div className="employee-card">
      <div className="left-side">
        <div className="profile-photo">
          <img src="https://via.placeholder.com/150" alt="Profile" />
        </div>
        <div className="employee-info">
          <h2>Benjamin Shah</h2>
          <p>Creative Manager</p>
        </div>
      </div>

      <div className="right-side">
        <div className="contact-info">
          <div className="company-name">
            <h3>Liceria & Co.</h3>
          </div>
          <div className="contact-details">
            <p><i className="fas fa-globe"></i> www.reallygreatsite.com</p>
            <p><i className="fas fa-phone"></i> +123-456-7890</p>
            <p><i className="fas fa-envelope"></i> hello@reallygreatsite.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
