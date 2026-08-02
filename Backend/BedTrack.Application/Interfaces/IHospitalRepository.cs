using BedTrack.Domain.Entities;

namespace BedTrack.Application.Interfaces;

public interface IHospitalRepository
{
    Task<IEnumerable<Nosocomio>> ObtenerNosocomiosAsync();
    Task<Nosocomio?> ObtenerNosocomioPorIdAsync(int id);
    Task AgregarNosocomioAsync(Nosocomio nosocomio);

    Task<IEnumerable<Sucursal>> ObtenerSucursalesPorNosocomioAsync(int nosocomioId);
    Task<Sucursal?> ObtenerSucursalPorIdAsync(int id);
    Task AgregarSucursalAsync(Sucursal sucursal);

    Task AgregarHabitacionAsync(Habitacion habitacion);
    void EliminarHabitacion(Habitacion habitacion);

    Task AgregarCamaAsync(Cama cama);
    void EliminarCama(Cama cama);

    Task<Piso?> ObtenerPisoPorIdAsync(int floorId);
    Task AgregarPisoAsync(Piso piso);

    Task<IEnumerable<Piso>> ObtenerPisosAsync(int? sucursalId = null);
    Task<IEnumerable<Habitacion>> ObtenerHabitacionesAsync(int? sucursalId = null);
    Task<IEnumerable<Habitacion>> ObtenerHabitacionesPorPisoAsync(int floorId);
    Task<Habitacion?> ObtenerHabitacionPorIdAsync(int roomId);
    Task<Cama?> ObtenerCamaPorIdAsync(int bedId);
    Task AgregarPacienteAsync(Paciente paciente);
    void EliminarPaciente(Paciente paciente);

    Task<IEnumerable<UsuarioStaff>> ObtenerUsuariosStaffAsync();
    Task<UsuarioStaff?> ObtenerUsuarioStaffPorIdAsync(int id);
    Task AgregarUsuarioStaffAsync(UsuarioStaff usuario);
    void EliminarUsuarioStaff(UsuarioStaff usuario);

    Task<IEnumerable<HistorialCama>> ObtenerHistorialCamasAsync(int? camaId = null);
    Task AgregarHistorialCamaAsync(HistorialCama historial);

    Task GuardarCambiosAsync();
}
