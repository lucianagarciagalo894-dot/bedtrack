import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import App from '../App';
import { updateNosocomio, updateStaffUser, createRoom, saveStoredNosocomios, saveStoredStaffUsers } from '../services/superAdminService';

describe('Sincronización en Tiempo Real entre Panel de Desarrollador y Hospital', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, 'Dashboard', '/dashboard');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Offline Fallback')));
  });

  test('Caso 1: Al editar el nombre del hospital desde el panel de desarrollador, el título de la barra superior se actualiza en tiempo real', async () => {
    localStorage.setItem('bedtrack_role', 'enfermeria');
    localStorage.setItem('bedtrack_session_hospital', JSON.stringify({
      hospital: 'Hospital Central BedTrack',
      sede: 'Establecimiento Central',
      nosocomioId: 1,
      sucursalId: 1,
      email: 'enfermero@gmail.com'
    }));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/BedTrack — Hospital Central BedTrack/)).toBeInTheDocument();
    });

    await updateNosocomio(1, {
      id: 1,
      nombre: 'Hospital de Alta Red BedTrack',
      codigo: 'HC-01',
      activo: true
    });

    await waitFor(() => {
      expect(screen.getByText(/BedTrack — Hospital de Alta Red BedTrack/)).toBeInTheDocument();
    });
  });

  test('Caso 2: Al desactivar el hospital activo, la sesión se cierra automáticamente', async () => {
    localStorage.setItem('bedtrack_role', 'enfermeria');
    localStorage.setItem('bedtrack_session_hospital', JSON.stringify({
      hospital: 'Hospital Central BedTrack',
      sede: 'Establecimiento Central',
      nosocomioId: 1,
      sucursalId: 1,
      email: 'enfermero@gmail.com'
    }));

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Bienvenido')).not.toBeInTheDocument();
    });

    await updateNosocomio(1, {
      id: 1,
      nombre: 'Hospital Central BedTrack',
      codigo: 'HC-01',
      activo: false
    });

    await waitFor(() => {
      expect(screen.getByText('Bienvenido')).toBeInTheDocument();
      expect(localStorage.getItem('bedtrack_role')).toBeNull();
    });
  });

  test('Caso 3: Al desactivar el usuario activo desde el panel de desarrollador, se cierra la sesión inmediatamente', async () => {
    localStorage.setItem('bedtrack_role', 'enfermeria');
    localStorage.setItem('bedtrack_session_hospital', JSON.stringify({
      hospital: 'Hospital Central BedTrack',
      sede: 'Establecimiento Central',
      nosocomioId: 1,
      sucursalId: 1,
      email: 'enfermero.activo@gmail.com'
    }));

    saveStoredStaffUsers([
      {
        id: 10,
        nombre: 'Enfermero Test',
        email: 'enfermero.activo@gmail.com',
        rol: 'enfermeria',
        activo: true,
        nosocomioId: 1,
        sucursalId: 1
      }
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Bienvenido')).not.toBeInTheDocument();
    });

    await updateStaffUser(10, {
      id: 10,
      nombre: 'Enfermero Test',
      email: 'enfermero.activo@gmail.com',
      rol: 'enfermeria',
      activo: false,
      nosocomioId: 1,
      sucursalId: 1
    });

    await waitFor(() => {
      expect(screen.getByText('Bienvenido')).toBeInTheDocument();
    });
  });

  test('Caso 4: Al ingresar a una URL dedicada (/h/HC-01), muestra el panel de usuario (login) correspondiente', async () => {
    localStorage.setItem('bedtrack_role', 'superadmin');
    window.history.pushState({}, 'Hospital Dedicated', '/h/HC-01');

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Bienvenido')).toBeInTheDocument();
      expect(screen.getByText('Ingresá con tu cuenta institucional')).toBeInTheDocument();
    });
  });
});
