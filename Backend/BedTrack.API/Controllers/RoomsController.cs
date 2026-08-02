using BedTrack.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace BedTrack.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly IHospitalService _service;

    public RoomsController(IHospitalService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllRooms([FromQuery] int? sucursalId = null)
    {
        return Ok(await _service.GetAllRoomsAsync(sucursalId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetRoomById(int id)
    {
        var room = await _service.GetRoomByIdAsync(id);
        if (room == null) return NotFound();
        return Ok(room);
    }
}
