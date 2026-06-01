using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BedTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarDatosPaciente : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FechaIngreso",
                table: "Camas",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NombrePaciente",
                table: "Camas",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Patologia",
                table: "Camas",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegistroPaciente",
                table: "Camas",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FechaIngreso",
                table: "Camas");

            migrationBuilder.DropColumn(
                name: "NombrePaciente",
                table: "Camas");

            migrationBuilder.DropColumn(
                name: "Patologia",
                table: "Camas");

            migrationBuilder.DropColumn(
                name: "RegistroPaciente",
                table: "Camas");
        }
    }
}
