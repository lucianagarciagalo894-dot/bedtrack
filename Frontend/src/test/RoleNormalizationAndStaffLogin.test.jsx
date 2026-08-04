import { describe, test, expect, beforeEach } from 'vitest';
import { normalizeRole, validateStaffLogin, saveStoredStaffUsers, getStoredStaffUsers } from '../services/superAdminService';

describe('Normalización de Roles y Autenticación Staff (Enfermería y Encargado)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Caso 1: normaliza correctamente variantes de rol para Enfermería y Encargado', () => {
    expect(normalizeRole('Enfermería')).toBe('enfermeria');
    expect(normalizeRole('Enfermero')).toBe('enfermeria');
    expect(normalizeRole('enfermeria')).toBe('enfermeria');
    expect(normalizeRole('Lic. Enfermera')).toBe('enfermeria');
    
    expect(normalizeRole('Encargado de Hospital')).toBe('encargado');
    expect(normalizeRole('Encargado')).toBe('encargado');
    expect(normalizeRole('encargado')).toBe('encargado');
    expect(normalizeRole('Admin Hospital')).toBe('encargado');
  });

  test('Caso 2: permite iniciar sesión a usuarios existentes creados con rol acentuado ("Enfermería" o "Encargado de Hospital")', async () => {
    const existingUsers = [
      {
        id: 101,
        nombre: 'Cristian Barrios',
        email: 'cristianbarriosrodrigues10@gmail.com',
        password: '1234',
        rol: 'Enfermería',
        nosocomioId: 1,
        sucursalId: 1,
        activo: true,
      },
      {
        id: 102,
        nombre: 'Carlos Encargado',
        email: 'carlos.encargado@gmail.com',
        password: '1234',
        rol: 'Encargado de Hospital',
        nosocomioId: 1,
        sucursalId: 1,
        activo: true,
      }
    ];

    saveStoredStaffUsers(existingUsers);

    // Usuario 1: registrado como "Enfermería", inicia sesión con rol "enfermeria"
    const resEnfermero = await validateStaffLogin('cristianbarriosrodrigues10@gmail.com', '1234', 'enfermeria', 1, 1);
    expect(resEnfermero.success).toBe(true);
    expect(resEnfermero.user.email).toBe('cristianbarriosrodrigues10@gmail.com');

    // Usuario 2: registrado como "Encargado de Hospital", inicia sesión con rol "encargado"
    const resEncargado = await validateStaffLogin('carlos.encargado@gmail.com', '1234', 'encargado', 1, 1);
    expect(resEncargado.success).toBe(true);
    expect(resEncargado.user.email).toBe('carlos.encargado@gmail.com');
  });

  test('Caso 3: sanitiza los roles de todos los usuarios de hospitales creados al recuperar de almacenamiento local', () => {
    const unnormalizedUsers = [
      { id: 201, nombre: 'Ana', email: 'ana@gmail.com', rol: 'Enfermero', nosocomioId: 2 },
      { id: 202, nombre: 'Pedro', email: 'pedro@gmail.com', rol: 'Encargado', nosocomioId: 2 },
    ];
    saveStoredStaffUsers(unnormalizedUsers);

    const stored = getStoredStaffUsers();
    expect(stored[0].rol).toBe('enfermeria');
    expect(stored[1].rol).toBe('encargado');
  });
});
