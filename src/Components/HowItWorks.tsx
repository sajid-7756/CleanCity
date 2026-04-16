import type { ReactNode } from "react";
import { CheckCircle2, ClipboardEdit, MapPin } from "lucide-react";
import Container from "./Container";

interface Step {
  icon: ReactNode;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    icon: <ClipboardEdit className="h-10 w-10" />,
    title: "Report Issue",
    desc: "Take a photo and describe the environmental issue in your area.",
  },
  {
    icon: <MapPin className="h-10 w-10" />,
    title: "Tag Location",
    desc: "Specify the exact location so authorities can find it easily.",
  },
  {
    icon: <CheckCircle2 className="h-10 w-10" />,
    title: "Issue Resolved",
    desc: "Authorities or volunteers fix the problem and update live status.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20">
      <Container>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-secondary">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-base-content/70">
            Join our community and follow these three simple steps to start making an impact.
          </p>
        </div>
        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="absolute left-0 top-1/2 z-0 hidden h-0.5 w-full -translate-y-12 bg-primary/10 md:block" />

          {steps.map((step, index) => (
            <div key={step.title} className="relative z-10 flex flex-col items-center space-y-6 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-base-100 bg-primary text-primary-content shadow-xl shadow-primary/30">
                {step.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="mx-auto max-w-xs text-base-content/60">{step.desc}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-lg font-bold text-secondary-content shadow-lg">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
