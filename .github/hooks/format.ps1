$hookInput = [Console]::In.ReadToEnd()

try {
  $toolName = ($hookInput | ConvertFrom-Json -ErrorAction Stop).toolName
} catch {
  Write-Error "Unable to parse postToolUse hook input: $($_.Exception.Message)"
  exit 1
}

if ($toolName -in @("create", "edit", "apply_patch")) {
  npx prettier --write .
  exit $LASTEXITCODE
}
