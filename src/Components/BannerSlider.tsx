import Slider from "react-slick";
import type { CustomArrowProps, Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PrevArrow = ({ onClick }: CustomArrowProps) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-base-100/90 p-3 shadow-lg transition-all hover:bg-base-100"
  >
    <FaChevronLeft className="text-primary" size={20} />
  </button>
);

const NextArrow = ({ onClick }: CustomArrowProps) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-base-100/90 p-3 shadow-lg transition-all hover:bg-base-100"
  >
    <FaChevronRight className="text-primary" size={20} />
  </button>
);

const handleScrollDown = () => {
  window.scrollTo({
    top: 650,
    behavior: "smooth",
  });
};

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
}

const BannerSlider = () => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: (dots) => (
      <div className="bottom-10">
        <ul className="flex justify-center gap-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="h-1 w-12 rounded-full bg-white/20 transition-all duration-300 hover:bg-white/40" />
    ),
  };

  const slides: Slide[] = [
    {
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1920",
      title: "Keep Your Community <span class='text-primary'>Clean</span>",
      subtitle: "Join thousands of citizens reporting and resolving issues in real-time.",
      cta: "Report Now",
    },
    {
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1920",
      title: "Empowering <span class='text-primary'>Action</span>",
      subtitle: "Connecting citizens with authorities for a sustainable future.",
      cta: "Explore Issues",
    },
    {
      image: "https://images.unsplash.com/photo-1536939459926-301728717817?q=80&w=1920",
      title: "Build a <span class='text-primary'>Greener</span> World",
      subtitle: "Track your impact and see the difference you make every day.",
      cta: "Join Community",
    },
  ];

  return (
    <div className="banner-slider group relative">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide.title} className="outline-none">
            <div className="relative min-h-[500px] overflow-hidden h-[70vh]">
              <img
                src={slide.image}
                alt="Banner"
                className="h-full w-full scale-105 object-cover transition-transform duration-[10000ms] group-hover:scale-100"
              />
              <div className="absolute inset-0 bg-linear-to-r from-secondary/90 via-secondary/40 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-t from-secondary/60 to-transparent" />

              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-6 md:px-12">
                  <div className="max-w-3xl space-y-6 animate-fade-in">
                    <h2
                      className="text-5xl font-extrabold leading-tight text-white drop-shadow-2xl md:text-7xl"
                      dangerouslySetInnerHTML={{ __html: slide.title }}
                    />
                    <p className="max-w-xl text-xl font-medium text-white/80 drop-shadow-lg md:text-2xl">
                      {slide.subtitle}
                    </p>
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleScrollDown}
                        className="btn btn-primary btn-lg group/btn rounded-2xl px-10 shadow-2xl shadow-primary/30"
                      >
                        {slide.cta}
                        <FaChevronRight className="transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <div
        onClick={handleScrollDown}
        className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 cursor-pointer animate-bounce flex-col items-center gap-2 text-white/50 transition-colors hover:text-white"
      >
        <span className="text-xs font-bold uppercase tracking-widest">Scroll</span>
        <div className="relative h-8 w-1 overflow-hidden rounded-full bg-white/20">
          <div className="absolute left-0 top-0 h-1/2 w-full animate-pulse bg-primary" />
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
