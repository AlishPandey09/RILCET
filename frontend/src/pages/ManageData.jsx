import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const ManageData = () => {
  const [treatmentStages, setTreatmentStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState('');
  const [stageData, setStageData] = useState({ ranges: {} }); // Initialize ranges
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const fetchTreatmentStages = async () => {
      try {
        const response = await axios.get('https://rilcet.onrender.com/treatment-stages');
        setTreatmentStages(response.data);
      } catch (error) {
        console.error("Error fetching treatment stages:", error);
      }
    };
    fetchTreatmentStages();
  }, []);

  const handleSelectChange = async (event) => {
    const treatmentStage = event.target.value;
    setSelectedStage(treatmentStage);

    if (treatmentStage) {
      try {
        const response = await axios.get(`https://rilcet.onrender.com/treatment-stages/${treatmentStage}`);
        // Ensure that response.data has a 'ranges' property
        setStageData({ ...response.data, ranges: response.data.ranges || {} });
      } catch (error) {
        console.error("Error fetching treatment stage:", error);
      }
    } else {
      setStageData({ ranges: {} });
    }
  };

  const handleInputChange = (event, percentage, param) => {
    const { value } = event.target;

    setStageData((prevData) => {
      const currentRange = prevData.ranges[percentage]?.[param] || [];
      return {
        ...prevData,
        ranges: {
          ...prevData.ranges,
          [percentage]: {
            ...prevData.ranges[percentage],
            [param]: [
              value, // Update only the first value
              currentRange[1] || 0, // Ensure the second value exists
            ],
          },
        },
      };
    });
  };

  const handleConfirm = () => {
    setIsConfirming(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://rilcet.onrender.com/treatment-stages/${selectedStage}`, stageData);
      toast.success("Treatment stage updated successfully!");
      setIsConfirming(false);
      setStageData({ ranges: {} });
      setSelectedStage('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error updating treatment stage.";
      toast.error(errorMessage);
      console.error("Update error:", error);
    }
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  return (
    <div className="p-6 rounded-3xl shadow-lg border-2 border-gray-300 text-tertiaryColor">
      <h1 className="text-3xl font-semibold mb-6 ">Manage Treatment Stage Data</h1>

      <select onChange={handleSelectChange} value={selectedStage} className="mb-6 p-3 border border-gray-300 rounded-lg w-full shadow">
        <option value="">Select Treatment Stage</option>
        {treatmentStages.map((stage) => (
          <option key={stage._id} value={stage.name}>{stage.treatmentStage}</option>
        ))}
      </select>

      {selectedStage && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-medium mb-4">Edit Details:</h2>
          {stageData.ranges && Object.keys(stageData.ranges).map((percentage) => (
            <div key={percentage} className="mb-4 p-4 border border-gray-200 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold">{percentage}</h3>
              {['L', 'A', 'B'].map(param => (
                <div key={param} className="mb-2">
                  <label className="block font-medium">
                    {param} Range:
                    <input
                      type="number"
                      value={stageData.ranges[percentage]?.[param]?.[0] || ''} // Use optional chaining
                      onChange={(e) => handleInputChange(e, percentage, param)}
                      className="ml-2 p-2 border border-gray-300 rounded shadow"
                    />
                    <span className="ml-2">to</span>
                    <input
                      type="number"
                      value={stageData.ranges[percentage]?.[param]?.[1] || ''} // Use optional chaining
                      onChange={(e) => handleInputChange(e, percentage, param)}
                      className="ml-2 p-2 border border-gray-300 rounded shadow"
                    />
                  </label>
                </div>
              ))}
            </div>
          ))}
          <button onClick={handleConfirm} className="mt-4 py-3 px-8 font-medium bg-sixthColor text-tertiaryColor rounded-xl shadow">Update</button>
        </div>
      )}

      {isConfirming && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl mb-4 font-medium">Confirm Update</h2>
            <p>Are you sure you want to update the treatment stage?</p>
            <div className="flex justify-between mt-4">
              <button onClick={handleUpdate} className="mr-2 py-2 px-6 bg-green-500 text-white rounded shadow">Yes</button>
              <button onClick={handleCancel} className="py-2 px-6 bg-red-500 text-white rounded shadow">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageData;
