import { useState } from "react";
import { FaBars } from "react-icons/fa";
import Beds from "./pages/Beds";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";

function App() {
  const [role, setRole] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!role) {
    return <Login onLogin={setRole} />;
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <Sidebar
        role={role}
        onLogout={() => setRole(null)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
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

        <Beds role={role} />
      </div>
    </>
  );
}

export default App;
