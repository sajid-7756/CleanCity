import axios, { type AxiosInstance } from "axios";

const instance: AxiosInstance = axios.create({
  baseURL: "https://assignment-10-server-xi-navy.vercel.app",
});

const useAxios = () => instance;

export default useAxios;
