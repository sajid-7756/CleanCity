import { useContext, useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import Loading from "../Components/Loading";
import Table from "../Components/Table";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";
import type { Contribution } from "../types/entities";

const MyContribution = () => {
  const axiosSecure = useAxiosSecure();
  const authContext = useContext(AuthContext);
  const [myContribution, setMyContribution] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authContext?.user?.email) {
      setLoading(false);
      return;
    }

    axiosSecure.get<Contribution[]>(`/contributions/?email=${authContext.user.email}`).then((data) => {
      setMyContribution(data.data);
      setLoading(false);
    });
  }, [authContext?.user?.email, axiosSecure]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Fade triggerOnce>
      <div className="animate-fade-in space-y-8">
        <title>My Contributions</title>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-secondary">
              My Contributions{" "}
              <span className="ml-2 text-primary/40">({myContribution.length})</span>
            </h1>
            <p className="mt-2 font-medium text-base-content/60">
              Review your historical impact and community support data.
            </p>
          </div>
        </div>

        <div className="min-h-[400px] rounded-[3rem] border border-base-200 bg-base-100 p-8 shadow-sm">
          <Table myContribution={myContribution} />
        </div>
      </div>
    </Fade>
  );
};

export default MyContribution;
