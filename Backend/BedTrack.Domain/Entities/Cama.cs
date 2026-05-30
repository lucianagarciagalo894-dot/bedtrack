using BedTrack.Domain.Enums;

namespace BedTrack.Domain.Entities;

public class Cama
{
    // Las propiedades tienen 'private set' para que nadie las modifique libremente
    public int Id { get; private set; }
    public string Numero { get; private set; }
    public string Sector { get; private set; } // Ej: Pediatría, Guardia
    public EstadoCama Estado { get; private set; } 
    
    // Datos del Paciente
    public string? NombrePaciente { get; private set; }
    public string? RegistroPaciente { get; private set; }
    public string? Patologia { get; private set; }
    public DateTime? FechaIngreso { get; private set; }

    // Concurrencia Optimista
    public byte[] RowVersion { get; private set; }

    // Constructor: Al crear una cama nueva en el sistema, por regla, nace "Disponible"
    public Cama(string numero, string sector)
    {
        Numero = numero;
        Sector = sector;
        Estado = EstadoCama.Disponible; 
    }

    public void Ocupar(string nombrePaciente, string registroPaciente, string patologia, DateTime fechaIngreso)
    {
        if (Estado != EstadoCama.Disponible)
            throw new InvalidOperationException($"La cama {Numero} no se puede ocupar porque está en estado: {Estado}.");
        
        Estado = EstadoCama.Ocupada;
        NombrePaciente = nombrePaciente;
        RegistroPaciente = registroPaciente;
        Patologia = patologia;
        FechaIngreso = fechaIngreso;
    }

    public void LiberarParaLimpieza()
    {
        if (Estado != EstadoCama.Ocupada)
            throw new InvalidOperationException($"La cama {Numero} debe estar ocupada para pasar a limpieza.");
        
        Estado = EstadoCama.EnLimpieza;
        // Limpiamos los datos del paciente al desocupar la cama
        NombrePaciente = null;
        RegistroPaciente = null;
        Patologia = null;
        FechaIngreso = null;
    }

    public void Habilitar()
    {
        if (Estado != EstadoCama.EnLimpieza)
            throw new InvalidOperationException($"La cama {Numero} debe ser limpiada antes de volver a estar disponible.");
        
        Estado = EstadoCama.Disponible;
    }
}