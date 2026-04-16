import { RingLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center dark:bg-neutral">
      <RingLoader size={100} color="green" />
    </div>
  );
};

export default Loading;
