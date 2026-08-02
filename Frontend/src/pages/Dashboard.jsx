import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FLOORS } from "../data/beds";
import {
  FaBed,
  FaCheckCircle,
  FaTimesCircle,
  FaBroom,
  FaArrowRight,
  FaExclamationCircle,
  FaHistory,
  FaUserNurse,
} from "react-icons/fa";
import { getGlobalAuditHistory } from "../services/roomService";

export default function Dashboard({ role, sessionHospital, beds }) {
  const userName = role === "enfermeria" ? "Enfermería" : "Administrador";
  const [recentLogs, setRecentLogs] = useState([]);

  const activeSucursalId = sessionHospital?.sucursalId || sessionHospital?.nosocomioId;

  useEffect(() => {
    getGlobalAuditHistory(activeSucursalId)
      .then((data) => setRecentLogs(data || []))
      .catch((err) => console.warn("Error obteniendo historial reciente:", err));
  }, [activeSucursalId]);

  const totalBeds = beds.length;
  const totalAvailable = beds.filter((b) => b.status?.toLowerCase() === "disponible").length;
  const totalOccupied = beds.filter((b) => b.status?.toLowerCase() === "ocupada").length;
  const totalCleaning = beds.filter((b) => b.status?.toLowerCase() === "enlimpieza").length;

  const uniqueFloors = Array.from(new Set(beds.map((b) => b.floor).filter(Boolean)));
  const floorList = (uniqueFloors.length > 0 && uniqueFloors.every(uf => !FLOORS.includes(uf)))
    ? uniqueFloors
    : FLOORS;

  const floorStats = floorList.map((floor) => {
    const fb = beds.filter((b) => b.floor === floor);
    return {
      floor,
      total: fb.length,
      available: fb.filter((b) => b.status?.toLowerCase() === "disponible").length,
      occupied: fb.filter((b) => b.status?.toLowerCase() === "ocupada").length,
      cleaning: fb.filter((b) => b.status?.toLowerCase() === "enlimpieza").length,
    };
  });

  const criticalFloors = floorStats.filter((f) => f.available < 3);

  return (
    <div className="page-wrapper">
      {/* Welcome header */}
      <div className="dashboard-welcome">
        <div>
          <h1 className="page-title">Bienvenido/a, {userName}</h1>
          <p className="page-subtitle">
            Resumen general &middot; {sessionHospital?.hospital || "Hospital Central"} (
            {sessionHospital?.sede || sessionHospital?.establecimiento || "Establecimiento Central"})
          </p>
        </div>
        <Link to="/camas" className="btn-go-beds">
          {role === "admin" ? "Ver camas" : "Gestionar camas"}
          <FaArrowRight size={13} />
        </Link>
      </div>

      {/* Critical alert */}
      {criticalFloors.length > 0 && (
        <div className="alert alert-warning" role="alert">
          <span className="alert-icon" aria-hidden="true">
            <FaExclamationCircle />
          </span>
          <span>
            <strong>
              {criticalFloors.map((f) => f.floor).join(", ")}
            </strong>{" "}
            {criticalFloors.length === 1 ? "tiene" : "tienen"} menos de 3 camas disponibles.
          </span>
        </div>
      )}

      {/* Global stats */}
      <div
        className="stats-grid stats-grid-4"
        role="region"
        aria-label="Estadísticas globales"
      >
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary" aria-hidden="true">
            <FaBed />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalBeds}</div>
            <div className="stat-label">Total de camas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success" aria-hidden="true">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalAvailable}</div>
            <div className="stat-label">Disponibles</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon error" aria-hidden="true">
            <FaTimesCircle />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalOccupied}</div>
            <div className="stat-label">Ocupadas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cleaning" aria-hidden="true">
            <FaBroom />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalCleaning}</div>
            <div className="stat-label">En limpieza</div>
          </div>
        </div>
      </div>

      {/* Floor breakdown */}
      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2 className="beds-section-title">Estado por piso</h2>
          <div className="floor-legend">
            <span className="legend-item">
              <span className="legend-dot legend-dot-success" />
              Disponible
            </span>
            <span className="legend-item">
              <span className="legend-dot legend-dot-error" />
              Ocupada
            </span>
            <span className="legend-item">
              <span className="legend-dot legend-dot-cleaning" />
              En limpieza
            </span>
          </div>
        </div>

        <div className="floor-breakdown">
          {floorStats.map(({ floor, total, available, occupied, cleaning }) => (
            <div key={floor} className="floor-row">
              <span className="floor-row-name">{floor}</span>

              <div className="floor-row-bars" aria-label={`${floor}: ${available} disponibles, ${occupied} ocupadas, ${cleaning} en limpieza`}>
                {available > 0 && (
                  <div
                    className="floor-bar floor-bar-available"
                    style={{ width: `${(available / total) * 100}%` }}
                    title={`${available} disponibles`}
                  />
                )}
                {occupied > 0 && (
                  <div
                    className="floor-bar floor-bar-occupied"
                    style={{ width: `${(occupied / total) * 100}%` }}
                    title={`${occupied} ocupadas`}
                  />
                )}
                {cleaning > 0 && (
                  <div
                    className="floor-bar floor-bar-cleaning"
                    style={{ width: `${(cleaning / total) * 100}%` }}
                    title={`${cleaning} en limpieza`}
                  />
                )}
              </div>

              <div className="floor-row-chips">
                <span className="floor-chip floor-chip-available">{available}</span>
                <span className="floor-chip floor-chip-occupied">{occupied}</span>
                <span className="floor-chip floor-chip-cleaning">{cleaning}</span>
              </div>

              <Link to="/camas" className="floor-row-link" aria-label={`Ver camas del ${floor}`}>
                Ver →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Historial Reciente de Enfermería */}
      <div className="dashboard-section" style={{ marginTop: "24px" }}>
        <div className="dashboard-section-header">
          <h2 className="beds-section-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FaHistory style={{ color: "#2563EB" }} /> Historial de Actividad de Enfermería
          </h2>
        </div>

        <div style={{ background: "var(--card-bg, #FFFFFF)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border, #E2E8F0)" }}>
          {recentLogs.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted, #64748B)" }}>
              Aún no hay registros de actividades registradas hoy.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {recentLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    background: "#F8FAFC",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <FaUserNurse style={{ color: "#2563EB", fontSize: "18px" }} />
                    <div>
                      <div style={{ fontWeight: "600", color: "#1E293B" }}>
                        {log.usuarioNombre}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748B" }}>
                        Hab #{log.habitacionNumero} - Cama #{log.camaNumero}: {log.accion}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "#94A3B8", whiteSpace: "nowrap" }}>
                    {log.fechaHora}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
