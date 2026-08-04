namespace BedTrack.Domain.Entities;

public class UsuarioStaff
{
    public int Id { get; private set; }
    public string Nombre { get; private set; }
    public string Email { get; private set; }
    public string Password { get; private set; }
    public string Rol { get; private set; }
    public int? NosocomioId { get; private set; }
    public int? SucursalId { get; private set; }
    public bool Activo { get; private set; }

    public Nosocomio? Nosocomio { get; private set; }
    public Sucursal? Sucursal { get; private set; }

    private UsuarioStaff()
    {
        Nombre = string.Empty;
        Email = string.Empty;
        Password = string.Empty;
        Rol = string.Empty;
    }

    public static string NormalizarRol(string? rol)
    {
        if (string.IsNullOrWhiteSpace(rol)) return "enfermeria";
        var clean = rol.Trim().ToLowerInvariant();
        clean = clean.Replace("á", "a").Replace("é", "e").Replace("í", "i").Replace("ó", "o").Replace("ú", "u");
        if (clean.Contains("enferm") || clean.Contains("nurse")) return "enfermeria";
        if (clean.Contains("encargad") || clean.Contains("admin")) return "encargado";
        return clean;
    }

    public UsuarioStaff(string nombre, string email, string password, string rol, int? nosocomioId = null, int? sucursalId = null)
    {
        Nombre = nombre;
        Email = email;
        Password = password;
        Rol = NormalizarRol(rol);
        NosocomioId = nosocomioId;
        SucursalId = sucursalId;
        Activo = true;
    }

    public void ActualizarDatos(string nombre, string email, string password, string rol, bool activo, int? nosocomioId = null, int? sucursalId = null)
    {
        Nombre = nombre;
        Email = email;
        if (!string.IsNullOrWhiteSpace(password)) Password = password;
        Rol = NormalizarRol(rol);
        Activo = activo;
        NosocomioId = nosocomioId;
        SucursalId = sucursalId;
    }

    public void ToggleActivo()
    {
        Activo = !Activo;
    }
}
