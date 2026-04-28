import { useState } from "react";
import toast from "react-hot-toast";
import Container from "../Components/Container";
import useAxios from "../Hooks/useAxios";

/* ─── static data ─────────────────────────────────────────── */

const contactCards = [
  {
    icon: "✉️",
    title: "Email Us",
    detail: "support@cleancity.com",
    sub: "We reply within 24 hours",
    href: "mailto:support@cleancity.com",
    bg: "bg-primary/10",
    color: "text-primary",
  },
  {
    icon: "📞",
    title: "Call Us",
    detail: "+1 (555) 123-4567",
    sub: "Mon – Fri, 9 am – 6 pm",
    href: "tel:+15551234567",
    bg: "bg-accent/10",
    color: "text-accent",
  },
  {
    icon: "📍",
    title: "Our Office",
    detail: "Eco Tech Park, Green City",
    sub: "Planet Earth 🌍",
    href: "#",
    bg: "bg-secondary/10",
    color: "text-secondary",
  },
  {
    icon: "⏱️",
    title: "Response Time",
    detail: "Under 24 Hours",
    sub: "Avg. response: 4 hours",
    href: "#",
    bg: "bg-success/10",
    color: "text-success",
  },
];

const subjects = [
  "General Enquiry",
  "Issue Reporting Help",
  "Bounty / Payment Query",
  "Account & Profile",
  "Admin / Moderation",
  "Partnership Opportunity",
  "Press & Media",
  "Other",
];

const faqs = [
  {
    q: "How do I report an environmental issue?",
    a: "Sign in, head to the 'Report Issue' page, upload a photo of the problem, add a description and location, and submit. Our admin team will review it within 24 hours.",
  },
  {
    q: "How does the bounty payment work?",
    a: "Once an admin verifies a cleaner's photo proof and marks the issue as resolved, the bounty is credited to the cleaner's account. Payouts are processed weekly.",
  },
  {
    q: "Can I report an issue anonymously?",
    a: "You need a registered account to submit reports so we can keep the platform spam-free, but your personal details are never shown publicly.",
  },
  {
    q: "What if my report gets rejected?",
    a: "You'll receive a notification with the admin's rejection reason. You can resubmit with better evidence or contact us if you believe it was a mistake.",
  },
  {
    q: "How do I become a verified cleaner?",
    a: "Register for a standard account and update your profile role to 'Cleaner'. Once approved by an admin, you can start picking up tasks and earning bounties.",
  },
  {
    q: "Is CleanCity available in my city?",
    a: "CleanCity is open to any community globally. If your neighbourhood isn't active yet, start by reporting a few issues — you'll be the trailblazer!",
  },
];

const socials = [
  { label: "Twitter / X", icon: "𝕏", href: "#" },
  { label: "Facebook", icon: "f", href: "#" },
  { label: "Instagram", icon: "📸", href: "#" },
  { label: "LinkedIn", icon: "in", href: "#" },
];

/* ─── types ─────────────────────────────────────────────────── */

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/* ─── component ────────────────────────────────────────────── */

const Contact = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: subjects[0],
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const axios = useAxios();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/messages", form);
      setSent(true);
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSent(false);
    setForm({ name: "", email: "", subject: subjects[0], message: "" });
  };

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative py-28 text-center">
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute top-10 right-10 h-40 w-40 rounded-full bg-accent/10 blur-2xl" />
        <Container>
          <span className="badge badge-outline badge-primary mb-6 px-4 py-3 text-sm font-semibold tracking-wide">
            💬 We're Here to Help
          </span>
          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            Get in{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-base-content/70">
            Have a question, spotted a bug, or want to partner with us? Drop us
            a message — our team typically responds within a few hours.
          </p>
        </Container>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="bg-base-200 py-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((c) => (
              <a
                key={c.title}
                href={c.href}
                className="group rounded-2xl bg-base-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${c.bg}`}
                >
                  {c.icon}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-base-content/40">
                  {c.title}
                </p>
                <p className={`mt-1 text-lg font-bold ${c.color}`}>
                  {c.detail}
                </p>
                <p className="mt-1 text-sm text-base-content/55">{c.sub}</p>
              </a>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Form + Side Info ── */}
      <section className="py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-5">

            {/* Left — extra info */}
            <div className="space-y-10 lg:col-span-2">
              <div>
                <h2 className="text-3xl font-extrabold">
                  We'd love to hear from you
                </h2>
                <p className="mt-3 leading-relaxed text-base-content/65">
                  Whether you're a citizen who just reported their first issue,
                  a cleaner chasing a bounty payment, or an organization wanting
                  to collaborate — we're always happy to chat.
                </p>
              </div>

              {/* What to expect */}
              <div className="space-y-4">
                <h3 className="font-bold text-base-content/50 uppercase tracking-widest text-sm">
                  What to Expect
                </h3>
                {[
                  { icon: "⚡", text: "First reply within 4 hours on weekdays" },
                  { icon: "🤝", text: "Real humans, no bots — ever" },
                  { icon: "📬", text: "Follow-up until your issue is resolved" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-base">
                      {item.icon}
                    </span>
                    <p className="text-sm leading-relaxed text-base-content/70">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Social links */}
              <div>
                <h3 className="mb-4 font-bold text-base-content/50 uppercase tracking-widest text-sm">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-base-300 bg-base-100 font-bold text-base-content/60 transition hover:border-primary hover:text-primary"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-base-300 bg-base-100 p-8 shadow-sm">
                {sent ? (
                  /* Success state */
                  <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-5xl">
                      ✅
                    </div>
                    <h3 className="text-2xl font-extrabold text-success">
                      Message Sent!
                    </h3>
                    <p className="max-w-sm text-base-content/65">
                      Thanks <strong>{form.name || "there"}</strong>! We've
                      received your message and will get back to you at{" "}
                      <strong>{form.email}</strong> within 24 hours.
                    </p>
                    <button
                      onClick={handleReset}
                      className="btn btn-outline btn-primary mt-4 rounded-full px-8"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  /* Form */
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="mb-1 text-2xl font-extrabold">
                      Send a Message
                    </h2>
                    <p className="text-sm text-base-content/55">
                      All fields are required.
                    </p>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Full Name
                          </span>
                        </label>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          required
                          placeholder="Jane Smith"
                          value={form.name}
                          onChange={handleChange}
                          className="input input-bordered focus:input-primary w-full"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">
                            Email Address
                          </span>
                        </label>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          required
                          placeholder="jane@example.com"
                          value={form.email}
                          onChange={handleChange}
                          className="input input-bordered focus:input-primary w-full"
                        />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Subject
                        </span>
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        required
                        value={form.subject}
                        onChange={handleChange}
                        className="select select-bordered focus:select-primary w-full"
                      >
                        {subjects.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Message
                        </span>
                        <span className="label-text-alt text-base-content/40">
                          {form.message.length} / 1000
                        </span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        required
                        maxLength={1000}
                        placeholder="Tell us how we can help..."
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        className="textarea textarea-bordered focus:textarea-primary w-full resize-none"
                      />
                    </div>

                    <button
                      id="contact-submit"
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full rounded-full shadow-lg shadow-primary/20"
                    >
                      {loading ? (
                        <span className="loading loading-spinner loading-sm" />
                      ) : (
                        "Send Message →"
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-base-200 py-24">
        <Container>
          <div className="mb-14 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              FAQ
            </span>
            <h2 className="mt-2 text-4xl font-extrabold">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base-content/65">
              Can't find your answer below? Just send us a message above and
              we'll get back to you promptly.
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-base-300 bg-base-100"
              >
                <button
                  id={`faq-${i}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold transition hover:text-primary"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`shrink-0 text-xl transition-transform duration-300 ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    openFaq === i
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-base-content/65">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-24 text-center">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-accent p-12 shadow-xl">
            <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-size-[24px_24px]" />
            <h2 className="relative text-3xl font-extrabold text-primary-content md:text-4xl">
              Still have questions?
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-primary-content/80">
              Our community forum is full of helpful answers from fellow
              CleanCity users — or jump straight to our support email.
            </p>
            <a
              href="mailto:support@cleancity.com"
              className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-bold text-primary shadow-md transition hover:bg-primary-content"
            >
              ✉️ Email Support
            </a>
          </div>
        </Container>
      </section>

    </div>
  );
};

export default Contact;
