using BedTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BedTrack.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // Esta propiedad representa la tabla 'Camas' que se creará en SQL Server
    public DbSet<Cama> Camas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Aquí configuramos detalles específicos de las tablas usando la API Fluida
        modelBuilder.Entity<Cama>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Numero).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Sector).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Estado)
                  .HasConversion<string>()
                  .IsRequired()
                  .HasMaxLength(50);

            // Configuramos RowVersion para manejar concurrencia
            entity.Property(e => e.RowVersion).IsRowVersion();
            
            // Configuraciones de los nuevos campos de paciente
            entity.Property(e => e.NombrePaciente).HasMaxLength(150);
            entity.Property(e => e.RegistroPaciente).HasMaxLength(50);
            entity.Property(e => e.Patologia).HasMaxLength(200);
        });
    }
}