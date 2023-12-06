using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Finjector.Core.Migrations
{
    public partial class renameCoas : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Coas_Folders_FolderId",
                table: "Coas");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Coas",
                table: "Coas");

            migrationBuilder.RenameTable(
                name: "Coas",
                newName: "ChartStrings");

            migrationBuilder.RenameIndex(
                name: "IX_Coas_FolderId",
                table: "ChartStrings",
                newName: "IX_ChartStrings_FolderId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ChartStrings",
                table: "ChartStrings",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ChartStrings_Folders_FolderId",
                table: "ChartStrings",
                column: "FolderId",
                principalTable: "Folders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChartStrings_Folders_FolderId",
                table: "ChartStrings");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ChartStrings",
                table: "ChartStrings");

            migrationBuilder.RenameTable(
                name: "ChartStrings",
                newName: "Coas");

            migrationBuilder.RenameIndex(
                name: "IX_ChartStrings_FolderId",
                table: "Coas",
                newName: "IX_Coas_FolderId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Coas",
                table: "Coas",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Coas_Folders_FolderId",
                table: "Coas",
                column: "FolderId",
                principalTable: "Folders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
