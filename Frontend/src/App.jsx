import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Beds from "./pages/Beds";
import { generateBeds } from "./data/beds";

function App() {
  const [role, setRole] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [beds, setBeds] = useState(generateBeds);

  const changeStatus = (id, newStatus) =>
    setBeds((prev) =>
      prev.map((bed) => (bed.id === id ? { ...bed, status: newStatus } : bed))
    );

  const closeSidebar = () => setSidebarOpen(false);

  if (!role) {
    return <Login onLogin={setRole} />;
  }

  return (
    <BrowserRouter>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <Sidebar
        role={role}
        onLogout={() => setRole(null)}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="main-content">
        {/* Mobile topbar */}
        <div className="topbar">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
            aria-expanded={sidebarOpen}
          >
            <FaBars />
          </button>
          <span className="topbar-title">BedTrack</span>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={<Dashboard role={role} beds={beds} />}
          />
          <Route
            path="/camas"
            element={
              <Beds role={role} beds={beds} onChangeStatus={changeStatus} />
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
