using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BedTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDiasInternacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DiasInternacion",
                table: "Pacientes",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiasInternacion",
                table: "Pacientes");
        }
    }
}
