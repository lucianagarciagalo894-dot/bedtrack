namespace BedTrack.Domain.Entities;

public class Nosocomio
{
    public int Id { get; private set; }
    public string Nombre { get; private set; }
    public string Codigo { get; private set; }
    public string Direccion { get; private set; }

    public ICollection<Sucursal> Sucursales { get; private set; } = new List<Sucursal>();

    public Nosocomio(string nombre, string codigo, string direccion)
    {
        Nombre = nombre;
        Codigo = codigo;
        Direccion = direccion;
    }

    public void ActualizarDatos(string nombre, string codigo, string direccion)
    {
        Nombre = nombre;
        Codigo = codigo;
        Direccion = direccion;
    }
}
