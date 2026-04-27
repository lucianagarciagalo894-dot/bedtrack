export default function Sidebar() {
  return (
    <div style={{
      width: "200px",
      height: "100vh",
      backgroundColor: "#0f172a",
      color: "white",
      padding: "20px",
      position: "fixed",
      left: 0,
      top: 0
    }}>
      <h2 style={{ color: "#60a5fa" }}>BedTrack</h2>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ margin: "20px 0" }}>🏥 Dashboard</li>
        <li style={{ margin: "20px 0" }}>🛏️ Camas</li>
        <li style={{ margin: "20px 0" }}>⚙️ Configuración</li>
      </ul>
    </div>
  );
}