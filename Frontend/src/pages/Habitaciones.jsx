import { useState, useMemo } from "react";
import RoomCard from "../components/RoomCard";
import { FLOOR_CONFIG } from "../data/beds";
import {
  FaBuilding,
  FaDoorOpen,
  FaBed,
  FaCheckCircle,
  FaTimesCircle,
  FaBroom,
  FaExclamationCircle,
  FaInbox,
  FaSpinner,
} from "react-icons/fa";

const TYPE_THEME = {
  general:     { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  privada:     { color: "#2563EB", bg: "#EFF6FF", border: "#DBEAFE" },
  compartida:  { color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  intensiva:   { color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
  guardia:     { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  aislamiento: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
};

function getTypeTheme(typeKey) {
  const normKey = typeKey ? typeKey.toString().toLowerCase().replace(/ /g, "") : "general";
  return TYPE_THEME[normKey] || TYPE_THEME.general;
}

export default function Habitaciones({ rooms = [] }) {
  const [selectedFloorId, setSelectedFloorId] = useState(1);
  const isLoading = false;
  const error     = null;

  const dynamicFloors = useMemo(() => {
    const map = new Map();
    if (rooms && rooms.length > 0) {
      rooms.forEach((r) => {
        const floorName = r.floor ? r.floor.trim() : (r.floorId === 0 ? "Planta Baja" : `Piso ${r.floorId ?? 1}`);
        const normKey = floorName.toLowerCase();
        if (!map.has(normKey)) {
          map.set(normKey, {
            id: r.floorId ?? normKey,
            label: floorName,
            type: r.type || "General",
            typeKey: r.typeKey ? r.typeKey.toString().toLowerCase().replace(/ /g, "") : "general",
          });
        }
      });
    }
    return Array.from(map.values()).sort((a, b) => {
      const numA = parseInt(a.label.replace(/\D/g, ""), 10);
      const numB = parseInt(b.label.replace(/\D/g, ""), 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.label.localeCompare(b.label);
    });
  }, [rooms]);

  const isValidFloor = dynamicFloors.some((f) => String(f.id) === String(selectedFloorId) || f.label.toLowerCase() === String(selectedFloorId).toLowerCase());
  if (dynamicFloors.length > 0 && !isValidFloor) {
    setSelectedFloorId(dynamicFloors[0].id);
  }

  const currentFloor = dynamicFloors.find((f) => String(f.id) === String(selectedFloorId) || f.label.toLowerCase() === String(selectedFloorId).toLowerCase()) || dynamicFloors[0];
  const theme        = getTypeTheme(currentFloor?.typeKey);

  const floorRooms = useMemo(
    () =>
      rooms.filter((r) => {
        if (!currentFloor) return false;
        const floorName = r.floor ? r.floor.trim().toLowerCase() : (r.floorId === 0 ? "planta baja" : `piso ${r.floorId ?? 1}`);
        return (
          floorName === currentFloor.label.toLowerCase() ||
          String(r.floorId) === String(currentFloor.id)
        );
      }),
    [rooms, currentFloor]
  );

  const totalBeds     = floorRooms.reduce((s, r) => s + (r.beds?.length || 0), 0);
  const availableBeds = floorRooms.reduce((s, r) => s + (r.beds || []).filter((b) => b.status?.toLowerCase() === "disponible").length, 0);
  const occupiedBeds  = floorRooms.reduce((s, r) => s + (r.beds || []).filter((b) => b.status?.toLowerCase() === "ocupada").length, 0);
  const cleaningBeds  = floorRooms.reduce((s, r) => s + (r.beds || []).filter((b) => b.status?.toLowerCase() === "enlimpieza").length, 0);

  return (
    <div className="page-wrapper">

      {/* ── Encabezado ─────────────────────────────────────────── */}
      <header className="page-header">
        <h1 className="page-title">Habitaciones por Piso</h1>
        <p className="page-subtitle">
          Seleccioná una habitación para gestionar sus camas &middot; {currentFloor?.label}
        </p>
      </header>

      {/* ── Selector de piso ───────────────────────────────────── */}
      <div className="floor-tabs-wrap" role="group" aria-label="Selector de piso">
        {dynamicFloors.map((floor) => {
          const ft       = getTypeTheme(floor.typeKey);
          const isActive = String(floor.id) === String(selectedFloorId);
          return (
            <button
              key={floor.id}
              className={`floor-tab${isActive ? " active" : ""}`}
              onClick={() => setSelectedFloorId(floor.id)}
              aria-pressed={isActive}
              style={
                isActive
                  ? { borderBottomColor: ft.color, color: ft.color, background: ft.bg }
                  : {}
              }
            >
              <span className="floor-tab-name">{floor.label}</span>
              <span
                className="floor-tab-type"
                style={isActive ? { color: ft.color, opacity: 0.75 } : {}}
              >
                {floor.type}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Banner del piso ─────────────────────────────────────── */}
      <div
        className="floor-info-banner"
        style={{ borderColor: theme.border, background: theme.bg }}
      >
        <div className="floor-info-left">
          <div
            className="floor-info-icon"
            style={{ color: theme.color, background: `${theme.color}1A` }}
            aria-hidden="true"
          >
            <FaBuilding />
          </div>
          <div>
            <div className="floor-info-title" style={{ color: theme.color }}>
              {currentFloor?.label} &middot; {currentFloor?.type}
            </div>
            <div className="floor-info-desc">
              {floorRooms.length} habitaciones &middot; {totalBeds} camas en total
            </div>
          </div>
        </div>
        <div className="floor-info-chips">
          <div className="floor-info-chip">
            <FaDoorOpen aria-hidden="true" />
            <span>{floorRooms.length} hab.</span>
          </div>
          <div className="floor-info-chip">
            <FaBed aria-hidden="true" />
            <span>{totalBeds} camas</span>
          </div>
        </div>
      </div>

      {/* ── Estadísticas ────────────────────────────────────────── */}
      <div className="stats-grid" role="region" aria-label="Resumen de camas">
        <div className="stat-card">
          <div className="stat-icon success" aria-hidden="true"><FaCheckCircle /></div>
          <div className="stat-info">
            <div className="stat-value">{availableBeds}</div>
            <div className="stat-label">Disponibles</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon error" aria-hidden="true"><FaTimesCircle /></div>
          <div className="stat-info">
            <div className="stat-value">{occupiedBeds}</div>
            <div className="stat-label">Ocupadas</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cleaning" aria-hidden="true"><FaBroom /></div>
          <div className="stat-info">
            <div className="stat-value">{cleaningBeds}</div>
            <div className="stat-label">En limpieza</div>
          </div>
        </div>
      </div>

      {/* ── Alerta ──────────────────────────────────────────────── */}
      {availableBeds < 3 && !isLoading && !error && (
        <div className="alert alert-warning" role="alert" aria-live="polite">
          <span className="alert-icon" aria-hidden="true"><FaExclamationCircle /></span>
          <span>
            Atención: quedan <strong>{availableBeds}</strong> cama
            {availableBeds !== 1 ? "s" : ""} disponible
            {availableBeds !== 1 ? "s" : ""} en <strong>{currentFloor?.label}</strong>.
          </span>
        </div>
      )}

      {/* ── Encabezado de sección ───────────────────────────────── */}
      <div className="beds-header">
        <h2 className="beds-section-title">Habitaciones del {currentFloor?.label}</h2>
        <span className="beds-count-badge">{floorRooms.length} habitaciones</span>
      </div>

      {isLoading && (
        <div className="rooms-loading" role="status">
          <FaSpinner className="rooms-spinner" aria-hidden="true" />
          <span>Cargando habitaciones...</span>
        </div>
      )}

      {error && !isLoading && (
        <div className="alert alert-error" role="alert">
          <span className="alert-icon" aria-hidden="true"><FaExclamationCircle /></span>
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && floorRooms.length === 0 && (
        <div className="rooms-empty">
          <div className="rooms-empty-icon" aria-hidden="true"><FaInbox /></div>
          <p className="rooms-empty-text">No hay habitaciones para este piso.</p>
        </div>
      )}

      {/* ── Grilla de habitaciones ──────────────────────────────── */}
      {!isLoading && !error && floorRooms.length > 0 && (
        <div
          className="rooms-grid"
          role="list"
          aria-label={`Habitaciones del ${currentFloor?.label}`}
        >
          {floorRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
