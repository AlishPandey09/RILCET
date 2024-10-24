import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Dropdown = ({ onSelectStage }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [treatmentStages, setTreatmentStages] = useState([]);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  // Handle option selection
  const handleSelectChange = (option) => {
    setSelectedOption(option);
    onSelectStage(option); // Notify parent of the selected option
    setIsOpen(false); // Close the dropdown
  };

  // Toggle dropdown open/close
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch treatment stages from API
  useEffect(() => {
    const fetchTreatmentStages = async () => {
      try {
        const response = await axios.get('https://rilcet.onrender.com/treatment-stages');
        setTreatmentStages(response.data);
      } catch (error) {
        setError('Error fetching treatment stages.');
      }
    };

    fetchTreatmentStages();
  }, []);

  return (
    <div className="relative mt-4 mx-auto text-tertiaryColor" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full px-6 py-4 text-left bg-secondaryColor rounded-lg border border-gray-300 shadow-md"
      >
        <span>{selectedOption || "Select an Option"}</span>
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="absolute z-10 w-full bg-white rounded-b-xl shadow-lg overflow-auto border border-gray-300"
        >
          <li onClick={() => handleSelectChange('')} className="px-6 py-4 hover:bg-sixthColor cursor-pointer">
            Select an option
          </li>
          {error && (
            <li className="px-6 py-4 text-red-600">
              {error}
            </li>
          )}
          {treatmentStages.map((stage) => (
            <li
              key={stage._id} // Unique key for each stage
              onClick={() => handleSelectChange(stage.treatmentStage)} // Close dropdown on selection
              className="px-6 py-4 hover:bg-sixthColor cursor-pointer"
            >
              {stage.treatmentStage}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default Dropdown;
