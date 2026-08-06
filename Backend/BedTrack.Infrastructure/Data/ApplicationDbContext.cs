using BedTrack.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BedTrack.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Nosocomio> Nosocomios { get; set; }
    public DbSet<Sucursal> Sucursales { get; set; }
    public DbSet<Piso> Pisos { get; set; }
    public DbSet<Habitacion> Habitaciones { get; set; }
    public DbSet<Paciente> Pacientes { get; set; }
    public DbSet<Cama> Camas { get; set; }
    public DbSet<UsuarioStaff> UsuariosStaff { get; set; }
    public DbSet<HistorialCama> HistorialCamas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UsuarioStaff>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Password).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Rol).IsRequired().HasMaxLength(50);
        });

        modelBuilder.Entity<HistorialCama>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UsuarioNombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.UsuarioEmail).HasMaxLength(100);
            entity.Property(e => e.UsuarioRol).HasMaxLength(50);
            entity.Property(e => e.Accion).IsRequired().HasMaxLength(300);
        });

        modelBuilder.Entity<Nosocomio>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Codigo).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Direccion).IsRequired().HasMaxLength(200);
        });

        modelBuilder.Entity<Sucursal>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Direccion).IsRequired().HasMaxLength(200);
            entity.HasOne(s => s.Nosocomio)
                  .WithMany(n => n.Sucursales)
                  .HasForeignKey(s => s.NosocomioId);
        });

        modelBuilder.Entity<Piso>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nombre).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Tipo).IsRequired().HasMaxLength(50);
            entity.Property(e => e.TipoKey).IsRequired().HasMaxLength(50);
            entity.HasOne(p => p.Sucursal)
                  .WithMany(s => s.Pisos)
                  .HasForeignKey(p => p.SucursalId)
                  .IsRequired(false);
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