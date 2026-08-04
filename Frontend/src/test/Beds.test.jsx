import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Beds from '../pages/Beds';
import { generateBeds, FLOORS } from '../data/beds';

const mockBeds = generateBeds();
const noop = vi.fn();

describe('Componente Beds', () => {

  test('Caso 1: el componente se renderiza con título, botones de piso y panel de estadísticas', () => {
    render(<Beds role="enfermeria" beds={mockBeds} onChangeStatus={noop} />);

    expect(screen.getByText('Estado de Camas')).toBeInTheDocument();

    const floorGroup = screen.getByRole('group', { name: 'Selector de piso' });
    FLOORS.forEach((floor) => {
      expect(within(floorGroup).getByRole('button', { name: floor })).toBeInTheDocument();
    });

    const stats = screen.getByRole('region', { name: 'Resumen de camas' });
    expect(within(stats).getByText('Disponibles')).toBeInTheDocument();
    expect(within(stats).getByText('Ocupadas')).toBeInTheDocument();
    expect(within(stats).getByText('En limpieza')).toBeInTheDocument();
  });

  test('Caso 2: el piso inicial es Piso 1, su botón aparece activo y muestra 12 camas', () => {
    render(<Beds role="enfermeria" beds={mockBeds} onChangeStatus={noop} />);

    const floorGroup = screen.getByRole('group', { name: 'Selector de piso' });
    expect(within(floorGroup).getByRole('button', { name: 'Piso 1' })).toHaveClass('active');
    expect(within(floorGroup).getByRole('button', { name: 'Piso 2' })).not.toHaveClass('active');
    expect(screen.getByText('12 camas')).toBeInTheDocument();
  });

  test('Caso 3: al hacer clic en otro piso, el botón activo y el encabezado de sección se actualizan', () => {
    render(<Beds role="enfermeria" beds={mockBeds} onChangeStatus={noop} />);

    const floorGroup = screen.getByRole('group', { name: 'Selector de piso' });
    fireEvent.click(within(floorGroup).getByRole('button', { name: 'Piso 3' }));

    expect(within(floorGroup).getByRole('button', { name: 'Piso 3' })).toHaveClass('active');
    expect(within(floorGroup).getByRole('button', { name: 'Piso 1' })).not.toHaveClass('active');
    expect(screen.getByText('Camas del Piso 3')).toBeInTheDocument();
  });

  test('Caso 4: las estadísticas de Piso 1 muestran 4 disponibles, 4 ocupadas y 4 en limpieza', () => {
    render(<Beds role="enfermeria" beds={mockBeds} onChangeStatus={noop} />);

    // Piso 1 es el piso por defecto (12 camas, ciclo de 3 estados → 4 de cada uno)
    const stats = screen.getByRole('region', { name: 'Resumen de camas' });
    expect(within(stats).getByText('Disponibles').previousElementSibling.textContent).toBe('4');
    expect(within(stats).getByText('Ocupadas').previousElementSibling.textContent).toBe('4');
    expect(within(stats).getByText('En limpieza').previousElementSibling.textContent).toBe('4');
  });

  test('Caso 5: muestra alerta cuando hay menos de 3 camas disponibles en el piso seleccionado', () => {
    const sinDisponibles = mockBeds.map((bed) =>
      bed.floor === 'Piso 1' ? { ...bed, status: 'ocupada' } : bed
    );
    render(<Beds role="enfermeria" beds={sinDisponibles} onChangeStatus={noop} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/quedan/i)).toBeInTheDocument();
  });

  test('Caso 6: el rol encargado no ve los grupos de acciones de cambio de estado en las camas', () => {
    render(<Beds role="encargado" beds={mockBeds} onChangeStatus={noop} />);

    expect(screen.queryAllByRole('group', { name: /Cambiar estado/i })).toHaveLength(0);
  });

  test('Caso 7: BedCard muestra el número de cama (bed.number) en vez del ID de timestamp (bed.id)', () => {
    const bedsConTimestampId = [
      { id: 1785878970017, number: 1, floor: 'Piso 1', status: 'disponible', patient: null },
      { id: 1785878970018, number: 2, floor: 'Piso 1', status: 'disponible', patient: null }
    ];

    render(<Beds role="enfermeria" beds={bedsConTimestampId} onChangeStatus={noop} />);

    expect(screen.getByText('Cama 1')).toBeInTheDocument();
    expect(screen.getByText('Cama 2')).toBeInTheDocument();
    expect(screen.queryByText('Cama 1785878970017')).not.toBeInTheDocument();
  });

});
