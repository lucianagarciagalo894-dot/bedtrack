using BedTrack.Domain.Entities;

namespace BedTrack.Application.Interfaces;

public interface IHospitalRepository
{
    Task<IEnumerable<Piso>> ObtenerPisosAsync();
    Task<IEnumerable<Habitacion>> ObtenerHabitacionesAsync();
    Task<IEnumerable<Habitacion>> ObtenerHabitacionesPorPisoAsync(int floorId);
    Task<Habitacion?> ObtenerHabitacionPorIdAsync(int roomId);
    Task<Cama?> ObtenerCamaPorIdAsync(int bedId);
    Task AgregarPacienteAsync(Paciente paciente);
    void EliminarPaciente(Paciente paciente);
    Task GuardarCambiosAsync();
}
