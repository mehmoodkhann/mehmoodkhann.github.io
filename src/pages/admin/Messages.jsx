import { useEffect, useState } from "react";
import { FiTrash2, FiMail, FiCheckCircle } from "react-icons/fi";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import { messagesService } from "../../services/messagesService";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await messagesService.list();
      setMessages(
        data.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleRead = async (m) => {
    try {
      await messagesService.update(m.id, { read: !m.read });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await messagesService.remove(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Messages</h1>
      <p className="text-sm text-muted mt-1">
        Submissions from the public contact form, stored locally in this
        browser.
      </p>

      {error && (
        <p className="field-error mt-4" role="alert">
          {error}
        </p>
      )}
      {loading && <LoadingState label="Loading messages" />}
      {!loading && messages.length === 0 && (
        <div className="mt-8">
          <EmptyState
            title="No messages yet"
            description="Submissions from /contact will show up here."
          />
        </div>
      )}

      <div className="mt-8 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-lg card-border p-5 ${m.read ? "opacity-70" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 break-words">
                <p className="text-ink font-medium">
                  {m.name}{" "}
                  <span className="text-muted font-normal">
                    &lt;{m.email}&gt;
                  </span>
                </p>
                <p className="text-xs text-muted mt-2">
                  {m.delivery === "sent"
                    ? "Email delivery accepted"
                    : m.delivery === "failed"
                      ? "Delivery failed"
                      : "Stored in this browser only"}
                </p>
                {m.receivedAt && (
                  <p className="text-xs font-mono text-muted mt-1">
                    {new Date(m.receivedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleRead(m)}
                  className="p-1.5 text-muted hover:text-ink"
                  aria-label={m.read ? "Mark unread" : "Mark read"}
                >
                  {m.read ? <FiCheckCircle size={16} /> : <FiMail size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 text-muted hover:text-red-400"
                  aria-label="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted mt-3 leading-relaxed whitespace-pre-line">
              {m.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
