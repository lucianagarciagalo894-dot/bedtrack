using BedTrack.Application.Interfaces;
using BedTrack.Domain.Entities;
using BedTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BedTrack.Infrastructure.Repositories;

public class CamaRepository : ICamaRepository
{
    private readonly ApplicationDbContext _context;

    public CamaRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Cama>> ObtenerTodasAsync()
    {
        return await _context.Camas.ToListAsync();
    }

    public async Task<Cama?> ObtenerPorIdAsync(int id)
    {
        return await _context.Camas.FindAsync(id);
    }

    public async Task AgregarAsync(Cama cama)
    {
        await _context.Camas.AddAsync(cama);
        await _context.SaveChangesAsync();
    }

    public async Task ActualizarAsync(Cama cama)
    {
        _context.Camas.Update(cama);
        await _context.SaveChangesAsync();
    }
}