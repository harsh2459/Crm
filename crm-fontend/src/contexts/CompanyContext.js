import React, { createContext, useContext, useState } from "react";
const CompanyContext = createContext();
export const useCompany = () => useContext(CompanyContext);

const defaultCompanies = [
  { value: "Protect My Brand PVT. LTD.", label: "Protect My Brand PVT. LTD." },
  { value: "Book My Assingments PVT. LTD.", label: "Book My Assingments PVT. LTD" },
];

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState(() => {
    const stored = localStorage.getItem("companies");
    return stored ? JSON.parse(stored) : defaultCompanies;
  });

  const addCompany = (label) => {
    const value = label.trim().toLowerCase().replace(/ /g, "");
    if (companies.some(comp => comp.value === value)) return false;
    const updated = [...companies, { value, label }];
    setCompanies(updated);
    localStorage.setItem("companies", JSON.stringify(updated));
    return true;
  };

  const removeCompany = (value) => {
    const updated = companies.filter(comp => comp.value !== value);
    setCompanies(updated);
    localStorage.setItem("companies", JSON.stringify(updated));
  };

  return (
    <CompanyContext.Provider value={{ companies, addCompany, removeCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};
