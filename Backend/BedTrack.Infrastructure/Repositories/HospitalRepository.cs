using BedTrack.Application.Interfaces;
using BedTrack.Domain.Entities;
using BedTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BedTrack.Infrastructure.Repositories;

public class HospitalRepository : IHospitalRepository
{
    private readonly ApplicationDbContext _context;

    public HospitalRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Nosocomio>> ObtenerNosocomiosAsync()
    {
        return await _context.Nosocomios
            .Include(n => n.Sucursales)
            .ToListAsync();
    }

    public async Task<Nosocomio?> ObtenerNosocomioPorIdAsync(int id)
    {
        return await _context.Nosocomios
            .Include(n => n.Sucursales)
            .FirstOrDefaultAsync(n => n.Id == id);
    }

    public async Task AgregarNosocomioAsync(Nosocomio nosocomio)
    {
        await _context.Nosocomios.AddAsync(nosocomio);
    }

    public async Task<IEnumerable<Sucursal>> ObtenerSucursalesPorNosocomioAsync(int nosocomioId)
    {
        return await _context.Sucursales
            .Where(s => s.NosocomioId == nosocomioId)
            .ToListAsync();
    }

    public async Task<Sucursal?> ObtenerSucursalPorIdAsync(int id)
    {
        return await _context.Sucursales
            .Include(s => s.Nosocomio)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task AgregarSucursalAsync(Sucursal sucursal)
    {
        await _context.Sucursales.AddAsync(sucursal);
    }

    public async Task AgregarHabitacionAsync(Habitacion habitacion)
    {
        await _context.Habitaciones.AddAsync(habitacion);
    }

    public void EliminarHabitacion(Habitacion habitacion)
    {
        _context.Habitaciones.Remove(habitacion);
    }

    public async Task AgregarCamaAsync(Cama cama)
    {
        await _context.Camas.AddAsync(cama);
    }

    public void EliminarCama(Cama cama)
    {
        _context.Camas.Remove(cama);
    }

    public async Task<Piso?> ObtenerPisoPorIdAsync(int floorId)
    {
        return await _context.Pisos.FirstOrDefaultAsync(p => p.Id == floorId);
    }

    public async Task AgregarPisoAsync(Piso piso)
    {
        await _context.Pisos.AddAsync(piso);
    }

    public async Task<IEnumerable<Piso>> ObtenerPisosAsync(int? sucursalId = null)
    {
        var query = _context.Pisos.Include(p => p.Habitaciones).AsQueryable();
        if (sucursalId.HasValue)
        {
            query = query.Where(p => p.SucursalId == sucursalId.Value);
        }
        return await query.ToListAsync();
    }

    public async Task<IEnumerable<Habitacion>> ObtenerHabitacionesAsync(int? sucursalId = null)
    {
        var query = _context.Habitaciones
            .Include(h => h.Piso)
            .Include(h => h.Camas)
                .ThenInclude(c => c.Paciente)
            .AsQueryable();
        if (sucursalId.HasValue)
        {
            query = query.Where(h => h.Piso.SucursalId == sucursalId.Value);
        }
        return await query.ToListAsync();
    }

    public async Task<IEnumerable<Habitacion>> ObtenerHabitacionesPorPisoAsync(int floorId)
    {
        return await _context.Habitaciones
            .Include(h => h.Piso)
            .Include(h => h.Camas)
                .ThenInclude(c => c.Paciente)
            .Where(h => h.PisoId == floorId)
            .ToListAsync();
    }

    public async Task<Habitacion?> ObtenerHabitacionPorIdAsync(int roomId)
    {
        return await _context.Habitaciones
            .Include(h => h.Piso)
            .Include(h => h.Camas)
                .ThenInclude(c => c.Paciente)
            .FirstOrDefaultAsync(h => h.Id == roomId);
    }

    public async Task<Cama?> ObtenerCamaPorIdAsync(int bedId)
    {
        return await _context.Camas
            .Include(c => c.Paciente)
            .FirstOrDefaultAsync(c => c.Id == bedId);
    }

    public async Task AgregarPacienteAsync(Paciente paciente)
    {
        await _context.Pacientes.AddAsync(paciente);
    }

    public void EliminarPaciente(Paciente paciente)
    {
        _context.Pacientes.Remove(paciente);
    }

    public async Task<IEnumerable<UsuarioStaff>> ObtenerUsuariosStaffAsync()
    {
        return await _context.UsuariosStaff
            .Include(u => u.Nosocomio)
            .Include(u => u.Sucursal)
            .ToListAsync();
    }

    public async Task<UsuarioStaff?> ObtenerUsuarioStaffPorIdAsync(int id)
    {
        return await _context.UsuariosStaff
            .Include(u => u.Nosocomio)
            .Include(u => u.Sucursal)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task AgregarUsuarioStaffAsync(UsuarioStaff usuario)
    {
        await _context.UsuariosStaff.AddAsync(usuario);
    }

    public void EliminarUsuarioStaff(UsuarioStaff usuario)
    {
        _context.UsuariosStaff.Remove(usuario);
    }

    public async Task<IEnumerable<HistorialCama>> ObtenerHistorialCamasAsync(int? camaId = null)
    {
        var query = _context.HistorialCamas.AsQueryable();
        if (camaId.HasValue && camaId.Value > 0)
        {
            query = query.Where(h => h.CamaId == camaId.Value);
        }
        return await query.OrderByDescending(h => h.FechaHora).Take(100).ToListAsync();
    }

    public async Task AgregarHistorialCamaAsync(HistorialCama historial)
    {
        await _context.HistorialCamas.AddAsync(historial);
    }

    public async Task GuardarCambiosAsync()
    {
        await _context.SaveChangesAsync();
    }
}
