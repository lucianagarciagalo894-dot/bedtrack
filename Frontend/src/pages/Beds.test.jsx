
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, test, expect } from 'vitest';
import Beds from './Beds';


// Pruebas Unitarias con Front End y Back End
// Para que lo puedan probar los chicos se inicia cd Frontend y para iniciar el testeo npm run test
// Las pruebas Unitarias las probe con Jest para la parte del Front End y Back End
// En el Caso Para hacer el Testeo Unitario tuve que  Ignorar SSL - configurar en vite.config.js o package.json
// Para este test, tuve que en el backend está en https://localhost:7186
// Los testeo que diga si paso o no significa que estan bien porque cumple lo que esta haciendo el Front End y Back End
describe('Pruebas del componente Beds con Backend Real', () => {

  
  test('Caso de Prueba 1: El componente se renderiza correctamente', () => {
    render(<Beds role="enfermeria" />);
    
    expect(screen.getByText(/Estado de Camas/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Disponibles')).toBeInTheDocument();
    expect(screen.getByText('Ocupadas')).toBeInTheDocument();
    expect(screen.getByText('En Limpieza')).toBeInTheDocument();
  });

  
  test('Caso de Prueba 2: El componente muestra las 5 camas disponibles en Piso 1', async () => {
    render(<Beds role="enfermeria" />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Piso 1' } });

    
       await waitFor(() => {
      
        const noCamasMsg = screen.queryByText(/No hay camas registradas en este sector/i);
        expect(noCamasMsg).not.toBeInTheDocument();
    }, { timeout: 10000 });

    
    await waitFor(() => {
      const disponiblesElement = screen.getByText(/Disponibles/i).previousSibling;
      const disponibles = parseInt(disponiblesElement.textContent || '0');
      
      console.log('📊 Disponibles en Piso 1 (prueba):', disponibles);
      
      
      expect(disponibles).toBe(3);
    });
  }, 15000);

  
  test('Caso de Prueba 3: El componente muestra mensaje cuando no hay camas', async () => {
    render(<Beds role="enfermeria" />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Guardia' } });

    await waitFor(() => {
      const disponiblesElement = screen.getByText(/Disponibles/i).previousSibling;
      expect(disponiblesElement).toBeInTheDocument();
      
      const disponibles = parseInt(disponiblesElement.textContent || '0');
      const ocupadas = parseInt(screen.getByText(/Ocupadas/i).previousSibling?.textContent || '0');
      const enLimpieza = parseInt(screen.getByText(/En Limpieza/i).previousSibling?.textContent || '0');
      const total = disponibles + ocupadas + enLimpieza;
      
      console.log('📊 Estado actual de Guardia:', { disponibles, ocupadas, enLimpieza, total });
      
      // Si no hay camas, debe mostrar el mensaje
      if (total === 0) {
        const mensaje = screen.getByText(/No hay camas registradas en este sector/i);
        expect(mensaje).toBeInTheDocument();
      }
    }, { timeout: 10000 });
});


test('Caso de Prueba 4: El componente muestra 1 cama disponible en Terapia Intensiva', async () => {
  render(<Beds role="enfermeria" />);

  const select = screen.getByRole('combobox');
  fireEvent.change(select, { target: { value: 'Terapia Intensiva' } });

  await waitFor(() => {
    const noCamasMsg = screen.queryByText(/No hay camas registradas en este sector/i);
    expect(noCamasMsg).not.toBeInTheDocument();
  }, { timeout: 10000 });

  await waitFor(() => {
    
    const disponiblesElements = screen.getAllByText(/Disponibles/i);
    
    const contadorElement = disponiblesElements[0].previousSibling;
    const disponibles = parseInt(contadorElement.textContent || '0');
    
    console.log('📊 Disponibles en Terapia Intensiva (prueba):', disponibles);
    expect(disponibles).toBe(1);
  });
}, 15000);


 
test('Caso de Prueba 5: El componente muestra 1 cama disponible en Piso 2', async () => {
  render(<Beds role="enfermeria" />);

  const select = screen.getByRole('combobox');
  fireEvent.change(select, { target: { value: 'Piso 2' } });

  
  await waitFor(() => {

    // Verificar que NO aparece el mensaje de "No hay camas"
    const noCamasMsg = screen.queryByText(/No hay camas registradas en este sector/i);
    expect(noCamasMsg).not.toBeInTheDocument();
  }, { timeout: 10000 });

  // Verificar el contador de disponibles
  await waitFor(() => {
    // ✅ CORREGIDO: primero obtener el array, luego el primer elemento
    const disponiblesElements = screen.getAllByText(/Disponibles/i);
    const contadorElement = disponiblesElements[0].previousSibling;
    const disponibles = parseInt(contadorElement.textContent || '0');
    
    console.log('📊 Disponibles en Piso 2 (prueba):', disponibles);
    
    // Verificar que muestra 1 cama disponible
    expect(disponibles).toBe(1);
  });
}, 15000);


test('Caso de Prueba 6: El componente NO muestra mensaje cuando hay camas en Piso 2', async () => {
  render(<Beds role="enfermeria" />);

  const select = screen.getByRole('combobox');
  fireEvent.change(select, { target: { value: 'Piso 2' } });

  await waitFor(() => {
    const mensaje = screen.queryByText(/No hay camas registradas en este sector/i);
    expect(mensaje).not.toBeInTheDocument();
  }, { timeout: 10000 });
});
});