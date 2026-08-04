# Project: BedTrack Room Synchronization

## Architecture
- Frontend: BedTrack web application (`Frontend/src/`)
- Key Roles/Views: SuperAdmin Panel (`SuperAdminPanel.jsx`), Nursing View (`Habitaciones.jsx`, `Beds.jsx`, `Dashboard.jsx`), Administration View (`Dashboard.jsx`, `Habitaciones.jsx`)
- Data/State: Room state management in `App.jsx`, sucursal-scoped persistence layer in `roomService.js` and `superAdminService.js` using `localStorage` key `bedtrack_rooms_data_${sucursalId}`, reactive update events via `window.dispatchEvent(new CustomEvent('bedtrack_rooms_updated'))`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Root Cause Analysis | Investigate PDF error report and codebase for room sync failures | M1 | ORIGINAL_REQUEST § R1 |
| 2 | Room Addition Sync | Added rooms in SuperAdmin reflect dynamically in Nursing & Admin views | M2 | ORIGINAL_REQUEST § R2 |
| 3 | Room Deletion Sync | Deleted rooms in SuperAdmin remove cleanly without stale default fallbacks | M2 | ORIGINAL_REQUEST § R2 |
| 4 | Availability Counter Recalculation | Recalculate floor/establishment availability counters upon room CRUD | M2 | ORIGINAL_REQUEST § R2 |
| 5 | Clean Build Verification | Project compiles cleanly with no syntax or build errors | M3 | ORIGINAL_REQUEST § R3 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1 Root Cause Analysis | Identify root cause of room synchronization and persistence failures | none | DONE |
| 2 | M2 Sync & Persistence Fix | Fix room addition/deletion reactivity and persistence across roles | M1 | DONE |
| 3 | M3 Build & Verification | Verify clean compilation (`npm run build`) and acceptance criteria | M2 | DONE |

## Interface Contracts
- **Storage Key**: `bedtrack_rooms_data_${sucursalId}` (stores JSON array of room objects partitioned per sucursal).
- **Reactive Window Event**: `bedtrack_rooms_updated` (dispatched whenever rooms are added, updated, or deleted).
- **Service Integration**:
  - `superAdminService.js`: `createRoom`, `deleteRoom`, `updateRoom` persist changes to `localStorage` key `bedtrack_rooms_data_${sucursalId}` and trigger `window.dispatchEvent(new CustomEvent('bedtrack_rooms_updated'))`.
  - `roomService.js`: `getAllRooms(sucursalId)` checks `localStorage` key `bedtrack_rooms_data_${sucursalId}` first. Preserves empty array `[]` state without fallback re-seeding.
  - `App.jsx`: Listens to `bedtrack_rooms_updated` window event and re-fetches room data to update top-level state reactively across views with null-safe bed mapping `(room.beds || [])`.
  - `Habitaciones.jsx` & `Dashboard.jsx`: Compute floor availability counters dynamically based on updated room state, preserving `floorId: 0` (Planta Baja), safe tab sorting, and zero-bed division by zero protections.
