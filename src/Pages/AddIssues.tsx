import { useContext, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import { Fade } from "react-awesome-reveal";
import Container from "../Components/Container";
import NewIssueForm from "../Components/NewIssueForm";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { AuthContext } from "../Provider/AuthContext";

import { Navigate } from "react-router";
import useRole from "../Hooks/useRole";

const AddIssue = () => {
  const authContext = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [role, isRoleLoading] = useRole();
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedImageFile(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      return;
    }

    setPreviewUrl(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedImageFile) {
      toast.error("Please choose an image file before submitting.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsUploading(true);

    axiosSecure
      .get("/cloudinary/signature")
      .then((signatureResponse) => {
        const { cloudName, apiKey, folder, timestamp, signature } = signatureResponse.data;
        const uploadFormData = new FormData();

        uploadFormData.append("file", selectedImageFile);
        uploadFormData.append("api_key", apiKey);
        uploadFormData.append("timestamp", String(timestamp));
        uploadFormData.append("signature", signature);
        uploadFormData.append("folder", folder);

        return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: uploadFormData,
        });
      })
      .then(async (uploadResponse) => {
        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }

        const uploadData = await uploadResponse.json();

        const garbageLevel = String(formData.get("garbageLevel") ?? "Low") as "Low" | "Medium" | "High";
        const levelAmountMap: Record<"Low" | "Medium" | "High", number> = { Low: 50, Medium: 100, High: 200 };
        const amount = levelAmountMap[garbageLevel];

        const newIssue = {
          title: String(formData.get("title") ?? ""),
          category: String(formData.get("category") ?? ""),
          location: String(formData.get("location") ?? ""),
          description: String(formData.get("description") ?? ""),
          image: String(uploadData.secure_url ?? ""),
          garbageLevel,
          amount,
          status: "ongoing",
          email: authContext?.user?.email,
          date: new Date().toLocaleDateString(),
        };

        return axiosSecure.post("/issues", newIssue);
      })
      .then(() => {
        toast.success("Issue added successfully");
        form.reset();
        setSelectedImageFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Could not upload the image. Please try again.");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  if (isRoleLoading) {
    return null;
  }

  if (role === "admin") {
    return <Navigate to="/dashboard" />;
  }

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

        <NewIssueForm
          handleSubmit={handleSubmit}
          user={authContext?.user ?? null}
          isUploading={isUploading}
          selectedFileName={selectedImageFile?.name || ""}
          previewUrl={previewUrl}
          onImageChange={handleImageChange}
        />
      </Container>
    </Fade>
  );
};

export default AddIssue;
