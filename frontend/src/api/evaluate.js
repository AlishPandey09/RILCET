import axios from "../lib/axiosInstance";
import apiHandler from "../utils/apiHandler";

export const evaluateLabValues = (payload) =>
  apiHandler(() => axios.post("/evaluate/", payload).then((res) => res.data), {
    loading: "Evaluating...",
    success: "Evaluation successful",
    error: "Evaluation failed",
  });
