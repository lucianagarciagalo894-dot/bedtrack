import { useEffect, useState } from "react";
import { FaTimes, FaUserPlus, FaUserEdit, FaExclamationCircle } from "react-icons/fa";

const EMPTY = {
  nombre:          "",
  apellido:        "",
  edad:            "",
  diagnostico:     "",
  diasInternacion: "",
};

function toForm(data) {
  if (!data) return EMPTY;
  return {
    nombre:          data.nombre          ?? "",
    apellido:        data.apellido        ?? "",
    edad:            String(data.edad     ?? ""),
    diagnostico:     data.diagnostico     ?? "",
    diasInternacion: String(data.diasInternacion ?? ""),
  };
}

function validate(form) {
  const errs = {};
  if (!form.nombre.trim())   errs.nombre   = "El nombre es requerido";
  if (!form.apellido.trim()) errs.apellido = "El apellido es requerido";
  const age = Number(form.edad);
  if (!form.edad || isNaN(age) || age < 0 || age > 130)
    errs.edad = "Ingresá una edad válida (0 – 130)";
  if (!form.diagnostico.trim()) errs.diagnostico = "El diagnóstico es requerido";
  const dias = Number(form.diasInternacion);
  if (!form.diasInternacion || isNaN(dias) || dias < 1)
    errs.diasInternacion = "Ingresá un período válido (mín. 1 día)";
  return errs;
}

export default function PatientFormModal({
  bed,
  room,
  onConfirm,
  onCancel,
  initialData = null,
  isEditing   = false,
}) {
  const [form, setForm]     = useState(() => toForm(initialData));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const onKey = (ev) => { if (ev.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onConfirm({
      nombre:          form.nombre.trim(),
      apellido:        form.apellido.trim(),
      edad:            Number(form.edad),
      diagnostico:     form.diagnostico.trim(),
      diasInternacion: Number(form.diasInternacion),
      fechaIngreso:
        isEditing && initialData?.fechaIngreso
          ? initialData.fechaIngreso
          : new Date().toISOString().split("T")[0],
    });
  };

  const handleOverlayClick = (ev) => {
    if (ev.target === ev.currentTarget) onCancel();
  };

  const TitleIcon = isEditing ? FaUserEdit : FaUserPlus;
  const titleText = isEditing ? "Editar Paciente" : "Registrar Paciente";
  const btnText   = isEditing ? "Guardar cambios" : "Confirmar ingreso";

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleOverlayClick}
    >
      <div className="modal-card">

        {/* ── Encabezado ────────────────────────────────────── */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-title-icon" aria-hidden="true">
              <TitleIcon />
            </div>
            <div>
              <h2 id="modal-title" className="modal-title">{titleText}</h2>
              <p className="modal-subtitle">
                Cama {bed.number ?? bed.id}
                {room && <> &middot; Hab.&nbsp;{room.number} &middot; {room.floor}</>}
              </p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={onCancel}
            aria-label="Cerrar formulario"
          >
            <FaTimes />
          </button>
        </div>

        {/* ── Formulario ────────────────────────────────────── */}
        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          <div className="modal-fields">

            {/* Nombre */}
            <div className="form-group">
              <label className="form-label" htmlFor="pm-nombre">
                Nombre <span className="form-required" aria-hidden="true">*</span>
              </label>
              <input
                id="pm-nombre"
                name="nombre"
                className={`form-input${errors.nombre ? " input-error" : ""}`}
                placeholder="Ej: Juan"
                value={form.nombre}
                onChange={handleChange}
                autoFocus
                autoComplete="given-name"
              />
              {errors.nombre && (
                <span className="form-error-msg" role="alert">
                  <FaExclamationCircle aria-hidden="true" /> {errors.nombre}
                </span>
              )}
            </div>

            {/* Apellido */}
            <div className="form-group">
              <label className="form-label" htmlFor="pm-apellido">
                Apellido <span className="form-required" aria-hidden="true">*</span>
              </label>
              <input
                id="pm-apellido"
                name="apellido"
                className={`form-input${errors.apellido ? " input-error" : ""}`}
                placeholder="Ej: García"
                value={form.apellido}
                onChange={handleChange}
                autoComplete="family-name"
              />
              {errors.apellido && (
                <span className="form-error-msg" role="alert">
                  <FaExclamationCircle aria-hidden="true" /> {errors.apellido}
                </span>
              )}
            </div>

            {/* Edad */}
            <div className="form-group">
              <label className="form-label" htmlFor="pm-edad">
                Edad <span className="form-required" aria-hidden="true">*</span>
              </label>
              <div className="input-with-unit">
                <input
                  id="pm-edad"
                  name="edad"
                  type="number"
                  min="0"
                  max="130"
                  className={`form-input${errors.edad ? " input-error" : ""}`}
                  placeholder="45"
                  value={form.edad}
                  onChange={handleChange}
                />
                <span className="input-unit">años</span>
              </div>
              {errors.edad && (
                <span className="form-error-msg" role="alert">
                  <FaExclamationCircle aria-hidden="true" /> {errors.edad}
                </span>
              )}
            </div>

            {/* Días aproximados de internación */}
            <div className="form-group">
              <label className="form-label" htmlFor="pm-dias">
                Días aprox. de internación <span className="form-required" aria-hidden="true">*</span>
              </label>
              <div className="input-with-unit">
                <input
                  id="pm-dias"
                  name="diasInternacion"
                  type="number"
                  min="1"
                  className={`form-input${errors.diasInternacion ? " input-error" : ""}`}
                  placeholder="7"
                  value={form.diasInternacion}
                  onChange={handleChange}
                />
                <span className="input-unit">días</span>
              </div>
              {errors.diasInternacion && (
                <span className="form-error-msg" role="alert">
                  <FaExclamationCircle aria-hidden="true" /> {errors.diasInternacion}
                </span>
              )}
            </div>

            {/* Diagnóstico – ancho completo */}
            <div className="form-group form-group-full">
              <label className="form-label" htmlFor="pm-diagnostico">
                Diagnóstico <span className="form-required" aria-hidden="true">*</span>
              </label>
              <input
                id="pm-diagnostico"
                name="diagnostico"
                className={`form-input${errors.diagnostico ? " input-error" : ""}`}
                placeholder="Ej: Neumonía bilateral, fractura de cadera…"
                value={form.diagnostico}
                onChange={handleChange}
              />
              {errors.diagnostico && (
                <span className="form-error-msg" role="alert">
                  <FaExclamationCircle aria-hidden="true" /> {errors.diagnostico}
                </span>
              )}
            </div>

          </div>

          {/* ── Acciones ──────────────────────────────────────── */}
          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-confirm">
              <TitleIcon size={13} aria-hidden="true" />
              {btnText}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
