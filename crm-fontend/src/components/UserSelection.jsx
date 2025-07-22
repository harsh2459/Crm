import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserSelection = ({ employeeId }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatRoomId, setChatRoomId] = useState(null);
  const navigate = useNavigate();

  // Fetch employees (users) to select from
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/chat_rooms/${employeeId}`);
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        toast.error("Error loading users.");
      }
    };

    fetchUsers();
  }, [employeeId]);

  // Handle selecting another employee to chat with
  const handleSelectUser = async (selectedUserId) => {
    setSelectedUser(selectedUserId);

    try {
      // Create or get the chat room between employeeId and selectedUserId
      const res = await fetch("http://localhost:5000/api/chat_room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empId1: employeeId, empId2: selectedUserId }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create or fetch chat room.");
        return;
      }

      // Set chat room ID and redirect to chat interface
      setChatRoomId(data.chatRoomId);
      navigate(`/chat/${data.chatRoomId}`);
    } catch (error) {
      toast.error("Error creating or fetching chat room.");
    }
  };

  // Fetch messages for the current chat room
  const fetchMessages = async () => {
    if (!chatRoomId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/messages/${chatRoomId}`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      toast.error("Error fetching messages.");
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const data = {
      chatRoomId,
      sender: employeeId,
      receiver: selectedUser,
      message,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/send/${chatRoomId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const response = await res.json();

      if (!res.ok) {
        toast.error(response.error || "Failed to send message.");
        return;
      }

      // Add message to the message list
      setMessages((prevMessages) => [...prevMessages, data]);
      setMessage(""); // Clear the input field
    } catch (error) {
      toast.error("Error sending message.");
    }
  };

  // Auto-fetch messages every 3 seconds (polling method)
  useEffect(() => {
    if (chatRoomId) {
      const intervalId = setInterval(fetchMessages, 3000); // Fetch messages every 3 seconds
      return () => clearInterval(intervalId); // Cleanup on component unmount
    }
  }, [chatRoomId]);

  return (
    <div>
      {!chatRoomId ? (
        <div>
          <h2>Select a User to Chat</h2>
          <ul>
            {users.map((user) => (
              <li key={user._id} onClick={() => handleSelectUser(user._id)}>
                {user.name} ({user.employeeCode})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h3>Chat Room</h3>
          <div>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.sender === employeeId ? "You" : msg.sender}: </strong>
                {msg.message}
              </div>
            ))}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
      hello
    </div>
  );
};

export default UserSelection;
