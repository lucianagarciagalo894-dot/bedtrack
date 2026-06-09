using BedTrack.Application.DTOs;
using BedTrack.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BedTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CamasController : ControllerBase
{
    private readonly ICamaService _camaService;

    public CamasController(ICamaService camaService)
    {
        _camaService = camaService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCamas()
    {
        var camas = await _camaService.ObtenerTodasAsync();
        return Ok(camas);
    }

    [HttpPost]
    public async Task<IActionResult> CrearCama([FromBody] CrearCamaRequestDto request)
    {
        try
        {
            var nuevaCama = await _camaService.CrearCamaAsync(request);
            return CreatedAtAction(nameof(GetCamas), new { id = nuevaCama.Id }, nuevaCama);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}/ocupar")]
    public async Task<IActionResult> OcuparCama(int id, [FromBody] OcuparCamaRequestDto request)
    {
        try
        {
            // Pasamos el ID y los datos del paciente al servicio
            var camaOcupada = await _camaService.OcuparCamaAsync(id, request);
            return Ok(camaOcupada);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message); 
        }
    }

    [HttpPut("{id}/limpieza")]
    public async Task<IActionResult> EnviarALimpieza(int id)
    {
        try
        {
            var camaEnLimpieza = await _camaService.EnviarALimpiezaAsync(id);
            return Ok(camaEnLimpieza);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}/habilitar")]
    public async Task<IActionResult> HabilitarCama(int id)
    {
        try
        {
            var camaDisponible = await _camaService.HabilitarCamaAsync(id);
            return Ok(camaDisponible);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}