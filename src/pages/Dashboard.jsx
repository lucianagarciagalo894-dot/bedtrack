import { useState } from "react";

function Dashboard() {
  const [beds, setBeds] = useState([
    { id: 1, status: "Disponible" },
    { id: 2, status: "Ocupada" },
    { id: 3, status: "Limpieza" }
  ]);

  const changeStatus = (id, newStatus) => {
    const updated = beds.map(bed =>
      bed.id === id ? { ...bed, status: newStatus } : bed
    );
    setBeds(updated);
  };

  const getClass = (status) => {
    if (status === "Disponible") return "available";
    if (status === "Ocupada") return "occupied";
    return "unavailable";
  };

  return (
    <div className="container">
      <h2>BedTrack Dashboard</h2>

      {beds.map(bed => (
        <div key={bed.id} className="bed-card">
          <h3>Cama {bed.id}</h3>

          <p className={getClass(bed.status)}>
            {bed.status}
          </p>

          <button className="btn-green"
            onClick={() => changeStatus(bed.id, "Disponible")}>
            ✔ Disponible
          </button>

          <button className="btn-red"
            onClick={() => changeStatus(bed.id, "Ocupada")}>
            ❌ Ocupada
          </button>

          <button className="btn-yellow"
            onClick={() => changeStatus(bed.id, "Limpieza")}>
            ⚠ Limpieza
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;