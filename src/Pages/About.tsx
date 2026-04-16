import Container from "../Components/Container";

const About = () => {
  return (
    <div className="py-20">
      <Container>
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <h1 className="text-5xl font-extrabold text-secondary">
            About <span className="text-primary">CleanCity</span>
          </h1>
          <p className="text-xl leading-relaxed text-base-content/70">
            CleanCity is a community-driven platform dedicated to improving our local
            environments. We believe that every citizen has the power to make a difference.
            By providing a simple, transparent way to report and track environmental issues,
            we empower individuals to take action and hold authorities accountable.
          </p>
          <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-3">
            <div className="rounded-2xl bg-base-200 p-6">
              <h3 className="mb-2 text-2xl font-bold text-primary">Our Mission</h3>
              <p>
                To create cleaner, safer, and more sustainable neighborhoods through
                community collaboration.
              </p>
            </div>
            <div className="rounded-2xl bg-base-200 p-6">
              <h3 className="mb-2 text-2xl font-bold text-primary">Our Vision</h3>
              <p>
                A world where every environmental problem is met with a swift and
                effective community response.
              </p>
            </div>
            <div className="rounded-2xl bg-base-200 p-6">
              <h3 className="mb-2 text-2xl font-bold text-primary">Our Values</h3>
              <p>
                Transparency, accountability, community, and sustainability are at the
                heart of everything we do.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default About;
