import React, { createContext, useContext, useState } from "react";
const DepartmentContext = createContext();
export const useDepartment = () => useContext(DepartmentContext);

const defaultDepartments = [
  { value: "sales", label: "Sales" },
  { value: "assignmentwriter", label: "Assignment Writer" },
  { value: "production", label: "Production" },
  { value: "admin", label: "Admin" },
];

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState(() => {
    const stored = localStorage.getItem("departments");
    return stored ? JSON.parse(stored) : defaultDepartments;
  });

  const addDepartment = (label) => {
    const value = label.trim().toLowerCase().replace(/ /g, "");
    if (departments.some(dep => dep.value === value)) return false;
    const updated = [...departments, { value, label }];
    setDepartments(updated);
    localStorage.setItem("departments", JSON.stringify(updated));
    return true;
  };

  const removeDepartment = (value) => {
    const updated = departments.filter(dep => dep.value !== value);
    setDepartments(updated);
    localStorage.setItem("departments", JSON.stringify(updated));
  };

  return (
    <DepartmentContext.Provider value={{ departments, addDepartment, removeDepartment }}>
      {children}
    </DepartmentContext.Provider>
  );
};
