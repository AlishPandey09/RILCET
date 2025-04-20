import axios from "axios";

// Base URL can be set via .env file or hardcoded for local dev
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
