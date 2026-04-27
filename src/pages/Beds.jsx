import { useState } from "react";
import BedCard from "../components/BedCard";

export default function Beds({ role }) {

  const [floor, setFloor] = useState("Piso 1");

  const generateBeds = () => {
    const floors = ["Piso 1", "Piso 2", "Piso 3", "Piso 4", "Piso 5"];
    let allBeds = [];
    let id = 1;

    floors.forEach((floor) => {
      for (let i = 1; i <= 9; i++) {
        allBeds.push({
          id: id++,
          status:
            i % 3 === 0
              ? "no disponible"
              : i % 2 === 0
              ? "ocupada"
              : "disponible",
          floor: floor
        });
      }
    });

    return allBeds;
  };

  const [beds, setBeds] = useState(generateBeds());

  const changeStatus = (id, newStatus) => {
    const updatedBeds = beds.map((bed) =>
      bed.id === id ? { ...bed, status: newStatus } : bed
    );
    setBeds(updatedBeds);
  };

  const filteredBeds = beds.filter(
    (bed) => bed.floor === floor
  );

  const availableBeds = filteredBeds.filter(
    (bed) => bed.status === "disponible"
  ).length;

  const occupiedBeds = filteredBeds.filter(
    (bed) => bed.status === "ocupada"
  ).length;

  const unavailableBeds = filteredBeds.filter(
    (bed) => bed.status === "no disponible"
  ).length;

  return (
    <div className="container">

      {/* TÍTULO */}
      <h2 style={{ textAlign: "center" }}>
        {floor} - Estado de Camas
      </h2>

      {/* SELECTOR */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <select
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
        >
          <option>Piso 1</option>
          <option>Piso 2</option>
          <option>Piso 3</option>
          <option>Piso 4</option>
          <option>Piso 5</option>
        </select>
      </div>

      {/* DASHBOARD */}
      <div className="summary-cards">

        <div className="summary-card green">
          <h3>{availableBeds}</h3>
          <p>Disponibles</p>
        </div>

        <div className="summary-card red">
          <h3>{occupiedBeds}</h3>
          <p>Ocupadas</p>
        </div>

        <div className="summary-card yellow">
          <h3>{unavailableBeds}</h3>
          <p>No disponibles</p>
        </div>

      </div>

      {/* ALERTA */}
      {availableBeds < 3 && (
        <p style={{
          color: "red",
          textAlign: "center",
          fontWeight: "bold"
        }}>
          ⚠ Pocas camas disponibles
        </p>
      )}

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        {filteredBeds.map((bed) => (
          <BedCard
            key={bed.id}
            bed={bed}
            onChangeStatus={changeStatus}
            role={role}
          />
        ))}
      </div>

    </div>
  );
}