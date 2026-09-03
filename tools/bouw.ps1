# =============================================================================
#  Bouwt het SCORM-pakket.
#
#  Draaien:  powershell -ExecutionPolicy Bypass -File tools\bouw.ps1
#  Resultaat: dist\abc-tentamen-elearning-scorm.zip
#
#  Geen Node, geen npm, geen installatie nodig. Het script kopieert src\ naar
#  dist\ en zipt die map. imsmanifest.xml moet in de wortel van de zip staan,
#  anders herkent Brightspace het pakket niet.
# =============================================================================

$ErrorActionPreference = 'Stop'

$wortel = Split-Path -Parent $PSScriptRoot
$bron   = Join-Path $wortel 'src'
$doel   = Join-Path $wortel 'dist'
$docs   = Join-Path $wortel 'docs'   # dit is wat GitHub Pages publiceert
$zip    = Join-Path $doel 'abc-tentamen-elearning-scorm.zip'

if (-not (Test-Path $bron)) {
    throw "Map 'src' niet gevonden op $bron"
}

# --- controle: staan alle bestanden uit het manifest er ook echt? ------------
$manifest = Join-Path $bron 'imsmanifest.xml'
if (-not (Test-Path $manifest)) { throw "imsmanifest.xml ontbreekt in src\" }

[xml]$xml = Get-Content $manifest -Raw
$ontbreekt = @()
foreach ($f in $xml.manifest.resources.resource.file) {
    $pad = Join-Path $bron $f.href
    if (-not (Test-Path $pad)) { $ontbreekt += $f.href }
}
if ($ontbreekt.Count -gt 0) {
    throw "Deze bestanden staan in imsmanifest.xml maar niet in src\: $($ontbreekt -join ', ')"
}

# --- opnieuw opbouwen --------------------------------------------------------
if (Test-Path $doel) {
    Remove-Item $doel -Recurse -Force -Confirm:$false
}
New-Item -ItemType Directory -Path $doel | Out-Null

# Alleen wat in het manifest staat gaat mee. Zo belandt scorm-test.html of een
# ander hulpbestand nooit per ongeluk in het pakket dat studenten krijgen.
Copy-Item -Path $manifest -Destination $doel -Force
foreach ($f in $xml.manifest.resources.resource.file) {
    $vanaf = Join-Path $bron $f.href
    $naar  = Join-Path $doel $f.href
    $map   = Split-Path -Parent $naar
    if (-not (Test-Path $map)) { New-Item -ItemType Directory -Path $map -Force | Out-Null }
    Copy-Item -Path $vanaf -Destination $naar -Force
}

# Compress-Archive met src\* zet de inhoud in de wortel van de zip, precies
# zoals SCORM het wil.
Compress-Archive -Path (Join-Path $doel '*') -DestinationPath $zip -Force

# --- dezelfde bestanden nog een keer, voor GitHub Pages ----------------------
# docs\ staat wél in git; dist\ niet. Zo is wat online staat altijd exact wat er
# ook in het SCORM-pakket zit.
if (Test-Path $docs) {
    Get-ChildItem $docs -Force | Remove-Item -Recurse -Force -Confirm:$false
} else {
    New-Item -ItemType Directory -Path $docs | Out-Null
}
Copy-Item -Path (Join-Path $doel '*') -Destination $docs -Recurse -Force -Exclude '*.zip'

# .nojekyll voorkomt dat GitHub Pages de map door Jekyll haalt. Niet strikt
# nodig hier, maar het scheelt een bouwstap en gedoe met bestandsnamen.
New-Item -ItemType File -Path (Join-Path $docs '.nojekyll') -Force | Out-Null

$grootte = [math]::Round((Get-Item $zip).Length / 1KB, 1)
Write-Host ""
Write-Host "  Klaar." -ForegroundColor Green
Write-Host "  SCORM-pakket : $zip  ($grootte KB)"
Write-Host "  Voor Pages   : $docs  (committen en pushen om online te zetten)"
Write-Host ""
Write-Host "  Volgende stap: upload de zip in Brightspace via"
Write-Host "  Cursusmateriaal -> Inhoud -> Bestaande activiteiten -> SCORM-object."
Write-Host ""
