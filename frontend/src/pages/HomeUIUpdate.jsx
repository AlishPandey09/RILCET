import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Home/DropDown";
import InputField from "../components/Home/InputField";
import ResultDisplay from "../components/Home/EvaluationResult";
import Button from "../components/Home/Button1";
import { toast } from "react-toastify";
import axios from "axios";
import ComponentChecks from "../components/ComponentChecks.jsx";

// Importing Images
import SMTooth from "../assets/images/sm-tooth.jpg";
import ToothBG from "../assets/images/tooth-with-bg.jpg";

const HomeUIUpdate = () => {
  const [lValue, setLValue] = useState("");
  const [aValue, setAValue] = useState("");
  const [bValue, setBValue] = useState("");
  const [result, setResult] = useState(null);
  const [selectedStage, setSelectedStage] = useState("");
  const [treatmentStageRanges, setTreatmentStageRanges] = useState({});

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

  const handleEvaluateClick = async () => {
    const lValueNum = parseFloat(lValue);
    const aValueNum = parseFloat(aValue);
    const bValueNum = parseFloat(bValue);
    const currentTime = new Date();

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
    }

    // Reset result here before evaluating
    setResult(null); // Ensure to reset the result state

    let tolerance95 = 0;
    let tolerance99 = 0;

    // Evaluation Logic
    if (
      lValueNum >= searchStage.ranges["95%"].L[0] &&
      lValueNum <= searchStage.ranges["95%"].L[1]
    )
      tolerance95++;

    if (
      lValueNum >= searchStage.ranges["99%"].L[0] &&
      lValueNum <= searchStage.ranges["99%"].L[1]
    )
      tolerance99++;

    if (
      aValueNum >= searchStage.ranges["95%"].A[0] &&
      aValueNum <= searchStage.ranges["95%"].A[1]
    )
      tolerance95++;

    if (
      aValueNum >= searchStage.ranges["99%"].A[0] &&
      aValueNum <= searchStage.ranges["99%"].A[1]
    )
      tolerance99++;

    if (
      bValueNum >= searchStage.ranges["95%"].B[0] &&
      bValueNum <= searchStage.ranges["95%"].B[1]
    )
      tolerance95++;

    if (
      bValueNum >= searchStage.ranges["99%"].B[0] &&
      bValueNum <= searchStage.ranges["99%"].B[1]
    )
      tolerance99++;

    // Determine evaluation result
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

    // Set the result after evaluating
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
  };

  const navigate = useNavigate();
  const handleAdminLoginClick = () => {
    window.open("/admin-login", "_blank");
  };

  return (
    <div
      className="relative w-full h-screen flex flex-col lg:flex-row justify-center items-center px-8 sm:px-24 md:px-48 lg:px-24 text-tertiaryColor"
      style={{
        background:
          "linear-gradient(-45deg, #F04E44, #F68A60, #B0499B, #6CCAD3)",
      }}
    >
      {/* <ComponentChecks /> */}
      {/* Right Side Image Content for Smaller Screens */}
      <div className="w-full lg:w-2/3 flex lg:hidden items-center justify-center bg-gray-100">
        <img
          src={SMTooth}
          alt="Tooth Model"
          className="object-cover h-24 w-full lg:h-full"
        />
      </div>

      <div className="w-full lg:w-[1200px] lg:flex bg-white shadow-lg max-w-[1024px]">
        <div className="p-4 md:p-6 xl:p-10 w-full lg:w-2/5 flex flex-col justify-between">
          <h1 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-ninthColor hidden lg:block">
            Lab Color Evaluation Tool For <span>Resin Infiltration</span>
          </h1>

          <div className="lg:mt-4">
            <h2 className="text-sm md:text-base font-semibold">
              Treatment Stage
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Please select the treatment stage from below options
            </p>
            <Dropdown onSelectStage={setSelectedStage} />
          </div>

          <div className="mt-4 md:mt-6">
            <h2 className="text-sm md:text-base font-semibold">
              Lab Color Values
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Please enter the respective values in the correct field.
            </p>

            <div className="mt-2 md:mt-4">
              <h3 className="text-sm font-medium">L (Lightness) Value</h3>
              <InputField
                value={lValue}
                onChange={setLValue}
                placeholder="Enter the L value..."
              />
            </div>
            <div className="mt-2 md:mt-4">
              <h3 className="text-sm font-medium">a (Green to Red) Value</h3>
              <InputField
                value={aValue}
                onChange={setAValue}
                placeholder="Enter the a value..."
              />
            </div>
            <div className="mt-2 md:mt-4">
              <h3 className="text-sm font-medium">b (Blue to Yellow) Value</h3>
              <InputField
                value={bValue}
                onChange={setBValue}
                placeholder="Enter the b value..."
              />
            </div>
          </div>

          <div className="flex justify-center mt-4 md:mt-6 lg:mt-6 xl:mt-4">
            <Button text="Evaluate" onClick={handleEvaluateClick} />
          </div>

          {result && <ResultDisplay result={result} />}
        </div>

        {/* ToothBG Image with Management Button */}
        <div className="hidden lg:flex w-full lg:w-2/3 items-center justify-center bg-gray-100 relative">
          <img
            src={ToothBG}
            alt="Tooth Model"
            className="object-cover h-full w-full"
          />
          <button
            onClick={handleAdminLoginClick}
            className="absolute right-8 top-6 text-xs sm:text-sm md:text-base lg:text-lg text-[#8a5641] hover:text-tertiaryColor font-medium"
          >
            Management
          </button>
        </div>
      </div>

      {/* Management Button for Smaller Screens */}
      <div className="lg:hidden absolute text-center bottom-6 md:bottom-2 lg:bottom-6">
        <button
          onClick={handleAdminLoginClick}
          className="text-sm md:text-sm lg:text-lg xl:text-xl text-[#8a5641] hover:text-tertiaryColor font-medium"
        >
          Management
        </button>
      </div>
    </div>
  );
};

export default HomeUIUpdate;
