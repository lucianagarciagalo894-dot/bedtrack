import { FaBed, FaCheckCircle, FaTimesCircle, FaBroom, FaHistory } from "react-icons/fa";

const STATUS_CONFIG = {
  disponible: { cardClass: "status-available", badgeClass: "badge-available", label: "Disponible", Icon: FaCheckCircle },
  ocupada:    { cardClass: "status-occupied",  badgeClass: "badge-occupied",  label: "Ocupada",    Icon: FaTimesCircle },
  enlimpieza:   { cardClass: "status-cleaning",  badgeClass: "badge-cleaning",  label: "En limpieza",Icon: FaBroom       },
};

const TRANSITIONS = {
  disponible: ["ocupada", "enlimpieza"],
  ocupada:    ["enlimpieza"],
  enlimpieza:   ["disponible", "ocupada"],
};

const ALL_ACTIONS = [
  { key: "disponible", label: "Disponible", cls: "btn-avail" },
  { key: "ocupada",    label: "Ocupada",    cls: "btn-occup" },
  { key: "enlimpieza",   label: "Limpieza",   cls: "btn-clean" },
];

export default function BedCard({ bed, onChangeStatus, role, onViewHistory }) {
  const statusKey = bed.status?.toLowerCase();
  const cfg    = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.enlimpieza;
  const { Icon } = cfg;
  const actions  = ALL_ACTIONS.filter(({ key }) => TRANSITIONS[statusKey]?.includes(key));
  const bedNum   = bed.number ?? bed.numero ?? (typeof bed.id === "number" && bed.id < 10000 ? bed.id : 1);

  return (
    <article
      className={`bed-card ${cfg.cardClass}`}
      aria-label={`Cama ${bedNum}, ${bed.floor}, estado: ${cfg.label}`}
    >
      {/* Header */}
      <div className="bed-card-header">
        <div className="bed-icon-wrap" aria-hidden="true">
          <FaBed />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {onViewHistory && (
            <button
              onClick={() => onViewHistory(bed)}
              title="Ver historial de cambios"
              aria-label={`Ver historial de Cama ${bedNum}`}
              style={{
                background: "#F1F5F9",
                border: "none",
                borderRadius: "6px",
                padding: "4px 8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.75rem",
                color: "#2563EB",
                fontWeight: "600",
              }}
            >
              <FaHistory size={11} />
              Historial
            </button>
          )}
          <span className={`bed-status-badge ${cfg.badgeClass}`}>
            <Icon size={9} aria-hidden="true" />
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="bed-name">Cama {bedNum}</div>

      {/* Habitación a la que pertenece */}
      {bed.roomNumber != null && (
        <div className="bed-room-label">Habitación {bed.roomNumber}</div>
      )}

      {/* Paciente (si está ocupada) */}
      {bed.patient && (
        <div className="bed-patient-info">
          {bed.patient.nombre} {bed.patient.apellido}
        </div>
      )}

      <div className="bed-floor-label">{bed.floor}</div>

      {/* Acciones – solo enfermería */}
      {role === "enfermeria" && (
        <div className="bed-actions" role="group" aria-label="Cambiar estado">
          {actions.map(({ key, label, cls }) => (
            <button
              key={key}
              className={`bed-action-btn ${cls}`}
              onClick={() => onChangeStatus(bed.id, key)}
              aria-label={`Marcar como ${label}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

