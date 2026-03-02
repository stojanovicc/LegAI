using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppAI.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAiChatFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Timestamp",
                table: "AiMessages",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "AiMessages",
                newName: "Text");

            migrationBuilder.AlterColumn<string>(
                name: "Sender",
                table: "AiMessages",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "AiChatSessions",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "AiChatSessions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "AiChatSessions");

            migrationBuilder.RenameColumn(
                name: "Text",
                table: "AiMessages",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "AiMessages",
                newName: "Timestamp");

            migrationBuilder.AlterColumn<string>(
                name: "Sender",
                table: "AiMessages",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "AiChatSessions",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);
        }
    }
}
