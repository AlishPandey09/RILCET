import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const EvaluationResults = () => {
  const [results, setResults] = useState([]);
  const socket = io("https://rilcet.onrender.com");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          "https://rilcet.onrender.com/evaluation/e-results"
        );

        // Sort results by time in descending order
        const sortedResults = response.data.sort(
          (a, b) => new Date(b.time) - new Date(a.time)
        );

        setResults(sortedResults);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchResults();

    // listen for new evaluation results
    socket.on("newEvaluationResult", (newResult) => {
      setResults((prevResults) => [newResult, ...prevResults]);
    });

    return () => {
      socket.disconnect(); // Cleanup the socket connection on component unmount
    };
  }, [socket]);

  return (
    <div className="flex flex-col py-6 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {results.map((result, index) => (
          <div
            key={index}
            className={`border-2 border-gray-300 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ${
              result.result === "normal"
                ? "bg-green-200 border-green-300"
                : result.result === "borderline"
                ? "bg-orange-200 border-orange-300"
                : "bg-red-200 border-red-300"
            }`}
          >
            <h2 className="text-lg font-medium text-gray-800">
              <span>Treatment Stage : </span>
              {result.treatmentStage}
            </h2>
            <p className="text-gray-600">
              L: <span className="font-bold">{result.L}</span>
            </p>
            <p className="text-gray-600">
              A: <span className="font-bold">{result.A}</span>
            </p>
            <p className="text-gray-600">
              B: <span className="font-bold">{result.B}</span>
            </p>
            <p
              className={`text-gray-600 ${
                result.result === "normal"
                  ? "text-green-500"
                  : result.result === "borderline"
                  ? "text-orange-500"
                  : "text-red-500"
              }`}
            >
              Result:{" "}
              <span className="font-bold uppercase">{result.result}</span>
            </p>
            <p className="text-gray-500 text-sm">
              Time: {new Date(result.time).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationResults;
