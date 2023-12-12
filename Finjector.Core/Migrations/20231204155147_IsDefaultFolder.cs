using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Finjector.Core.Migrations
{
    public partial class IsDefaultFolder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "Folders",
                nullable: false,
                defaultValue: false);

            migrationBuilder.Sql(
                @"UPDATE Folders
                  SET IsDefault = CASE WHEN Name = 'Default' THEN 1 ELSE 0 END");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "Folders");
        }
    }
}
