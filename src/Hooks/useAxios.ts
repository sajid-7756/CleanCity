import axios, { type AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
  // baseURL: "https://clean-city-server-omega.vercel.app",
  baseURL: "http://localhost:3000",
});

const useAxios = () => instance;

export default useAxios;
