param()
$ErrorActionPreference = 'SilentlyContinue'
$root = 'D:\IconStash'
$report = New-Object System.Collections.Generic.List[string]

# ---------- 1. Enumerate real pages (index.html, exclude .git/vendor/data) ----------
$pages = Get-ChildItem -Path $root -Recurse -Filter index.html | Where-Object {
    $p = $_.FullName
    $p -notmatch '\\\.git\\' -and $p -notmatch '\\vendor\\' -and $p -notmatch '\\data\\' -and $p -notmatch '\\iconstash\.io-audit\\'
}
$report.Add("TOTAL_REAL_PAGES: $($pages.Count)")

$pageRecords = @()
foreach ($f in $pages) {
    $raw = [System.IO.File]::ReadAllText($f.FullName)
    $headEnd = $raw.IndexOf('</head>')
    $head = if ($headEnd -gt 0) { $raw.Substring(0, $headEnd) } else { $raw }
    $rel = $f.FullName.Substring($root.Length + 1).Replace('\','/')
    $url = if ($rel -eq 'index.html') { 'https://iconstash.io/' } else { 'https://iconstash.io/' + $rel.Replace('/index.html','/') }

    $title = if ($head -match '<title>([^<]*)</title>') { $Matches[1] } else { '' }
    $desc = if ($head -match '<meta name="description" content="([^"]*)"') { $Matches[1] } else { '' }
    $canon = if ($head -match 'rel="canonical" href="([^"]+)"') { $Matches[1] } else { '' }
    $robotsMeta = if ($head -match '<meta name="robots" content="([^"]*)"') { $Matches[1] } else { '' }
    $h1Count = ([regex]::Matches($raw, '<h1[\s>]')).Count
    $hasOgTitle = $head -match 'og:title'
    $hasOgImage = $head -match 'og:image'
    $hasTwitterCard = $head -match 'twitter:card'
    $ldjsonCount = ([regex]::Matches($head, 'application/ld\+json')).Count
    $viewport = $head -match 'name="viewport"'
    $htmlLang = if ($raw -match '<html[^>]*lang="([^"]*)"') { $Matches[1] } else { 'MISSING' }
    $sizeKB = [math]::Round($f.Length / 1KB)

    $pageRecords += [pscustomobject]@{
        File=$rel; Url=$url; Title=$title; Desc=$desc; Canon=$canon
        RobotsMeta=$robotsMeta; H1=$h1Count; OgTitle=$hasOgTitle; OgImage=$hasOgImage
        Twitter=$hasTwitterCard; LD=$ldjsonCount; Viewport=$viewport; Lang=$htmlLang; KB=$sizeKB
    }
}

# ---------- 2. Issues ----------
$report.Add('=== MISSING/EMPTY TITLE ===')
$pageRecords | Where-Object { -not $_.Title } | ForEach-Object { $report.Add($_.File) }
$report.Add('=== MISSING/EMPTY META DESCRIPTION ===')
$pageRecords | Where-Object { -not $_.Desc } | ForEach-Object { $report.Add($_.File) }
$report.Add('=== MISSING CANONICAL ===')
$pageRecords | Where-Object { -not $_.Canon } | ForEach-Object { $report.Add($_.File) }
$report.Add('=== CANONICAL != OWN URL (cross-canonical) ===')
$pageRecords | Where-Object { $_.Canon -and $_.Canon.TrimEnd('/') -ne $_.Url.TrimEnd('/') } | ForEach-Object { $report.Add("$($_.File) -> $($_.Canon)") }
$report.Add('=== H1 COUNT != 1 ===')
$pageRecords | Where-Object { $_.H1 -ne 1 } | ForEach-Object { $report.Add("$($_.File) (h1=$($_.H1))") }
$report.Add('=== NOINDEX / robots meta ===')
$pageRecords | Where-Object { $_.RobotsMeta } | ForEach-Object { $report.Add("$($_.File): $($_.RobotsMeta)") }
$report.Add('=== MISSING OG TITLE/IMAGE ===')
$pageRecords | Where-Object { -not $_.OgTitle -or -not $_.OgImage } | ForEach-Object { $report.Add($_.File) }
$report.Add('=== MISSING TWITTER CARD ===')
$pageRecords | Where-Object { -not $_.Twitter } | ForEach-Object { $report.Add($_.File) }
$report.Add('=== ZERO JSON-LD ===')
$pageRecords | Where-Object { $_.LD -eq 0 } | ForEach-Object { $report.Add($_.File) }
$report.Add('=== MISSING VIEWPORT ===')
$pageRecords | Where-Object { -not $_.Viewport } | ForEach-Object { $report.Add($_.File) }

$report.Add('=== SHORT TITLES (<30 chars) ===')
$pageRecords | Where-Object { $_.Title -and $_.Title.Length -lt 30 } | ForEach-Object { $report.Add("$($_.File) [$($_.Title.Length)]: $($_.Title)") }
$report.Add('=== LONG TITLES (>60 chars) ===')
$pageRecords | Where-Object { $_.Title.Length -gt 60 } | ForEach-Object { $report.Add("$($_.File) [$($_.Title.Length)]: $($_.Title)") }
$report.Add('=== SHORT DESCRIPTIONS (<70 chars) ===')
$pageRecords | Where-Object { $_.Desc -and $_.Desc.Length -lt 70 } | ForEach-Object { $report.Add("$($_.File) [$($_.Desc.Length)]") }
$report.Add('=== LONG DESCRIPTIONS (>165 chars) ===')
$pageRecords | Where-Object { $_.Desc.Length -gt 165 } | ForEach-Object { $report.Add("$($_.File) [$($_.Desc.Length)]") }
$report.Add('=== DUPLICATE TITLES ===')
$pageRecords | Group-Object Title | Where-Object { $_.Count -gt 1 -and $_.Name } | ForEach-Object { $report.Add("x$($_.Count): $($_.Name) :: $((($_.Group | Select-Object -First 3).File) -join ', ')") }
$report.Add('=== DUPLICATE DESCRIPTIONS ===')
$pageRecords | Group-Object Desc | Where-Object { $_.Count -gt 1 -and $_.Name } | ForEach-Object { $report.Add("x$($_.Count): $((($_.Group | Select-Object -First 3).File) -join ', ')") }
$report.Add('=== PAGE WEIGHT > 300KB ===')
$pageRecords | Where-Object { $_.KB -gt 300 } | ForEach-Object { $report.Add("$($_.File) = $($_.KB) KB") }
$report.Add('=== LANG MISSING ===')
$pageRecords | Where-Object { $_.Lang -eq 'MISSING' } | ForEach-Object { $report.Add($_.File) }

# ---------- 3. Sitemap consistency ----------
$report.Add('=== SITEMAP URLS NOT MATCHING A REAL PAGE FILE ===')
$sitemapUrls = @()
foreach ($sf in (Get-ChildItem "$root\sitemaps" -Filter *.xml) + (Get-ChildItem "$root" -Filter *sitemap*.xml | Where-Object Name -ne 'sitemap.xml')) {
    $content = [System.IO.File]::ReadAllText($sf.FullName)
    foreach ($m in [regex]::Matches($content, '<loc>([^<]+)</loc>')) { $sitemapUrls += $m.Groups[1].Value }
}
$pageUrlSet = @{}
foreach ($p in $pageRecords) { $pageUrlSet[$p.Url.TrimEnd('/')] = $true }
$missing = $sitemapUrls | Where-Object { -not $pageUrlSet[$_.TrimEnd('/')] } | Select-Object -Unique
$report.Add("sitemap urls total(unique): $((($sitemapUrls | Select-Object -Unique).Count)) ; not-on-disk: $($missing.Count)")
$missing | Select-Object -First 25 | ForEach-Object { $report.Add("MISSING: $_") }

# Real pages not in any sitemap
$report.Add('=== REAL PAGES NOT IN ANY SITEMAP ===')
$sitemapSet = @{}
foreach ($u in $sitemapUrls) { $sitemapSet[$u.TrimEnd('/')] = $true }
$notInSitemap = $pageRecords | Where-Object { -not $sitemapSet[$_.Url.TrimEnd('/')] }
$report.Add("count: $($notInSitemap.Count)")
$notInSitemap | Select-Object -First 25 | ForEach-Object { $report.Add("NOT-IN-SITEMAP: $($_.Url)") }

# ---------- 4. Images without alt (hub/index pages only) ----------
$report.Add('=== IMG WITHOUT ALT ===')
foreach ($p in ($pageRecords | Where-Object { $_.File -notmatch '^icons/' })) {
    $raw = [System.IO.File]::ReadAllText("$root\" + $p.File.Replace('/','\'))
    $imgs = [regex]::Matches($raw, '<img\b[^>]*>')
    $noAlt = @($imgs | Where-Object { $_.Value -notmatch 'alt=' })
    if ($noAlt.Count -gt 0) { $report.Add("$($p.File): $($noAlt.Count)/$($imgs.Count) img without alt") }
}

# ---------- 5. http / www inconsistencies in head ----------
$report.Add('=== NON-HTTPS / WWW inconsistencies in head ===')
foreach ($p in $pageRecords) {
    $raw = [System.IO.File]::ReadAllText("$root\" + $p.File.Replace('/','\'))
    $headEnd = $raw.IndexOf('</head>'); $head = $raw.Substring(0, [math]::Max($headEnd,1))
    $bad = [regex]::Matches($head, '(href|content)="http://[^"]*"') + [regex]::Matches($head, '(href|content)="https://www\.[^"]*"')
    if ($bad.Count -gt 0) { $report.Add("$($p.File): $($bad.Count) non-canonical-host refs") }
}

# ---------- 6. hreflang presence ----------
$report.Add('=== HREFLANG ===')
$hl = @($pageRecords | Where-Object { [System.IO.File]::ReadAllText("$root\" + $_.File.Replace('/','\')) -match 'hreflang' })
$report.Add("pages with hreflang: $($hl.Count)")

[System.IO.File]::WriteAllLines("$root\seo\audit-report.txt", $report)
Write-Output "DONE. Report lines: $($report.Count)"
