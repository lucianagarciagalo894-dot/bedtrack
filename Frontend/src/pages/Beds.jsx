import { useState } from "react";
import BedCard from "../components/BedCard";
import { FLOORS } from "../data/beds";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBroom,
  FaExclamationCircle,
} from "react-icons/fa";

export default function Beds({ role, beds, onChangeStatus }) {
  const [floor, setFloor] = useState("Piso 1");

  const filtered = beds.filter((bed) => bed.floor === floor);
  const available = filtered.filter((b) => b.status === "disponible").length;
  const occupied = filtered.filter((b) => b.status === "ocupada").length;
  const cleaning = filtered.filter((b) => b.status === "limpieza").length;

  return (
    <div className="page-wrapper">
      {/* Page heading */}
      <header className="page-header">
        <h1 className="page-title">Estado de Camas</h1>
        <p className="page-subtitle">
          Monitoreo en tiempo real &middot; {floor}
        </p>
      </header>

      {/* Floor selector */}
      <div className="floor-selector-wrap">
        <div className="floor-selector" role="group" aria-label="Selector de piso">
          {FLOORS.map((f) => (
            <button
              key={f}
              className={`floor-btn${floor === f ? " active" : ""}`}
              onClick={() => setFloor(f)}
              aria-pressed={floor === f}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" role="region" aria-label="Resumen de camas">
        <div className="stat-card">
          <div className="stat-icon success" aria-hidden="true">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <div className="stat-value">{available}</div>
            <div className="stat-label">Disponibles</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon error" aria-hidden="true">
            <FaTimesCircle />
          </div>
          <div className="stat-info">
            <div className="stat-value">{occupied}</div>
            <div className="stat-label">Ocupadas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon cleaning" aria-hidden="true">
            <FaBroom />
          </div>
          <div className="stat-info">
            <div className="stat-value">{cleaning}</div>
            <div className="stat-label">En limpieza</div>
          </div>
        </div>
      </div>

      {/* Low availability alert */}
      {available < 3 && (
        <div className="alert alert-warning" role="alert" aria-live="polite">
          <span className="alert-icon" aria-hidden="true">
            <FaExclamationCircle />
          </span>
          <span>
            Atención: quedan <strong>{available}</strong> cama
            {available !== 1 ? "s" : ""} disponible
            {available !== 1 ? "s" : ""} en <strong>{floor}</strong>.
            Se recomienda tomar medidas.
          </span>
        </div>
      )}

      {/* Bed grid */}
      <div className="beds-header">
        <h2 className="beds-section-title">Camas del {floor}</h2>
        <span className="beds-count-badge">{filtered.length} camas</span>
      </div>

      <div className="beds-grid" role="list" aria-label={`Camas del ${floor}`}>
        {filtered.map((bed) => (
          <BedCard
            key={bed.id}
            bed={bed}
            onChangeStatus={onChangeStatus}
            role={role}
          />
        ))}
      </div>
    </div>
  );
}
