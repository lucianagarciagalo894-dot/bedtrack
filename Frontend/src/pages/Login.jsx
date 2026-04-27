import { useState } from "react";

export default function Login({ onLogin }) {
  const [role, setRole] = useState("enfermeria");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email.includes("@gmail.com")) {
      alert("Debe ingresar un correo Gmail válido");
      return;
    }

    if (password.length < 4) {
      alert("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    onLogin(role);
  };

  // 🔥 CAPTURAR ENTER
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6F0FF",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "350px",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            backgroundColor: "#0f172a",
            padding: "15px",
            borderRadius: "10px",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ color: "#60a5fa", margin: 0 }}>
            BedTrack 
          </h2>
        </div>

        {/* TIPO DE USUARIO */}
        <label style={{ color: "#1C3D5A", fontWeight: "bold" }}>
          Tipo de Usuario:
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option value="enfermeria">Enfermería</option>
          <option value="admin">Administrador</option>
        </select>

        {/* EMAIL */}
        <label style={{ color: "#1C3D5A", fontWeight: "bold" }}>
          Nombre de Usuario:
        </label>
        <input
          type="email"
          placeholder="ejemplo@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown} // 👈 ENTER
        />

        {/* PASSWORD */}
        <label
          style={{
            color: "#1C3D5A",
            fontWeight: "bold",
            marginTop: "10px",
            display: "block",
          }}
        >
          Contraseña:
        </label>
        <input
          type="password"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown} // 👈 ENTER
        />

        {/* BOTÓN */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            className="btn-green"
            onClick={handleLogin}
            style={{ width: "100%", fontWeight: "bold" }}
          >
            INGRESAR
          </button>
        </div>
      </div>
    </div>
  );
}