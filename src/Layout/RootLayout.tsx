import { Outlet } from "react-router";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import ScrollToTop from "../Components/ScrollToTop";

const RootLayout = () => {
  return (
    <div>
      <Navbar />

      <main className="min-h-[calc(100vh-285px)]">
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
