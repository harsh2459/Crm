import React, { useState, useEffect } from "react";
import "../styles/UsersPage.scss";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("signup_users") || "[]");
    setUsers(storedUsers);
  }, []);

  return (
    <div className="users-page">
      <h2>Registered Users</h2>
      {users.length === 0 ? (
        <p>No registered users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Company</th>
              <th>Address</th>
              <th>Registered On</th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ email, name, mobile, company, address, created }, idx) => (
              <tr key={idx}>
                <td>{name}</td>
                <td>{email}</td>
                <td>{mobile}</td>
                <td>{company}</td>
                <td>{address}</td>
                <td>{new Date(created).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersPage;
