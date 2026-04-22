import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  CheckCircle2,
  Edit3,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import Loading from "../Components/Loading";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import type { Issue } from "../types/entities";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Garbage",
  "Illegal Construction",
  "Broken Public Property",
  "Road Damage",
];

const AdminContributions = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Modals
  const [reviewingIssue, setReviewingIssue] = useState<Issue | null>(null);
  const [managingIssue, setManagingIssue] = useState<Issue | null>(null);
  const [deletingIssue, setDeletingIssue] = useState<Issue | null>(null);

  // Manage form state
  const [manageForm, setManageForm] = useState({
    title: "",
    category: "",
    location: "",
    amount: 0,
    status: "",
  });

  // Rejection feedback
  const [rejectionNote, setRejectionNote] = useState("");

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = () => {
    setLoading(true);
    axiosSecure
      .get<Issue[]>("/issues")
      .then((res) => {
        setIssues(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const openManageModal = (issue: Issue) => {
    setManagingIssue(issue);
    setManageForm({
      title: issue.title,
      category: issue.category,
      location: issue.location,
      amount: Number(issue.amount),
      status: issue.status,
    });
  };

  const handleManageFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setManageForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value,
    }));
  };

  const handleManageSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!managingIssue) return;
    try {
      await axiosSecure.patch(`/issues/${managingIssue._id}`, manageForm);
      setIssues(
        issues.map((i) =>
          i._id === managingIssue._id ? { ...i, ...manageForm } : i,
        ),
      );
      toast.success("Issue updated successfully!");
      setManagingIssue(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update issue.");
    }
  };

  const handleDelete = async () => {
    if (!deletingIssue) return;
    try {
      await axiosSecure.delete(`/issues/${deletingIssue._id}`);
      setIssues(issues.filter((i) => i._id !== deletingIssue._id));
      toast.success("Issue deleted.");
      setDeletingIssue(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete issue.");
    }
  };

  const handleApprove = async (issue: Issue) => {
    try {
      await axiosSecure.patch(`/issues/${issue._id}`, { status: "ended" });
      setIssues(
        issues.map((i) => (i._id === issue._id ? { ...i, status: "ended" } : i)),
      );
      toast.success("Issue approved and marked as ended!");
      setReviewingIssue(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve issue.");
    }
  };

  const handleReject = async (issue: Issue) => {
    try {
      await axiosSecure.patch(`/issues/${issue._id}`, {
        status: "ongoing",
        proofImage: "",
        cleanedBy: "",
        rejectionNote: rejectionNote.trim() || undefined,
      });
      setIssues(
        issues.map((i) =>
          i._id === issue._id
            ? { ...i, status: "ongoing", proofImage: "", cleanedBy: "" }
            : i,
        ),
      );
      toast.success("Proof rejected. Issue set back to ongoing.");
      setReviewingIssue(null);
      setRejectionNote("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject proof.");
    }
  };

  const pendingCount = issues.filter((i) => i.status === "pending").length;

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in space-y-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-black text-secondary">
            All Contributions
          </h1>
          <p className="mt-2 text-base-content/60">
            Manage issues, review proofs, edit budgets, and moderate content.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl border border-base-200 bg-base-100 px-6 py-3 text-center shadow-sm">
            <p className="text-2xl font-black text-secondary">{issues.length}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-base-content/40">
              Total
            </p>
          </div>
          <div className="rounded-2xl border border-error/20 bg-error/10 px-6 py-3 text-center">
            <p className="text-2xl font-black text-error">{pendingCount}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-error/60">
              Pending Review
            </p>
          </div>
        </div>
      </div>

      {/* Alert */}
      {pendingCount > 0 && (
        <div className="flex items-center gap-4 rounded-2xl border border-error/30 bg-error/10 px-6 py-4">
          <ShieldAlert className="shrink-0 text-error" size={24} />
          <p className="font-black text-error">
            {pendingCount} issue{pendingCount > 1 ? "s" : ""} awaiting proof
            review — click "Review Proof" to approve or reject.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-[3rem] border border-base-200 bg-base-100 p-8 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="border-b border-base-200">
                {["Issue", "Category", "Location", "Budget", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-xs font-black uppercase tracking-widest opacity-30"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {[...issues].reverse().map((item) => (
                <tr
                  key={item._id}
                  className="border-b border-base-200/50 transition-colors hover:bg-base-200/30"
                >
                  <td className="max-w-[180px] truncate py-4 font-bold text-secondary">
                    {item.title}
                  </td>
                  <td className="text-base-content/60 text-sm">{item.category}</td>
                  <td className="text-base-content/60 text-sm">{item.location}</td>
                  <td className="font-black text-primary">৳{item.amount}</td>
                  <td>
                    <span
                      className={`badge badge-sm font-bold ${
                        item.status === "ended"
                          ? "badge-success"
                          : item.status === "ongoing"
                            ? "badge-warning"
                            : "badge-info"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {item.status === "pending" ? (
                        <button
                          onClick={() => {
                            setReviewingIssue(item);
                            setRejectionNote("");
                          }}
                          className="btn btn-xs btn-error animate-pulse"
                        >
                          Review Proof
                        </button>
                      ) : (
                        <button
                          onClick={() => openManageModal(item)}
                          className="btn btn-xs btn-outline btn-primary gap-1"
                        >
                          <Edit3 size={12} />
                          Manage
                        </button>
                      )}
                      <button
                        onClick={() => setDeletingIssue(item)}
                        className="btn btn-xs btn-outline btn-error gap-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Manage Issue Modal ── */}
      {managingIssue && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box w-full max-w-2xl rounded-[2rem] border border-base-300 bg-base-100 p-0 shadow-2xl">
            <div className="relative bg-secondary px-6 py-6 text-white">
              <button
                onClick={() => setManagingIssue(null)}
                className="btn btn-circle btn-sm btn-ghost absolute right-5 top-5 hover:bg-white/10"
              >
                <X size={18} />
              </button>
              <h2 className="text-2xl font-black">Manage Issue</h2>
              <p className="mt-1 truncate text-sm text-white/70">
                {managingIssue.title}
              </p>
            </div>

            <form onSubmit={handleManageSave} className="space-y-5 p-6 md:p-8">
              {/* Title */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Issue Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={manageForm.title}
                  onChange={handleManageFormChange}
                  required
                  className="input input-bordered w-full rounded-2xl bg-base-200/50"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Category */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Category</span>
                  </label>
                  <select
                    name="category"
                    value={manageForm.category}
                    onChange={handleManageFormChange}
                    className="select select-bordered w-full rounded-2xl bg-base-200/50"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Status</span>
                  </label>
                  <select
                    name="status"
                    value={manageForm.status}
                    onChange={handleManageFormChange}
                    className="select select-bordered w-full rounded-2xl bg-base-200/50"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="pending">Pending Review</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Location</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={manageForm.location}
                  onChange={handleManageFormChange}
                  className="input input-bordered w-full rounded-2xl bg-base-200/50"
                />
              </div>

              {/* Budget */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">
                    Reward Budget (৳)
                  </span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={manageForm.amount}
                  onChange={handleManageFormChange}
                  min={0}
                  className="input input-bordered w-full rounded-2xl bg-base-200/50"
                />
                <label className="label">
                  <span className="label-text-alt text-base-content/50">
                    Adjust the reward to match the actual effort required.
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setManagingIssue(null)}
                  className="btn btn-outline w-full rounded-2xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary w-full rounded-2xl font-black"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Review Proof Modal ── */}
      {reviewingIssue && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box w-full max-w-3xl rounded-[2rem] border border-base-300 bg-base-100 p-0 shadow-2xl">
            <div className="relative bg-secondary px-6 py-6 text-white">
              <button
                onClick={() => {
                  setReviewingIssue(null);
                  setRejectionNote("");
                }}
                className="btn btn-circle btn-sm btn-ghost absolute right-5 top-5 hover:bg-white/10"
              >
                <X size={18} />
              </button>
              <h2 className="text-2xl font-black">Review Cleaning Proof</h2>
              <p className="mt-1 truncate text-sm text-white/70">
                {reviewingIssue.title}
              </p>
              {reviewingIssue.cleanedBy && (
                <p className="mt-1 text-xs text-white/50">
                  Submitted by: {reviewingIssue.cleanedBy}
                </p>
              )}
            </div>

            <div className="space-y-6 p-6 md:p-8">
              {/* Images */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-base-content/40">
                    Original Issue
                  </p>
                  <div className="overflow-hidden rounded-2xl border border-base-200">
                    <img
                      src={reviewingIssue.image}
                      alt="Original"
                      className="h-48 w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-widest text-base-content/40">
                    Proof of Cleaning
                  </p>
                  <div className="overflow-hidden rounded-2xl border-2 border-success/30">
                    {reviewingIssue.proofImage ? (
                      <img
                        src={reviewingIssue.proofImage}
                        alt="Proof"
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-base-200/50 text-sm text-base-content/40">
                        No proof image
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reward info */}
              <div className="rounded-2xl border border-base-200 bg-base-200/40 p-4">
                <p className="text-sm font-bold text-secondary/60">
                  Reward amount:{" "}
                  <span className="font-black text-primary">
                    ৳{reviewingIssue.amount}
                  </span>
                </p>
              </div>

              {/* Rejection feedback field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">
                    Rejection Note{" "}
                    <span className="font-normal text-base-content/40">
                      (optional — shown to contributor if rejected)
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Photo is too blurry, area still has garbage..."
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  className="input input-bordered w-full rounded-2xl bg-base-200/50"
                />
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleReject(reviewingIssue)}
                  className="btn btn-outline btn-error w-full rounded-2xl font-black"
                >
                  Reject — Reset to Ongoing
                </button>
                <button
                  onClick={() => handleApprove(reviewingIssue)}
                  className="btn btn-success w-full rounded-2xl font-black text-white"
                >
                  <CheckCircle2 size={18} />
                  Approve & End Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingIssue && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box w-full max-w-md rounded-[2rem] border border-base-300 bg-base-100 p-8 shadow-2xl">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10">
              <Trash2 className="text-error" size={28} />
            </div>
            <h3 className="text-xl font-black text-secondary">Delete Issue?</h3>
            <p className="mt-2 text-sm text-base-content/60">
              This will permanently remove{" "}
              <span className="font-bold text-secondary">
                "{deletingIssue.title}"
              </span>
              . This action cannot be undone.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                onClick={() => setDeletingIssue(null)}
                className="btn btn-outline w-full rounded-2xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-error w-full rounded-2xl font-black text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContributions;
