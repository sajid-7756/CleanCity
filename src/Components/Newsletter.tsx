import { Mail } from "lucide-react";
import Container from "./Container";

const Newsletter = () => {
  return (
    <section className="py-20">
      <Container>
        <div className="relative overflow-hidden rounded-[3rem] border border-primary/10 bg-primary/5 p-12 lg:p-20">
          <div className="absolute right-0 top-0 -mr-20 -mt-20 h-80 w-80 scale-150 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 scale-150 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-12 text-center lg:flex-row lg:text-left">
            <div className="space-y-6 lg:w-1/2">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary">
                <Mail size={16} />
                Newsletter
              </div>
              <h2 className="text-4xl font-extrabold leading-tight text-secondary lg:text-5xl">
                Join Our <span className="text-primary">Green</span> Revolution
              </h2>
              <p className="text-xl text-base-content/70">
                Subscribe to get the latest updates on resolved issues and upcoming
                community clean drives.
              </p>
            </div>
            <div className="w-full max-w-md lg:w-1/2">
              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered input-lg flex-1 rounded-2xl shadow-sm focus:input-primary"
                />
                <button className="btn btn-primary btn-lg rounded-2xl px-10 shadow-lg shadow-primary/20">
                  Subscribe
                </button>
              </div>
              <p className="mt-4 text-xs text-base-content/50">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Newsletter;
