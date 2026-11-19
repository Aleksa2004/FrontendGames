import { useState, useEffect } from "react";
import { MessageSquare, X, Send, Plus } from "lucide-react";
import GameCard from "./GameCard";

export default function ChatWidget({ token, onSelectGame }) {
  const [open, setOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    fetch("http://localhost:8080/api/chat/sessions", {
      headers: { Authorization: `Bearer ${token}` },
    })
     .then((res) => res.json())
      .then((data) => {
        console.log("SESSIONS FROM BACKEND:", data);
        setSessions(data);
      })
      .catch((err) => console.error(err));
  }, [open, token]);

  const parseBotContent = (raw) => {
    try {
      return JSON.parse(raw);
    } catch {
      return { answer: raw, games: [] };
    }
  };
const loadSession = (sessionId) => {
  console.log("LOAD SESSION CLICKED:", sessionId);

  setActiveSessionId(sessionId);
  setMessages([]);

  fetch(`http://localhost:8080/api/chat/sessions/${sessionId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("MESSAGES FROM BACKEND:", data);

      const parsed = data.map((m) =>
        m.role === "BOT"
          ? { role: "BOT", ...parseBotContent(m.content) }
          : { role: "USER", answer: m.content, games: [] }
      );

      setMessages(parsed);
    })
    .catch((err) => console.error(err));
};

  const startNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setError(null);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "USER", answer: text, games: [] }]);
    setSending(true);

    try {
      let sessionId = activeSessionId;

      if (!sessionId) {
        const createRes = await fetch("http://localhost:8080/api/chat/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: text }),
        });
        if (!createRes.ok) throw new Error("Failed to create chat session");
        const session = await createRes.json();
        sessionId = session.id;
        setActiveSessionId(sessionId);
        setSessions((prev) => [session, ...prev]);
      }

      const msgRes = await fetch(
        `http://localhost:8080/api/chat/sessions/${sessionId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: text }),
        }
      );
      if (!msgRes.ok) throw new Error("Failed to send message");

      const data = await msgRes.json();
      console.log("CHAT RESPONSE:", data);
      setMessages((prev) => [...prev, { role: "BOT", answer: data.answer, games: data.games || [] }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {!open && (
        <button className="chat-toggle" onClick={() => setOpen(true)}>
          <MessageSquare size={20} />
        </button>
      )}

      {open && (
        <div className="chat-panel">
          <div className="chat-panel__sidebar">
            <div className="chat-panel__sidebar-header">
              <span>Chats</span>
              <button className="chat-panel__new" onClick={startNewChat}>
                <Plus size={15} />
              </button>
            </div>
            <div className="chat-panel__sessions">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  className={
                    s.id === activeSessionId
                      ? "chat-panel__session chat-panel__session--active"
                      : "chat-panel__session"
                  }
                  onClick={() => loadSession(s.id)}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-panel__main">
            <div className="chat-panel__header">
              <span>Game Assistant</span>
              <button className="chat-panel__close" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="chat-panel__messages">
              {messages.length === 0 && (
                <p className="chat-panel__empty">Ask me to help you find a game...</p>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`chat-panel__message chat-panel__message--${msg.role.toLowerCase()}`}>
                  <p>{msg.answer}</p>
                  {msg.games && msg.games.length > 0 && (
                    <div className="chat-panel__games">
                      {msg.games.map((game) => (
                        <GameCard key={game.id} game={game} onClick={(game) => {console.log("GAME FROM CHAT:",game); onSelectGame(game);}} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {error && <p className="chat-panel__error">{error}</p>}
            </div>

            <div className="chat-panel__input-row">
              <input
                className="chat-panel__input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                disabled={sending}
              />
              <button className="chat-panel__send" onClick={sendMessage} disabled={sending}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}