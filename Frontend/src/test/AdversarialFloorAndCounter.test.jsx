import { render, screen, within } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Habitaciones from '../pages/Habitaciones';
import Dashboard from '../pages/Dashboard';

// No mock needed for react-icons/fa

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Adversarial Challenge: Ground Floor (floorId: 0), Zero-Bed Edge Cases & Counters', () => {

  describe('Habitaciones.jsx Edge Cases & Floor 0 Handling', () => {
    test('1. Handles floorId: 0 (Ground Floor) without coercing to Piso 1', () => {
      const mockRooms = [
        {
          id: 1,
          number: 1,
          floorId: 0,
          floor: 'Planta Baja',
          type: 'General',
          typeKey: 'privada',
          beds: [{ id: 10, number: 1, status: 'disponible' }]
        },
        {
          id: 2,
          number: 101,
          floorId: 1,
          floor: 'Piso 1',
          type: 'Privada',
          typeKey: 'privada',
          beds: [{ id: 20, number: 1, status: 'ocupada' }]
        }
      ];

      renderWithRouter(<Habitaciones rooms={mockRooms} />);

      // Ground floor tab should be rendered with label "Planta Baja"
      const groundFloorTab = screen.getByRole('button', { name: /Planta Baja/i });
      expect(groundFloorTab).toBeInTheDocument();

      // Click Ground Floor tab
      groundFloorTab.click();

      // Should show 1 hab and 1 cama in banner
      expect(screen.getByText(/1 hab\./i)).toBeInTheDocument();
      expect(screen.getByText(/1 camas en total/i)).toBeInTheDocument();
    });

    test('2. Handles numeric floorId 0 when floor label is not provided', () => {
      const mockRooms = [
        {
          id: 99,
          number: 5,
          floorId: 0,
          beds: [{ id: 50, number: 1, status: 'disponible' }]
        }
      ];

      renderWithRouter(<Habitaciones rooms={mockRooms} />);

      // Fallback label for floorId === 0 should be "Planta Baja"
      expect(screen.getAllByText(/Planta Baja/i).length).toBeGreaterThan(0);
    });

    test('3. Handles mixed case bed statuses correctly (e.g. DISPONIBLE, Ocupada, enLimpieza)', () => {
      const mockRooms = [
        {
          id: 1,
          number: 101,
          floorId: 1,
          beds: [
            { id: 1, number: 1, status: 'DISPONIBLE' },
            { id: 2, number: 2, status: 'Disponible' },
            { id: 3, number: 3, status: 'OCUPADA' },
            { id: 4, number: 4, status: 'EnLimpieza' }
          ]
        }
      ];

      renderWithRouter(<Habitaciones rooms={mockRooms} />);

      const stats = screen.getByRole('region', { name: 'Resumen de camas' });
      const disponibleCard = within(stats).getByText('Disponibles').previousElementSibling;
      const ocupadaCard = within(stats).getByText('Ocupadas').previousElementSibling;
      const limpiezaCard = within(stats).getByText('En limpieza').previousElementSibling;

      expect(disponibleCard.textContent).toBe('2');
      expect(ocupadaCard.textContent).toBe('1');
      expect(limpiezaCard.textContent).toBe('1');
    });

    test('4. DEMONSTRATE DEFECT: Room with undefined beds property crashes RoomCard rendering in Habitaciones.jsx', () => {
      const mockRooms = [
        {
          id: 1,
          number: 101,
          floorId: 1
          // beds property is missing/undefined
        }
      ];

      // Expecting render to throw TypeError in getRoomStatus because beds is undefined in RoomCard
      expect(() => renderWithRouter(<Habitaciones rooms={mockRooms} />)).toThrow(TypeError);
    });

    test('5. DEMONSTRATE DEFECT: False positive warning alert when floor has 0 total beds in Habitaciones.jsx', () => {
      const mockRooms = [
        {
          id: 1,
          number: 101,
          floorId: 1,
          beds: []
        }
      ];

      renderWithRouter(<Habitaciones rooms={mockRooms} />);

      // Alert appears for floor 1 even when total beds is 0 (availableBeds < 3)
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert.textContent).toContain('Atención: quedan 0 camas disponibles en Piso 1.');
    });
  });

  describe('Dashboard.jsx Edge Cases, Zero-Bed & Division-by-Zero Protection', () => {
    test('1. Division-by-zero protection in floor bar width calculations when total beds = 0', () => {
      const mockBeds = [
        // Bed in Piso 1 only. Piso 2, 3, 4, 5 have total = 0 beds.
        { id: 1, floor: 'Piso 1', status: 'disponible' }
      ];

      renderWithRouter(<Dashboard role="encargado" beds={mockBeds} />);

      // Find floor row for Piso 2 (which has 0 beds)
      const piso2Row = screen.getByText('Piso 2').closest('.floor-row');
      const barsDiv = piso2Row.querySelector('.floor-row-bars');

      // Bars container should be empty (no NaN or width: NaN% in DOM)
      expect(barsDiv.children.length).toBe(0);
      expect(barsDiv.innerHTML).not.toContain('NaN');
      expect(barsDiv.innerHTML).not.toContain('Infinity');
    });

    test('2. Critical floors alert does NOT flag empty floors (total === 0)', () => {
      const mockBeds = [
        // Piso 1 has 5 available beds (not critical)
        { id: 1, floor: 'Piso 1', status: 'disponible' },
        { id: 2, floor: 'Piso 1', status: 'disponible' },
        { id: 3, floor: 'Piso 1', status: 'disponible' },
        { id: 4, floor: 'Piso 1', status: 'disponible' },
        { id: 5, floor: 'Piso 1', status: 'disponible' },
        // Piso 2, 3, 4, 5 have 0 beds total
      ];

      renderWithRouter(<Dashboard role="encargado" beds={mockBeds} />);

      // Alert should NOT be present because no floor with >0 beds has <3 available beds
      expect(screen.queryByRole('alert')).toBeNull();
    });

    test('3. Critical floors alert DOES flag floor with >0 total beds and <3 available beds', () => {
      const mockBeds = [
        { id: 1, floor: 'Piso 1', status: 'disponible' },
        { id: 2, floor: 'Piso 1', status: 'ocupada' },
        { id: 3, floor: 'Piso 1', status: 'ocupada' },
      ];

      renderWithRouter(<Dashboard role="encargado" beds={mockBeds} />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(within(alert).getByText('Piso 1')).toBeInTheDocument();
    });

    test('4. Handles ground floor bed with floor: "Planta Baja" or "Piso 0"', () => {
      const mockBeds = [
        { id: 1, floor: 'Planta Baja', status: 'disponible' },
        { id: 2, floor: 'Planta Baja', status: 'disponible' },
        { id: 3, floor: 'Planta Baja', status: 'disponible' }
      ];

      renderWithRouter(<Dashboard role="encargado" beds={mockBeds} />);

      // Should render "Planta Baja" in breakdown
      const plantaBajaRow = screen.getByText('Planta Baja').closest('.floor-row');
      expect(plantaBajaRow).toBeInTheDocument();
      expect(within(plantaBajaRow).getByText('3')).toBeInTheDocument(); // 3 available
    });

    test('5. Handles completely empty beds array [] without error', () => {
      renderWithRouter(<Dashboard role="encargado" beds={[]} />);

      const stats = screen.getByRole('region', { name: 'Estadísticas globales' });
      expect(within(stats).getByText('Total de camas')).toBeInTheDocument();
      
      const totalCard = within(stats).getByText('Total de camas').previousElementSibling;
      expect(totalCard.textContent).toBe('0');
      expect(screen.queryByRole('alert')).toBeNull();
    });
  });
});
