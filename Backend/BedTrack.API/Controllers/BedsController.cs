using BedTrack.Application.DTOs;
using BedTrack.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BedTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BedsController : ControllerBase
{
    private readonly IHospitalService _service;

    public BedsController(IHospitalService service)
    {
        _service = service;
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateBedStatus(int id, [FromBody] UpdateBedStatusDto request)
    {
        if (request == null)
            return BadRequest("El cuerpo de la solicitud no puede ser nulo");

        try
        {
            var result = await _service.UpdateBedStatusAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
