using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BedTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditLogColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UsuarioEmail",
                table: "HistorialCamas",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "NosocomioId",
                table: "HistorialCamas",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SucursalId",
                table: "HistorialCamas",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UsuarioRol",
                table: "HistorialCamas",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NosocomioId",
                table: "HistorialCamas");

            migrationBuilder.DropColumn(
                name: "SucursalId",
                table: "HistorialCamas");

            migrationBuilder.DropColumn(
                name: "UsuarioRol",
                table: "HistorialCamas");

            migrationBuilder.AlterColumn<string>(
                name: "UsuarioEmail",
                table: "HistorialCamas",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);
        }
    }
}
