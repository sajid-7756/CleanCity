import { useContext, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { Fade } from "react-awesome-reveal";
import { PlusCircle } from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Loading from "../Components/Loading";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";
import type { Issue } from "../types/entities";
import useRole from "../Hooks/useRole";
import { Navigate } from "react-router";

const emptyIssue: Issue = {
  _id: "",
  title: "",
  category: "Garbage",
  location: "",
  description: "",
  image: "",
  amount: 0,
  status: "ongoing",
  date: "",
};

const MyIssues = () => {
  const axiosSecure = useAxiosSecure();
  const authContext = useContext(AuthContext);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue>(emptyIssue);
  const issueModalRef = useRef<HTMLDialogElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, isRoleLoading] = useRole();

  const issueId = selectedIssue._id;

  useEffect(() => {
    if (!authContext?.user?.email) {
      setLoading(false);
      return;
    }

    axiosSecure
      .get<Issue[]>(`/myIssue/?email=${authContext.user.email}`)
      .then((res) => {
        setMyIssues(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [authContext?.user?.email, axiosSecure]);

  const handleUpdateIssue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const updatedIssue = {
      title: String(formData.get("title") ?? ""),
      category: String(formData.get("category") ?? ""),
      amount: Number(formData.get("amount") ?? 0),
      description: String(formData.get("description") ?? ""),
      status: String(formData.get("status") ?? ""),
      issueId,
    };

    axiosSecure
      .patch(`/issues/${issueId}`, updatedIssue)
      .then((res) => {
        if (res.data.modifiedCount) {
          setMyIssues((prevIssues) =>
            prevIssues.map((issue) =>
              issue._id === issueId ? { ...issue, ...updatedIssue } : issue
            )
          );
          toast.success("Issue updated successfully");
          issueModalRef.current?.close();
        }
      })
      .catch((error) => console.error(error));
  };

  const handleDeleteIssue = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "oklch(52% 0.18 150)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/issues/${id}`).then(() => {
          setMyIssues((prevIssues) => prevIssues.filter((issue) => issue._id !== id));

          Swal.fire({
            title: "Deleted!",
            text: "Your issue has been deleted.",
            icon: "success",
            confirmButtonColor: "oklch(52% 0.18 150)",
          });
        });
      }
    });
  };

  const reversed = [...myIssues].reverse();

  if (loading || isRoleLoading) {
    return <Loading />;
  }

  if (role === "admin") {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Fade triggerOnce>
      <div className="animate-fade-in space-y-8">
        <title>My Issues</title>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-secondary sm:text-4xl">
              My Issues <span className="ml-2 text-primary/40">({myIssues.length})</span>
            </h1>
            <p className="mt-2 text-sm font-medium text-base-content/60 sm:text-base">
              Track and manage the reports you've submitted.
            </p>
          </div>
          <Link
            to="/dashboard/add-issue"
            className="btn btn-primary w-full gap-2 rounded-2xl shadow-lg shadow-primary/20 sm:w-auto"
          >
            <PlusCircle size={20} />
            Report New Issue
          </Link>
        </div>

        <div className="space-y-4 md:hidden">
          {reversed.map((issue, index) => (
            <div
              key={issue._id}
              className="rounded-3xl border border-base-200 bg-base-100 p-4 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="avatar shrink-0">
                  <div className="mask mask-squircle h-16 w-16 overflow-hidden bg-base-200 ring-2 ring-base-200 ring-offset-2">
                    <img
                      src={issue.image || "https://i.ibb.co/CpHdF8h2/icons8-user.gif"}
                      alt={issue.title}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-black text-base-content/30">#{index + 1}</p>
                    <span
                      className={`badge badge-sm border-none px-3 font-black uppercase tracking-widest ${
                        issue.status?.toLowerCase() === "ongoing"
                          ? "bg-warning/10 text-warning"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                  <h2 className="mt-1 line-clamp-2 text-lg font-black text-secondary">{issue.title}</h2>
                  <p className="mt-2 text-sm font-medium text-base-content/50">{issue.location}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="badge badge-lg rounded-xl border-secondary/10 bg-secondary/5 px-4 py-4 font-bold text-secondary">
                  {issue.category}
                </span>
                <span className="text-lg font-black text-secondary">${issue.amount}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSelectedIssue(issue);
                    issueModalRef.current?.showModal();
                  }}
                  className="btn btn-outline rounded-2xl border-primary/20 text-primary hover:border-primary hover:bg-primary/10"
                  title="Update Issue"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteIssue(issue._id)}
                  className="btn btn-outline rounded-2xl border-error/20 text-error hover:border-error hover:bg-error/10"
                  title="Delete Issue"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-[2rem] border border-base-200 bg-base-100 shadow-sm md:block xl:rounded-[3rem]">
          <div className="overflow-x-auto">
            <table className="table table-lg">
              <thead>
                <tr className="border-b border-base-200 bg-base-200/30">
                  <th className="py-6 pl-8 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                    #
                  </th>
                  <th className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                    Issue Details
                  </th>
                  <th className="py-6 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                    Category
                  </th>
                  <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                    Budget & Status
                  </th>
                  <th className="py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {reversed.map((issue, index) => (
                  <tr
                    key={issue._id}
                    className="border-b border-base-200/50 transition-colors hover:bg-base-200/30"
                  >
                    <td className="pl-8 font-black text-base-content/20">{index + 1}</td>

                    <td className="py-6">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="mask mask-squircle h-14 w-14 overflow-hidden bg-base-200 ring-4 ring-base-200 ring-offset-2">
                            <img
                              src={issue.image || "https://i.ibb.co/CpHdF8h2/icons8-user.gif"}
                              alt={issue.title}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className="max-w-[250px]">
                          <div className="truncate font-black text-secondary">{issue.title}</div>
                          <div className="mt-1 flex items-center gap-1 text-xs font-bold text-base-content/40">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                            {issue.location}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-lg rounded-xl border-secondary/10 bg-secondary/5 px-4 py-4 font-bold text-secondary">
                        {issue.category}
                      </span>
                    </td>

                    <td className="px-8 text-right">
                      <div className="text-xl font-black text-secondary">${issue.amount}</div>
                      <div
                        className={`badge badge-sm mt-2 border-none px-3 font-black uppercase tracking-widest ${
                          issue.status?.toLowerCase() === "ongoing"
                            ? "bg-warning/10 text-warning"
                            : "bg-success/10 text-success"
                        }`}
                      >
                        {issue.status}
                      </div>
                    </td>

                    <td>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedIssue(issue);
                            issueModalRef.current?.showModal();
                          }}
                          className="btn btn-square btn-ghost rounded-xl text-primary transition-all hover:bg-primary/10"
                          title="Update Issue"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteIssue(issue._id)}
                          className="btn btn-square btn-ghost rounded-xl text-error transition-all hover:bg-error/10"
                          title="Delete Issue"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <dialog ref={issueModalRef} className="modal modal-bottom backdrop-blur-sm sm:modal-middle">
          <div className="modal-box w-full max-w-2xl overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 p-0 shadow-2xl sm:rounded-[3rem]">
            <div className="relative bg-linear-to-r from-primary to-secondary p-5 text-white sm:p-8">
              <button
                onClick={() => issueModalRef.current?.close()}
                className="btn btn-circle btn-sm btn-ghost absolute right-4 top-4 hover:bg-white/10"
              >
                ✕
              </button>
              <h2 className="mb-1 text-2xl font-black sm:text-3xl">Update Report</h2>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70">
                Editing ID: {selectedIssue?._id?.slice(-8)}
              </p>
            </div>

            <form onSubmit={handleUpdateIssue} className="space-y-5 p-4 text-secondary sm:p-6 md:space-y-6 md:p-12">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-bold text-secondary/60">Issue Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedIssue.title}
                    className="input input-bordered input-lg w-full rounded-2xl border-transparent bg-base-200/50 font-bold transition-all focus:input-primary focus:bg-base-100"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-secondary/60">Category</span>
                  </label>
                  <select
                    name="category"
                    defaultValue={selectedIssue.category}
                    className="select select-bordered select-lg w-full rounded-2xl border-transparent bg-base-200/50 font-bold transition-all focus:select-primary focus:bg-base-100"
                  >
                    <option>Garbage</option>
                    <option>Illegal Construction</option>
                    <option>Broken Public Property</option>
                    <option>Road Damage</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-secondary/60">Budget ($)</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    defaultValue={selectedIssue.amount}
                    className="input input-bordered input-lg w-full rounded-2xl border-transparent bg-base-200/50 font-bold transition-all focus:input-primary focus:bg-base-100"
                    required
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-bold text-secondary/60">Description</span>
                  </label>
                  <textarea
                    name="description"
                    defaultValue={selectedIssue.description}
                    className="textarea textarea-bordered textarea-lg min-h-[120px] w-full rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:textarea-primary focus:bg-base-100"
                    required
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label font-bold text-secondary/60">Progress Status</label>
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <label
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                        selectedIssue.status === "ongoing"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-transparent bg-base-200/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="ongoing"
                        defaultChecked={selectedIssue.status === "ongoing"}
                        className="radio radio-primary"
                      />
                      <span className="font-bold">Ongoing</span>
                    </label>
                    <label
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                        selectedIssue.status === "ended"
                          ? "border-success bg-success/10 text-success"
                          : "border-transparent bg-base-200/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="ended"
                        defaultChecked={selectedIssue.status === "ended"}
                        className="radio radio-success"
                      />
                      <span className="font-bold">Ended</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  className="btn btn-primary min-h-14 w-full rounded-2xl px-4 font-black tracking-tight shadow-xl shadow-primary/20 sm:btn-lg"
                >
                  Update Issue Report
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </Fade>
  );
};

export default MyIssues;
