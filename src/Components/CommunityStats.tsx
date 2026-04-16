import { useContext, useEffect, useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Award, CheckCircle2, Timer, Users } from "lucide-react";
import Container from "./Container";
import useAxios from "../Hooks/useAxios";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";
import type { Issue } from "../types/entities";

interface CommunityUser {
  _id?: string;
  email?: string;
}

const CommunityStats = () => {
  const authContext = useContext(AuthContext);
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState<CommunityUser[]>([]);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);

  useEffect(() => {
    axiosInstance
      .get<CommunityUser[]>("/users")
      .then((data) => {
        setStats(data.data);
      })
      .catch((error) => console.error(error));
  }, [axiosInstance]);

  useEffect(() => {
    if (authContext?.user?.email) {
      axiosSecure
        .get<Issue[]>(`/myIssue/?email=${authContext.user.email}`)
        .then((res) => {
          setMyIssues(res.data);
        })
        .catch((error) => console.log(error));
    }
  }, [authContext?.user?.email, axiosSecure]);

  const pendingIssue = myIssues.filter((issue) => issue.status === "ongoing");
  const resolvedIssue = myIssues.filter((issue) => issue.status === "ended");
  const { ref, inView } = useInView({ triggerOnce: true });

  const statCards = [
    {
      label: "Registered Users",
      value: stats.length,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "Citizens making a difference",
    },
    {
      label: "Issues Resolved",
      value: resolvedIssue.length,
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
      description: "Successfully cleaned up",
    },
    {
      label: "Active Reports",
      value: pendingIssue.length,
      icon: Timer,
      color: "text-warning",
      bgColor: "bg-warning/10",
      description: "Awaiting community action",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-secondary py-24 md:py-32">
      <div className="absolute right-0 top-0 -mr-48 -mt-48 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-48 -ml-48 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      <Container>
        <div className="mb-20 flex flex-col items-center text-center">
          <h2 className="mb-6 text-4xl font-black tracking-tight text-white md:text-6xl">
            Global <span className="text-primary italic">Impact</span>
          </h2>
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-white/60">
            Real-time insights into community efforts. Every number represents a
            cleaner and safer neighborhood.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="group relative rounded-[3rem] border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/10"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`mb-8 rounded-3xl p-6 transition-transform group-hover:scale-110 ${stat.bgColor} ${stat.color}`}
                >
                  <stat.icon size={40} />
                </div>

                <div ref={ref} className="mb-2 text-5xl font-black tabular-nums text-white">
                  {inView ? <CountUp end={stat.value} duration={2.5} /> : 0}
                </div>

                <div className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-primary">
                  {stat.label}
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center">
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <Award className="text-primary" size={24} />
            <span className="text-sm font-bold tracking-wide text-white">
              Cleanest Neighborhood Award: December 2025
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CommunityStats;
