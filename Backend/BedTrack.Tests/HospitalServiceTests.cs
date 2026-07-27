using System;
using System.Threading.Tasks;
using BedTrack.Application.DTOs;
using BedTrack.Application.Interfaces;
using BedTrack.Application.Services;
using BedTrack.Domain.Entities;
using BedTrack.Domain.Enums;
using Moq;
using Xunit;

namespace BedTrack.Tests;

public class HospitalServiceTests
{
    private readonly Mock<IHospitalRepository> _repoMock;
    private readonly HospitalService _service;

    public HospitalServiceTests()
    {
        _repoMock = new Mock<IHospitalRepository>();
        _service = new HospitalService(_repoMock.Object);
    }

    [Fact]
    public async Task UpdateBedStatusAsync_OcuparDisponible_ShouldSucceed()
    {
        var cama = new Cama(1, 101);
        _repoMock.Setup(r => r.ObtenerCamaPorIdAsync(1)).ReturnsAsync(cama);

        var request = new UpdateBedStatusDto
        {
            Status = "ocupada",
            Patient = new PacienteDto
            {
                Nombre = "Juan",
                Apellido = "Pérez",
                Edad = 40,
                Diagnostico = "Gripe",
                DiasInternacion = 5,
                FechaIngreso = "2026-07-27"
            }
        };

        var result = await _service.UpdateBedStatusAsync(1, request);

        Assert.Equal(EstadoCama.Ocupada, cama.Estado);
        Assert.Equal("ocupada", result.Status);
        Assert.NotNull(result.Patient);
        Assert.Equal("Juan", result.Patient.Nombre);
        _repoMock.Verify(r => r.AgregarPacienteAsync(It.IsAny<Paciente>()), Times.Once);
        _repoMock.Verify(r => r.GuardarCambiosAsync(), Times.AtLeastOnce);
    }

    [Fact]
    public async Task UpdateBedStatusAsync_OcuparEnLimpieza_ShouldSucceed()
    {
        var cama = new Cama(1, 101);
        cama.LiberarParaLimpieza();
        _repoMock.Setup(r => r.ObtenerCamaPorIdAsync(1)).ReturnsAsync(cama);

        var request = new UpdateBedStatusDto
        {
            Status = "ocupada",
            Patient = new PacienteDto
            {
                Nombre = "María",
                Apellido = "Gómez",
                Edad = 30,
                Diagnostico = "Observación",
                DiasInternacion = 3,
                FechaIngreso = "2026-07-27"
            }
        };

        var result = await _service.UpdateBedStatusAsync(1, request);

        Assert.Equal(EstadoCama.Ocupada, cama.Estado);
        Assert.Equal("ocupada", result.Status);
        Assert.NotNull(result.Patient);
        Assert.Equal("María", result.Patient.Nombre);
    }

    [Fact]
    public async Task UpdateBedStatusAsync_OcupadaToEnLimpieza_ShouldRemovePatientAndSetEnLimpieza()
    {
        var cama = new Cama(1, 101);
        var paciente = new Paciente("Carlos", "Soto", 50, "Control", 2, DateTime.UtcNow);
        cama.Ocupar(paciente.Id);
        cama.Paciente = paciente;

        _repoMock.Setup(r => r.ObtenerCamaPorIdAsync(1)).ReturnsAsync(cama);

        var request = new UpdateBedStatusDto
        {
            Status = "enlimpieza"
        };

        var result = await _service.UpdateBedStatusAsync(1, request);

        Assert.Equal(EstadoCama.EnLimpieza, cama.Estado);
        Assert.Equal("enlimpieza", result.Status);
        Assert.Null(result.Patient);
        _repoMock.Verify(r => r.EliminarPaciente(paciente), Times.Once);
    }

    [Fact]
    public async Task UpdateBedStatusAsync_EnLimpiezaToDisponible_ShouldHabilitarCama()
    {
        var cama = new Cama(1, 101);
        cama.LiberarParaLimpieza();

        _repoMock.Setup(r => r.ObtenerCamaPorIdAsync(1)).ReturnsAsync(cama);

        var request = new UpdateBedStatusDto
        {
            Status = "disponible"
        };

        var result = await _service.UpdateBedStatusAsync(1, request);

        Assert.Equal(EstadoCama.Disponible, cama.Estado);
        Assert.Equal("disponible", result.Status);
    }

    [Fact]
    public async Task UpdateBedStatusAsync_EditPatientOnOccupiedBed_ShouldUpdatePatientData()
    {
        var cama = new Cama(1, 101);
        var paciente = new Paciente("Ana", "López", 25, "Fiebre", 3, DateTime.UtcNow);
        cama.Ocupar(paciente.Id);
        cama.Paciente = paciente;

        _repoMock.Setup(r => r.ObtenerCamaPorIdAsync(1)).ReturnsAsync(cama);

        var request = new UpdateBedStatusDto
        {
            Status = "ocupada",
            Patient = new PacienteDto
            {
                Nombre = "Ana",
                Apellido = "López",
                Edad = 26,
                Diagnostico = "Recuperada",
                DiasInternacion = 7,
                FechaIngreso = "2026-07-27"
            }
        };

        var result = await _service.UpdateBedStatusAsync(1, request);

        Assert.Equal(26, paciente.Edad);
        Assert.Equal("Recuperada", paciente.Diagnostico);
        Assert.Equal(7, paciente.DiasInternacion);
        Assert.Equal("ocupada", result.Status);
    }
}
