import { Link } from "react-router";
import { FaHardHat, FaRoad, FaTools, FaTrash } from "react-icons/fa";
import type { IconType } from "react-icons";
import type { Issue } from "../types/entities";

interface AllIssuesProps {
  issues: Issue[];
}

interface ColorScheme {
  gradient: string;
  bg: string;
  text: string;
}

const AllIssues = ({ issues }: AllIssuesProps) => {
  const getCategoryMeta = (category: string): { Icon: IconType; colorScheme: ColorScheme } => {
    if (category === "Garbage") {
      return {
        Icon: FaTrash,
        colorScheme: {
          gradient: "from-green-400 to-emerald-600",
          bg: "bg-green-500",
          text: "text-green-600",
        },
      };
    }

    if (category === "Illegal Construction") {
      return {
        Icon: FaHardHat,
        colorScheme: {
          gradient: "from-orange-400 to-red-600",
          bg: "bg-orange-500",
          text: "text-orange-600",
        },
      };
    }

    if (category === "Road Damage") {
      return {
        Icon: FaRoad,
        colorScheme: {
          gradient: "from-red-400 to-rose-600",
          bg: "bg-red-500",
          text: "text-red-600",
        },
      };
    }

    return {
      Icon: FaTools,
      colorScheme: {
        gradient: "from-amber-400 to-yellow-600",
        bg: "bg-amber-500",
        text: "text-amber-600",
      },
    };
  };

  if (issues.length === 0) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-center text-5xl font-semibold text-warning">Issue Not Found</div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br">
      <div className="mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {issues.map((issue) => {
          const { Icon, colorScheme } = getCategoryMeta(issue.category);

          return (
            <article
              key={issue._id}
              className="group overflow-hidden rounded-4xl border border-base-200 bg-base-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`bg-linear-to-r ${colorScheme.gradient} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className={`rounded-2xl ${colorScheme.bg} p-4 text-white shadow-lg`}>
                    <Icon size={28} />
                  </div>
                  <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-widest">
                    {issue.category}
                  </span>
                </div>
                <h3 className="mt-6 text-2xl font-black">{issue.title}</h3>
                <p className="mt-2 text-sm text-white/80">{issue.location}</p>
              </div>

              <div className="space-y-5 p-6">
                <p className="line-clamp-3 text-sm leading-relaxed text-base-content/70">
                  {issue.description}
                </p>
                <div className="flex items-center justify-between border-t border-base-200 pt-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-base-content/40">
                      Budget
                    </p>
                    <p className={`text-lg font-black ${colorScheme.text}`}>${issue.amount}</p>
                  </div>
                  <Link to={`/issue-details/${issue._id}`} className="btn btn-primary rounded-xl">
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default AllIssues;
