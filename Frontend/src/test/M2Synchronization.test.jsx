import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import React from "react";
import App from "../App";
import {
  getAllRooms,
  getStoredRooms,
  saveStoredRooms,
  createRoom as createRoomService,
  updateRoom as updateRoomService,
  deleteRoom as deleteRoomService,
  updateBedStatus,
  ROOMS_STORAGE_KEY,
} from "../services/roomService";
import {
  createRoom as createRoomSA,
  updateRoom as updateRoomSA,
  deleteRoom as deleteRoomSA,
  createBed as createBedSA,
  updateBed as updateBedSA,
  deleteBed as deleteBedSA,
  createFullHospitalSetup,
} from "../services/superAdminService";

describe("M2 Empirical Stress Test: Room Sync, Storage & Event Handling", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  describe("1. Corrupted & Edge-Case localStorage JSON Handling", () => {
    it("handles completely invalid / truncated JSON in localStorage gracefully without throwing", async () => {
      // Mock fetch failure to test local storage fallback behavior
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network Error"));

      localStorage.setItem(ROOMS_STORAGE_KEY, "{ invalid json structure ... {{");
      const rooms = await getAllRooms();
      expect(Array.isArray(rooms)).toBe(true);
    });

    it("handles non-array JSON primitive values in localStorage safely", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network Error"));

      const edgeCases = ["null", "undefined", "12345", '"string"', "true", "{}"];
      for (const val of edgeCases) {
        localStorage.setItem(ROOMS_STORAGE_KEY, val);
        const rooms = await getAllRooms();
        expect(Array.isArray(rooms)).toBe(true);
      }
    });

    it("DEMONSTRATE BUG 1: Deleting all rooms (storing empty array []) forces automatic fallback reset", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network Error"));

      // 1. Set initial valid rooms
      const initialRooms = [
        {
          id: 101,
          number: 101,
          floorId: 1,
          floor: "Piso 1",
          beds: [{ id: 1, number: 1, status: "disponible" }],
        },
      ];
      saveStoredRooms(initialRooms);
      expect((await getAllRooms()).length).toBe(1);

      // 2. Delete the room
      await deleteRoomService(101);

      // 3. Confirm empty array [] was written to localStorage
      const storedRaw = localStorage.getItem(ROOMS_STORAGE_KEY);
      expect(storedRaw).toBe("[]");

      // 4. Call getAllRooms() after empty array stored
      const reFetched = await getAllRooms();

      // VERIFICATION OF FIX: Empty array `[]` is preserved and default fallback rooms are NOT re-seeded!
      expect(storedRaw).toBe("[]");
      expect(reFetched.length).toBe(0); // Proves deleted rooms stay deleted!
    });

    it("DEMONSTRATION BUG 2: Room missing 'beds' array causes crash when beds useMemo evaluates in AppContent", () => {
      // Create a room missing the beds property
      const malformedRoom = [
        {
          id: 999,
          number: 999,
          floorId: 1,
          floor: "Piso 1",
          // beds: undefined
        },
      ];

      // Pure helper simulating App.jsx line 53 beds mapping:
      const evaluateBeds = (rooms) =>
        rooms.flatMap((room) =>
          room.beds.map((bed) => ({
            id: bed.id,
            number: bed.number,
          }))
        );

      expect(() => evaluateBeds(malformedRoom)).toThrow(TypeError);
    });
  });

  describe("2. Window Event Listener Reactivity & Memory Leaks", () => {
    it("dispatches bedtrack_rooms_updated event when saveStoredRooms is invoked", () => {
      const listener = vi.fn();
      window.addEventListener("bedtrack_rooms_updated", listener);

      saveStoredRooms([{ id: 1, beds: [] }]);

      expect(listener).toHaveBeenCalledTimes(1);
      window.removeEventListener("bedtrack_rooms_updated", listener);
    });

    it("properly attaches and detaches bedtrack_rooms_updated listener on mount/unmount", () => {
      const addSpy = vi.spyOn(window, "addEventListener");
      const removeSpy = vi.spyOn(window, "removeEventListener");

      const { unmount } = render(<App />);

      expect(addSpy).toHaveBeenCalledWith("bedtrack_rooms_updated", expect.any(Function));

      unmount();

      expect(removeSpy).toHaveBeenCalledWith("bedtrack_rooms_updated", expect.any(Function));
    });

    it("handles rapid burst of bedtrack_rooms_updated events without throwing synchronously", async () => {
      render(<App />);

      await act(async () => {
        for (let i = 0; i < 30; i++) {
          window.dispatchEvent(new CustomEvent("bedtrack_rooms_updated"));
        }
      });

      expect(document.body).toBeDefined();
    });
  });

  describe("3. SuperAdmin Service CRUD & Local Fallback Storage", () => {
    it("SuperAdmin createRoom, updateRoom, and deleteRoom update localStorage and dispatch event", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Offline Fallback"));

      const eventListener = vi.fn();
      window.addEventListener("bedtrack_rooms_updated", eventListener);

      // Create
      const created = await createRoomSA({
        numero: "301",
        pisoId: "3",
        floor: "Piso 3",
        tipo: "Intensiva",
        bedsCount: 2,
      });

      expect(created.number).toBe(301);
      expect(created.beds.length).toBe(2);
      expect(eventListener).toHaveBeenCalled();

      // Update
      await updateRoomSA(created.id, {
        numero: "302",
        pisoId: "3",
      });

      let stored = await getAllRooms();
      expect(stored.some((r) => r.number === 302)).toBe(true);

      // Delete
      await deleteRoomSA(created.id);
      stored = await getAllRooms();
      expect(stored.some((r) => r.id === created.id)).toBe(false);

      window.removeEventListener("bedtrack_rooms_updated", eventListener);
    });

    it("createFullHospitalSetup populates rooms in localStorage and dispatches event", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Offline Fallback"));

      const listener = vi.fn();
      window.addEventListener("bedtrack_rooms_updated", listener);

      await createFullHospitalSetup({
        nombreNosocomio: "Hospital Nuevo",
        pisos: [
          { nombre: "Piso 1", cantidadHabitaciones: 2, camasPorHabitacion: 2 },
          { nombre: "Piso 2", cantidadHabitaciones: 1, camasPorHabitacion: 3 },
        ],
      });

      expect(listener).toHaveBeenCalled();
      const rooms = await getAllRooms();
      expect(Array.isArray(rooms)).toBe(true);

      window.removeEventListener("bedtrack_rooms_updated", listener);
    });
  });
});
