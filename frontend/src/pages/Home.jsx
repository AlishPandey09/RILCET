import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "../components/Home/DropDown.jsx";
import InputField from "../components/Home/InputField.jsx";
import ResultDisplay from "../components/Home/EvaluationResult.jsx";
import Button from "../components/Home/Button1.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { IoIosSettings } from "react-icons/io";

// Importing Images
import SMTooth from "../assets/images/sm-tooth.jpg";
import ToothBG from "../assets/images/tooth-with-bg.jpg";
import { treatmentGroups, treatmentStages } from "../constants/constant.js";
import { evaluateLabValues } from "../api/evaluate.js";

const Home = () => {
  const [lValue, setLValue] = useState("");
  const [aValue, setAValue] = useState("");
  const [bValue, setBValue] = useState("");
  const [lSD, setLSD] = useState("");
  const [aSD, setASD] = useState("");
  const [bSD, setBSD] = useState("");
  const [result, setResult] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedStage, setSelectedStage] = useState("");

  // useEffect(() => {
  //   const fetchTreatmentStageRanges = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://rilcet.onrender.com/treatment-stages"
  //       );
  //       setTreatmentStageRanges(response.data);
  //     } catch (error) {
  //       toast.error("Failed to fetch treatment stage ranges.");
  //     }
  //   };
  //   fetchTreatmentStageRanges();
  // }, []);

  const handleEvaluateClick = async () => {
    const lValueNum = parseFloat(lValue);
    const aValueNum = parseFloat(aValue);
    const bValueNum = parseFloat(bValue);
    const lSDNum = parseFloat(lSD);
    const aSDNum = parseFloat(aSD);
    const bSDNum = parseFloat(bSD);

    // Validate dropdowns
    if (!selectedGroup) {
      toast.warn("Please select a treatment group.");
      return;
    }

    if (!selectedStage) {
      toast.warn("Please select a treatment stage.");
      return;
    }

    // Validate LAB mean values
    if (
      isNaN(lValueNum) ||
      lValueNum < 0 ||
      lValueNum > 100 ||
      isNaN(aValueNum) ||
      aValueNum < -128 ||
      aValueNum > 127 ||
      isNaN(bValueNum) ||
      bValueNum < -128 ||
      bValueNum > 127
    ) {
      toast.warn("L* must be 0–100; a*, b* must be -128 to 127.");
      return;
    }

    // Validate SDs (if provided)
    if (
      (lSD && (isNaN(lSDNum) || lSDNum < 0)) ||
      (aSD && (isNaN(aSDNum) || aSDNum < 0)) ||
      (bSD && (isNaN(bSDNum) || bSDNum < 0))
    ) {
      toast.error("Standard deviation values must be positive numbers.");
      return;
    }

    // Reset any previous result
    setResult(null);

    // Prepare evaluation payload
    const payload = {
      treatmentGroup: selectedGroup,
      treatmentStage: selectedStage,
      userValues: {
        L: { mean: lValueNum, sd: lSD ? lSDNum : null },
        a: { mean: aValueNum, sd: aSD ? aSDNum : null },
        b: { mean: bValueNum, sd: bSD ? bSDNum : null },
      },
    };

    const data = await evaluateLabValues(payload);
    if (data) setResult(data);
  };

  const handleGroupChange = (group) => {
    setSelectedGroup(group.label);
  };

  const handleStageChange = (group) => {
    setSelectedStage(group.label);
  };

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
      <div className="w-full lg:w-2/3 flex lg:hidden items-center justify-center bg-gray-100 relative">
        <img
          src={SMTooth}
          alt="Tooth Model"
          className="object-cover h-24 w-full"
        />
        <button
          onClick={handleAdminLoginClick}
          className="absolute right-4 top-2 text-xs sm:text-sm text-[#8a5641] hover:text-tertiaryColor"
        >
          <IoIosSettings className="h-6 w-6" />
        </button>
      </div>

      <div className="w-full lg:w-[1200px] lg:flex bg-white shadow-lg max-w-[1024px] ">
        <div className="p-4 md:p-6 xl:p-10 flex flex-col justify-between w-full lg:w-[60%] h-[550px] lg:h-[750px] md:h-[600px] sm:h-[550px] overflow-y-scroll">
          <h1 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-ninthColor hidden lg:block">
            Lab Color Evaluation Tool For <span>Resin Infiltration</span>
          </h1>

          <div className="mt-4">
            <h2 className="text-sm md:text-base font-semibold">
              Treatment Group
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Select Treatment Group for which you wish to evaluate L, a*, b*
              values.*
            </p>
            <Dropdown
              onSelect={handleGroupChange}
              placeholder="Select Treatment Group"
              fallbackOptions={treatmentGroups}
              optionKey="label"
              // fetchUrl="https://your-api.com/treatment-groups" // optional
            />
          </div>

          <div className="mt-4">
            <h2 className="text-sm md:text-base font-semibold">
              Treatment Stage
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Select the specific treatment phase of resin infiltration for
              which you wish to evaluate L, a*, b* values.*
            </p>
            <Dropdown
              onSelect={handleStageChange}
              placeholder="Select Treatment Stage"
              fallbackOptions={treatmentStages.map((stage) => ({
                label: `${stage.code} - ${stage.label}`,
                code: stage.code,
              }))}
              optionKey="label"
            />
          </div>

          <div className="mt-4 md:mt-6">
            <h2 className="text-sm md:text-base font-semibold">
              LAB Color Values (Mean ± SD)
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              Input mean ± standard deviation for L, a*, and b* to assess
              alignment with reference ranges and determine effect sizes using
              Cohen’s d.*
            </p>

            {/* L Row */}
            <div className="mt-4 flex gap-2">
              <div className="w-[65%]">
                <h3 className="text-sm font-medium">L (Lightness) – Mean</h3>
                <InputField
                  value={lValue}
                  onChange={setLValue}
                  placeholder="Enter L* value"
                />
              </div>
              <div className="w-[35%]">
                <h3 className="text-sm font-medium">L – SD</h3>
                <InputField
                  value={lSD}
                  onChange={setLSD}
                  placeholder="Enter SD-L"
                />
              </div>
            </div>

            {/* a Row */}
            <div className="mt-4 flex gap-2">
              <div className="w-[65%]">
                <h3 className="text-sm font-medium">a (Green to Red) – Mean</h3>
                <InputField
                  value={aValue}
                  onChange={setAValue}
                  placeholder="Enter a* value"
                />
              </div>
              <div className="w-[35%]">
                <h3 className="text-sm font-medium">a – SD</h3>
                <InputField
                  value={aSD}
                  onChange={setASD}
                  placeholder="Enter SD-a"
                />
              </div>
            </div>

            {/* b Row */}
            <div className="mt-4 flex gap-2">
              <div className="w-[65%]">
                <h3 className="text-sm font-medium">
                  b (Blue to Yellow) – Mean
                </h3>
                <InputField
                  value={bValue}
                  onChange={setBValue}
                  placeholder="Enter b* value"
                />
              </div>
              <div className="w-[35%]">
                <h3 className="text-sm font-medium">b – SD</h3>
                <InputField
                  value={bSD}
                  onChange={setBSD}
                  placeholder="Enter SD-b"
                />
              </div>
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
            <IoIosSettings className="h-10 w-10" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
