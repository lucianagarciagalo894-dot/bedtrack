import { useState, useEffect } from "react";
import BedCard from "../components/BedCard";

export default function Beds({ role }) {
  const [sector, setSector] = useState("Terapia Intensiva");
  const [beds, setBeds] = useState([]);
  
  // 1. Creamos el "disparador"
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ⚠️ REEMPLAZA EL 7XXX POR EL PUERTO REAL DE TU BACKEND
  const API_URL = "https://localhost:7186/api/Camas";

  // 2. Todo el proceso de carga vive DENTRO del useEffect
  useEffect(() => {
    const cargarCamas = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setBeds(data);
        }
      } catch (error) {
        console.error("Error al conectar con la API de .NET:", error);
      }
    };

    cargarCamas();
  }, [refreshTrigger]); // Le decimos a React: "Vuelve a ejecutar esto cada vez que refreshTrigger cambie"

  const changeStatus = async (id, action) => {
    try {
      const response = await fetch(`${API_URL}/${id}/${action}`, {
        method: "PUT",
      });

      if (response.ok) {
        // 3. Si se guardó en SQL Server, "apretamos el botón" para que React recargue la pantalla
        setRefreshTrigger(prev => prev + 1); 
      } else {
        const errorMsg = await response.text();
        alert("Regla de negocio: " + errorMsg); 
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const filteredBeds = beds.filter((bed) => bed.sector === sector);

  const availableBeds = filteredBeds.filter((bed) => bed.estado === "Disponible").length;
  const occupiedBeds = filteredBeds.filter((bed) => bed.estado === "Ocupada").length;
  const unavailableBeds = filteredBeds.filter((bed) => bed.estado === "En Limpieza").length;

  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>
        {sector} - Estado de Camas
      </h2>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          <option value="Terapia Intensiva">Terapia Intensiva</option>
          <option value="Guardia">Guardia</option>
          <option value="Piso 1">Piso 1</option>
          <option value="Piso 2">Piso 2</option>
        </select>
      </div>

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
          <p>En Limpieza</p>
        </div>
      </div>

      {availableBeds < 3 && filteredBeds.length > 0 && (
        <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
          ⚠ Pocas camas disponibles en este sector
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        {filteredBeds.length === 0 ? (
          <p style={{ textAlign: "center", width: "100%" }}>
            No hay camas registradas en este sector. Créalas desde Swagger.
          </p>
        ) : (
          filteredBeds.map((bed) => (
            <BedCard
              key={bed.id}
              bed={bed}
              onChangeStatus={changeStatus}
              role={role} 
            />
          ))
        )}
      </div>
    </div>
  );
}