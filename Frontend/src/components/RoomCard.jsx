import { useNavigate } from "react-router-dom";
import { FaBed, FaCheckCircle, FaTimesCircle, FaBroom, FaUsers, FaChevronRight } from "react-icons/fa";

export const TYPE_CONFIG = {
  privada:     { label: "Privada",           color: "#2563EB", bg: "#EFF6FF" },
  compartida:  { label: "Compartida",         color: "#7C3AED", bg: "#F5F3FF" },
  intensiva:   { label: "Terapia Intensiva",  color: "#EF4444", bg: "#FEF2F2" },
  aislamiento: { label: "Aislamiento",        color: "#F59E0B", bg: "#FFFBEB" },
};

const STATUS_CONFIG = {
  disponible: { label: "Disponible",    cls: "room-status-available", Icon: FaCheckCircle },
  ocupada:    { label: "Ocupada",       cls: "room-status-occupied",  Icon: FaTimesCircle },
  limpieza:   { label: "En limpieza",   cls: "room-status-cleaning",  Icon: FaBroom       },
  parcial:    { label: "Parc. ocupada", cls: "room-status-partial",   Icon: FaUsers       },
};

function getRoomStatus(beds) {
  if (beds.every((b) => b.status === "disponible")) return "disponible";
  if (beds.every((b) => b.status === "ocupada"))    return "ocupada";
  if (beds.some((b)  => b.status === "limpieza"))   return "limpieza";
  return "parcial";
}

export default function RoomCard({ room }) {
  const navigate   = useNavigate();
  const typeCfg    = TYPE_CONFIG[room.typeKey] ?? TYPE_CONFIG.privada;
  const roomStatus = getRoomStatus(room.beds);
  const statusCfg  = STATUS_CONFIG[roomStatus] ?? STATUS_CONFIG.disponible;
  const { Icon }   = statusCfg;

  const handleClick = () => navigate(`/habitaciones/${room.id}`);
  const handleKey   = (ev) => { if (ev.key === "Enter" || ev.key === " ") handleClick(); };

  return (
    <article
      className="room-card room-card-clickable"
      onClick={handleClick}
      onKeyDown={handleKey}
      role="button"
      tabIndex={0}
      aria-label={`Ver habitación ${room.number}, ${room.floor}, ${room.type}`}
    >
      {/* Barra de color por tipo */}
      <div className="room-card-accent" style={{ background: typeCfg.color }} />

      {/* Encabezado */}
      <div className="room-card-header">
        <span className="room-card-number">Hab. {room.number}</span>
        <span
          className="room-type-badge"
          style={{ color: typeCfg.color, background: typeCfg.bg }}
        >
          {typeCfg.label}
        </span>
      </div>

      <div className="room-card-floor">{room.floor}</div>

      {/* Estado general */}
      <div className={`room-card-status ${statusCfg.cls}`}>
        <Icon size={11} aria-hidden="true" />
        {statusCfg.label}
      </div>

      <div className="room-card-divider" />

      {/* Resumen de camas (sin botones) */}
      <div className="room-card-beds">
        {room.beds.map((bed) => (
          <div key={bed.id} className={`room-bed-item room-bed-${bed.status}`}>
            <div className="room-bed-row">
              <FaBed size={11} className="room-bed-icon" aria-hidden="true" />
              <span className="room-bed-label">
                Cama {bed.number}
                {bed.patient && (
                  <span className="room-bed-patient-name">
                    {" "}· {bed.patient.nombre} {bed.patient.apellido}
                  </span>
                )}
              </span>
              <span
                className={`room-bed-dot room-bed-dot-${bed.status}`}
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer de navegación */}
      <div className="room-card-footer">
        <span>Ver detalles</span>
        <FaChevronRight size={10} aria-hidden="true" />
      </div>
    </article>
  );
}
