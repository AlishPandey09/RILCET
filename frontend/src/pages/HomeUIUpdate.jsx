import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Home/DropDown";
import InputField from "../components/Home/InputField";
import ResultDisplay from "../components/Home/EvaluationResult";
import Button from "../components/Home/Button1";
import { toast } from "react-toastify";
import axios from "axios";

// Importing Images
import SMTooth from '../assets/images/sm-tooth.jpg'
import ToothBG from '../assets/images/tooth-with-bg.jpg'

import ComponentChecks from '../components/ComponentChecks'

const HomeUIUpdate = () => {
  const [lValue, setLValue] = useState(""); // State for L value
  const [aValue, setAValue] = useState(""); // State for a value
  const [bValue, setBValue] = useState(""); // State for b value
  const [result, setResult] = useState(null); // State for evaluation result
  const [selectedStage, setSelectedStage] = useState(""); // State for selected treatment stage
  const [treatmentStageRanges, setTreatmentStageRanges] = useState({}); // Store fetched ranges

  // Fetch treatment stage ranges from the API
  useEffect(() => {
    const fetchTreatmentStageRanges = async () => {
      try {
        const response = await axios.get(
          "https://rilcet.onrender.com/treatment-stages"
        );
        setTreatmentStageRanges(response.data);
      } catch (error) {
        toast.error("Failed to fetch treatment stage ranges.");
      }
    };
    fetchTreatmentStageRanges();
  }, []);

  // Handle the evaluate button click
  const handleEvaluateClick = async () => {
    const lValueNum = parseFloat(lValue);
    const aValueNum = parseFloat(aValue);
    const bValueNum = parseFloat(bValue);
    const currentTime = new Date().toDateString();

    const searchStage = treatmentStageRanges.find(
      (stage) => stage.treatmentStage === selectedStage
    );

    if (!searchStage) {
      toast.warn("Please select a valid treatment stage before evaluating.");
      return;
    }

    if (
      isNaN(lValueNum) ||
      isNaN(aValueNum) ||
      isNaN(bValueNum) ||
      lValueNum < 0 ||
      lValueNum > 100 ||
      aValueNum < -128 ||
      aValueNum > 127 ||
      bValueNum < -128 ||
      bValueNum > 127
    ) {
      toast.warn("Warning: The LAB values are outside the valid range!");
      return;
    } else {
      let tolerance95 = 0;
      let tolerance99 = 0;

      if (
        lValueNum >= searchStage.ranges["95%"].L[0] &&
        lValueNum <= searchStage.ranges["95%"].L[1]
      ) {
        tolerance95++;
      }
      if (
        lValueNum >= searchStage.ranges["99%"].L[0] &&
        lValueNum <= searchStage.ranges["99%"].L[1]
      ) {
        tolerance99++;
      }

      if (
        aValueNum >= searchStage.ranges["95%"].A[0] &&
        aValueNum <= searchStage.ranges["95%"].A[1]
      ) {
        tolerance95++;
      }
      if (
        aValueNum >= searchStage.ranges["99%"].A[0] &&
        aValueNum <= searchStage.ranges["99%"].A[1]
      ) {
        tolerance99++;
      }

      if (
        bValueNum >= searchStage.ranges["95%"].B[0] &&
        bValueNum <= searchStage.ranges["95%"].B[1]
      ) {
        tolerance95++;
      }
      if (
        bValueNum >= searchStage.ranges["99%"].B[0] &&
        bValueNum <= searchStage.ranges["99%"].B[1]
      ) {
        tolerance99++;
      }

      let evaluationResult;
      if (tolerance95 === 3 && tolerance99 === 3) {
        evaluationResult = "normal";
      } else if (tolerance95 >= 2 && tolerance99 < 3) {
        evaluationResult = "normal";
      } else if (tolerance99 >= 2 && tolerance95 < 3) {
        evaluationResult = "borderline";
      } else {
        evaluationResult = "outOfRange";
      }

      setResult(evaluationResult);

      const evaluationData = {
        treatmentStage: selectedStage,
        L: lValueNum,
        A: aValueNum,
        B: bValueNum,
        result: evaluationResult,
        time: currentTime,
      };

      try {
        const response = await axios.post(
          "https://rilcet.onrender.com/evaluation",
          evaluationData
        );
        if (response.status === 201) {
          console.log("Data saved successfully");
        }
      } catch (error) {
        console.log("Error saving data: ", error.response?.data || error.message);
      }
    }
  };

  const navigate = useNavigate();
  const handleAdminLoginClick = () => {
    navigate("/admin-login");
  };

  return (
    <div
      className="relative w-full h-screen flex flex-col lg:flex-row justify-center items-center p-10 sm:px-24 md:px-40 text-tertiaryColor"
      style={{
        background: "linear-gradient(-45deg, #F04E44, #F68A60, #B0499B, #6CCAD3)",
      }}
    >
      {/* Management Button */}
      <div className="absolute text-center bottom-10">
        <button
          onClick={handleAdminLoginClick}
          className="text-[#8a5641] hover:text-tertiaryColor font-medium"
        >
          Management
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-[1200px] lg:flex bg-white shadow-lg overflow-hidden">
        {/* Left Side Form Content */}
        <div className="p-8 xl:p-12 w-full lg:w-2/5 flex flex-col justify-between">
          <h1 className="text-2xl hidden lg:block font-semibold text-ninthColor">
            Lab Color Evaluation Tool For <span>Resin Infiltration</span>
          </h1>

          {/* Treatment Stage */}
          <div className="">
            <h2 className="text-lg font-semibold">Treatment Stage</h2>
            <p className="text-sm text-gray-600">
              Please select the treatment stage from below options
            </p>
            <Dropdown onSelectStage={setSelectedStage} />
          </div>

          {/* Lab Color Values */}
          <div className="mt-6 xl:mt-0">
            <h2 className="text-lg font-semibold">Lab Color Values</h2>
            <p className="text-sm text-gray-600">
              Please enter the respective values in the correct field.
            </p>

            <div className="mt-4">
              <h3 className="text-sm font-medium">L (Lightness) Value</h3>
              <InputField
                value={lValue}
                onChange={setLValue}
                placeholder="Enter the L value..."
              />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium">a (Green to Red) Value</h3>
              <InputField
                value={aValue}
                onChange={setAValue}
                placeholder="Enter the a value..."
              />
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium">b (Blue to Yellow) Value</h3>
              <InputField
                value={bValue}
                onChange={setBValue}
                placeholder="Enter the b value..."
              />
            </div>
          </div>

          {/* Evaluate Button */}
          <div className="flex justify-center mt-8 lg:mt-8 xl:mt-4">
            <Button text="Evaluate" onClick={handleEvaluateClick} />
          </div>

          {/* Result Display */}
          {result && <ResultDisplay result={result} />}
        </div>

        {/* Right Side Image Content for Larger Screens */}
        <div className="hidden lg:flex w-full lg:w-2/3 items-center justify-center bg-gray-100">
          <img
            src={ToothBG}
            alt="Tooth Model"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeUIUpdate;