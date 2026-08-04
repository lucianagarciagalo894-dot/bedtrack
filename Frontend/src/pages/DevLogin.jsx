import { useState } from "react";
import { FaCode, FaKey, FaUserShield, FaHospitalAlt, FaArrowLeft } from "react-icons/fa";
import { loginDev } from "../services/superAdminService";

export default function DevLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [devKey, setDevKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDevLogin = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg("");

    if (!email) {
      setErrorMsg("Por favor ingrese su correo de desarrollador.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginDev(email, devKey);
      if (res && (res.success || res.role === "superadmin")) {
        onLogin("superadmin");
      } else {
        setErrorMsg(res?.message || "Credenciales de desarrollador inválidas");
      }
    } catch (err) {
      setErrorMsg(err.message || "Error al autenticar desarrollador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dev-login-page">
      <div className="dev-login-container">
        <a href="/" className="dev-back-link">
          <FaArrowLeft /> Volver al portal regular
        </a>

        <div className="dev-login-header">
          <div className="dev-badge">
            <FaCode /> Portal de Desarrollador
          </div>
          <h2>Acceso al Panel de Desarrollador</h2>
          <p>
            Plataforma reservada exclusivamente para el equipo de desarrollo de BedTrack.
          </p>
        </div>

        <form className="dev-login-card" onSubmit={handleDevLogin}>
          {errorMsg && <div className="dev-error-alert" role="alert">{errorMsg}</div>}

          <div className="dev-form-group">
            <label htmlFor="dev-email">
              <FaUserShield /> Correo de Desarrollador
            </label>
            <input
              id="dev-email"
              type="email"
              placeholder="desarrollador@bedtrack.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="dev-form-group">
            <label htmlFor="dev-key">
              <FaKey /> Clave Master / Dev Key
            </label>
            <input
              id="dev-key"
              type="password"
              placeholder="••••••••••••"
              value={devKey}
              onChange={(e) => setDevKey(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="dev-submit-btn" disabled={loading}>
            {loading ? "Autenticando..." : "Ingresar como Desarrollador"}
          </button>
        </form>

        <div className="dev-login-footer">
          <FaHospitalAlt /> BedTrack Developer Infrastructure &copy; 2026
        </div>
      </div>
    </div>
  );
}
