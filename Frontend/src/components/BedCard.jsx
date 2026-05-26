import {
  FaBed,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const STATUS_CONFIG = {
  disponible: {
    cardClass: "status-available",
    badgeClass: "badge-available",
    btnClass: "btn-avail",
    label: "Disponible",
    Icon: FaCheckCircle,
  },
  ocupada: {
    cardClass: "status-occupied",
    badgeClass: "badge-occupied",
    btnClass: "btn-occup",
    label: "Ocupada",
    Icon: FaTimesCircle,
  },
  "no disponible": {
    cardClass: "status-unavailable",
    badgeClass: "badge-unavailable",
    btnClass: "btn-unavail",
    label: "No disponible",
    Icon: FaExclamationTriangle,
  },
};

export default function BedCard({ bed, onChangeStatus, role }) {
  const cfg = STATUS_CONFIG[bed.status] ?? STATUS_CONFIG["no disponible"];
  const { Icon } = cfg;

  const actions = [
    { key: "disponible", label: "Disponible", cls: "btn-avail" },
    { key: "ocupada", label: "Ocupada", cls: "btn-occup" },
    { key: "no disponible", label: "No disp.", cls: "btn-unavail" },
  ];

  return (
    <article
      className={`bed-card ${cfg.cardClass}`}
      aria-label={`Cama ${bed.id}, ${bed.floor}, estado: ${cfg.label}`}
    >
      {/* Header row */}
      <div className="bed-card-header">
        <div className="bed-icon-wrap" aria-hidden="true">
          <FaBed />
        </div>
        <span className={`bed-status-badge ${cfg.badgeClass}`}>
          <Icon size={9} aria-hidden="true" />
          {cfg.label}
        </span>
      </div>

      {/* Info */}
      <div className="bed-name">Cama {bed.id}</div>
      <div className="bed-floor-label">{bed.floor}</div>

      {/* Actions – enfermería only */}
      {role === "enfermeria" && (
        <div className="bed-actions" role="group" aria-label="Cambiar estado">
          {actions.map(({ key, label, cls }) => (
            <button
              key={key}
              className={`bed-action-btn ${cls}`}
              onClick={() => onChangeStatus(bed.id, key)}
              disabled={bed.status === key}
              aria-pressed={bed.status === key}
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
