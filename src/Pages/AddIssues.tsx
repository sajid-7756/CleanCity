import { useContext } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { Fade } from "react-awesome-reveal";
import Container from "../Components/Container";
import NewIssueForm from "../Components/NewIssueForm";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";

const AddIssue = () => {
  const authContext = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const newIssue = {
      title: String(formData.get("title") ?? ""),
      category: String(formData.get("category") ?? ""),
      location: String(formData.get("location") ?? ""),
      description: String(formData.get("description") ?? ""),
      image: String(formData.get("image") ?? ""),
      amount: Number(formData.get("amount") ?? 0),
      status: String(formData.get("status") ?? "Ongoing"),
      email: authContext?.user?.email,
      date: new Date().toLocaleDateString(),
    };

    axiosSecure.post("/issues", newIssue).then(() => {
      toast.success("Successfully added");
      form.reset();
    });
  };

  return (
    <Fade>
      <Container className="bg-base-100 p-6 md:p-10">
        <title>Add Issues</title>

        <div className="mb-5 text-center">
          <h2 className="text-3xl font-bold">
            Report a New <span className="text-primary">Issue</span>
          </h2>
          <p className="mt-2">
            Help keep your community clean and safe by reporting local problems.
          </p>
        </div>

        <NewIssueForm handleSubmit={handleSubmit} user={authContext?.user ?? null} />
      </Container>
    </Fade>
  );
};

export default AddIssue;
