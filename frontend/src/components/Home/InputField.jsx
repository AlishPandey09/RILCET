import React from "react";

const InputField = ({ value, onChange, placeholder, ...props }) => {
  const handleChange = (event) => {
    const newValue = event.target.value;
    if (/^-?\d*\.?\d*$/.test(newValue)) {
      onChange(newValue); // Controlled by parent
    }
  };

  return (
    <div className="mt-2 font-inter">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-5 py-3 border-2 bg-[#e9b9df] border-[#e7a1d9] rounded-lg focus:outline-none focus:ring-1 focus:ring-sixthColor placeholder:text-[#707070] placeholder:font-normal text-tertiaryColor placeholder:text-base"
        {...props}
      />
    </div>
  );
};

export default InputField;
