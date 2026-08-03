using BedTrack.Application.DTOs;
using BedTrack.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BedTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FloorsController : ControllerBase
{
    private readonly IHospitalService _service;

    public FloorsController(IHospitalService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetFloors([FromQuery] int? sucursalId = null)
    {
        return Ok(await _service.GetFloorsAsync(sucursalId));
    }

    [HttpGet("{id}/rooms")]
    public async Task<IActionResult> GetRoomsByFloor(int id)
    {
        return Ok(await _service.GetRoomsByFloorAsync(id));
    }

    [HttpPost]
    public async Task<IActionResult> CreateFloor([FromBody] CreatePisoDto dto)
    {
        try
        {
            var result = await _service.CreateFloorAsync(dto);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFloor(int id, [FromBody] UpdatePisoDto dto)
    {
        try
        {
            var result = await _service.UpdateFloorAsync(id, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFloor(int id)
    {
        var deleted = await _service.DeleteFloorAsync(id);
        if (!deleted) return NotFound(new { message = "Piso no encontrado" });
        return NoContent();
    }
}
