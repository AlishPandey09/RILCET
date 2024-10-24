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
    <div className="mt-2">
      <input
        type="number"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder} // Set the customizable placeholder here
        className="w-full px-6 py-4 border bg-secondaryColor border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sixthColor placeholder:text-gray-400 placeholder:font-thin" // Customize placeholder color and size here
        {...props}
      />
    </div>
  );
};

export default InputField;
