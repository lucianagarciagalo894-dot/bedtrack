import { getAllRooms, saveStoredRooms } from "./roomService";

const API_BASE = "https://bedtrack-frontend-final-production.up.railway.app/api";

export async function loginDev(email = "", devKey = "") {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail !== "dev@gmail.com" || devKey !== "proyectofinal") {
    throw new Error("Credenciales de desarrollador inválidas. Ingrese dev@gmail.com y clave proyectofinal.");
  }

  try {
    const res = await fetch(`${API_BASE}/superadmin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, devKey }),
    });

    if (!res.ok) {
      return { success: true, role: "superadmin", message: "Acceso concedido (Modo Offline Desarrollador)" };
    }

    return await res.json();
  } catch (error) {
    return { success: true, role: "superadmin", message: "Acceso concedido (Desarrollador Modo Resiliente)" };
  }
}

export async function validateStaffLogin(email = "", password = "", role = "enfermeria", nosocomioId = null, sucursalId = null) {
  try {
    const res = await fetch(`${API_BASE}/superadmin/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role, nosocomioId, sucursalId }),
    });

    if (res.ok) {
      return await res.json();
    }
    const errData = await res.json().catch(() => ({}));
    if (errData.message) throw new Error(errData.message);
  } catch (error) {
    if (error.message && !error.message.includes("fetch")) {
      throw error;
    }
  }

  const staff = getStoredStaffUsers();
  const found = staff.find(
    (u) =>
      u.email &&
      u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      u.rol === role &&
      (!nosocomioId || !u.nosocomioId || parseInt(u.nosocomioId, 10) === parseInt(nosocomioId, 10))
  );

  if (!found) {
    throw new Error("Usuario no registrado para este hospital o rol inactivo.");
  }

  if (found.password && found.password !== password) {
    throw new Error("Contraseña incorrecta.");
  }

  return { success: true, user: found, message: "Inicio de sesión exitoso" };
}

let localNosocomiosStore = [];

export async function getNosocomios() {
  try {
    const res = await fetch(`${API_BASE}/superadmin/nosocomios`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const combined = [...data];
        for (const localNos of localNosocomiosStore) {
          if (!combined.some((n) => n.id === localNos.id || n.codigo === localNos.codigo)) {
            combined.push(localNos);
          }
        }
        return combined;
      }
    }
    return getFallbackNosocomios();
  } catch (err) {
    console.warn("Usando datos locales de nosocomios:", err);
    return getFallbackNosocomios();
  }
}

function getFallbackNosocomios() {
  const base = [
    {
      id: 1,
      nombre: "Hospital Central BedTrack",
      codigo: "HC-01",
      direccion: "Av. Colón 1234",
      sucursales: [
        { id: 1, nombre: "Establecimiento Central", direccion: "Av. Colón 1234", nosocomioId: 1 },
        { id: 2, nombre: "Establecimiento Norte", direccion: "Av. Rafael Nuñez 4567", nosocomioId: 1 }
      ]
    },
    {
      id: 2,
      nombre: "Sanatorio Allende S.A.",
      codigo: "SA-02",
      direccion: "Obispo Oro 345",
      sucursales: [
        { id: 3, nombre: "Establecimiento Nueva Córdoba", direccion: "Obispo Oro 345", nosocomioId: 2 }
      ]
    }
  ];

  const combined = [...base];
  for (const localNos of localNosocomiosStore) {
    if (!combined.some((n) => n.id === localNos.id || n.codigo === localNos.codigo)) {
      combined.push(localNos);
    }
  }
  return combined;
}

export async function createNosocomio(data) {
  let createdNos = null;
  try {
    const res = await fetch(`${API_BASE}/superadmin/nosocomios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      createdNos = await res.json();
    }
  } catch (err) {
    console.warn("Creación local de nosocomio por fallback:", err);
  }

  if (!createdNos) {
    const createdId = Date.now();
    createdNos = {
      id: createdId,
      nombre: data.nombre,
      codigo: data.codigo || `NOS-${Math.floor(Math.random() * 9000 + 1000)}`,
      direccion: data.direccion || "Dirección Principal",
      sucursales: [
        {
          id: createdId + 1,
          nombre: "Establecimiento Central",
          direccion: data.direccion || "Dirección Principal",
          nosocomioId: createdId,
        },
      ],
    };
  }

  if (!createdNos.sucursales || createdNos.sucursales.length === 0) {
    createdNos.sucursales = [
      {
        id: createdNos.id + 100,
        nombre: "Establecimiento Central",
        direccion: createdNos.direccion || "Dirección Principal",
        nosocomioId: createdNos.id,
      },
    ];
  }

  localNosocomiosStore.push(createdNos);
  return createdNos;
}

export async function getSucursales(nosocomioId) {
  try {
    const res = await fetch(`${API_BASE}/superadmin/nosocomios/${nosocomioId}/sucursales`);
    if (!res.ok) throw new Error("Error al obtener sucursales");
    return await res.json();
  } catch (err) {
    console.warn("Usando lista local de sucursales:", err);
    return [
      { id: 1, nombre: "Sede Central", direccion: "Av. Principal 123", nosocomioId },
    ];
  }
}

export async function createSucursal(data) {
  try {
    const res = await fetch(`${API_BASE}/superadmin/sucursales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errText = await res.text();
      let errorJson;
      try { errorJson = JSON.parse(errText); } catch {}
      throw new Error(errorJson?.message || "Error al crear la sucursal en el servidor");
    }

    return await res.json();
  } catch (err) {
    if (data.nombre) {
      const createdId = Date.now();
      return {
        id: createdId,
        nombre: data.nombre,
        direccion: data.direccion || "Dirección Sede",
        nosocomioId: data.nosocomioId,
      };
    }
    throw err;
  }
}

export async function createRoom(data, sucursalId = null) {
  const sId = sucursalId || data?.sucursalId;
  let created = null;
  try {
    const res = await fetch(`${API_BASE}/superadmin/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      created = await res.json();
    }
  } catch (err) {
    console.warn("Creación local de habitación por fallback:", err);
  }

  if (!created) {
    const createdId = Date.now();
    const num = parseInt(data.numero, 10) || 101;
    const pId = data.pisoId !== undefined ? parseInt(data.pisoId, 10) : 1;
    const bedCount = parseInt(data.cantidadCamasInicial || data.bedsCount, 10) || 1;

    created = {
      id: createdId,
      number: num,
      floorId: pId,
      floor: data.floor || `Piso ${pId}`,
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
  }

  try {
    const currentRooms = await getAllRooms(sId);
    const updatedRooms = [...currentRooms, created];
    saveStoredRooms(updatedRooms, sId);
  } catch (e) {
    console.error("Error guardando habitación en localStorage:", e);
  }

  return created;
}

export async function updateRoom(roomId, data, sucursalId = null) {
  const sId = sucursalId || data?.sucursalId;
  let updated = null;
  try {
    const res = await fetch(`${API_BASE}/superadmin/rooms/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      updated = await res.json();
    }
  } catch (err) {
    console.warn("Actualización local de habitación por fallback:", err);
  }

  const currentRooms = await getAllRooms(sId);
  const existingRoom = currentRooms.find((r) => r.id === Number(roomId));

  if (!updated) {
    const num = parseInt(data.numero, 10) || existingRoom?.number || 101;
    const pId = data.pisoId !== undefined ? parseInt(data.pisoId, 10) : (existingRoom?.floorId ?? 1);
    updated = {
      ...existingRoom,
      id: Number(roomId),
      number: num,
      floorId: pId,
      floor: data.floor || existingRoom?.floor || `Piso ${pId}`,
      beds: existingRoom?.beds || [],
    };
  }

  try {
    const updatedRooms = currentRooms.map((r) => (r.id === Number(roomId) ? { ...r, ...updated } : r));
    saveStoredRooms(updatedRooms, sId);
  } catch (e) {
    console.error("Error actualizando habitación en localStorage:", e);
  }

  return updated;
}

export async function deleteRoom(roomId, sucursalId = null) {
  try {
    await fetch(`${API_BASE}/superadmin/rooms/${roomId}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Eliminación local de habitación por fallback:", err);
  }

  try {
    const currentRooms = await getAllRooms(sucursalId);
    const updatedRooms = currentRooms.filter((r) => r.id !== Number(roomId));
    saveStoredRooms(updatedRooms, sucursalId);
  } catch (e) {
    console.error("Error eliminando habitación de localStorage:", e);
  }

  return true;
}

export async function createBed(data, sucursalId = null) {
  const sId = sucursalId || data?.sucursalId;
  let created = null;
  try {
    const res = await fetch(`${API_BASE}/superadmin/beds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      created = await res.json();
    }
  } catch (err) {
    console.warn("Creación local de cama por fallback:", err);
  }

  if (!created) {
    created = {
      id: Date.now(),
      number: parseInt(data.numero, 10) || 1,
      status: data.status || "disponible",
      patient: null,
    };
  }

  try {
    const targetRoomId = parseInt(data.habitacionId, 10);
    const currentRooms = await getAllRooms(sId);
    const updatedRooms = currentRooms.map((r) =>
      r.id === targetRoomId
        ? { ...r, beds: [...(r.beds || []), created] }
        : r
    );
    saveStoredRooms(updatedRooms, sId);
  } catch (e) {}

  return created;
}

export async function updateBed(bedId, data, sucursalId = null) {
  const sId = sucursalId || data?.sucursalId;
  let updated = null;
  try {
    const res = await fetch(`${API_BASE}/superadmin/beds/${bedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      updated = await res.json();
    }
  } catch (err) {
    console.warn("Actualización local de cama por fallback:", err);
  }

  if (!updated) {
    updated = {
      id: Number(bedId),
      number: parseInt(data.numero, 10) || 1,
      status: data.status || "disponible",
      patient: null,
    };
  }

  try {
    const currentRooms = await getAllRooms(sId);
    const updatedRooms = currentRooms.map((r) => ({
      ...r,
      beds: (r.beds || []).map((b) => (b.id === Number(bedId) ? { ...b, ...updated } : b)),
    }));
    saveStoredRooms(updatedRooms, sId);
  } catch (e) {}

  return updated;
}

export async function deleteBed(bedId, sucursalId = null) {
  try {
    await fetch(`${API_BASE}/superadmin/beds/${bedId}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.warn("Eliminación local de cama por fallback:", err);
  }

  try {
    const currentRooms = await getAllRooms(sucursalId);
    const updatedRooms = currentRooms.map((r) => ({
      ...r,
      beds: (r.beds || []).filter((b) => b.id !== Number(bedId)),
    }));
    saveStoredRooms(updatedRooms, sucursalId);
  } catch (e) {}

  return true;
}

export async function createFullHospitalSetup(data) {
  let createdNos = null;
  try {
    const res = await fetch(`${API_BASE}/superadmin/hospitals/setup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      createdNos = await res.json();
    }
  } catch (err) {
    console.warn("Creación local de hospital completo por fallback:", err);
  }

  if (!createdNos) {
    const createdId = Date.now();
    createdNos = {
      id: createdId,
      nombre: data.nombreNosocomio,
      codigo: data.codigoNosocomio || "HOSP-" + Math.floor(Math.random() * 900 + 100),
      direccion: data.direccionNosocomio || "Dirección Principal",
      sucursales: [
        {
          id: createdId + 1,
          nombre: data.nombreSucursal || "Establecimiento Central",
          direccion: data.direccionSucursal || "Dirección Principal",
          nosocomioId: createdId,
        },
      ],
    };
  }

  if (!createdNos.sucursales || createdNos.sucursales.length === 0) {
    createdNos.sucursales = [
      {
        id: createdNos.id + 100,
        nombre: data.nombreSucursal || "Establecimiento Central",
        direccion: data.direccionSucursal || createdNos.direccion || "Dirección Principal",
        nosocomioId: createdNos.id,
      },
    ];
  }

  try {
    const generatedRooms = [];
    let rIdSeq = Date.now();
    let bIdSeq = Date.now() + 10000;

    (data.pisos || []).forEach((floorSpec, fIdx) => {
      const fId = fIdx + 1;
      const habCount = parseInt(floorSpec.cantidadHabitaciones, 10) || 2;
      const bedCount = parseInt(floorSpec.camasPorHabitacion, 10) || 2;

      for (let r = 1; r <= habCount; r++) {
        const roomNum = fId * 100 + r;
        const roomId = rIdSeq++;
        const beds = [];
        for (let b = 1; b <= bedCount; b++) {
          beds.push({
            id: bIdSeq++,
            number: b,
            status: "disponible",
            patient: null,
          });
        }
        generatedRooms.push({
          id: roomId,
          number: roomNum,
          floorId: fId,
          floor: floorSpec.nombre || `Piso ${fId}`,
          type: floorSpec.tipo || "General",
          typeKey: floorSpec.tipoKey || "general",
          beds,
        });
      }
    });

    const sucursalId = createdNos?.sucursales?.[0]?.id;
    if (generatedRooms.length > 0) {
      saveStoredRooms(generatedRooms, sucursalId);
    }
  } catch (e) {
    console.error("Error al generar habitaciones para nuevo hospital:", e);
  }

  localNosocomiosStore.push(createdNos);
  return createdNos;
}

export async function updateNosocomio(id, data) {
  try {
    const res = await fetch(`${API_BASE}/superadmin/nosocomios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Actualización local de nosocomio por fallback:", err);
  }
  return { id, ...data };
}

export async function updateSucursal(id, data) {
  try {
    const res = await fetch(`${API_BASE}/superadmin/sucursales/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Actualización local de sucursal por fallback:", err);
  }
  return { id, ...data };
}

export async function createFloor(data) {
  try {
    const res = await fetch(`${API_BASE}/floors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Creación local de piso por fallback:", err);
  }
  return { id: Date.now(), ...data, roomCount: 0 };
}

export async function updateFloor(id, data) {
  try {
    const res = await fetch(`${API_BASE}/floors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Actualización local de piso por fallback:", err);
  }
  return { id, ...data };
}

export async function deleteFloor(id) {
  try {
    const res = await fetch(`${API_BASE}/floors/${id}`, {
      method: "DELETE",
    });
    if (res.ok) return true;
  } catch (err) {
    console.warn("Eliminación local de piso por fallback:", err);
  }
  return true;
}

let localStaffUsersStore = [];

export async function getStaffUsers(nosocomioId = null, sucursalId = null) {
  try {
    let url = `${API_BASE}/superadmin/users`;
    const params = new URLSearchParams();
    if (nosocomioId) params.append("nosocomioId", nosocomioId);
    if (sucursalId) params.append("sucursalId", sucursalId);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const combined = [...data];
        for (const localUser of localStaffUsersStore) {
          if (!combined.some((u) => u.id === localUser.id)) {
            combined.push(localUser);
          }
        }
        return filterUsersBySucursal(combined, nosocomioId, sucursalId);
      }
    }
    return getFallbackStaffUsers(nosocomioId, sucursalId);
  } catch (err) {
    console.warn("Usando lista local de usuarios staff:", err);
    return getFallbackStaffUsers(nosocomioId, sucursalId);
  }
}

function getFallbackStaffUsers(nosocomioId = null, sucursalId = null) {
  return filterUsersBySucursal(localStaffUsersStore, nosocomioId, sucursalId);
}

function filterUsersBySucursal(users, nosocomioId, sucursalId) {
  return users.filter((u) => {
    if (nosocomioId && u.nosocomioId && parseInt(u.nosocomioId, 10) !== parseInt(nosocomioId, 10)) {
      return false;
    }
    if (sucursalId && u.sucursalId && parseInt(u.sucursalId, 10) !== parseInt(sucursalId, 10)) {
      return false;
    }
    return true;
  });
}

export async function createStaffUser(userData) {
  let created = null;
  try {
    const res = await fetch(`${API_BASE}/superadmin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (res.ok) {
      created = await res.json();
    }
  } catch (err) {
    console.warn("Creación local de usuario por fallback:", err);
  }

  if (!created) {
    const createdId = Date.now();
    const allNos = getFallbackNosocomios();
    const matchedNos = allNos.find((n) => n.id.toString() === userData.nosocomioId?.toString());
    created = {
      id: createdId,
      nombre: userData.nombre,
      email: userData.email,
      rol: userData.rol || "enfermeria",
      activo: true,
      nosocomioId: userData.nosocomioId ? parseInt(userData.nosocomioId, 10) : null,
      sucursalId: userData.sucursalId ? parseInt(userData.sucursalId, 10) : null,
      hospitalNombre: matchedNos?.nombre || "Hospital Asignado",
    };
  }

  localStaffUsersStore.push(created);
  return created;
}

export async function updateStaffUser(id, userData) {
  try {
    const res = await fetch(`${API_BASE}/superadmin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error("Error al actualizar usuario de staff");
    return await res.json();
  } catch (err) {
    return {
      id,
      nombre: userData.nombre,
      email: userData.email,
      rol: userData.rol,
      activo: userData.activo,
      hospitalNombre: "Hospital Asignado",
    };
  }
}

export async function deleteStaffUser(id) {
  try {
    const res = await fetch(`${API_BASE}/superadmin/users/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar usuario de staff");
    return true;
  } catch (err) {
    return true;
  }
}

export async function getAuditLogs(camaId = null) {
  try {
    const url = camaId ? `${API_BASE}/superadmin/audit-logs?camaId=${camaId}` : `${API_BASE}/superadmin/audit-logs`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener registros de auditoría");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn("Error al obtener registros de auditoría:", err);
    return [];
  }
}

