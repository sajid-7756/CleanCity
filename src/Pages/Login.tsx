import { useContext, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Fade } from "react-awesome-reveal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../Provider/AuthContext";
import useAxios from "../Hooks/useAxios";

const Login = () => {
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const axiosInstance = useAxios();

  const handleSignIn = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    authContext?.signInFunc(email, password)
      .then((res) => {
        authContext?.setUser(res.user);
        toast.success("Sign in success");
        authContext?.setLoading(false);
        form.reset();
        navigate((location.state as string) || "/");
      })
      .catch((error: { code?: string; message?: string }) => {
        toast.error(error.code || error.message || "Sign in failed");
        authContext?.setLoading(false);
        navigate("/login");
      });
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
    return <Navigate to={(location.state as string) || "/"} />;
  }

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-base-200/50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(110,231,183,0.18),transparent_30%)]" />
      <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl sm:h-80 sm:w-80" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl sm:h-80 sm:w-80" />

      <div className="relative z-10 mx-auto w-full max-w-lg">
        <Fade triggerOnce>
          <title>CleanCity - Login</title>
          <div className="w-full overflow-hidden rounded-[2rem] border border-base-300/80 bg-base-100/95 shadow-2xl backdrop-blur-sm sm:rounded-3xl">
            <div className="p-5 sm:p-8 md:p-12">
              <div className="mb-8 text-center sm:mb-10">
                <Link to="/" className="mb-4 inline-flex items-center gap-2 text-2xl font-bold sm:text-3xl">
                  <span className="rounded-lg bg-primary px-2 py-1 text-primary-content">Clean</span>
                  <span className="text-secondary">City</span>
                </Link>
                <h2 className="text-2xl font-black text-secondary sm:text-3xl">Welcome Back!</h2>
                <p className="mt-2 text-sm text-base-content/60 sm:text-base">
                  Sign in to continue making an impact.
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4 sm:space-y-5">
                <div className="form-control">
                  <label className="label"><span className="label-text font-bold">Email Address</span></label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="input input-bordered w-full rounded-2xl border-transparent bg-base-200/50 font-medium transition-all focus:input-primary focus:bg-base-100 sm:input-lg"
                    required
                  />
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

                <button type="submit" className="btn btn-primary min-h-13 w-full rounded-2xl font-bold tracking-tight shadow-xl shadow-primary/20 sm:btn-lg">
                  Sign In
                </button>
              </form>

              <div className="divider my-6 text-[10px] font-bold uppercase tracking-widest text-base-content/40 sm:my-8 sm:text-xs">
                Or continue with
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
                Sign in with Google
              </button>

              <p className="mt-8 text-center text-sm text-base-content/60 sm:mt-10 sm:text-base">
                New to CleanCity?{" "}
                <Link to="/register" className="font-bold text-primary hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default Login;
