using BedTrack.Application.DTOs;

namespace BedTrack.Application.Interfaces;

public interface IHospitalService
{
    Task<IEnumerable<PisoDto>> GetFloorsAsync();
    Task<IEnumerable<HabitacionDto>> GetRoomsByFloorAsync(int floorId);
    Task<HabitacionDto?> GetRoomByIdAsync(int roomId);
    Task<CamaDto> UpdateBedStatusAsync(int bedId, UpdateBedStatusDto request);
    Task<IEnumerable<HabitacionDto>> GetAllRoomsAsync();
}
