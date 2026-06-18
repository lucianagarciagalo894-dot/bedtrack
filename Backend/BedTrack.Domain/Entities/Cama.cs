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
        if (Estado != EstadoCama.Disponible)
            throw new InvalidOperationException($"La cama {Numero} no se puede ocupar porque está en estado: {Estado}.");
        
        Estado = EstadoCama.Ocupada;
        PacienteId = pacienteId;
    }

    public void LiberarParaLimpieza()
    {
        if (Estado != EstadoCama.Ocupada)
            throw new InvalidOperationException($"La cama {Numero} debe estar ocupada para pasar a limpieza.");
        
        Estado = EstadoCama.EnLimpieza;
        PacienteId = null;
    }

    public void Habilitar()
    {
        if (Estado != EstadoCama.EnLimpieza)
            throw new InvalidOperationException($"La cama {Numero} debe ser limpiada antes de volver a estar disponible.");
        
        Estado = EstadoCama.Disponible;
    }
}