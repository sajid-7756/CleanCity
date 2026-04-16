import type { ReactNode } from "react";
import { Lightbulb, Shield, Users, Zap } from "lucide-react";
import Container from "./Container";

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Fast Reporting",
    description:
      "Report issues in seconds with our streamlined submission process and instant notifications.",
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Verified Action",
    description:
      "Our team coordinates with local authorities to ensure every reported issue is addressed.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Community Driven",
    description:
      "Join thousands of active citizens working together to improve our living standards.",
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: "Smart Tracking",
    description:
      "Track the real-time status of your reports from submission to resolution.",
  },
];

const Features = () => {
  return (
    <section className="bg-base-200/50 py-20">
      <Container>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-secondary">
            Why Choose <span className="text-primary">CleanCity</span>?
          </h2>
          <p className="text-base-content/70">
            We provide the most effective platform for community-led environmental
            improvement and issue resolution.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-base-200 bg-base-100 p-8 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:text-primary-content">
                {feature.icon}
              </div>
              <h3 className="mb-4 text-xl font-bold">{feature.title}</h3>
              <p className="leading-relaxed text-base-content/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;
