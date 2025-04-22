// components/Home/EvaluationResult.jsx

import React from "react";
import { FaInfoCircle } from "react-icons/fa";

export default function EvaluationResult({ result }) {
  if (!result) return null;

  const {
    selectedGroup,
    treatmentStage,
    overallAssessment,
    individualParameters,
    referenceCohensD,
  } = result;

  const fmt = (num) => (num != null ? num.toFixed(1) : "–");

  return (
    <div className="p-6 bg-white h-full flex flex-col">
      {/* Context Summary */}
      <div className="mb-4 text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-medium text-gray-800">Selected Group:</span>{" "}
          {selectedGroup}
        </p>
        <p>
          <span className="font-medium text-gray-800">Treatment Stage:</span>{" "}
          {treatmentStage}
        </p>
      </div>

      {/* Overall Assessment */}
      <div className="mb-6">
        <p className="text-md font-semibold text-gray-900">
          {overallAssessment.message}
        </p>
      </div>

      {/* Detailed Results Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="table-auto w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-900">
            <tr>
              <th className=" px-4 py-3 border">Parameter</th>
              <th className=" px-4 py-3 border text-center">Your Value</th>
              <th className=" px-4 py-3 border text-center">Ref. 95% CI</th>
              <th className=" px-4 py-3 border text-center">Ref. 99% CI</th>
              <th className=" px-4 py-3 border text-center">Status</th>
              <th className=" px-4 py-3 border">Interpretation</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(individualParameters).map(([key, data], idx) => (
              <React.Fragment key={key}>
                <tr className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 border font-medium">
                    {key}* (Mean)
                  </td>
                  <td className="px-4 py-3 border text-center">
                    {fmt(data.mean.value)}
                  </td>
                  <td className="px-4 py-3 border text-center">
                    {fmt(data.mean.ref95.lower)} – {fmt(data.mean.ref95.upper)}
                  </td>
                  <td className="px-4 py-3 border text-center">
                    {fmt(data.mean.ref99.lower)} – {fmt(data.mean.ref99.upper)}
                  </td>
                  <td className="px-4 py-3 border text-center">
                    {data.mean.status}
                  </td>
                  <td className="px-4 py-3 border">
                    {data.mean.interpretation}
                  </td>
                </tr>
                <tr className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3 border font-medium">{key}* (SD)</td>
                  <td className="px-4 py-3 border text-center">
                    {fmt(data.sd.value)}
                  </td>
                  <td className="px-4 py-3 border text-center">–</td>
                  <td className="px-4 py-3 border text-center">–</td>
                  <td className="px-4 py-3 border text-center">
                    {data.sd.status}
                  </td>
                  <td className="px-4 py-3 border">{data.sd.interpretation}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reference Cohen's d */}
      {referenceCohensD.value != null && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="flex items-center text-gray-800 font-medium">
            <FaInfoCircle className="w-5 h-5 mr-2 text-gray-600" />
            Reference effect size (Cohen’s d): {fmt(referenceCohensD.value)}
          </p>
          <p className="mt-1 text-sm text-gray-700">
            {referenceCohensD.interpretation}
          </p>
        </div>
      )}
    </div>
  );
}
