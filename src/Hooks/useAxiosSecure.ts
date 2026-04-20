import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../Provider/AuthContext";

const instance: AxiosInstance = axios.create({
  // baseURL: "https://assignment-10-server-xi-navy.vercel.app",
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await authContext?.user?.getIdToken?.();

        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    const responseInterceptor = instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const status = error.response?.status;

        if ((status === 401 || status === 403) && authContext?.signOutFunc) {
          authContext.signOutFunc().then(() => {
            navigate("/register");
          });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      instance.interceptors.request.eject(requestInterceptor);
      instance.interceptors.response.eject(responseInterceptor);
    };
  }, [authContext, navigate]);

  return instance;
};

export default useAxiosSecure;
