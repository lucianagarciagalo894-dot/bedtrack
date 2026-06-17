import { useState } from "react";
import BedCard from "../components/BedCard";
import PatientFormModal from "../components/PatientFormModal";
import { FLOORS } from "../data/beds";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBroom,
  FaExclamationCircle,
} from "react-icons/fa";

export default function Beds({ role, beds, onChangeStatus }) {
  const [floor, setFloor]           = useState("Piso 1");
  const [pendingBed, setPendingBed] = useState(null);

  const filtered  = beds.filter((b) => b.floor === floor);
  const available = filtered.filter((b) => b.status === "disponible").length;
  const occupied  = filtered.filter((b) => b.status === "ocupada").length;
  const cleaning  = filtered.filter((b) => b.status === "limpieza").length;

  // Intercepta "ocupada": muestra formulario de paciente primero
  const handleChangeStatus = (bedId, newStatus) => {
    if (newStatus === "ocupada") {
      const bed = beds.find((b) => b.id === bedId);
      setPendingBed(bed ?? { id: bedId, number: bedId });
    } else {
      onChangeStatus(bedId, newStatus, null);
    }
  };

  const handlePatientConfirm = (patientData) => {
    if (pendingBed) {
      onChangeStatus(pendingBed.id, "ocupada", patientData);
      setPendingBed(null);
    }
  };

  return (
    <div className="page-wrapper">

      {/* ── Encabezado ─────────────────────────────────────────── */}
      <header className="page-header">
        <h1 className="page-title">Estado de Camas</h1>
        <p className="page-subtitle">
          Monitoreo en tiempo real &middot; {floor}
        </p>
      </header>

      {/* ── Selector de piso ───────────────────────────────────── */}
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

      {/* ── Estadísticas ────────────────────────────────────────── */}
      <div className="stats-grid" role="region" aria-label="Resumen de camas">
        <div className="stat-card">
          <div className="stat-icon success" aria-hidden="true"><FaCheckCircle /></div>
          <div className="stat-info">
            <div className="stat-value">{available}</div>
            <div className="stat-label">Disponibles</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon error" aria-hidden="true"><FaTimesCircle /></div>
          <div className="stat-info">
            <div className="stat-value">{occupied}</div>
            <div className="stat-label">Ocupadas</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cleaning" aria-hidden="true"><FaBroom /></div>
          <div className="stat-info">
            <div className="stat-value">{cleaning}</div>
            <div className="stat-label">En limpieza</div>
          </div>
        </div>
      </div>

      {/* ── Alerta ──────────────────────────────────────────────── */}
      {available < 3 && (
        <div className="alert alert-warning" role="alert" aria-live="polite">
          <span className="alert-icon" aria-hidden="true"><FaExclamationCircle /></span>
          <span>
            Atención: quedan <strong>{available}</strong> cama
            {available !== 1 ? "s" : ""} disponible
            {available !== 1 ? "s" : ""} en <strong>{floor}</strong>.
            Se recomienda tomar medidas.
          </span>
        </div>
      )}

      {/* ── Grilla de camas ─────────────────────────────────────── */}
      <div className="beds-header">
        <h2 className="beds-section-title">Camas del {floor}</h2>
        <span className="beds-count-badge">{filtered.length} camas</span>
      </div>

      <div className="beds-grid" role="list" aria-label={`Camas del ${floor}`}>
        {filtered.map((bed) => (
          <BedCard
            key={bed.id}
            bed={bed}
            onChangeStatus={handleChangeStatus}
            role={role}
          />
        ))}
      </div>

      {/* ── Modal de registro de paciente ───────────────────────── */}
      {pendingBed && (
        <PatientFormModal
          bed={pendingBed}
          room={
            pendingBed.roomNumber
              ? { number: pendingBed.roomNumber, floor: pendingBed.floor }
              : null
          }
          onConfirm={handlePatientConfirm}
          onCancel={() => setPendingBed(null)}
        />
      )}
    </div>
  );
}
