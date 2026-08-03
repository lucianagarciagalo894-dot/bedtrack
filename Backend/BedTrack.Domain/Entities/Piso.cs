namespace BedTrack.Domain.Entities;

public class Piso
{
    public int Id { get; private set; }
    public string Nombre { get; private set; }
    public string Tipo { get; private set; }
    public string TipoKey { get; private set; }

    public int? SucursalId { get; private set; }
    public Sucursal? Sucursal { get; private set; }

    public ICollection<Habitacion> Habitaciones { get; private set; } = new List<Habitacion>();

    public Piso(string nombre, string tipo, string tipoKey, int? sucursalId = null)
    {
        Nombre = nombre;
        Tipo = tipo;
        TipoKey = tipoKey;
        SucursalId = sucursalId;
    }

    public void AsignarSucursal(int sucursalId)
    {
        SucursalId = sucursalId;
    }

    public void ActualizarDatos(string nombre, string tipo, string tipoKey)
    {
        Nombre = nombre;
        Tipo = tipo;
        TipoKey = tipoKey;
    }
}
