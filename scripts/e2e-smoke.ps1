$ErrorActionPreference = "Stop"
$base = "http://localhost:3000"
$cookieJar = "$PSScriptRoot\cookies-e2e.txt"
if (Test-Path $cookieJar) { Remove-Item $cookieJar }

function Test-Status($name, $url, $expected, $method = "GET", $body = $null) {
  $args = @("-s", "-o", "NUL", "-w", "%{http_code}", "-c", $cookieJar, "-b", $cookieJar)
  if ($method -eq "POST") { $args += @("-X", "POST", "-H", "Content-Type: application/json") }
  if ($body) {
    if ($body.StartsWith("@")) {
      $args += @("--data-binary", $body)
    } else {
      $args += @("-d", $body)
    }
  }
  $args += $url
  $code = & curl.exe @args
  $ok = $code -eq $expected
  Write-Host ("[{0}] {1} -> {2} (attendu {3})" -f ($(if ($ok) { "OK" } else { "FAIL" })), $name, $code, $expected)
  if (-not $ok) { throw "Echec: $name" }
}

Test-Status "Categories publiques" "$base/api/categories" "200"
Test-Status "Catalogue produits" "$base/api/produits?limit=2" "200"
$registerBody = "$PSScriptRoot\tmp-register-body.json"
Set-Content -Path $registerBody -Encoding utf8NoBOM -Value '{"username":"x","email":"bad","password":"x"}'
$loginBody = "$PSScriptRoot\tmp-login-body.json"
Set-Content -Path $loginBody -Encoding utf8NoBOM -Value '{"email":"admin.dev@test.com","password":"Admin123!"}'

Test-Status "Register route existe" "$base/api/auth/register" "400" "POST" "@$registerBody"
Test-Status "Login admin" "$base/api/auth/login" "200" "POST" "@$loginBody"
Test-Status "Profil utilisateur" "$base/api/users/me" "200"
Test-Status "Commandes utilisateur" "$base/api/orders" "200"
Test-Status "Admin produits" "$base/api/admin/products" "200"

Write-Host ""
Write-Host "Tous les tests smoke API sont OK."
