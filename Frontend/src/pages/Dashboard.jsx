import { Link } from "react-router-dom";
import { FLOORS } from "../data/beds";
import {
  FaBed,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaExclamationCircle,
} from "react-icons/fa";

export default function Dashboard({ role, beds }) {
  const userName = role === "enfermeria" ? "Enfermería" : "Administrador";

  const totalBeds = beds.length;
  const totalAvailable = beds.filter((b) => b.status === "disponible").length;
  const totalOccupied = beds.filter((b) => b.status === "ocupada").length;
  const totalUnavailable = beds.filter((b) => b.status === "no disponible").length;

  const floorStats = FLOORS.map((floor) => {
    const fb = beds.filter((b) => b.floor === floor);
    return {
      floor,
      total: fb.length,
      available: fb.filter((b) => b.status === "disponible").length,
      occupied: fb.filter((b) => b.status === "ocupada").length,
      unavailable: fb.filter((b) => b.status === "no disponible").length,
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
            Resumen general del sistema &middot; Todos los pisos
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
          <div className="stat-icon warning" aria-hidden="true">
            <FaExclamationTriangle />
          </div>
          <div className="stat-info">
            <div className="stat-value">{totalUnavailable}</div>
            <div className="stat-label">No disponibles</div>
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
              <span className="legend-dot legend-dot-warning" />
              No disponible
            </span>
          </div>
        </div>

        <div className="floor-breakdown">
          {floorStats.map(({ floor, total, available, occupied, unavailable }) => (
            <div key={floor} className="floor-row">
              <span className="floor-row-name">{floor}</span>

              <div className="floor-row-bars" aria-label={`${floor}: ${available} disponibles, ${occupied} ocupadas, ${unavailable} no disponibles`}>
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
                {unavailable > 0 && (
                  <div
                    className="floor-bar floor-bar-unavailable"
                    style={{ width: `${(unavailable / total) * 100}%` }}
                    title={`${unavailable} no disponibles`}
                  />
                )}
              </div>

              <div className="floor-row-chips">
                <span className="floor-chip floor-chip-available">{available}</span>
                <span className="floor-chip floor-chip-occupied">{occupied}</span>
                <span className="floor-chip floor-chip-unavailable">{unavailable}</span>
              </div>

              <Link to="/camas" className="floor-row-link" aria-label={`Ver camas del ${floor}`}>
                Ver →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
