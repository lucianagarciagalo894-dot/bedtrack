import { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Beds from "./pages/Beds";
import Habitaciones from "./pages/Habitaciones";
import RoomDetail from "./pages/RoomDetail";
import Pacientes from "./pages/Pacientes";
import { generateRooms } from "./data/beds";

function App() {
  const [role, setRole]               = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rooms, setRooms]             = useState(generateRooms);

  // Fuente única de verdad: beds derivado de rooms
  const beds = useMemo(
    () =>
      rooms.flatMap((room) =>
        room.beds.map((bed) => ({
          id:         bed.id,
          number:     bed.number,
          floor:      room.floor,
          roomId:     room.id,
          roomNumber: room.number,
          status:     bed.status,
          patient:    bed.patient,
        }))
      ),
    [rooms]
  );

  const changeStatus = (bedId, newStatus, patientData = null) =>
    setRooms((prev) =>
      prev.map((room) => ({
        ...room,
        beds: room.beds.map((bed) =>
          bed.id === bedId
            ? {
                ...bed,
                status:  newStatus,
                patient: newStatus === "ocupada" ? patientData : null,
              }
            : bed
        ),
      }))
    );

  const closeSidebar = () => setSidebarOpen(false);

  if (!role) {
    return <Login onLogin={setRole} />;
  }

  return (
    <BrowserRouter>
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
          <Route path="/"              element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"     element={<Dashboard role={role} beds={beds} />} />
          <Route
            path="/camas"
            element={<Beds role={role} beds={beds} onChangeStatus={changeStatus} />}
          />
          <Route
            path="/habitaciones"
            element={<Habitaciones rooms={rooms} />}
          />
          <Route
            path="/habitaciones/:roomId"
            element={<RoomDetail rooms={rooms} role={role} onChangeBedStatus={changeStatus} />}
          />
          <Route
            path="/pacientes"
            element={<Pacientes rooms={rooms} />}
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
