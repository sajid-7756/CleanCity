import { useContext, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Fade } from "react-awesome-reveal";
import {
  Camera,
  CheckCircle2,
  ClipboardList,
  Clock,
  Flame,
  Trophy,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Loading from "../Components/Loading";
import Table from "../Components/Table";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";
import type { Contribution, Issue } from "../types/entities";

const MyContribution = () => {
  const axiosSecure = useAxiosSecure();
  const authContext = useContext(AuthContext);
  const [myContribution, setMyContribution] = useState<Contribution[]>([]);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  // Update proof modal
  const [updatingIssue, setUpdatingIssue] = useState<Issue | null>(null);
  const [newProofFile, setNewProofFile] = useState<File | null>(null);
  const [newProofPreview, setNewProofPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const proofInputRef = useRef<HTMLInputElement>(null);

  // Cancel confirmation
  const [cancellingIssue, setCancellingIssue] = useState<Issue | null>(null);

  const email = authContext?.user?.email;

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    Promise.all([
      axiosSecure.get<Contribution[]>(`/contributions/?email=${email}`),
      axiosSecure.get<Issue[]>(`/myIssue/?email=${email}`),
    ])
      .then(([contribRes, issuesRes]) => {
        setMyContribution(contribRes.data);
        setMyIssues(issuesRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [email, axiosSecure]);

  const handleProofFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewProofFile(file);
    if (newProofPreview) URL.revokeObjectURL(newProofPreview);
    setNewProofPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleUpdateProof = async () => {
    if (!updatingIssue || !newProofFile) {
      toast.error("Please select a new proof image.");
      return;
    }
    setIsUploading(true);
    try {
      const sigRes = await axiosSecure.get("/cloudinary/signature");
      const { cloudName, apiKey, folder, timestamp, signature } = sigRes.data;

      const uploadFormData = new FormData();
      uploadFormData.append("file", newProofFile);
      uploadFormData.append("api_key", apiKey);
      uploadFormData.append("timestamp", String(timestamp));
      uploadFormData.append("signature", signature);
      uploadFormData.append("folder", folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: uploadFormData },
      );
      if (!uploadRes.ok) throw new Error("Image upload failed");
      const uploadData = await uploadRes.json();

      await axiosSecure.patch(`/issues/${updatingIssue._id}`, {
        proofImage: uploadData.secure_url,
      });

      setMyIssues((prev) =>
        prev.map((i) =>
          i._id === updatingIssue._id
            ? { ...i, proofImage: uploadData.secure_url }
            : i,
        ),
      );
      toast.success("Proof photo updated!");
      closeUpdateModal();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update proof. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const closeUpdateModal = () => {
    setUpdatingIssue(null);
    setNewProofFile(null);
    if (newProofPreview) URL.revokeObjectURL(newProofPreview);
    setNewProofPreview(null);
  };

  const handleCancelSubmission = async () => {
    if (!cancellingIssue) return;
    try {
      await axiosSecure.patch(`/issues/${cancellingIssue._id}`, {
        status: "ongoing",
        proofImage: "",
        cleanedBy: "",
      });
      setMyIssues((prev) =>
        prev.map((i) =>
          i._id === cancellingIssue._id
            ? { ...i, status: "ongoing", proofImage: "", cleanedBy: "" }
            : i,
        ),
      );
      toast.success("Submission cancelled. Issue is back to ongoing.");
      setCancellingIssue(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel submission.");
    }
  };

  // Derived data
  const pendingProofs = myIssues.filter(
    (i) => i.cleanedBy === email && i.status === "pending",
  );
  const approvedCleanings = myIssues.filter(
    (i) => i.cleanedBy === email && i.status === "ended",
  );

  const totalReported = myIssues.length;
  const totalProofsSubmitted = pendingProofs.length + approvedCleanings.length;
  const solvedCount = approvedCleanings.length;

  const stats = [
    {
      label: "Issues Reported",
      value: totalReported,
      icon: <ClipboardList size={22} />,
      color: "bg-info/10 text-info",
      border: "border-info/20",
    },
    {
      label: "Proofs Submitted",
      value: totalProofsSubmitted,
      icon: <Flame size={22} />,
      color: "bg-warning/10 text-warning",
      border: "border-warning/20",
    },
    {
      label: "Pending Review",
      value: pendingProofs.length,
      icon: <Clock size={22} />,
      color: "bg-info/10 text-info",
      border: "border-info/20",
    },
    {
      label: "Cleanings Approved",
      value: solvedCount,
      icon: <CheckCircle2 size={22} />,
      color: "bg-success/10 text-success",
      border: "border-success/20",
    },
    {
      label: "Success Rate",
      value:
        totalProofsSubmitted > 0
          ? `${Math.round((solvedCount / totalProofsSubmitted) * 100)}%`
          : "—",
      icon: <Trophy size={22} />,
      color: "bg-primary/10 text-primary",
      border: "border-primary/20",
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <>
    <Fade triggerOnce>
      <div className="animate-fade-in space-y-8">
        <title>My Contributions</title>

        {/* Header */}
        <div>
          <h1 className="text-4xl font-black tracking-tight text-secondary">
            My Contributions{" "}
            <span className="ml-2 text-primary/40">
              ({myContribution.length})
            </span>
          </h1>
          <p className="mt-2 font-medium text-base-content/60">
            Track your impact — issues you reported and cleanings you completed.
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`group flex items-center gap-3 rounded-3xl border bg-base-100 px-5 py-4 shadow-sm transition-all hover:shadow-md ${stat.border}`}
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${stat.color}`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-black text-secondary">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {totalProofsSubmitted > 0 && (
          <div className="rounded-3xl border border-base-200 bg-base-100 p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-black text-secondary">
                Cleaning Success Rate
              </p>
              <p className="text-sm font-black text-primary">
                {solvedCount}/{totalProofsSubmitted} approved
              </p>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-base-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-700"
                style={{
                  width: `${Math.round((solvedCount / totalProofsSubmitted) * 100)}%`,
                }}
              />
            </div>
            {pendingProofs.length > 0 && (
              <p className="mt-2 text-xs font-medium text-base-content/40">
                {pendingProofs.length} proof{pendingProofs.length !== 1 ? "s" : ""} still
                pending admin review.
              </p>
            )}
          </div>
        )}

        {/* Pending proof submissions */}
        {pendingProofs.length > 0 && (
          <div className="rounded-[3rem] border border-info/30 bg-base-100 p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-info/10">
                <Clock size={20} className="text-info" />
              </div>
              <div>
                <h2 className="text-xl font-black text-secondary">
                  Pending Proof Submissions
                </h2>
                <p className="text-xs font-bold text-base-content/40">
                  Awaiting admin review — you can update the photo or cancel
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {pendingProofs.map((issue) => (
                <div
                  key={issue._id}
                  className="flex flex-col gap-4 rounded-2xl border border-info/20 bg-info/5 p-4 sm:flex-row sm:items-center"
                >
                  {/* Proof thumbnail */}
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-base-200 bg-base-200">
                    {issue.proofImage ? (
                      <img
                        src={issue.proofImage}
                        alt="Proof"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-base-content/30">
                        No img
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-secondary">
                      {issue.title}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {issue.location}
                    </p>
                  </div>

                  {/* Badge + reward */}
                  <div className="shrink-0 text-right">
                    <span className="badge badge-info badge-sm font-bold">
                      ⏳ pending
                    </span>
                    <p className="mt-1 text-xs font-black text-primary">
                      ৳{issue.amount} reward
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => setUpdatingIssue(issue)}
                      className="btn btn-xs btn-outline btn-info gap-1 rounded-xl"
                    >
                      <Camera size={12} />
                      Update Photo
                    </button>
                    <button
                      onClick={() => setCancellingIssue(issue)}
                      className="btn btn-xs btn-outline btn-error gap-1 rounded-xl"
                    >
                      <XCircle size={12} />
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved cleanings */}
        {approvedCleanings.length > 0 && (
          <div className="rounded-[3rem] border border-success/30 bg-base-100 p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-success/10">
                <CheckCircle2 size={20} className="text-success" />
              </div>
              <div>
                <h2 className="text-xl font-black text-secondary">
                  Approved Cleanings
                </h2>
                <p className="text-xs font-bold text-base-content/40">
                  Verified by admin
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {approvedCleanings.map((issue) => (
                <div
                  key={issue._id}
                  className="flex items-center gap-4 rounded-2xl border border-success/20 bg-success/5 p-4"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-base-200 bg-base-200">
                    {issue.proofImage ? (
                      <img
                        src={issue.proofImage}
                        alt="Proof"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={issue.image}
                        alt={issue.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-black text-secondary">
                      {issue.title}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {issue.location}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="badge badge-success badge-sm font-bold">
                      ✅ approved
                    </span>
                    <p className="mt-1 text-xs font-black text-primary">
                      ৳{issue.amount} earned
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pledge contributions table */}
        <div className="min-h-[300px] rounded-[3rem] border border-base-200 bg-base-100 p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-black text-secondary">
            Pledge / Fund Contributions
            <span className="ml-2 text-primary/40">
              ({myContribution.length})
            </span>
          </h2>
          <Table myContribution={myContribution} />
        </div>
      </div>
    </Fade>

      {/* ── Update Proof Modal ── */}
      {updatingIssue && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box w-full max-w-lg rounded-[2rem] border border-base-300 bg-base-100 p-0 shadow-2xl">
            <div className="relative bg-secondary px-6 py-6 text-white">
              <button
                onClick={closeUpdateModal}
                className="btn btn-circle btn-sm btn-ghost absolute right-5 top-5 hover:bg-white/10"
              >
                <X size={18} />
              </button>
              <h2 className="text-2xl font-black">Update Proof Photo</h2>
              <p className="mt-1 truncate text-sm text-white/70">
                {updatingIssue.title}
              </p>
            </div>

            <div className="space-y-5 p-6 md:p-8">
              {/* Current proof */}
              {updatingIssue.proofImage && (
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-base-content/40">
                    Current Proof
                  </p>
                  <div className="overflow-hidden rounded-2xl border border-base-200">
                    <img
                      src={updatingIssue.proofImage}
                      alt="Current proof"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* New upload */}
              <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-base-200/40 p-6 text-center transition-all hover:border-primary/60 hover:bg-base-200/60">
                <Upload size={28} className="text-primary/50" />
                <span className="font-bold text-secondary">
                  {newProofFile
                    ? newProofFile.name
                    : "Click to select new proof image"}
                </span>
                <span className="text-xs text-base-content/50">
                  JPG, PNG, or WEBP
                </span>
                <input
                  ref={proofInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProofFileChange}
                />
              </label>

              {newProofPreview && (
                <div className="overflow-hidden rounded-2xl border border-base-200">
                  <img
                    src={newProofPreview}
                    alt="New proof preview"
                    className="h-40 w-full object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={closeUpdateModal}
                  className="btn btn-outline w-full rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProof}
                  disabled={!newProofFile || isUploading}
                  className="btn btn-primary w-full rounded-2xl font-black"
                >
                  {isUploading ? "Uploading..." : "Update Proof"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Cancel Submission Modal ── */}
      {cancellingIssue && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box w-full max-w-md rounded-[2rem] border border-base-300 bg-base-100 p-8 shadow-2xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10">
              <XCircle className="text-error" size={28} />
            </div>
            <h3 className="text-xl font-black text-secondary">
              Cancel Submission?
            </h3>
            <p className="mt-2 text-sm text-base-content/60">
              This will remove your proof for{" "}
              <span className="font-bold text-secondary">
                "{cancellingIssue.title}"
              </span>{" "}
              and set the issue back to <strong>ongoing</strong>. You can submit
              proof again later.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                onClick={() => setCancellingIssue(null)}
                className="btn btn-outline w-full rounded-2xl"
              >
                Keep It
              </button>
              <button
                onClick={handleCancelSubmission}
                className="btn btn-error w-full rounded-2xl font-black text-white"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyContribution;
