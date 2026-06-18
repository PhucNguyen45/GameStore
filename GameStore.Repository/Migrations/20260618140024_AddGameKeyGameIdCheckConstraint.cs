using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameStore.Repository.Migrations
{
    /// <inheritdoc />
    public partial class AddGameKeyGameIdCheckConstraint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ========== AUDIT STANDARDIZATION ==========
            // Remove redundant Entity base class columns (CreatedDateTime, CreatedUser)
            // from entities that already implement IAuditable (Role, UserRole, Setting).
            // AccessToken now implements IAuditable fully instead of extending Entity.

            migrationBuilder.DropColumn(
                name: "CreatedDateTime",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CreatedUser",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "CreatedDateTime",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "CreatedUser",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "CreatedDateTime",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "CreatedUser",
                table: "Roles");

            migrationBuilder.RenameColumn(
                name: "CreatedUser",
                table: "AccessTokens",
                newName: "ModifiedBy");

            migrationBuilder.RenameColumn(
                name: "CreatedDateTime",
                table: "AccessTokens",
                newName: "Modified");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "AccessTokens",
                type: "bit",
                nullable: false,
                defaultValue: false);

            // ========== CHECK CONSTRAINT: GameKey.GameId must match OrderDetail.GameId ==========
            // Creates a scalar UDF that validates the GameId match, then adds a CHECK constraint
            // that prevents assigning a key of game A to an order detail of game B.

            migrationBuilder.Sql(@"
                CREATE FUNCTION dbo.fn_GameKey_OrderDetail_GameMatch(@GameKeyId int)
                RETURNS bit
                WITH SCHEMABINDING
                AS
                BEGIN
                    DECLARE @result bit = 0;
                    IF EXISTS (
                        SELECT 1 FROM dbo.GameKeys gk
                        INNER JOIN dbo.OrderDetails od ON gk.OrderDetailId = od.Id
                        WHERE gk.Id = @GameKeyId AND gk.GameId = od.GameId
                    )
                        SET @result = 1;
                    RETURN @result;
                END;
            ");

            migrationBuilder.Sql(@"
                ALTER TABLE dbo.GameKeys
                ADD CONSTRAINT CK_GameKey_GameId_Matches_OrderDetail
                CHECK (OrderDetailId IS NULL OR dbo.fn_GameKey_OrderDetail_GameMatch(Id) = 1);
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // ========== DROP CHECK CONSTRAINT ==========
            migrationBuilder.Sql(@"
                ALTER TABLE dbo.GameKeys
                DROP CONSTRAINT CK_GameKey_GameId_Matches_OrderDetail;
            ");

            migrationBuilder.Sql(@"
                DROP FUNCTION dbo.fn_GameKey_OrderDetail_GameMatch;
            ");

            // ========== REVERT AUDIT CHANGES ==========
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "AccessTokens");

            migrationBuilder.RenameColumn(
                name: "ModifiedBy",
                table: "AccessTokens",
                newName: "CreatedUser");

            migrationBuilder.RenameColumn(
                name: "Modified",
                table: "AccessTokens",
                newName: "CreatedDateTime");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDateTime",
                table: "UserRoles",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedUser",
                table: "UserRoles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDateTime",
                table: "Settings",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedUser",
                table: "Settings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDateTime",
                table: "Roles",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CreatedUser",
                table: "Roles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
