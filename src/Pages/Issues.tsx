import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Fade } from "react-awesome-reveal";
import { ArrowRight, MapPin, Search } from "lucide-react";
import Container from "../Components/Container";
import Loading from "../Components/Loading";
import useAxios from "../Hooks/useAxios";
import type { Issue } from "../types/entities";

type SortOption = "newest" | "oldest" | "budget-high" | "budget-low";

const Issues = () => {
  const axiosInstance = useAxios();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get<Issue[]>("/issues", {
        params: { category, status },
      })
      .then((res) => {
        setIssues(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [axiosInstance, category, status]);

  useEffect(() => {
    let result = [...issues];

    if (searchTerm) {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (issue) =>
          issue.title.toLowerCase().includes(normalizedSearchTerm) ||
          issue.location.toLowerCase().includes(normalizedSearchTerm)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "budget-high") return Number(b.amount) - Number(a.amount);
      if (sortBy === "budget-low") return Number(a.amount) - Number(b.amount);
      if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      return 0;
    });

    setFilteredIssues(result);
  }, [issues, searchTerm, sortBy]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-200/30">
      <Container className="py-12 md:py-20">
        <title>Explore Issues | CleanCity</title>

        <header className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-black tracking-tight text-secondary md:text-6xl">
            Community <span className="text-primary italic">Reports</span>
          </h1>
          <p className="text-lg font-medium leading-relaxed text-secondary/60">
            Discover local challenges reported by citizens. Join the movement to
            clean up and upgrade our environment.
          </p>
        </header>

        <div className="mb-12 flex flex-col items-center gap-6 rounded-[2.5rem] border border-base-200 bg-base-100 p-4 shadow-sm md:p-6 lg:flex-row">
          <div className="relative w-full lg:flex-1">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by title or location..."
              className="input input-lg w-full rounded-2xl border-transparent bg-base-200/50 pl-14 font-medium transition-all focus:bg-base-100"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="flex w-full flex-wrap gap-4 lg:w-auto">
            <div className="flex-1 lg:w-48">
              <select
                onChange={(event) => setCategory(event.target.value)}
                className="select select-lg w-full rounded-2xl border-transparent bg-base-200/50 font-bold text-secondary/70 focus:bg-base-100"
                value={category}
              >
                <option value="all">All Categories</option>
                <option value="Garbage">Garbage</option>
                <option value="Illegal Construction">Illegal Construction</option>
                <option value="Broken Public Property">Broken Public Property</option>
                <option value="Road Damage">Road Damage</option>
              </select>
            </div>

            <div className="flex-1 lg:w-48">
              <select
                onChange={(event) => setStatus(event.target.value)}
                className="select select-lg w-full rounded-2xl border-transparent bg-base-200/50 font-bold text-secondary/70 focus:bg-base-100"
                value={status}
              >
                <option value="all">Any Status</option>
                <option value="ongoing">Ongoing</option>
                <option value="ended">Ended</option>
              </select>
            </div>

            <div className="flex-1 lg:w-56">
              <select
                onChange={(event) => setSortBy(event.target.value as SortOption)}
                className="select select-lg w-full rounded-2xl border-transparent bg-base-200/50 font-bold text-secondary/70 focus:bg-base-100"
                value={sortBy}
              >
                <option value="newest">Sort by: Newest</option>
                <option value="oldest">Sort by: Oldest</option>
                <option value="budget-high">Budget: High to Low</option>
                <option value="budget-low">Budget: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        <Fade triggerOnce>
          {filteredIssues.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-base-200 bg-base-100 py-20">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-base-200 text-primary/40">
                <Search size={48} />
              </div>
              <h3 className="text-2xl font-black text-secondary">No issues found</h3>
              <p className="font-medium text-secondary/50">
                Try adjusting your filters or search terms
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredIssues.map((issue) => (
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
                        className="btn btn-primary btn-circle btn-md transition-all hover:scale-110 active:scale-95"
                      >
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Fade>
      </Container>
    </div>
  );
};

export default Issues;
