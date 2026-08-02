using BedTrack.Domain.Enums;

namespace BedTrack.Domain.Entities;

public class Cama
{
    public int Id { get; private set; }
    public int Numero { get; private set; }
    public EstadoCama Estado { get; private set; } 
    
    public int HabitacionId { get; private set; }
    public Habitacion Habitacion { get; private set; } = null!;

    public int? PacienteId { get; private set; }
    public Paciente? Paciente { get; set; }

    public Cama(int numero, int habitacionId)
    {
        Numero = numero;
        HabitacionId = habitacionId;
        Estado = EstadoCama.Disponible; 
    }

    public void Ocupar(int pacienteId)
    {
        if (Estado != EstadoCama.Disponible && Estado != EstadoCama.EnLimpieza)
            throw new InvalidOperationException($"La cama {Numero} no se puede ocupar porque está en estado: {Estado}.");
        
        Estado = EstadoCama.Ocupada;
        PacienteId = pacienteId;
    }

    public void LiberarParaLimpieza()
    {
        Estado = EstadoCama.EnLimpieza;
        PacienteId = null;
        Paciente = null;
    }

    public void Habilitar()
    {
        Estado = EstadoCama.Disponible;
        PacienteId = null;
        Paciente = null;
    }

    public void ActualizarDatos(int numero, int habitacionId, EstadoCama? estado = null)
    {
        Numero = numero;
        HabitacionId = habitacionId;
        if (estado.HasValue)
        {
            Estado = estado.Value;
        }
    }
}