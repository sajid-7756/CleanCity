import { useContext, useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { Camera, Mail, ShieldCheck, User } from "lucide-react";
import Container from "../Components/Container";
import { AuthContext } from "../Provider/AuthContext";

const Profile = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  const handleUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    authContext?.updateProfileFunc(name, photoURL)
      .then(() => {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      })
      .catch((error: { message?: string }) => {
        toast.error(error.message || "Profile update failed");
      });
  };

  return (
    <div className="min-h-screen bg-base-200/50 py-20">
      <Container>
        <div className="mx-auto max-w-4xl">
          <div className="relative h-48 rounded-t-[3rem] bg-linear-to-r from-primary to-secondary shadow-xl">
            <div className="absolute -bottom-16 left-8 md:left-16">
              <div className="group relative">
                <img
                  src={user?.photoURL || "https://i.ibb.co/CpHdF8h2/icons8-user.gif"}
                  alt={user?.displayName || "User"}
                  className="h-32 w-32 rounded-3xl border-8 border-base-100 object-cover shadow-2xl md:h-40 md:w-40"
                />
                <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-3xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 rounded-b-[3rem] border border-base-300 bg-base-100 p-8 shadow-2xl md:p-16">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-black text-secondary">{user?.displayName}</h1>
                  <span className="badge badge-primary badge-lg gap-2 py-4 font-bold">
                    <ShieldCheck size={16} />
                    Verified Member
                  </span>
                </div>
                <div className="flex flex-wrap gap-6 text-base-content/60">
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-primary" />
                    {user?.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-primary" />
                    Community Member
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className={`btn btn-lg rounded-2xl px-8 shadow-lg transition-all ${
                  isEditing ? "btn-ghost border-base-300" : "btn-primary shadow-primary/20"
                }`}
              >
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>
            </div>

            <div className="divider my-12 opacity-10" />

            {isEditing ? (
              <form
                onSubmit={handleUpdate}
                className="grid grid-cols-1 gap-8 text-secondary md:grid-cols-2"
              >
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Display Name</span>
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
                      size={20}
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="input input-bordered input-lg w-full rounded-2xl border-transparent bg-base-200/50 pl-12 transition-all focus:input-primary focus:bg-base-100"
                      required
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Photo URL</span>
                  </label>
                  <div className="relative">
                    <Camera
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
                      size={20}
                    />
                    <input
                      type="text"
                      value={photoURL}
                      onChange={(event) => setPhotoURL(event.target.value)}
                      className="input input-bordered input-lg w-full rounded-2xl border-transparent bg-base-200/50 pl-12 transition-all focus:input-primary focus:bg-base-100"
                      required
                    />
                  </div>
                </div>
                <div className="pt-4 md:col-span-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-full rounded-2xl px-12 shadow-xl shadow-primary/20 md:w-auto"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-secondary">
                <div className="space-y-6">
                  <h3 className="flex items-center gap-2 border-b border-base-200 pb-3 text-xl font-bold">
                    <User className="text-primary" size={20} />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <span className="font-bold text-base-content/50">Full Name:</span>
                    <span className="font-medium text-base-content">{user?.displayName}</span>

                    <span className="font-bold text-base-content/50">Email:</span>
                    <span className="font-medium text-base-content">{user?.email}</span>

                    <span className="font-bold text-base-content/50">Joined:</span>
                    <span className="font-medium text-base-content">
                      {user?.metadata?.creationTime
                        ? new Date(user.metadata.creationTime).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
