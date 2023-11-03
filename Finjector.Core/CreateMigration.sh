[ "$#" -eq 1 ] || { echo "1 argument required, $# provided. Useage: sh CreateMigration <MigrationName>"; exit 1; }

dotnet ef migrations add $1 --context AppDbContextSqlServer --output-dir Migrations --startup-project ../Finjector.Web --project ../Finjector.Core
# usage from PM console in the Finjector.Core directory: ./CreateMigration.sh <MigrationName>

echo 'All done';