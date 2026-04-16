import Container from "./Container";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Jenkins",
    role: "Local Resident",
    content:
      "CleanCity made it so easy to report the illegal dumping in my neighborhood. It was cleared within 48 hours!",
    image: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "David Chen",
    role: "Volunteer",
    content:
      "I love being able to see where help is needed most. The platform connects us perfectly with the community needs.",
    image: "https://i.pravatar.cc/150?u=david",
  },
  {
    name: "Elena Rodriguez",
    role: "City Official",
    content:
      "The organized data from CleanCity helps our team prioritize issues and allocate resources efficiently.",
    image: "https://i.pravatar.cc/150?u=elena",
  },
];

const Testimonials = () => {
  return (
    <section className="overflow-hidden py-20">
      <Container>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-secondary">
            What Our <span className="text-primary">Community</span> Says
          </h2>
          <p className="text-base-content/70">
            Real stories from the people making a difference every day using our platform.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="group relative flex flex-col items-center space-y-4 overflow-hidden rounded-3xl border border-base-200 bg-base-100 p-8 text-center shadow-sm"
            >
              <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                <Star className="h-16 w-16 fill-primary" />
              </div>
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="h-20 w-20 rounded-full border-4 border-primary/20 p-1"
              />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="leading-relaxed text-base-content/80 italic">"{testimonial.content}"</p>
              <div>
                <h4 className="text-lg font-bold">{testimonial.name}</h4>
                <p className="text-sm font-medium text-primary">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
