import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Fade } from "react-awesome-reveal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../Provider/AuthContext";
import useAxios from "../Hooks/useAxios";

const Register = () => {
  const axiosInstance = useAxios();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const displayName = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const photoURL = String(formData.get("photoURL") ?? "");

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

    authContext?.signUpFunc(email, password)
      .then(() => {
        toast.success("Sign up success");
        authContext?.updateProfileFunc(displayName, photoURL)
          .then(() => {
            const newUser = { name: displayName, email, image: photoURL };

            axiosInstance.post("/users", newUser).catch((error) => console.log(error));

            authContext?.signOutFunc()
              .then(() => {
                authContext?.setUser(null);
                navigate("/login");
                authContext?.setLoading(false);
              })
              .catch((error: { message?: string }) => {
                toast.error(error.message || "Sign out failed");
              });
          })
          .catch((error: { message?: string }) => {
            toast.error(error.message || "Profile update failed");
          });
      })
      .catch((error: { code?: string; message?: string }) => {
        if (error.code === "auth/email-already-in-use") {
          toast.error("User already exists in the database.");
        } else if (error.code === "auth/weak-password") {
          toast.error("Password must be at least 6 characters long.");
        } else if (error.code === "auth/invalid-email") {
          toast.error("Invalid email format. Please check your email.");
        } else if (error.code === "auth/user-not-found") {
          toast.error("User not found. Please sign up first.");
        } else if (error.code === "auth/wrong-password") {
          toast.error("Wrong password. Please try again.");
        } else if (error.code === "auth/user-disabled") {
          toast.error("This user account has been disabled.");
        } else if (error.code === "auth/too-many-requests") {
          toast.error("Too many attempts. Please try again later.");
        } else if (error.code === "auth/operation-not-allowed") {
          toast.error("Operation not allowed. Please contact support.");
        } else if (error.code === "auth/network-request-failed") {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(error.message || "An unexpected error occurred.");
        }
        authContext?.setLoading(false);
      });

    form.reset();
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
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-base-200/50 px-4 py-12">
      <div className="absolute left-0 top-0 -ml-20 -mt-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 -mb-20 -mr-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

      <Fade triggerOnce>
        <title>CleanCity - Register</title>
        <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-2xl">
          <div className="p-8 md:p-12">
            <div className="mb-10 text-center">
              <Link to="/" className="mb-4 inline-flex items-center gap-2 text-3xl font-bold">
                <span className="rounded-lg bg-primary px-2 py-1 text-primary-content">Clean</span>
                <span className="text-secondary">City</span>
              </Link>
              <h2 className="text-3xl font-black text-secondary">Create Account</h2>
              <p className="mt-2 text-base-content/60">
                Join our community and start making a difference.
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Full Name</span></label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="input input-bordered input-lg rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:input-primary focus:bg-base-100"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Email Address</span></label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    className="input input-bordered input-lg rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:input-primary focus:bg-base-100"
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text font-bold">Photo URL</span></label>
                <input
                  type="text"
                  name="photoURL"
                  placeholder="https://example.com/photo.jpg"
                  className="input input-bordered input-lg rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:input-primary focus:bg-base-100"
                  required
                />
              </div>

              <div className="form-control relative">
                <label className="label"><span className="label-text font-bold">Password</span></label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered input-lg rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:input-primary focus:bg-base-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute bottom-4 right-5 cursor-pointer text-gray-500 transition-colors hover:text-primary"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full rounded-2xl font-bold tracking-tight shadow-xl shadow-primary/20">
                Create Account
              </button>
            </form>

            <div className="divider my-8 text-xs font-bold uppercase tracking-widest text-base-content/40">
              Or register with
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="btn btn-outline btn-lg group w-full gap-3 rounded-2xl border-base-300 transition-all hover:bg-base-200 hover:text-base-content"
            >
              <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z" />
                <path fill="#FBBC05" d="M16.04 18.013c-1.09.303-2.246.46-3.44.46a7.077 7.077 0 0 1-7.334-4.71l-4.026 3.115C3.198 21.302 7.27 24 12 24c3.055 0 5.782-1.145 7.91-3l-3.87-2.987z" />
                <path fill="#4285F4" d="M19.91 21c2.13-1.855 3.59-4.59 3.59-9 0-.61-.05-1.21-.155-1.79H12v4.41h6.61a5.64 5.64 0 0 1-2.454 3.71l3.754 2.67z" />
                <path fill="#34A853" d="M5.266 14.235a7.077 7.077 0 0 1 0-4.47L1.24 6.65a11.96 11.96 0 0 0 0 10.7l4.026-3.115z" />
              </svg>
              Sign up with Google
            </button>

            <p className="mt-10 text-center text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default Register;
