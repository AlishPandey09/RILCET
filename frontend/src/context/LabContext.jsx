// src/context/LabContext.js
import React, { createContext, useContext, useState } from 'react';

const LabContext = createContext();

export const LabProvider = ({ children }) => {
  const [lValue, setLValue] = useState("");
  const [aValue, setAValue] = useState("");
  const [bValue, setBValue] = useState("");

  return (
    <LabContext.Provider value={{ lValue, setLValue, aValue, setAValue, bValue, setBValue }}>
      {children}
    </LabContext.Provider>
  );
};

export const useLabContext = () => useContext(LabContext);