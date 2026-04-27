using BedTrack.Application.Interfaces;
using BedTrack.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace BedTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CamasController : ControllerBase
{
    private readonly ICamaRepository _repository;

    public CamasController(ICamaRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> GetCamas()
    {
        var camas = await _repository.ObtenerTodasAsync();
        return Ok(camas);
    }

    [HttpPost]
    public async Task<IActionResult> CrearCama([FromBody] CrearCamaRequest request)
    {
        // Aplicamos la regla de negocio al crear una cama nueva
        var nuevaCama = new Cama(request.Numero, request.Sector);
        
        await _repository.AgregarAsync(nuevaCama);
        
        return CreatedAtAction(nameof(GetCamas), new { id = nuevaCama.Id }, nuevaCama);
    }
}

// Un DTO (Data Transfer Object) simple para recibir los datos desde React
public class CrearCamaRequest
{
    public string Numero { get; set; } = string.Empty;
    public string Sector { get; set; } = string.Empty;
}