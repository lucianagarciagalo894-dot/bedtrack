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
    public async Task<IActionResult> GetFloors()
    {
        return Ok(await _service.GetFloorsAsync());
    }

    [HttpGet("{id}/rooms")]
    public async Task<IActionResult> GetRoomsByFloor(int id)
    {
        return Ok(await _service.GetRoomsByFloorAsync(id));
    }
}
