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
    public string UsuarioRol { get; private set; }
    public string Accion { get; private set; }
    public string EstadoAnterior { get; private set; }
    public string EstadoNuevo { get; private set; }
    public int? SucursalId { get; private set; }
    public int? NosocomioId { get; private set; }
    public DateTime FechaHora { get; private set; }

    private HistorialCama()
    {
        UsuarioNombre = string.Empty;
        UsuarioEmail = string.Empty;
        UsuarioRol = string.Empty;
        Accion = string.Empty;
        EstadoAnterior = string.Empty;
        EstadoNuevo = string.Empty;
    }

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
        DateTime? fechaHora = null,
        string? usuarioRol = null,
        int? sucursalId = null,
        int? nosocomioId = null)
    {
        CamaId = camaId;
        CamaNumero = camaNumero;
        HabitacionId = habitacionId;
        HabitacionNumero = habitacionNumero;
        UsuarioNombre = usuarioNombre;
        UsuarioEmail = usuarioEmail;
        UsuarioRol = usuarioRol ?? "enfermeria";
        Accion = accion;
        EstadoAnterior = estadoAnterior;
        EstadoNuevo = estadoNuevo;
        FechaHora = fechaHora ?? DateTime.UtcNow;
        SucursalId = sucursalId;
        NosocomioId = nosocomioId;
    }
}
