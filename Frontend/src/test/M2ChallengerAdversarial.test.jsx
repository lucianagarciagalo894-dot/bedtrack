import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import React from "react";
import App from "../App";
import {
  getAllRooms,
  getStoredRooms,
  saveStoredRooms,
  getStorageKey,
  createRoom as createRoomService,
  updateRoom as updateRoomService,
  deleteRoom as deleteRoomService,
  updateBedStatus,
  getRoomsByFloor,
  ROOMS_STORAGE_KEY,
} from "../services/roomService";
import {
  createRoom as createRoomSA,
  updateRoom as updateRoomSA,
  deleteRoom as deleteRoomSA,
  createBed as createBedSA,
  updateBed as updateBedSA,
  deleteBed as deleteBedSA,
} from "../services/superAdminService";

describe("M2 Empirical Challenger Adversarial Suite", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  describe("1. Sucursal Storage Key Isolation & Partitioning", () => {
    it("partitioned keys store data independently without cross-sucursal contamination", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Offline Mode"));

      const roomsSede1 = [
        { id: 101, number: 101, floorId: 1, floor: "Piso 1", sucursalId: 1, beds: [{ id: 1, number: 1, status: "disponible" }] },
      ];
      const roomsSede2 = [
        { id: 201, number: 201, floorId: 2, floor: "Piso 2", sucursalId: 2, beds: [{ id: 2, number: 1, status: "ocupada" }] },
      ];

      saveStoredRooms(roomsSede1, "1");
      saveStoredRooms(roomsSede2, "2");

      expect(localStorage.getItem(getStorageKey("1"))).toContain("101");
      expect(localStorage.getItem(getStorageKey("2"))).toContain("201");
      expect(localStorage.getItem(getStorageKey("1"))).not.toContain("201");

      const fetchSede1 = await getAllRooms("1");
      const fetchSede2 = await getAllRooms("2");

      expect(fetchSede1).toHaveLength(1);
      expect(fetchSede1[0].id).toBe(101);
      expect(fetchSede2).toHaveLength(1);
      expect(fetchSede2[0].id).toBe(201);
    });

    it("clearing rooms in one sucursal to [] does not affect another sucursal's stored rooms", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Offline Mode"));

      const roomsSede10 = [{ id: 10, number: 10, floorId: 1, beds: [] }];
      const roomsSede20 = [{ id: 20, number: 20, floorId: 2, beds: [] }];

      saveStoredRooms(roomsSede10, "10");
      saveStoredRooms(roomsSede20, "20");

      // Delete room from sucursal 10
      await deleteRoomService(10, "10");

      expect(localStorage.getItem(getStorageKey("10"))).toBe("[]");
      expect(await getAllRooms("10")).toEqual([]);

      // Sucursal 20 must remain intact
      const fetch20 = await getAllRooms("20");
      expect(fetch20).toHaveLength(1);
      expect(fetch20[0].id).toBe(20);
    });

    it("findSucursalKeyForRoom correctly resolves sucursal key when sucursalId is omitted in updates", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Offline Mode"));

      const roomsSede5 = [
        { id: 555, number: 555, floorId: 1, floor: "Piso 1", sucursalId: 5, beds: [{ id: 50, number: 1, status: "disponible" }] },
      ];
      saveStoredRooms(roomsSede5, "5");

      // Update room without passing explicit sucursalId
      await updateRoomService(555, { numero: 556 });

      const updated = await getAllRooms("5");
      expect(updated[0].number).toBe(556);
      expect(localStorage.getItem(getStorageKey("5"))).toContain("556");
    });

    it("findSucursalKeyForBed correctly resolves sucursal key when bed status is updated without sucursalId", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Offline Mode"));

      const roomsSede8 = [
        { id: 800, number: 800, floorId: 1, floor: "Piso 1", sucursalId: 8, beds: [{ id: 888, number: 1, status: "disponible" }] },
      ];
      saveStoredRooms(roomsSede8, "8");

      // Update bed status without passing explicit sucursalId
      await updateBedStatus(888, "ocupada", { nombre: "Test" });

      const rooms = await getAllRooms("8");
      expect(rooms[0].beds[0].status).toBe("ocupada");
    });
  });

  describe("2. Empty Array Persistence & Fallback Prevention", () => {
    it("empty array [] in localStorage is never overwritten by getFallbackRooms on getStoredRooms", () => {
      localStorage.setItem(getStorageKey("3"), "[]");

      const rooms = getStoredRooms("3");
      expect(rooms).toEqual([]);
      expect(localStorage.getItem(getStorageKey("3"))).toBe("[]");
    });

    it("getAllRooms returns [] when localStorage holds [] and fetch throws network error", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Connection Failure"));
      localStorage.setItem(getStorageKey("4"), "[]");

      const rooms = await getAllRooms("4");
      expect(rooms).toEqual([]);
      expect(localStorage.getItem(getStorageKey("4"))).toBe("[]");
    });
  });

  describe("3. Floor Breakdown, Ground Floor (0), and Label Standardisation", () => {
    it("handles floorId: 0 (Planta Baja) without coercing to floorId 1", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Offline Mode"));

      const groundRoom = {
        id: 900,
        number: 1,
        floorId: 0,
        floor: "Planta Baja",
        beds: [{ id: 901, number: 1, status: "disponible" }],
      };
      saveStoredRooms([groundRoom], "1");

      const floorZeroRooms = await getRoomsByFloor(0, "1");
      expect(floorZeroRooms).toHaveLength(1);
      expect(floorZeroRooms[0].floorId).toBe(0);
    });

    it("getRoomsByFloor matches floorId with string vs numeric comparison correctly", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Offline Mode"));

      const room = { id: 701, number: 701, floorId: 7, floor: "Piso 7", beds: [] };
      saveStoredRooms([room], "1");

      const resNumeric = await getRoomsByFloor(7, "1");
      const resString = await getRoomsByFloor("7", "1");

      expect(resNumeric).toHaveLength(1);
      expect(resString).toHaveLength(1);
      expect(resNumeric[0].id).toBe(701);
    });
  });

  describe("4. Robustness against Malformed Room Objects & Rapid Concurrent Actions", () => {
    it("does not throw uncaught TypeError when room objects lack 'beds' array property", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Offline Mode"));

      const malformedRooms = [
        { id: 990, number: 990, floorId: 1, floor: "Piso 1" }, // missing beds
        { id: 991, number: 991, floorId: 1, floor: "Piso 1", beds: null }, // beds is null
        { id: 992, number: 992, floorId: 1, floor: "Piso 1", beds: [] },
      ];
      saveStoredRooms(malformedRooms, "1");

      // Attempt updating bed status on non-existent bed ID in malformed rooms
      await expect(updateBedStatus(9999, "ocupada", null, null, "1")).resolves.toBeDefined();

      const rooms = await getAllRooms("1");
      expect(rooms).toHaveLength(3);
    });

    it("handles rapid concurrent operations without storage corruption", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Offline Mode"));

      saveStoredRooms([], "100");

      const actions = [
        createRoomService({ numero: "101", pisoId: "1", bedsCount: "2" }, "100"),
        createRoomService({ numero: "102", pisoId: "1", bedsCount: "2" }, "100"),
        createRoomService({ numero: "103", pisoId: "2", bedsCount: "1" }, "100"),
      ];

      await Promise.all(actions);

      const rooms = await getAllRooms("100");
      expect(rooms.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("5. Event Dispatch Integrity & Custom Event Detail", () => {
    it("dispatches custom event with sucursalId detail when saveStoredRooms runs", () => {
      const listener = vi.fn();
      window.addEventListener("bedtrack_rooms_updated", listener);

      saveStoredRooms([{ id: 1, beds: [] }], "42");

      expect(listener).toHaveBeenCalledTimes(1);
      const eventCall = listener.mock.calls[0][0];
      expect(eventCall.detail).toEqual({ sucursalId: "42" });

      window.removeEventListener("bedtrack_rooms_updated", listener);
    });
  });
});
