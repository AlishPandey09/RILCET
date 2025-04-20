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
    <div className="mt-6 p-6 bg-white rounded-lg shadow">
      {/* Context Summary */}
      <div className="mb-4">
        <p className="text-sm text-gray-700">Selected Group: {selectedGroup}</p>
        <p className="text-sm text-gray-700">
          Treatment Stage: {treatmentStage}
        </p>
      </div>

      {/* Overall Assessment */}
      <div className="flex items-center mb-6">
        <p className="text-md text-gray-800">{overallAssessment.message}</p>
      </div>

      {/* Detailed Results Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Parameter</th>
              <th className="border px-4 py-2">Your Value</th>
              <th className="border px-4 py-2">Ref. 95% CI</th>
              <th className="border px-4 py-2">Ref. 99% CI</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2 text-left">Interpretation</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(individualParameters).map(([key, data]) => (
              <React.Fragment key={key}>
                <tr>
                  <td className="border px-4 py-2">{key}* (Mean)</td>
                  <td className="border px-4 py-2 text-center">
                    {fmt(data.mean.value)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {fmt(data.mean.ref95.lower)}–{fmt(data.mean.ref95.upper)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {fmt(data.mean.ref99.lower)}–{fmt(data.mean.ref99.upper)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {data.mean.status}
                  </td>
                  <td className="border px-4 py-2">
                    {data.mean.interpretation}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border px-4 py-2">{key}* (SD)</td>
                  <td className="border px-4 py-2 text-center">
                    {fmt(data.sd.value)}
                  </td>
                  <td className="border px-4 py-2 text-center">–</td>
                  <td className="border px-4 py-2 text-center">–</td>
                  <td className="border px-4 py-2 text-center">
                    {data.sd.status}
                  </td>
                  <td className="border px-4 py-2">{data.sd.interpretation}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reference Cohen's d */}
      {referenceCohensD.value != null && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="flex items-center text-gray-800">
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
