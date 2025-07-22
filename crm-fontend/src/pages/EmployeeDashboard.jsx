import React, { useState, useEffect } from "react";
import MessageChatBox from "./MessageChatBox";
import "./../styles/EmployeeDashboard.scss";

const NO_TASKS_IMG = "https://cdn-icons-png.flaticon.com/512/4076/4076549.png";

const allFunctionalitiesList = [
  { key: "dashboard", label: "Dashboard", icon: "🏠" },
  { key: "attendance", label: "Attendance", icon: "📅" },
  { key: "tasks", label: "Tasks", icon: "📝" },
  { key: "notifications", label: "Notifications", icon: "📢" },
  { key: "settings", label: "Settings", icon: "⚙️" }
];

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
  const [allowedFunctionalities, setAllowedFunctionalities] = useState([]);
  const [chatPartner, setChatPartner] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      window.location.href = "/login";
      return;
    }
    const email = loggedInUser.email;
    setEmployeeEmail(email);

    const users = JSON.parse(localStorage.getItem("signup_users") || "[]");
    const employee = users.find((user) => user.email === email);
    if (employee) {
      setTasks(Array.isArray(employee.tasks) ? employee.tasks : []);
      setMessages(Array.isArray(employee.messages) ? employee.messages : []);
      setAllowedFunctionalities(employee.functionalities || []);
    } else {
      setTasks([]);
      setMessages([]);
      setAllowedFunctionalities([]);
    }
  }, []);

  useEffect(() => {
    if (
      allowedFunctionalities.length > 0 &&
      !allowedFunctionalities.includes(activePage)
    ) {
      setActivePage(allowedFunctionalities[0]);
    }
  }, [allowedFunctionalities]); // eslint-disable-line

  useEffect(() => {
    if (
      activePage === "notifications" &&
      employeeEmail &&
      messages.some((m) => !m.read && m.sender !== employeeEmail)
    ) {
      const updatedMessages = messages.map((m) =>
        m.sender !== employeeEmail ? { ...m, read: true } : m
      );
      setMessages(updatedMessages);

      const users = JSON.parse(localStorage.getItem("signup_users") || "[]");
      const updatedUsers = users.map((u) =>
        u.email === employeeEmail ? { ...u, messages: updatedMessages } : u
      );
      localStorage.setItem("signup_users", JSON.stringify(updatedUsers));
    }
  }, [activePage, employeeEmail, messages]);

  const unreadCount = messages.filter(
    (m) => !m.read && m.sender !== employeeEmail
  ).length;

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task, index) =>
      index === id ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);

    const users = JSON.parse(localStorage.getItem("signup_users") || "[]");
    const updatedUsers = users.map((user) =>
      user.email === employeeEmail ? { ...user, tasks: updatedTasks } : user
    );
    localStorage.setItem("signup_users", JSON.stringify(updatedUsers));
  };

  const handleSendMsg = (text) => {
    const newMsg = {
      id: Date.now(),
      sender: employeeEmail,
      message: text,
      date: new Date(),
      read: false,
    };
    const updatedMsgs = [...messages, newMsg];
    setMessages(updatedMsgs);
    const users = JSON.parse(localStorage.getItem("signup_users") || "[]");
    const updatedUsers = users.map((u) =>
      u.email === employeeEmail
        ? { ...u, messages: updatedMsgs }
        : u
    );
    localStorage.setItem("signup_users", JSON.stringify(updatedUsers));
  };

  const handleMarkRead = (idx) => {
    const updatedMessages = messages.map((m, i) =>
      i === idx ? { ...m, read: true } : m
    );
    setMessages(updatedMessages);
    const users = JSON.parse(localStorage.getItem("signup_users") || "[]");
    const updatedUsers = users.map((u) =>
      u.email === employeeEmail ? { ...u, messages: updatedMessages } : u
    );
    localStorage.setItem("signup_users", JSON.stringify(updatedUsers));
  };

  const handleSidebarClick = (page) => setActivePage(page);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div>
            <h2>Welcome, {employeeEmail}</h2>
            <p>Your daily performance summary</p>
          </div>
        );
      case "attendance":
        // This is not needed, because clicking "Attendance" will open external link instead
        return null;
      case "tasks":
        return (
          <div className="tasks-section">
            <div className="tasks-card-container">
              <h3>
                <span role="img" aria-label="clipboard">📋</span> Today’s Tasks
              </h3>
              <div className="task-list">
                {tasks.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#aaa", marginTop: "70px" }}>
                    <img
                      src={NO_TASKS_IMG}
                      alt="No tasks"
                      width={80}
                      style={{ opacity: 0.45, marginBottom: 10 }}
                    />
                    <div>No tasks assigned</div>
                  </div>
                ) : (
                  tasks.map((task, idx) => (
                    <div
                      className="task-card"
                      key={idx}
                      onClick={() => !task.completed && toggleTaskCompletion(idx)}
                      title={
                        task.completed
                          ? "Task already completed"
                          : "Click to mark as complete"
                      }
                      style={{
                        cursor: task.completed ? "default" : "pointer",
                        opacity: task.completed ? 0.7 : 1,
                        pointerEvents: task.completed ? "none" : "auto"
                      }}
                    >
                      <div className="task-icon">
                        {task.completed ? (
                          <svg width="22" height="22" viewBox="0 0 22 22">
                            <circle cx="11" cy="11" r="11" fill="#43a047" />
                            <polyline
                              points="6,12 10,16 16,7"
                              fill="none"
                              stroke="#fff"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : (
                          <svg width="22" height="22" viewBox="0 0 22 22">
                            <circle cx="11" cy="11" r="11" fill="#bdbdbd" />
                          </svg>
                        )}
                      </div>
                      <div className="task-info">
                        <div className={`task-title${task.completed ? " completed" : ""}`}>
                          {task.task}
                        </div>
                        {task.assigner && (
                          <div className="task-assigner">
                            <strong>Assigned by:</strong> {task.assigner}
                          </div>
                        )}
                        <div className="task-date">
                          {task.date && new Date(task.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="notifications-section">
            <h3>📢 Messages</h3>
            <div className="contact-list">
              {JSON.parse(localStorage.getItem("signup_users") || "[]").map((user) => (
                <div key={user.email} className="contact-item">
                  <div className="contact-name">
                    <span className="contact-initial">{user.name[0]}</span>
                    {user.name}
                  </div>
                  <div className="contact-email">{user.email}</div>
                  <button
                    className="chat-button"
                    onClick={() => setChatPartner(user)}
                  >
                    Chat
                  </button>
                </div>
              ))}
            </div>
            {chatPartner && (
              <MessageChatBox
                currentUser={employeeEmail}
                otherUser={chatPartner.email}
                messages={messages.filter(
                  (msg) =>
                    (msg.receiver === chatPartner.email || msg.sender === chatPartner.email)
                )}
                onSendMessage={handleSendMsg}
              />
            )}
          </div>
        );
      case "settings":
        return (
          <div>
            <h3>⚙️ Settings</h3>
            <p>Settings options go here.</p>
          </div>
        );
      default:
        return <p>Page not found.</p>;
    }
  };

  return (
    <div className="employee-dashboard">
      <aside className="sidebar">
        <h2>👨‍💼 Employee Panel</h2>
        <ul>
          {allFunctionalitiesList
            .filter((item) =>
              allowedFunctionalities.length === 0
                ? true
                : allowedFunctionalities.includes(item.key)
            )
            .map((item) =>
              item.key === "attendance" ? (
                <li
                  key={item.key}
                  className={activePage === item.key ? "active" : ""}
                  onClick={() =>
                    window.open(
                      "http://192.168.1.50/attendance_system/ADMIN/dashboard.php",
                      "_blank"
                    )
                  }
                  style={{ cursor: "pointer" }}
                >
                  {item.icon} {item.label}
                </li>
              ) : (
                <li
                  key={item.key}
                  onClick={() => handleSidebarClick(item.key)}
                  className={activePage === item.key ? "active" : ""}
                >
                  {item.icon} {item.label}
                  {item.key === "notifications" && unreadCount > 0 && (
                    <span className="notif-badge">{unreadCount}</span>
                  )}
                </li>
              )
            )}
        </ul>
      </aside>
      <div className="dashboard-content">
        <div className="top-bar">
          <div className="welcome-msg">{employeeEmail}</div>
          <div className="profile">
            <img
              src="https://i.pravatar.cc/100?img=68"
              alt="Profile"
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
              }}
            />
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
