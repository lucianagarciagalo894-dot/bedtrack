using BedTrack.Application.Interfaces;
using BedTrack.Infrastructure.Data;
using BedTrack.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Conexión segura a la Base de Datos (SQL Server)
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Inyección de Dependencias (Patrón Repository)
builder.Services.AddScoped<ICamaRepository, CamaRepository>();

// 2. Configuración de CORS (Permite que React se conecte de forma segura)
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirReact", policy =>
    {
        policy.WithOrigins("https://localhost:5173") // Origen del Frontend
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

// --- CONFIGURACIÓN DE SEGURIDAD ---

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // HSTS: Le dice a los navegadores que solo usen HTTPS 
    app.UseHsts();
}

// REDIRECCIÓN OBLIGATORIA: Si alguien intenta entrar por HTTP, se le cierra la puerta 
// y se le redirige automáticamente al túnel cifrado HTTPS.
app.UseHttpsRedirection();

// 5. Encender CORS ANTES de los controladores
app.UseCors("PermitirReact");

// 6. Activar las rutas de los Controladores
app.MapControllers();

app.Run();