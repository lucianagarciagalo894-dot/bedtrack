namespace BedTrack.Application.DTOs;

public class CamaResponseDto
{
    public int Id { get; set; }
    public string Numero { get; set; } = string.Empty;
    public string Sector { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    
    // Datos del Paciente
    public string? NombrePaciente { get; set; }
    public string? RegistroPaciente { get; set; }
    public string? Patologia { get; set; }
    public DateTime? FechaIngreso { get; set; }
    
    // Propiedad Calculada para el Frontend
    public int? DiasInternacion { get; set; }
}
