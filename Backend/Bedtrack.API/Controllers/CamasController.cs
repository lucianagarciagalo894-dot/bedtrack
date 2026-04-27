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

    [HttpPut("{id}/ocupar")]
    public async Task<IActionResult> OcuparCama(int id)
    {
        var cama = await _repository.ObtenerPorIdAsync(id);
        if (cama == null) return NotFound("La cama no existe.");

        try
        {
            cama.Ocupar(); // Llamamos a tu regla de negocio
            await _repository.ActualizarAsync(cama);
            return Ok(cama);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message); // Devuelve el error exacto si no estaba "Disponible"
        }
    }

    [HttpPut("{id}/limpieza")]
    public async Task<IActionResult> EnviarALimpieza(int id)
    {
        var cama = await _repository.ObtenerPorIdAsync(id);
        if (cama == null) return NotFound("La cama no existe.");

        try
        {
            cama.LiberarParaLimpieza();
            await _repository.ActualizarAsync(cama);
            return Ok(cama);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}/habilitar")]
    public async Task<IActionResult> HabilitarCama(int id)
    {
        var cama = await _repository.ObtenerPorIdAsync(id);
        if (cama == null) return NotFound("La cama no existe.");

        try
        {
            cama.Habilitar();
            await _repository.ActualizarAsync(cama);
            return Ok(cama);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

// Un DTO (Data Transfer Object) simple para recibir los datos desde React
public class CrearCamaRequest
{
    public string Numero { get; set; } = string.Empty;
    public string Sector { get; set; } = string.Empty;
}