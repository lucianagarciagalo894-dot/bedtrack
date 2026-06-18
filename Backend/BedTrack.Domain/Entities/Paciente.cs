namespace BedTrack.Domain.Entities;

public class Paciente
{
    public int Id { get; private set; }
    public string Nombre { get; private set; }
    public string Apellido { get; private set; }
    public int Edad { get; private set; }
    public string Diagnostico { get; private set; }
    public DateTime FechaIngreso { get; private set; }

    public Cama? Cama { get; private set; }

    public Paciente(string nombre, string apellido, int edad, string diagnostico, DateTime fechaIngreso)
    {
        Nombre = nombre;
        Apellido = apellido;
        Edad = edad;
        Diagnostico = diagnostico;
        FechaIngreso = fechaIngreso;
    }
}
