namespace BedTrack.Application.DTOs;

public class PisoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public string TipoKey { get; set; } = string.Empty;
    public int RoomCount { get; set; }
    public int BedsPerRoom { get; set; }
    public string Label => Nombre; // Frontend expects "label" mapping sometimes or we can map it in frontend
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
}
