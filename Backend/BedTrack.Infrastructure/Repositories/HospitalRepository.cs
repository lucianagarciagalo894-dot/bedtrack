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

    public void EliminarNosocomio(Nosocomio nosocomio)
    {
        var id = nosocomio.Id;

        // 1. Desvincular PacienteId de Camas para romper FK circular Pacientes <-> Camas
        _context.Database.ExecuteSqlRaw(@"UPDATE ""Camas"" SET ""PacienteId"" = NULL WHERE ""HabitacionId"" IN (SELECT h.""Id"" FROM ""Habitaciones"" h JOIN ""Pisos"" p ON h.""PisoId"" = p.""Id"" JOIN ""Sucursales"" s ON p.""SucursalId"" = s.""Id"" WHERE s.""NosocomioId"" = {0})", id);

        // 2. Eliminar HistorialCamas
        _context.Database.ExecuteSqlRaw(@"DELETE FROM ""HistorialCamas"" WHERE ""NosocomioId"" = {0} OR ""CamaId"" IN (SELECT c.""Id"" FROM ""Camas"" c JOIN ""Habitaciones"" h ON c.""HabitacionId"" = h.""Id"" JOIN ""Pisos"" p ON h.""PisoId"" = p.""Id"" JOIN ""Sucursales"" s ON p.""SucursalId"" = s.""Id"" WHERE s.""NosocomioId"" = {0})", id);

        // 3. Eliminar Camas
        _context.Database.ExecuteSqlRaw(@"DELETE FROM ""Camas"" WHERE ""HabitacionId"" IN (SELECT h.""Id"" FROM ""Habitaciones"" h JOIN ""Pisos"" p ON h.""PisoId"" = p.""Id"" JOIN ""Sucursales"" s ON p.""SucursalId"" = s.""Id"" WHERE s.""NosocomioId"" = {0})", id);

        // 4. Eliminar Pacientes huerfanos
        _context.Database.ExecuteSqlRaw(@"DELETE FROM ""Pacientes"" WHERE ""Id"" NOT IN (SELECT ""PacienteId"" FROM ""Camas"" WHERE ""PacienteId"" IS NOT NULL)");

        // 5. Eliminar Habitaciones
        _context.Database.ExecuteSqlRaw(@"DELETE FROM ""Habitaciones"" WHERE ""PisoId"" IN (SELECT p.""Id"" FROM ""Pisos"" p JOIN ""Sucursales"" s ON p.""SucursalId"" = s.""Id"" WHERE s.""NosocomioId"" = {0})", id);

        // 6. Eliminar Pisos
        _context.Database.ExecuteSqlRaw(@"DELETE FROM ""Pisos"" WHERE ""SucursalId"" IN (SELECT s.""Id"" FROM ""Sucursales"" s WHERE s.""NosocomioId"" = {0})", id);

        // 7. Eliminar UsuariosStaff
        _context.Database.ExecuteSqlRaw(@"DELETE FROM ""UsuariosStaff"" WHERE ""NosocomioId"" = {0}", id);

        // 8. Eliminar Sucursales
        _context.Database.ExecuteSqlRaw(@"DELETE FROM ""Sucursales"" WHERE ""NosocomioId"" = {0}", id);

        // 9. Eliminar Nosocomio de PostgreSQL / Supabase
        _context.Database.ExecuteSqlRaw(@"DELETE FROM ""Nosocomios"" WHERE ""Id"" = {0}", id);

        var entry = _context.Entry(nosocomio);
        if (entry != null) entry.State = EntityState.Detached;
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

    public void EliminarPiso(Piso piso)
    {
        _context.Pisos.Remove(piso);
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

    public async Task<IEnumerable<UsuarioStaff>> ObtenerUsuariosStaffAsync(int? nosocomioId = null, int? sucursalId = null)
    {
        var query = _context.UsuariosStaff
            .Include(u => u.Nosocomio)
            .Include(u => u.Sucursal)
            .AsQueryable();

        if (sucursalId.HasValue)
        {
            query = query.Where(u => 
                u.SucursalId == sucursalId.Value || 
                (nosocomioId.HasValue && u.NosocomioId == nosocomioId.Value) || 
                u.NosocomioId == null || 
                u.SucursalId == null);
        }
        else if (nosocomioId.HasValue)
        {
            query = query.Where(u => u.NosocomioId == nosocomioId.Value || u.NosocomioId == null);
        }

        return await query.ToListAsync();
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

    public async Task<IEnumerable<HistorialCama>> ObtenerHistorialCamasAsync(int? camaId = null, int? sucursalId = null, int? nosocomioId = null)
    {
        try
        {
            var query = _context.HistorialCamas.AsQueryable();
            if (camaId.HasValue && camaId.Value > 0)
            {
                query = query.Where(h => h.CamaId == camaId.Value);
            }
            if (sucursalId.HasValue && sucursalId.Value > 0)
            {
                query = query.Where(h => h.SucursalId == sucursalId.Value);
            }
            if (nosocomioId.HasValue && nosocomioId.Value > 0)
            {
                query = query.Where(h => h.NosocomioId == nosocomioId.Value);
            }
            return await query.OrderByDescending(h => h.FechaHora).Take(100).ToListAsync();
        }
        catch
        {
            return Enumerable.Empty<HistorialCama>();
        }
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
