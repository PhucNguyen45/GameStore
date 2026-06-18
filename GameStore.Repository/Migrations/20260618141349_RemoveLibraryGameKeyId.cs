using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameStore.Repository.Migrations
{
    /// <inheritdoc />
    public partial class RemoveLibraryGameKeyId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GameKeyId",
                table: "Libraries");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GameKeyId",
                table: "Libraries",
                type: "int",
                nullable: true);
        }
    }
}
