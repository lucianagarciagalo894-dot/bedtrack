import { FaBed, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

export default function BedCard({ bed, onChangeStatus, role }) {

  const getStatusClass = () => {
    if (bed.status === "disponible") return "available";
    if (bed.status === "ocupada") return "occupied";
    return "unavailable";
  };

  const getBorderColor = () => {
    if (bed.status === "disponible") return "#22C55E";
    if (bed.status === "ocupada") return "#EF4444";
    return "#F59E0B";
  };

  const getIcon = () => {
    if (bed.status === "disponible") return <FaCheckCircle />;
    if (bed.status === "ocupada") return <FaTimesCircle />;
    return <FaExclamationTriangle />;
  };

  return (
    <div
      className="bed-card"
      style={{ borderLeft: `8px solid ${getBorderColor()}` }}
    >
      <FaBed size={30} />

      <h2>Cama {bed.id}</h2>

      <p className={getStatusClass()}>
        {getIcon()} {bed.status}
      </p>

      {/* SOLO ENFERMERÍA */}
      {role === "enfermeria" && (
        <div>
          <button
            className="btn-green"
            onClick={() => onChangeStatus(bed.id, "disponible")}
          >
            Disponible
          </button>

          <button
            className="btn-red"
            onClick={() => onChangeStatus(bed.id, "ocupada")}
          >
            Ocupada
          </button>

          <button
            className="btn-yellow"
            onClick={() => onChangeStatus(bed.id, "no disponible")}
          >
            No disponible
          </button>
        </div>
      )}
    </div>
  );
}