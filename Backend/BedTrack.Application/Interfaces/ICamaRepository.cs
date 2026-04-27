using BedTrack.Domain.Entities;

namespace BedTrack.Application.Interfaces;

public interface ICamaRepository
{
    // Definimos qué operaciones necesitamos
    Task<IEnumerable<Cama>> ObtenerTodasAsync();
    Task<Cama?> ObtenerPorIdAsync(int id);
    Task AgregarAsync(Cama cama);
    Task ActualizarAsync(Cama cama);
}