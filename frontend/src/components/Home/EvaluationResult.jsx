import React from "react";
import { FaThumbsUp, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";

const EvaluationResult = ({ result }) => {
  const baseStyle = "flex gap-4 items-center px-6 py-3 rounded-lg mt-16 border-2";
  const resultTypes = {
    normal: {
      icon: <FaThumbsUp className="w-6 h-6" />,
      message: "Value within the normal range",
      styles: "text-green-600 border-green-600",
    },
    borderline: {
      icon: <FaExclamationTriangle className="w-6 h-6" />,
      message: "Borderline - Minor Adjustments Suggested",
      styles: "text-orange-600 border-orange-600",
    },
    outOfRange: {
      icon: <FaTimesCircle className="w-6 h-6" />,
      message: "Out of range - Adjust Experimental Setup",
      styles: "text-red-600 border-red-600",
    },
  };

  if (result && resultTypes[result]) {
    const { icon, message, styles } = resultTypes[result];

    return (
      <div className={`${baseStyle} ${styles}`}>
        {icon}
        <span>{message}</span>
      </div>
    );
  }

  return null;
};

export default EvaluationResult;
