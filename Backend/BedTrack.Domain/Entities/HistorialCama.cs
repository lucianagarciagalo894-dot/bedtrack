namespace BedTrack.Domain.Entities;

public class HistorialCama
{
    public int Id { get; private set; }
    public int CamaId { get; private set; }
    public int CamaNumero { get; private set; }
    public int HabitacionId { get; private set; }
    public int HabitacionNumero { get; private set; }
    public string UsuarioNombre { get; private set; }
    public string UsuarioEmail { get; private set; }
    public string Accion { get; private set; }
    public string EstadoAnterior { get; private set; }
    public string EstadoNuevo { get; private set; }
    public DateTime FechaHora { get; private set; }

    public HistorialCama(
        int camaId,
        int camaNumero,
        int habitacionId,
        int habitacionNumero,
        string usuarioNombre,
        string usuarioEmail,
        string accion,
        string estadoAnterior,
        string estadoNuevo,
        DateTime? fechaHora = null)
    {
        CamaId = camaId;
        CamaNumero = camaNumero;
        HabitacionId = habitacionId;
        HabitacionNumero = habitacionNumero;
        UsuarioNombre = usuarioNombre;
        UsuarioEmail = usuarioEmail;
        Accion = accion;
        EstadoAnterior = estadoAnterior;
        EstadoNuevo = estadoNuevo;
        FechaHora = fechaHora ?? DateTime.UtcNow;
    }
}
