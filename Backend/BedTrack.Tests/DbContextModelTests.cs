using BedTrack.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BedTrack.Tests;

public class DbContextModelTests
{
    [Fact]
    public void ApplicationDbContext_ModelBuilding_ShouldSucceedWithoutConstructorErrors()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "TestModelBuildingDb")
            .Options;

        using var context = new ApplicationDbContext(options);

        // Accessing context.Model triggers EF Core model finalizing and constructor binding validation
        var model = context.Model;

        Assert.NotNull(model);
        Assert.NotNull(model.FindEntityType(typeof(BedTrack.Domain.Entities.HistorialCama)));
    }
}
