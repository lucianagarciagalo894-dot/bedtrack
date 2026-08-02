using BedTrack.Application.DTOs;
using BedTrack.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BedTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SuperAdminController : ControllerBase
{
    private readonly IHospitalService _service;

    public SuperAdminController(IHospitalService service)
    {
        _service = service;
    }

    [HttpPost("login")]
    public ActionResult<DevLoginResponseDto> Login([FromBody] DevLoginRequestDto request)
    {
        var response = _service.ValidateDevLogin(request);
        if (!response.Success) return Unauthorized(response);
        return Ok(response);
    }

    [HttpGet("nosocomios")]
    public async Task<ActionResult<IEnumerable<NosocomioDto>>> GetNosocomios()
    {
        var result = await _service.GetNosocomiosAsync();
        return Ok(result);
    }

    [HttpPost("nosocomios")]
    public async Task<ActionResult<NosocomioDto>> CreateNosocomio([FromBody] CreateNosocomioDto dto)
    {
        try
        {
            var result = await _service.CreateNosocomioAsync(dto);
            return CreatedAtAction(nameof(GetNosocomios), new { id = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("nosocomios/{nosocomioId}/sucursales")]
    public async Task<ActionResult<IEnumerable<SucursalDto>>> GetSucursales(int nosocomioId)
    {
        var result = await _service.GetSucursalesAsync(nosocomioId);
        return Ok(result);
    }

    [HttpPost("sucursales")]
    public async Task<ActionResult<SucursalDto>> CreateSucursal([FromBody] CreateSucursalDto dto)
    {
        try
        {
            var result = await _service.CreateSucursalAsync(dto);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("rooms")]
    public async Task<ActionResult<HabitacionDto>> CreateRoom([FromBody] CreateHabitacionDto dto)
    {
        try
        {
            var result = await _service.CreateRoomAsync(dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("rooms/{id}")]
    public async Task<ActionResult<HabitacionDto>> UpdateRoom(int id, [FromBody] UpdateHabitacionDto dto)
    {
        try
        {
            var result = await _service.UpdateRoomAsync(id, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("rooms/{id}")]
    public async Task<ActionResult> DeleteRoom(int id)
    {
        var deleted = await _service.DeleteRoomAsync(id);
        if (!deleted) return NotFound(new { message = "Habitación no encontrada" });
        return NoContent();
    }

    [HttpPost("beds")]
    public async Task<ActionResult<CamaDto>> CreateBed([FromBody] CreateCamaDto dto)
    {
        try
        {
            var result = await _service.CreateBedAsync(dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("beds/{id}")]
    public async Task<ActionResult<CamaDto>> UpdateBed(int id, [FromBody] UpdateCamaDto dto)
    {
        try
        {
            var result = await _service.UpdateBedAsync(id, dto);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("beds/{id}")]
    public async Task<ActionResult> DeleteBed(int id)
    {
        var deleted = await _service.DeleteBedAsync(id);
        if (!deleted) return NotFound(new { message = "Cama no encontrada" });
        return NoContent();
    }
}
