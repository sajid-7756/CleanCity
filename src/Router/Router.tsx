import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Issues from "../Pages/Issues";
import AddIssues from "../Pages/AddIssues";
import MyIssues from "../Pages/MyIssues";
import MyContribution from "../Pages/MyContribution";
import Register from "../Pages/Register";
import PrivateRoute from "./PrivateRoute";
import IssueDetails from "../Pages/IssueDetails";
import Error from "../Pages/Error";
import About from "../Pages/About";
import Contact from "../Pages/Contact";
import Profile from "../Pages/Profile";
import DashboardLayout from "../Layout/DashboardLayout";
import DashboardHome from "../Pages/DashboardHome";
import AdminContributions from "../Pages/AdminContributions";
import Wallet from "../Pages/Wallet";

interface IssueLoaderParams {
  params: {
    id?: string;
  };
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/about",
        Component: About,
      },
      {
        path: "/contact",
        Component: Contact,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },
          {
            path: "add-issue",
            element: <AddIssues />,
          },
          {
            path: "my-issues",
            element: <MyIssues />,
          },
          {
            path: "my-contribution",
            element: <MyContribution />,
          },
          {
            path: "admin-contributions",
            element: <AdminContributions />,
          },
          {
            path: "wallet",
            element: <Wallet />,
          },
        ],
      },
      {
        path: "/issues",
        Component: Issues,
      },
      {
        path: "/issue-details/:id",
        loader: ({ params }: IssueLoaderParams) =>
          fetch(`https://assignment-10-server-xi-navy.vercel.app/issues/${params.id}`),
        element: (
          <PrivateRoute>
            <IssueDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "*",
        Component: Error,
      },
    ],
  },
]);

export default router;
