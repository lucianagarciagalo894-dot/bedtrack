import { FaBed, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";

export default function BedCard({ bed, onChangeStatus, role }) {

  const getStatusClass = () => {
    if (bed.estado === "Disponible") return "available";
    if (bed.estado === "Ocupada") return "occupied";
    return "unavailable";
  };

  const getBorderColor = () => {
    if (bed.estado === "Disponible") return "#22C55E";
    if (bed.estado === "Ocupada") return "#EF4444";
    return "#F59E0B";
  };

  const getIcon = () => {
    if (bed.estado === "Disponible") return <FaCheckCircle />;
    if (bed.estado === "Ocupada") return <FaTimesCircle />;
    return <FaExclamationTriangle />;
  };

  return (
    <div
      className="bed-card"
      style={{ borderLeft: `8px solid ${getBorderColor()}` }}
    >
      <FaBed size={30} />

      {/* Usamos el Número de cama real que viene de la base de datos */}
      <h2>{bed.numero}</h2>

      <p className={getStatusClass()}>
        {getIcon()} {bed.estado}
      </p>

      {/* SOLO ENFERMERÍA */}
      {role === "enfermeria" && (
        <div>
          <button
            className="btn-green"
            onClick={() => onChangeStatus(bed.id, "habilitar")}
          >
            Disponible
          </button>

          <button
            className="btn-red"
            onClick={() => onChangeStatus(bed.id, "ocupar")}
          >
            Ocupada
          </button>

          <button
            className="btn-yellow"
            onClick={() => onChangeStatus(bed.id, "limpieza")}
          >
            A Limpieza
          </button>
        </div>
      )}
    </div>
  );
}