#!/usr/bin/env node
/* ─────────────────────────────────────────────────────────────────────────────
   High-intent comparison pages.

   Why this script exists: the 137k icon pages are a long tail. They are real,
   unique pages, but almost none of them alone has meaningful search volume.
   The queries that actually carry traffic are comparative and
   solution-seeking — "lucide vs heroicons", "best lucide alternatives",
   "icon library for react".

   Those queries are also the ones where IconStash has a genuine advantage over
   a blog post: it holds the SVG source for every library, so a comparison page
   here can render the *same concept in both libraries, side by side*, from the
   actual artwork. Nobody else can do that. That is the whole reason these
   pages are worth building rather than being more doorway pages.

   Emits static HTML only. No build step in CI, so output is committed.

   Run order: generate-pseo.js -> generate-hubs.js -> this script.
   This script appends its own sitemap to sitemap.xml, so it must run last.
   ───────────────────────────────────────────────────────────────────────────── */
"use strict";

const fs = require("fs");
const path = require("path");
const hub = require("./generate-hubs.js");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const SITEMAP_DIR = path.join(ROOT, "sitemaps");
const SITE_URL = hub.SITE_URL;
const CSS_VERSION = hub.CSS_VERSION;
const TODAY = new Date().toISOString().slice(0, 10);

const { LIBRARIES, LIB_BY_SLUG, LIB_COPY, escapeHtml, page, sidebar, footer,
  faqBlock, faqSchema, breadcrumbSchema } = hub;

/* ── Which libraries get comparison pages ───────────────────────────────────
   Restricted to the sets people genuinely compare. Generating all 378 pairs
   would produce hundreds of pages for queries nobody types, which is exactly
   the pattern that gets a whole directory classed as doorway pages. */
const HEAD_SET = [
  "lucide", "heroicons", "phosphor", "tabler", "feather", "material",
  "materialsymbols", "bootstrap", "iconoir", "remix", "carbon",
  "fluent", "ionicons", "radix", "boxicons", "solar"
];

/* Concepts used for side-by-side previews — common enough that nearly every
   library has them, and concrete enough to show real stylistic difference. */
const PREVIEW_CONCEPTS = [
  "home", "search", "settings", "user", "heart", "star",
  "cart", "bell", "mail", "calendar", "download", "trash"
];

/* ── Library facts ─────────────────────────────────────────────────────────── */

/* How many visual variants of one concept the library ships. This is the
   single biggest practical difference between icon libraries and the thing
   people are really asking when they compare them. */
const STYLE_VARIANTS = {
  "Outline": { n: 1, note: "outline only" },
  "Solid": { n: 1, note: "solid only" },
  "Filled": { n: 1, note: "filled only" },
  "Filled (brand)": { n: 1, note: "filled only" },
  "Pixel": { n: 1, note: "pixel only" },
  "Animated": { n: 1, note: "animated line" },
  "Light (300 weight)": { n: 1, note: "one weight" },
  "Outline & solid": { n: 2, note: "outline and solid" },
  "Line & fill": { n: 2, note: "line and fill" },
  "Fill & outline": { n: 2, note: "fill and outline" },
  "Regular & filled": { n: 2, note: "regular and filled" },
  "Outlined, filled & two-tone": { n: 3, note: "outlined, filled and two-tone" },
  "Regular, solid & logos": { n: 3, note: "regular, solid and logos" },
  "Outline, filled & sharp": { n: 3, note: "outline, filled and sharp" },
  "Multi-style": { n: 3, note: "outline, filled and more" },
  "Five themes": { n: 5, note: "outlined, rounded, sharp, two-tone and filled" },
  "Six weights": { n: 6, note: "thin, light, regular, bold, fill and duotone" },
  "Six styles": { n: 6, note: "six coordinated styles" },
  "Variable": { n: 4, note: "variable weight, fill, grade and optical size axes" }
};

/* Lower is worse for the buyer. CC BY needs attribution; the rest do not. */
const LICENSE_RANK = {
  "CC0 1.0": 4, "MIT": 3, "ISC": 3, "Apache 2.0": 3, "CC BY 4.0": 1
};
const LICENSE_NOTE = {
  "MIT": "Commercial use, modification and redistribution with no attribution required.",
  "ISC": "Functionally equivalent to MIT — no attribution required.",
  "Apache 2.0": "No attribution required, but carries an explicit patent grant and requires notice for modified files.",
  "CC0 1.0": "Public domain dedication — the most permissive option here.",
  "CC BY 4.0": "Requires visible attribution wherever the icons appear."
};

function variantsOf(lib) {
  return STYLE_VARIANTS[lib.style] || { n: 1, note: lib.style.toLowerCase() };
}
function licenseRank(lib) {
  return LICENSE_RANK[lib.license] || 2;
}
function licenseNote(lib) {
  return LICENSE_NOTE[lib.license] || "Check the upstream project for current terms.";
}

/* ── Icon lookup for previews ────────────────────────────────────────────────
   Loaded once per library, lazily, because 28 libraries of SVG path data is
   far too much to hold for all of them at once. */
const libIconCache = new Map();
function loadLibraryIcons(slug) {
  if (libIconCache.has(slug)) return libIconCache.get(slug);
  let rows = [];
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${slug}.json`), "utf8"));
    rows = Array.isArray(raw) ? raw : [];
  } catch (_) {
    rows = [];
  }
  const byName = new Map();
  for (const icon of rows) {
    if (!icon || !icon.svgPath) continue;
    const key = String(icon.name || "").toLowerCase();
    if (!key) continue;
    /* Prefer the plainest name: "home" beats "home-outline" or "home-fill". */
    const current = byName.get(key);
    if (!current || key.length < current.key.length) byName.set(key, { icon, key });
  }
  libIconCache.set(slug, byName);
  return byName;
}

/* Find the best rendering of `concept` inside a library. Tries the exact name,
   then common suffixed forms, then a prefix match. */
function findIcon(slug, concept) {
  const byName = loadLibraryIcons(slug);
  const candidates = [
    concept,
    `${concept}-outline`, `${concept}-outlined`, `${concept}-line`,
    `${concept}-fill`, `${concept}-filled`, `${concept}-solid`,
    `${concept}-regular`, `${concept}-01`, `${concept}-1`
  ];
  for (const c of candidates) {
    if (byName.has(c)) return byName.get(c).icon;
  }
  for (const [key, entry] of byName) {
    if (key.startsWith(`${concept}-`) || key.endsWith(`-${concept}`)) return entry.icon;
  }
  return null;
}

function previewSvg(icon, size = 34) {
  if (!icon) return null;
  const vb = icon.viewBox || "0 0 24 24";
  return `<svg viewBox="${escapeHtml(vb)}" width="${size}" height="${size}" `
    + `fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" `
    + `aria-hidden="true">${icon.svgPath}</svg>`;
}

/* ── Verdict engine ──────────────────────────────────────────────────────────
   The recommendation is derived from the data, not asserted. Both numbers in
   every sentence below are read from the library table, so if a library's icon
   count changes the prose changes with it. */
function compareFacts(a, b) {
  const va = variantsOf(a);
  const vb = variantsOf(b);
  const moreIcons = a.countNum >= b.countNum ? a : b;
  const fewerIcons = a.countNum >= b.countNum ? b : a;
  const ratio = a.countNum === b.countNum ? 0 : (moreIcons.countNum / fewerIcons.countNum - 1) * 100;
  const moreVariants = va.n >= vb.n ? a : b;
  const fewerVariants = va.n >= vb.n ? b : a;
  const betterLicense = licenseRank(a) >= licenseRank(b) ? a : b;
  const worseLicense = licenseRank(a) >= licenseRank(b) ? b : a;
  return { va, vb, moreIcons, fewerIcons, ratio, moreVariants, fewerVariants, betterLicense, worseLicense };
}

function buildVerdict(a, b) {
  const f = compareFacts(a, b);
  const lines = [];

  if (f.ratio >= 15) {
    lines.push(`<strong>${escapeHtml(f.moreIcons.fullName)}</strong> is the broader set: `
      + `${f.moreIcons.count} icons against ${f.fewerIcons.count} in ${escapeHtml(f.fewerIcons.fullName)} — `
      + `roughly ${Math.round(f.ratio)}% more coverage, which matters most if you build interfaces that need unusual glyphs.`);
  } else if (f.ratio > 0) {
    lines.push(`Coverage is close: ${a.count} icons in ${escapeHtml(a.fullName)} versus ${b.count} in `
      + `${escapeHtml(b.fullName)}. Neither will leave you hunting for a second library on breadth alone.`);
  } else {
    lines.push(`The two sets are near-identical in size — ${a.count} and ${b.count} icons — so this decision `
      + `should be made on visual style and licensing rather than coverage.`);
  }

  if (f.moreVariants !== f.fewerVariants) {
    const mv = variantsOf(f.moreVariants);
    lines.push(`<strong>${escapeHtml(f.moreVariants.fullName)}</strong> gives you more visual range: `
      + `${mv.n} variant${mv.n === 1 ? "" : "s"} per concept (${escapeHtml(mv.note)}), where `
      + `${escapeHtml(f.fewerVariants.fullName)} ships ${variantsOf(f.fewerVariants).n}.`);
  } else {
    lines.push(`Both ship ${f.va.n} variant${f.va.n === 1 ? "" : "s"} per concept, so neither has an edge on flexibility.`);
  }

  if (licenseRank(f.betterLicense) > licenseRank(f.worseLicense)) {
    lines.push(`On licensing, <strong>${escapeHtml(f.betterLicense.fullName)}</strong> is the safer default `
      + `(${f.betterLicense.license} versus ${f.worseLicense.license}).`);
  } else {
    lines.push(`Both are ${a.license}, so licensing is not a deciding factor here.`);
  }

  return lines;
}

/* ── Page builders ─────────────────────────────────────────────────────────── */

function specTable(a, b) {
  const rows = [
    ["Icons", a.count, b.count],
    ["Visual variants per concept", `${variantsOf(a).n} — ${escapeHtml(variantsOf(a).note)}`,
      `${variantsOf(b).n} — ${escapeHtml(variantsOf(b).note)}`],
    ["Design grid", a.grid, b.grid],
    ["License", a.license, b.license],
    ["Attribution required", licenseRank(a) <= 1 ? "Yes" : "No", licenseRank(b) <= 1 ? "Yes" : "No"],
    ["Official React package", `<code>${escapeHtml(a.npm)}</code>`, `<code>${escapeHtml(b.npm)}</code>`]
  ];
  return `<div class="hub-table-wrap"><table class="hub-table">
  <caption>Specification comparison</caption>
  <thead><tr><th scope="col">&nbsp;</th><th scope="col">${escapeHtml(a.fullName)}</th><th scope="col">${escapeHtml(b.fullName)}</th></tr></thead>
  <tbody>
    ${rows.map(([k, x, y]) => `<tr><th scope="row">${k}</th><td>${x}</td><td>${y}</td></tr>`).join("\n    ")}
  </tbody>
</table></div>`;
}

function previewGrid(a, b) {
  const cells = [];
  let used = 0;
  for (const concept of PREVIEW_CONCEPTS) {
    if (used >= 10) break;
    const ia = findIcon(a.slug, concept);
    const ib = findIcon(b.slug, concept);
    if (!ia && !ib) continue;
    used++;
    const slugA = ia ? `/icons/${ia.id}/` : null;
    const slugB = ib ? `/icons/${ib.id}/` : null;
    cells.push(`<div class="cmp-cell">
      <div class="cmp-preview">${slugA ? `<a href="${slugA}" aria-label="${escapeHtml(a.name)} ${escapeHtml(concept)} icon">${previewSvg(ia)}</a>` : '<span class="cmp-missing">—</span>'}</div>
      <div class="cmp-preview">${slugB ? `<a href="${slugB}" aria-label="${escapeHtml(b.name)} ${escapeHtml(concept)} icon">${previewSvg(ib)}</a>` : '<span class="cmp-missing">—</span>'}</div>
      <div class="cmp-label">${escapeHtml(concept)}</div>
    </div>`);
  }
  if (!cells.length) return "";
  return `<div class="cmp-grid" role="group" aria-label="Side-by-side icon previews">
    <div class="cmp-grid-head"><span>${escapeHtml(a.fullName)}</span><span>${escapeHtml(b.fullName)}</span><span>&nbsp;</span></div>
    ${cells.join("\n    ")}
  </div>`;
}

function chooseBlock(lib, other) {
  const copy = LIB_COPY[lib.slug];
  if (!copy) return "";
  return `<div class="card cmp-choose">
    <h3>Pick ${escapeHtml(lib.fullName)} when</h3>
    <p>${rich(copy.fit)}</p>
    ${copy.alt ? `<p class="cmp-alt"><strong>Consider otherwise if:</strong> ${rich(copy.alt)}</p>` : ""}
  </div>`;
}

function rich(html) {
  /* LIB_COPY is authored content containing intentional internal links. */
  return String(html || "");
}

function comparePage(a, b) {
  const slug = `${a.slug}-vs-${b.slug}`;
  const url = `/compare/${slug}/`;
  const copyA = LIB_COPY[a.slug] || {};
  const copyB = LIB_COPY[b.slug] || {};
  const grid = previewGrid(a, b);

  const title = `${a.name} vs ${b.name}: Icon Library Comparison`;
  const description = clamp(`${a.fullName} ships ${a.count} icons, ${b.fullName} ships ${b.count}. `
    + `Compare grid, license, variants and real side-by-side previews to pick the right one.`, 158);
  const canonical = `${SITE_URL}${url}`;

  const faqs = [
    [`Is ${a.name} or ${b.name} better for React projects?`,
      `Both have first-party React packages: <code>${escapeHtml(a.npm)}</code> and <code>${escapeHtml(b.npm)}</code>. `
      + `${escapeHtml(a.name)} ${a.countNum > b.countNum ? "has the larger catalogue" : "has the smaller catalogue"}, `
      + `so for a React app the practical difference is coverage and visual style rather than integration effort. `
      + `Both tree-shake, so bundle size tracks the number of icons you import, not the size of the library.`],
    [`Which has more icons, ${a.name} or ${b.name}?`,
      `${escapeHtml(a.fullName)} has ${a.count} icons and ${escapeHtml(b.fullName)} has ${b.count}. `
      + `${a.countNum === b.countNum ? "They are effectively equal." : `${escapeHtml(compareFacts(a, b).moreIcons.fullName)} is larger by about ${Math.round(compareFacts(a, b).ratio)}%.`} `
      + `Raw count is not the whole story though — a 20,000-icon set with many near-duplicate variants can be slower to search than a tightly edited 2,000-icon set.`],
    [`Can I mix ${a.name} and ${b.name} in one interface?`,
      `You can, but it usually looks wrong. Each library draws to its own grid and stroke weight — `
      + `${escapeHtml(a.name)} uses ${escapeHtml(a.grid)} and ${escapeHtml(b.name)} uses ${escapeHtml(b.grid)} — `
      + `so icons from both sit slightly differently next to each other. If you must mix them, keep each library to a distinct area of the interface rather than interleaving them in the same toolbar.`],
    [`What licenses do ${a.name} and ${b.name} use?`,
      `${escapeHtml(a.fullName)} is ${a.license}: ${escapeHtml(licenseNote(a))} `
      + `${escapeHtml(b.fullName)} is ${b.license}: ${escapeHtml(licenseNote(b))} `
      + `Neither requires payment, but attribution rules differ, so check before shipping in a product where credit is inconvenient.`],
    [`Do ${a.name} and ${b.name} include filled and outline versions?`,
      `${escapeHtml(a.fullName)} offers ${escapeHtml(variantsOf(a).note)}; ${escapeHtml(b.fullName)} offers `
      + `${escapeHtml(variantsOf(b).note)}. If you need to express selected and unselected states with the same glyph, `
      + `the library with more variants saves you from importing a second set.`],
    [`Which is better for small sizes like 16px?`,
      `At 16px, stroke weight and counter size matter more than coverage. `
      + `${escapeHtml(a.name)} draws on a ${escapeHtml(a.grid)} grid and ${escapeHtml(b.name)} on ${escapeHtml(b.grid)}. `
      + `Libraries that redraw per size rather than scaling — such as Fluent UI — generally hold up best. `
      + `The reliable test is to preview both at your actual render size, which you can do on any icon page on IconStash.`]
  ];

  const schema = [
    breadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Compare", url: `${SITE_URL}/compare/` },
      { name: `${a.name} vs ${b.name}`, url: canonical }
    ]),
    faqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      url: canonical,
      dateModified: TODAY,
      publisher: { "@type": "Organization", name: "IconStash", url: `${SITE_URL}/` },
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical }
    }
  ];

  const body = `
            <h1>${escapeHtml(a.name)} vs ${escapeHtml(b.name)}</h1>

            <p class="lede">${escapeHtml(a.fullName)} and ${escapeHtml(b.fullName)} are two of the most widely used
            open-source icon sets. Both are free, both ship framework packages, and both will look perfectly
            reasonable in a product UI — which is exactly why the choice is annoying. This page puts the two
            side by side using the actual artwork and the real numbers.</p>

            <section class="card cmp-verdict">
              <h2>The short answer</h2>
              <ul>
                ${buildVerdict(a, b).map((l) => `<li>${l}</li>`).join("\n                ")}
              </ul>
            </section>

            <section>
              <h2>Specifications compared</h2>
              ${specTable(a, b)}
            </section>

            ${grid ? `<section>
              <h2>Same icons, both libraries</h2>
              <p>Every pair below is the same concept rendered from each library's own source files. This is the
              part you cannot get from a written review — the difference in stroke weight, corner rounding and
              optical size is the thing you will actually notice in your interface.</p>
              ${grid}
            </section>` : ""}

            <section class="cmp-choose-wrap">
              <h2>Which one should you choose?</h2>
              ${chooseBlock(a, b)}
              ${chooseBlock(b, a)}
            </section>

            <section>
              <h2>Coverage</h2>
              <p>${escapeHtml(a.fullName)} contains ${a.count} icons and ${escapeHtml(b.fullName)} contains ${b.count}.
              ${rich(copyA.about ? copyA.about[0] : "")}</p>
              <p>${rich(copyB.about ? copyB.about[0] : "")}</p>
            </section>

            <section>
              <h2>Licensing</h2>
              <p>${escapeHtml(a.fullName)} is released under <strong>${escapeHtml(a.license)}</strong>.
              ${escapeHtml(licenseNote(a))}</p>
              <p>${escapeHtml(b.fullName)} is released under <strong>${escapeHtml(b.license)}</strong>.
              ${escapeHtml(licenseNote(b))}</p>
              ${(licenseRank(a) <= 1 || licenseRank(b) <= 1)
                ? `<p class="cmp-warn">One of these two requires attribution. If the icons will appear somewhere a
                credit line is impractical — an app icon, a hardware label, a slide deck template — that alone may
                settle the decision.</p>` : ""}
            </section>

            <section>
              <h2>Using them from IconStash</h2>
              <p>You do not have to commit to one. IconStash indexes both libraries, so you can search a concept
              once and see how each set drew it, then export SVG or PNG at any size and colour. Start with
              <a href="/library/${a.slug}/">${escapeHtml(a.fullName)}</a> or
              <a href="/library/${b.slug}/">${escapeHtml(b.fullName)}</a>, or browse
              <a href="/compare/">every library comparison</a>.</p>
            </section>

            <section class="hub-faq">
              <h2>Frequently asked questions</h2>
              ${faqBlock(faqs)}
            </section>

            <section class="hub-links">
              <h2>Related comparisons</h2>
              ${relatedComparisons(a, b)}
            </section>`;

  return {
    file: path.join(ROOT, "compare", slug, "index.html"),
    url,
    html: page({
      title, description, canonical, schema,
      activeType: "compare", activeSlug: slug,
      crumbs: `<a href="/">Home</a> / <a href="/compare/">Compare</a> / <span>${escapeHtml(a.name)} vs ${escapeHtml(b.name)}</span>`,
      body
    })
  };
}

function relatedComparisons(a, b) {
  const out = [];
  const push = (x, y) => out.push(`<a class="cmp-related" href="/compare/${x.slug}-vs-${y.slug}/">${escapeHtml(x.name)} vs ${escapeHtml(y.name)}</a>`);
  for (const p of (LIB_COPY[a.slug]?.peers || [])) {
    const peer = LIB_BY_SLUG.get(p);
    if (peer && peer.slug !== a.slug && peer.slug !== b.slug && HEAD_SET.includes(peer.slug)) push(a, peer);
  }
  for (const p of (LIB_COPY[b.slug]?.peers || [])) {
    const peer = LIB_BY_SLUG.get(p);
    if (peer && peer.slug !== a.slug && peer.slug !== b.slug && HEAD_SET.includes(peer.slug)) push(b, peer);
  }
  const seen = new Set();
  const uniq = out.filter((h) => {
    const m = /href="([^"]+)"/.exec(h);
    if (!m || seen.has(m[1])) return false;
    seen.add(m[1]);
    return true;
  });
  return uniq.slice(0, 8).join("\n              ");
}

/* ── Alternatives pages ────────────────────────────────────────────────────── */
function alternativesPage(lib) {
  const url = `/alternatives/${lib.slug}/`;
  const canonical = `${SITE_URL}${url}`;
  const copy = LIB_COPY[lib.slug] || {};

  const peers = (copy.peers || []).map((p) => LIB_BY_SLUG.get(p)).filter(Boolean);
  const extras = HEAD_SET.map((s) => LIB_BY_SLUG.get(s))
    .filter((p) => p && p.slug !== lib.slug && !peers.some((x) => x.slug === p.slug));
  const ranked = peers.concat(extras).slice(0, 8);

  const title = `Best ${lib.name} Alternatives (${ranked.length} Compared)`;
  const description = clamp(`Looking for an alternative to ${lib.fullName}? Compare ${ranked.length} open-source `
    + `icon libraries on icon count, license, variants and framework support — with real previews.`, 158);

  const faqs = [
    [`Why would I switch away from ${lib.name}?`,
      `The usual reasons are coverage, style range and licensing. ${escapeHtml(lib.fullName)} ships ${lib.count} `
      + `icons in ${escapeHtml(variantsOf(lib).note)}. If you need concepts it does not cover, or several visual `
      + `weights from one set, or a license without attribution, one of the alternatives below will fit better.`],
    [`Are these ${lib.name} alternatives free for commercial use?`,
      `Every library listed here is open source and free for commercial use. Most are MIT, ISC or Apache 2.0, `
      + `none of which require attribution. The exception in this list is any CC BY 4.0 set, which does require a `
      + `visible credit — check the license column in the table above before committing.`],
    [`Can I use more than one icon library in a project?`,
      `Technically yes, but mixing sets usually looks inconsistent because each one draws to its own grid and stroke `
      + `weight. If you need to fill a gap, prefer pulling a single icon and redrawing it to match your primary set.`]
  ];

  const schema = [
    breadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Alternatives", url: `${SITE_URL}/alternatives/` },
      { name: `${lib.name} alternatives`, url: canonical }
    ]),
    faqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: title,
      url: canonical,
      itemListElement: ranked.map((p, i) => ({
        "@type": "ListItem", position: i + 1,
        item: { "@type": "SoftwareApplication", name: p.fullName, url: `${SITE_URL}/library/${p.slug}/` }
      }))
    }
  ];

  const rows = ranked.map((p) => `<tr>
    <th scope="row"><a href="/library/${p.slug}/">${escapeHtml(p.fullName)}</a></th>
    <td>${escapeHtml(p.count)}</td>
    <td>${escapeHtml(variantsOf(p).note)}</td>
    <td>${escapeHtml(p.license)}</td>
    <td><code>${escapeHtml(p.npm)}</code></td>
    <td><a href="/compare/${lib.slug}-vs-${p.slug}/">vs ${escapeHtml(lib.name)}</a></td>
  </tr>`).join("\n    ");

  const body = `
            <h1>Best ${escapeHtml(lib.name)} Alternatives</h1>

            <p class="lede">${escapeHtml(lib.fullName)} is a solid choice — ${lib.count} icons, ${escapeHtml(lib.license)}
            licensed. But it is not the only one, and it is not the best fit for every project. Below are
            ${ranked.length} open-source alternatives ranked by how directly they answer the reasons people look
            for a replacement: more coverage, more visual range, or a simpler license.</p>

            <div class="hub-table-wrap"><table class="hub-table">
              <caption>${escapeHtml(lib.name)} alternatives at a glance</caption>
              <thead><tr><th scope="col">Library</th><th scope="col">Icons</th><th scope="col">Variants</th>
              <th scope="col">License</th><th scope="col">React package</th><th scope="col">Compare</th></tr></thead>
              <tbody>
                ${rows}
              </tbody>
            </table></div>

            <section>
              <h2>Where ${escapeHtml(lib.name)} is already the right answer</h2>
              <p>${rich(copy.fit || `${escapeHtml(lib.fullName)} is a reasonable default for most product interfaces.`)}</p>
              ${copy.alt ? `<p>${rich(copy.alt)}</p>` : ""}
            </section>

            <section>
              <h2>How to choose between them</h2>
              <p>Start from the constraint that actually binds your project. If it is coverage, sort by icon count —
              the difference between a 286-icon set and a 20,000-icon set is whether you ever have to design a glyph
              yourself. If it is visual range, look at variants per concept: a library with six weights lets you
              build hierarchy without a second dependency. If it is legal simplicity, avoid CC BY sets where
              attribution is impractical.</p>
              <p>All of these libraries are indexed on IconStash, so you can search one concept and compare how every
              set drew it before committing.</p>
            </section>

            <section class="hub-faq">
              <h2>Frequently asked questions</h2>
              ${faqBlock(faqs)}
            </section>

            <section class="hub-links">
              <h2>Explore</h2>
              <a class="cmp-related" href="/library/${lib.slug}/">${escapeHtml(lib.fullName)} icons</a>
              <a class="cmp-related" href="/compare/">All library comparisons</a>
              <a class="cmp-related" href="/library/">All icon libraries</a>
            </section>

            ${conceptStrip(`Popular ${escapeHtml(lib.name)} icons`)}`;

  return {
    file: path.join(ROOT, "alternatives", lib.slug, "index.html"),
    url,
    html: page({
      title, description, canonical, schema,
      activeType: "alternatives", activeSlug: lib.slug,
      crumbs: `<a href="/">Home</a> / <a href="/alternatives/">Alternatives</a> / <span>${escapeHtml(lib.name)} alternatives</span>`,
      body
    })
  };
}

/* ── Framework pages ─────────────────────────────────────────────────────────
   Package names here are checked against the libraries' published packages.
   Only claims that are verifiable from the library metadata are generated;
   the rest is written to stay true regardless of version. */
const STACKS = [
  {
    slug: "react", name: "React", title: "React Icons",
    lead: "Every major open-source icon library ships a first-party React package, so the decision is about coverage and style rather than integration.",
    picks: ["lucide", "heroicons", "phosphor", "tabler", "material"],
    note: "All of these packages tree-shake, so shipping ten icons costs roughly ten icons' worth of JavaScript — not the whole library. Import named exports rather than the namespace to keep that guarantee."
  },
  {
    slug: "nextjs", name: "Next.js", title: "Next.js Icons",
    lead: "Next.js adds one real constraint on top of React: icons are usually server-rendered, so the package has to avoid client-only hooks.",
    picks: ["lucide", "heroicons", "phosphor", "tabler", "radix"],
    note: "Prefer packages that render plain SVG on the server. If a component is marked \"use client\", inline SVG from IconStash avoids the boundary entirely and is the fastest option for above-the-fold icons."
  },
  {
    slug: "vue", name: "Vue", title: "Vue Icons",
    lead: "Vue 3 support is good but patchier than React — check that the library publishes a dedicated Vue package rather than relying on a wrapper.",
    picks: ["lucide", "heroicons", "phosphor", "tabler", "carbon"],
    note: "Lucide publishes lucide-vue-next for Vue 3. Where a library has no official Vue build, Iconify's Vue component covers most sets from one dependency."
  },
  {
    slug: "svelte", name: "Svelte", title: "Svelte Icons",
    lead: "Svelte has the smallest selection of first-party packages, which makes coverage and export flexibility more important than usual.",
    picks: ["lucide", "heroicons", "phosphor", "tabler"],
    note: "Because Svelte compiles away, importing raw SVG paths is nearly free. When a set has no Svelte package, pasting an inline SVG from IconStash is often cleaner than adding a dependency."
  },
  {
    slug: "tailwind", name: "Tailwind CSS", title: "Tailwind CSS Icons",
    lead: "Tailwind projects have one obvious default and several strong alternatives, depending on whether you want utility-class sizing or components.",
    picks: ["heroicons", "lucide", "phosphor", "iconoir"],
    note: "Heroicons is built by the Tailwind team and its geometry is tuned to Tailwind's spacing scale, which is why it aligns so cleanly with utility classes. Size icons with w-* / h-* and colour them with text-*."
  },
  {
    slug: "react-native", name: "React Native", title: "React Native Icons",
    lead: "React Native cannot render arbitrary SVG without a bridge, so the choice narrows to libraries with a dedicated native package.",
    picks: ["lucide", "phosphor", "ionicons", "material"],
    note: "react-native-svg is a prerequisite for most icon packages. Where you only need a handful of glyphs, exporting PNGs at 1x/2x/3x from IconStash avoids the dependency altogether."
  },
  {
    slug: "angular", name: "Angular", title: "Angular Icons",
    lead: "Angular has fewer first-party icon packages, so most teams use an aggregator or inline SVG.",
    picks: ["material", "carbon", "fluent", "ionicons"],
    note: "Material Icons and Carbon both ship official Angular components. For anything else, inlining the SVG from IconStash into a template is reliable and adds no build weight."
  }
];

function stackPage(stack) {
  const url = `/icons-for/${stack.slug}/`;
  const canonical = `${SITE_URL}${url}`;
  const picks = stack.picks.map((s) => LIB_BY_SLUG.get(s)).filter(Boolean);

  const title = `${stack.title}: Best Icon Libraries for ${stack.name}`;
  const description = clamp(`${stack.lead} Compare ${picks.length} libraries that work well with ${stack.name}, `
    + `with icon counts, licenses and package names.`, 158);

  const faqs = [
    [`Which icon library is best for ${stack.name}?`,
      `${escapeHtml(picks[0].fullName)} is the safest default: ${picks[0].count} icons, ${escapeHtml(picks[0].license)} `
      + `licensed, and a first-party package. ${escapeHtml(stack.note)}`],
    [`Do icon libraries slow down a ${stack.name} app?`,
      `Only if you import the whole set. Every library here tree-shakes, so bundling ten named icon exports ships `
      + `ten icons. Watch for barrel imports like <code>import * as Icons from "..."</code>, which defeat that.`],
    [`Can I use raw SVG instead of a package?`,
      `Yes, and for small numbers of icons it is often better — no dependency, no version drift, and full control over `
      + `attributes. Export any icon from IconStash as an inline SVG or a downloadable file and paste it straight in.`]
  ];

  const schema = [
    breadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/` },
      { name: "Icons for", url: `${SITE_URL}/icons-for/` },
      { name: stack.name, url: canonical }
    ]),
    faqSchema(faqs),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: title,
      url: canonical,
      itemListElement: picks.map((p, i) => ({
        "@type": "ListItem", position: i + 1,
        item: { "@type": "SoftwareApplication", name: p.fullName, url: `${SITE_URL}/library/${p.slug}/` }
      }))
    }
  ];

  const rows = picks.map((p) => `<tr>
    <th scope="row"><a href="/library/${p.slug}/">${escapeHtml(p.fullName)}</a></th>
    <td>${escapeHtml(p.count)}</td>
    <td>${escapeHtml(variantsOf(p).note)}</td>
    <td>${escapeHtml(p.grid)}</td>
    <td>${escapeHtml(p.license)}</td>
    <td><code>${escapeHtml(p.npm)}</code></td>
  </tr>`).join("\n    ");

  const body = `
            <h1>${escapeHtml(stack.title)}</h1>

            <p class="lede">${escapeHtml(stack.lead)}</p>

            <div class="hub-table-wrap"><table class="hub-table">
              <caption>Recommended libraries for ${escapeHtml(stack.name)}</caption>
              <thead><tr><th scope="col">Library</th><th scope="col">Icons</th><th scope="col">Variants</th>
              <th scope="col">Grid</th><th scope="col">License</th><th scope="col">Package</th></tr></thead>
              <tbody>
                ${rows}
              </tbody>
            </table></div>

            <section>
              <h2>What to watch for on ${escapeHtml(stack.name)}</h2>
              <p>${escapeHtml(stack.note)}</p>
            </section>

            <section>
              <h2>Recommended starting point</h2>
              <p>For most ${escapeHtml(stack.name)} projects, start with
              <a href="/library/${picks[0].slug}/">${escapeHtml(picks[0].fullName)}</a> — ${picks[0].count} icons,
              ${escapeHtml(variantsOf(picks[0]).note)}, ${escapeHtml(picks[0].license)} licensed, installed as
              <code>${escapeHtml(picks[0].npm)}</code>. Move to
              <a href="/library/${picks[1].slug}/">${escapeHtml(picks[1].fullName)}</a> if you need
              ${escapeHtml(variantsOf(picks[1]).note)} instead.</p>
            </section>

            <section class="hub-faq">
              <h2>Frequently asked questions</h2>
              ${faqBlock(faqs)}
            </section>

            <section class="hub-links">
              <h2>Explore</h2>
              <a class="cmp-related" href="/library/">All icon libraries</a>
              <a class="cmp-related" href="/compare/">Library comparisons</a>
              ${picks.slice(0, 4).map((p) => `<a class="cmp-related" href="/library/${p.slug}/">${escapeHtml(p.fullName)}</a>`).join("\n              ")}
            </section>

            ${conceptStrip(`Popular ${escapeHtml(stack.name)} icons`)}`;

  return {
    file: path.join(ROOT, "icons-for", stack.slug, "index.html"),
    url,
    html: page({
      title, description, canonical, schema,
      activeType: "icons-for", activeSlug: stack.slug,
      crumbs: `<a href="/">Home</a> / <a href="/icons-for/">Icons for</a> / <span>${escapeHtml(stack.name)}</span>`,
      body
    })
  };
}

/* ── Index pages ───────────────────────────────────────────────────────────── */
function indexPage({ type, title, description, intro, links, columns = 3 }) {
  const url = `/${type}/`;
  const canonical = `${SITE_URL}${url}`;
  const schema = [
    breadcrumbSchema([
      { name: "Home", url: `${SITE_URL}/` },
      { name: title, url: canonical }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: title, description, url: canonical,
      isPartOf: { "@type": "WebSite", name: "IconStash", url: `${SITE_URL}/` }
    }
  ];
  const body = `
            <h1>${escapeHtml(title)}</h1>
            <p class="lede">${escapeHtml(intro)}</p>
            <section class="hub-links hub-links-count-${columns}">
              ${links.map((l) => `<a class="cmp-related" href="${l.url}">${escapeHtml(l.label)}</a>`).join("\n              ")}
            </section>
            <section>
              <h2>Browse differently</h2>
              <p>You can also browse by <a href="/library/">library</a>, by <a href="/category/">category</a>,
              or by <a href="/style/">style</a>.</p>
            </section>`;
  return {
    file: path.join(ROOT, type, "index.html"),
    url,
    html: page({
      title, description, canonical, schema,
      activeType: type, activeSlug: "",
      crumbs: `<a href="/">Home</a> / <span>${escapeHtml(title)}</span>`,
      body
    })
  };
}

/* Links to the highest-coverage concept pages — the head terms with real
   search volume. Framework and alternatives pages have no icon previews of
   their own, so these links are how they feed authority into the pages that
   actually rank. */
const TOP_CONCEPTS = (hub.KEYWORDS || [])
  .filter((r) => r.intent === "concept" && r.url)
  .sort((a, b) => (b.iconIds || []).length - (a.iconIds || []).length)
  .slice(0, 10);

function conceptStrip(title) {
  if (!TOP_CONCEPTS.length) return "";
  return `<section class="hub-links">
              <h2>${escapeHtml(title)}</h2>
              ${TOP_CONCEPTS.map((r) => `<a class="cmp-related" href="${r.url}">${escapeHtml(r.keyword)}</a>`).join("\n              ")}
            </section>`;
}

function clamp(text, max) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : clean;
}

/* ── Main ──────────────────────────────────────────────────────────────────── */
function main() {
  const started = Date.now();
  const pages = [];

  /* Comparisons: every pair in the head set. */
  const headLibs = HEAD_SET.map((s) => LIB_BY_SLUG.get(s)).filter(Boolean);
  for (let i = 0; i < headLibs.length; i++) {
    for (let j = i + 1; j < headLibs.length; j++) {
      pages.push(comparePage(headLibs[i], headLibs[j]));
    }
  }

  /* Alternatives for the head set. */
  for (const lib of headLibs) pages.push(alternativesPage(lib));

  /* Framework pages. */
  for (const stack of STACKS) pages.push(stackPage(stack));

  /* Index pages. */
  const compareLinks = [];
  for (let i = 0; i < headLibs.length; i++) {
    for (let j = i + 1; j < headLibs.length; j++) {
      compareLinks.push({ url: `/compare/${headLibs[i].slug}-vs-${headLibs[j].slug}/`, label: `${headLibs[i].name} vs ${headLibs[j].name}` });
    }
  }
  pages.push(indexPage({
    type: "compare",
    title: "Icon Library Comparisons",
    description: "Side-by-side comparisons of the most-used open-source icon libraries, with real artwork previews, icon counts, licenses and package names.",
    intro: `${compareLinks.length} head-to-head comparisons between the icon libraries developers actually argue about. Each one renders the same concepts in both sets so you can judge style, not just read about it.`,
    links: compareLinks
  }));
  pages.push(indexPage({
    type: "alternatives",
    title: "Icon Library Alternatives",
    description: "Looking for a replacement for your current icon set? Compare alternatives to every major open-source icon library.",
    intro: `Alternatives to each major open-source icon library, ranked by the reasons people actually switch: coverage, visual range, and licensing.`,
    links: headLibs.map((l) => ({ url: `/alternatives/${l.slug}/`, label: `${l.name} alternatives` }))
  }));
  pages.push(indexPage({
    type: "icons-for",
    title: "Icons for Every Framework",
    description: "Which icon library works best with React, Next.js, Vue, Svelte, Tailwind CSS, React Native and Angular.",
    intro: "Framework-specific guidance for picking an icon library: what has a first-party package, what tree-shakes, and where inline SVG beats a dependency.",
    links: STACKS.map((s) => ({ url: `/icons-for/${s.slug}/`, label: s.title }))
  }));

  for (const p of pages) hub.write(p);

  /* Sitemap for this layer, then register it in the index. */
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    + pages.map((p) => `  <url><loc>${SITE_URL}${p.url}</loc><lastmod>${TODAY}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`).join("\n")
    + `\n</urlset>\n`;
  fs.mkdirSync(SITEMAP_DIR, { recursive: true });
  fs.writeFileSync(path.join(SITEMAP_DIR, "compare.xml"), xml, "utf8");

  const indexPath = path.join(ROOT, "sitemap.xml");
  if (fs.existsSync(indexPath)) {
    let indexXml = fs.readFileSync(indexPath, "utf8");
    if (!indexXml.includes("/sitemaps/compare.xml")) {
      indexXml = indexXml.replace("</sitemapindex>",
        `  <sitemap><loc>${SITE_URL}/sitemaps/compare.xml</loc><lastmod>${TODAY}</lastmod></sitemap>\n</sitemapindex>`);
      fs.writeFileSync(indexPath, indexXml, "utf8");
    }
  }

  console.log(`Wrote ${pages.length} pages in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  console.log(`  comparisons:  ${headLibs.length * (headLibs.length - 1) / 2}`);
  console.log(`  alternatives: ${headLibs.length}`);
  console.log(`  frameworks:   ${STACKS.length}`);
  console.log(`  indexes:      3`);
  console.log(`Wrote sitemaps/compare.xml (${pages.length} URLs)`);
}

if (require.main === module) main();
module.exports = { main, HEAD_SET, STACKS };
