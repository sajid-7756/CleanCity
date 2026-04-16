import { Fade } from "react-awesome-reveal";
import BannerSlider from "../Components/BannerSlider";
import CommunityStats from "../Components/CommunityStats";
import FAQ from "../Components/FAQ";
import Features from "../Components/Features";
import HowItWorks from "../Components/HowItWorks";
import IssueCategories from "../Components/IssueCategories";
import Newsletter from "../Components/Newsletter";
import Partners from "../Components/Partners";
import RecentComplaints from "../Components/RecentComplaints";
import Testimonials from "../Components/Testimonials";
import VolunteerCTA from "../Components/VolunteerCTA";

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <title>CleanCity - Home</title>
      <Fade triggerOnce cascade damping={0.1}>
        <BannerSlider />
        <Partners />
        <HowItWorks />
        <IssueCategories />
        <Features />
        <RecentComplaints />
        <CommunityStats />
        <Testimonials />
        <FAQ />
        <VolunteerCTA />
        <Newsletter />
      </Fade>
    </div>
  );
};

export default Home;
