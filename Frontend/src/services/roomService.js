const API_BASE = "https://bedtrack-frontend-final-production.up.railway.app/api";

export const ROOMS_STORAGE_KEY = "bedtrack_rooms_data";

export function getStorageKey(sucursalId = null) {
  return sucursalId ? `bedtrack_rooms_data_${sucursalId}` : ROOMS_STORAGE_KEY;
}

function findSucursalKeyForRoom(roomId) {
  if (typeof window === "undefined") return null;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k === ROOMS_STORAGE_KEY || (k && k.startsWith("bedtrack_rooms_data_"))) {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.some((r) => r.id === Number(roomId))) {
            return k === ROOMS_STORAGE_KEY ? null : k.replace("bedtrack_rooms_data_", "");
          }
        }
      } catch (e) {}
    }
  }
  return null;
}

function findSucursalKeyForBed(bedId) {
  if (typeof window === "undefined") return null;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k === ROOMS_STORAGE_KEY || (k && k.startsWith("bedtrack_rooms_data_"))) {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.some((r) => (r.beds || []).some((b) => b.id === Number(bedId)))) {
            return k === ROOMS_STORAGE_KEY ? null : k.replace("bedtrack_rooms_data_", "");
          }
        }
      } catch (e) {}
    }
  }
  return null;
}

export function getStoredRooms(sucursalId = null) {
  if (typeof window === "undefined") return getFallbackRooms(sucursalId);
  const key = getStorageKey(sucursalId);
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Error leyendo ${key} de localStorage:`, err);
  }
  const fallback = getFallbackRooms(sucursalId);
  try {
    localStorage.setItem(key, JSON.stringify(fallback));
  } catch (e) {}
  return fallback;
}

export function saveStoredRooms(rooms, sucursalId = null) {
  if (typeof window === "undefined") return;
  const sId = sucursalId || (Array.isArray(rooms) && rooms.length > 0 ? rooms[0]?.sucursalId : null);
  const key = getStorageKey(sId);
  try {
    localStorage.setItem(key, JSON.stringify(rooms));
  } catch (err) {
    console.error(`Error guardando ${key} en localStorage:`, err);
  }
  window.dispatchEvent(new CustomEvent("bedtrack_rooms_updated", { detail: { sucursalId: sId } }));
}

export async function getFloors(sucursalId = null) {
  try {
    const url = sucursalId ? `${API_BASE}/floors?sucursalId=${sucursalId}` : `${API_BASE}/floors`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener los pisos");
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : getFallbackFloors(sucursalId);
  } catch (err) {
    console.warn("Usando pisos locales de respaldo para sucursal:", sucursalId, err);
    return getFallbackFloors(sucursalId);
  }
}

export async function getAllRooms(sucursalId = null) {
  const key = getStorageKey(sucursalId);
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn(`Error consultando localStorage para habitaciones (${key}):`, err);
    }
  }

  try {
    const url = sucursalId ? `${API_BASE}/rooms?sucursalId=${sucursalId}` : `${API_BASE}/rooms`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener las habitaciones");
    const data = await res.json();
    if (Array.isArray(data)) {
      saveStoredRooms(data, sucursalId);
      return data;
    }
    return getStoredRooms(sucursalId);
  } catch (err) {
    console.warn("Usando habitaciones locales de respaldo para sucursal:", sucursalId, err);
    return getStoredRooms(sucursalId);
  }
}

export async function getRoomsByFloor(floorId, sucursalId = null) {
  try {
    const all = await getAllRooms(sucursalId);
    return all.filter((r) => String(r.floorId) === String(floorId));
  } catch (err) {
    console.warn("Usando filtro local de habitaciones por piso:", err);
    const all = getStoredRooms(sucursalId);
    return all.filter((r) => String(r.floorId) === String(floorId));
  }
}

export async function getRoomById(roomId, sucursalId = null) {
  try {
    const all = await getAllRooms(sucursalId);
    return all.find((r) => r.id === Number(roomId)) || all[0];
  } catch (err) {
    console.warn("Usando búsqueda local de habitación:", err);
    const all = getStoredRooms(sucursalId);
    return all.find((r) => r.id === Number(roomId)) || all[0];
  }
}

export async function createRoom(data, sucursalId = null) {
  const sId = sucursalId || data?.sucursalId;
  const currentRooms = await getAllRooms(sId);
  const createdId = Date.now();
  const num = parseInt(data.numero, 10) || 101;
  const pId = data.pisoId !== undefined ? parseInt(data.pisoId, 10) : 1;
  const floorLabel = data.floor || `Piso ${pId}`;
  const bedCount = parseInt(data.cantidadCamasInicial || data.bedsCount, 10) || 1;

  const newRoom = {
    id: createdId,
    number: num,
    floorId: pId,
    floor: floorLabel,
    type: data.tipo || "General",
    typeKey: data.tipoKey || "general",
    sucursalId: sId ? parseInt(sId, 10) : undefined,
    beds: Array.from({ length: bedCount }, (_, i) => ({
      id: createdId + i + 1,
      number: i + 1,
      status: "disponible",
      patient: null,
    })),
  };

  const updatedRooms = [...currentRooms, newRoom];
  saveStoredRooms(updatedRooms, sId);
  return newRoom;
}

export const addRoom = createRoom;

export async function updateRoom(roomId, data, sucursalId = null) {
  const sId = sucursalId || data?.sucursalId || findSucursalKeyForRoom(roomId);
  const currentRooms = await getAllRooms(sId);
  const existingRoom = currentRooms.find((r) => r.id === Number(roomId));

  const num = parseInt(data.numero, 10) || existingRoom?.number || 101;
  const pId = data.pisoId !== undefined ? parseInt(data.pisoId, 10) : (existingRoom?.floorId ?? 1);

  const updatedRoom = {
    ...existingRoom,
    id: Number(roomId),
    number: num,
    floorId: pId,
    floor: data.floor || existingRoom?.floor || `Piso ${pId}`,
    beds: existingRoom?.beds || [],
  };

  const updatedRooms = currentRooms.map((r) => (r.id === Number(roomId) ? updatedRoom : r));
  saveStoredRooms(updatedRooms, sId);
  return updatedRoom;
}

export async function deleteRoom(roomId, sucursalId = null) {
  const sId = sucursalId || findSucursalKeyForRoom(roomId);
  const currentRooms = await getAllRooms(sId);
  const updatedRooms = currentRooms.filter((r) => r.id !== Number(roomId));
  saveStoredRooms(updatedRooms, sId);
  return true;
}

export async function updateBedStatus(bedId, status, patient = null, operatorInfo = null, sucursalId = null) {
  const payload = {
    status,
    patient,
    operatorName: operatorInfo?.name || "Lic. Personal de Enfermería",
    operatorEmail: operatorInfo?.email || "enfermeria@hospital.com",
    operatorRole: operatorInfo?.role || "enfermeria",
  };

  let updatedBed = null;
  try {
    const res = await fetch(`${API_BASE}/beds/${bedId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      updatedBed = await res.json();
    }
  } catch (err) {
    console.warn("Usando respuesta local para actualizar cama:", err);
  }

  if (!updatedBed) {
    updatedBed = {
      id: bedId,
      number: 1,
      status,
      patient: status === "ocupada" ? patient : null,
    };
  }

  const sId = sucursalId || findSucursalKeyForBed(bedId);
  try {
    const rooms = await getAllRooms(sId);
    const newRooms = rooms.map((room) => ({
      ...room,
      beds: (room.beds || []).map((bed) =>
        bed.id === bedId
          ? {
              ...bed,
              status: updatedBed.status,
              patient: updatedBed.patient,
            }
          : bed
      ),
    }));
    saveStoredRooms(newRooms, sId);
  } catch (e) {
    console.warn("Error guardando cama actualizada en localStorage:", e);
  }

  return updatedBed;
}

function getFallbackFloors(sucursalId) {
  return [
    { id: 1, nombre: "Piso 1", tipo: "General", tipoKey: "general", roomCount: 2 },
    { id: 2, nombre: "Piso 2", tipo: "Intensiva", tipoKey: "intensiva", roomCount: 1 },
    { id: 3, nombre: "Piso 3", tipo: "General", tipoKey: "general", roomCount: 1 },
  ];
}

function getFallbackRooms(sucursalId) {
  const sId = sucursalId ? sucursalId.toString() : "1";

  if (sId === "2") {
    // Sede Norte (Hospital Central)
    return [
      {
        id: 103,
        number: 103,
        floorId: 1,
        floor: "Piso 1",
        type: "General",
        typeKey: "general",
        beds: [
          { id: 11, number: 1, status: "ocupada", patient: { id: 11, nombre: "Carlos", apellido: "Benítez", edad: 51, diagnostico: "Traumatismo", fechaIngreso: "2026-08-01", diasInternacion: 1 } },
          { id: 12, number: 2, status: "disponible", patient: null }
        ]
      },
      {
        id: 104,
        number: 104,
        floorId: 1,
        floor: "Piso 1",
        type: "General",
        typeKey: "general",
        beds: [
          { id: 13, number: 1, status: "disponible", patient: null },
          { id: 14, number: 2, status: "disponible", patient: null }
        ]
      },
      {
        id: 202,
        number: 202,
        floorId: 2,
        floor: "Piso 2",
        type: "Intensiva",
        typeKey: "intensiva",
        beds: [
          { id: 15, number: 1, status: "enlimpieza", patient: null },
          { id: 16, number: 2, status: "ocupada", patient: { id: 12, nombre: "Lucía", apellido: "Varela", edad: 58, diagnostico: "Post-quirúrgico", fechaIngreso: "2026-07-31", diasInternacion: 3 } }
        ]
      }
    ];
  }

  if (sId === "3") {
    // Sanatorio Allende Nueva Córdoba
    return [
      {
        id: 105,
        number: 105,
        floorId: 1,
        floor: "Piso 1",
        type: "General",
        typeKey: "general",
        beds: [
          { id: 21, number: 1, status: "ocupada", patient: { id: 21, nombre: "Roberto", apellido: "Rossi", edad: 67, diagnostico: "Cardiopatía", fechaIngreso: "2026-07-29", diasInternacion: 5 } },
          { id: 22, number: 2, status: "ocupada", patient: { id: 22, nombre: "Esteban", apellido: "Quito", edad: 39, diagnostico: "Apendicitis", fechaIngreso: "2026-08-02", diasInternacion: 1 } }
        ]
      },
      {
        id: 205,
        number: 205,
        floorId: 2,
        floor: "Piso 2",
        type: "Intensiva",
        typeKey: "intensiva",
        beds: [
          { id: 23, number: 1, status: "disponible", patient: null },
          { id: 24, number: 2, status: "disponible", patient: null },
          { id: 25, number: 3, status: "enlimpieza", patient: null }
        ]
      }
    ];
  }

  if (sId !== "1") {
    // Hospital / Establecimiento personalizado creado recientemente
    const seed = Math.abs(hashCode(sId)) % 1000 + 300;
    return [
      {
        id: seed,
        number: seed,
        floorId: 1,
        floor: "Piso 1",
        type: "General",
        typeKey: "general",
        beds: [
          { id: seed * 10 + 1, number: 1, status: "disponible", patient: null },
          { id: seed * 10 + 2, number: 2, status: "ocupada", patient: { id: seed + 1, nombre: "Paciente", apellido: "Institucional", edad: 40, diagnostico: "Observación Médica", fechaIngreso: "2026-08-02", diasInternacion: 1 } }
        ]
      },
      {
        id: seed + 1,
        number: seed + 1,
        floorId: 2,
        floor: "Piso 2",
        type: "Intensiva",
        typeKey: "intensiva",
        beds: [
          { id: seed * 10 + 3, number: 1, status: "enlimpieza", patient: null },
          { id: seed * 10 + 4, number: 2, status: "disponible", patient: null }
        ]
      }
    ];
  }

  // Sede 1 por defecto (Hospital Central)
  return [
    {
      id: 101,
      number: 101,
      floorId: 1,
      floor: "Piso 1",
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
      floor: "Piso 1",
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
      floor: "Piso 2",
      type: "Intensiva",
      typeKey: "intensiva",
      beds: [
        { id: 5, number: 1, status: "ocupada", patient: { id: 2, nombre: "María", apellido: "Gómez", edad: 62, diagnostico: "Insuficiencia Respiratoria", fechaIngreso: "2026-07-30", diasInternacion: 4 } }
      ]
    }
  ];
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export async function getGlobalAuditHistory(sucursalId = null) {
  try {
    const url = sucursalId ? `${API_BASE}/beds/history?sucursalId=${sucursalId}` : `${API_BASE}/beds/history`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {}
  return [];
}

export async function getBedHistory(bedId) {
  try {
    const res = await fetch(`${API_BASE}/beds/${bedId}/history`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {}
  return [];
}
