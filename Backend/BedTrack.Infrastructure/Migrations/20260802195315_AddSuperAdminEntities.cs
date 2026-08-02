using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BedTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSuperAdminEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SucursalId",
                table: "Pisos",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "HistorialCamas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CamaId = table.Column<int>(type: "integer", nullable: false),
                    CamaNumero = table.Column<int>(type: "integer", nullable: false),
                    HabitacionId = table.Column<int>(type: "integer", nullable: false),
                    HabitacionNumero = table.Column<int>(type: "integer", nullable: false),
                    UsuarioNombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    UsuarioEmail = table.Column<string>(type: "text", nullable: false),
                    Accion = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    EstadoAnterior = table.Column<string>(type: "text", nullable: false),
                    EstadoNuevo = table.Column<string>(type: "text", nullable: false),
                    FechaHora = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorialCamas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nosocomios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Codigo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Direccion = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nosocomios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sucursales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Direccion = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    NosocomioId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sucursales", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sucursales_Nosocomios_NosocomioId",
                        column: x => x.NosocomioId,
                        principalTable: "Nosocomios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UsuariosStaff",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nombre = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Password = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Rol = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    NosocomioId = table.Column<int>(type: "integer", nullable: true),
                    SucursalId = table.Column<int>(type: "integer", nullable: true),
                    Activo = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsuariosStaff", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UsuariosStaff_Nosocomios_NosocomioId",
                        column: x => x.NosocomioId,
                        principalTable: "Nosocomios",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_UsuariosStaff_Sucursales_SucursalId",
                        column: x => x.SucursalId,
                        principalTable: "Sucursales",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Pisos_SucursalId",
                table: "Pisos",
                column: "SucursalId");

            migrationBuilder.CreateIndex(
                name: "IX_Sucursales_NosocomioId",
                table: "Sucursales",
                column: "NosocomioId");

            migrationBuilder.CreateIndex(
                name: "IX_UsuariosStaff_NosocomioId",
                table: "UsuariosStaff",
                column: "NosocomioId");

            migrationBuilder.CreateIndex(
                name: "IX_UsuariosStaff_SucursalId",
                table: "UsuariosStaff",
                column: "SucursalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Pisos_Sucursales_SucursalId",
                table: "Pisos",
                column: "SucursalId",
                principalTable: "Sucursales",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pisos_Sucursales_SucursalId",
                table: "Pisos");

            migrationBuilder.DropTable(
                name: "HistorialCamas");

            migrationBuilder.DropTable(
                name: "UsuariosStaff");

            migrationBuilder.DropTable(
                name: "Sucursales");

            migrationBuilder.DropTable(
                name: "Nosocomios");

            migrationBuilder.DropIndex(
                name: "IX_Pisos_SucursalId",
                table: "Pisos");

            migrationBuilder.DropColumn(
                name: "SucursalId",
                table: "Pisos");
        }
    }
}
