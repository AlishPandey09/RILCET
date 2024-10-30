import React from 'react';

const Button = ({ text, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-full px-8 py-3 text-white text-lg font-semibold rounded-lg bg-transparent transition-all duration-300 ease-in-out hover:bg-sixthColor hover:text-tertiaryColor hover:border-transparent ${className}`}
      style={{
        background:
          "linear-gradient(-45deg, #B0499B, #6CCAD3)",
      }}
    >
      {text}
      <span className="absolute -z-10 inset-0 bg-sixthColor opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100 rounded-lg"></span>
    </button>
  );
};

export default Button;