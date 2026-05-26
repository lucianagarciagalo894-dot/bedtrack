namespace BedTrack.Domain.Entities;

public class Cama
{
    // Las propiedades tienen 'private set' para que nadie las modifique libremente
    public int Id { get; private set; }
    public string Numero { get; private set; }
    public string Sector { get; private set; } // Ej: Pediatría, Guardia
    public string Estado { get; private set; } 

    // Constructor: Al crear una cama nueva en el sistema, por regla, nace "Disponible"
    public Cama(string numero, string sector)
    {
        Numero = numero;
        Sector = sector;
        Estado = "Disponible"; 
    }

    
    public void Ocupar()
    {
        if (Estado != "Disponible")
            throw new InvalidOperationException($"La cama {Numero} no se puede ocupar porque está en estado: {Estado}.");
        
        Estado = "Ocupada";
    }

    public void LiberarParaLimpieza()
    {
        if (Estado != "Ocupada")
            throw new InvalidOperationException($"La cama {Numero} debe estar ocupada para pasar a limpieza.");
        
        Estado = "En Limpieza";
    }

    public void Habilitar()
    {
        if (Estado != "En Limpieza")
            throw new InvalidOperationException($"La cama {Numero} debe ser limpiada antes de volver a estar disponible.");
        
        Estado = "Disponible";
    }
}