import React, { useState, useRef, useEffect } from "react";
import "../styles/MessageChatBox.scss";

const getTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const MessageChatBox = ({
  currentUser,
  otherUser,
  messages,
  onSendMessage,
  onMarkRead,
}) => {
  const [msgText, setMsgText] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!msgText.trim()) return;
    onSendMessage(msgText.trim());
    setMsgText("");
  };

  // Support Shift+Enter for newline, Enter for send
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend();
      e.preventDefault();
    }
    // Shift+Enter is handled naturally for textarea
  };

  return (
    <div className="chatbox-ui">
      <div className="chatbox-header">
        <span role="img" aria-label="Chat">💬</span> Chat with {otherUser}
      </div>
      <div className="chatbox-body">
        {messages.length === 0 && (
          <div className="chatbox-empty">
            <img
              src="https://cdn-icons-png.flaticon.com/512/616/616494.png"
              width={50}
              style={{ opacity: 0.25, marginBottom: 10 }}
              alt="No chat"
            />
            <div style={{ color: "#aaa" }}>No messages yet</div>
          </div>
        )}
        {messages.map((msg, idx) => {
          const mine = msg.sender === currentUser;
          return (
            <div
              key={idx}
              className={`chat-msg-row ${mine ? "mine" : "theirs"}`}
              onClick={() =>
                !msg.read && !mine && onMarkRead && onMarkRead(idx)
              }
            >
              <div
                className={`chat-bubble ${msg.read && !mine ? "read" : ""}`}
                tabIndex={0}
                aria-label={`${mine ? "You" : otherUser} said ${msg.message}`}
              >
                <div className="chat-meta">
                  <span className="chat-user">{mine ? "You" : otherUser}</span>
                  <span className="chat-time">{getTime(msg.date)}</span>
                </div>
                <div className="chat-msg-text">{msg.message}</div>
                {mine && msg.read && (
                  <div className="chat-read-tick" title="Read by other user">✔️ Read</div>
                )}
              </div>
            </div>

            
          );
        })}
        <div ref={chatEndRef} />
      </div>
      <div className="chatbox-footer">
        <textarea
          placeholder="Type your message..."
          value={msgText}
          onChange={(e) => setMsgText(e.target.value)}
          onKeyDown={handleInputKeyDown}
          rows={1}
          aria-label="Type your message"
        />
        <button onClick={handleSend} disabled={!msgText.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageChatBox;
