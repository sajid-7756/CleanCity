import { useState, useEffect, useCallback } from "react";
import { Trash2, Mail, MailOpen, Search, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../Hooks/useAxiosSecure";

/* ─── types ─────────────────────────────────────────────────── */
interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read";
  createdAt: string;
}

/* ─── helpers ───────────────────────────────────────────────── */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/* ─── component ─────────────────────────────────────────────── */
const AdminMessages = () => {
  const axiosSecure = useAxiosSecure();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* fetch all messages */
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.get("/messages");
      setMessages(res.data);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  /* mark read / unread */
  const toggleStatus = async (msg: Message) => {
    const next = msg.status === "unread" ? "read" : "unread";
    try {
      await axiosSecure.patch(`/messages/${msg._id}`, { status: next });
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, status: next } : m))
      );
      if (selected?._id === msg._id) {
        setSelected((prev) => (prev ? { ...prev, status: next } : prev));
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  /* open a message → auto-mark as read */
  const openMessage = async (msg: Message) => {
    setSelected(msg);
    if (msg.status === "unread") {
      try {
        await axiosSecure.patch(`/messages/${msg._id}`, { status: "read" });
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, status: "read" } : m))
        );
        setSelected({ ...msg, status: "read" });
      } catch {
        /* silent — not critical */
      }
    }
  };

  /* delete */
  const deleteMessage = async (id: string) => {
    setDeleting(true);
    try {
      await axiosSecure.delete(`/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      setSelected(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setDeleting(false);
    }
  };

  /* filtered list */
  const filtered = messages.filter((m) => {
    const matchesFilter = filter === "all" || m.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary">
            Messages
            {unreadCount > 0 && (
              <span className="ml-3 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-content">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-base-content/50">
            All messages submitted via the Contact page
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="btn btn-outline btn-sm gap-2"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: messages.length, color: "text-secondary" },
          { label: "Unread", value: unreadCount, color: "text-primary" },
          {
            label: "Read",
            value: messages.length - unreadCount,
            color: "text-success",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-base-100 p-4 text-center shadow-sm"
          >
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-base-content/40">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Main panel ── */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* ── List column ── */}
        <div className="flex flex-col gap-3 lg:col-span-2">
          {/* search + filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
              />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input input-bordered w-full bg-base-100 pl-9 text-sm"
              />
            </div>
            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "unread" | "read")
              }
              className="select select-bordered bg-base-100 text-sm"
              style={{ width: "100px" }}
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {/* list */}
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <span className="loading loading-spinner loading-md text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-base-300 text-base-content/40">
              <Mail size={32} />
              <p className="text-sm font-semibold">No messages found</p>
            </div>
          ) : (
            <div
              className="space-y-2 overflow-y-auto"
              style={{ maxHeight: "60vh" }}
            >
              {filtered.map((msg) => (
                <button
                  key={msg._id}
                  onClick={() => openMessage(msg)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    selected?._id === msg._id
                      ? "border-primary bg-primary/5"
                      : msg.status === "unread"
                        ? "border-primary/30 bg-base-100"
                        : "border-base-300 bg-base-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            msg.status === "unread"
                              ? "bg-primary"
                              : "bg-base-300"
                          }`}
                        />
                        <p
                          className={`truncate text-sm font-bold ${
                            msg.status === "unread"
                              ? "text-secondary"
                              : "text-base-content/70"
                          }`}
                        >
                          {msg.name}
                        </p>
                      </div>
                      <p className="ml-4 truncate text-xs text-base-content/50">
                        {msg.email}
                      </p>
                      <p className="ml-4 mt-1 truncate text-xs font-semibold text-base-content/70">
                        {msg.subject}
                      </p>
                    </div>
                    <p className="shrink-0 text-[10px] text-base-content/40">
                      {formatDate(msg.createdAt)}
                    </p>
                  </div>
                  <p className="ml-4 mt-2 line-clamp-2 text-xs text-base-content/50">
                    {msg.message}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Detail pane ── */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm">
              {/* toolbar */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`badge badge-sm font-semibold ${
                    selected.status === "unread"
                      ? "badge-primary"
                      : "badge-ghost"
                  }`}
                >
                  {selected.status === "unread" ? "● Unread" : "✓ Read"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleStatus(selected)}
                    className="btn btn-outline btn-sm gap-1"
                  >
                    {selected.status === "unread" ? (
                      <MailOpen size={14} />
                    ) : (
                      <Mail size={14} />
                    )}
                    Mark as {selected.status === "unread" ? "Read" : "Unread"}
                  </button>
                  <button
                    onClick={() => deleteMessage(selected._id)}
                    disabled={deleting}
                    className="btn btn-error btn-outline btn-sm gap-1"
                  >
                    {deleting ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Delete
                  </button>
                </div>
              </div>

              {/* subject */}
              <h2 className="text-2xl font-extrabold text-secondary">
                {selected.subject}
              </h2>

              {/* meta */}
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-base-content/60">
                <span>
                  <strong className="text-base-content/80">From:</strong>{" "}
                  {selected.name}
                </span>
                <span>
                  <strong className="text-base-content/80">Email:</strong>{" "}
                  <a
                    href={`mailto:${selected.email}`}
                    className="link link-primary"
                  >
                    {selected.email}
                  </a>
                </span>
                <span>
                  <strong className="text-base-content/80">Received:</strong>{" "}
                  {formatDate(selected.createdAt)}
                </span>
              </div>

              <div className="divider my-4" />

              {/* body */}
              <p className="whitespace-pre-wrap leading-relaxed text-base-content/80">
                {selected.message}
              </p>

              {/* quick reply */}
              <div className="mt-8">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="btn btn-primary gap-2 rounded-full"
                >
                  <Mail size={16} />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-base-300 text-base-content/30">
              <MailOpen size={48} />
              <p className="font-semibold">Select a message to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
