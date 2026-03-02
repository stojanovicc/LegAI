// src/pages/AiAssistant.jsx
import { useEffect, useRef, useState } from "react";
import client from "../api/client";
import {
  FiMessageCircle,
  FiPlus,
  FiTrash2,
  FiClock,
  FiSend,
} from "react-icons/fi";

export default function AiAssistant() {
  const [sessions, setSessions] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);

  const [input, setInput] = useState("");
  const [error, setError] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const messagesContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (!messagesContainerRef.current) return;
    const el = messagesContainerRef.current;
    el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSessions = async () => {
    try {
      setLoadingSessions(true);
      const res = await client.get("/AiChat/sessions/my");
      setSessions(res.data || []);
      if (!selectedId && res.data && res.data.length > 0) {
        setSelectedId(res.data[0].id);
      }
    } catch (err) {
      console.error("Greška pri učitavanju sesija:", err);
      setError("Nije moguće učitati AI razgovore.");
    } finally {
      setLoadingSessions(false);
    }
  };

  const loadMessages = async (sessionId) => {
    if (!sessionId) return;
    try {
      setLoadingMessages(true);
      const res = await client.get(`/AiChat/sessions/${sessionId}`);
      const data = res.data;
      const msgs = data.messages || data.Messages || [];
      setMessages(msgs);
    } catch (err) {
      console.error("Greška pri učitavanju poruka:", err);
      setError("Nije moguće učitati poruke za izabrani razgovor.");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (selectedId) {
      loadMessages(selectedId);
    } else {
      setMessages([]);
    }
  }, [selectedId]);

  const handleNewChat = async () => {
    try {
      setCreating(true);
      setError(null);
      const res = await client.post("/AiChat/sessions", {
        title: null,
        firstMessage: input.trim() || null,
      });

      const sessionId = res.data.id || res.data.Id;
      await loadSessions();
      setSelectedId(sessionId);
      setInput("");
    } catch (err) {
      console.error("Greška pri kreiranju nove sesije:", err);
      setError("Nije moguće kreirati novu AI sesiju.");
    } finally {
      setCreating(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!selectedId) {
      await handleNewChat();
      return;
    }

    setSending(true);
    setError(null);

    try {
      const userText = input.trim();
      setInput("");

      const res = await client.post(
        `/AiChat/sessions/${selectedId}/messages`,
        { text: userText }
      );

      const newMessages = res.data.messages || res.data.Messages || [];
      setMessages((prev) => [...prev, ...newMessages]);

      await loadSessions();
    } catch (err) {
      console.error("Greška pri slanju poruke:", err);
      setError("Nije moguće poslati poruku AI asistentu.");
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || sending || creating) return;
    handleSend();
  };

  const handleDeleteSessionRequest = (session) => {
    setSessionToDelete(session);
    setDeleteModalOpen(true);
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;

    try {
      await client.delete(`/AiChat/sessions/${sessionToDelete.id}`);

      setSessions((prev) => prev.filter((s) => s.id !== sessionToDelete.id));

      if (selectedId === sessionToDelete.id) {
        setSelectedId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Greška pri brisanju razgovora:", err);
      alert("Nije moguće obrisati razgovor. Pokušaj ponovo kasnije.");
    } finally {
      setDeleteModalOpen(false);
      setSessionToDelete(null);
    }
  };

  const cancelDeleteSession = () => {
    setDeleteModalOpen(false);
    setSessionToDelete(null);
  };


  const formatTime = (val) => {
    if (!val) return "";
    const d = new Date(val);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="ai-page">
      <div className="ai-shell">
        {/* LEVA STRANA – istorija razgovora */}
        <aside className="ai-sidebar glass-card">
          <div className="ai-sidebar-header">
            <div className="ai-sidebar-title">
              <FiMessageCircle />
              <span>AI asistent</span>
            </div>
            <button
              className="btn btn-outline btn-small"
              type="button"
              onClick={handleNewChat}
              disabled={creating}
            >
              <FiPlus />
              Novi
            </button>
          </div>

          <p className="ai-sidebar-subtitle">
            Istorija razgovora sa AI pravnim asistentom. Svaki razgovor se
            čuva za kasniji pregled.
          </p>

          {loadingSessions ? (
            <p className="ai-sidebar-empty">Učitavanje razgovora...</p>
          ) : sessions.length === 0 ? (
            <p className="ai-sidebar-empty">
              Još uvek nemaš nijedan razgovor. Napiši pitanje u polju desno da
              započneš prvi.
            </p>
          ) : (
            <ul className="ai-session-list">
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className={
                    s.id === selectedId
                      ? "ai-session-item ai-session-item--active"
                      : "ai-session-item"
                  }
                  onClick={() => setSelectedId(s.id)}
                >
                  <div className="ai-session-main">
                    <div className="ai-session-title">
                      {s.title || "AI razgovor"}
                    </div>
                    <button
                      className="ai-session-delete"
                      onClick={(e) => {
                        e.stopPropagation();        // 🔴 spreči bubble
                        handleDeleteSessionRequest(s);
                      }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="ai-session-meta">
                    <FiClock />
                    <span>
                      {new Date(
                        s.updatedAt || s.UpdatedAt || s.createdAt
                      ).toLocaleString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* DESNA STRANA – chat */}
        <section className="ai-chat glass-card">
          <div className="ai-chat-header">
            <div>
              <h2>Razgovor sa AI asistentom</h2>
              <p>
                Postavi pitanje ili nalepi klauzulu. AI će dati sažeto,
                edukativno objašnjenje — ne pravni savet.
              </p>
            </div>
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 8 }}>
              {error}
            </div>
          )}

          <div className="ai-messages" ref={messagesContainerRef}>
            {loadingMessages ? (
              <p className="ai-sidebar-empty">Učitavanje poruka...</p>
            ) : messages.length === 0 ? (
              <div className="ai-empty-chat">
                <p>
                  Započni razgovor tako što ćeš u polju ispod postaviti pitanje
                  ili nalepiti deo ugovora koji želiš da razumeš.
                </p>
              </div>
            ) : (
              <>
                {messages.map((m) => {
                  const sender =
                    m.sender || m.Sender || (m.isUser ? "user" : "assistant");
                  const text = m.text || m.Text || m.content || m.Content || "";
                  const createdAt =
                    m.createdAt || m.CreatedAt || m.timestamp || m.Timestamp;

                  const isUser = sender === "user";
                  return (
                    <div
                      key={m.id}
                      className={
                        isUser
                          ? "ai-message ai-message--user"
                          : "ai-message ai-message--assistant"
                      }
                    >
                      <div className="ai-message-bubble">
                        {text}
                        <span className="ai-message-time">
                          {formatTime(createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {(sending || creating) && (
              <div className="ai-message ai-message--assistant ai-typing">
                <div className="ai-message-bubble">
                  <span className="ai-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                  <span className="ai-typing-text">
                    AI obrađuje tvoje pitanje...
                  </span>
                </div>
              </div>
            )}
          </div>

          <form className="ai-input-bar" onSubmit={handleSubmit}>
            <textarea
              className="ai-input"
              rows={2}
              placeholder="Postavi pitanje ili nalepi klauzulu koju želiš da razumeš..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={sending || creating || !input.trim()}
            >
              <FiSend className="btn-icon" />
              <span>Pošalji</span>
            </button>
          </form>
        </section>
        {deleteModalOpen && (
          <div className="ai-delete-modal-overlay">
            <div className="ai-delete-modal">
              <h3>Obrisati razgovor?</h3>
              <p>
                Da li sigurno želiš da obrišeš ovaj razgovor sa AI asistentom?
                <br />
                <span className="ai-delete-modal-hint">
                  Istorija poruka biće trajno uklonjena.
                </span>
              </p>

              <div className="ai-delete-modal-actions">
                <button
                  type="button"
                  className="ai-delete-btn-confirm"
                  onClick={confirmDeleteSession}
                >
                  Obriši
                </button>
                <button
                  type="button"
                  className="ai-delete-btn-cancel"
                  onClick={cancelDeleteSession}
                >
                  Otkaži
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
