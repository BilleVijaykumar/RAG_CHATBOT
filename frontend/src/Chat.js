import React, { useState, useEffect } from "react";
import axios from "axios";

function Chat({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    axios.get(`/api/history/${sessionId}`).then(res => setMessages(res.data));
  }, [sessionId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const res = await axios.post("/api/chat", { sessionId, query: input });
    setMessages([...messages, { role: "user", content: input }, { role: "assistant", content: res.data.answer }]);
    setInput("");
  };

  const resetSession = async () => {
    await axios.post("/api/reset", { sessionId });
    setMessages([]);
  };

  return (
    <div>
      <div className="chat-box">
        {messages.map((m, i) => (
          <p key={i} className={m.role}>{m.role}: {m.content}</p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me something..." />
      <button onClick={sendMessage}>Send</button>
      <button onClick={resetSession}>Reset</button>
    </div>
  );
}

export default Chat;