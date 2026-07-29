using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BedTrack.API.Controllers;
using BedTrack.Application.DTOs;
using BedTrack.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace BedTrack.Tests;

public class ControllersTests
{
    private readonly Mock<IHospitalService> _serviceMock;

    public ControllersTests()
    {
        _serviceMock = new Mock<IHospitalService>();
    }

    [Fact]
    public async Task BedsController_UpdateBedStatus_NullRequest_ReturnsBadRequest()
    {
        var controller = new BedsController(_serviceMock.Object);

        var result = await controller.UpdateBedStatus(1, null!);

        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("El cuerpo de la solicitud no puede ser nulo", badRequest.Value);
    }

    [Fact]
    public async Task BedsController_UpdateBedStatus_Valid_ReturnsOk()
    {
        var controller = new BedsController(_serviceMock.Object);
        var dto = new UpdateBedStatusDto { Status = "disponible" };
        var expectedResult = new CamaDto { Id = 1, Status = "disponible" };

        _serviceMock.Setup(s => s.UpdateBedStatusAsync(1, dto)).ReturnsAsync(expectedResult);

        var result = await controller.UpdateBedStatus(1, dto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(expectedResult, okResult.Value);
    }

    [Fact]
    public async Task BedsController_UpdateBedStatus_NotFound_Returns404()
    {
        var controller = new BedsController(_serviceMock.Object);
        var dto = new UpdateBedStatusDto { Status = "disponible" };

        _serviceMock.Setup(s => s.UpdateBedStatusAsync(999, dto))
            .ThrowsAsync(new KeyNotFoundException("Cama no encontrada"));

        var result = await controller.UpdateBedStatus(999, dto);

        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("Cama no encontrada", notFoundResult.Value);
    }

    [Fact]
    public async Task FloorsController_GetFloors_ReturnsOkWithFloors()
    {
        var controller = new FloorsController(_serviceMock.Object);
        var floors = new List<PisoDto> { new PisoDto { Id = 1, Nombre = "Piso 1" } };

        _serviceMock.Setup(s => s.GetFloorsAsync()).ReturnsAsync(floors);

        var result = await controller.GetFloors();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(floors, okResult.Value);
    }

    [Fact]
    public async Task FloorsController_GetRoomsByFloor_ReturnsOk()
    {
        var controller = new FloorsController(_serviceMock.Object);
        var rooms = new List<HabitacionDto> { new HabitacionDto { Id = 101, Number = 101 } };

        _serviceMock.Setup(s => s.GetRoomsByFloorAsync(1)).ReturnsAsync(rooms);

        var result = await controller.GetRoomsByFloor(1);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(rooms, okResult.Value);
    }

    [Fact]
    public async Task RoomsController_GetAllRooms_ReturnsOk()
    {
        var controller = new RoomsController(_serviceMock.Object);
        var rooms = new List<HabitacionDto> { new HabitacionDto { Id = 101 } };

        _serviceMock.Setup(s => s.GetAllRoomsAsync()).ReturnsAsync(rooms);

        var result = await controller.GetAllRooms();

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(rooms, okResult.Value);
    }

    [Fact]
    public async Task RoomsController_GetRoomById_Found_ReturnsOk()
    {
        var controller = new RoomsController(_serviceMock.Object);
        var room = new HabitacionDto { Id = 101, Number = 101 };

        _serviceMock.Setup(s => s.GetRoomByIdAsync(101)).ReturnsAsync(room);

        var result = await controller.GetRoomById(101);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(room, okResult.Value);
    }

    [Fact]
    public async Task RoomsController_GetRoomById_NotFound_Returns404()
    {
        var controller = new RoomsController(_serviceMock.Object);

        _serviceMock.Setup(s => s.GetRoomByIdAsync(999)).ReturnsAsync((HabitacionDto?)null);

        var result = await controller.GetRoomById(999);

        Assert.IsType<NotFoundResult>(result);
    }
}
