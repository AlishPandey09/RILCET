import React from "react";
import { Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute"; // Adjust the import path as necessary

function App() {
  return (
    <>
      <Routes>
        {/* Route to Home component */}
        <Route path="/" element={<Home />} />

        {/* Route to Admin Side */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
