const API_BASE = "https://bedtrack-frontend-final-production.up.railway.app/api";

export async function getFloors() {
  try {
    const res = await fetch(`${API_BASE}/floors`);
    if (!res.ok) throw new Error("Error al obtener los pisos");
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : getFallbackFloors();
  } catch (err) {
    console.warn("Usando pisos locales de respaldo:", err);
    return getFallbackFloors();
  }
}

export async function getAllRooms() {
  try {
    const res = await fetch(`${API_BASE}/rooms`);
    if (!res.ok) throw new Error("Error al obtener las habitaciones");
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : getFallbackRooms();
  } catch (err) {
    console.warn("Usando habitaciones locales de respaldo:", err);
    return getFallbackRooms();
  }
}

export async function getRoomsByFloor(floorId) {
  try {
    const res = await fetch(`${API_BASE}/floors/${floorId}/rooms`);
    if (!res.ok) throw new Error("Error al obtener las habitaciones del piso");
    return await res.json();
  } catch (err) {
    console.warn("Usando filtro local de habitaciones por piso:", err);
    const all = getFallbackRooms();
    return all.filter((r) => r.floorId === Number(floorId));
  }
}

export async function getRoomById(roomId) {
  try {
    const res = await fetch(`${API_BASE}/rooms/${roomId}`);
    if (!res.ok) throw new Error("Error al obtener la habitación");
    return await res.json();
  } catch (err) {
    console.warn("Usando búsqueda local de habitación:", err);
    const all = getFallbackRooms();
    return all.find((r) => r.id === Number(roomId)) || all[0];
  }
}

export async function updateBedStatus(bedId, status, patient = null, operatorInfo = null) {
  const payload = {
    status,
    patient,
    operatorName: operatorInfo?.name || "Lic. Personal de Enfermería",
    operatorEmail: operatorInfo?.email || "enfermeria@hospital.com",
  };

  try {
    const res = await fetch(`${API_BASE}/beds/${bedId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al actualizar el estado de la cama");
    return await res.json();
  } catch (err) {
    console.warn("Usando respuesta local para actualizar cama:", err);
    return {
      id: bedId,
      number: 1,
      status,
      patient: status === "ocupada" ? patient : null,
    };
  }
}

function getFallbackFloors() {
  return [
    { id: 1, nombre: "Piso 1 - Guardia & Emergencias", tipo: "General", tipoKey: "general", roomCount: 2 },
    { id: 2, nombre: "Piso 2 - Cuidados Intensivos (UTI)", tipo: "Intensiva", tipoKey: "intensiva", roomCount: 1 },
    { id: 3, nombre: "Piso 3 - Internación General", tipo: "General", tipoKey: "general", roomCount: 1 },
  ];
}

function getFallbackRooms() {
  return [
    {
      id: 101,
      number: 101,
      floorId: 1,
      floor: "Piso 1 - Guardia & Emergencias",
      type: "General",
      typeKey: "general",
      beds: [
        { id: 1, number: 1, status: "disponible", patient: null },
        { id: 2, number: 2, status: "ocupada", patient: { id: 1, nombre: "Juan", apellido: "Pérez", edad: 45, diagnostico: "Observación", fechaIngreso: "2026-08-01", diasInternacion: 2 } }
      ]
    },
    {
      id: 102,
      number: 102,
      floorId: 1,
      floor: "Piso 1 - Guardia & Emergencias",
      type: "General",
      typeKey: "general",
      beds: [
        { id: 3, number: 1, status: "enlimpieza", patient: null },
        { id: 4, number: 2, status: "disponible", patient: null }
      ]
    },
    {
      id: 201,
      number: 201,
      floorId: 2,
      floor: "Piso 2 - Cuidados Intensivos (UTI)",
      type: "Intensiva",
      typeKey: "intensiva",
      beds: [
        { id: 5, number: 1, status: "ocupada", patient: { id: 2, nombre: "María", apellido: "Gómez", edad: 62, diagnostico: "Insuficiencia Respiratoria", fechaIngreso: "2026-07-30", diasInternacion: 4 } }
      ]
    }
  ];
}

export async function getGlobalAuditHistory() {
  try {
    const res = await fetch(`${API_BASE}/beds/history`);
    if (!res.ok) throw new Error("Error al obtener el historial de actividades");
    return await res.json();
  } catch (err) {
    console.warn("Error cargando historial de actividades:", err);
    return [];
  }
}

export async function getBedHistory(bedId) {
  try {
    const res = await fetch(`${API_BASE}/beds/${bedId}/history`);
    if (!res.ok) throw new Error("Error al obtener historial de la cama");
    return await res.json();
  } catch (err) {
    console.warn("Error cargando historial de cama:", err);
    return [];
  }
}
