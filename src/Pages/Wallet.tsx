import { useContext, useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  CheckCircle2,
  Clock,
  Wallet as WalletIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import Loading from "../Components/Loading";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";
import type { Issue } from "../types/entities";

const Wallet = () => {
  const axiosSecure = useAxiosSecure();
  const authContext = useContext(AuthContext);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const email = authContext?.user?.email;

  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    axiosSecure
      .get<Issue[]>("/issues")
      .then((res) => {
        setIssues(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [email, axiosSecure]);

  // Approved cleanings by this user
  const approvedCleanings = issues.filter(
    (i) => i.cleanedBy === email && i.status === "ended",
  );

  // Pending cleanings (money not yet confirmed)
  const pendingCleanings = issues.filter(
    (i) => i.cleanedBy === email && i.status === "pending",
  );

  const totalEarned = approvedCleanings.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0,
  );

  const pendingAmount = pendingCleanings.reduce(
    (sum, i) => sum + Number(i.amount || 0),
    0,
  );

  const handleWithdraw = () => {
    toast("Withdraw feature coming soon! 🚀", {
      icon: "🔒",
      style: {
        borderRadius: "16px",
        background: "#1e293b",
        color: "#fff",
        fontWeight: "bold",
      },
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Fade triggerOnce>
      <div className="animate-fade-in space-y-8">
        <title>My Wallet</title>

        {/* Header */}
        <div>
          <h1 className="text-4xl font-black tracking-tight text-secondary">
            My Wallet
          </h1>
          <p className="mt-2 font-medium text-base-content/60">
            Earn rewards by cleaning reported issues in your community.
          </p>
        </div>

        {/* Balance Card */}
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-secondary via-secondary to-primary p-8 text-white shadow-2xl md:p-10">
          {/* Background decoration */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <WalletIcon size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-white/50">
                  Available Balance
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-end gap-2">
              <h2 className="text-6xl font-black tracking-tight md:text-7xl">
                ৳{totalEarned.toLocaleString()}
              </h2>
              <span className="mb-2 text-lg font-bold text-white/50">BDT</span>
            </div>

            {pendingAmount > 0 && (
              <p className="mt-3 flex items-center gap-2 text-sm font-bold text-white/60">
                <Clock size={14} />
                ৳{pendingAmount.toLocaleString()} pending review
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={handleWithdraw}
                className="btn rounded-2xl border-2 border-white/20 bg-white px-8 font-black text-secondary shadow-xl hover:bg-white/90"
              >
                <ArrowUpRight size={18} />
                Withdraw
              </button>
              <button
                onClick={handleWithdraw}
                className="btn rounded-2xl border-2 border-white/20 bg-white/10 px-8 font-black text-white backdrop-blur-sm hover:bg-white/20"
              >
                <Banknote size={18} />
                Transfer
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="group rounded-3xl border border-success/20 bg-base-100 px-6 py-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 transition-transform group-hover:scale-110">
                <CheckCircle2 size={22} className="text-success" />
              </div>
              <div>
                <p className="text-2xl font-black text-secondary">
                  {approvedCleanings.length}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">
                  Cleanings Paid
                </p>
              </div>
            </div>
          </div>

          <div className="group rounded-3xl border border-warning/20 bg-base-100 px-6 py-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10 transition-transform group-hover:scale-110">
                <Clock size={22} className="text-warning" />
              </div>
              <div>
                <p className="text-2xl font-black text-secondary">
                  {pendingCleanings.length}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">
                  Pending Payouts
                </p>
              </div>
            </div>
          </div>

          <div className="group rounded-3xl border border-primary/20 bg-base-100 px-6 py-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-transform group-hover:scale-110">
                <Banknote size={22} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-black text-secondary">
                  ৳{(totalEarned + pendingAmount).toLocaleString()}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">
                  Lifetime Earnings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="rounded-[3rem] border border-base-200 bg-base-100 p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-black text-secondary">
            Earning History
          </h2>

          {approvedCleanings.length === 0 && pendingCleanings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-base-300 bg-base-200/30 px-6 py-12 text-center">
              <WalletIcon
                size={40}
                className="mx-auto mb-4 text-base-content/20"
              />
              <p className="text-lg font-bold text-secondary/60">
                No earnings yet
              </p>
              <p className="mt-2 text-sm text-base-content/40">
                Start cleaning reported issues to earn rewards!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Pending items first */}
              {pendingCleanings.map((issue) => (
                <div
                  key={issue._id}
                  className="flex items-center gap-4 rounded-2xl border border-warning/20 bg-warning/5 p-4 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-warning/10">
                    <Clock size={18} className="text-warning" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-secondary">
                      {issue.title}
                    </p>
                    <p className="text-xs text-base-content/40">
                      Pending admin review
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-black text-warning">
                      +৳{Number(issue.amount).toLocaleString()}
                    </p>
                    <span className="badge badge-warning badge-xs font-bold">
                      pending
                    </span>
                  </div>
                </div>
              ))}

              {/* Approved items */}
              {approvedCleanings.map((issue) => (
                <div
                  key={issue._id}
                  className="flex items-center gap-4 rounded-2xl border border-success/20 bg-success/5 p-4 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-success/10">
                    <ArrowDownLeft size={18} className="text-success" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-secondary">
                      {issue.title}
                    </p>
                    <p className="text-xs text-base-content/40">
                      Cleaning reward • {issue.location}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-black text-success">
                      +৳{Number(issue.amount).toLocaleString()}
                    </p>
                    <span className="badge badge-success badge-xs font-bold">
                      received
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Fade>
  );
};

export default Wallet;
