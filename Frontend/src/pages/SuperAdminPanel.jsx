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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Modals state
  const [showNosocomioModal, setShowNosocomioModal] = useState(false);
  const [showSucursalModal, setShowSucursalModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showBedModal, setShowBedModal] = useState(false);

  // Forms data
  const [newNosocomio, setNewNosocomio] = useState({ nombre: "", codigo: "", direccion: "" });
  const [newSucursal, setNewSucursal] = useState({ nombre: "", direccion: "" });
  const [roomForm, setRoomForm] = useState({ id: null, numero: "", pisoId: "", bedsCount: 1 });
  const [bedForm, setBedForm] = useState({ id: null, numero: "", habitacionId: "", status: "disponible" });

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
      const [nosData, roomsData, floorsData] = await Promise.all([
        getNosocomios(),
        getAllRooms(),
        getFloors(),
      ]);

      setNosocomios(nosData || []);
      if (nosData && nosData.length > 0) {
        setSelectedNosocomioId(nosData[0].id.toString());
        if (nosData[0].sucursales && nosData[0].sucursales.length > 0) {
          setSelectedSucursalId(nosData[0].sucursales[0].id.toString());
        }
      }

      setRooms(roomsData || []);
      setFloors(floorsData || []);
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

  // --- Handlers para Nosocomios y Sucursales ---
  const handleCreateNosocomio = async (e) => {
    e.preventDefault();
    if (!newNosocomio.nombre) return;
    try {
      const created = await createNosocomio(newNosocomio);
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
      showNotification("Sucursal registrada correctamente");
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

  return (
    <div className="superadmin-container">
      {/* Top Banner Notice */}
      <header className="superadmin-header">
        <div className="superadmin-brand">
          <FaHospital className="superadmin-icon" />
          <div>
            <h1>BedTrack SuperAdmin Panel</h1>
            <p>Configuración integral de Nosocomios, Sucursales, Habitaciones y Camas</p>
          </div>
        </div>

        <div className="superadmin-actions">
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

      {/* Grid Controls: Nosocomio & Sucursal Selection */}
      <div className="superadmin-grid">
        <section className="superadmin-card">
          <div className="superadmin-card-header">
            <h3><FaBuilding /> Nosocomio y Sede Activa</h3>
          </div>
          <div className="superadmin-selectors">
            <div className="selector-group">
              <label>Nosocomio:</label>
              <select value={selectedNosocomioId} onChange={handleNosocomioChange}>
                {nosocomios.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nombre} ({n.codigo || `ID: ${n.id}`})
                  </option>
                ))}
              </select>
              <button
                className="btn-secondary-sm"
                onClick={() => setShowNosocomioModal(true)}
              >
                <FaPlus /> Nuevo
              </button>
            </div>

            <div className="selector-group">
              <label>Sucursal / Sede:</label>
              <select
                value={selectedSucursalId}
                onChange={(e) => setSelectedSucursalId(e.target.value)}
                disabled={!sucursalesList.length}
              >
                {sucursalesList.length === 0 ? (
                  <option value="">Sin sucursales registradas</option>
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
                <FaPlus /> Nueva
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
                <label>Nombre:</label>
                <input
                  type="text"
                  placeholder="Ej: Hospital San Martín"
                  value={newNosocomio.nombre}
                  onChange={(e) => setNewNosocomio({ ...newNosocomio, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Código Identificador:</label>
                <input
                  type="text"
                  placeholder="Ej: HSM-01"
                  value={newNosocomio.codigo}
                  onChange={(e) => setNewNosocomio({ ...newNosocomio, codigo: e.target.value })}
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

      {/* --- MODAL SUCURSAL --- */}
      {showSucursalModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Registrar Nueva Sede / Sucursal</h3>
            <form onSubmit={handleCreateSucursal}>
              <div className="form-group">
                <label>Nombre de la Sede:</label>
                <input
                  type="text"
                  placeholder="Ej: Sede Central / Anexo Norte"
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
                  Guardar Sede
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
    </div>
  );
}
