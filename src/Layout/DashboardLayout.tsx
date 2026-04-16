import { useContext, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import {
  Bell,
  ChevronRight,
  HandHeart,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  UserCircle,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../Provider/AuthContext";

interface MenuItem {
  icon: ReactNode;
  label: string;
  path: string;
  end?: boolean;
}

const DashboardLayout = () => {
  const authContext = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authContext?.signOutFunc()
      .then(() => {
        toast.success("Logged out successfully");
        authContext?.setUser(null);
        navigate("/");
      })
      .catch((error: Error) => toast.error(error.message));
  };

  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", path: "/dashboard", end: true },
    { icon: <PlusCircle size={20} />, label: "Add Issue", path: "/dashboard/add-issue" },
    { icon: <ListTodo size={20} />, label: "My Issues", path: "/dashboard/my-issues" },
    {
      icon: <HandHeart size={20} />,
      label: "My Contribution",
      path: "/dashboard/my-contribution",
    },
    { icon: <UserCircle size={20} />, label: "Profile", path: "/profile" },
  ];

  const user = authContext?.user;
  const fallbackAvatar = "https://i.ibb.co/CpHdF8h2/icons8-user.gif";

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-base-200/50 md:flex-row">
      <div className="flex items-center justify-between border-b border-base-300 bg-base-100 p-4 md:hidden">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="rounded-lg bg-primary px-2 py-1 text-primary-content">C</span>
          <span className="text-secondary">City</span>
        </Link>
        <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="btn btn-ghost btn-sm">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <aside
        className={`fixed z-50 flex h-screen w-72 flex-col border-r border-base-300 bg-base-100 transition-all duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 p-8 pb-10">
          <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <span className="rounded-lg bg-primary px-2 py-1 text-primary-content">Clean</span>
            <span className="text-secondary">City</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4">
          <p className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30">
            Main Menu
          </p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `
                group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 transition-all
                ${
                  isActive
                    ? "bg-primary font-bold text-primary-content shadow-lg shadow-primary/20"
                    : "text-base-content/70 hover:bg-primary/10 hover:text-primary"
                }
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </div>
              <ChevronRight
                size={14}
                className={`transition-opacity group-hover:opacity-100 ${
                  item.end ? "hidden" : "opacity-0"
                }`}
              />
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4">
          <div className="group relative overflow-hidden rounded-[2rem] bg-secondary p-6 text-secondary-content shadow-xl">
            <div className="absolute right-0 top-0 -mr-4 -mt-4 h-20 w-20 rounded-full bg-white/10 blur-xl transition-transform group-hover:scale-150" />
            <div className="relative z-10 flex flex-col items-center text-center">
              <img
                src={user?.photoURL || fallbackAvatar}
                alt={user?.displayName || "User"}
                className="mb-4 h-16 w-16 rounded-2xl border-4 border-white/20 object-cover"
              />
              <h4 className="w-full truncate font-bold">{user?.displayName || "Member"}</h4>
              <p className="mb-4 w-full truncate text-[10px] opacity-70">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-block rounded-xl border-white/20 bg-white/10 text-white transition-all hover:border-error hover:bg-error"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="relative h-screen flex-1 overflow-y-auto">
        <header className="sticky top-0 z-40 hidden items-center justify-between border-b border-base-200 bg-base-100/80 p-6 px-10 backdrop-blur-md md:flex">
          <div className="group relative w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/30 transition-colors group-focus-within:text-primary"
              size={20}
            />
            <input
              type="text"
              placeholder="Search for issues, status, or contributors..."
              className="input w-full rounded-2xl border-transparent bg-base-200/50 pl-12 font-medium transition-all focus:border-primary/30 focus:bg-base-100"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="btn btn-ghost btn-circle relative">
              <Bell size={24} className="text-secondary" />
              <span className="absolute right-2 top-2 h-3 w-3 rounded-full border-2 border-base-100 bg-error" />
            </button>
            <div className="h-10 w-[1px] bg-base-300" />
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-black text-secondary">{user?.displayName}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">
                  Standard User
                </p>
              </div>
              <img
                src={user?.photoURL || fallbackAvatar}
                className="h-12 w-12 rounded-2xl object-cover shadow-lg ring-2 ring-primary ring-offset-2"
                alt={user?.displayName || "User"}
              />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
