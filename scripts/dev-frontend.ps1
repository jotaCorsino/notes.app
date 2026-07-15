Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Push-Location frontend/caderno-app-web
try {
    npm run dev -- --host 127.0.0.1
}
finally {
    Pop-Location
}
