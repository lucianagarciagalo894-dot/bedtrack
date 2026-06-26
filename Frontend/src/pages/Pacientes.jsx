import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUserInjured,
  FaSearch,
  FaBed,
  FaDoorOpen,
  FaBuilding,
  FaCalendarAlt,
  FaStethoscope,
  FaInbox,
} from "react-icons/fa";

export default function Pacientes({ rooms }) {
  const [search, setSearch] = useState("");

  const patients = useMemo(() => {
    const list = [];
    rooms.forEach((room) => {
      room.beds.forEach((bed) => {
        if (bed.status === "ocupada" && bed.patient) {
          list.push({
            ...bed.patient,
            bedId:      bed.id,
            bedNumber:  bed.number,
            roomId:     room.id,
            roomNumber: room.number,
            floor:      room.floor,
            floorId:    room.floorId,
            roomType:   room.type,
          });
        }
      });
    });
    return list;
  }, [rooms]);

  const filtered = useMemo(() => {
    if (!search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.apellido.toLowerCase().includes(q) ||
        p.diagnostico.toLowerCase().includes(q) ||
        p.floor.toLowerCase().includes(q)
    );
  }, [patients, search]);

  return (
    <div className="page-wrapper">

      {/* ── Encabezado ─────────────────────────────────────────── */}
      <header className="page-header">
        <h1 className="page-title">Pacientes Internados</h1>
        <p className="page-subtitle">
          {patients.length === 0
            ? "Sin internaciones activas"
            : `${patients.length} paciente${patients.length !== 1 ? "s" : ""} en internación activa`}
        </p>
      </header>

      {/* ── Buscador ────────────────────────────────────────────── */}
      {patients.length > 0 && (
        <div className="patients-search-wrap">
          <div className="patients-search">
            <FaSearch className="search-icon" aria-hidden="true" />
            <input
              id="search-patients"
              name="search-patients"
              type="search"
              className="search-input"
              placeholder="Buscar por nombre, diagnóstico o piso…"
              value={search}
              onChange={(ev) => setSearch(ev.target.value)}
              aria-label="Buscar paciente"
            />
          </div>
        </div>
      )}

      {/* ── Sin pacientes ───────────────────────────────────────── */}
      {patients.length === 0 && (
        <div className="rooms-empty">
          <div className="rooms-empty-icon" aria-hidden="true">
            <FaInbox />
          </div>
          <p className="rooms-empty-text">No hay pacientes internados actualmente.</p>
          <p className="rooms-empty-hint">
            Registrá un paciente desde la página de Habitaciones al ocupar una cama.
          </p>
        </div>
      )}

      {/* ── Sin resultados de búsqueda ──────────────────────────── */}
      {patients.length > 0 && filtered.length === 0 && (
        <div className="rooms-empty">
          <div className="rooms-empty-icon" aria-hidden="true">
            <FaSearch />
          </div>
          <p className="rooms-empty-text">Sin resultados para "{search}".</p>
          <p className="rooms-empty-hint">Probá con otro nombre, diagnóstico o piso.</p>
        </div>
      )}

      {/* ── Tabla de pacientes ──────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className="patients-table-wrap">
          <table className="patients-table" aria-label="Lista de pacientes internados">
            <thead>
              <tr>
                <th scope="col">Paciente</th>
                <th scope="col" className="col-center">Edad</th>
                <th scope="col">Diagnóstico</th>
                <th scope="col" className="col-center">Días est.</th>
                <th scope="col">Ingreso</th>
                <th scope="col" className="col-center">Piso</th>
                <th scope="col" className="col-center">Hab.</th>
                <th scope="col" className="col-center">Cama</th>
                <th scope="col" className="col-center sr-only">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={`${p.roomId}-${p.bedId}`}>
                  {/* Nombre */}
                  <td>
                    <div className="patient-row-name">
                      <div className="patient-avatar" aria-hidden="true">
                        {p.nombre[0]}{p.apellido[0]}
                      </div>
                      <div>
                        <div className="patient-fullname">
                          {p.nombre} {p.apellido}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Edad */}
                  <td className="col-center">
                    <span className="td-value">{p.edad}</span>
                    <span className="td-unit"> años</span>
                  </td>

                  {/* Diagnóstico */}
                  <td>
                    <div className="patient-diagnostico">
                      <FaStethoscope size={11} className="diag-icon" aria-hidden="true" />
                      {p.diagnostico}
                    </div>
                  </td>

                  {/* Días estimados */}
                  <td className="col-center">
                    <span className="td-value">{p.diasInternacion}</span>
                    <span className="td-unit"> d</span>
                  </td>

                  {/* Fecha de ingreso */}
                  <td>
                    <div className="patient-ingreso">
                      <FaCalendarAlt size={10} className="cal-icon" aria-hidden="true" />
                      {p.fechaIngreso ?? "—"}
                    </div>
                  </td>

                  {/* Piso */}
                  <td className="col-center">
                    <div className="location-chip">
                      <FaBuilding size={10} aria-hidden="true" />
                      {p.floor}
                    </div>
                  </td>

                  {/* Habitación */}
                  <td className="col-center">
                    <div className="location-chip">
                      <FaDoorOpen size={10} aria-hidden="true" />
                      {p.roomNumber}
                    </div>
                  </td>

                  {/* Cama */}
                  <td className="col-center">
                    <div className="location-chip location-chip-bed">
                      <FaBed size={10} aria-hidden="true" />
                      {p.bedNumber}
                    </div>
                  </td>

                  {/* Ir a habitación */}
                  <td className="col-center">
                    <Link
                      to={`/habitaciones/${p.roomId}`}
                      className="btn-go-room"
                      aria-label={`Ver habitación ${p.roomNumber}`}
                    >
                      Ver hab.
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
