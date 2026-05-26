#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const OUT_DIR = path.join(ROOT, "icons");
const SITEMAP_DIR = path.join(ROOT, "sitemaps");
const HTML_SITEMAP_DIR = path.join(ROOT, "seo");
const KEYWORD_DB = path.join(DATA_DIR, "pseo-keywords.json");
const SITE_URL = (process.env.SITE_URL || "https://iconstash.io").replace(/\/+$/, "");
const PAGE_LIMIT = Math.max(1, Number(process.env.PSEO_LIMIT || 60000));
const TODAY = new Date().toISOString().slice(0, 10);

const CATEGORY_RULES = [
  ["Media", "Photography", /camera|image|photo|video|film|play|pause|music|mic|speaker|audio|volume|gallery|picture|podcast/i],
  ["Communication", "Messaging", /mail|message|chat|comment|phone|call|send|inbox|reply|share|bell|notification/i],
  ["Commerce", "Payments", /cart|shop|bag|store|cash|coin|credit|card|wallet|bank|receipt|ticket|tag|gift/i],
  ["Navigation", "Maps", /map|pin|location|compass|route|arrow|chevron|direction|sign|road|globe/i],
  ["Files", "Documents", /file|folder|document|book|note|clipboard|archive|copy|paper|pdf|code/i],
  ["Editing", "Design", /edit|pen|pencil|brush|crop|palette|color|magic|wand|scissors|ruler|layout/i],
  ["Devices", "Hardware", /phone|mobile|tablet|laptop|desktop|monitor|keyboard|mouse|printer|watch|cpu|server|database/i],
  ["Development", "Code", /code|terminal|bug|git|branch|merge|api|webhook|cloud|database|server|package/i],
  ["Security", "Privacy", /lock|unlock|shield|key|fingerprint|scan|secure|vpn|password|verified/i],
  ["Health", "Medical", /heart|pulse|medical|hospital|doctor|pill|virus|health|first|aid|stethoscope/i],
  ["Weather", "Nature", /sun|moon|cloud|rain|snow|wind|leaf|tree|flower|fire|water|earth/i],
  ["Transport", "Travel", /car|bus|train|plane|ship|bike|truck|taxi|rocket|suitcase|luggage/i],
  ["Social", "People", /user|person|people|team|group|face|smile|emoji|profile|account/i],
  ["Time", "Productivity", /clock|time|calendar|timer|alarm|hour|watch|schedule|history/i],
  ["Data", "Charts", /chart|graph|analytics|stats|database|table|trend|activity|bar|pie/i]
];

const SYNONYMS = {
  calendar: ["date", "schedule", "event"],
  camera: ["photo", "image", "snapshot"],
  search: ["find", "magnifier", "lookup"],
  user: ["profile", "person", "account"],
  users: ["team", "people", "group"],
  arrow: ["direction", "navigation", "pointer"],
  home: ["house", "dashboard", "start"],
  settings: ["gear", "preferences", "controls"],
  heart: ["favorite", "like", "love"],
  star: ["rating", "favorite", "bookmark"],
  download: ["save", "export", "install"],
  upload: ["send", "import", "publish"],
  trash: ["delete", "remove", "bin"],
  lock: ["secure", "privacy", "password"],
  chart: ["analytics", "graph", "report"],
  cart: ["shopping", "checkout", "store"],
  mail: ["email", "message", "inbox"],
  phone: ["call", "mobile", "contact"]
};

const CATEGORY_INTENTS = {
  Media: ["for websites", "for UI design", "for apps"],
  Communication: ["for messaging apps", "for contact pages", "for dashboards"],
  Commerce: ["for ecommerce", "for checkout UI", "for stores"],
  Navigation: ["for menus", "for navigation UI", "for maps"],
  Files: ["for documents", "for admin panels", "for file managers"],
  Editing: ["for design tools", "for editors", "for creative apps"],
  Devices: ["for device UI", "for dashboards", "for product pages"],
  Development: ["for developer tools", "for documentation", "for dashboards"],
  Security: ["for security UI", "for login screens", "for privacy pages"],
  Health: ["for health apps", "for dashboards", "for wellness UI"],
  Weather: ["for weather apps", "for widgets", "for dashboards"],
  Transport: ["for travel apps", "for booking UI", "for maps"],
  Social: ["for social apps", "for profiles", "for teams"],
  Time: ["for calendar apps", "for schedules", "for productivity UI"],
  Data: ["for analytics", "for reports", "for dashboards"],
  Interface: ["for product UI", "for websites", "for apps"]
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function cleanOutput() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.rmSync(SITEMAP_DIR, { recursive: true, force: true });
  fs.rmSync(HTML_SITEMAP_DIR, { recursive: true, force: true });
  ensureDir(OUT_DIR);
  ensureDir(SITEMAP_DIR);
  ensureDir(HTML_SITEMAP_DIR);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value) {
  return String(value || "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function displayName(raw) {
  return titleCase(String(raw || "icon")
    .replace(/^(baseline|outline|round|sharp|twotone)-/, "")
    .replace(/_(24|20|16|12)$/, "")
    .replace(/-/g, " "));
}

function baseName(name) {
  return slugify(String(name || "")
    .replace(/\b(outline|regular|solid|filled|fill|bold|duotone|thin|light|sharp|round|linear|twotone|two tone|24|20|16|12)\b/gi, ""));
}

function deriveStyle(name, prefix) {
  const text = `${prefix || ""}-${name || ""}`.toLowerCase();
  if (/duotone|two-tone|twotone/.test(text)) return "duotone";
  if (/bold|filled|fill|solid|bxs-/.test(text)) return "filled";
  if (/thin/.test(text)) return "thin";
  if (/light/.test(text)) return "light";
  if (/sharp/.test(text)) return "sharp";
  if (/regular|outline|linear|stroke|lucide|tabler|feather|iconoir|radix|hugeicons|line-md/.test(text)) return "outline";
  return "filled";
}

function categorize(name) {
  const match = CATEGORY_RULES.find(([, , rx]) => rx.test(name));
  return match ? [match[0], match[1]] : ["Interface", "Controls"];
}

function normalizeBody(body) {
  const content = String(body || "");
  if (!/<(path|g|circle|rect|line|polyline|polygon|ellipse|defs|use|clipPath|mask)\b/i.test(content)) {
    return `<path d="${escapeHtml(content)}"></path>`;
  }
  return content
    .replace(/\s(fill|stroke)="(?!none\b|transparent\b|url\()[^"]*"/gi, (_match, attr) => ` ${attr}="currentColor"`)
    .replace(/\s(fill|stroke)='(?!none\b|transparent\b|url\()[^']*'/gi, (_match, attr) => ` ${attr}="currentColor"`);
}

function renderSvg(icon, size = 72) {
  const fill = icon.style === "filled" ? "currentColor" : "none";
  const stroke = fill === "none" ? "currentColor" : "none";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escapeHtml(icon.viewBox)}" width="${size}" height="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${icon.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${escapeHtml(icon.name)} icon">${normalizeBody(icon.body)}</svg>`;
}

function normalizeLibrary(lib) {
  const file = path.join(DATA_DIR, `${lib.slug}.json`);
  const data = readJson(file);
  if (Array.isArray(data)) {
    return data.map((icon, index) => {
      const name = icon.name || icon.id || "icon";
      const [category, subCategory] = icon.category ? [icon.category, icon.subCategory || "Controls"] : categorize(name);
      return {
        id: icon.id || `${lib.slug}-${slugify(name)}`,
        name,
        displayName: displayName(name),
        base: baseName(name),
        body: icon.svgPath || icon.svgContent || "",
        viewBox: icon.viewBox || `0 0 ${icon.width || 24} ${icon.height || 24}`,
        width: icon.width || 24,
        height: icon.height || 24,
        style: icon.style || deriveStyle(name, lib.remotePrefix || lib.slug),
        strokeWidth: icon.strokeWidth || 2,
        category,
        subCategory,
        library: lib.name,
        librarySlug: lib.slug,
        docsUrl: icon.docsUrl || lib.docsUrl || "",
        npmPackage: icon.npmPackage || lib.npmPackage || lib.slug,
        popularity: icon.popularity || Math.max(100, 10000 - ((index * 17) % 9900))
      };
    }).filter((icon) => icon.body);
  }
  const defaults = { width: data.width || 24, height: data.height || 24, left: data.left || 0, top: data.top || 0 };
  const prefix = data.prefix || lib.remotePrefix || lib.slug;
  const entries = Object.entries(data.icons || {}).map(([name, raw]) => [name, { ...defaults, ...raw }]);
  for (const [name, alias] of Object.entries(data.aliases || {})) {
    const parent = data.icons?.[alias.parent];
    if (parent?.body) entries.push([name, { ...defaults, ...parent, ...alias, body: parent.body }]);
  }
  return entries.filter(([, raw]) => raw.body).map(([rawName, raw], index) => {
    const name = rawName.replace(/^(baseline|outline|round|sharp|twotone)-/, "").replace(/_(24|20|16|12)$/, "");
    const [category, subCategory] = categorize(name);
    return {
      id: `${lib.slug}-${rawName}`.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase(),
      name,
      displayName: displayName(name),
      base: baseName(name),
      body: raw.body,
      viewBox: `${raw.left || 0} ${raw.top || 0} ${raw.width || defaults.width} ${raw.height || defaults.height}`,
      width: raw.width || defaults.width,
      height: raw.height || defaults.height,
      style: deriveStyle(rawName, prefix),
      strokeWidth: deriveStyle(rawName, prefix) === "thin" ? 1 : 2,
      category,
      subCategory,
      library: lib.name,
      librarySlug: lib.slug,
      docsUrl: lib.docsUrl || "",
      npmPackage: lib.npmPackage || lib.slug,
      popularity: Math.max(100, 10000 - ((index * 17) % 9900))
    };
  });
}

function iconWords(icon) {
  const words = icon.base.split("-").filter(Boolean);
  const expanded = new Set(words);
  for (const word of words) {
    for (const synonym of SYNONYMS[word] || []) expanded.add(synonym);
  }
  return Array.from(expanded);
}

function keywordTemplates(icon) {
  const lib = icon.library.replace(/\s+Icons$/i, "");
  const name = icon.displayName.toLowerCase();
  const words = iconWords(icon).slice(0, 5);
  const primary = words[0] || "interface";
  const intents = CATEGORY_INTENTS[icon.category] || CATEGORY_INTENTS.Interface;
  return [
    { keyword: `${lib.toLowerCase()} ${name} icon svg`, format: "svg", intent: "download" },
    { keyword: `${name} icon png`, format: "png", intent: "download" },
    { keyword: `download ${name} svg icon`, format: "svg", intent: "download" },
    { keyword: `${name} ${icon.style} icon`, format: icon.style, intent: "style" },
    { keyword: `${name} icon for react`, format: "react", intent: "use" },
    { keyword: `${name} icon figma`, format: "figma", intent: "design" },
    { keyword: `copy ${name} svg`, format: "svg", intent: "copy" },
    { keyword: `${primary} icon ${intents[0]}`, format: "svg", intent: "use" },
    { keyword: `${lib.toLowerCase()} ${name} ${icon.style} svg`, format: "svg", intent: "library" }
  ];
}

function buildKeywords(icons) {
  const seen = new Set();
  const rows = [];
  for (const icon of icons) {
    for (const item of keywordTemplates(icon)) {
      const keyword = item.keyword.toLowerCase().replace(/\s+/g, " ").trim();
      const slug = slugify(keyword);
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      const exactNameBoost = keyword.includes(icon.base.replace(/-/g, " ")) ? 8 : 0;
      const score = Math.round((icon.popularity || 100) + exactNameBoost + (item.intent === "download" ? 60 : 0) + (item.format === "svg" ? 40 : 0));
      rows.push({ ...item, keyword, slug, iconId: icon.id, category: icon.category, librarySlug: icon.librarySlug, score });
    }
  }
  return rows
    .sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug))
    .slice(0, PAGE_LIMIT)
    .map((row, index) => ({ ...row, priority: index + 1, url: `/icons/${row.slug}/` }));
}

function seoTitle(keyword) {
  const base = titleCase(keyword);
  const suffix = " | IconStash";
  if ((base + suffix).length <= 60 && (base + suffix).length >= 48) return base + suffix;
  const download = `${base} Download | IconStash`;
  if (download.length <= 60) return download;
  return `${base.slice(0, Math.max(42, 59 - suffix.length)).replace(/\s+\S*$/, "")}${suffix}`;
}

function metaDescription(row, icon) {
  const format = row.format === "react" ? "React-ready SVG" : row.format.toUpperCase();
  const text = `Download or copy the ${row.keyword} from IconStash. Customize color, size, stroke, and export ${format} files with no login.`;
  return text.length > 160 ? `${text.slice(0, 157).replace(/\s+\S*$/, "")}...` : text;
}

function relatedFor(row, keywords, byIcon) {
  const icon = byIcon.get(row.iconId);
  const sameIcon = keywords.filter((item) => item.iconId === row.iconId && item.slug !== row.slug);
  const sameCategory = keywords.filter((item) => item.category === row.category && item.slug !== row.slug && item.iconId !== row.iconId);
  const sameLibrary = keywords.filter((item) => item.librarySlug === row.librarySlug && item.slug !== row.slug && item.iconId !== row.iconId);
  const related = [];
  for (const item of [...sameIcon, ...sameCategory, ...sameLibrary]) {
    if (!related.some((entry) => entry.slug === item.slug)) related.push(item);
    if (related.length >= 10) break;
  }
  if (related.length < 10 && icon) {
    for (const item of keywords) {
      if (item.slug !== row.slug && item.keyword.includes(icon.base.split("-")[0]) && !related.some((entry) => entry.slug === item.slug)) related.push(item);
      if (related.length >= 10) break;
    }
  }
  return related.slice(0, 10);
}

function pageHtml(row, icon, related) {
  const title = seoTitle(row.keyword);
  const description = metaDescription(row, icon);
  const url = `${SITE_URL}${row.url}`;
  const appUrl = `${SITE_URL}/#/icon/${encodeURIComponent(icon.id)}`;
  const canonical = url;
  const h1 = row.keyword;
  const relatedLinks = related.map((item) => `<li><a href="/icons/${item.slug}/">${escapeHtml(item.keyword)}</a></li>`).join("");
  const peopleAlso = related.slice().reverse().slice(0, 6).map((item) => `<a href="/icons/${item.slug}/">${escapeHtml(item.keyword)}</a>`).join("");
  const faq = [
    {
      q: `Can I download the ${row.keyword}?`,
      a: `Yes. Open the ${icon.displayName} icon in IconStash to copy SVG code or export PNG and ZIP files.`
    },
    {
      q: `Can I customize this ${icon.displayName} icon?`,
      a: `Yes. You can adjust color, size, background, and stroke width before copying or downloading.`
    },
    {
      q: `What formats are available for ${row.keyword}?`,
      a: `IconStash supports SVG, PNG exports, JSX snippets, HTML image code, CSS masks, and Base64 output.`
    }
  ];
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "IconStash", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: icon.library, item: `${SITE_URL}/#/library/${icon.librarySlug}` },
        { "@type": "ListItem", position: 3, name: h1, item: url }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a }
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      name: `${icon.displayName} icon`,
      creator: icon.library,
      encodingFormat: "image/svg+xml",
      contentUrl: appUrl
    }
  ];
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(url)}">
  <style>
    :root{color-scheme:dark;--bg:#07070d;--panel:#11111a;--line:#242434;--text:#f5f7fb;--muted:#a3a7b7;--blue:#2f80ff}
    *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.6 Inter,system-ui,-apple-system,Segoe UI,sans-serif}
    a{color:inherit}.wrap{max-width:980px;margin:0 auto;padding:34px 20px 64px}.crumbs{display:flex;gap:8px;flex-wrap:wrap;color:var(--muted);font-size:13px;margin-bottom:24px}.hero{display:grid;grid-template-columns:180px 1fr;gap:28px;align-items:center}.preview{height:180px;border:1px solid var(--line);border-radius:18px;background:var(--panel);display:grid;place-items:center;color:var(--blue)}h1{font-size:clamp(32px,5vw,56px);line-height:1.05;margin:0 0 14px;letter-spacing:-.03em}.lead{color:var(--muted);font-size:18px;margin:0}.cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.btn{border:1px solid var(--line);border-radius:10px;padding:11px 15px;text-decoration:none;background:#171724}.primary{background:var(--blue);border-color:var(--blue);color:white}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px;margin-top:30px}.card{border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:18px}h2{font-size:20px;margin:0 0 10px}.muted{color:var(--muted)}ul{padding-left:20px}.chips{display:flex;gap:10px;flex-wrap:wrap}.chips a{border:1px solid var(--line);border-radius:999px;padding:8px 11px;text-decoration:none;color:var(--muted)}footer{margin-top:34px;color:var(--muted);font-size:13px}
    @media(max-width:720px){.hero{grid-template-columns:1fr}.preview{height:150px}}
  </style>
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
</head>
<body>
  <main class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="/">IconStash</a><span>/</span><a href="/#/library/${escapeHtml(icon.librarySlug)}">${escapeHtml(icon.library)}</a><span>/</span><span>${escapeHtml(icon.displayName)}</span>
    </nav>
    <section class="hero">
      <div class="preview">${renderSvg(icon, 96)}</div>
      <div>
        <h1>${escapeHtml(h1)}</h1>
        <p class="lead">${escapeHtml(row.keyword)} is available in IconStash for fast SVG copying, PNG export, and UI-ready customization.</p>
        <div class="cta">
          <a class="btn primary" href="${escapeHtml(appUrl)}">Open editor</a>
          <a class="btn" href="/#/library/${escapeHtml(icon.librarySlug)}">Browse ${escapeHtml(icon.library)}</a>
        </div>
      </div>
    </section>
    <section class="grid">
      <article class="card">
        <h2>Use this ${escapeHtml(icon.displayName)} icon</h2>
        <p>The ${escapeHtml(row.keyword)} works well in ${escapeHtml(icon.category.toLowerCase())} interfaces, product dashboards, websites, mobile apps, documentation, and design systems.</p>
        <p class="muted">Open it in IconStash to adjust color, exact size, preview background, and stroke width before exporting.</p>
      </article>
      <article class="card">
        <h2>Export formats</h2>
        <p>Copy clean SVG, generate PNG sizes, use JSX snippets, create HTML image code, or export CSS background masks from the same icon detail panel.</p>
        <p class="muted">The original vector remains editable, so it stays sharp at 16px, 24px, 48px, and large marketing sizes.</p>
      </article>
      <article class="card">
        <h2>Related searches</h2>
        <ul>${relatedLinks}</ul>
      </article>
      <article class="card">
        <h2>People also search for</h2>
        <div class="chips">${peopleAlso}</div>
      </article>
    </section>
    <section class="grid">
      ${faq.map((item) => `<article class="card"><h2>${escapeHtml(item.q)}</h2><p>${escapeHtml(item.a)}</p></article>`).join("")}
    </section>
    <footer>
      IconStash is a frontend-only icon search and export tool. Check each source library's terms before redistributing icon artwork as a standalone pack.
    </footer>
  </main>
</body>
</html>`;
}

function writePages(keywords, icons) {
  const byIcon = new Map(icons.map((icon) => [icon.id, icon]));
  for (const row of keywords) {
    const icon = byIcon.get(row.iconId);
    if (!icon) continue;
    const related = relatedFor(row, keywords, byIcon);
    const dir = path.join(OUT_DIR, row.slug);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir, "index.html"), pageHtml(row, icon, related));
  }
}

function writeSitemaps(keywords) {
  const staticUrls = ["/", "/seo/"].concat(keywords.map((row) => row.url));
  const chunks = [];
  for (let i = 0; i < staticUrls.length; i += 50000) chunks.push(staticUrls.slice(i, i + 50000));
  chunks.forEach((chunk, index) => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${chunk.map((url) => `  <url><loc>${SITE_URL}${url}</loc><lastmod>${TODAY}</lastmod></url>`).join("\n")}\n</urlset>\n`;
    fs.writeFileSync(path.join(SITEMAP_DIR, `sitemap-${index + 1}.xml`), xml);
  });
  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${chunks.map((_, index) => `  <sitemap><loc>${SITE_URL}/sitemaps/sitemap-${index + 1}.xml</loc><lastmod>${TODAY}</lastmod></sitemap>`).join("\n")}\n</sitemapindex>\n`;
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), indexXml);
  fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
}

function writeHtmlSitemap(keywords) {
  const perPage = 1000;
  const pages = [];
  for (let i = 0; i < keywords.length; i += perPage) pages.push(keywords.slice(i, i + perPage));
  const indexLinks = pages.map((_, index) => `<a href="/seo/sitemap-${index + 1}/">Sitemap ${index + 1}</a>`).join("");
  ensureDir(HTML_SITEMAP_DIR);
  fs.writeFileSync(path.join(HTML_SITEMAP_DIR, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>IconStash HTML Sitemap</title><meta name="description" content="Browse IconStash icon landing pages."><style>body{font:15px/1.6 system-ui;margin:32px;background:#07070d;color:#f5f7fb}a{display:inline-block;margin:6px 10px 6px 0;color:#8ab4ff}</style></head><body><h1>IconStash HTML Sitemap</h1><p>${keywords.length.toLocaleString("en-US")} icon landing pages.</p>${indexLinks}</body></html>`);
  pages.forEach((chunk, index) => {
    const dir = path.join(HTML_SITEMAP_DIR, `sitemap-${index + 1}`);
    ensureDir(dir);
    const links = chunk.map((row) => `<li><a href="${row.url}">${escapeHtml(row.keyword)}</a></li>`).join("");
    fs.writeFileSync(path.join(dir, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>IconStash Sitemap ${index + 1}</title><meta name="description" content="IconStash SEO landing page links."><style>body{font:15px/1.6 system-ui;margin:32px;background:#07070d;color:#f5f7fb}a{color:#8ab4ff}li{margin:4px 0}</style></head><body><h1>IconStash Sitemap ${index + 1}</h1><ul>${links}</ul></body></html>`);
  });
}

function main() {
  const index = readJson(path.join(DATA_DIR, "index.json"));
  const libraries = index.libraries || [];
  console.log(`Loading ${libraries.length} libraries...`);
  const icons = libraries.flatMap(normalizeLibrary).filter((icon) => icon.body && icon.base);
  console.log(`Loaded ${icons.length.toLocaleString("en-US")} icons.`);
  console.log(`Generating up to ${PAGE_LIMIT.toLocaleString("en-US")} keyword pages...`);
  const keywords = buildKeywords(icons);
  cleanOutput();
  fs.writeFileSync(KEYWORD_DB, JSON.stringify({
    generatedAt: new Date().toISOString(),
    siteUrl: SITE_URL,
    pageLimit: PAGE_LIMIT,
    totalKeywords: keywords.length,
    keywords
  }, null, 2));
  writePages(keywords, icons);
  writeSitemaps(keywords);
  writeHtmlSitemap(keywords);
  console.log(`Generated ${keywords.length.toLocaleString("en-US")} pages.`);
  console.log(`Wrote ${path.relative(ROOT, KEYWORD_DB)}, sitemap.xml, robots.txt, and HTML sitemap.`);
}

main();
