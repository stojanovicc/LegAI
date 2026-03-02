using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppAI.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class Docx : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DocxTemplatePath",
                table: "DocumentTemplates",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocxTemplatePath",
                table: "DocumentTemplates");
        }
    }
}
