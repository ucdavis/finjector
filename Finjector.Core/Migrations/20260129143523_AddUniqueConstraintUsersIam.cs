using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Finjector.Core.Migrations
{
    public partial class AddUniqueConstraintUsersIam : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Users_Iam",
                table: "Users",
                column: "Iam",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_Iam",
                table: "Users");
        }
    }
}
