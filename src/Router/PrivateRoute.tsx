import { useContext } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import Loading from "../Components/Loading";
import { AuthContext } from "../Provider/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  if (authContext?.loading) {
    return <Loading />;
  }

  if (authContext?.user) {
    return children;
  }

  return <Navigate state={location.pathname} to="/login" />;
};

export default PrivateRoute;
