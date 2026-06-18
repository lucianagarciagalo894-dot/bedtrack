export const FLOOR_CONFIG = [
  { id: 1, label: "Piso 1", type: "Privada",           typeKey: "privada",     roomCount: 12, bedsPerRoom: 1 },
  { id: 2, label: "Piso 2", type: "Compartida",         typeKey: "compartida",  roomCount: 6,  bedsPerRoom: 2 },
  { id: 3, label: "Piso 3", type: "Compartida",         typeKey: "compartida",  roomCount: 6,  bedsPerRoom: 2 },
  { id: 4, label: "Piso 4", type: "Terapia Intensiva",  typeKey: "intensiva",   roomCount: 12, bedsPerRoom: 1 },
  { id: 5, label: "Piso 5", type: "Aislamiento",        typeKey: "aislamiento", roomCount: 12, bedsPerRoom: 1 },
];

export const FLOORS = FLOOR_CONFIG.map((f) => f.label);

const STATUSES = ["disponible", "ocupada", "limpieza"];

const MOCK_PATIENTS = [
  { nombre: "María",   apellido: "González",  edad: 68, diagnostico: "Fractura de cadera",    diasInternacion: 14, fechaIngreso: "2026-06-10" },
  { nombre: "Carlos",  apellido: "Rodríguez", edad: 45, diagnostico: "Neumonía bilateral",    diasInternacion: 7,  fechaIngreso: "2026-06-15" },
  { nombre: "Ana",     apellido: "Martínez",  edad: 72, diagnostico: "Insuficiencia cardíaca",diasInternacion: 21, fechaIngreso: "2026-06-05" },
  { nombre: "Roberto", apellido: "López",     edad: 58, diagnostico: "Hipertensión severa",   diasInternacion: 5,  fechaIngreso: "2026-06-17" },
  { nombre: "Laura",   apellido: "Pérez",     edad: 34, diagnostico: "Apendicitis aguda",     diasInternacion: 3,  fechaIngreso: "2026-06-16" },
];

export function generateRooms() {
  const rooms = [];
  let roomSeq     = 1;
  let bedSeq      = 1;
  let patientIdx  = 0;

  FLOOR_CONFIG.forEach((floor) => {
    for (let r = 1; r <= floor.roomCount; r++) {
      const beds = [];
      for (let b = 1; b <= floor.bedsPerRoom; b++) {
        const status  = STATUSES[(bedSeq - 1) % 3];
        const patient =
          status === "ocupada" && patientIdx < MOCK_PATIENTS.length
            ? MOCK_PATIENTS[patientIdx++]
            : null;
        beds.push({ id: bedSeq, number: b, status, patient });
        bedSeq++;
      }
      rooms.push({
        id:      roomSeq,
        number:  floor.id * 100 + r,
        floorId: floor.id,
        floor:   floor.label,
        type:    floor.type,
        typeKey: floor.typeKey,
        beds,
      });
      roomSeq++;
    }
  });
  return rooms;
}

export function generateBeds() {
  return generateRooms().flatMap((room) =>
    room.beds.map((bed) => ({
      id:         bed.id,
      number:     bed.number,
      floor:      room.floor,
      roomId:     room.id,
      roomNumber: room.number,
      status:     bed.status,
      patient:    bed.patient,
    }))
  );
}
