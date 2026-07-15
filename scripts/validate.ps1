Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

dotnet restore
dotnet build
dotnet test

Push-Location frontend/caderno-app-web
try {
    npm ci
    npm run build
    npm run lint
}
finally {
    Pop-Location
}
