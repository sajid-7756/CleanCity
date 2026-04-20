import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";

const useRole = () => {
  const axiosSecure = useAxiosSecure();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [role, setRole] = useState<string>("user");
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user?.email) {
      setIsRoleLoading(true);
      axiosSecure
        .get(`/users/role/${user.email}`)
        .then((res) => {
          setRole(res.data.role);
          setIsRoleLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user role", err);
          setIsRoleLoading(false);
        });
    } else {
      setIsRoleLoading(false);
    }
  }, [user?.email, axiosSecure]);

  return [role, isRoleLoading] as const;
};

export default useRole;
