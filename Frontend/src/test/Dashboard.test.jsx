import { render, screen, within } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { FLOORS } from '../data/beds';


vi.mock('react-icons/fa', () => ({
  FaBed: () => <span data-testid="fa-bed">FaBed</span>,
  FaCheckCircle: () => <span data-testid="fa-check">FaCheckCircle</span>,
  FaTimesCircle: () => <span data-testid="fa-times">FaTimesCircle</span>,
  FaBroom: () => <span data-testid="fa-broom">FaBroom</span>,
  FaArrowRight: () => <span data-testid="fa-arrow">FaArrowRight</span>,
  FaExclamationCircle: () => <span data-testid="fa-exclamation">FaExclamationCircle</span>
}));


const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Componente Dashboard', () => {

  test('Caso 1: el componente se renderiza con título, estadísticas globales y botón de navegación', () => {
    const mockBeds = [
      { id: 1, floor: 'Piso 1', status: 'disponible' },
      { id: 2, floor: 'Piso 1', status: 'ocupada' },
      { id: 3, floor: 'Piso 2', status: 'disponible' }
    ];

    renderWithRouter(<Dashboard role="enfermeria" beds={mockBeds} />);

    expect(screen.getByText('Bienvenido/a, Enfermería')).toBeInTheDocument();
    expect(screen.getByText('Resumen general del sistema · Todos los pisos')).toBeInTheDocument();
    
    const stats = screen.getByRole('region', { name: 'Estadísticas globales' });
    expect(within(stats).getByText('Total de camas')).toBeInTheDocument();
    expect(within(stats).getByText('Disponibles')).toBeInTheDocument();
    expect(within(stats).getByText('Ocupadas')).toBeInTheDocument();
    expect(within(stats).getByText('En limpieza')).toBeInTheDocument();
    
    expect(screen.getByText('Gestionar camas')).toBeInTheDocument();
  });

  test('Caso 2: las estadísticas globales muestran los números correctos según las camas', () => {
    const mockBeds = [
      { id: 1, floor: 'Piso 1', status: 'disponible' },
      { id: 2, floor: 'Piso 1', status: 'disponible' },
      { id: 3, floor: 'Piso 1', status: 'ocupada' },
      { id: 4, floor: 'Piso 2', status: 'ocupada' },
      { id: 5, floor: 'Piso 2', status: 'enlimpieza' },
      { id: 6, floor: 'Piso 3', status: 'enlimpieza' }
    ];

    renderWithRouter(<Dashboard role="admin" beds={mockBeds} />);

    const stats = screen.getByRole('region', { name: 'Estadísticas globales' });
    
    
    const totalValue = within(stats).getByText('6');
    expect(totalValue).toBeInTheDocument();
    

    const disponibleLabel = within(stats).getByText('Disponibles');
    const disponibleValue = disponibleLabel.previousElementSibling;
    expect(disponibleValue.textContent).toBe('2');
    
    const ocupadaLabel = within(stats).getByText('Ocupadas');
    const ocupadaValue = ocupadaLabel.previousElementSibling;
    expect(ocupadaValue.textContent).toBe('2');
    
    const limpiezaLabel = within(stats).getByText('En limpieza');
    const limpiezaValue = limpiezaLabel.previousElementSibling;
    expect(limpiezaValue.textContent).toBe('2');
  });

  test('Caso 3: muestra el título correcto según el rol (enfermeria vs admin)', () => {
    const mockBeds = [
      { id: 1, floor: 'Piso 1', status: 'disponible' }
    ];

    
    const { rerender } = renderWithRouter(<Dashboard role="enfermeria" beds={mockBeds} />);
    expect(screen.getByText('Bienvenido/a, Enfermería')).toBeInTheDocument();
    expect(screen.getByText('Gestionar camas')).toBeInTheDocument();

    
    rerender(<BrowserRouter><Dashboard role="admin" beds={mockBeds} /></BrowserRouter>);
    expect(screen.getByText('Bienvenido/a, Administrador')).toBeInTheDocument();
    expect(screen.getByText('Ver camas')).toBeInTheDocument();
  });

  test('Caso 4: muestra alerta cuando hay pisos con menos de 3 camas disponibles', () => {
    const mockBeds = [
      { id: 1, floor: 'Piso 1', status: 'disponible' },
      { id: 2, floor: 'Piso 1', status: 'ocupada' },
      { id: 3, floor: 'Piso 1', status: 'ocupada' },
      { id: 4, floor: 'Piso 2', status: 'disponible' },
      { id: 5, floor: 'Piso 2', status: 'disponible' },
      { id: 6, floor: 'Piso 2', status: 'ocupada' }
    ];

    renderWithRouter(<Dashboard role="admin" beds={mockBeds} />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(within(alert).getByText(/Piso 1, Piso 2/)).toBeInTheDocument();
    expect(within(alert).getByText(/tienen menos de 3 camas disponibles/i)).toBeInTheDocument();
  });

  test('Caso 5: muestra el desglose por piso con barras de estado y cantidades correctas', () => {
    const mockBeds = [
      { id: 1, floor: 'Piso 1', status: 'disponible' },
      { id: 2, floor: 'Piso 1', status: 'disponible' },
      { id: 3, floor: 'Piso 1', status: 'ocupada' },
      { id: 4, floor: 'Piso 2', status: 'enlimpieza' },
      { id: 5, floor: 'Piso 2', status: 'enlimpieza' },
      { id: 6, floor: 'Piso 2', status: 'ocupada' }
    ];

    renderWithRouter(<Dashboard role="admin" beds={mockBeds} />);

    
    FLOORS.forEach((floor) => {
      expect(screen.getByText(floor)).toBeInTheDocument();
    });

   
    const piso1Row = screen.getByText('Piso 1').closest('.floor-row');
    expect(within(piso1Row).getByText('2')).toBeInTheDocument(); 
    expect(within(piso1Row).getByText('1')).toBeInTheDocument(); 
    expect(within(piso1Row).getByText('0')).toBeInTheDocument(); 

   
    const piso2Row = screen.getByText('Piso 2').closest('.floor-row');
    expect(within(piso2Row).getByText('0')).toBeInTheDocument(); 
    expect(within(piso2Row).getByText('1')).toBeInTheDocument(); 
    expect(within(piso2Row).getByText('2')).toBeInTheDocument(); 

    
    const links = screen.getAllByLabelText(/Ver camas del/);
    expect(links).toHaveLength(FLOORS.length);
    links.forEach(link => {
      expect(link).toHaveAttribute('href', '/camas');
    });
  });

});