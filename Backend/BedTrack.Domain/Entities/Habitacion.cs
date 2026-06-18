namespace BedTrack.Domain.Entities;

public class Habitacion
{
    public int Id { get; private set; }
    public int Numero { get; private set; }
    public int PisoId { get; private set; }
    public Piso Piso { get; private set; } = null!;

    public ICollection<Cama> Camas { get; private set; } = new List<Cama>();

    public Habitacion(int numero, int pisoId)
    {
        Numero = numero;
        PisoId = pisoId;
    }
}
