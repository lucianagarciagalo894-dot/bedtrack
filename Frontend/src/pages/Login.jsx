import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { FaHospitalAlt, FaBuilding, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { getNosocomios, validateStaffLogin } from "../services/superAdminService";

export default function Login({ onLogin }) {
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const targetCode = params.hospitalCode || queryParams.get("hospital") || queryParams.get("nosocomio") || "";

  const [role, setRole] = useState("enfermeria");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nosocomios, setNosocomios] = useState([]);
  const [selectedNosocomioId, setSelectedNosocomioId] = useState("");
  const [selectedSucursalId, setSelectedSucursalId] = useState("");
  const [isDedicatedUrl, setIsDedicatedUrl] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getNosocomios()
      .then((data) => {
        const list = data || [];
        setNosocomios(list);

        if (list.length > 0) {
          let matched = null;
          if (targetCode) {
            matched = list.find(
              (n) => n.codigo?.toLowerCase() === targetCode.toLowerCase() || n.id.toString() === targetCode
            );
          }

          if (matched) {
            setSelectedNosocomioId(matched.id.toString());
            setIsDedicatedUrl(true);
            if (matched.sucursales && matched.sucursales.length > 0) {
              setSelectedSucursalId(matched.sucursales[0].id.toString());
            }
          } else {
            setSelectedNosocomioId(list[0].id.toString());
            if (list[0].sucursales && list[0].sucursales.length > 0) {
              setSelectedSucursalId(list[0].sucursales[0].id.toString());
            }
          }
        }
      })
      .catch((err) => console.warn("Error cargando nosocomios en login", err));
  }, [targetCode]);

  const currentNosocomio = nosocomios.find((n) => n.id.toString() === selectedNosocomioId);
  const sucursalesList = currentNosocomio?.sucursales || [];

  const handleNosocomioChange = (e) => {
    const id = e.target.value;
    setSelectedNosocomioId(id);
    const nos = nosocomios.find((n) => n.id.toString() === id);
    if (nos && nos.sucursales && nos.sucursales.length > 0) {
      setSelectedSucursalId(nos.sucursales[0].id.toString());
    } else {
      setSelectedSucursalId("");
    }
  };

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

  const handleLogin = async () => {
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      try {
        const loginRes = await validateStaffLogin(email, password, role, selectedNosocomioId, selectedSucursalId);
        const selectedHospital = currentNosocomio?.nombre || "Hospital Central";
        const selectedEstablecimiento =
          sucursalesList.find((s) => s.id.toString() === selectedSucursalId)?.nombre || "Establecimiento Central";

        const userName = loginRes?.user?.nombre || (email ? email.split("@")[0] : (role === "enfermeria" ? "Enfermero/a" : "Encargado"));

        onLogin(role, {
          hospital: selectedHospital,
          sede: selectedEstablecimiento,
          establecimiento: selectedEstablecimiento,
          nosocomioId: selectedNosocomioId,
          sucursalId: selectedSucursalId,
          email: email,
          userName: userName,
          userNombre: userName,
          role: role,
        });
      } catch (err) {
        setErrors({ api: err.message || "Error al autenticar usuario del personal" });
      }
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
            Acceso institucional por Hospital y Establecimiento
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

          {errors.api && (
            <div
              className="login-error-banner"
              role="alert"
              style={{
                background: "#FEF2F2",
                border: "1px solid #FCA5A5",
                color: "#991B1B",
                padding: "10px 14px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "0.875rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaExclamationCircle />
              {errors.api}
            </div>
          )}

          {/* Insignia de bienvenida si se ingresa vía URL dedicada */}
          {isDedicatedUrl && currentNosocomio ? (
            <div
              style={{
                background: "#EFF6FF",
                border: "1px solid #BFDBFE",
                padding: "12px 14px",
                borderRadius: "10px",
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <FaCheckCircle style={{ color: "#2563EB", fontSize: "18px" }} />
              <div>
                <div style={{ fontWeight: "700", color: "#1E40AF", fontSize: "0.875rem" }}>
                  {currentNosocomio.nombre}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#3B82F6" }}>
                  Establecimiento: {sucursalesList[0]?.nombre || "Establecimiento Central"}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Hospital / Nosocomio Selection */}
              {nosocomios.length > 0 && (
                <div className="form-group">
                  <label className="form-label" htmlFor="hospital-select">
                    Hospital / Institución
                  </label>
                  <select
                    id="hospital-select"
                    className="form-select"
                    value={selectedNosocomioId}
                    onChange={handleNosocomioChange}
                  >
                    {nosocomios.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.nombre} ({n.codigo || `ID: ${n.id}`})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Establecimiento Selection */}
              {sucursalesList.length > 0 && (
                <div className="form-group">
                  <label className="form-label" htmlFor="sucursal-select">
                    Establecimiento
                  </label>
                  <select
                    id="sucursal-select"
                    className="form-select"
                    value={selectedSucursalId}
                    onChange={(e) => setSelectedSucursalId(e.target.value)}
                  >
                    {sucursalesList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre} - {s.direccion}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {/* Role (Solo Enfermero y Encargado) */}
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
              <option value="enfermeria">Enfermería / Enfermero</option>
              <option value="encargado">Encargado de Hospital</option>
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
