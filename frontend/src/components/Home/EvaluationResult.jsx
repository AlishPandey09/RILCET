import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaThumbsUp, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for Toastify

const EvaluationResult = ({ result }) => {
  const resultTypes = {
    normal: {
      icon: <FaThumbsUp className="w-6 h-6 text-green-600" />,
      message: "Value within the normal range",
      styles: "text-green-600",
      bgColor: "bg-green-200",
    },
    borderline: {
      icon: <FaExclamationTriangle className="w-6 h-6 text-orange-600" />,
      message: "Borderline - Minor Adjustments Suggested",
      styles: "text-orange-600",
      bgColor: "bg-orange-200",
    },
    outOfRange: {
      icon: <FaTimesCircle className="w-6 h-6 text-red-600" />,
      message: "Out of range - Adjust Experimental Setup",
      styles: "text-red-600",
      bgColor: "bg-red-200",
    },
  };

  useEffect(() => {
    if (result && resultTypes[result]) {
      const { icon, message, styles, bgColor } = resultTypes[result];

      // Use toast to display the message
      toast.info(
        <div className={`flex gap-2 items-center ${bgColor}`}>
          {/* {icon} Display the icon only */}
          <span className={`${styles}`}>{message}</span> {/* Display the message */}
        </div>,
        {
          position: "bottom-right", // Adjust the position as needed
          autoClose: 5000, // Duration for the toast to stay
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          icon: icon,
          className: `${bgColor}`,
        }
      );
    }
  }, [result]); // Dependency array includes result to show the toast on change

  return <ToastContainer />;
};

export default EvaluationResult;
