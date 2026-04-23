import { useContext, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Fade } from "react-awesome-reveal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import { AuthContext } from "../Provider/AuthContext";
import useAxios from "../Hooks/useAxios";

const Register = () => {
  const axiosInstance = useAxios();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
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

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const sigRes = await axiosInstance.get("/cloudinary/signature/public");
    const { cloudName, apiKey, folder, timestamp, signature } = sigRes.data;

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("api_key", apiKey);
    uploadFormData.append("timestamp", String(timestamp));
    uploadFormData.append("signature", signature);
    uploadFormData.append("folder", folder);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: uploadFormData }
    );

    if (!uploadRes.ok) {
      throw new Error("Image upload failed");
    }

    const uploadData = await uploadRes.json();
    return uploadData.secure_url;
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const displayName = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const nameRegex = /^[a-zA-Z\s]{3,30}$/;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!nameRegex.test(displayName)) {
      return toast.error("Name must be 3–30 letters only.");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address.");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must be at least 6 characters, include uppercase, lowercase, number, and special character."
      );
    }

    if (!selectedImageFile) {
      return toast.error("Please upload a profile photo.");
    }

    setIsUploading(true);

    try {
      const photoURL = await uploadToCloudinary(selectedImageFile);

      await authContext?.signUpFunc(email, password);
      toast.success("Sign up success");

      await authContext?.updateProfileFunc(displayName, photoURL);

      const newUser = { name: displayName, email, image: photoURL };
      axiosInstance.post("/users", newUser).catch((error) => console.log(error));

      await authContext?.signOutFunc();
      authContext?.setUser(null);
      navigate("/login");
      authContext?.setLoading(false);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === "auth/email-already-in-use") {
        toast.error("User already exists in the database.");
      } else if (err.code === "auth/weak-password") {
        toast.error("Password must be at least 6 characters long.");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email format. Please check your email.");
      } else if (err.code === "auth/user-not-found") {
        toast.error("User not found. Please sign up first.");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Wrong password. Please try again.");
      } else if (err.code === "auth/user-disabled") {
        toast.error("This user account has been disabled.");
      } else if (err.code === "auth/too-many-requests") {
        toast.error("Too many attempts. Please try again later.");
      } else if (err.code === "auth/operation-not-allowed") {
        toast.error("Operation not allowed. Please contact support.");
      } else if (err.code === "auth/network-request-failed") {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(err.message || "An unexpected error occurred.");
      }
      authContext?.setLoading(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGoogleSignIn = () => {
    authContext?.signInGoogleFunc()
      .then((result) => {
        const newUser = {
          name: result.user.displayName,
          email: result.user.email,
          image: result.user.photoURL,
        };

        axiosInstance
          .post("/users", newUser)
          .then(() => {
            toast.success("Google sign in success");
          })
          .catch((error) => console.log(error));
      })
      .catch((error: { code?: string }) => {
        toast.error(error.code || "Google sign in failed");
      });
  };

  if (authContext?.user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-base-200/50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(110,231,183,0.18),transparent_30%)]" />
      <div className="absolute left-0 top-0 -ml-20 -mt-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />
      <div className="absolute bottom-0 right-0 -mb-20 -mr-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-80 sm:w-80" />

      <div className="relative z-10 mx-auto w-full max-w-xl">
        <Fade triggerOnce>
          <title>CleanCity - Register</title>
          <div className="w-full overflow-hidden rounded-[2rem] border border-base-300/80 bg-base-100/95 shadow-2xl backdrop-blur-sm sm:rounded-3xl">
            <div className="p-5 sm:p-8 md:p-12">
              <div className="mb-8 text-center sm:mb-10">
                <Link to="/" className="mb-4 inline-flex items-center gap-2 text-2xl font-bold sm:text-3xl">
                  <span className="rounded-lg bg-primary px-2 py-1 text-primary-content">Clean</span>
                  <span className="text-secondary">City</span>
                </Link>
                <h2 className="text-2xl font-black text-secondary sm:text-3xl">Create Account</h2>
                <p className="mt-2 text-sm text-base-content/60 sm:text-base">
                  Join our community and start making a difference.
                </p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold">Full Name</span></label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      className="input input-bordered w-full rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:input-primary focus:bg-base-100 sm:input-lg"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label"><span className="label-text font-bold">Email Address</span></label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      className="input input-bordered w-full rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:input-primary focus:bg-base-100 sm:input-lg"
                      required
                    />
                  </div>
                </div>

                {/* Profile Photo Upload */}
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Profile Photo</span></label>
                  <div
                    className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-base-300 bg-base-200/30 p-4 transition-all hover:border-primary hover:bg-primary/5 sm:p-6"
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                  >
                    {previewUrl ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-primary/20">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium text-base-content/70">
                          {selectedImageFile?.name}
                        </p>
                        <p className="text-xs text-primary">Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-base-content/50">
                        <FiUploadCloud className="h-10 w-10 transition-transform group-hover:scale-110 group-hover:text-primary" />
                        <p className="text-sm font-semibold">Click to upload your photo</p>
                        <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
                      </div>
                    )}
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="form-control relative">
                  <label className="label"><span className="label-text font-bold">Password</span></label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full rounded-2xl border-transparent bg-base-200/50 pr-12 font-medium transition-all focus:input-primary focus:bg-base-100 sm:input-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute bottom-3 right-4 cursor-pointer text-gray-500 transition-colors hover:text-primary sm:bottom-4 sm:right-5"
                  >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn btn-primary min-h-13 w-full rounded-2xl font-bold tracking-tight shadow-xl shadow-primary/20 disabled:opacity-60 sm:btn-lg"
                >
                  {isUploading ? (
                    <span className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Uploading & Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <div className="divider my-6 text-[10px] font-bold uppercase tracking-widest text-base-content/40 sm:my-8 sm:text-xs">
                Or register with
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="btn btn-outline group min-h-13 w-full gap-3 rounded-2xl border-base-300 transition-all hover:bg-base-200 hover:text-base-content sm:btn-lg"
              >
                <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z" />
                  <path fill="#FBBC05" d="M16.04 18.013c-1.09.303-2.246.46-3.44.46a7.077 7.077 0 0 1-7.334-4.71l-4.026 3.115C3.198 21.302 7.27 24 12 24c3.055 0 5.782-1.145 7.91-3l-3.87-2.987z" />
                  <path fill="#4285F4" d="M19.91 21c2.13-1.855 3.59-4.59 3.59-9 0-.61-.05-1.21-.155-1.79H12v4.41h6.61a5.64 5.64 0 0 1-2.454 3.71l3.754 2.67z" />
                  <path fill="#34A853" d="M5.266 14.235a7.077 7.077 0 0 1 0-4.47L1.24 6.65a11.96 11.96 0 0 0 0 10.7l4.026-3.115z" />
                </svg>
                Sign up with Google
              </button>

              <p className="mt-8 text-center text-sm text-base-content/60 sm:mt-10 sm:text-base">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default Register;
