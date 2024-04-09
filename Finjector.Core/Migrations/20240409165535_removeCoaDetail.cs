using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Finjector.Core.Migrations
{
    public partial class removeCoaDetail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Coas_CoaDetails_SegmentString",
                table: "Coas");

            migrationBuilder.DropTable(
                name: "CoaDetails");

            migrationBuilder.DropIndex(
                name: "IX_Coas_SegmentString",
                table: "Coas");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CoaDetails",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Activity = table.Column<string>(type: "nvarchar(6)", maxLength: 6, nullable: false),
                    ActivityDetails = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ChartType = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    Department = table.Column<string>(type: "nvarchar(7)", maxLength: 7, nullable: false),
                    DepartmentDetails = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Entity = table.Column<string>(type: "nvarchar(4)", maxLength: 4, nullable: false),
                    EntityDetails = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Fund = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    FundDetails = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NaturalAccount = table.Column<string>(type: "nvarchar(6)", maxLength: 6, nullable: false),
                    NaturalAccountDetails = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Program = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    ProgramDetails = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Project = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    ProjectDetails = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Purpose = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    PurposeDetails = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Task = table.Column<string>(type: "nvarchar(6)", maxLength: 6, nullable: false),
                    TaskDetails = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoaDetails", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Coas_SegmentString",
                table: "Coas",
                column: "SegmentString");

            migrationBuilder.AddForeignKey(
                name: "FK_Coas_CoaDetails_SegmentString",
                table: "Coas",
                column: "SegmentString",
                principalTable: "CoaDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
