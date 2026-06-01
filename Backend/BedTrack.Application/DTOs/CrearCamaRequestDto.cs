using System.ComponentModel.DataAnnotations;

namespace BedTrack.Application.DTOs;

public class CrearCamaRequestDto
{
    [Required(ErrorMessage = "El número de cama es obligatorio.")]
    [MaxLength(50, ErrorMessage = "El número no puede exceder los 50 caracteres.")]
    public string Numero { get; set; } = string.Empty;

    [Required(ErrorMessage = "El sector es obligatorio.")]
    [MaxLength(100, ErrorMessage = "El sector no puede exceder los 100 caracteres.")]
    public string Sector { get; set; } = string.Empty;
}
