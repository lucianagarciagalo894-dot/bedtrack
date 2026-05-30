using BedTrack.Application.DTOs;
using BedTrack.Application.Interfaces;
using BedTrack.Domain.Entities;
using System.Text.RegularExpressions;

namespace BedTrack.Application.Services;

public class CamaService : ICamaService
{
    private readonly ICamaRepository _repository;

    public CamaService(ICamaRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CamaResponseDto>> ObtenerTodasAsync()
    {
        var camas = await _repository.ObtenerTodasAsync();
        return camas.Select(c => MapearDto(c)).ToList();
    }

    public async Task<CamaResponseDto> CrearCamaAsync(CrearCamaRequestDto dto)
    {
        var nuevaCama = new Cama(dto.Numero, dto.Sector);
        await _repository.AgregarAsync(nuevaCama);
        return MapearDto(nuevaCama);
    }

    public async Task<CamaResponseDto> OcuparCamaAsync(int id, OcuparCamaRequestDto request)
    {
        var cama = await _repository.ObtenerPorIdAsync(id);
        if (cama == null) throw new KeyNotFoundException("La cama no existe.");

        cama.Ocupar(request.NombrePaciente, request.RegistroPaciente, request.Patologia, request.FechaIngreso);
        await _repository.ActualizarAsync(cama);
        return MapearDto(cama);
    }

    public async Task<CamaResponseDto> EnviarALimpiezaAsync(int id)
    {
        var cama = await _repository.ObtenerPorIdAsync(id);
        if (cama == null) throw new KeyNotFoundException("La cama no existe.");

        cama.LiberarParaLimpieza();
        await _repository.ActualizarAsync(cama);
        return MapearDto(cama);
    }

    public async Task<CamaResponseDto> HabilitarCamaAsync(int id)
    {
        var cama = await _repository.ObtenerPorIdAsync(id);
        if (cama == null) throw new KeyNotFoundException("La cama no existe.");

        cama.Habilitar();
        await _repository.ActualizarAsync(cama);
        return MapearDto(cama);
    }

    // Helper privado para mapear Entidad -> DTO
    private CamaResponseDto MapearDto(Cama cama)
    {
        // En Enum 'EnLimpieza' lo pasamos a 'En Limpieza' para el frontend
        string estadoStr = cama.Estado.ToString();
        if (cama.Estado == Domain.Enums.EstadoCama.EnLimpieza)
        {
            estadoStr = "En Limpieza";
        }
        
        int? diasInternacion = null;
        if (cama.FechaIngreso.HasValue)
        {
            diasInternacion = (DateTime.UtcNow - cama.FechaIngreso.Value).Days;
        }

        return new CamaResponseDto
        {
            Id = cama.Id,
            Numero = cama.Numero,
            Sector = cama.Sector,
            Estado = estadoStr,
            NombrePaciente = cama.NombrePaciente,
            RegistroPaciente = cama.RegistroPaciente,
            Patologia = cama.Patologia,
            FechaIngreso = cama.FechaIngreso,
            DiasInternacion = diasInternacion
        };
    }
}
