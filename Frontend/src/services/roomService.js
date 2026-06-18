const API_BASE = "/api";

export async function getFloors() {
  const res = await fetch(`${API_BASE}/floors`);
  if (!res.ok) throw new Error("Error al obtener los pisos");
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

export async function updateBedStatus(bedId, status) {
  const res = await fetch(`${API_BASE}/beds/${bedId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Error al actualizar el estado de la cama");
  return res.json();
}
