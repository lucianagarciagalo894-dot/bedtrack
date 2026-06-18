using BedTrack.Application.DTOs;
using BedTrack.Application.Interfaces;
using BedTrack.Domain.Entities;
using BedTrack.Domain.Enums;

namespace BedTrack.Application.Services;

public class HospitalService : IHospitalService
{
    private readonly IHospitalRepository _repo;

    public HospitalService(IHospitalRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<PisoDto>> GetFloorsAsync()
    {
        var pisos = await _repo.ObtenerPisosAsync();
        return pisos.Select(p => new PisoDto
        {
            Id = p.Id,
            Nombre = p.Nombre,
            Tipo = p.Tipo,
            TipoKey = p.TipoKey,
            RoomCount = p.Habitaciones.Count
        });
    }

    public async Task<IEnumerable<HabitacionDto>> GetAllRoomsAsync()
    {
        var habitaciones = await _repo.ObtenerHabitacionesAsync();
        return habitaciones.Select(MapToHabitacionDto);
    }

    public async Task<IEnumerable<HabitacionDto>> GetRoomsByFloorAsync(int floorId)
    {
        var habitaciones = await _repo.ObtenerHabitacionesPorPisoAsync(floorId);
        return habitaciones.Select(MapToHabitacionDto);
    }

    public async Task<HabitacionDto?> GetRoomByIdAsync(int roomId)
    {
        var h = await _repo.ObtenerHabitacionPorIdAsync(roomId);
        if (h == null) return null;
        return MapToHabitacionDto(h);
    }

    public async Task<CamaDto> UpdateBedStatusAsync(int bedId, UpdateBedStatusDto request)
    {
        var cama = await _repo.ObtenerCamaPorIdAsync(bedId);
        if (cama == null) throw new KeyNotFoundException("Cama no encontrada");

        var estadoStr = request.Status.ToLower();

        if (estadoStr == "ocupada")
        {
            if (request.Patient == null) throw new ArgumentException("Faltan datos del paciente");
            
            var paciente = new Paciente(
                request.Patient.Nombre,
                request.Patient.Apellido,
                request.Patient.Edad,
                request.Patient.Diagnostico,
                DateTime.Parse(request.Patient.FechaIngreso).ToUniversalTime()
            );
            
            await _repo.AgregarPacienteAsync(paciente);
            await _repo.GuardarCambiosAsync(); // Para generar el Id

            cama.Ocupar(paciente.Id);
        }
        else if (estadoStr == "limpieza")
        {
            if (cama.Paciente != null)
            {
                _repo.EliminarPaciente(cama.Paciente);
            }
            cama.LiberarParaLimpieza();
        }
        else if (estadoStr == "disponible")
        {
            if (cama.Estado == EstadoCama.Ocupada && cama.Paciente != null)
            {
                _repo.EliminarPaciente(cama.Paciente);
                cama.LiberarParaLimpieza();
            }
            if (cama.Estado == EstadoCama.EnLimpieza)
            {
                cama.Habilitar();
            }
        }

        await _repo.GuardarCambiosAsync();

        return new CamaDto
        {
            Id = cama.Id,
            Number = cama.Numero,
            Status = estadoStr,
            Patient = request.Patient
        };
    }

    private HabitacionDto MapToHabitacionDto(Habitacion h)
    {
        return new HabitacionDto
        {
            Id = h.Id,
            Number = h.Piso.Id * 100 + h.Numero,
            FloorId = h.PisoId,
            Floor = h.Piso?.Nombre ?? "",
            Type = h.Piso?.Tipo ?? "",
            TypeKey = h.Piso?.TipoKey ?? "",
            Beds = h.Camas.Select(c => new CamaDto
            {
                Id = c.Id,
                Number = c.Numero,
                Status = c.Estado.ToString().ToLower(),
                Patient = c.Paciente == null ? null : new PacienteDto
                {
                    Id = c.Paciente.Id,
                    Nombre = c.Paciente.Nombre,
                    Apellido = c.Paciente.Apellido,
                    Edad = c.Paciente.Edad,
                    Diagnostico = c.Paciente.Diagnostico,
                    FechaIngreso = c.Paciente.FechaIngreso.ToString("yyyy-MM-dd"),
                    DiasInternacion = (DateTime.UtcNow - c.Paciente.FechaIngreso).Days
                }
            }).ToList()
        };
    }
}
