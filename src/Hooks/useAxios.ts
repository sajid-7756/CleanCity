import axios, { type AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
  // baseURL: "https://assignment-10-server-xi-navy.vercel.app",
  baseURL: "http://localhost:3000",
});

const useAxios = () => instance;

export default useAxios;
