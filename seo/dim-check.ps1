$b = [System.IO.File]::ReadAllBytes('D:\IconStash\logo.png')
$w = $b[16]*1 + $b[17]*256 + $b[18]*65536 + $b[19]*16777216
$h = $b[20]*1 + $b[21]*256 + $b[22]*65536 + $b[23]*16777216
Write-Output "logo.png: $w x $h"
$b2 = [System.IO.File]::ReadAllBytes('D:\IconStash\apple-touch-icon.png')
$w2 = $b2[16]*1 + $b2[17]*256 + $b2[18]*65536 + $b2[19]*16777216
$h2 = $b2[20]*1 + $b2[21]*256 + $b2[22]*65536 + $b2[23]*16777216
Write-Output "apple-touch-icon.png: $w2 x $h2"
