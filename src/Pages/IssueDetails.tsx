import { useContext, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Camera,
  CheckCircle2,
  DollarSign,
  Expand,
  ImageOff,
  MapPin,
  ShieldCheck,
  Target,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import Container from "../Components/Container";
import Loading from "../Components/Loading";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";
import useRole from "../Hooks/useRole";
import type { Issue } from "../types/entities";

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
  pending: "bg-info/15 text-info border-info/30",
  resolved: "bg-success/15 text-success border-success/30",
  ended: "bg-success/15 text-success border-success/30",
};

const IssueDetails = () => {
  const authContext = useContext(AuthContext);
  const issue = useLoaderData() as Issue;
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [showImageModal, setShowImageModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [proofImageFile, setProofImageFile] = useState<File | null>(null);
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<Issue>(issue);
  const proofInputRef = useRef<HTMLInputElement>(null);
  const [role] = useRole();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);



  const handleProofImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setProofImageFile(file);
    if (proofPreviewUrl) URL.revokeObjectURL(proofPreviewUrl);
    setProofPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleProofSubmit = async () => {
    if (!proofImageFile) {
      toast.error("Please select a proof image first.");
      return;
    }
    setIsUploadingProof(true);
    try {
      const sigRes = await axiosSecure.get("/cloudinary/signature");
      const { cloudName, apiKey, folder, timestamp, signature } = sigRes.data;

      const uploadFormData = new FormData();
      uploadFormData.append("file", proofImageFile);
      uploadFormData.append("api_key", apiKey);
      uploadFormData.append("timestamp", String(timestamp));
      uploadFormData.append("signature", signature);
      uploadFormData.append("folder", folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: uploadFormData,
      });
      if (!uploadRes.ok) throw new Error("Image upload failed");
      const uploadData = await uploadRes.json();

      await axiosSecure.patch(`/issues/${currentIssue._id}`, {
        proofImage: uploadData.secure_url,
        cleanedBy: authContext?.user?.email,
        status: "pending",
      });

      setCurrentIssue((prev) => ({ ...prev, status: "pending", proofImage: uploadData.secure_url }));
      toast.success("Proof submitted! Awaiting admin review.");
      setShowProofModal(false);
      setProofImageFile(null);
      setProofPreviewUrl(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit proof. Please try again.");
    } finally {
      setIsUploadingProof(false);
    }
  };

  // if (Loading) {
  //   return <Loading />;
  // }

  const user = authContext?.user;
  // Any logged-in non-admin user can clean — but not the original reporter
  const isReporter = user?.email === currentIssue.email;
  const canSubmitProof =
    user && role !== "admin" && !isReporter && currentIssue.status === "ongoing";
  const canManageProof =
    user &&
    role !== "admin" &&
    currentIssue.status === "pending" &&
    currentIssue.cleanedBy === user.email;

  const handleCancelProof = async () => {
    try {
      await axiosSecure.patch(`/issues/${currentIssue._id}`, {
        status: "ongoing",
        proofImage: "",
        cleanedBy: "",
      });
      setCurrentIssue((prev) => ({
        ...prev,
        status: "ongoing",
        proofImage: "",
        cleanedBy: "",
      }));
      toast.success("Submission cancelled. Issue is back to ongoing.");
      setShowCancelConfirm(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel submission.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200/50 pb-16">
      <title>{currentIssue.title} | CleanCity</title>

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
                  {currentIssue.category || "General"}
                </span>
                <span
                  className={`rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] ${
                    statusClasses[currentIssue.status] || "border-base-300 bg-base-200 text-secondary"
                  }`}
                >
                  {currentIssue.status || "Pending"}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-3xl font-black leading-tight text-secondary md:text-5xl">
                  {currentIssue.title}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-secondary/70 md:text-lg">
                  {currentIssue.description}
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
                    <DollarSign size={16} className="text-primary" />
                    Reward
                  </div>
                  <p className="font-bold text-secondary">৳{currentIssue.amount || 0}</p>
                </div>
              </div>
            </div>

            <aside className="space-y-4 rounded-4xl border border-base-300 bg-linear-to-br from-primary to-emerald-500 p-6 text-primary-content shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary-content/70">
                Reward
              </p>
              <h2 className="mt-3 text-2xl font-black">৳{currentIssue.amount || 0} for cleaning this issue</h2>
              <p className="mt-3 text-sm leading-6 text-primary-content/80">
                Clean the area and submit a photo as proof. Once an admin approves your submission, the reward is yours.
              </p>

              {canSubmitProof && (
                <button
                  onClick={() => setShowProofModal(true)}
                  className="btn mt-4 w-full rounded-2xl border-2 border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                >
                  <ShieldCheck size={18} />
                  Submit Proof of Cleaning
                </button>
              )}

              {/* Reporter cannot claim their own bounty */}
              {user && isReporter && currentIssue.status === "ongoing" && (
                <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-3 text-center text-sm font-bold text-white/70">
                  You reported this issue — another user can claim the reward by cleaning it.
                </div>
              )}

              {/* Someone else already submitted proof */}
              {currentIssue.status === "pending" && !canManageProof && (
                <div className="mt-4 rounded-2xl border border-white/20 bg-white/10 p-3 text-center text-sm font-bold text-white/70">
                  🧹 Someone is already working on this — awaiting admin review.
                </div>
              )}

              {currentIssue.status === "pending" && (
                <div className="mt-2 space-y-3">
                  <div className="rounded-2xl border border-info/30 bg-info/10 p-3 text-center text-sm font-bold text-info">
                    ⏳ Proof submitted — awaiting admin review
                  </div>
                  {canManageProof && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setShowProofModal(true)}
                        className="btn btn-sm w-full rounded-2xl border-white/30 bg-white/10 text-white hover:bg-white/20"
                      >
                        <Camera size={14} />
                        Update Photo
                      </button>
                      <button
                        onClick={() => setShowCancelConfirm(true)}
                        className="btn btn-sm w-full rounded-2xl border-error/40 bg-error/20 text-white hover:bg-error/30"
                      >
                        <XCircle size={14} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </aside>
          </div>
        </Container>
      </section>

      <Container className="pt-8">
        <div className="grid gap-8">
          <section className="space-y-8">
            <div className="overflow-hidden rounded-4xl border border-base-300 bg-base-100 shadow-sm">
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
                  className="block w-full bg-base-200/60"
                >
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="max-h-[520px] w-full object-contain"
                  />
                </button>
              ) : (
                <div className="flex h-[280px] flex-col items-center justify-center gap-3 bg-base-200/60 text-secondary/50">
                  <ImageOff size={40} />
                  <p className="font-semibold">No image available for this report.</p>
                </div>
              )}
            </div>

            <div className="rounded-4xl border border-base-300 bg-base-100 p-6 shadow-sm md:p-8">
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
                <p className="leading-7">{currentIssue.description}</p>
                <div className="grid gap-4 rounded-3xl bg-base-200/50 p-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary/50">
                      Category
                    </p>
                    <p className="mt-2 font-bold text-secondary">{currentIssue.category || "General"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary/50">
                      Current Status
                    </p>
                    <p className="mt-2 font-bold capitalize text-secondary">
                      {currentIssue.status || "Pending"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Container>

      {showImageModal ? (
        <div
          className="modal modal-open bg-black/90 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative max-h-[92vh] max-w-5xl overflow-hidden rounded-3xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="btn btn-circle btn-sm absolute right-4 top-4 z-10 border-none bg-white/15 text-white hover:bg-white/25"
            >
              <X size={18} />
            </button>
            <img
              src={currentIssue.image}
              alt={currentIssue.title}
              className="block max-h-[92vh] max-w-full object-contain"
            />
          </div>
        </div>
      ) : null}

      {showProofModal ? (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box w-full max-w-lg rounded-4xl border border-base-300 bg-base-100 p-0 shadow-2xl">
            <div className="relative bg-secondary px-6 py-7 text-white md:px-8">
              <button
                onClick={() => setShowProofModal(false)}
                className="btn btn-circle btn-sm btn-ghost absolute right-5 top-5 hover:bg-white/10"
              >
                <X size={18} />
              </button>
              <h2 className="text-2xl font-black">
                {canManageProof ? "Update Proof Photo" : "Submit Proof of Cleaning"}
              </h2>
              <p className="mt-2 text-sm text-white/70">
                {canManageProof
                  ? "Upload a new photo to replace your current proof."
                  : "Upload a photo showing the area has been cleaned."}
              </p>
            </div>

            <div className="space-y-5 p-6 md:p-8">
              {/* Show current proof if updating */}
              {canManageProof && currentIssue.proofImage && !proofPreviewUrl && (
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-base-content/40">
                    Current Proof
                  </p>
                  <div className="overflow-hidden rounded-2xl border border-base-200">
                    <img
                      src={currentIssue.proofImage}
                      alt="Current proof"
                      className="h-40 w-full object-cover"
                    />
                  </div>
                </div>
              )}

              <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-base-200/40 p-6 text-center transition-all hover:border-primary/60 hover:bg-base-200/60">
                <Upload size={32} className="text-primary/50" />
                <span className="font-bold text-secondary">
                  {proofImageFile
                    ? proofImageFile.name
                    : canManageProof
                      ? "Click to select new proof image"
                      : "Click to select proof image"}
                </span>
                <span className="text-xs text-base-content/50">JPG, PNG, or WEBP</span>
                <input
                  ref={proofInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProofImageChange}
                />
              </label>

              {proofPreviewUrl && (
                <div className="overflow-hidden rounded-2xl border border-base-200">
                  <img src={proofPreviewUrl} alt="Proof preview" className="h-48 w-full object-cover" />
                </div>
              )}

              <button
                onClick={handleProofSubmit}
                disabled={!proofImageFile || isUploadingProof}
                className="btn btn-primary w-full rounded-2xl font-black"
              >
                {isUploadingProof
                  ? "Uploading..."
                  : canManageProof
                    ? "Update Proof"
                    : "Submit Proof"}
                {!isUploadingProof && <CheckCircle2 size={18} />}
              </button>
            </div>
          </div>
        </div>
      ) : null}


      {showCancelConfirm && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box w-full max-w-md rounded-4xl border border-base-300 bg-base-100 p-8 shadow-2xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10">
              <XCircle className="text-error" size={28} />
            </div>
            <h3 className="text-xl font-black text-secondary">
              Cancel Submission?
            </h3>
            <p className="mt-2 text-sm text-base-content/60">
              This will remove your cleaning proof and set the issue back to{" "}
              <strong>ongoing</strong>. You can submit proof again later.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="btn btn-outline w-full rounded-2xl"
              >
                Keep It
              </button>
              <button
                onClick={handleCancelProof}
                className="btn btn-error w-full rounded-2xl font-black text-white"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueDetails;
