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
      <div className="mb-4 text-sm text-neutral-700 space-y-1">
        <p>
          <span className="font-medium text-neutral-900">Selected Group:</span>{" "}
          {selectedGroup}
        </p>
        <p>
          <span className="font-medium text-neutral-900">Treatment Stage:</span>{" "}
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
      <div className="overflow-x-auto shadow-sm">
  <table className="table-auto w-full text-sm text-left text-neutral-800 border border-white">
    <thead className="bg-resin-gradient text-white font-medium">
      <tr>
        <th className="px-4 py-3 border border-white">Parameter</th>
        <th className="px-4 py-3 text-center border border-white">Your Value</th>
        <th className="px-4 py-3 text-center border border-white">Ref. 95% CI</th>
        <th className="px-4 py-3 text-center border border-white">Ref. 99% CI</th>
        <th className="px-4 py-3 text-center border border-white">Status</th>
        <th className="px-4 py-3 border border-white">Interpretation</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(individualParameters).map(([key, data], idx) => (
        <React.Fragment key={key}>
          <tr className="bg-[#f7e6f3] border border-white">
            <td className="px-4 py-3 font-medium border border-white">{key}* (Mean)</td>
            <td className="px-4 py-3 text-center border border-white">{fmt(data.mean.value)}</td>
            <td className="px-4 py-3 text-center border border-white">
              {fmt(data.mean.ref95.lower)} – {fmt(data.mean.ref95.upper)}
            </td>
            <td className="px-4 py-3 text-center border border-white">
              {fmt(data.mean.ref99.lower)} – {fmt(data.mean.ref99.upper)}
            </td>
            <td className="px-4 py-3 text-center border border-white">{data.mean.status}</td>
            <td className="px-4 py-3 border border-white">{data.mean.interpretation}</td>
          </tr>
          <tr className="bg-[#f7e6f3] border border-white">
            <td className="px-4 py-3 font-medium border border-white">{key}* (SD)</td>
            <td className="px-4 py-3 text-center border border-white">{fmt(data.sd.value)}</td>
            <td className="px-4 py-3 text-center border border-white">–</td>
            <td className="px-4 py-3 text-center border border-white">–</td>
            <td className="px-4 py-3 text-center border border-white">{data.sd.status}</td>
            <td className="px-4 py-3 border border-white">{data.sd.interpretation}</td>
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  </table>
</div>

      {/* Reference Cohen's d */}
      {referenceCohensD.value != null && (
        <div className="mt-6 p-4 bg-[#f7e6f3] border border-[#e9b9df] rounded-md">
          <p className="flex items-center text-gray-900 font-medium">
            <FaInfoCircle className="w-5 h-5 mr-2 text-[#B0499B]" />
            Reference effect size (Cohen’s d): {fmt(referenceCohensD.value)}
          </p>
          <p className="mt-1 text-sm text-gray-900">
            {referenceCohensD.interpretation}
          </p>
        </div>
      )}
    </div>
  );
}