using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Finjector.Core.Migrations
{
    public partial class chartType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChartType",
                table: "CoaDetail",
                type: "nvarchar(3)",
                maxLength: 3,
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChartType",
                table: "CoaDetail");
        }
    }
}
