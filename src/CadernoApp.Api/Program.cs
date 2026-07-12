using CadernoApp.Api.Endpoints;
using CadernoApp.Application;
using CadernoApp.Infrastructure;
using CadernoApp.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");

builder.Services.AddApplication();
builder.Services.AddInfrastructure(connectionString);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<CadernoAppDbContext>();

    dbContext.Database.EnsureCreated();
}

app.MapSubjectEndpoints();
app.MapStudyModuleEndpoints();
app.MapNoteEndpoints();

app.Run();

public partial class Program
{
}
