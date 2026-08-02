const API_BASE = "https://bedtrack-frontend-final-production.up.railway.app/api";

export async function getFloors() {
  const res = await fetch(`${API_BASE}/floors`);
  if (!res.ok) throw new Error("Error al obtener los pisos");
  return res.json();
}

export async function getAllRooms() {
  const res = await fetch(`${API_BASE}/rooms`);
  if (!res.ok) throw new Error("Error al obtener las habitaciones");
  return res.json();
}

export async function getRoomsByFloor(floorId) {
  const res = await fetch(`${API_BASE}/floors/${floorId}/rooms`);
  if (!res.ok) throw new Error("Error al obtener las habitaciones del piso");
  return res.json();
}

export async function getRoomById(roomId) {
  const res = await fetch(`${API_BASE}/rooms/${roomId}`);
  if (!res.ok) throw new Error("Error al obtener la habitación");
  return res.json();
}

export async function updateBedStatus(bedId, status, patient = null, operatorInfo = null) {
  const payload = {
    status,
    patient,
    operatorName: operatorInfo?.name || "Lic. Personal de Enfermería",
    operatorEmail: operatorInfo?.email || "enfermeria@hospital.com",
  };

  const res = await fetch(`${API_BASE}/beds/${bedId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al actualizar el estado de la cama");
  return res.json();
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
