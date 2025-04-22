import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const Dropdown = ({
  onSelect,
  placeholder,
  fetchUrl,
  optionKey = "label",
  fallbackOptions = [],
  selectedValue = "",
}) => {
  const [selectedOption, setSelectedOption] = useState(selectedValue);
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedOption(selectedValue);
  }, [selectedValue]);

  // Handle dropdown selection
  const handleSelectChange = (option) => {
    setSelectedOption(option[optionKey]);
    onSelect(option);
    setIsOpen(false);
  };

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data or use fallback
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        if (fetchUrl) {
          const response = await axios.get(fetchUrl);
          if (response.data && response.data.length > 0) {
            setOptions(response.data);
          } else {
            setOptions(fallbackOptions);
          }
        } else {
          setOptions(fallbackOptions);
        }
      } catch (error) {
        setError("Error fetching data, showing fallback options.");
        setOptions(fallbackOptions);
      }
    };

    fetchOptions();
  }, [fetchUrl, fallbackOptions]);

  return (
    <div className="relative mt-4 mx-auto text-tertiaryColor" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-6 py-4 text-left bg-[#f04e44] rounded-lg shadow-md"
        style={{ background: "linear-gradient(-45deg, #B0499B, #6CCAD3)" }}
      >
        <span className="text-white">{selectedOption || placeholder}</span>
        <svg
          className={`w-4 h-4 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
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
          <li
            onClick={() => handleSelectChange({ [optionKey]: "" })}
            className="px-6 py-4 hover:bg-[#e7a1d9] cursor-pointer"
          >
            Select an option
          </li>

          {error && <li className="px-6 py-4 text-red-600">{error}</li>}

          {options.map((option, index) => (
            <li
              key={option._id || index}
              onClick={() => handleSelectChange(option)}
              className="px-6 py-4 hover:bg-sixthColor cursor-pointer"
            >
              {option[optionKey]}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default Dropdown;
