using BedTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BedTrack.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Piso> Pisos { get; set; }
    public DbSet<Habitacion> Habitaciones { get; set; }
    public DbSet<Paciente> Pacientes { get; set; }
    public DbSet<Cama> Camas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Piso>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Tipo).IsRequired().HasMaxLength(50);
            entity.Property(e => e.TipoKey).IsRequired().HasMaxLength(50);
        });

        modelBuilder.Entity<Habitacion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(h => h.Piso).WithMany(p => p.Habitaciones).HasForeignKey(h => h.PisoId);
        });

        modelBuilder.Entity<Paciente>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Apellido).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Diagnostico).IsRequired().HasMaxLength(250);
        });

        modelBuilder.Entity<Cama>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Estado)
                  .HasConversion<string>()
                  .IsRequired()
                  .HasMaxLength(50);

            entity.HasOne(c => c.Habitacion)
                  .WithMany(h => h.Camas)
                  .HasForeignKey(c => c.HabitacionId);

            entity.HasOne(c => c.Paciente)
                  .WithOne(p => p.Cama)
                  .HasForeignKey<Cama>(c => c.PacienteId)
                  .IsRequired(false);
        });
    }
}