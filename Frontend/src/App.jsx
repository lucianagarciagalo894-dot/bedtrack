import { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import DevLogin from "./pages/DevLogin";
import SuperAdminPanel from "./pages/SuperAdminPanel";
import Dashboard from "./pages/Dashboard";
import Beds from "./pages/Beds";
import Habitaciones from "./pages/Habitaciones";
import RoomDetail from "./pages/RoomDetail";
import Pacientes from "./pages/Pacientes";
import { getAllRooms, updateBedStatus } from "./services/roomService";

const VALID_TRANSITIONS = {
  disponible: ["ocupada", "enlimpieza"],
  ocupada:    ["enlimpieza", "ocupada"],
  enlimpieza:   ["disponible", "ocupada"],
};

function AppContent() {
  const [role, setRole]                       = useState(null);
  const [sessionHospital, setSessionHospital] = useState(null);
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [rooms, setRooms]                     = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (role && role !== "superadmin") {
      getAllRooms()
        .then(data => setRooms(data))
        .catch(err => console.error("Error cargando habitaciones", err));
    }
  }, [role]);

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
          status:     bed.status?.toLowerCase(),
          patient:    bed.patient,
        }))
      ),
    [rooms]
  );

  const handleUserLogin = (selectedRole, hospitalData = null) => {
    setRole(selectedRole);
    if (hospitalData) {
      setSessionHospital(hospitalData);
    }
  };

  const changeStatus = async (bedId, newStatus, patientData = null) => {
    const currentBed = rooms.flatMap((r) => r.beds).find((b) => b.id === bedId);
    const currentStatus = currentBed?.status?.toLowerCase();
    if (!currentBed || !VALID_TRANSITIONS[currentStatus]?.includes(newStatus)) {
      return;
    }

    try {
      const operatorInfo = {
        name: role === "enfermeria" ? "Lic. María Elena Fernández" : "Administrador Hospitalario",
        email: role === "enfermeria" ? "maria.fernandez@hospital.com" : "admin@hospital.com",
      };

      const updatedBed = await updateBedStatus(bedId, newStatus, patientData, operatorInfo);

      setRooms((prev) =>
        prev.map((room) => ({
          ...room,
          beds: room.beds.map((bed) =>
            bed.id === bedId
              ? {
                  ...bed,
                  status:  updatedBed.status,
                  patient: updatedBed.patient,
                }
              : bed
          ),
        }))
      );
    } catch (error) {
      console.error("Error al actualizar estado de la cama:", error);
      alert("Hubo un error al actualizar la cama. Revisa tu conexión.");
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  // 1. PRIMERA PRIORIDAD: Si el rol es superadmin o developer, mostrar el panel de superadmin
  if (role === "superadmin" || role === "developer") {
    return <SuperAdminPanel onLogout={() => setRole(null)} />;
  }

  // 2. Ruta oculta para el login de desarrolladores (/dev-login, /superadmin, /dev)
  const isDevUrl =
    location.pathname === "/dev-login" ||
    location.pathname === "/superadmin-login" ||
    location.pathname === "/superadmin" ||
    location.pathname === "/dev";

  if (isDevUrl) {
    return <DevLogin onLogin={(devRole) => handleUserLogin(devRole)} />;
  }

  // 3. Usuario no autenticado en ruta regular
  if (!role) {
    return <Login onLogin={handleUserLogin} />;
  }

  return (
    <>
      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <Sidebar
        role={role}
        hospitalInfo={sessionHospital}
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
          <span className="topbar-title">
            BedTrack {sessionHospital ? `— ${sessionHospital.hospital} (${sessionHospital.sede})` : ""}
          </span>
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
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
