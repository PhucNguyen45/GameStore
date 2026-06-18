using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameStore.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddRecipientEmailToOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RecipientEmail",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "Y83b1Z3U/1NGqsGYHIP8S7q9QqkpgzZVLqClJt3t368=", new byte[] { 158, 216, 60, 175, 59, 4, 63, 75, 220, 240, 81, 104, 148, 182, 13, 158 } });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RecipientEmail",
                table: "Orders");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt" },
                values: new object[] { "aNI9hhuZlAhqC33Hc1ZKZjtxYjvlxObpS7y8kHhkWyc=", new byte[] { 242, 0, 18, 135, 189, 87, 26, 29, 127, 84, 200, 243, 201, 225, 71, 28 } });
        }
    }
}
