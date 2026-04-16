import Container from "./Container";

const partners = [
  "City Waste Management",
  "Eco Solutions NGO",
  "Green Earth Initiative",
  "Urban Clean Dept",
  "Sustainable Futures",
  "Nature Keepers",
];

const Partners = () => {
  return (
    <section className="border-b border-t border-base-200 bg-base-200/30 py-16">
      <Container>
        <p className="mb-10 text-center text-sm font-bold uppercase tracking-widest text-base-content/40">
          Trusted By Leading Organizations
        </p>
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale transition-all hover:grayscale-0 lg:gap-20">
          {partners.map((partner) => (
            <div
              key={partner}
              className="cursor-default select-none text-2xl font-black text-secondary/60 transition-colors hover:text-primary"
            >
              {partner}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Partners;
