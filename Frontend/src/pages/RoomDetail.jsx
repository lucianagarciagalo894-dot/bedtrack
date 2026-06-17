import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PatientFormModal from "../components/PatientFormModal";
import { TYPE_CONFIG } from "../components/RoomCard";
import {
  FaArrowLeft,
  FaBed,
  FaCheckCircle,
  FaTimesCircle,
  FaBroom,
  FaUsers,
  FaUserEdit,
  FaUserCheck,
  FaExclamationCircle,
} from "react-icons/fa";

const STATUS_CONFIG = {
  disponible: { label: "Disponible",    cls: "room-status-available", Icon: FaCheckCircle },
  ocupada:    { label: "Ocupada",       cls: "room-status-occupied",  Icon: FaTimesCircle },
  limpieza:   { label: "En limpieza",   cls: "room-status-cleaning",  Icon: FaBroom       },
  parcial:    { label: "Parc. ocupada", cls: "room-status-partial",   Icon: FaUsers       },
};

const BED_TRANSITIONS = {
  disponible: ["ocupada", "limpieza"],
  ocupada:    ["disponible", "limpieza"],
  limpieza:   ["disponible", "ocupada"],
};

const BED_ACTION_CONFIG = {
  disponible: { label: "Disponible", cls: "rba-avail" },
  ocupada:    { label: "Ocupada",    cls: "rba-occup" },
  limpieza:   { label: "Limpieza",   cls: "rba-clean" },
};

function getRoomStatus(beds) {
  if (beds.every((b) => b.status === "disponible")) return "disponible";
  if (beds.every((b) => b.status === "ocupada"))    return "ocupada";
  if (beds.some((b)  => b.status === "limpieza"))   return "limpieza";
  return "parcial";
}

export default function RoomDetail({ rooms, role, onChangeBedStatus }) {
  const { roomId }                    = useParams();
  const navigate                      = useNavigate();
  const [modalState, setModalState]   = useState(null); // { bed, mode: "create"|"edit" }

  const room = rooms.find((r) => r.id === Number(roomId));

  if (!room) {
    return (
      <div className="page-wrapper">
        <div className="rooms-empty">
          <div className="rooms-empty-icon" aria-hidden="true">
            <FaExclamationCircle />
          </div>
          <p className="rooms-empty-text">Habitación no encontrada.</p>
          <button className="btn-back" onClick={() => navigate("/habitaciones")}>
            <FaArrowLeft size={13} aria-hidden="true" /> Volver a Habitaciones
          </button>
        </div>
      </div>
    );
  }

  const typeCfg    = TYPE_CONFIG[room.typeKey] ?? TYPE_CONFIG.privada;
  const roomStatus = getRoomStatus(room.beds);
  const statusCfg  = STATUS_CONFIG[roomStatus] ?? STATUS_CONFIG.disponible;
  const StatusIcon = statusCfg.Icon;
  const isNurse    = role === "enfermeria";

  const availCount  = room.beds.filter((b) => b.status === "disponible").length;
  const occupCount  = room.beds.filter((b) => b.status === "ocupada").length;
  const cleanCount  = room.beds.filter((b) => b.status === "limpieza").length;

  const handleBedAction = (bed, newStatus) => {
    if (newStatus === "ocupada") {
      setModalState({ bed, mode: "create" });
    } else {
      onChangeBedStatus(bed.id, newStatus, null);
    }
  };

  const handleEditPatient  = (bed) => setModalState({ bed, mode: "edit" });
  const handleDischarge    = (bed) => onChangeBedStatus(bed.id, "disponible", null);

  const handleModalConfirm = (patientData) => {
    if (modalState) {
      onChangeBedStatus(modalState.bed.id, "ocupada", patientData);
      setModalState(null);
    }
  };

  return (
    <div className="page-wrapper">

      {/* ── Volver ─────────────────────────────────────────────── */}
      <button
        className="btn-back"
        onClick={() => navigate("/habitaciones")}
        aria-label="Volver a Habitaciones"
      >
        <FaArrowLeft size={12} aria-hidden="true" />
        Habitaciones
      </button>

      {/* ── Encabezado de habitación ────────────────────────────── */}
      <div className="room-detail-header">
        <div className="room-detail-accent" style={{ background: typeCfg.color }} />
        <div className="room-detail-body">
          <div className="room-detail-top">
            <div>
              <h1 className="room-detail-title">Habitación {room.number}</h1>
              <p className="room-detail-subtitle">{room.floor} &middot; {room.type}</p>
            </div>
            <div className="room-detail-badges">
              <span
                className="room-type-badge room-type-badge-lg"
                style={{ color: typeCfg.color, background: typeCfg.bg }}
              >
                {typeCfg.label}
              </span>
              <span className={`room-card-status ${statusCfg.cls}`}>
                <StatusIcon size={11} aria-hidden="true" />
                {statusCfg.label}
              </span>
            </div>
          </div>

          <div className="room-detail-meta">
            <span>{room.beds.length} cama{room.beds.length !== 1 ? "s" : ""}</span>
            <span className="meta-sep">&middot;</span>
            <span className="meta-available">{availCount} disponible{availCount !== 1 ? "s" : ""}</span>
            {occupCount > 0 && (
              <>
                <span className="meta-sep">&middot;</span>
                <span className="meta-occupied">{occupCount} ocupada{occupCount !== 1 ? "s" : ""}</span>
              </>
            )}
            {cleanCount > 0 && (
              <>
                <span className="meta-sep">&middot;</span>
                <span className="meta-cleaning">{cleanCount} en limpieza</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Lista de camas ──────────────────────────────────────── */}
      <div className="room-detail-beds-section">
        <h2 className="beds-section-title">
          Camas de la habitación
        </h2>

        <div className="rd-beds-list">
          {room.beds.map((bed) => {
            const bedCfg  = STATUS_CONFIG[bed.status] ?? STATUS_CONFIG.disponible;
            const BedIcon = bedCfg.Icon;

            return (
              <div key={bed.id} className={`rd-bed-card rd-bed-${bed.status}`}>

                {/* Encabezado de cama */}
                <div className="rd-bed-header">
                  <div className="rd-bed-title">
                    <FaBed size={15} aria-hidden="true" />
                    <span>Cama {bed.number}</span>
                  </div>
                  <span className={`room-card-status ${bedCfg.cls}`}>
                    <BedIcon size={10} aria-hidden="true" />
                    {bedCfg.label}
                  </span>
                </div>

                {/* Tarjeta del paciente */}
                {bed.patient ? (
                  <div className="rd-patient-card">
                    <div className="rd-patient-header">
                      <div className="rd-patient-name">
                        {bed.patient.nombre} {bed.patient.apellido}
                        <span className="rd-patient-age"> · {bed.patient.edad} años</span>
                      </div>
                      {isNurse && (
                        <div className="rd-patient-actions">
                          <button
                            className="btn-patient-edit"
                            onClick={() => handleEditPatient(bed)}
                            aria-label="Editar datos del paciente"
                          >
                            <FaUserEdit size={12} aria-hidden="true" />
                            Editar
                          </button>
                          <button
                            className="btn-patient-discharge"
                            onClick={() => handleDischarge(bed)}
                            aria-label="Dar de alta al paciente"
                          >
                            <FaUserCheck size={12} aria-hidden="true" />
                            Dar de alta
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="rd-patient-details">
                      <div className="rd-detail-item">
                        <span className="rd-detail-label">Diagnóstico</span>
                        <span className="rd-detail-value">{bed.patient.diagnostico}</span>
                      </div>
                      <div className="rd-detail-item">
                        <span className="rd-detail-label">Días estimados</span>
                        <span className="rd-detail-value">
                          {bed.patient.diasInternacion} día{bed.patient.diasInternacion !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {bed.patient.fechaIngreso && (
                        <div className="rd-detail-item">
                          <span className="rd-detail-label">Fecha de ingreso</span>
                          <span className="rd-detail-value">{bed.patient.fechaIngreso}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : bed.status === "ocupada" ? (
                  <div className="rd-patient-empty">
                    Sin paciente registrado
                  </div>
                ) : null}

                {/* Botones de cambio de estado */}
                {isNurse && (
                  <div
                    className="rd-bed-actions"
                    role="group"
                    aria-label={`Cambiar estado cama ${bed.number}`}
                  >
                    {BED_TRANSITIONS[bed.status]?.map((target) => (
                      <button
                        key={target}
                        className={`room-bed-action-btn ${BED_ACTION_CONFIG[target].cls}`}
                        onClick={() => handleBedAction(bed, target)}
                      >
                        {BED_ACTION_CONFIG[target].label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modal de paciente ───────────────────────────────────── */}
      {modalState && (
        <PatientFormModal
          bed={modalState.bed}
          room={room}
          onConfirm={handleModalConfirm}
          onCancel={() => setModalState(null)}
          initialData={modalState.mode === "edit" ? modalState.bed.patient : null}
          isEditing={modalState.mode === "edit"}
        />
      )}
    </div>
  );
}
