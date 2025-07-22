import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCompany } from "../contexts/CompanyContext";
import MessageChatBox from "./MessageChatBox";
import { MdDashboard, MdMailOutline } from "react-icons/md";
import { FaBuilding, FaUserTie, FaClipboardList, FaUserFriends, FaKey, FaTrash } from "react-icons/fa";
import "../styles/OwnerDashboard.scss";

const functionalitiesList = [
  { key: "dashboard", label: "Dashboard" },
  { key: "attendance", label: "Attendance" },
  { key: "tasks", label: "Tasks" },
  { key: "notifications", label: "Notifications" },
  { key: "settings", label: "Settings" }
];

const OwnerDashboard = () => {
  const { companies = [], addCompany, removeCompany } = useCompany();

  const [activePage, setActivePage] = useState("dashboard");
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmailForTask, setSelectedEmailForTask] = useState("");
  const [taskText, setTaskText] = useState("");
  const [taskAssigner, setTaskAssigner] = useState("");
  const [selectedChatEmail, setSelectedChatEmail] = useState(null);

  // Fix: Add the missing states below 👇
  const [localCompanies, setLocalCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState("");
  const [tempPermissions, setTempPermissions] = useState({});

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("signup_users") || "[]");
    setRegisteredUsers(users);
    const emps = users.map((u, idx) => ({
      id: idx + 1,
      name: u.name,
      email: u.email,
      mobile: u.mobile,
      company: u.company,
      address: u.address,
      task: u.task || "No task assigned",
      tasks: u.tasks || [],
      messages: u.messages || [],
      functionalities: u.functionalities || []
    }));
    setEmployees(emps);

    // Companies
    let compList = [];
    if (typeof companies === "object" && Array.isArray(companies)) {
      compList = companies;
    } else if (localStorage.getItem("crm_companies")) {
      compList = JSON.parse(localStorage.getItem("crm_companies"));
    }
    setLocalCompanies(compList);
  }, [companies]);

  // Sync tempPermissions whenever employees changes
  useEffect(() => {
    const temp = {};
    employees.forEach(emp => {
      temp[emp.email] = emp.functionalities ? [...emp.functionalities] : [];
    });
    setTempPermissions(temp);
  }, [employees]);

  const assignTask = (e) => {
    e.preventDefault();
    if (!selectedEmailForTask || !taskText) {
      toast.error("Please fill both task fields");
      return;
    }
    const newTask = {
      task: taskText,
      completed: false,
      assigner: taskAssigner,
      date: new Date(),
    };
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.email === selectedEmailForTask
          ? {
            ...emp,
            tasks: [...(emp.tasks || []), newTask]
          }
          : emp
      )
    );
    const users = JSON.parse(localStorage.getItem("signup_users") || "[]");
    const updatedUsers = users.map((u) =>
      u.email === selectedEmailForTask
        ? {
          ...u,
          tasks: [...(u.tasks || []), newTask]
        }
        : u
    );
    localStorage.setItem("signup_users", JSON.stringify(updatedUsers));
    toast.success("Task assigned");
    setSelectedEmailForTask("");
    setTaskText("");
    setTaskAssigner("");
  };

  // Modern Chatbox logic
  const getMessagesWith = (email) => {
    const emp = employees.find((e) => e.email === email);
    return emp ? emp.messages || [] : [];
  };
  const getUnreadCountFromEmp = (emp) => {
    return (emp.messages || []).filter(
      (msg) => msg.sender !== "Owner" && !msg.read
    ).length;
  };
  const handleOpenChat = (email) => {
    setSelectedChatEmail(email);
    const users = JSON.parse(localStorage.getItem("signup_users") || "[]");
    const empUser = users.find((u) => u.email === email);
    if (empUser && empUser.messages) {
      const updatedMsgs = empUser.messages.map((msg) =>
        msg.sender !== "Owner" ? { ...msg, read: true } : msg
      );
      const updatedUsers = users.map((u) =>
        u.email === email ? { ...u, messages: updatedMsgs } : u
      );
      localStorage.setItem("signup_users", JSON.stringify(updatedUsers));
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.email === email ? { ...emp, messages: updatedMsgs } : emp
        )
      );
    }
  };

  const handleSendMsg = (text) => {
    const newMessage = {
      id: Date.now(),
      sender: "Owner",
      message: text,
      date: new Date(),
      read: false,
    };
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.email === selectedChatEmail
          ? { ...emp, messages: [...(emp.messages || []), newMessage] }
          : emp
      )
    );
    const users = JSON.parse(localStorage.getItem("signup_users") || "[]");
    const updatedUsers = users.map((u) =>
      u.email === selectedChatEmail
        ? { ...u, messages: [...(u.messages || []), newMessage] }
        : u
    );
    localStorage.setItem("signup_users", JSON.stringify(updatedUsers));
  };

  // --- ROLE ASSIGNMENT FUNCTION ---
  const handleRoleChange = (email, newRole) => {
    const users = JSON.parse(localStorage.getItem("signup_users") || "[]");
    const updatedUsers = users.map((user, idx) =>
      idx === 0 // Prevent change for index 0 (Owner)
        ? user
        : user.email === email
          ? { ...user, role: newRole }
          : user
    );
    localStorage.setItem("signup_users", JSON.stringify(updatedUsers));
    setRegisteredUsers(updatedUsers);
    toast.success(`Role updated to "${newRole}"`);
  };

  // --- COMPANY ADD/REMOVE HANDLERS ---
  const handleAddCompany = (e) => {
    e.preventDefault();
    const trimmed = newCompany.trim();
    if (!trimmed) {
      toast.error("Enter company name!");
      return;
    }
    if (
      localCompanies.some(
        (c) =>
          (typeof c === "string" ? c : c.label || c.value || "").toLowerCase() ===
          trimmed.toLowerCase()
      )
    ) {
      toast.error("Company already exists!");
      return;
    }
    const newList = [...localCompanies, trimmed];
    setLocalCompanies(newList);
    localStorage.setItem("crm_companies", JSON.stringify(newList));
    if (typeof addCompany === "function") addCompany(trimmed);
    setNewCompany("");
    toast.success("Company added!");
  };

  const handleRemoveCompany = (company, idx) => {
    let name = typeof company === "string" ? company : company.label || company.value || "";
    const newList = localCompanies.filter((c, i) => i !== idx);
    setLocalCompanies(newList);
    localStorage.setItem("crm_companies", JSON.stringify(newList));
    if (typeof removeCompany === "function") removeCompany(name);
    toast.success("Company removed!");
  };

  const renderMessagesPage = () => (
    <div className="messages-page modern-msg-list">
      <h2>
        <span className="msg-icon" role="img" aria-label="chat">💬</span>
        Messages
      </h2>
      {selectedChatEmail ? (
        <>
          <button
            onClick={() => setSelectedChatEmail(null)}
            className="back-btn"
            style={{ marginBottom: 16, marginLeft: 5 }}
          >
            ⬅ Back
          </button>
          <MessageChatBox
            currentUser="Owner"
            otherUser={selectedChatEmail}
            messages={getMessagesWith(selectedChatEmail)}
            onSendMessage={handleSendMsg}
            onMarkRead={() => { }}
          />
        </>
      ) : (
        <div className="modern-msg-cards">
          {employees.map((emp) => (
            <div className="msg-employee-card" key={emp.email}>
              <div className="msg-initial">
                {emp.name ? emp.name[0].toUpperCase() : "?"}
              </div>
              <div className="msg-emp-details">
                <div className="msg-emp-name">{emp.name}</div>
                <div className="msg-emp-email">{emp.email}</div>
              </div>
              <button
                className="msg-chat-btn"
                onClick={() => handleOpenChat(emp.email)}
                style={{ position: "relative" }}
              >
                <svg height="20" viewBox="0 0 24 24" width="20" fill="#fff" style={{ marginRight: 4 }}>
                  <path d="M21 6.5a2.5 2.5 0 0 0-2.5-2.5h-13a2.5 2.5 0 0 0-2.5 2.5v7a2.5 2.5 0 0 0 2.5 2.5h2.09l.72.88c.21.26.5.62.76.95.22.29.63.29.85 0l.76-.95.72-.88H18.5A2.5 2.5 0 0 0 21 13.5v-7zm-10.5 8.5h-2a1.5 1.5 0 0 1-1.5-1.5v-7A1.5 1.5 0 0 1 8.5 5.5h7a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-2l-1 1.25L10.5 15z" />
                </svg>
                Chat
                {getUnreadCountFromEmp(emp) > 0 && (
                  <span className="msg-unread-badge">
                    {getUnreadCountFromEmp(emp)}
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // --- TASKS PAGE (helper for content switch) ---
  const renderTasksPage = () => (
    <div className="tasks-page">
      <h2>📋 Assign Task</h2>
      <form onSubmit={assignTask} className="assign-task-form">
        <select
          value={selectedEmailForTask}
          onChange={(e) => setSelectedEmailForTask(e.target.value)}
          required
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp.email} value={emp.email}>
              {emp.name} ({emp.email})
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Enter task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Task Assigner (optional)"
          value={taskAssigner}
          onChange={(e) => setTaskAssigner(e.target.value)}
        />
        <button type="submit">Assign Task</button>
      </form>

      {/* Task Table */}
      <div className="tasks-list-section" style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 8 }}>Assigned Tasks</h3>
        <table className="simple-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Task</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {employees
              .flatMap((emp) =>
                (emp.tasks || []).map((t, i) => ({
                  ...t,
                  empName: emp.name,
                  empEmail: emp.email,
                  key: `${emp.email}-${i}`,
                }))
              )
              .sort((a, b) => new Date(b.date) - new Date(a.date)) // latest first
              .map((task, idx) => (
                <tr key={task.key}>
                  <td>{idx + 1}</td>
                  <td>
                    {task.empName} <br />
                    <span style={{ fontSize: 12, color: "#888" }}>{task.empEmail}</span>
                  </td>
                  <td>{task.task}</td>
                  <td>
                    <span style={{
                      color: task.completed ? "#17b978" : "#d7263d",
                      fontWeight: "bold",
                    }}>
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>
                    {task.date ? new Date(task.date).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- COMPANIES PAGE (WITHOUT Employee Count) ---
  const renderCompaniesPage = () => (
    <div className="companies-page">
      <h2>🏢 Companies</h2>
      <form onSubmit={handleAddCompany} className="company-add-form" style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Enter company name"
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button type="submit">Add Company</button>
      </form>
      {localCompanies.length === 0 ? (
        <div>No companies found.</div>
      ) : (
        <table className="simple-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Company Name</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {localCompanies.map((company, idx) => {
              const name =
                typeof company === "string"
                  ? company
                  : company.label || company.value || "Unnamed Company";
              return (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{name}</td>
                  <td>
                    <button
                      className="delete-icon-btn"
                      title="Delete"
                      onClick={() => handleRemoveCompany(company, idx)}
                    >
                      <FaTrash size={20} color="red" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );

  // --- USERS PAGE ---
  const renderUsersPage = () => (
    <div className="users-page" style={{ width: "100%" }}>
      <h2>🧑‍💼 Users</h2>
      {registeredUsers.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <table className="simple-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Company</th>
              <th>Address</th>
              <th>Role</th>
              <th>Change Role</th>
            </tr>
          </thead>
          <tbody>
            {registeredUsers.map((user, idx) => (
              <tr key={user.email || idx}>
                <td>{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.mobile}</td>
                <td>{user.company}</td>
                <td>{user.address}</td>
                <td>
                  {idx === 0
                    ? "Owner"
                    : user.role === "Owner"
                      ? "Employee"
                      : user.role || "Employee"}
                </td>
                <td>
                  {idx === 0 ? (
                    <span style={{ fontWeight: "bold", color: "#0a0" }}>
                      Owner
                    </span>
                  ) : (
                    <select
                      value={
                        user.role === "Owner" || !user.role
                          ? "Employee"
                          : user.role
                      }
                      onChange={(e) =>
                        handleRoleChange(user.email, e.target.value)
                      }
                      style={{
                        minWidth: 90,
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      <option value="Employee">Employee</option>
                      <option value="Admin">Admin</option>
                      <option value="Owner" disabled>
                        Owner
                      </option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // --- EMPLOYEES PAGE (SHOW ROLE) ---
  const renderEmployeesPage = () => (
    <div className="employees-page">
      <h2>👷‍♂️ Employees</h2>
      {employees.length === 0 ? (
        <div>No employees found.</div>
      ) : (
        <table className="simple-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Company</th>
              <th>Address</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => {
              const userRec = registeredUsers.find(
                (u) => u.email === emp.email
              );
              let role = "Employee";
              if (userRec) {
                role = userRec.role || (idx === 0 ? "Owner" : "Employee");
              }
              if (idx === 0) role = "Owner";
              return (
                <tr key={emp.email || idx}> 
                  <td>{idx + 1}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.mobile}</td>
                  <td>{emp.company}</td>
                  <td>{emp.address}</td>
                  <td>{role}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );

  // --- PERMISSIONS PAGE WITH "UPDATE ALL" BUTTON ---
  const renderPermissionsPage = () => (
    <div className="nav-permission-section">
      <h2>🔑 Navigation Permissions</h2>
      {employees.length === 0 ? (
        <div>No employees found.</div>
      ) : (
        <>
          <div style={{ marginBottom: 16, textAlign: "right" }}>
            <button
              onClick={() => {
                // Bulk update all permissions
                setEmployees((prev) =>
                  prev.map((emp) => ({
                    ...emp,
                    functionalities: tempPermissions[emp.email] || []
                  }))
                );
                // Bulk update localStorage
                const users = JSON.parse(localStorage.getItem("signup_users") || "[]");
                const updatedUsers = users.map((u) => ({
                  ...u,
                  functionalities: tempPermissions[u.email] || []
                }));
                localStorage.setItem("signup_users", JSON.stringify(updatedUsers));
                toast.success("All permissions updated!");
              }}
              className="update-all-btn"
            >
              Update All Permissions
            </button>

          </div>
          <table className="nav-permission-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {functionalitiesList.map((f) => (
                  <th key={f.key}>{f.label}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.email}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  {functionalitiesList.map((f) => (
                    <td key={f.key} style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={tempPermissions[emp.email]?.includes(f.key) || false}
                        onChange={(e) => {
                          setTempPermissions((prev) => {
                            const updated = prev[emp.email]
                              ? [...prev[emp.email]]
                              : [];
                            if (e.target.checked) {
                              if (!updated.includes(f.key)) updated.push(f.key);
                            } else {
                              const idx = updated.indexOf(f.key);
                              if (idx > -1) updated.splice(idx, 1);
                            }
                            return { ...prev, [emp.email]: updated };
                          });
                        }}
                        style={{ accentColor: "#b90000" }}
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => {
                        // Save for this employee only
                        setEmployees((prev) =>
                          prev.map((e2) =>
                            e2.email === emp.email
                              ? { ...e2, functionalities: tempPermissions[emp.email] || [] }
                              : e2
                          )
                        );
                        // Update in localStorage
                        const users = JSON.parse(localStorage.getItem("signup_users") || "[]");
                        const updatedUsers = users.map((u) =>
                          u.email === emp.email ? { ...u, functionalities: tempPermissions[emp.email] || [] } : u
                        );
                        localStorage.setItem("signup_users", JSON.stringify(updatedUsers));
                        toast.success(`Permissions updated for ${emp.name}`);
                      }}
                      style={{
                        padding: "8px 28px",
                        borderRadius: "14px",
                        background: "#fffbe8",
                        color: "#1ab394",
                        border: "2px solid #1ab394",
                        fontWeight: "700",
                        fontSize: "1.12rem",
                        letterSpacing: "0.02em",
                        cursor: "pointer",
                        boxShadow: "0 2px 10px #c0001014",
                        transition: "all 0.15s"
                      }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );

  // Render content switcher
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <h2>Welcome to Owner Dashboard</h2>;
      case "companies":
        return renderCompaniesPage();
      case "users":
        return renderUsersPage();
      case "tasks":
        return renderTasksPage();
      case "messages":
        return renderMessagesPage();
      case "employees":
        return renderEmployeesPage();
      case "permissions":
        return renderPermissionsPage();
      default:
        return <h2>Page not found</h2>;
    }
  };

  return (
    <div className="owner-dashboard-layout">
      <aside className="owner-sidebar">
        <div className="owner-sidebar__title">CRM Owner</div>
        <nav className="owner-sidebar__nav">
          <a className={activePage === "dashboard" ? "active" : ""} onClick={() => setActivePage("dashboard")}>
            <MdDashboard size={22} style={{ marginRight: 10 }} />
            <span>Dashboard</span>
          </a>
          <a className={activePage === "companies" ? "active" : ""} onClick={() => setActivePage("companies")}>
            <FaBuilding size={22} style={{ marginRight: 10 }} />
            <span>Companies</span>
          </a>
          <a className={activePage === "users" ? "active" : ""} onClick={() => setActivePage("users")}>
            <FaUserTie size={22} style={{ marginRight: 10 }} />
            <span>Users</span>
          </a>
          <a className={activePage === "tasks" ? "active" : ""} onClick={() => setActivePage("tasks")}>
            <FaClipboardList size={22} style={{ marginRight: 10 }} />
            <span>Tasks</span>
          </a>
          <a className={activePage === "messages" ? "active" : ""} onClick={() => setActivePage("messages")}>
            <MdMailOutline size={22} style={{ marginRight: 10 }} />
            <span>Messages</span>
          </a>
          <a className={activePage === "employees" ? "active" : ""} onClick={() => setActivePage("employees")}>
            <FaUserFriends size={22} style={{ marginRight: 10 }} />
            <span>Employees</span>
          </a>
          <a className={activePage === "permissions" ? "active" : ""} onClick={() => setActivePage("permissions")}>
            <FaKey size={22} style={{ marginRight: 10 }} />
            <span>Permissions</span>
          </a>
        </nav>
      </aside>

      <main className="owner-main">{renderContent()}</main>
    </div>
  );
};

export default OwnerDashboard;
