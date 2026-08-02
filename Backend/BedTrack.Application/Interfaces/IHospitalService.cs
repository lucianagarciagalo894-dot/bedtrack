using BedTrack.Application.DTOs;

namespace BedTrack.Application.Interfaces;

public interface IHospitalService
{
    Task<IEnumerable<PisoDto>> GetFloorsAsync();
    Task<IEnumerable<HabitacionDto>> GetRoomsByFloorAsync(int floorId);
    Task<HabitacionDto?> GetRoomByIdAsync(int roomId);
    Task<CamaDto> UpdateBedStatusAsync(int bedId, UpdateBedStatusDto request);
    Task<IEnumerable<HabitacionDto>> GetAllRoomsAsync();

    // Métodos para Superadmin / Desarrollador
    Task<IEnumerable<NosocomioDto>> GetNosocomiosAsync();
    Task<NosocomioDto> CreateNosocomioAsync(CreateNosocomioDto dto);
    Task<IEnumerable<SucursalDto>> GetSucursalesAsync(int nosocomioId);
    Task<SucursalDto> CreateSucursalAsync(CreateSucursalDto dto);

    Task<HabitacionDto> CreateRoomAsync(CreateHabitacionDto dto);
    Task<HabitacionDto> UpdateRoomAsync(int roomId, UpdateHabitacionDto dto);
    Task<bool> DeleteRoomAsync(int roomId);

    Task<CamaDto> CreateBedAsync(CreateCamaDto dto);
    Task<CamaDto> UpdateBedAsync(int bedId, UpdateCamaDto dto);
    Task<bool> DeleteBedAsync(int bedId);
    DevLoginResponseDto ValidateDevLogin(DevLoginRequestDto request);
}
