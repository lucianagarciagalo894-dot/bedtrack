import { useState, useEffect } from "react";
import { FaHistory, FaTimes, FaUserNurse, FaSearch, FaExchangeAlt } from "react-icons/fa";
import { getBedHistory } from "../services/roomService";

export default function BedHistoryModal({ bed, room, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const bedId = bed?.id;
  const bedNumber = bed?.number ?? bed?.numero ?? bedId;
  const roomNumber = room?.number ?? bed?.roomNumber ?? "-";

  useEffect(() => {
    if (!bedId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getBedHistory(bedId)
      .then((data) => {
        if (isMounted) {
          setLogs(data || []);
        }
      })
      .catch((err) => console.error("Error al cargar historial de cama:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [bedId]);

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchesUser = log.usuarioNombre && log.usuarioNombre.toLowerCase().includes(query);
    const matchesEmail = log.usuarioEmail && log.usuarioEmail.toLowerCase().includes(query);
    const matchesAction = log.accion && log.accion.toLowerCase().includes(query);
    const matchesRole = log.usuarioRol && log.usuarioRol.toLowerCase().includes(query);
    return matchesUser || matchesEmail || matchesAction || matchesRole;
  });

  const getRoleBadgeStyle = (roleStr) => {
    const role = (roleStr || "enfermeria").toLowerCase();
    if (role.includes("superadmin") || role.includes("developer") || role.includes("desarrollador")) {
      return { background: "#EDE9FE", color: "#6D28D9", label: roleStr || "Desarrollador" };
    }
    if (role.includes("encargado") || role.includes("admin")) {
      return { background: "#FEF3C7", color: "#D97706", label: roleStr || "Encargado" };
    }
    return { background: "#DBEAFE", color: "#1D4ED8", label: roleStr || "Enfermería" };
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="modal-container"
        style={{
          background: "var(--card-bg, #FFFFFF)",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "620px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid var(--border, #E2E8F0)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid var(--border, #E2E8F0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#F8FAFC",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                background: "#DBEAFE",
                color: "#2563EB",
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              <FaHistory />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "#0F172A" }}>
                Historial de Cama #{bedNumber}
              </h3>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748B" }}>
                Habitación {roomNumber} &middot; Trazabilidad de cambios
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "#64748B",
              padding: "4px 8px",
              borderRadius: "6px",
            }}
            aria-label="Cerrar modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Filter bar */}
        <div style={{ padding: "12px 24px", borderBottom: "1px solid #E2E8F0", background: "#FFFFFF" }}>
          <div style={{ position: "relative" }}>
            <FaSearch
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94A3B8",
                fontSize: "14px",
              }}
            />
            <input
              type="text"
              placeholder="Buscar por usuario, rol o cambio realizado..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                borderRadius: "8px",
                border: "1px solid #CBD5E1",
                fontSize: "0.85rem",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Content list */}
        <div style={{ padding: "16px 24px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "32px", color: "#64748B", fontSize: "0.9rem" }}>
              Cargando historial de la cama...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px", color: "#64748B", fontSize: "0.875rem" }}>
              {searchQuery ? "No se encontraron eventos que coincidan con la búsqueda." : "No hay registros de cambios para esta cama aún."}
            </div>
          ) : (
            filteredLogs.map((log) => {
              const roleBadge = getRoleBadgeStyle(log.usuarioRol);
              return (
                <div
                  key={log.id || Math.random()}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "1px solid #E2E8F0",
                    background: "#F8FAFC",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FaUserNurse style={{ color: "#2563EB", fontSize: "16px" }} />
                      <span style={{ fontWeight: "600", fontSize: "0.875rem", color: "#1E293B" }}>
                        {log.usuarioNombre || "Usuario del Sistema"}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          background: roleBadge.background,
                          color: roleBadge.color,
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {roleBadge.label}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                      {log.fechaHora || "Recientemente"}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.825rem", color: "#334155", fontWeight: "500" }}>
                    {log.accion}
                  </div>

                  {log.usuarioEmail && (
                    <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                      📧 {log.usuarioEmail}
                    </div>
                  )}

                  {(log.estadoAnterior || log.estadoNuevo) && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "0.75rem",
                        marginTop: "4px",
                        color: "#475569",
                      }}
                    >
                      <span style={{ textTransform: "capitalize", background: "#E2E8F0", padding: "2px 6px", borderRadius: "4px" }}>
                        {log.estadoAnterior || "nuevo"}
                      </span>
                      <FaExchangeAlt style={{ fontSize: "10px", color: "#94A3B8" }} />
                      <span style={{ textTransform: "capitalize", background: "#DBEAFE", color: "#1D4ED8", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>
                        {log.estadoNuevo || "disponible"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 24px", borderTop: "1px solid #E2E8F0", textAlign: "right", background: "#F8FAFC" }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #CBD5E1",
              background: "#FFFFFF",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "600",
              color: "#334155",
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
