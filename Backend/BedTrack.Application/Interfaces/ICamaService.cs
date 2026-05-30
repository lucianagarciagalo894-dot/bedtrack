using BedTrack.Application.DTOs;

namespace BedTrack.Application.Interfaces;

public interface ICamaService
{
    Task<IEnumerable<CamaResponseDto>> ObtenerTodasAsync();
    Task<CamaResponseDto> CrearCamaAsync(CrearCamaRequestDto dto);
    Task<CamaResponseDto> OcuparCamaAsync(int id, OcuparCamaRequestDto request);
    Task<CamaResponseDto> EnviarALimpiezaAsync(int id);
    Task<CamaResponseDto> HabilitarCamaAsync(int id);
}
