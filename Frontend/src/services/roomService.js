const API_BASE = "https://bedtrack-frontend-final-production.up.railway.app/api";

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
  try {
    const url = sucursalId ? `${API_BASE}/rooms?sucursalId=${sucursalId}` : `${API_BASE}/rooms`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener las habitaciones");
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : getFallbackRooms(sucursalId);
  } catch (err) {
    console.warn("Usando habitaciones locales de respaldo para sucursal:", sucursalId, err);
    return getFallbackRooms(sucursalId);
  }
}

export async function getRoomsByFloor(floorId, sucursalId = null) {
  try {
    const res = await fetch(`${API_BASE}/floors/${floorId}/rooms`);
    if (!res.ok) throw new Error("Error al obtener las habitaciones del piso");
    return await res.json();
  } catch (err) {
    console.warn("Usando filtro local de habitaciones por piso:", err);
    const all = getFallbackRooms(sucursalId);
    return all.filter((r) => r.floorId === Number(floorId));
  }
}

export async function getRoomById(roomId, sucursalId = null) {
  try {
    const res = await fetch(`${API_BASE}/rooms/${roomId}`);
    if (!res.ok) throw new Error("Error al obtener la habitación");
    return await res.json();
  } catch (err) {
    console.warn("Usando búsqueda local de habitación:", err);
    const all = getFallbackRooms(sucursalId);
    return all.find((r) => r.id === Number(roomId)) || all[0];
  }
}

export async function updateBedStatus(bedId, status, patient = null, operatorInfo = null) {
  const payload = {
    status,
    patient,
    operatorName: operatorInfo?.name || "Lic. Personal de Enfermería",
    operatorEmail: operatorInfo?.email || "enfermeria@hospital.com",
    operatorRole: operatorInfo?.role || "enfermeria",
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

function getFallbackFloors(sucursalId) {
  return [
    { id: 1, nombre: "Piso 1 - Guardia & Emergencias", tipo: "General", tipoKey: "general", roomCount: 2 },
    { id: 2, nombre: "Piso 2 - Cuidados Intensivos (UTI)", tipo: "Intensiva", tipoKey: "intensiva", roomCount: 1 },
    { id: 3, nombre: "Piso 3 - Internación General", tipo: "General", tipoKey: "general", roomCount: 1 },
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
        floor: "Piso 1 - Guardia & Emergencias",
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
        floor: "Piso 1 - Guardia & Emergencias",
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
        floor: "Piso 2 - Cuidados Intensivos (UTI)",
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
        floor: "Piso 1 - Guardia & Emergencias",
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
        floor: "Piso 2 - Cuidados Intensivos (UTI)",
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
        floor: "Piso 1 - Guardia & Emergencias",
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
        floor: "Piso 2 - Cuidados Intensivos (UTI)",
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
    if (!res.ok) throw new Error("Error al obtener el historial de actividades");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
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
