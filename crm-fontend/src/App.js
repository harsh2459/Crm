import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DepartmentProvider } from "./contexts/DepartmentContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import { CompanyProvider } from "./contexts/CompanyContext";
import OwnerDashboard from "./pages/OwnerDashboard";
import UsersPage from "./pages/UsersPage";
import EmployeeDetail from "./pages/EmployeeDetail";
import EmployeeDashboard from "./pages/EmployeeDashboard";


function ProtectedRoute({ children }) {
  const { user } = useUser();
  return user ? children : <Navigate to="/auth" />;
}

function App() {
  return (
    <UserProvider>
      <DepartmentProvider>
        <CompanyProvider>
          <Router>
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/OwnerDashboard" element={<OwnerDashboard />} />
              <Route path="/usersPage" element={<UsersPage />} />
                <Route path="/employee/:email" element={<EmployeeDetail />} /> 
                <Route path="/employeeDashboard" element={<EmployeeDashboard/>}/>
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              
              <Route path="/" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </CompanyProvider>
      </DepartmentProvider>
    </UserProvider>
  );
}
export default App;
