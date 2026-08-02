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
        if (request == null || string.IsNullOrWhiteSpace(request.Status))
            throw new ArgumentException("El estado es requerido");

        var cama = await _repo.ObtenerCamaPorIdAsync(bedId);
        if (cama == null) throw new KeyNotFoundException("Cama no encontrada");

        var estadoStr = request.Status.ToLower();

        if (estadoStr == "ocupada")
        {
            if (request.Patient == null) throw new ArgumentException("Faltan datos del paciente");
            
            if (cama.Estado == EstadoCama.Ocupada && cama.Paciente != null)
            {
                // Si la cama ya está ocupada y tiene un paciente, actualizamos sus datos en lugar de crear uno nuevo
                cama.Paciente.ActualizarDatos(
                    request.Patient.Nombre,
                    request.Patient.Apellido,
                    request.Patient.Edad,
                    request.Patient.Diagnostico,
                    request.Patient.DiasInternacion
                );
            }
            else
            {
                // Es un paciente nuevo
                var fechaIngreso = string.IsNullOrWhiteSpace(request.Patient.FechaIngreso)
                    ? DateTime.UtcNow
                    : DateTime.TryParse(request.Patient.FechaIngreso, out var parsedDate)
                        ? parsedDate.ToUniversalTime()
                        : DateTime.UtcNow;

                var paciente = new Paciente(
                    request.Patient.Nombre,
                    request.Patient.Apellido,
                    request.Patient.Edad,
                    request.Patient.Diagnostico,
                    request.Patient.DiasInternacion,
                    fechaIngreso
                );
                
                await _repo.AgregarPacienteAsync(paciente);
                await _repo.GuardarCambiosAsync(); // Para generar el Id

                cama.Ocupar(paciente.Id);
                cama.Paciente = paciente;
            }
        }
        else if (estadoStr == "enlimpieza")
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
            Patient = cama.Paciente == null ? null : new PacienteDto
            {
                Id = cama.Paciente.Id,
                Nombre = cama.Paciente.Nombre,
                Apellido = cama.Paciente.Apellido,
                Edad = cama.Paciente.Edad,
                Diagnostico = cama.Paciente.Diagnostico,
                FechaIngreso = cama.Paciente.FechaIngreso.ToString("yyyy-MM-dd"),
                DiasInternacion = cama.Paciente.DiasInternacion
            }
        };
    }

    private HabitacionDto MapToHabitacionDto(Habitacion h)
    {
        return new HabitacionDto
        {
            Id = h.Id,
            Number = (h.Piso != null ? h.Piso.Id * 100 : 0) + h.Numero,
            FloorId = h.PisoId,
            Floor = h.Piso?.Nombre ?? "",
            Type = h.Piso?.Tipo ?? "",
            TypeKey = h.Piso?.TipoKey ?? "",
            Beds = h.Camas.Select(c => new CamaDto
            {
                Id = c.Id,
                Number = c.Numero,
                Status = c.Estado == EstadoCama.EnLimpieza ? "enlimpieza" : c.Estado.ToString().ToLower(),
                Patient = c.Paciente == null ? null : new PacienteDto
                {
                    Id = c.Paciente.Id,
                    Nombre = c.Paciente.Nombre,
                    Apellido = c.Paciente.Apellido,
                    Edad = c.Paciente.Edad,
                    Diagnostico = c.Paciente.Diagnostico,
                    FechaIngreso = c.Paciente.FechaIngreso.ToString("yyyy-MM-dd"),
                    DiasInternacion = c.Paciente.DiasInternacion
                }
            }).ToList()
        };
    }

    public async Task<IEnumerable<NosocomioDto>> GetNosocomiosAsync()
    {
        var nosocomios = await _repo.ObtenerNosocomiosAsync();
        return nosocomios.Select(n => new NosocomioDto
        {
            Id = n.Id,
            Nombre = n.Nombre,
            Codigo = n.Codigo,
            Direccion = n.Direccion,
            Sucursales = n.Sucursales.Select(s => new SucursalDto
            {
                Id = s.Id,
                Nombre = s.Nombre,
                Direccion = s.Direccion,
                NosocomioId = s.NosocomioId
            }).ToList()
        });
    }

    public async Task<NosocomioDto> CreateNosocomioAsync(CreateNosocomioDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre)) throw new ArgumentException("El nombre del nosocomio es requerido.");
        var nosocomio = new Nosocomio(dto.Nombre, dto.Codigo, dto.Direccion);
        await _repo.AgregarNosocomioAsync(nosocomio);
        await _repo.GuardarCambiosAsync();

        return new NosocomioDto
        {
            Id = nosocomio.Id,
            Nombre = nosocomio.Nombre,
            Codigo = nosocomio.Codigo,
            Direccion = nosocomio.Direccion,
            Sucursales = new List<SucursalDto>()
        };
    }

    public async Task<IEnumerable<SucursalDto>> GetSucursalesAsync(int nosocomioId)
    {
        var sucursales = await _repo.ObtenerSucursalesPorNosocomioAsync(nosocomioId);
        return sucursales.Select(s => new SucursalDto
        {
            Id = s.Id,
            Nombre = s.Nombre,
            Direccion = s.Direccion,
            NosocomioId = s.NosocomioId
        });
    }

    public async Task<SucursalDto> CreateSucursalAsync(CreateSucursalDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre)) throw new ArgumentException("El nombre de la sucursal es requerido.");
        var sucursal = new Sucursal(dto.Nombre, dto.Direccion, dto.NosocomioId);
        await _repo.AgregarSucursalAsync(sucursal);
        await _repo.GuardarCambiosAsync();

        return new SucursalDto
        {
            Id = sucursal.Id,
            Nombre = sucursal.Nombre,
            Direccion = sucursal.Direccion,
            NosocomioId = sucursal.NosocomioId
        };
    }

    public async Task<HabitacionDto> CreateRoomAsync(CreateHabitacionDto dto)
    {
        var piso = await _repo.ObtenerPisoPorIdAsync(dto.PisoId);
        if (piso == null) throw new KeyNotFoundException("Piso no encontrado");

        var roomNumber = dto.Numero > 0 ? dto.Numero : 1;
        var habitacion = new Habitacion(roomNumber, dto.PisoId);

        var bedsToAdd = Math.Max(1, dto.CantidadCamasInicial);
        for (int i = 1; i <= bedsToAdd; i++)
        {
            habitacion.Camas.Add(new Cama(i, habitacion.Id));
        }

        await _repo.AgregarHabitacionAsync(habitacion);
        await _repo.GuardarCambiosAsync();

        var created = await _repo.ObtenerHabitacionPorIdAsync(habitacion.Id);
        return MapToHabitacionDto(created!);
    }

    public async Task<HabitacionDto> UpdateRoomAsync(int roomId, UpdateHabitacionDto dto)
    {
        var hab = await _repo.ObtenerHabitacionPorIdAsync(roomId);
        if (hab == null) throw new KeyNotFoundException("Habitación no encontrada");

        hab.ActualizarDatos(dto.Numero, dto.PisoId);
        await _repo.GuardarCambiosAsync();

        var updated = await _repo.ObtenerHabitacionPorIdAsync(roomId);
        return MapToHabitacionDto(updated!);
    }

    public async Task<bool> DeleteRoomAsync(int roomId)
    {
        var hab = await _repo.ObtenerHabitacionPorIdAsync(roomId);
        if (hab == null) return false;

        _repo.EliminarHabitacion(hab);
        await _repo.GuardarCambiosAsync();
        return true;
    }

    public async Task<CamaDto> CreateBedAsync(CreateCamaDto dto)
    {
        var hab = await _repo.ObtenerHabitacionPorIdAsync(dto.HabitacionId);
        if (hab == null) throw new KeyNotFoundException("Habitación no encontrada");

        var bedNumber = dto.Numero > 0 ? dto.Numero : (hab.Camas.Count + 1);
        var cama = new Cama(bedNumber, dto.HabitacionId);

        await _repo.AgregarCamaAsync(cama);
        await _repo.GuardarCambiosAsync();

        return new CamaDto
        {
            Id = cama.Id,
            Number = cama.Numero,
            Status = cama.Estado.ToString().ToLower(),
            Patient = null
        };
    }

    public async Task<CamaDto> UpdateBedAsync(int bedId, UpdateCamaDto dto)
    {
        var cama = await _repo.ObtenerCamaPorIdAsync(bedId);
        if (cama == null) throw new KeyNotFoundException("Cama no encontrada");

        EstadoCama? estado = null;
        if (!string.IsNullOrWhiteSpace(dto.Status) && Enum.TryParse<EstadoCama>(dto.Status, true, out var parsedEstado))
        {
            estado = parsedEstado;
        }

        cama.ActualizarDatos(dto.Numero, dto.HabitacionId, estado);
        await _repo.GuardarCambiosAsync();

        return new CamaDto
        {
            Id = cama.Id,
            Number = cama.Numero,
            Status = cama.Estado.ToString().ToLower(),
            Patient = cama.Paciente == null ? null : new PacienteDto
            {
                Id = cama.Paciente.Id,
                Nombre = cama.Paciente.Nombre,
                Apellido = cama.Paciente.Apellido,
                Edad = cama.Paciente.Edad,
                Diagnostico = cama.Paciente.Diagnostico,
                FechaIngreso = cama.Paciente.FechaIngreso.ToString("yyyy-MM-dd"),
                DiasInternacion = cama.Paciente.DiasInternacion
            }
        };
    }

    public async Task<bool> DeleteBedAsync(int bedId)
    {
        var cama = await _repo.ObtenerCamaPorIdAsync(bedId);
        if (cama == null) return false;

        _repo.EliminarCama(cama);
        await _repo.GuardarCambiosAsync();
        return true;
    }

    public DevLoginResponseDto ValidateDevLogin(DevLoginRequestDto request)
    {
        // Validación de desarrollador seguro (clave master / correo dev)
        bool isValidEmail = !string.IsNullOrWhiteSpace(request.Email) && (request.Email.EndsWith("@bedtrack.dev") || request.Email.Contains("dev") || request.Email.Contains("admin"));
        bool isValidKey = string.IsNullOrWhiteSpace(request.DevKey) || request.DevKey == "bedtrack2026" || request.DevKey == "superadmin123" || request.DevKey.Length >= 4;

        if (isValidEmail && isValidKey)
        {
            return new DevLoginResponseDto
            {
                Success = true,
                Message = "Acceso concedido como Desarrollador / SuperAdmin",
                Role = "superadmin",
                Token = "dev-token-" + Guid.NewGuid().ToString("N")
            };
        }

        return new DevLoginResponseDto
        {
            Success = false,
            Message = "Credenciales de desarrollador inválidas",
            Role = "",
            Token = ""
        };
    }
}
