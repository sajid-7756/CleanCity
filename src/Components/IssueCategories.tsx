import type { LucideIcon } from "lucide-react";
import { ArrowRight, HardHat, Kanban, Trash2, Wrench } from "lucide-react";
import { Link } from "react-router";
import Container from "./Container";

interface Category {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  slug: string;
}

const categories: Category[] = [
  {
    id: 1,
    title: "Garbage & Waste",
    description: "Help eliminate eyesores and health hazards from our streets.",
    icon: Trash2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    slug: "Garbage",
  },
  {
    id: 2,
    title: "Illegal Construction",
    description: "Protect our urban planning and safety standards.",
    icon: HardHat,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    slug: "Illegal Construction",
  },
  {
    id: 3,
    title: "Public Facilities",
    description: "Repair broken lights, benches, and community assets.",
    icon: Wrench,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    slug: "Broken Public Property",
  },
  {
    id: 4,
    title: "Road Infrastructure",
    description: "Fix potholes and ensure safe transit for everyone.",
    icon: Kanban,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    slug: "Road Damage",
  },
];

const CategoriesSection = () => {
  return (
    <div className="bg-base-100 py-24 md:py-32">
      <Container>
        <div className="mb-20 flex flex-col items-center text-center">
          <h2 className="mb-6 text-4xl font-black tracking-tight text-secondary md:text-6xl">
            Issue <span className="text-primary italic">Categories</span>
          </h2>
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-secondary/60">
            Quickly identify and report problems by category. Each sector represents a
            specialized effort in our cleanup mission.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              to={`/issues?category=${category.slug}`}
              key={category.id}
              className="group flex flex-col rounded-[2.5rem] border border-transparent bg-base-200/50 p-10 transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 hover:bg-base-100 hover:shadow-2xl hover:shadow-primary/5"
            >
              <div
                className={`mb-8 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${category.bgColor} ${category.color}`}
              >
                <category.icon size={36} />
              </div>

              <h3 className="mb-4 text-xl font-extrabold text-secondary transition-colors group-hover:text-primary">
                {category.title}
              </h3>

              <p className="mb-8 flex-1 text-sm font-bold leading-relaxed text-secondary/50">
                {category.description}
              </p>

              <div className="mt-auto flex translate-y-4 items-center justify-between border-t border-base-content/5 pt-8 text-xs font-black uppercase tracking-widest text-primary opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                Explore Category
                <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default CategoriesSection;
