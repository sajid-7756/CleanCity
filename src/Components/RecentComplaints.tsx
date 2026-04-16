import { useEffect, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router";
import Container from "./Container";
import Loading from "./Loading";
import useAxios from "../Hooks/useAxios";
import type { Issue } from "../types/entities";

const RecentComplaints = () => {
  const [latestIssues, setLatestIssues] = useState<Issue[]>([]);
  const axiosInstance = useAxios();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get<Issue[]>("/latest-issues")
      .then((res) => {
        setLatestIssues(res.data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, [axiosInstance]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="overflow-hidden bg-base-100 py-24 md:py-32">
      <Container>
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="mb-6 text-4xl font-black tracking-tight text-secondary md:text-6xl">
              Recent <span className="text-primary italic">Reports</span>
            </h2>
            <p className="text-lg font-medium leading-relaxed text-secondary/60">
              Stay updated with the latest community reports. Real problems being
              solved by real people in real-time.
            </p>
          </div>
          <Link to="/issues" className="btn btn-secondary group gap-2 rounded-2xl font-bold">
            Browse All Reports
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {latestIssues.slice(0, 6).map((issue) => (
            <div
              key={issue._id}
              className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-base-200 bg-base-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-base-content/10" />

                <div className="absolute right-6 top-6">
                  <span className="badge badge-lg rounded-2xl border-none bg-white/90 px-6 py-5 text-xs font-black uppercase tracking-widest text-secondary shadow-xl backdrop-blur-md">
                    {issue.category}
                  </span>
                </div>

                <div className="absolute bottom-6 left-6">
                  <div className="rounded-2xl bg-primary p-3 px-5 text-xl font-black text-white shadow-2xl">
                    ${issue.amount}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-8">
                <div className="mb-4 flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      issue.status === "ongoing" ? "animate-pulse bg-warning" : "bg-success"
                    }`}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary/40">
                    {issue.status}
                  </span>
                </div>

                <h2 className="mb-4 text-2xl font-extrabold leading-tight text-secondary transition-colors group-hover:text-primary">
                  {issue.title}
                </h2>

                <div className="mb-6 flex items-center gap-2 text-sm font-bold text-secondary/60">
                  <MapPin size={16} className="text-primary" />
                  {issue.location}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-base-200 pt-6">
                  <div className="text-xs font-bold italic text-secondary/40">
                    Reported {new Date(issue.date).toLocaleDateString()}
                  </div>
                  <Link
                    to={`/issue-details/${issue._id}`}
                    className="btn btn-primary btn-circle btn-md shadow-lg shadow-primary/20 transition-all hover:scale-110 active:scale-95"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default RecentComplaints;
