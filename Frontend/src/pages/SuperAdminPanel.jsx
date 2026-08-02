import { useState, useEffect } from "react";
import {
  FaBuilding,
  FaHospital,
  FaBed,
  FaDoorOpen,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCogs,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaUserNurse,
  FaHistory,
  FaUserPlus,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import {
  getNosocomios,
  createNosocomio,
  createSucursal,
  createRoom,
  updateRoom,
  deleteRoom,
  createBed,
  updateBed,
  deleteBed,
  createFullHospitalSetup,
  getStaffUsers,
  createStaffUser,
  updateStaffUser,
  deleteStaffUser,
  getAuditLogs,
} from "../services/superAdminService";
import { getAllRooms, getFloors } from "../services/roomService";

export default function SuperAdminPanel({ onLogout }) {
  // State for Nosocomio & Sucursal selection
  const [nosocomios, setNosocomios] = useState([]);
  const [selectedNosocomioId, setSelectedNosocomioId] = useState("");
  const [selectedSucursalId, setSelectedSucursalId] = useState("");

  // State for Rooms, Beds and Floors
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Modals state
  const [showNosocomioModal, setShowNosocomioModal] = useState(false);
  const [showSucursalModal, setShowSucursalModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showBedModal, setShowBedModal] = useState(false);
  const [showFullHospitalModal, setShowFullHospitalModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Forms data
  const [newNosocomio, setNewNosocomio] = useState({ nombre: "", codigo: "", direccion: "" });
  const [newSucursal, setNewSucursal] = useState({ nombre: "", direccion: "" });
  const [roomForm, setRoomForm] = useState({ id: null, numero: "", pisoId: "", bedsCount: 1 });
  const [bedForm, setBedForm] = useState({ id: null, numero: "", habitacionId: "", status: "disponible" });
  const [userForm, setUserForm] = useState({ id: null, nombre: "", email: "", password: "", rol: "enfermeria", activo: true, nosocomioId: "" });
  const [fullHospitalForm, setFullHospitalForm] = useState({
    nombreNosocomio: "",
    codigoNosocomio: "",
    direccionNosocomio: "",
    nombreSucursal: "Sede Central",
    direccionSucursal: "",
    cantidadPisos: 3,
    habitacionesPorPiso: 4,
    camasPorHabitacion: 2,
  });

  // System Settings State
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const showNotification = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [nosData, roomsData, floorsData, usersData, logsData] = await Promise.all([
        getNosocomios(),
        getAllRooms(),
        getFloors(),
        getStaffUsers(),
        getAuditLogs(),
      ]);

      const defaultNosocomios = [
        {
          id: 1,
          nombre: "Hospital Central BedTrack",
          codigo: "HC-01",
          direccion: "Av. Colón 1234",
          sucursales: [
            { id: 1, nombre: "Establecimiento Central", direccion: "Av. Colón 1234", nosocomioId: 1 }
          ]
        }
      ];

      const activeNosocomios = (nosData && nosData.length > 0) ? nosData : defaultNosocomios;
      setNosocomios(activeNosocomios);

      if (activeNosocomios.length > 0) {
        setSelectedNosocomioId(activeNosocomios[0].id.toString());
        if (activeNosocomios[0].sucursales && activeNosocomios[0].sucursales.length > 0) {
          setSelectedSucursalId(activeNosocomios[0].sucursales[0].id.toString());
        }
      }

      setRooms(roomsData || []);
      setFloors(floorsData || []);
      setStaffUsers(usersData || []);
      setAuditLogs(logsData || []);
    } catch (err) {
      console.error("Error al cargar datos iniciales:", err);
      showNotification("Error al cargar la información del servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  const currentNosocomio = nosocomios.find((n) => n.id.toString() === selectedNosocomioId);
  const sucursalesList = currentNosocomio?.sucursales || [];

  const handleNosocomioChange = (e) => {
    const id = e.target.value;
    setSelectedNosocomioId(id);
    const nos = nosocomios.find((n) => n.id.toString() === id);
    if (nos && nos.sucursales && nos.sucursales.length > 0) {
      setSelectedSucursalId(nos.sucursales[0].id.toString());
    } else {
      setSelectedSucursalId("");
    }
  };

  // --- Handlers para Nosocomios y Establecimientos ---
  const handleCreateNosocomio = async (e) => {
    e.preventDefault();
    if (!newNosocomio.nombre) return;
    try {
      const autoCodigo = "NOS-" + (newNosocomio.nombre.length >= 3 ? newNosocomio.nombre.substring(0, 3).toUpperCase() : "HOSP") + "-" + Math.floor(Math.random() * 900 + 100);
      const created = await createNosocomio({
        nombre: newNosocomio.nombre,
        direccion: newNosocomio.direccion,
        codigo: autoCodigo,
      });
      setNosocomios((prev) => [...prev, created]);
      setSelectedNosocomioId(created.id.toString());
      setNewNosocomio({ nombre: "", codigo: "", direccion: "" });
      setShowNosocomioModal(false);
      showNotification("Nosocomio registrado correctamente");
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleCreateSucursal = async (e) => {
    e.preventDefault();
    if (!newSucursal.nombre || !selectedNosocomioId) return;
    try {
      const created = await createSucursal({
        ...newSucursal,
        nosocomioId: parseInt(selectedNosocomioId, 10),
      });

      setNosocomios((prev) =>
        prev.map((n) =>
          n.id.toString() === selectedNosocomioId
            ? { ...n, sucursales: [...(n.sucursales || []), created] }
            : n
        )
      );
      setSelectedSucursalId(created.id.toString());
      setNewSucursal({ nombre: "", direccion: "" });
      setShowSucursalModal(false);
      showNotification("Establecimiento registrado correctamente");
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  // --- Handlers para Habitaciones ---
  const handleOpenRoomModal = (room = null) => {
    if (room) {
      setRoomForm({
        id: room.id,
        numero: room.number,
        pisoId: room.floorId || (floors[0]?.id || 1),
        bedsCount: room.beds?.length || 1,
      });
    } else {
      setRoomForm({
        id: null,
        numero: "",
        pisoId: floors[0]?.id || 1,
        bedsCount: 1,
      });
    }
    setShowRoomModal(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    if (!roomForm.pisoId) return;
    try {
      if (roomForm.id) {
        // Actualizar
        const updated = await updateRoom(roomForm.id, {
          numero: parseInt(roomForm.numero, 10),
          pisoId: parseInt(roomForm.pisoId, 10),
        });
        setRooms((prev) => prev.map((r) => (r.id === roomForm.id ? updated : r)));
        showNotification("Habitación actualizada con éxito");
      } else {
        // Crear
        const created = await createRoom({
          numero: parseInt(roomForm.numero, 10) || 1,
          pisoId: parseInt(roomForm.pisoId, 10),
          cantidadCamasInicial: parseInt(roomForm.bedsCount, 10) || 1,
        });
        setRooms((prev) => [...prev, created]);
        showNotification("Habitación agregada con éxito");
      }
      setShowRoomModal(false);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("¿Está seguro de eliminar esta habitación y sus camas?")) return;
    try {
      await deleteRoom(roomId);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      showNotification("Habitación eliminada correctamente");
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  // --- Handlers para Camas ---
  const handleOpenBedModal = (bed = null, roomId = null) => {
    if (bed) {
      setBedForm({
        id: bed.id,
        numero: bed.number,
        habitacionId: roomId || rooms[0]?.id,
        status: bed.status || "disponible",
      });
    } else {
      setBedForm({
        id: null,
        numero: "",
        habitacionId: roomId || (rooms[0]?.id || 1),
        status: "disponible",
      });
    }
    setShowBedModal(true);
  };

  const handleSaveBed = async (e) => {
    e.preventDefault();
    if (!bedForm.habitacionId) return;
    try {
      if (bedForm.id) {
        // Actualizar Cama
        const updated = await updateBed(bedForm.id, {
          numero: parseInt(bedForm.numero, 10) || 1,
          habitacionId: parseInt(bedForm.habitacionId, 10),
          status: bedForm.status,
        });

        setRooms((prev) =>
          prev.map((r) => ({
            ...r,
            beds: r.beds.map((b) => (b.id === bedForm.id ? { ...b, ...updated } : b)),
          }))
        );
        showNotification("Cama actualizada correctamente");
      } else {
        // Crear Cama
        const created = await createBed({
          numero: parseInt(bedForm.numero, 10) || 1,
          habitacionId: parseInt(bedForm.habitacionId, 10),
          status: bedForm.status,
        });

        setRooms((prev) =>
          prev.map((r) =>
            r.id === parseInt(bedForm.habitacionId, 10)
              ? { ...r, beds: [...r.beds, created] }
              : r
          )
        );
        showNotification("Cama agregada correctamente");
      }
      setShowBedModal(false);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleDeleteBed = async (bedId) => {
    if (!window.confirm("¿Está seguro de eliminar esta cama?")) return;
    try {
      await deleteBed(bedId);
      setRooms((prev) =>
        prev.map((r) => ({
          ...r,
          beds: r.beds.filter((b) => b.id !== bedId),
        }))
      );
      showNotification("Cama eliminada correctamente");
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleCreateFullHospital = async (e) => {
    e.preventDefault();
    if (!fullHospitalForm.nombreNosocomio) return;

    try {
      const floorsPayload = [];
      const numPisos = parseInt(fullHospitalForm.cantidadPisos, 10) || 3;
      const habsPorPiso = parseInt(fullHospitalForm.habitacionesPorPiso, 10) || 4;
      const camasPorHab = parseInt(fullHospitalForm.camasPorHabitacion, 10) || 2;

      for (let i = 1; i <= numPisos; i++) {
        let tipo = "Compartida";
        let tipoKey = "compartida";
        if (i === 1) { tipo = "Privada"; tipoKey = "privada"; }
        else if (i === numPisos) { tipo = "Terapia Intensiva"; tipoKey = "intensiva"; }

        floorsPayload.push({
          nombre: `Piso ${i}`,
          tipo,
          tipoKey,
          cantidadHabitaciones: habsPorPiso,
          camasPorHabitacion: camasPorHab,
        });
      }

      const autoCodigo = "HOSP-" + (fullHospitalForm.nombreNosocomio.length >= 3 ? fullHospitalForm.nombreNosocomio.substring(0, 3).toUpperCase() : "MED") + "-" + Math.floor(Math.random() * 900 + 100);

      const payload = {
        nombreNosocomio: fullHospitalForm.nombreNosocomio,
        codigoNosocomio: autoCodigo,
        direccionNosocomio: fullHospitalForm.direccionNosocomio,
        nombreSucursal: fullHospitalForm.nombreSucursal || "Establecimiento Central",
        direccionSucursal: fullHospitalForm.direccionSucursal || fullHospitalForm.direccionNosocomio,
        pisos: floorsPayload,
      };

      const result = await createFullHospitalSetup(payload);
      setShowFullHospitalModal(false);

      showNotification(`Hospital "${result.nombre}" generado exitosamente con sus pisos, habitaciones y camas.`);

      await loadInitialData();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  // --- Handlers para Usuarios Staff de Enfermería ---
  const handleOpenUserModal = (user = null) => {
    if (user) {
      setUserForm({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        password: "",
        rol: user.rol || "enfermeria",
        activo: user.activo !== false,
        nosocomioId: user.nosocomioId ? user.nosocomioId.toString() : selectedNosocomioId,
      });
    } else {
      setUserForm({
        id: null,
        nombre: "",
        email: "",
        password: "",
        rol: "enfermeria",
        activo: true,
        nosocomioId: selectedNosocomioId,
      });
    }
    setShowUserModal(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!userForm.nombre || !userForm.email) return;

    try {
      if (userForm.id) {
        const updated = await updateStaffUser(userForm.id, {
          nombre: userForm.nombre,
          email: userForm.email,
          password: userForm.password,
          rol: userForm.rol,
          activo: userForm.activo,
          nosocomioId: userForm.nosocomioId ? parseInt(userForm.nosocomioId, 10) : null,
        });
        setStaffUsers((prev) => prev.map((u) => (u.id === userForm.id ? { ...u, ...updated } : u)));
        showNotification("Usuario de enfermería actualizado");
      } else {
        const created = await createStaffUser({
          nombre: userForm.nombre,
          email: userForm.email,
          password: userForm.password || "123456",
          rol: userForm.rol,
          nosocomioId: userForm.nosocomioId ? parseInt(userForm.nosocomioId, 10) : null,
        });
        setStaffUsers((prev) => [...prev, created]);
        showNotification("Usuario de enfermería creado con éxito");
      }
      setShowUserModal(false);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleToggleUserStatus = async (user) => {
    try {
      const updated = await updateStaffUser(user.id, {
        ...user,
        activo: !user.activo,
      });
      setStaffUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, activo: !u.activo } : u)));
      showNotification(`Usuario ${!user.activo ? "activado" : "desactivado"}`);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  return (
    <div className="superadmin-container">
      {/* Top Banner Notice */}
      <header className="superadmin-header">
        <div className="superadmin-brand">
          <FaHospital className="superadmin-icon" />
          <div>
            <h1>BedTrack SuperAdmin Panel</h1>
            <p>Configuración integral de Nosocomios, Establecimientos, Habitaciones y Camas</p>
          </div>
        </div>

        <div className="superadmin-actions">
          <button
            className="btn-primary-add"
            style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)" }}
            onClick={() => setShowFullHospitalModal(true)}
          >
            <FaPlus /> Crear Hospital Completo
          </button>
          <span className="superadmin-badge">Modo Desarrollador</span>
          {onLogout && (
            <button className="superadmin-logout-btn" onClick={onLogout}>
              Cerrar Sesión
            </button>
          )}
        </div>
      </header>

      {message && (
        <div className={`superadmin-toast ${message.type}`}>
          {message.type === "success" ? <FaCheckCircle /> : <FaExclamationTriangle />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid Controls: Nosocomio & Establecimiento Selection */}
      <div className="superadmin-grid">
        <section className="superadmin-card">
          <div className="superadmin-card-header">
            <h3><FaBuilding /> Nosocomio y Establecimiento Activo</h3>
          </div>
          <div className="superadmin-selectors">
            <div className="selector-group">
              <label>Nosocomio:</label>
              <select
                value={selectedNosocomioId}
                onChange={handleNosocomioChange}
                disabled={!nosocomios.length}
              >
                {nosocomios.length === 0 ? (
                  <option value="">Sin nosocomios registrados</option>
                ) : (
                  nosocomios.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.nombre} ({n.codigo || `ID: ${n.id}`})
                    </option>
                  ))
                )}
              </select>
              <button
                className="btn-secondary-sm"
                onClick={() => setShowNosocomioModal(true)}
              >
                <FaPlus /> Nuevo
              </button>
            </div>

            <div className="selector-group">
              <label>Establecimiento:</label>
              <select
                value={selectedSucursalId}
                onChange={(e) => setSelectedSucursalId(e.target.value)}
                disabled={!sucursalesList.length}
              >
                {sucursalesList.length === 0 ? (
                  <option value="">Sin establecimientos registrados</option>
                ) : (
                  sucursalesList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre} - {s.direccion}
                    </option>
                  ))
                )}
              </select>
              <button
                className="btn-secondary-sm"
                onClick={() => setShowSucursalModal(true)}
                disabled={!selectedNosocomioId}
              >
                <FaPlus /> Nuevo
              </button>
            </div>
          </div>
        </section>

        {/* Global Settings & Utilities */}
        <section className="superadmin-card">
          <div className="superadmin-card-header">
            <h3><FaCogs /> Configuración de Funciones Existentes</h3>
          </div>
          <div className="superadmin-config-options">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Sincronización en tiempo real activa
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
              />
              Modo Mantenimiento de Infraestructura
            </label>

            <button
              className="btn-action-refresh"
              onClick={loadInitialData}
            >
              <FaExchangeAlt /> Recargar Datos de Servidor
            </button>
          </div>
        </section>
      </div>

      {/* --- SECCIÓN: GESTIÓN DE USUARIOS / PERSONAL DE ENFERMERÍA --- */}
      <section className="superadmin-main-section" style={{ marginBottom: "24px" }}>
        <div className="section-toolbar">
          <h2><FaUserNurse style={{ color: "#2563EB" }} /> Gestión de Perfiles de Enfermería y Personal</h2>
          <button className="btn-primary-add" onClick={() => handleOpenUserModal()}>
            <FaUserPlus /> Crear Usuario de Enfermería
          </button>
        </div>

        <div style={{ background: "var(--card-bg, #FFFFFF)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border, #E2E8F0)" }}>
          {staffUsers.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "#64748B" }}>No hay usuarios de enfermería registrados para este establecimiento.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #E2E8F0", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>Nombre del Personal</th>
                    <th style={{ padding: "10px" }}>Correo Electrónico</th>
                    <th style={{ padding: "10px" }}>Rol</th>
                    <th style={{ padding: "10px" }}>Hospital Asignado</th>
                    <th style={{ padding: "10px" }}>Estado</th>
                    <th style={{ padding: "10px", textAlign: "right" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {staffUsers.map((u) => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "10px", fontWeight: "600" }}>{u.nombre}</td>
                      <td style={{ padding: "10px" }}>{u.email}</td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ background: u.rol === "admin" ? "#FEF3C7" : "#DBEAFE", color: u.rol === "admin" ? "#D97706" : "#2563EB", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "600" }}>
                          {u.rol === "enfermeria" ? "Enfermería" : u.rol}
                        </span>
                      </td>
                      <td style={{ padding: "10px", color: "#64748B" }}>{u.hospitalNombre || "Global"}</td>
                      <td style={{ padding: "10px" }}>
                        <span style={{ color: u.activo !== false ? "#059669" : "#DC2626", fontWeight: "600" }}>
                          {u.activo !== false ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td style={{ padding: "10px", textAlign: "right" }}>
                        <button
                          className="icon-btn edit-sm"
                          style={{ marginRight: "8px" }}
                          onClick={() => handleOpenUserModal(u)}
                          title="Editar Perfil"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="icon-btn"
                          style={{ color: u.activo !== false ? "#DC2626" : "#059669" }}
                          onClick={() => handleToggleUserStatus(u)}
                          title={u.activo !== false ? "Desactivar Usuario" : "Activar Usuario"}
                        >
                          {u.activo !== false ? <FaToggleOn size={18} /> : <FaToggleOff size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* --- SECCIÓN: HISTORIAL DE AUDITORÍA GLOBAL DE CAMAS --- */}
      <section className="superadmin-main-section" style={{ marginBottom: "24px" }}>
        <div className="section-toolbar">
          <h2><FaHistory style={{ color: "#8B5CF6" }} /> Historial de Auditoría (Registro de Cambios en Camas)</h2>
        </div>

        <div style={{ background: "var(--card-bg, #FFFFFF)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border, #E2E8F0)" }}>
          {auditLogs.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "#64748B" }}>No hay registros de modificaciones de camas aún.</p>
          ) : (
            <div style={{ overflowX: "auto", maxHeight: "320px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.825rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #E2E8F0", textAlign: "left", sticky: "top", background: "#F8FAFC" }}>
                    <th style={{ padding: "8px" }}>Fecha / Hora</th>
                    <th style={{ padding: "8px" }}>Operador (Enfermería)</th>
                    <th style={{ padding: "8px" }}>Ubicación</th>
                    <th style={{ padding: "8px" }}>Acción Realizada</th>
                    <th style={{ padding: "8px" }}>Transición</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "8px", whiteSpace: "nowrap", color: "#64748B" }}>{log.fechaHora}</td>
                      <td style={{ padding: "8px" }}>
                        <strong>{log.usuarioNombre}</strong>
                        <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>{log.usuarioEmail}</div>
                      </td>
                      <td style={{ padding: "8px", whiteSpace: "nowrap" }}>
                        Hab #{log.habitacionNumero} - Cama #{log.camaNumero}
                      </td>
                      <td style={{ padding: "8px" }}>{log.accion}</td>
                      <td style={{ padding: "8px", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "0.7rem", padding: "2px 6px", borderRadius: "4px", background: "#E2E8F0" }}>
                          {log.estadoAnterior} → <strong>{log.estadoNuevo}</strong>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Section: Infrastructure Management */}
      <section className="superadmin-main-section">
        <div className="section-toolbar">
          <h2>Gestión de Habitaciones y Camas</h2>
          <div className="toolbar-btns">
            <button className="btn-primary-add" onClick={() => handleOpenRoomModal()}>
              <FaDoorOpen /> Agregar Habitación
            </button>
            <button className="btn-primary-add" onClick={() => handleOpenBedModal()}>
              <FaBed /> Agregar Cama
            </button>
          </div>
        </div>

        {loading ? (
          <div className="superadmin-loading">Cargando infraestructura...</div>
        ) : (
          <div className="rooms-matrix-grid">
            {rooms.map((room) => (
              <div key={room.id} className="room-admin-card">
                <div className="room-admin-header">
                  <div>
                    <h4>Habitación #{room.number}</h4>
                    <span className="room-floor-tag">
                      {room.floor || `Piso ID: ${room.floorId}`}
                    </span>
                  </div>
                  <div className="room-actions">
                    <button
                      className="icon-btn edit"
                      title="Editar Habitación"
                      onClick={() => handleOpenRoomModal(room)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="icon-btn delete"
                      title="Eliminar Habitación"
                      onClick={() => handleDeleteRoom(room.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="beds-list-admin">
                  <div className="beds-header-sub">
                    <span>Camas ({room.beds?.length || 0})</span>
                    <button
                      className="btn-xs-add"
                      onClick={() => handleOpenBedModal(null, room.id)}
                    >
                      + Cama
                    </button>
                  </div>

                  {room.beds?.map((bed) => (
                    <div key={bed.id} className="bed-admin-item">
                      <div className="bed-info">
                        <FaBed className={`bed-status-icon ${bed.status}`} />
                        <span>Cama #{bed.number}</span>
                        <span className={`status-badge ${bed.status}`}>
                          {bed.status}
                        </span>
                      </div>
                      <div className="bed-actions">
                        <button
                          className="icon-btn edit-sm"
                          onClick={() => handleOpenBedModal(bed, room.id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="icon-btn delete-sm"
                          onClick={() => handleDeleteBed(bed.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- MODAL NOSOCOMIO --- */}
      {showNosocomioModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Registrar Nuevo Nosocomio</h3>
            <form onSubmit={handleCreateNosocomio}>
              <div className="form-group">
                <label>Nombre del Hospital / Nosocomio:</label>
                <input
                  type="text"
                  placeholder="Ej: Hospital San Martín"
                  value={newNosocomio.nombre}
                  onChange={(e) => setNewNosocomio({ ...newNosocomio, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Dirección:</label>
                <input
                  type="text"
                  placeholder="Ej: Calle Principal 500"
                  value={newNosocomio.direccion}
                  onChange={(e) => setNewNosocomio({ ...newNosocomio, direccion: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowNosocomioModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  Guardar Nosocomio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL ESTABLECIMIENTO --- */}
      {showSucursalModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Registrar Nuevo Establecimiento</h3>
            <form onSubmit={handleCreateSucursal}>
              <div className="form-group">
                <label>Nombre del Establecimiento:</label>
                <input
                  type="text"
                  placeholder="Ej: Establecimiento Central / Anexo Norte"
                  value={newSucursal.nombre}
                  onChange={(e) => setNewSucursal({ ...newSucursal, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Dirección:</label>
                <input
                  type="text"
                  placeholder="Ej: Av. Córdoba 789"
                  value={newSucursal.direccion}
                  onChange={(e) => setNewSucursal({ ...newSucursal, direccion: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowSucursalModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  Guardar Establecimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL HABITACION --- */}
      {showRoomModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{roomForm.id ? "Editar Habitación" : "Agregar Habitación"}</h3>
            <form onSubmit={handleSaveRoom}>
              <div className="form-group">
                <label>Número de Habitación:</label>
                <input
                  type="number"
                  placeholder="Ej: 101"
                  value={roomForm.numero}
                  onChange={(e) => setRoomForm({ ...roomForm, numero: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Piso Hospitalario:</label>
                <select
                  value={roomForm.pisoId}
                  onChange={(e) => setRoomForm({ ...roomForm, pisoId: e.target.value })}
                  required
                >
                  {floors.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nombre} ({f.tipo})
                    </option>
                  ))}
                </select>
              </div>

              {!roomForm.id && (
                <div className="form-group">
                  <label>Cantidad de camas iniciales:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={roomForm.bedsCount}
                    onChange={(e) => setRoomForm({ ...roomForm, bedsCount: e.target.value })}
                  />
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowRoomModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  {roomForm.id ? "Actualizar" : "Crear Habitación"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CAMA --- */}
      {showBedModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{bedForm.id ? "Editar Cama" : "Agregar Cama"}</h3>
            <form onSubmit={handleSaveBed}>
              <div className="form-group">
                <label>Número de Cama:</label>
                <input
                  type="number"
                  placeholder="Ej: 1"
                  value={bedForm.numero}
                  onChange={(e) => setBedForm({ ...bedForm, numero: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Habitación de Destino:</label>
                <select
                  value={bedForm.habitacionId}
                  onChange={(e) => setBedForm({ ...bedForm, habitacionId: e.target.value })}
                  required
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Habitación #{r.number} ({r.floor})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Estado Inicial:</label>
                <select
                  value={bedForm.status}
                  onChange={(e) => setBedForm({ ...bedForm, status: e.target.value })}
                >
                  <option value="disponible">Disponible</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="enlimpieza">En Limpieza</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowBedModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  {bedForm.id ? "Actualizar Cama" : "Crear Cama"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL ASISTENTE HOSPITAL COMPLETO --- */}
      {showFullHospitalModal && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: "540px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FaHospital style={{ fontSize: "24px", color: "#10B981" }} />
              <div>
                <h3 style={{ margin: 0 }}>Crear Hospital Completo (Asistente 1-Clic)</h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#64748B" }}>
                  Genera la institución, establecimiento, pisos, habitaciones y camas totalmente funcionales de forma automática.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateFullHospital}>
              <div className="form-group">
                <label>Nombre del Hospital / Nosocomio:</label>
                <input
                  type="text"
                  placeholder="Ej: Hospital Privado Córdoba"
                  value={fullHospitalForm.nombreNosocomio}
                  onChange={(e) => setFullHospitalForm({ ...fullHospitalForm, nombreNosocomio: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nombre del Establecimiento Inicial:</label>
                <input
                  type="text"
                  placeholder="Ej: Establecimiento Central"
                  value={fullHospitalForm.nombreSucursal}
                  onChange={(e) => setFullHospitalForm({ ...fullHospitalForm, nombreSucursal: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Dirección:</label>
                <input
                  type="text"
                  placeholder="Ej: Av. Naciones Unidas 345"
                  value={fullHospitalForm.direccionNosocomio}
                  onChange={(e) => setFullHospitalForm({ ...fullHospitalForm, direccionNosocomio: e.target.value, direccionSucursal: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", background: "#F8FAFC", padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                <div className="form-group">
                  <label style={{ fontSize: "0.75rem" }}>Cantidad de Pisos:</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={fullHospitalForm.cantidadPisos}
                    onChange={(e) => setFullHospitalForm({ ...fullHospitalForm, cantidadPisos: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "0.75rem" }}>Habs. por Piso:</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={fullHospitalForm.habitacionesPorPiso}
                    onChange={(e) => setFullHospitalForm({ ...fullHospitalForm, habitacionesPorPiso: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "0.75rem" }}>Camas por Hab.:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={fullHospitalForm.camasPorHabitacion}
                    onChange={(e) => setFullHospitalForm({ ...fullHospitalForm, camasPorHabitacion: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ fontSize: "0.75rem", color: "#059669", background: "#ECFDF5", padding: "8px 12px", borderRadius: "6px", fontWeight: "600" }}>
                Se generarán {(parseInt(fullHospitalForm.cantidadPisos, 10) || 1) * (parseInt(fullHospitalForm.habitacionesPorPiso, 10) || 1)} habitaciones y {(parseInt(fullHospitalForm.cantidadPisos, 10) || 1) * (parseInt(fullHospitalForm.habitacionesPorPiso, 10) || 1) * (parseInt(fullHospitalForm.camasPorHabitacion, 10) || 1)} camas disponibles inmediatamente.
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowFullHospitalModal(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-confirm"
                  style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}
                >
                  <FaHospital /> Generar Infraestructura de Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CREAR / EDITAR USUARIO STAFF ENFERMERÍA --- */}
      {showUserModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{userForm.id ? "Editar Perfil de Enfermería" : "Registrar Usuario de Enfermería"}</h3>
            <form onSubmit={handleSaveUser}>
              <div className="form-group">
                <label>Nombre Completo:</label>
                <input
                  type="text"
                  placeholder="Ej: Lic. María Elena Fernández"
                  value={userForm.nombre}
                  onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Correo Electrónico:</label>
                <input
                  type="email"
                  placeholder="ejemplo@hospital.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contraseña / Clave de Acceso:</label>
                <input
                  type="password"
                  placeholder={userForm.id ? "Dejar en blanco para mantener la actual" : "Mínimo 4 caracteres"}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Hospital Asignado:</label>
                <select
                  value={userForm.nosocomioId}
                  onChange={(e) => setUserForm({ ...userForm, nosocomioId: e.target.value })}
                >
                  <option value="">-- Todos los Hospitales --</option>
                  {nosocomios.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Rol de Usuario:</label>
                <select
                  value={userForm.rol}
                  onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })}
                >
                  <option value="enfermeria">Enfermería</option>
                  <option value="admin">Administrador Hospitalario</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowUserModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-confirm">
                  {userForm.id ? "Actualizar Usuario" : "Guardar Perfil"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
