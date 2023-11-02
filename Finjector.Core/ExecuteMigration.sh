dotnet ef database update --startup-project ../Finjector.Web/Finjector.Web.csproj --context AppDbContextSqlServer
# dotnet ef database update --startup-project ../Finjector.Web/Finjector.Web.csproj --context AppDbContextSqlite
# usage from PM console in the Finjector.Core directory: ./ExecuteMigration.sh

echo 'All done';