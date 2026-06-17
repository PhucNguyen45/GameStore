using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameStore.Repository.Migrations
{
    /// <inheritdoc />
    public partial class ConvertPricesToBigint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop check constraints before altering column types
            migrationBuilder.Sql("ALTER TABLE Users DROP CONSTRAINT CK_User_Wallet_NonNegative");
            migrationBuilder.Sql("ALTER TABLE Games DROP CONSTRAINT CK_Game_Price_NonNegative");
            migrationBuilder.Sql("ALTER TABLE Games DROP CONSTRAINT CK_Game_DiscountPrice_NonNegative");
            migrationBuilder.Sql("ALTER TABLE Orders DROP CONSTRAINT CK_Order_TotalAmount_NonNegative");
            migrationBuilder.Sql("ALTER TABLE OrderDetails DROP CONSTRAINT CK_OrderDetail_UnitPrice_NonNegative");

            migrationBuilder.AlterColumn<long>(
                name: "Wallet",
                table: "Users",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldDefaultValue: 0m);

            migrationBuilder.AlterColumn<long>(
                name: "Amount",
                table: "Payments",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<long>(
                name: "TotalAmount",
                table: "Orders",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<long>(
                name: "UnitPrice",
                table: "OrderDetails",
                type: "bigint",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");

            migrationBuilder.AlterColumn<long>(
                name: "Price",
                table: "Games",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldDefaultValue: 0m);

            migrationBuilder.AlterColumn<long>(
                name: "DiscountPrice",
                table: "Games",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            // Recreate check constraints for the new bigint columns
            migrationBuilder.Sql("ALTER TABLE Users ADD CONSTRAINT CK_User_Wallet_NonNegative CHECK (Wallet >= 0)");
            migrationBuilder.Sql("ALTER TABLE Games ADD CONSTRAINT CK_Game_Price_NonNegative CHECK (Price >= 0)");
            migrationBuilder.Sql("ALTER TABLE Games ADD CONSTRAINT CK_Game_DiscountPrice_NonNegative CHECK (DiscountPrice >= 0)");
            migrationBuilder.Sql("ALTER TABLE Orders ADD CONSTRAINT CK_Order_TotalAmount_NonNegative CHECK (TotalAmount >= 0)");
            migrationBuilder.Sql("ALTER TABLE OrderDetails ADD CONSTRAINT CK_OrderDetail_UnitPrice_NonNegative CHECK (UnitPrice >= 0)");

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 444, DateTimeKind.Utc).AddTicks(4073), 27990L, 34990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(432), 9990L, 19990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(447), null, 14990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(451), 44990L, 49990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(455), 9990L, 29990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(458), 29990L, 39990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(462), null, 49990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(466), 34990L, 39990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(471), 14990L, 29990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(505), null, 29990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(509), 29990L, 49990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(513), 19990L, 29990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(516), 20990L, 29990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(519), 39990L, 49990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(522), null, 39990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(525), 4990L, 9990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(529), 14990L, 19990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(532), null, 24990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(535), 24990L, 34990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(538), null, 44990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(541), 49990L, 59990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(544), 9990L, 14990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(547), null, 4990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(550), 11990L, 16990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(554), null, 22990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(557), null, 0L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(560), null, 0L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(569), null, 25990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(572), 44990L, 54990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(575), null, 7990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 31,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(578), 9990L, 12990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 32,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(581), null, 32990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 33,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(584), 14990L, 18990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 34,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(588), null, 21990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 35,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(591), 22990L, 27990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 36,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(598), null, 5990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 37,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(601), null, 11990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 38,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(604), 34990L, 42990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(607), 11990L, 15990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 40,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(610), null, 31990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 41,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(612), 6990L, 8990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 42,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(615), null, 19990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 43,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(619), 29990L, 36990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 44,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(624), 22990L, 28990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 45,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(627), null, 23990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 46,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(639), 35990L, 45990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 47,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(642), null, 38990L });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 48,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 17, 3, 50, 445, DateTimeKind.Utc).AddTicks(645), 13990L, 17990L });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDateTime",
                value: new DateTime(2026, 6, 4, 17, 3, 50, 390, DateTimeKind.Utc).AddTicks(1263));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDateTime",
                value: new DateTime(2026, 6, 4, 17, 3, 50, 390, DateTimeKind.Utc).AddTicks(4231));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDateTime",
                value: new DateTime(2026, 6, 4, 17, 3, 50, 390, DateTimeKind.Utc).AddTicks(4245));

            migrationBuilder.UpdateData(
                table: "UserRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDateTime",
                value: new DateTime(2026, 6, 4, 17, 3, 50, 443, DateTimeKind.Utc).AddTicks(7799));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt", "Wallet" },
                values: new object[] { "HdU1kNsl8MIkPs61DHI2mzLngf1jW7lE42s/5SUNnAE=", new byte[] { 200, 236, 23, 184, 96, 166, 129, 49, 82, 189, 167, 16, 48, 56, 102, 105 }, 9999000L });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Wallet",
                table: "Users",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldDefaultValue: 0L);

            migrationBuilder.AlterColumn<decimal>(
                name: "Amount",
                table: "Payments",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAmount",
                table: "Orders",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<decimal>(
                name: "UnitPrice",
                table: "OrderDetails",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Games",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldDefaultValue: 0L);

            migrationBuilder.AlterColumn<decimal>(
                name: "DiscountPrice",
                table: "Games",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 978, DateTimeKind.Utc).AddTicks(4782), 27.99m, 34.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(4941), 9.99m, 19.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5028), null, 14.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5043), 44.99m, 49.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5056), 9.99m, 29.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5158), 29.99m, 39.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5172), null, 49.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5184), 34.99m, 39.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5197), 14.99m, 29.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5208), null, 29.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5218), 29.99m, 49.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5228), 19.99m, 29.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5240), 20.99m, 29.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5250), 39.99m, 49.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5258), null, 39.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5269), 4.99m, 9.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5278), 14.99m, 19.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5287), null, 24.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5295), 24.99m, 34.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5305), null, 44.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5312), 49.99m, 59.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5321), 9.99m, 14.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5351), null, 4.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5360), 11.99m, 16.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5368), null, 22.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5377), null, 0m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5388), null, 0m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5395), null, 25.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5402), 44.99m, 54.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5411), null, 7.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 31,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5421), 9.99m, 12.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 32,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5430), null, 32.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 33,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5438), 14.99m, 18.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 34,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5447), null, 21.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 35,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5455), 22.99m, 27.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 36,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5464), null, 5.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 37,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5473), null, 11.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 38,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5481), 34.99m, 42.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5493), 11.99m, 15.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 40,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5502), null, 31.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 41,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5531), 6.99m, 8.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 42,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5541), null, 19.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 43,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5549), 29.99m, 36.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 44,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5557), 22.99m, 28.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 45,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5565), null, 23.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 46,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5574), 35.99m, 45.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 47,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5584), null, 38.99m });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 48,
                columns: new[] { "CreatedAt", "DiscountPrice", "Price" },
                values: new object[] { new DateTime(2026, 6, 4, 15, 52, 55, 980, DateTimeKind.Utc).AddTicks(5591), 13.99m, 17.99m });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDateTime",
                value: new DateTime(2026, 6, 4, 15, 52, 55, 841, DateTimeKind.Utc).AddTicks(9798));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedDateTime",
                value: new DateTime(2026, 6, 4, 15, 52, 55, 843, DateTimeKind.Utc).AddTicks(924));

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedDateTime",
                value: new DateTime(2026, 6, 4, 15, 52, 55, 843, DateTimeKind.Utc).AddTicks(971));

            migrationBuilder.UpdateData(
                table: "UserRoles",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedDateTime",
                value: new DateTime(2026, 6, 4, 15, 52, 55, 976, DateTimeKind.Utc).AddTicks(7890));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Password", "Salt", "Wallet" },
                values: new object[] { "jRwcZWF2lpOIL7CFY/kiU7K18ASTXFekTZAOMmFDjp4=", new byte[] { 133, 4, 112, 150, 90, 101, 1, 176, 36, 90, 68, 104, 117, 196, 43, 198 }, 9999m });
        }
    }
}
