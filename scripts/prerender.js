#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const OUT_DIR = path.join(DATA_DIR, "prerender");
const CHUNK_SIZE = Number(process.env.ICONSTASH_CHUNK_SIZE || 160);

const CATEGORY_META = [
  ["Media", "Photography", "M12 5v14M5 12h14", "#00c3ff"],
  ["Communication", "Messaging", "M4 5h16v12H7l-3 3V5Z", "#ff2d9b"],
  ["Commerce", "Payments", "M6 6h15l-2 8H8L6 6ZM6 6 5 3H2M9 20h.01M18 20h.01", "#00ff88"],
  ["Navigation", "Maps", "M3 11 22 2l-9 19-2-8-8-2Z", "#bf00ff"],
  ["Files", "Documents", "M14 2H6a2 2 0 0 0-2 2v16h16V8l-6-6Z", "#ff6a00"],
  ["Editing", "Design", "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z", "#f5ff00"],
  ["Devices", "Hardware", "M4 5h16v11H4V5ZM8 21h8M12 16v5", "#00ffd5"],
  ["Development", "Code", "M8 9 4 12l4 3M16 9l4 3M14 4l-4 16", "#ff003c"],
  ["Security", "Privacy", "M12 2 20 6v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4Z", "#00c3ff"],
  ["Health", "Medical", "M20.8 4.6a5.3 5.3 0 0 0-7.5 0L12 5.9l-1.3-1.3a5.3 5.3 0 1 0-7.5 7.5L12 21l8.8-8.9a5.3 5.3 0 0 0 0-7.5Z", "#ff2d9b"],
  ["Weather", "Nature", "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z", "#00ff88"],
  ["Transport", "Travel", "M5 17h14l2-7H3l2 7ZM7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM17 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z", "#bf00ff"],
  ["Social", "People", "M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M2 21v-2a4 4 0 0 1 3-3.9", "#ff6a00"],
  ["Time", "Productivity", "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 6v6l4 2", "#f5ff00"],
  ["Data", "Charts", "M4 19V5M8 19v-8M12 19V7M16 19v-5M20 19V9", "#00ffd5"],
  ["Interface", "Controls", "M4 7h16M4 12h16M4 17h16", "#ff003c"]
];

const LIB_SVG_PATHS = {
  lucide: '<path d="M12 3 4.5 7.3v8.8L12 21l7.5-4.9V7.3L12 3Z"></path><path d="M8.5 9.5h7M8.5 14.5h7"></path>',
  tabler: '<path d="M4 5h16v14H4z"></path><path d="M8 5v14M16 5v14M4 11h16"></path>',
  heroicons: '<path d="M12 3 5 6v6c0 4.3 2.8 7.5 7 9 4.2-1.5 7-4.7 7-9V6l-7-3Z"></path><path d="m9 12 2 2 4-5"></path>',
  phosphor: '<path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M8.6 15.5A6.5 6.5 0 1 1 15.4 15.5c-.9.6-1.4 1.4-1.4 2.5h-4c0-1.1-.5-1.9-1.4-2.5Z"></path>',
  material: '<path d="M12 3a9 9 0 1 0 0 18h1.2a1.8 1.8 0 0 0 1.2-3.1 1.2 1.2 0 0 1 .8-2.1H17a4 4 0 0 0 4-4C21 6.9 17 3 12 3Z"></path>',
  remix: '<path d="M5 5h9a5 5 0 0 1 0 10h-1l4 4h-5l-4-4H5V5Z"></path>',
  iconoir: '<path d="M4 12a8 8 0 0 1 8-8h8v8a8 8 0 0 1-8 8H4v-8Z"></path>',
  bootstrap: '<path d="M8 4h6.5a4 4 0 0 1 1 7.9A4.2 4.2 0 0 1 14 20H8V4Z"></path>',
  default: '<path d="M4 5h16v14H4z"></path><path d="M8 9h8M8 13h8"></path>'
};

function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function esc(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function libIconSvg(slug) {
  return '<svg class="lib-icon" viewBox="0 0 24 24" aria-hidden="true">' + (LIB_SVG_PATHS[slug] || LIB_SVG_PATHS.default) + '</svg>';
}
function deriveStyle(name, prefix) {
  const text = (String(prefix || "") + "-" + String(name || "")).toLowerCase();
  if (/duotone|two-tone|twotone/.test(text)) return "duotone";
  if (/bold|filled|fill|solid|bxs-/.test(text)) return "filled";
  if (/thin/.test(text)) return "thin";
  if (/light/.test(text)) return "light";
  if (/regular|outline|linear|stroke|lucide|tabler|feather|iconoir|radix|hugeicons|line-md/.test(text)) return "outline";
  return "filled";
}
function normalizeBody(body) {
  let content = String(body || "");
  if (!/<(path|g|circle|rect|line|polyline|polygon|ellipse|defs|use|clipPath|mask)\b/i.test(content)) {
    content = '<path d="' + esc(content) + '"></path>';
  }
  return content
    .replace(/\s(fill|stroke)="(?!none\b|transparent\b|url\()[^"]*"/gi, (_match, attr) => ' ' + attr + '="currentColor"')
    .replace(/\s(fill|stroke)='(?!none\b|transparent\b|url\()[^']*'/gi, (_match, attr) => ' ' + attr + '="currentColor"');
}
function renderSvg(icon, size = "100%") {
  const filled = new Set(["filled", "fill", "solid", "bold"]);
  const fill = filled.has(icon.style) ? "currentColor" : "none";
  const stroke = fill === "none" ? "currentColor" : "none";
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + esc(icon.viewBox) + '" width="' + size + '" height="' + size + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + esc(icon.strokeWidth || 2) + '" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="' + esc(icon.name) + ' icon">' + normalizeBody(icon.body) + '</svg>';
}
function loadLibraryIcons(lib) {
  const file = path.join(DATA_DIR, lib.slug + ".json");
  if (!fs.existsSync(file)) return [];
  const data = readJson(file);
  if (Array.isArray(data)) {
    return data.filter((icon) => icon.svgPath || icon.svgContent).map((icon, index) => ({
      id: icon.id || (lib.slug + "-" + icon.name),
      name: icon.name || icon.id || "icon",
      body: icon.svgPath || icon.svgContent || "",
      viewBox: icon.viewBox || ("0 0 " + (icon.width || 24) + " " + (icon.height || 24)),
      style: icon.style || deriveStyle(icon.name, lib.remotePrefix || lib.slug),
      strokeWidth: icon.strokeWidth ?? 2,
      library: lib.name,
      librarySlug: lib.slug,
      popularity: icon.popularity || Math.max(100, 10000 - ((index * 17) % 9900))
    }));
  }
  const defaults = { width: data.width || 24, height: data.height || 24, left: data.left || 0, top: data.top || 0 };
  const prefix = data.prefix || lib.remotePrefix || lib.slug;
  const entries = [];
  for (const [name, raw] of Object.entries(data.icons || {})) {
    if (raw.body) entries.push([name, { ...defaults, ...raw }]);
  }
  for (const [name, alias] of Object.entries(data.aliases || {})) {
    const parent = data.icons?.[alias.parent];
    if (parent?.body) entries.push([name, { ...defaults, ...parent, ...alias, body: parent.body }]);
  }
  return entries.map(([rawName, raw], index) => {
    const name = rawName.replace(/^(baseline|outline|round|sharp|twotone)-/, "").replace(/_(24|20|16|12)$/, "");
    const style = deriveStyle(rawName, prefix);
    return {
      id: (lib.slug + "-" + rawName).replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase(),
      name,
      body: raw.body,
      viewBox: (raw.left || 0) + " " + (raw.top || 0) + " " + (raw.width || defaults.width) + " " + (raw.height || defaults.height),
      style,
      strokeWidth: style === "thin" ? 1 : 2,
      library: lib.name,
      librarySlug: lib.slug,
      popularity: Math.max(100, 10000 - ((index * 17) % 9900))
    };
  });
}
function renderLibraryHeader(lib, count) {
  return '<div class="library-break" data-library-break="' + esc(lib.slug) + '"><span class="lib-badge">' + libIconSvg(lib.slug) + '</span><div><h2>' + esc(lib.name) + '</h2><p>' + Number(count || lib.count || 0).toLocaleString() + ' icons</p></div></div>';
}
function renderCard(icon, index) {
  const delay = Math.min(400, index * 15);
  return '<article class="icon-card prerender-card" data-id="' + esc(icon.id) + '" data-library="' + esc(icon.librarySlug) + '" tabindex="0" style="animation-delay:' + delay + 'ms"><button class="card-favorite-btn" data-favorite-id="' + esc(icon.id) + '" aria-label="Add to collection" title="Add to collection"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg></button><div class="icon-wrap" style="width:24px;height:24px">' + renderSvg(icon) + '</div></article>';
}
function replaceElement(html, id, content) {
  const startRx = new RegExp('<([a-zA-Z][\\w:-]*)([^>]*)\\bid="' + id + '"([^>]*)>');
  const start = startRx.exec(html);
  if (!start) {
    console.warn("Warning: Missing element #" + id + ", skipping.");
    return html;
  }
  const tag = start[1];
  const openStart = start.index;
  const openEnd = openStart + start[0].length;
  const tokenRx = new RegExp('<\\/?' + tag + '\\b[^>]*>', 'gi');
  tokenRx.lastIndex = openEnd;
  let depth = 1;
  let match;
  while ((match = tokenRx.exec(html))) {
    depth += match[0][1] === '/' ? -1 : 1;
    if (depth === 0) {
      return html.slice(0, openEnd) + content + html.slice(match.index);
    }
  }
  throw new Error("Unclosed element #" + id);
}
function replaceTemplate(html, id, content) {
  const block = '<template id="' + id + '">\n' + content + '\n  </template>';
  const rx = new RegExp('\\s*<template id="' + id + '">[\\s\\S]*?<\\/template>');
  if (rx.test(html)) return html.replace(rx, '\n  ' + block);
  return html.replace('  <div class="app-shell">', '  ' + block + '\n\n  <div class="app-shell">');
}
function main() {
  const indexData = readJson(path.join(DATA_DIR, "index.json"));
  const libraries = indexData.libraries || [];
  ensureDir(OUT_DIR);
  const manifest = { generatedAt: new Date().toISOString(), chunkSize: CHUNK_SIZE, totalCount: 0, libraries: [] };
  const allTrending = [];
  let firstChunk = "";
  for (const lib of libraries) {
    const icons = loadLibraryIcons(lib);
    const libDir = path.join(OUT_DIR, "libraries", lib.slug);
    ensureDir(libDir);
    const chunkCount = Math.max(1, Math.ceil(icons.length / CHUNK_SIZE));
    for (let chunk = 0; chunk < chunkCount; chunk += 1) {
      const slice = icons.slice(chunk * CHUNK_SIZE, (chunk + 1) * CHUNK_SIZE);
      const html = (chunk === 0 ? renderLibraryHeader(lib, icons.length || lib.count) : "") + slice.map((icon, offset) => renderCard(icon, chunk * CHUNK_SIZE + offset)).join("");
      fs.writeFileSync(path.join(libDir, "chunk-" + chunk + ".html"), html, "utf8");
      if (manifest.libraries.length === 0 && chunk === 0) firstChunk = html;
    }
    manifest.totalCount += icons.length || Number(lib.count || 0);
    manifest.libraries.push({ slug: lib.slug, name: lib.name, count: icons.length || Number(lib.count || 0), chunks: chunkCount, chunkSize: CHUNK_SIZE });
    allTrending.push(...icons.slice(0, 80));
    console.log(lib.slug + ": " + icons.length.toLocaleString() + " icons, " + chunkCount + " chunks");
  }
  fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");

  const total = manifest.totalCount;
  const categories = CATEGORY_META.map(([name, sub, body, color], index) => '<article class="category-card" data-home-category="' + esc(name) + '" style="background:linear-gradient(135deg, ' + color + '18, transparent 60%), var(--glass-2);animation-delay:' + (index * 35) + 'ms"><svg viewBox="0 0 24 24" style="color:' + color + '"><path d="' + esc(body) + '"></path></svg><h3>' + esc(name) + '</h3><p>' + esc(sub) + '</p></article>').join('');
  const featured = libraries.slice(0, 8).map((lib, index) => '<article class="lib-card" data-home-library="' + esc(lib.slug) + '" style="animation-delay:' + (index * 35) + 'ms"><span class="lib-card-mark">' + libIconSvg(lib.slug) + '</span><h3>' + esc(lib.name) + '</h3><p>' + Number(lib.count || 0).toLocaleString() + ' icons - ' + esc(lib.description || '') + '</p></article>').join('');
  const trending = allTrending.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 24);
  const trendingHtml = trending.map((icon) => '<button class="trend-card" data-icon-id="' + esc(icon.id) + '">' + renderSvg(icon) + '<span>' + esc(icon.name) + '</span></button>').join('');
  const marquee = trending.slice(0, 20);
  const marqueeLeft = marquee.concat(marquee).map((icon) => '<span class="mq-icon">' + renderSvg(icon) + '</span>').join('');
  const marqueeRight = marquee.slice().reverse().concat(marquee).map((icon) => '<span class="mq-icon">' + renderSvg(icon) + '</span>').join('');
  const allRow = '<a class="lib-row all-icons-row active" href="#/search" data-all-icons="true">\n    <span class="lib-badge">' + libIconSvg("default") + '</span>\n    <span class="lib-name">All Icons</span>\n    <span class="lib-count">' + total.toLocaleString() + '</span>\n  </a>';
  const libRowsHtml = libraries.map((lib, index) => {
    return '<label class="lib-row" data-slug="' + lib.slug + '" style="animation-delay:' + Math.min(index * 30, 1000) + 'ms">\n      <span class="lib-badge">' + libIconSvg(lib.slug) + '</span>\n      <span class="lib-name">' + esc(lib.name) + '</span>\n      <span class="lib-count">' + Number(lib.count || 0).toLocaleString() + '</span>\n      <input class="lib-check" type="checkbox" value="' + lib.slug + '">\n    </label>';
  }).join("\n");

  const sidebarLibrariesHtml = allRow + '\n  <button class="filter-header lib-toggle" id="lib-toggle" aria-expanded="true" style="margin-top: 10px; margin-bottom: 5px; cursor: pointer; background: transparent; border: none; padding: 0 7px; width: 100%; display: flex; align-items: center; justify-content: space-between;">\n    <h2 style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: var(--text-secondary); margin: 0;">Libraries</h2>\n    <svg class="chevron" viewBox="0 0 24 24" style="width: 16px; height: 16px; transition: transform 200ms ease; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transform: rotate(90deg);"><path d="m9 18 6-6-6-6"/></svg>\n  </button>\n  <div class="lib-collapse-list" id="lib-collapse-list" style="overflow: hidden; max-height: 700px; transition: max-height 250ms ease-in-out; display: flex; flex-direction: column; gap: 5px;">\n    ' + libRowsHtml + '\n  </div>';

  let html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8").replace(/\r\n/g, "\n");
  html = html.replace(/\n\s*<link rel="preload" href="data\/[^\"]+\.json" as="fetch" crossorigin>/g, '');
  html = html.replace(/\n\s*<script>\s*\/\/ Pre-render bootstrap:[\s\S]*?window\.__PRELOAD_ALL_LIBS__ = true;\s*<\/script>/g, '');
  html = html.replace(/<html lang="en"([^>]*)>/, (_m, attrs) => '<html lang="en" data-prerendered="true"' + attrs.replace(/\sdata-prerendered="[^"]*"/g, '') + '>');
  html = html.replace(/data-target="\d+">[\d,]*<\/span><span class="stat-label">Indexed Icons/, 'data-target="' + total + '">' + total.toLocaleString() + '</span><span class="stat-label">Indexed Icons');
  html = html.replace(/id="indexed-stat" data-target="\d+">[\d,]*<\/span><span class="stat-label">Indexed Records/, 'id="indexed-stat" data-target="' + total + '">' + total.toLocaleString() + '</span><span class="stat-label">Indexed Records');
  html = html.replace(/data-target="\d+">[\d,]*<\/span><span class="stat-label">Libraries/, 'data-target="' + libraries.length + '">' + libraries.length + '</span><span class="stat-label">Libraries');
  html = replaceElement(html, "home-categories", categories);
  html = replaceElement(html, "featured-libraries", featured);
  html = replaceElement(html, "trending-icons", trendingHtml);
  html = replaceElement(html, "marquee-1", marqueeLeft);
  html = replaceElement(html, "marquee-2", marqueeRight);
  html = replaceElement(html, "lib-list-container", sidebarLibrariesHtml);
  html = replaceElement(html, "icon-grid", firstChunk);
  html = replaceTemplate(html, "prerender-all-initial", firstChunk);
  
  // Remove existing inlined prerender-data script block if present to ensure idempotent rebuilds
  html = html.replace(/\s*<script id="prerender-data">[\s\S]*?<\/script>/g, '');
  
  const inlinedScripts = `
  <script id="prerender-data">
    window.__INDEX_DATA__ = ${JSON.stringify(indexData)};
    window.__PRERENDER_MANIFEST__ = ${JSON.stringify(manifest)};
  </script>
  <script src="icons.js" defer></script>`;
  html = html.replace('<script src="icons.js" defer></script>', inlinedScripts);
  
  fs.writeFileSync(path.join(ROOT, "index.html"), html, "utf8");
  console.log("Generated " + manifest.libraries.length + " prerendered libraries, " + total.toLocaleString() + " icons");
}
main();
