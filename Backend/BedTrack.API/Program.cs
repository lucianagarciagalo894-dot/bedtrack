using BedTrack.Application.Interfaces;
using BedTrack.Application.Services;
using BedTrack.Domain.Entities;
using BedTrack.Infrastructure.Data;
using BedTrack.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Conexión segura a la Base de Datos (PostgreSQL en Supabase)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Inyección de Dependencias
builder.Services.AddScoped<IHospitalRepository, HospitalRepository>();
builder.Services.AddScoped<IHospitalService, HospitalService>();

// 2. Configuración de CORS (Permite que React se conecte de forma segura)
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173") // Origen del Frontend
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 3. Soporte para Controladores
builder.Services.AddControllers();

// 4. Configuración de Swagger (Documentación de la API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --- SEEDER AUTOMÁTICO DE BASE DE DATOS ---
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Limpieza de la base de datos anterior (Temporal para la reestructuración)
    context.Database.ExecuteSqlRaw("DROP TABLE IF EXISTS \"Camas\" CASCADE; DROP TABLE IF EXISTS \"Pacientes\" CASCADE; DROP TABLE IF EXISTS \"Habitaciones\" CASCADE; DROP TABLE IF EXISTS \"Pisos\" CASCADE; DROP TABLE IF EXISTS \"__EFMigrationsHistory\" CASCADE;");

    // Aplica las migraciones automáticamente
    context.Database.Migrate();

    // Si la tabla Pisos está vacía, la poblamos con los datos iniciales
    if (!context.Pisos.Any())
    {
        var pisos = new List<Piso>
        {
            new Piso("Piso 1", "Privada", "privada"),
            new Piso("Piso 2", "Compartida", "compartida"),
            new Piso("Piso 3", "Compartida", "compartida"),
            new Piso("Piso 4", "Terapia Intensiva", "intensiva"),
            new Piso("Piso 5", "Aislamiento", "aislamiento")
        };

        var config = new[]
        {
            new { Piso = pisos[0], RoomCount = 12, BedsPerRoom = 1 },
            new { Piso = pisos[1], RoomCount = 6, BedsPerRoom = 2 },
            new { Piso = pisos[2], RoomCount = 6, BedsPerRoom = 2 },
            new { Piso = pisos[3], RoomCount = 12, BedsPerRoom = 1 },
            new { Piso = pisos[4], RoomCount = 12, BedsPerRoom = 1 }
        };

        foreach (var c in config)
        {
            for (int r = 1; r <= c.RoomCount; r++)
            {
                var hab = new Habitacion(r, 0);
                c.Piso.Habitaciones.Add(hab);

                for (int b = 1; b <= c.BedsPerRoom; b++)
                {
                    var cama = new Cama(b, 0);
                    hab.Camas.Add(cama);
                }
            }
        }

        context.Pisos.AddRange(pisos);
        context.SaveChanges();
    }
}

// --- CONFIGURACIÓN DE SEGURIDAD ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();

// 5. Encender CORS ANTES de los controladores
app.UseCors("PermitirReact");

// 6. Activar las rutas de los Controladores
app.MapControllers();

app.Run();