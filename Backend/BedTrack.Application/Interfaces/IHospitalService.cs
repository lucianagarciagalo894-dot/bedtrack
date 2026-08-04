using BedTrack.Application.DTOs;

namespace BedTrack.Application.Interfaces;

public interface IHospitalService
{
    Task<IEnumerable<PisoDto>> GetFloorsAsync(int? sucursalId = null);
    Task<IEnumerable<HabitacionDto>> GetRoomsByFloorAsync(int floorId);
    Task<HabitacionDto?> GetRoomByIdAsync(int roomId);
    Task<CamaDto> UpdateBedStatusAsync(int bedId, UpdateBedStatusDto request);
    Task<IEnumerable<HabitacionDto>> GetAllRoomsAsync(int? sucursalId = null);

    Task<IEnumerable<NosocomioDto>> GetNosocomiosAsync();
    Task<NosocomioDto> CreateNosocomioAsync(CreateNosocomioDto dto);
    Task<NosocomioDto> UpdateNosocomioAsync(int id, UpdateNosocomioDto dto);
    Task<IEnumerable<SucursalDto>> GetSucursalesAsync(int nosocomioId);
    Task<SucursalDto> CreateSucursalAsync(CreateSucursalDto dto);
    Task<SucursalDto> UpdateSucursalAsync(int id, UpdateSucursalDto dto);

    Task<PisoDto> CreateFloorAsync(CreatePisoDto dto);
    Task<PisoDto> UpdateFloorAsync(int id, UpdatePisoDto dto);
    Task<bool> DeleteFloorAsync(int id);

    Task<HabitacionDto> CreateRoomAsync(CreateHabitacionDto dto);
    Task<HabitacionDto> UpdateRoomAsync(int roomId, UpdateHabitacionDto dto);
    Task<bool> DeleteRoomAsync(int roomId);

    Task<CamaDto> CreateBedAsync(CreateCamaDto dto);
    Task<CamaDto> UpdateBedAsync(int bedId, UpdateCamaDto dto);
    Task<bool> DeleteBedAsync(int bedId);
    DevLoginResponseDto ValidateDevLogin(DevLoginRequestDto request);
    Task<NosocomioDto> CreateFullHospitalSetupAsync(FullHospitalSetupDto dto);

    Task<IEnumerable<UsuarioStaffDto>> GetUsuariosStaffAsync(int? nosocomioId = null, int? sucursalId = null);
    Task<UsuarioStaffDto> CreateUsuarioStaffAsync(CreateUsuarioStaffDto dto);
    Task<UsuarioStaffDto> UpdateUsuarioStaffAsync(int id, UpdateUsuarioStaffDto dto);
    Task<bool> DeleteUsuarioStaffAsync(int id);
    Task<StaffLoginResponseDto> ValidateStaffLoginAsync(StaffLoginRequestDto request);

    Task<IEnumerable<HistorialCamaDto>> GetHistorialCamasAsync(int? camaId = null, int? sucursalId = null, int? nosocomioId = null);
}
