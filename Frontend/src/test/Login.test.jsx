import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Login from '../pages/Login';


vi.mock('react-icons/fa', () => ({
  FaHospitalAlt: () => <span data-testid="fa-hospital">FaHospitalAlt</span>
}));

describe('Componente Login', () => {

  test('Caso 1: el componente se renderiza con todos los elementos del formulario', () => {
    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

    
    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
    expect(screen.getByText('Ingresá con tu cuenta institucional')).toBeInTheDocument();


    expect(screen.getByLabelText('Tipo de Usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Correo Electrónico')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();

  
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument();

    
    const select = screen.getByLabelText('Tipo de Usuario');
    expect(within(select).getByText('Enfermería')).toBeInTheDocument();
    expect(within(select).getByText('Administrador')).toBeInTheDocument();
  });

  test('Caso 2: el rol por defecto es "enfermeria" y el select lo muestra correctamente', () => {
    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

    const select = screen.getByLabelText('Tipo de Usuario');
    expect(select).toHaveValue('enfermeria');
  });

  test('Caso 3: muestra errores de validación al enviar con campos vacíos o inválidos', () => {
    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

    
    const button = screen.getByRole('button', { name: 'Ingresar' });
    fireEvent.click(button);

    
    expect(screen.getByText('Ingresá un correo Gmail válido (ejemplo@gmail.com)')).toBeInTheDocument();
    expect(screen.getByText('La contraseña debe tener al menos 4 caracteres')).toBeInTheDocument();

    
    expect(screen.getByLabelText('Correo Electrónico')).toHaveClass('input-error');
    expect(screen.getByLabelText('Contraseña')).toHaveClass('input-error');

    
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('Caso 4: valida que el email debe contener "@gmail.com"', () => {
    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

   
    const emailInput = screen.getByLabelText('Correo Electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    
    fireEvent.change(emailInput, { target: { value: 'usuario@hotmail.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });

    const button = screen.getByRole('button', { name: 'Ingresar' });
    fireEvent.click(button);

    
    expect(screen.getByText('Ingresá un correo Gmail válido (ejemplo@gmail.com)')).toBeInTheDocument();
    expect(screen.queryByText('La contraseña debe tener al menos 4 caracteres')).not.toBeInTheDocument();
    
 
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('Caso 5: valida que la contraseña tenga al menos 4 caracteres', () => {
    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

    
    const emailInput = screen.getByLabelText('Correo Electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    
    fireEvent.change(emailInput, { target: { value: 'usuario@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });

    const button = screen.getByRole('button', { name: 'Ingresar' });
    fireEvent.click(button);

    
    expect(screen.queryByText('Ingresá un correo Gmail válido (ejemplo@gmail.com)')).not.toBeInTheDocument();
    expect(screen.getByText('La contraseña debe tener al menos 4 caracteres')).toBeInTheDocument();
    
   
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('Caso 6: envía el formulario correctamente cuando todos los campos son válidos', () => {
    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

   
    const emailInput = screen.getByLabelText('Correo Electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    const select = screen.getByLabelText('Tipo de Usuario');
    
    fireEvent.change(emailInput, { target: { value: 'usuario@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });
    fireEvent.change(select, { target: { value: 'admin' } });

    const button = screen.getByRole('button', { name: 'Ingresar' });
    fireEvent.click(button);

    
    expect(screen.queryByText('Ingresá un correo Gmail válido (ejemplo@gmail.com)')).not.toBeInTheDocument();
    expect(screen.queryByText('La contraseña debe tener al menos 4 caracteres')).not.toBeInTheDocument();
    
    
    expect(mockOnLogin).toHaveBeenCalledWith('admin');
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  test('Caso 7: al presionar Enter en un campo, se dispara el login', () => {
    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

    
    const emailInput = screen.getByLabelText('Correo Electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    
    fireEvent.change(emailInput, { target: { value: 'usuario@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: '12345' } });

    
    fireEvent.keyDown(emailInput, { key: 'Enter', code: 'Enter' });

    
    expect(mockOnLogin).toHaveBeenCalledWith('enfermeria');
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  test('Caso 8: los errores se limpian al modificar el campo correspondiente', () => {
    const mockOnLogin = vi.fn();
    render(<Login onLogin={mockOnLogin} />);

    
    const button = screen.getByRole('button', { name: 'Ingresar' });
    fireEvent.click(button);

    
    const emailError = screen.getByText('Ingresá un correo Gmail válido (ejemplo@gmail.com)');
    const passwordError = screen.getByText('La contraseña debe tener al menos 4 caracteres');
    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();

    
    const emailInput = screen.getByLabelText('Correo Electrónico');
    const passwordInput = screen.getByLabelText('Contraseña');
    expect(emailInput).toHaveClass('input-error');
    expect(passwordInput).toHaveClass('input-error');

    
    fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });

    
    expect(screen.queryByText('Ingresá un correo Gmail válido (ejemplo@gmail.com)')).not.toBeInTheDocument();
    
    expect(screen.getByText('La contraseña debe tener al menos 4 caracteres')).toBeInTheDocument();
    
    
    expect(emailInput).not.toHaveClass('input-error');
    expect(passwordInput).toHaveClass('input-error');

    
    fireEvent.change(passwordInput, { target: { value: '1234' } });

    
    expect(screen.queryByText('Ingresá un correo Gmail válido (ejemplo@gmail.com)')).not.toBeInTheDocument();
    expect(screen.queryByText('La contraseña debe tener al menos 4 caracteres')).not.toBeInTheDocument();
    
    
    expect(emailInput).not.toHaveClass('input-error');
    expect(passwordInput).not.toHaveClass('input-error');
  });

});