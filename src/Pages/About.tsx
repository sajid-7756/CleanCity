import { Link } from "react-router";
import Container from "../Components/Container";

/* ─── static data ─────────────────────────────────────────── */

const stats = [
  { value: "5,000+", label: "Issues Reported" },
  { value: "3,200+", label: "Issues Resolved" },
  { value: "1,800+", label: "Active Citizens" },
  { value: "120+", label: "Neighborhoods Served" },
];

const steps = [
  {
    step: "01",
    title: "Spot & Report",
    desc: "Snap a photo of littered streets, illegal dumping, or any environmental hazard in your neighbourhood and submit it in seconds.",
    icon: "📸",
  },
  {
    step: "02",
    title: "Community Reviews",
    desc: "Our admin team verifies each submission, sets a fair bounty based on the garbage level, and publishes the task for cleaners.",
    icon: "🔍",
  },
  {
    step: "03",
    title: "Cleaners Act",
    desc: "Registered cleaners pick up verified tasks, head to the location, clean it up, and submit photographic proof of completion.",
    icon: "🧹",
  },
  {
    step: "04",
    title: "Earn Rewards",
    desc: "Admins review the proof, mark the issue resolved, and the cleaner earns their bounty. Everyone wins — especially the planet.",
    icon: "🏆",
  },
];

const features = [
  {
    icon: "🌿",
    title: "Eco-Driven Bounties",
    desc: "Every cleanup task carries a monetary reward scaled to the severity of the problem, making environmental action genuinely worthwhile.",
  },
  {
    icon: "📍",
    title: "Hyperlocal Impact",
    desc: "Issues are pinned to exact locations so cleaners can find them quickly and communities can watch their block improve in real time.",
  },
  {
    icon: "🔒",
    title: "Transparent Accountability",
    desc: "Before-and-after photo proof is publicly visible, so the community can see exactly what was done and trust the outcome.",
  },
  {
    icon: "🤝",
    title: "Community Ownership",
    desc: "Citizens report, cleaners resolve, admins moderate — CleanCity works because every role matters and is rewarded.",
  },
  {
    icon: "📊",
    title: "Personal Dashboard",
    desc: "Track every issue you've reported, every cleanup you've completed, and every bounty you've earned — all in one place.",
  },
  {
    icon: "⚡",
    title: "Fast Resolution",
    desc: "The incentive structure drives rapid turnaround. Most verified issues are resolved within 48 hours of being posted.",
  },
];

const values = [
  {
    title: "Transparency",
    desc: "Every report, review decision, and proof submission is visible to the community. No hidden processes, no opaque moderation.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Accountability",
    desc: "Citizens hold authorities accountable by documenting problems. Cleaners are accountable through photographic proof of work.",
    color: "text-secondary",
    bg: "bg-secondary/10",
  },
  {
    title: "Sustainability",
    desc: "Our bounty system creates lasting economic incentives for cleanliness — not a one-off campaign, but a permanent civic loop.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
];

/* ─── component ────────────────────────────────────────────── */

const About = () => {
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative py-28 text-center">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute top-10 right-10 h-48 w-48 rounded-full bg-accent/10 blur-2xl" />
        <Container>
          <span className="badge badge-outline badge-primary mb-6 px-4 py-3 text-sm font-semibold tracking-wide">
            🌱 Community · Clean · Connected
          </span>
          <h1 className="text-5xl font-extrabold leading-tight md:text-6xl">
            About{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CleanCity
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-base-content/70">
            CleanCity is a community-driven platform that turns environmental
            frustration into real, rewarded action. We connect citizens who
            <em> spot</em> problems with cleaners who <em>solve</em> them — and
            we make sure everyone is fairly compensated for doing their part.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/report" className="btn btn-primary btn-lg rounded-full px-8">
              Report an Issue
            </Link>
            <Link to="/issues" className="btn btn-outline btn-lg rounded-full px-8">
              Browse Open Tasks
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Impact Stats ── */}
      <section className="bg-base-200 py-16">
        <Container>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-base-100 p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="text-4xl font-extrabold text-primary">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-base-content/60">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-24">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* text */}
            <div className="space-y-6">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                Why We Exist
              </span>
              <h2 className="text-4xl font-extrabold leading-snug">
                A cleaner city isn't a dream — it's a{" "}
                <span className="text-primary">collective decision</span>.
              </h2>
              <p className="leading-relaxed text-base-content/70">
                Every year, tonnes of waste pile up in neighbourhoods because
                the gap between <strong>awareness</strong> and{" "}
                <strong>action</strong> is too wide. CleanCity bridges that gap
                with technology, incentives, and community trust.
              </p>
              <p className="leading-relaxed text-base-content/70">
                Our mission is simple: make it{" "}
                <em>easy to report, profitable to clean</em>, and{" "}
                <em>transparent to verify</em> — so no environmental issue ever
                goes ignored again.
              </p>
            </div>
            {/* cards */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
                <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-primary">
                  🎯 Our Mission
                </h3>
                <p className="text-base-content/70">
                  To create cleaner, safer, and more sustainable neighbourhoods
                  by combining civic reporting, economic incentives, and
                  community accountability into one seamless platform.
                </p>
              </div>
              <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
                <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-accent">
                  🔭 Our Vision
                </h3>
                <p className="text-base-content/70">
                  A world where every environmental problem is met with a
                  swift, community-powered response — and where being a
                  cleaner is a recognised, well-rewarded profession.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-base-200 py-24">
        <Container>
          <div className="mb-14 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              The Process
            </span>
            <h2 className="mt-2 text-4xl font-extrabold">How CleanCity Works</h2>
            <p className="mx-auto mt-4 max-w-xl text-base-content/70">
              From a single photo to a paid, verified cleanup — here is the
              four-step loop that keeps your city getting cleaner every day.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div
                key={s.step}
                className="group relative overflow-hidden rounded-2xl bg-base-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <span className="absolute -right-3 -top-3 text-7xl font-black text-base-200 select-none transition-colors group-hover:text-primary/10">
                  {s.step}
                </span>
                <div className="mb-4 text-4xl">{s.icon}</div>
                <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-base-content/65">{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Values ── */}
      <section className="py-24">
        <Container>
          <div className="mb-14 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              What Drives Us
            </span>
            <h2 className="mt-2 text-4xl font-extrabold">Our Core Values</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className={`rounded-2xl p-8 ${v.bg} border border-base-300`}
              >
                <h3 className={`mb-3 text-2xl font-extrabold ${v.color}`}>
                  {v.title}
                </h3>
                <p className="leading-relaxed text-base-content/70">{v.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Features ── */}
      <section className="bg-base-200 py-24">
        <Container>
          <div className="mb-14 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Platform Features
            </span>
            <h2 className="mt-2 text-4xl font-extrabold">
              Built for real impact
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base-content/70">
              Every feature in CleanCity is designed around one question:
              <em> what makes it easiest to get this problem solved?</em>
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-base-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                  {f.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-base-content/65">{f.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── The Bounty System Callout ── */}
      <section className="py-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-10 text-center shadow-xl md:p-16">
            <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:24px_24px]" />
            <h2 className="relative text-4xl font-extrabold text-primary-content md:text-5xl">
              The Bounty System 🏅
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-lg text-primary-content/80">
              Cleanup tasks are assigned a <strong>bounty</strong> based on the
              severity of the garbage level — from a small incentive for minor
              litter to a significant reward for large-scale dumping. Cleaners
              earn real money. Communities get clean streets. Everyone benefits.
            </p>
            <div className="relative mt-10 flex flex-wrap justify-center gap-4">
              <div className="rounded-xl bg-white/20 px-6 py-3 text-primary-content backdrop-blur-sm">
                🟡 Low &nbsp;→&nbsp; Small Bounty
              </div>
              <div className="rounded-xl bg-white/20 px-6 py-3 text-primary-content backdrop-blur-sm">
                🟠 Medium &nbsp;→&nbsp; Fair Bounty
              </div>
              <div className="rounded-xl bg-white/20 px-6 py-3 text-primary-content backdrop-blur-sm">
                🔴 High &nbsp;→&nbsp; Premium Bounty
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="bg-base-200 py-24 text-center">
        <Container>
          <h2 className="text-4xl font-extrabold">
            Ready to make a difference?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base-content/70">
            Join thousands of citizens and cleaners who are transforming their
            neighbourhoods — one issue at a time.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn btn-primary btn-lg rounded-full px-10">
              Join CleanCity
            </Link>
            <Link to="/issues" className="btn btn-outline btn-lg rounded-full px-10">
              See Open Issues
            </Link>
          </div>
        </Container>
      </section>

    </div>
  );
};

export default About;
