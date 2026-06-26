import { useState } from "react";
import { FaHospitalAlt } from "react-icons/fa";

export default function Login({ onLogin }) {
  const [role, setRole] = useState("enfermeria");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const next = {};
    if (!email.includes("@gmail.com")) {
      next.email = "Ingresá un correo Gmail válido (ejemplo@gmail.com)";
    }
    if (password.length < 4) {
      next.password = "La contraseña debe tener al menos 4 caracteres";
    }
    return next;
  };

  const handleLogin = () => {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      onLogin(role);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const clearError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  return (
    <div className="login-page">
      {/* ── Left decorative panel (desktop only) ── */}
      <div className="login-left" aria-hidden="true">
        <div className="login-brand">
          <div className="login-brand-icon">
            <FaHospitalAlt />
          </div>
          <span className="login-brand-name">BedTrack</span>
        </div>

        <div className="login-hero">
          <h1 className="login-hero-title">
            Gestión online de{" "}
            <span>camas hospitalarias</span>
          </h1>
          <p className="login-hero-desc">
            Monitoreá en tiempo real la disponibilidad de camas en cada
            piso del hospital con total claridad.
          </p>
        </div>

        <div className="login-features">
          <div className="login-feature">
            <div className="login-feature-dot" />
            Estado en tiempo real por piso
          </div>
          <div className="login-feature">
            <div className="login-feature-dot" />
            Gestión diferenciada por rol
          </div>
          <div className="login-feature">
            <div className="login-feature-dot" />
            Alertas automáticas de ocupación
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="login-right">
        <main className="login-card" role="main">
          <div className="login-header">
            <div className="login-logo" aria-hidden="true">
              <FaHospitalAlt />
            </div>
            <h2 className="login-title">Bienvenido</h2>
            <p className="login-subtitle">Ingresá con tu cuenta institucional</p>
          </div>

          {/* Role */}
          <div className="form-group">
            <label className="form-label" htmlFor="role">
              Tipo de Usuario
            </label>
            <select
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="enfermeria">Enfermería</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input${errors.email ? " input-error" : ""}`}
              placeholder="ejemplo@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError("email");
              }}
              onKeyDown={handleKeyDown}
              autoComplete="email"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p id="email-error" className="form-error-msg" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-input${errors.password ? " input-error" : ""}`}
              placeholder="Mínimo 4 caracteres"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError("password");
              }}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p id="password-error" className="form-error-msg" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <button className="btn-primary" onClick={handleLogin}>
            Ingresar
          </button>
        </main>
      </div>
    </div>
  );
}
