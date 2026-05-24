import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Servico from "./pages/Final";
import Specialty from "./pages/Specialty";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProviderLogin from "./pages/ProviderLogin";
import UserRequests from "./pages/UserRequests";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("itrampo:token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const ProtectedProviderRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("itrampo:providerToken");

  if (!token) {
    return <Navigate to="/prestador/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/prestador/login" element={<ProviderLogin />} />
      <Route
        path="/prestador"
        element={
          <ProtectedProviderRoute>
            <ProviderDashboard />
          </ProtectedProviderRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/solicitacoes"
        element={
          <ProtectedRoute>
            <UserRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/servico"
        element={
          <ProtectedRoute>
            <Servico />
          </ProtectedRoute>
        }
      />
      <Route
        path="/:specialtySlug"
        element={
          <ProtectedRoute>
            <Specialty />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
