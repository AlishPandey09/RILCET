import { toast } from "react-toastify";

/**
 * Generic API handler to wrap axios requests
 * @param {Function} apiFn - The actual API function that returns a Promise
 * @param {Object} options - Custom messages and flags
 * @param {string} [options.loading] - Message to show while loading
 * @param {string} [options.success] - Message to show on success
 * @param {string} [options.error] - Fallback error message
 * @param {boolean} [options.useToast=true] - Whether to show toasts
 * @returns {Promise<*>} - API response or null on failure
 */
const apiHandler = async (apiFn, options = {}) => {
  const { loading, success, error, useToast = true } = options;

  const toastId =
    loading && useToast ? toast.loading(loading, { autoClose: false }) : null;

  try {
    const result = await apiFn();

    if (success && useToast) {
      toastId
        ? toast.update(toastId, {
            render: success,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          })
        : toast.success(success);
    }

    return result;
  } catch (err) {
    console.error("API Error:", err);
    const message =
      err?.response?.data?.error || error || "Something went wrong.";
    if (useToast) {
      toastId
        ? toast.update(toastId, {
            render: message,
            type: "error",
            isLoading: false,
            autoClose: 4000,
          })
        : toast.error(message);
    }
    return null;
  }
};

export default apiHandler;
