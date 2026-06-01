using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BedTrack.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MejorasArquitectura : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Camas",
                type: "rowversion",
                rowVersion: true,
                nullable: false,
                defaultValue: new byte[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Camas");
        }
    }
}
