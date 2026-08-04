import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import App from '../App';

vi.mock('../services/roomService', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getAllRooms: vi.fn().mockResolvedValue([
      {
        id: 101,
        number: 101,
        floorId: 1,
        floor: 'Piso 1',
        beds: [
          { id: 1, number: 1, status: 'disponible', patient: null }
        ]
      }
    ]),
    updateBedStatus: vi.fn().mockResolvedValue({ id: 1, status: 'ocupada', patient: null }),
    getGlobalAuditHistory: vi.fn().mockResolvedValue([]),
  };
});

vi.mock('../services/superAdminService', () => ({
  getNosocomios: vi.fn().mockResolvedValue([
    {
      id: 1,
      nombre: 'Hospital Central',
      codigo: 'HC-01',
      sucursales: [{ id: 1, nombre: 'Establecimiento Central', nosocomioId: 1 }]
    }
  ]),
  validateStaffLogin: vi.fn().mockResolvedValue({ success: true }),
  loginDev: vi.fn().mockResolvedValue({ success: true, role: 'superadmin' }),
}));

describe('Persistencia de Sesión al Refrescar la Página', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, 'Test page', '/');
  });

  test('Caso 1: Sin sesión iniciada, renderiza el login por defecto', () => {
    render(<App />);
    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
    expect(screen.getByText('Ingresá con tu cuenta institucional')).toBeInTheDocument();
  });

  test('Caso 2: Si el usuario está logeado como enfermeria y refresca en /camas, permanece en /camas', async () => {
    localStorage.setItem('bedtrack_role', 'enfermeria');
    localStorage.setItem('bedtrack_session_hospital', JSON.stringify({
      hospital: 'Hospital Central',
      sede: 'Establecimiento Central',
      nosocomioId: 1,
      sucursalId: 1
    }));
    window.history.pushState({}, 'Camas', '/camas');

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Bienvenido')).not.toBeInTheDocument();
      expect(screen.getByText(/BedTrack/)).toBeInTheDocument();
    });

    expect(window.location.pathname).toBe('/camas');
  });

  test('Caso 3: Si el usuario está logeado como encargado y refresca en /habitaciones, permanece en /habitaciones', async () => {
    localStorage.setItem('bedtrack_role', 'encargado');
    localStorage.setItem('bedtrack_session_hospital', JSON.stringify({
      hospital: 'Hospital Central',
      sede: 'Establecimiento Central',
      nosocomioId: 1,
      sucursalId: 1
    }));
    window.history.pushState({}, 'Habitaciones', '/habitaciones');

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Bienvenido')).not.toBeInTheDocument();
    });

    expect(window.location.pathname).toBe('/habitaciones');
  });

  test('Caso 4: Si el usuario está logeado y refresca en /pacientes, permanece en /pacientes', async () => {
    localStorage.setItem('bedtrack_role', 'enfermeria');
    localStorage.setItem('bedtrack_session_hospital', JSON.stringify({
      hospital: 'Hospital Central',
      sede: 'Establecimiento Central',
      nosocomioId: 1,
      sucursalId: 1
    }));
    window.history.pushState({}, 'Pacientes', '/pacientes');

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Bienvenido')).not.toBeInTheDocument();
    });

    expect(window.location.pathname).toBe('/pacientes');
  });

  test('Caso 5: Al cerrar sesión se limpia el localStorage y redirige a login', async () => {
    localStorage.setItem('bedtrack_role', 'enfermeria');
    localStorage.setItem('bedtrack_session_hospital', JSON.stringify({
      hospital: 'Hospital Central',
      sede: 'Establecimiento Central',
      nosocomioId: 1,
      sucursalId: 1
    }));
    window.history.pushState({}, 'Dashboard', '/dashboard');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTitle('Cerrar sesión')).toBeInTheDocument();
    });

    const logoutBtn = screen.getByTitle('Cerrar sesión');
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem('bedtrack_role')).toBeNull();
    expect(localStorage.getItem('bedtrack_session_hospital')).toBeNull();
    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
  });
});
