import React, { useState } from 'react';

const InputField = ({ value, onChange, placeholder, ...props }) => {
  const [inputValue, setInputValue] = useState(value || '');

  const handleChange = (event) => {
    const { value } = event.target;

    // Allow only numbers (including floats)
    if (/^-?\d*\.?\d*$/.test(value)) {
      setInputValue(value);
      onChange(value); // Call the parent onChange handler
    }
  };

  return (
    <div className="mt-2 font-inter">
      <input
        type="number"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder} // Set the customizable placeholder here
        className="w-full px-5 py-3 border-2 bg-[#e9b9df] border-[#e7a1d9] rounded-lg focus:outline-none focus:ring-1 focus:ring-sixthColor placeholder:text-[#707070] placeholder:font-normal text-tertiaryColor placeholder:text-base" // Customize placeholder color and size here
        {...props}
      />
    </div>
  );
};

export default InputField;
