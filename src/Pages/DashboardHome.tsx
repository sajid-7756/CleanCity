import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loading from "../Components/Loading";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import type { Issue } from "../types/entities";
import useRole from "../Hooks/useRole";

const COLORS = ["#10b981", "#f59e0b", "#3b82f6"];

const DashboardHome = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const [role] = useRole();

  useEffect(() => {
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
  }, [axiosSecure]);

  const pendingIssues = issues.filter((issue) => issue.status === "ongoing");
  const pendingReviewIssues = issues.filter(
    (issue) => issue.status === "pending",
  );
  const resolvedIssues = issues.filter((issue) => issue.status === "ended");

  const pieData = [
    { name: "Ended", value: resolvedIssues.length || 0 },
    { name: "Ongoing", value: pendingIssues.length || 0 },
    { name: "Pending Review", value: pendingReviewIssues.length || 0 },
  ].filter((i) => i.value > 0);

  const monthlyData = issues.reduce(
    (acc, issue) => {
      const date = new Date(issue.date);
      if (isNaN(date.getTime())) return acc;
      const month = date.toLocaleString("default", { month: "short" });
      if (!acc[month]) {
        acc[month] = { name: month, issues: 0, resolved: 0 };
      }
      acc[month].issues += 1;
      if (issue.status === "ended") {
        acc[month].resolved += 1;
      }
      return acc;
    },
    {} as Record<string, { name: string; issues: number; resolved: number }>,
  );

  const data = Object.values(monthlyData);
  if (data.length === 0) {
    data.push({ name: "Current month", issues: 0, resolved: 0 });
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="animate-fade-in space-y-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-black text-secondary">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-base-content/60">
            Welcome back! Here's what's happening in your community.
          </p>
        </div>
      </div>

      {role === "admin" && pendingReviewIssues.length > 0 && (
        <div className="flex items-center gap-4 rounded-2xl border border-error/30 bg-error/10 px-6 py-4">
          <ShieldAlert className="shrink-0 text-error" size={24} />
          <div>
            <p className="font-black text-error">
              {pendingReviewIssues.length} issue
              {pendingReviewIssues.length > 1 ? "s" : ""} awaiting proof review!
            </p>
            <p className="text-sm text-error/70">
              Scroll down to the issues table to review and approve or reject.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Issues Reported",
            value: issues.length,
            icon: <AlertCircle className="text-warning" />,
            trend: "+12%",
            color: "bg-warning/10",
          },
          {
            label: "Issues Resolved",
            value: resolvedIssues.length,
            icon: <CheckCircle2 className="text-success" />,
            trend: "+18%",
            color: "bg-success/10",
          },
          {
            label: "Pending Review",
            value: pendingReviewIssues.length,
            icon: <ShieldAlert className="text-error" />,
            trend:
              pendingReviewIssues.length > 0 ? "Action needed" : "All clear",
            color: "bg-error/10",
          },
          {
            label: "Ongoing",
            value: pendingIssues.length,
            icon: <Clock className="text-info" />,
            trend: "-5%",
            color: "bg-info/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-[2.5rem] border border-base-200 bg-base-100 p-8 shadow-sm transition-all hover:shadow-xl"
          >
            <div
              className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}
            >
              {stat.icon}
            </div>
            <p className="mb-2 text-sm font-black uppercase tracking-widest text-base-content/40">
              {stat.label}
            </p>
            <div className="flex items-end justify-between">
              <h3 className="text-4xl font-black tracking-tighter text-secondary">
                {stat.value}
              </h3>
              <div className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-bold text-success">
                <ArrowUpRight size={12} />
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-[3rem] border border-base-200 bg-base-100 p-8 shadow-sm lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-secondary">
                Community Performance
              </h3>
              <p className="text-xs font-bold uppercase tracking-widest text-base-content/40">
                Yearly comparisons
              </p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-2 text-xs font-bold">
                <div className="h-3 w-3 rounded-full bg-primary" /> Issues
              </span>
              <span className="flex items-center gap-2 text-xs font-bold">
                <div className="h-3 w-3 rounded-full bg-secondary" /> Resolved
              </span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: "#F1F5F9" }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="issues"
                  fill="oklch(65% 0.2 155)"
                  radius={[10, 10, 0, 0]}
                />
                <Bar
                  dataKey="resolved"
                  fill="oklch(35% 0.05 240)"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[3rem] bg-secondary p-8 text-secondary-content shadow-xl">
          <div className="relative z-10 flex h-full flex-col">
            <h3 className="mb-2 text-2xl font-black">Issue Status</h3>
            <p className="mb-8 text-xs font-bold uppercase tracking-widest opacity-60">
              Today's snapshot
            </p>

            <div className="h-60 min-h-60 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-4">
              {pieData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="font-bold opacity-80">{item.name}</span>
                  </div>
                  <span className="font-black">{item.value}+</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;
