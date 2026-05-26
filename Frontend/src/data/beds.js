export const FLOORS = ["Piso 1", "Piso 2", "Piso 3", "Piso 4", "Piso 5"];

export function generateBeds() {
  const allBeds = [];
  let id = 1;
  FLOORS.forEach((floor) => {
    for (let i = 1; i <= 12; i++) {
      allBeds.push({
        id: id++,
        floor,
        status:
          i % 3 === 0 ? "limpieza" : i % 2 === 0 ? "ocupada" : "disponible",
      });
    }
  });
  return allBeds;
}
