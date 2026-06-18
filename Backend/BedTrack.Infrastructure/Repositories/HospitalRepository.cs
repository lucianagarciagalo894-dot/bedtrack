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

    public async Task<IEnumerable<Piso>> ObtenerPisosAsync()
    {
        return await _context.Pisos.Include(p => p.Habitaciones).ToListAsync();
    }

    public async Task<IEnumerable<Habitacion>> ObtenerHabitacionesAsync()
    {
        return await _context.Habitaciones
            .Include(h => h.Piso)
            .Include(h => h.Camas)
                .ThenInclude(c => c.Paciente)
            .ToListAsync();
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

    public async Task GuardarCambiosAsync()
    {
        await _context.SaveChangesAsync();
    }
}
