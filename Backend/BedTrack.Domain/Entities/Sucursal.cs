namespace BedTrack.Domain.Entities;

public class Sucursal
{
    public int Id { get; private set; }
    public string Nombre { get; private set; }
    public string Direccion { get; private set; }

    public int NosocomioId { get; private set; }
    public Nosocomio Nosocomio { get; private set; } = null!;

    public ICollection<Piso> Pisos { get; private set; } = new List<Piso>();

    public Sucursal(string nombre, string direccion, int nosocomioId)
    {
        Nombre = nombre;
        Direccion = direccion;
        NosocomioId = nosocomioId;
    }

    public void ActualizarDatos(string nombre, string direccion)
    {
        Nombre = nombre;
        Direccion = direccion;
    }
}
