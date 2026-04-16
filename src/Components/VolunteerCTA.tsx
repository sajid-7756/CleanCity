import { Link } from "react-router";
import { FaHandsHelping, FaLeaf } from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import Container from "./Container";

const VolunteerCTA = () => {
  return (
    <Container className="mb-10 rounded-2xl p-8 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <FaHandsHelping className="text-4xl text-primary" />
              </div>
            </div>

            <h2 className="text-4xl font-bold leading-tight text-base-content lg:text-5xl">
              Join Our{" "}
              <span className="text-primary">
                <Typewriter words={["Clean Drive"]} loop />
              </span>
            </h2>

            <p className="text-lg leading-relaxed text-base-content/70">
              Be part of a community that cares. Together we can keep our streets,
              parks, and neighborhoods clean and green. Sign up as a volunteer and make
              a real impact today.
            </p>

            <div className="pt-4">
              <Link
                to="/register"
                className="btn btn-primary btn-lg text-primary-content shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-primary-focus"
              >
                <FaLeaf className="mr-2" />
                Become a Volunteer
              </Link>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-2xl transition-all duration-300 group-hover:blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop"
                alt="Volunteers cleaning community"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default VolunteerCTA;
