using BedTrack.Application.Interfaces;
using BedTrack.Application.Services;
using BedTrack.Domain.Entities;
using BedTrack.Infrastructure.Data;
using BedTrack.Infrastructure.Repositories;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IHospitalRepository, HospitalRepository>();
builder.Services.AddScoped<IHospitalService, HospitalService>();

builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrEmpty(origin)) return false;
            if (allowedOrigins.Contains(origin)) return true;
            if (origin.EndsWith(".vercel.app") || origin.EndsWith(".railway.app")) return true;
            return true;
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter(System.Text.Json.JsonNamingPolicy.CamelCase));
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseForwardedHeaders();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    context.Database.Migrate();

    try
    {
        var testHospitals = context.Nosocomios
            .Where(n => n.Nombre.ToLower().Contains("prueba") || 
                        n.Nombre.ToLower().Contains("hospital nuevo") || 
                        n.Codigo.StartsWith("HOSP-"))
            .ToList();

        if (testHospitals.Any())
        {
            var testIds = testHospitals.Select(h => h.Id).ToList();
            var sucursalIds = context.Sucursales.Where(s => testIds.Contains(s.NosocomioId)).Select(s => s.Id).ToList();
            var pisoIds = context.Pisos.Where(p => p.SucursalId.HasValue && sucursalIds.Contains(p.SucursalId.Value)).Select(p => p.Id).ToList();
            var roomIds = context.Habitaciones.Where(h => pisoIds.Contains(h.PisoId)).Select(h => h.Id).ToList();
            var beds = context.Camas.Where(c => roomIds.Contains(c.HabitacionId)).ToList();
            
            if (beds.Any()) context.Camas.RemoveRange(beds);
            if (roomIds.Any()) context.Habitaciones.RemoveRange(context.Habitaciones.Where(h => roomIds.Contains(h.Id)));
            if (pisoIds.Any()) context.Pisos.RemoveRange(context.Pisos.Where(p => pisoIds.Contains(p.Id)));
            if (sucursalIds.Any()) context.Sucursales.RemoveRange(context.Sucursales.Where(s => sucursalIds.Contains(s.Id)));
            context.UsuariosStaff.RemoveRange(context.UsuariosStaff.Where(u => u.NosocomioId.HasValue && testIds.Contains(u.NosocomioId.Value)));
            context.HistorialCamas.RemoveRange(context.HistorialCamas.Where(h => h.NosocomioId.HasValue && testIds.Contains(h.NosocomioId.Value)));
            context.Nosocomios.RemoveRange(testHospitals);
            context.SaveChanges();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al purgar hospitales de prueba: {ex.Message}");
    }

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseRouting();

app.UseCors("PermitirReact");

app.UseHttpsRedirection();

app.MapControllers();

app.Run();