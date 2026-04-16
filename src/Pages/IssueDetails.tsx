import { useContext, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  Expand,
  Home,
  ImageOff,
  MapPin,
  Phone,
  Target,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "../Components/Container";
import Loading from "../Components/Loading";
import useAxios from "../Hooks/useAxios";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";
import type { Contribution, Issue } from "../types/entities";

const formatDate = (value?: string) => {
  if (!value) {
    return "Not provided";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, { dateStyle: "long" });
};

const statusClasses: Record<string, string> = {
  ongoing: "bg-warning/15 text-warning border-warning/30",
  resolved: "bg-success/15 text-success border-success/30",
  ended: "bg-success/15 text-success border-success/30",
};

const IssueDetails = () => {
  const authContext = useContext(AuthContext);
  const issue = useLoaderData() as Issue;
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const axiosInstance = useAxios();

  const [showContributionModal, setShowContributionModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axiosInstance
      .get<Contribution[]>(`/contributions/${issue?._id}`)
      .then((response) => {
        setContributions(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [axiosInstance, issue?._id, refetch]);

  const sortedContributions = [...contributions].sort(
    (a, b) => Number(b.amount) - Number(a.amount)
  );

  const totalContributed = sortedContributions.reduce(
    (sum, contribution) => sum + Number(contribution.amount || 0),
    0
  );

  const handleContributionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const newContribution = {
      issueId: issue._id,
      amount: Number(formData.get("amount") ?? 0),
      phone: String(formData.get("number") ?? ""),
      address: String(formData.get("address") ?? ""),
      date: String(formData.get("date") ?? ""),
      additionalInfo: String(formData.get("additionalInfo") ?? ""),
      name: authContext?.user?.displayName || "",
      email: authContext?.user?.email || "",
      image: authContext?.user?.photoURL || "",
      category: issue.category,
      title: issue.title,
    };

    axiosSecure.post("/contributions", newContribution).then((response) => {
      if (response.data.insertedId) {
        toast.success("Contribution successful. Thank you for helping.");
        setShowContributionModal(false);
        setRefetch((prev) => !prev);
      }
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-200/50 pb-16">
      <title>{issue.title} | CleanCity</title>

      <section className="border-b border-base-300 bg-base-100">
        <Container className="py-6 md:py-8">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost mb-6 rounded-full px-2 text-secondary hover:bg-base-200"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-primary px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-primary-content">
                  {issue.category || "General"}
                </span>
                <span
                  className={`rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] ${
                    statusClasses[issue.status] || "border-base-300 bg-base-200 text-secondary"
                  }`}
                >
                  {issue.status || "Pending"}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-3xl font-black leading-tight text-secondary md:text-5xl">
                  {issue.title}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-secondary/70 md:text-lg">
                  {issue.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-base-300 bg-base-200/60 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-secondary/60">
                    <MapPin size={16} className="text-primary" />
                    Location
                  </div>
                  <p className="font-bold text-secondary">{issue.location || "Not added"}</p>
                </div>

                <div className="rounded-3xl border border-base-300 bg-base-200/60 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-secondary/60">
                    <Calendar size={16} className="text-primary" />
                    Reported
                  </div>
                  <p className="font-bold text-secondary">{formatDate(issue.date)}</p>
                </div>

                <div className="rounded-3xl border border-base-300 bg-base-200/60 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-secondary/60">
                    <Users size={16} className="text-primary" />
                    Contributors
                  </div>
                  <p className="font-bold text-secondary">{sortedContributions.length}</p>
                </div>

                <div className="rounded-3xl border border-base-300 bg-base-200/60 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-secondary/60">
                    <DollarSign size={16} className="text-primary" />
                    Budget Goal
                  </div>
                  <p className="font-bold text-secondary">${issue.amount || 0}</p>
                </div>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-base-300 bg-linear-to-br from-primary to-emerald-500 p-6 text-primary-content shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary-content/70">
                Support This Report
              </p>
              <h2 className="mt-3 text-2xl font-black">Help move this issue forward</h2>
              <p className="mt-3 text-sm leading-6 text-primary-content/80">
                Residents can contribute funds, supplies, or pickup support. A simple,
                clear report helps the community respond faster.
              </p>

              <div className="mt-6 grid gap-3 rounded-[1.5rem] bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-primary-content/70">Raised so far</span>
                  <span>${totalContributed}</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-primary-content/70">Estimated goal</span>
                  <span>${issue.amount || 0}</span>
                </div>
              </div>

              <button
                onClick={() => setShowContributionModal(true)}
                className="btn mt-6 w-full rounded-2xl border-none bg-secondary text-white hover:bg-secondary/90"
              >
                Pledge Support
              </button>
            </aside>
          </div>
        </Container>
      </section>

      <Container className="pt-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-8">
            <div className="overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 shadow-sm">
              <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
                <div>
                  <h2 className="text-xl font-black text-secondary">Issue Photo</h2>
                  <p className="text-sm text-secondary/60">
                    Open the image to inspect the report more clearly.
                  </p>
                </div>
                {issue.image ? (
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="btn btn-sm rounded-full border-base-300 bg-base-100 text-secondary hover:bg-base-200"
                  >
                    <Expand size={16} />
                    View Large
                  </button>
                ) : null}
              </div>

              {issue.image ? (
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  className="block w-full bg-black"
                >
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="h-[280px] w-full object-cover md:h-[480px]"
                  />
                </button>
              ) : (
                <div className="flex h-[280px] flex-col items-center justify-center gap-3 bg-base-200/60 text-secondary/50">
                  <ImageOff size={40} />
                  <p className="font-semibold">No image available for this report.</p>
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Target size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-secondary">Report Overview</h2>
                  <p className="text-sm text-secondary/60">
                    Clear summary of the issue for volunteers and organizers.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-secondary/75">
                <p className="leading-7">{issue.description}</p>
                <div className="grid gap-4 rounded-[1.5rem] bg-base-200/50 p-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary/50">
                      Category
                    </p>
                    <p className="mt-2 font-bold text-secondary">{issue.category || "General"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary/50">
                      Current Status
                    </p>
                    <p className="mt-2 font-bold capitalize text-secondary">
                      {issue.status || "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-8">
            <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Users size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-secondary">Contributors</h2>
                  <p className="text-sm text-secondary/60">
                    People currently supporting this issue.
                  </p>
                </div>
              </div>

              {sortedContributions.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-base-300 bg-base-200/40 px-5 py-10 text-center">
                  <p className="text-lg font-bold text-secondary">No contributions yet</p>
                  <p className="mt-2 text-sm text-secondary/60">
                    Be the first person to support this cleanup effort.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedContributions.map((contribution, index) => (
                    <div
                      key={contribution._id || `${contribution.email}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-base-300 bg-base-200/40 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-black text-primary">
                          {index + 1}
                        </div>
                        <div className="avatar">
                          <div className="h-12 w-12 rounded-2xl bg-base-200">
                            <img
                              src={contribution.image || "https://i.ibb.co/CpHdF8h2/icons8-user.gif"}
                              alt={contribution.name || "Contributor"}
                            />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-secondary">
                            {contribution.name || "Anonymous supporter"}
                          </p>
                          <p className="text-xs text-secondary/55">
                            {formatDate(contribution.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary">${contribution.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </Container>

      {showImageModal ? (
        <div className="modal modal-open bg-black/80 p-4">
          <div className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] bg-black">
            <button
              onClick={() => setShowImageModal(false)}
              className="btn btn-circle btn-sm absolute right-4 top-4 z-10 border-none bg-white/15 text-white hover:bg-white/25"
            >
              <X size={18} />
            </button>
            <img
              src={issue.image}
              alt={issue.title}
              className="max-h-[85vh] w-full object-contain"
            />
          </div>
        </div>
      ) : null}

      {showContributionModal ? (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box w-full max-w-2xl rounded-[2rem] border border-base-300 bg-base-100 p-0 shadow-2xl">
            <div className="relative bg-secondary px-6 py-7 text-white md:px-8">
              <button
                onClick={() => setShowContributionModal(false)}
                className="btn btn-circle btn-sm btn-ghost absolute right-5 top-5 hover:bg-white/10"
              >
                <X size={18} />
              </button>
              <h2 className="text-3xl font-black">Support This Issue</h2>
              <p className="mt-2 text-sm text-white/70">
                Add your contribution details for "{issue.title}".
              </p>
            </div>

            <form onSubmit={handleContributionSubmit} className="space-y-6 p-6 text-secondary md:p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-bold">Report Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={issue.title}
                    readOnly
                    className="input w-full rounded-2xl border-base-300 bg-base-200/50 font-semibold"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Your Pledge Amount ($)</span>
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50"
                      size={18}
                    />
                    <input
                      type="number"
                      name="amount"
                      defaultValue={issue.amount}
                      className="input w-full rounded-2xl border-base-300 bg-base-200/50 pl-11"
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Contact Number</span>
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50"
                      size={18}
                    />
                    <input
                      type="tel"
                      name="number"
                      placeholder="01XXX-XXXXXX"
                      className="input w-full rounded-2xl border-base-300 bg-base-200/50 pl-11"
                      required
                    />
                  </div>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-bold">Pick-up Address / Location</span>
                  </label>
                  <div className="relative">
                    <Home className="absolute left-4 top-5 text-primary/50" size={18} />
                    <textarea
                      name="address"
                      placeholder="Where should the materials be picked up from?"
                      className="textarea min-h-[110px] w-full rounded-2xl border-base-300 bg-base-200/50 pl-11"
                      required
                    />
                  </div>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-bold">Additional Notes</span>
                  </label>
                  <textarea
                    name="additionalInfo"
                    placeholder="Any extra instructions for the cleanup team?"
                    className="textarea min-h-[110px] w-full rounded-2xl border-base-300 bg-base-200/50"
                  />
                </div>

                <div className="hidden">
                  <input
                    type="text"
                    name="date"
                    defaultValue={new Date().toLocaleDateString()}
                    readOnly
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full rounded-2xl">
                Confirm Contribution
                <CheckCircle2 size={18} />
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default IssueDetails;
