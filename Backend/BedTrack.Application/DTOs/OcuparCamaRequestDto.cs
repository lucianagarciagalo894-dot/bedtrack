using System.ComponentModel.DataAnnotations;

namespace BedTrack.Application.DTOs;

public class OcuparCamaRequestDto
{
    [Required(ErrorMessage = "El nombre del paciente es obligatorio.")]
    [MaxLength(150, ErrorMessage = "El nombre no puede exceder los 150 caracteres.")]
    public string NombrePaciente { get; set; } = string.Empty;

    [Required(ErrorMessage = "El registro del paciente es obligatorio.")]
    [MaxLength(50, ErrorMessage = "El registro no puede exceder los 50 caracteres.")]
    public string RegistroPaciente { get; set; } = string.Empty;

    [Required(ErrorMessage = "La patología es obligatoria.")]
    [MaxLength(200, ErrorMessage = "La patología no puede exceder los 200 caracteres.")]
    public string Patologia { get; set; } = string.Empty;

    [Required(ErrorMessage = "La fecha de ingreso es obligatoria.")]
    public DateTime FechaIngreso { get; set; }
}
