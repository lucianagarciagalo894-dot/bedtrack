using System;
using BedTrack.Domain.Entities;
using BedTrack.Domain.Enums;
using Xunit;

namespace BedTrack.Tests;

public class CamaDomainTests
{
    [Fact]
    public void Constructor_ShouldInitializeAsDisponible()
    {
        var cama = new Cama(1, 101);

        Assert.Equal(1, cama.Numero);
        Assert.Equal(101, cama.HabitacionId);
        Assert.Equal(EstadoCama.Disponible, cama.Estado);
        Assert.Null(cama.PacienteId);
    }

    [Fact]
    public void Ocupar_FromDisponible_ShouldSetEstadoOcupadaAndPacienteId()
    {
        var cama = new Cama(1, 101);

        cama.Ocupar(42);

        Assert.Equal(EstadoCama.Ocupada, cama.Estado);
        Assert.Equal(42, cama.PacienteId);
    }

    [Fact]
    public void Ocupar_FromEnLimpieza_ShouldSetEstadoOcupadaAndPacienteId()
    {
        var cama = new Cama(1, 101);
        cama.LiberarParaLimpieza();

        cama.Ocupar(42);

        Assert.Equal(EstadoCama.Ocupada, cama.Estado);
        Assert.Equal(42, cama.PacienteId);
    }

    [Fact]
    public void LiberarParaLimpieza_ShouldSetEstadoEnLimpiezaAndClearPaciente()
    {
        var cama = new Cama(1, 101);
        cama.Ocupar(42);

        cama.LiberarParaLimpieza();

        Assert.Equal(EstadoCama.EnLimpieza, cama.Estado);
        Assert.Null(cama.PacienteId);
    }

    [Fact]
    public void Habilitar_ShouldSetEstadoDisponible()
    {
        var cama = new Cama(1, 101);
        cama.LiberarParaLimpieza();

        cama.Habilitar();

        Assert.Equal(EstadoCama.Disponible, cama.Estado);
        Assert.Null(cama.PacienteId);
    }
}
