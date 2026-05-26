import {
  FaBed,
  FaCheckCircle,
  FaTimesCircle,
  FaBroom,
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
  limpieza: {
    cardClass: "status-cleaning",
    badgeClass: "badge-cleaning",
    btnClass: "btn-clean",
    label: "En limpieza",
    Icon: FaBroom,
  },
};

const TRANSITIONS = {
  disponible: ["ocupada", "limpieza"],
  ocupada:    ["limpieza"],
  limpieza:   ["disponible", "ocupada"],
};

const ALL_ACTIONS = [
  { key: "disponible", label: "Disponible", cls: "btn-avail"  },
  { key: "ocupada",    label: "Ocupada",    cls: "btn-occup"  },
  { key: "limpieza",   label: "Limpieza",   cls: "btn-clean"  },
];

export default function BedCard({ bed, onChangeStatus, role }) {
  const cfg = STATUS_CONFIG[bed.status] ?? STATUS_CONFIG["limpieza"];
  const { Icon } = cfg;

  const actions = ALL_ACTIONS.filter(({ key }) =>
    TRANSITIONS[bed.status]?.includes(key)
  );

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
