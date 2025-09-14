import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import "./App.css";

function App() {
  const [sessionId, setSessionId] = useState(() => Math.random().toString(36).substring(7));

  return (
    <div className="App">
      <h1>📰 RAG-Powered News Chatbot</h1>
      <Chat sessionId={sessionId} />
    </div>
  );
}

export default App;