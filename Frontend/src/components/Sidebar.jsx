import { NavLink } from "react-router-dom";
import {
  FaHospitalAlt,
  FaChartLine,
  FaBed,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

const navLinkClass = ({ isActive }) =>
  `nav-item${isActive ? " active" : ""}`;

export default function Sidebar({ role, onLogout, isOpen, onClose }) {
  const isEnfermeria = role === "enfermeria";
  const userName = isEnfermeria ? "Enfermería" : "Administrador";
  const userInitial = isEnfermeria ? "E" : "A";

  return (
    <aside
      className={`sidebar${isOpen ? " open" : ""}`}
      role="navigation"
      aria-label="Navegación principal"
    >
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon" aria-hidden="true">
          <FaHospitalAlt />
        </div>
        <span className="sidebar-brand-text">
          Bed<span>Track</span>
        </span>
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          <FaTimes />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav" aria-label="Menú principal">
        <span className="nav-section-label">Principal</span>

        <NavLink to="/dashboard" className={navLinkClass} onClick={onClose}>
          <span className="nav-item-icon" aria-hidden="true">
            <FaChartLine />
          </span>
          Dashboard
        </NavLink>

        <NavLink to="/camas" className={navLinkClass} onClick={onClose}>
          <span className="nav-item-icon" aria-hidden="true">
            <FaBed />
          </span>
          Camas
        </NavLink>

        <span className="nav-section-label" style={{ marginTop: "8px" }}>
          Sistema
        </span>

        <button className="nav-item">
          <span className="nav-item-icon" aria-hidden="true">
            <FaCog />
          </span>
          Configuración
        </button>
      </nav>

      {/* User / Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar" aria-hidden="true">
            {userInitial}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{userName}</div>
            <div className="sidebar-user-role">{role}</div>
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={onLogout}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </aside>
  );
}
