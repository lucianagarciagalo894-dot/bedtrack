namespace BedTrack.Application.DTOs;

public class PisoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string TipoKey { get; set; } = string.Empty;
    public int RoomCount { get; set; }
    public int BedsPerRoom { get; set; }
    public string Label => Nombre;
}

public class HabitacionDto
{
    public int Id { get; set; }
    public int Number { get; set; }
    public int FloorId { get; set; }
    public string Floor { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string TypeKey { get; set; } = string.Empty;
    public List<CamaDto> Beds { get; set; } = new();
}

public class CamaDto
{
    public int Id { get; set; }
    public int Number { get; set; }
    public string Status { get; set; } = string.Empty;
    public PacienteDto? Patient { get; set; }
}

public class PacienteDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Apellido { get; set; } = string.Empty;
    public int Edad { get; set; }
    public string Diagnostico { get; set; } = string.Empty;
    public string FechaIngreso { get; set; } = string.Empty;
    public int DiasInternacion { get; set; }
}

public class UpdateBedStatusDto
{
    public string Status { get; set; } = string.Empty;
    public PacienteDto? Patient { get; set; }
    public string? OperatorName { get; set; }
    public string? OperatorEmail { get; set; }
    public string? OperatorRole { get; set; }
}

public class UsuarioStaffDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public int? NosocomioId { get; set; }
    public int? SucursalId { get; set; }
    public bool Activo { get; set; } = true;
    public string HospitalNombre { get; set; } = string.Empty;
}

public class CreateUsuarioStaffDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Rol { get; set; } = "enfermeria";
    public int? NosocomioId { get; set; }
    public int? SucursalId { get; set; }
}

public class UpdateUsuarioStaffDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Rol { get; set; } = "enfermeria";
    public bool Activo { get; set; } = true;
    public int? NosocomioId { get; set; }
    public int? SucursalId { get; set; }
}

public class StaffLoginRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public int? NosocomioId { get; set; }
    public int? SucursalId { get; set; }
    public string Rol { get; set; } = string.Empty;
}

public class StaffLoginResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public UsuarioStaffDto? User { get; set; }
    public string Token { get; set; } = string.Empty;
}

public class HistorialCamaDto
{
    public int Id { get; set; }
    public int CamaId { get; set; }
    public int CamaNumero { get; set; }
    public int HabitacionId { get; set; }
    public int HabitacionNumero { get; set; }
    public string UsuarioNombre { get; set; } = string.Empty;
    public string UsuarioEmail { get; set; } = string.Empty;
    public string UsuarioRol { get; set; } = string.Empty;
    public string Accion { get; set; } = string.Empty;
    public string EstadoAnterior { get; set; } = string.Empty;
    public string EstadoNuevo { get; set; } = string.Empty;
    public string FechaHora { get; set; } = string.Empty;
}

public class NosocomioDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Codigo { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public List<SucursalDto> Sucursales { get; set; } = new();
}

public class SucursalDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public int NosocomioId { get; set; }
}

public class CreateNosocomioDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Codigo { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
}

public class UpdateNosocomioDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Codigo { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
}

public class CreateSucursalDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public int NosocomioId { get; set; }
}

public class UpdateSucursalDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
}

public class CreatePisoDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = "General";
    public string TipoKey { get; set; } = "general";
    public int SucursalId { get; set; }
}

public class UpdatePisoDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = "General";
    public string TipoKey { get; set; } = "general";
}

public class CreateHabitacionDto
{
    public int Numero { get; set; }
    public int PisoId { get; set; }
    public int CantidadCamasInicial { get; set; } = 1;
}

public class UpdateHabitacionDto
{
    public int Numero { get; set; }
    public int PisoId { get; set; }
}

public class CreateCamaDto
{
    public int Numero { get; set; }
    public int HabitacionId { get; set; }
    public string Status { get; set; } = "disponible";
}

public class UpdateCamaDto
{
    public int Numero { get; set; }
    public int HabitacionId { get; set; }
    public string Status { get; set; } = "disponible";
}

public class DevLoginRequestDto
{
    public string Email { get; set; } = string.Empty;
    public string DevKey { get; set; } = string.Empty;
}

public class DevLoginResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Role { get; set; } = "superadmin";
    public string Token { get; set; } = string.Empty;
}

public class FloorConfigDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string TipoKey { get; set; } = string.Empty;
    public int CantidadHabitaciones { get; set; } = 5;
    public int CamasPorHabitacion { get; set; } = 2;
}

public class FullHospitalSetupDto
{
    public string NombreNosocomio { get; set; } = string.Empty;
    public string CodigoNosocomio { get; set; } = string.Empty;
    public string DireccionNosocomio { get; set; } = string.Empty;
    public string NombreSucursal { get; set; } = string.Empty;
    public string DireccionSucursal { get; set; } = string.Empty;
    public List<FloorConfigDto> Pisos { get; set; } = new();
}


