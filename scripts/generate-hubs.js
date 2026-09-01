#!/usr/bin/env node
/**
 * generate-hubs.js — builds the crawlable hub layer for IconStash.
 *
 * Emits three directory trees of STATIC HTML:
 *   /library/<slug>/index.html   (28 pages)
 *   /category/<slug>/index.html  (16 pages)
 *   /style/<slug>/index.html     (7 pages)
 *   + /library/, /category/, /style/ index pages
 *
 * The output is plain HTML committed to the repo. Nothing at request time
 * depends on this script; it is a maintenance tool, run manually when the
 * icon data changes.
 *
 * Every /icons/ link emitted is verified against the prerendered tree on disk
 * before it is written. Broken links are dropped and reported.
 *
 * Usage: node scripts/generate-hubs.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const ICONS_DIR = path.join(ROOT, "icons");
const SITE_URL = "https://iconstash.io";
/* Bump this whenever style.css gains rules that new pages depend on. Every page
   loads style.css?v=<this>, so returning visitors will serve the cached old
   file and render the new pages unstyled unless the string changes. The 137k
   icon pages deliberately stay on ?v=20260715-sidebarfix because they use none
   of the hub or comparison CSS and keeping them pinned preserves their cache. */
const CSS_VERSION = "20260830-comparisons";

/* ────────────────────────────────────────────────────────────────────────────
   1. Load data
   ──────────────────────────────────────────────────────────────────────────── */

const kwRaw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "pseo-keywords.json"), "utf8"));
const KEYWORDS = Array.isArray(kwRaw) ? kwRaw : kwRaw.keywords || Object.values(kwRaw)[0];

/** Base library files only — the `-N.json` files are 500-icon subsets (duplicates). */
const iconMeta = new Map();
const subCategories = new Map();
for (const file of fs.readdirSync(DATA_DIR)) {
  if (!/^[a-z0-9]+\.json$/.test(file) || file === "pseo-keywords.json") continue;
  const lib = file.replace(/\.json$/, "");
  let rows;
  try { rows = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf8")); } catch (_) { continue; }
  if (!Array.isArray(rows)) continue;
  for (const icon of rows) {
    if (!icon || !icon.id) continue;
    iconMeta.set(icon.id, icon);
    if (icon.category && icon.subCategory) {
      if (!subCategories.has(icon.category)) subCategories.set(icon.category, new Map());
      const m = subCategories.get(icon.category);
      m.set(icon.subCategory, (m.get(icon.subCategory) || 0) + 1);
    }
  }
}

/* ────────────────────────────────────────────────────────────────────────────
   2. Library reference data (mirrors LIBRARY_INFO in generate-pseo.js)
   ──────────────────────────────────────────────────────────────────────────── */

const LIBRARIES = [
  { slug: "lucide", name: "Lucide", fullName: "Lucide Icons", count: "1,979", countNum: 1979, style: "Outline", license: "ISC", npm: "lucide-react", grid: "24×24" },
  { slug: "tabler", name: "Tabler", fullName: "Tabler Icons", count: "6,324", countNum: 6324, style: "Outline", license: "MIT", npm: "@tabler/icons-react", grid: "24×24" },
  { slug: "phosphor", name: "Phosphor", fullName: "Phosphor Icons", count: "9,198", countNum: 9198, style: "Six weights", license: "MIT", npm: "phosphor-react", grid: "24×24" },
  { slug: "material", name: "Material", fullName: "Material Design Icons", count: "14,001", countNum: 14001, style: "Five themes", license: "Apache 2.0", npm: "@mui/icons-material", grid: "24×24" },
  { slug: "remix", name: "Remix", fullName: "Remix Icon", count: "3,244", countNum: 3244, style: "Line & fill", license: "Apache 2.0", npm: "remixicon", grid: "24×24" },
  { slug: "iconoir", name: "Iconoir", fullName: "Iconoir", count: "2,020", countNum: 2020, style: "Outline", license: "MIT", npm: "iconoir-react", grid: "24×24" },
  { slug: "heroicons", name: "Heroicons", fullName: "Heroicons", count: "1,297", countNum: 1297, style: "Outline & solid", license: "MIT", npm: "@heroicons/react", grid: "16/20/24" },
  { slug: "bootstrap", name: "Bootstrap", fullName: "Bootstrap Icons", count: "2,090", countNum: 2090, style: "Multi-style", license: "MIT", npm: "bootstrap-icons", grid: "16×16" },
  { slug: "feather", name: "Feather", fullName: "Feather Icons", count: "286", countNum: 286, style: "Outline", license: "MIT", npm: "react-feather", grid: "24×24" },
  { slug: "mingcute", name: "MingCute", fullName: "MingCute Icons", count: "3,352", countNum: 3352, style: "Line & fill", license: "Apache 2.0", npm: "@mingcute/icon-react", grid: "24×24" },
  { slug: "solar", name: "Solar", fullName: "Solar Icons", count: "7,410", countNum: 7410, style: "Six styles", license: "CC BY 4.0", npm: "solar-icon-set", grid: "24×24" },
  { slug: "octicons", name: "Octicons", fullName: "Octicons", count: "929", countNum: 929, style: "Outline", license: "MIT", npm: "@primer/octicons-react", grid: "16×16" },
  { slug: "cssgg", name: "css.gg", fullName: "css.gg Icons", count: "705", countNum: 705, style: "Outline", license: "MIT", npm: "css.gg", grid: "24×24" },
  { slug: "radix", name: "Radix", fullName: "Radix Icons", count: "345", countNum: 345, style: "Outline", license: "MIT", npm: "@radix-ui/react-icons", grid: "15×15" },
  { slug: "antdesign", name: "Ant Design", fullName: "Ant Design Icons", count: "1,870", countNum: 1870, style: "Outlined, filled & two-tone", license: "MIT", npm: "@ant-design/icons", grid: "24×24" },
  { slug: "fluent", name: "Fluent UI", fullName: "Fluent UI Icons", count: "20,170", countNum: 20170, style: "Regular & filled", license: "MIT", npm: "@fluentui/react-icons", grid: "12–48" },
  { slug: "carbon", name: "Carbon", fullName: "Carbon Icons", count: "2,644", countNum: 2644, style: "Outline", license: "Apache 2.0", npm: "@carbon/icons-react", grid: "32×32" },
  { slug: "ionicons", name: "Ionicons", fullName: "Ionicons", count: "2,607", countNum: 2607, style: "Outline, filled & sharp", license: "MIT", npm: "ionicons", grid: "24×24" },
  { slug: "eva", name: "Eva", fullName: "Eva Icons", count: "490", countNum: 490, style: "Fill & outline", license: "MIT", npm: "eva-icons", grid: "24×24" },
  { slug: "boxicons", name: "Boxicons", fullName: "Boxicons", count: "3,389", countNum: 3389, style: "Regular, solid & logos", license: "MIT", npm: "boxicons", grid: "24×24" },
  { slug: "materialsymbols", name: "Material Symbols", fullName: "Material Symbols", count: "18,547", countNum: 18547, style: "Variable", license: "Apache 2.0", npm: "@material-symbols/svg-400", grid: "24×24" },
  { slug: "materialsymbolslight", name: "Symbols Light", fullName: "Material Symbols Light", count: "15,969", countNum: 15969, style: "Light (300 weight)", license: "Apache 2.0", npm: "@material-symbols/svg-300", grid: "24×24" },
  { slug: "iconparkoutline", name: "IconPark Outline", fullName: "IconPark Outline", count: "2,658", countNum: 2658, style: "Outline", license: "Apache 2.0", npm: "@icon-park/react", grid: "24×24" },
  { slug: "iconparksolid", name: "IconPark Solid", fullName: "IconPark Solid", count: "1,970", countNum: 1970, style: "Filled", license: "Apache 2.0", npm: "@icon-park/react", grid: "24×24" },
  { slug: "hugeicons", name: "Huge Icons", fullName: "Huge Icons", count: "5,115", countNum: 5115, style: "Six styles", license: "MIT", npm: "hugeicons-react", grid: "24×24" },
  { slug: "pixelarticons", name: "Pixel Art", fullName: "Pixel Art Icons", count: "1,099", countNum: 1099, style: "Pixel", license: "MIT", npm: "pixelarticons", grid: "24×24 pixel" },
  { slug: "linemd", name: "Line MD", fullName: "Line MD Icons", count: "1,279", countNum: 1279, style: "Animated", license: "MIT", npm: "@iconify/react", grid: "24×24" },
  { slug: "simpleicons", name: "Simple Icons", fullName: "Simple Icons", count: "3,714", countNum: 3714, style: "Filled (brand)", license: "CC0 1.0", npm: "simple-icons", grid: "24×24" }
];

const LIB_BY_SLUG = new Map(LIBRARIES.map((l) => [l.slug, l]));

/** Style buckets used by the /style/ hubs, in sidebar order. */
const STYLES = [
  { slug: "outline", name: "Outline", title: "Outline Icons" },
  { slug: "solid", name: "Solid", title: "Solid Icons" },
  { slug: "duotone", name: "Duotone", title: "Duotone Icons" },
  { slug: "fill", name: "Fill", title: "Fill Icons" },
  { slug: "bold", name: "Bold", title: "Bold Icons" },
  { slug: "thin", name: "Thin", title: "Thin Icons" },
  { slug: "light", name: "Light", title: "Light Icons" }
];

/** Categories, in the same order as the site sidebar. */
const CATEGORY_SLUGS = ["media", "communication", "commerce", "navigation", "files", "editing",
  "devices", "development", "security", "health", "weather", "transport", "social", "time",
  "data", "interface"];

const CATEGORY_COLORS = ["#00c3ff", "#ff2d9b", "#00ff88", "#bf00ff", "#ff6a00", "#f5ff00"];

const CATEGORY_INFO = {
  media: { name: "Media", sub: "Photography", blurb: "camera, video, audio and gallery icons for players, editors and media libraries" },
  communication: { name: "Communication", sub: "Messaging", blurb: "mail, chat, phone and notification icons for inboxes, messaging and alerts" },
  commerce: { name: "Commerce", sub: "Payments", blurb: "cart, wallet, card and receipt icons for checkout, billing and storefronts" },
  navigation: { name: "Navigation", sub: "Maps", blurb: "arrow, chevron, map and direction icons for menus, breadcrumbs and wayfinding" },
  files: { name: "Files", sub: "Documents", blurb: "file, folder, archive and clipboard icons for document managers and upload flows" },
  editing: { name: "Editing", sub: "Design", blurb: "pen, crop, palette and layout icons for editors, design tools and creative apps" },
  devices: { name: "Devices", sub: "Hardware", blurb: "phone, laptop, watch and server icons for device panels and hardware dashboards" },
  development: { name: "Development", sub: "Code", blurb: "terminal, git, bug and API icons for developer tools, CI dashboards and repos" },
  security: { name: "Security", sub: "Privacy", blurb: "lock, shield, key and fingerprint icons for auth flows, permissions and trust badges" },
  health: { name: "Health", sub: "Medical", blurb: "heart, pulse, pill and stethoscope icons for health apps, records and triage tools" },
  weather: { name: "Weather", sub: "Nature", blurb: "sun, cloud, rain and wind icons for forecasts, climate dashboards and outdoor apps" },
  transport: { name: "Transport", sub: "Travel", blurb: "car, plane, train and luggage icons for logistics, booking and delivery products" },
  social: { name: "Social", sub: "People", blurb: "user, team, profile and emoji icons for accounts, directories and community features" },
  time: { name: "Time", sub: "Productivity", blurb: "clock, calendar, timer and history icons for scheduling, deadlines and activity logs" },
  data: { name: "Data", sub: "Charts", blurb: "chart, graph, table and trend icons for analytics, reporting and BI dashboards" },
  interface: { name: "Interface", sub: "Controls", blurb: "toggle, slider, checkbox and other control icons for forms, settings and UI chrome" }
};

/* ────────────────────────────────────────────────────────────────────────────
   3. Per-library editorial copy
   Every library gets its own prose. This is what keeps the hub layer from
   reading as 28 copies of the same page.
   ──────────────────────────────────────────────────────────────────────────── */

const LIB_COPY = {
  lucide: {
    about: [
      "Lucide began as a fork of <a href=\"/library/feather/\">Feather Icons</a> when Feather's release cadence slowed and community pull requests began to pile up. Rather than let the project stall, contributors created Lucide with an explicit commitment to community governance and regular releases. It has since grown well past its parent: 1,979 icons against Feather's 286.",
      "Every Lucide icon is drawn on a 24×24 grid with a default 2px stroke, rounded caps and joins, and no fill. That consistency is the library's main selling point — icons from different contributors still look like they belong in the same interface. The set covers the full range of product UI needs: navigation, files, media, commerce, communication, devices, and development."
    ],
    fit: "SaaS dashboards, developer tools, documentation sites, and any product that wants a calm, neutral, geometric icon language. Lucide is particularly strong in dense interfaces because its uniform stroke weight stays legible at 16px and 20px.",
    alt: "If you need multiple weights from one library, <a href=\"/library/phosphor/\">Phosphor</a> offers six. If you need filled icons, <a href=\"/library/iconparksolid/\">IconPark Solid</a> or <a href=\"/library/material/\">Material Design Icons</a> are better choices, since Lucide is outline-only.",
    lic: "ISC. Functionally equivalent to MIT for practical purposes — commercial use, modification, and redistribution are all permitted with no attribution requirement. This makes Lucide safe for client work and proprietary products where CC BY libraries like <a href=\"/library/solar/\">Solar Icons</a> would require credit.",
    peers: ["feather", "tabler", "heroicons", "phosphor"],
    faq: [
      ["What stroke width do Lucide icons use?",
        "Lucide icons default to a 2px stroke on a 24×24 grid. Because the icons are vector-based you can adjust stroke weight freely — IconStash lets you set any stroke width from 0.1 to 3 and preview the result live before exporting. Thinner strokes around 1.5px suit dense interfaces; heavier strokes work better for large display sizes."],
      ["How is Lucide different from Feather Icons?",
        "Lucide started as a fork of Feather after Feather's development slowed. Lucide keeps Feather's minimal 24×24 outline aesthetic but has grown to 1,979 icons versus Feather's 286, adds new icons far more frequently, and maintains an official React package. If you need breadth, choose Lucide; if you want the smallest possible set, Feather still works."]
    ]
  },
  tabler: {
    about: [
      "Tabler Icons is maintained alongside the <strong>Tabler</strong> admin dashboard template, and it shows: the set is built for real application chrome rather than marketing pages. With 6,324 icons it is one of the largest MIT-licensed outline libraries available, and every icon is drawn on a consistent 24×24 grid with a 2px stroke.",
      "The coverage is what sets Tabler apart. Beyond the usual interface actions it includes deep sets for e-commerce, medical, automotive, brand logos, and emoji-style glyphs — categories that most outline libraries treat as an afterthought. Icons ship as both outline and filled variants for a large part of the set."
    ],
    fit: "Admin panels, internal tools, and data-heavy B2B products where you need an unusual icon and don't want to draw it yourself. Tabler's breadth means you are rarely forced to mix libraries to fill a gap.",
    alt: "If you want a smaller, more opinionated set with tighter visual consistency, <a href=\"/library/lucide/\">Lucide</a> or <a href=\"/library/feather/\">Feather</a> are easier to keep coherent. For multiple weights in one library, look at <a href=\"/library/phosphor/\">Phosphor</a>.",
    lic: "MIT. Free for commercial and personal use with no attribution required. The license covers the whole set, including the brand logo icons bundled with the library.",
    peers: ["feather", "lucide", "iconoir", "remix"],
    faq: [
      ["Does Tabler include filled icon variants?",
        "Yes. A large portion of the Tabler set ships in both outline and filled form, letting you use fill state to indicate selection or active navigation without switching libraries. IconStash indexes both variants, so you can search for an icon and pick the weight that matches your interface."],
      ["Is Tabler Icons the same project as the Tabler admin template?",
        "They are separate projects from the same author. The icon set is standalone and has no dependency on the dashboard template — you can install @tabler/icons-react and use it in any project. The shared origin explains why the set is unusually well covered for admin and dashboard use cases."]
    ]
  },
  phosphor: {
    about: [
      "Phosphor is built around a single idea: one icon family that works at every weight. Each of its 9,198 icons is available in six weights — Thin, Light, Regular, Bold, Fill, and Duotone — so you can express hierarchy, hover state, and emphasis without ever leaving the library.",
      "That makes Phosphor unusually good for design systems. A single concept (home, user, settings) has six consistent expressions, which means your icon set stays coherent from a 16px table row to a 96px empty state. The Regular weight reads close to <a href=\"/library/lucide/\">Lucide</a>, while Fill and Duotone carry much more visual weight."
    ],
    fit: "Design systems, products with strong visual hierarchy, and teams that want one library to cover every context. The weight range also solves the common problem of outline icons disappearing on coloured or photographic backgrounds.",
    alt: "If you only need one weight, the six-weight structure is overhead you will not use — <a href=\"/library/lucide/\">Lucide</a> or <a href=\"/library/tabler/\">Tabler</a> are simpler. If you want duotone plus a premium aesthetic, compare <a href=\"/library/solar/\">Solar</a> and <a href=\"/library/hugeicons/\">Huge Icons</a>.",
    lic: "MIT. All 9,198 icons including every weight are free for commercial use with no attribution required, which is unusual for a library with this much range.",
    peers: ["lucide", "heroicons", "solar", "remix"],
    faq: [
      ["What weights does Phosphor include?",
        "Six: Thin, Light, Regular, Bold, Fill, and Duotone. Every icon in the set is drawn in all six, so switching weight is a prop change rather than a search for a different icon. Bold and Fill work well for active navigation states; Thin and Light suit dense tables and secondary actions."],
      ["When should I use Phosphor Duotone icons?",
        "Duotone adds a second, lighter colour pass to each icon, which reads well in empty states, onboarding screens, and feature cards where a plain outline looks too thin. It is heavier visually, so avoid it in dense toolbars. IconStash previews all six weights so you can compare before exporting."]
    ]
  },
  material: {
    about: [
      "Material Design Icons is Google's official icon set, and it is the most widely deployed icon vocabulary on the web. The 14,001 icons follow the Material geometry rules — a 24×24 grid with 2px keypoint padding, straight edges softened by corner radii, and a deliberate, slightly geometric construction.",
      "The set ships in five themes: Outlined, Rounded, Sharp, Two Tone, and Filled. Because it is the native icon language of Android and Google's own web products, users have been trained on these glyphs for over a decade — which is a real usability advantage when you need an icon to be understood instantly."
    ],
    fit: "Products that follow Material Design, Android-adjacent apps, and any interface where recognition matters more than distinctiveness. If your users already use Gmail, Drive, or Android, these icons need no explanation.",
    alt: "Google's newer <a href=\"/library/materialsymbols/\">Material Symbols</a> supersedes this set with variable-font icons in a single file. For a less Google-flavoured look, <a href=\"/library/fluent/\">Fluent UI</a> and <a href=\"/library/carbon/\">Carbon</a> are the enterprise equivalents.",
    lic: "Apache 2.0. Free for commercial use, with an explicit patent grant from Google. You should not use the icons to imply Google endorses your product, but ordinary use in an interface is unrestricted.",
    peers: ["materialsymbols", "fluent", "carbon", "ionicons"],
    faq: [
      ["What is the difference between Material Icons and Material Symbols?",
        "Material Symbols is the newer format. It uses variable font technology, packs 18,547 icons into a single file, and exposes four adjustable axes — Weight, Fill, Grade, and Optical Size — so one font covers what previously needed five static themes. Material Icons (this set) remains the better choice if you need stable, individually imported SVG components."],
      ["Which Material theme should I use?",
        "Outlined for dense or light interfaces, Filled for active and selected states, Rounded for consumer products that want a softer feel, Sharp when you need crisper geometry at small sizes, and Two Tone for a hint of depth without full fill. Mixing Outlined for inactive and Filled for active is the pattern Google's own products use."]
    ]
  },
  remix: {
    about: [
      "Remix Icon is a neutral-style system icon set maintained by Remix Design, organised across 25 categories. Its 3,244 icons are drawn on a 24×24 grid with a 1.5px stroke — noticeably lighter than the 2px default of <a href=\"/library/lucide/\">Lucide</a> or <a href=\"/library/tabler/\">Tabler</a>, which gives the set a more refined, technical feel.",
      "Nearly every icon ships in both line and fill variants from the same package, so indicating selected state never requires a second library. The neutral styling is deliberate: Remix is designed to sit inside an existing design system rather than impose a look of its own."
    ],
    fit: "Products that already have a strong visual identity and need icons that adapt to it. The lighter stroke and neutral construction make Remix easy to pair with custom typography and colour systems.",
    alt: "If you want a heavier, more characterful outline, <a href=\"/library/lucide/\">Lucide</a> and <a href=\"/library/tabler/\">Tabler</a> read bolder. For more than two variants per icon, <a href=\"/library/phosphor/\">Phosphor</a> and <a href=\"/library/solar/\">Solar</a> go further.",
    lic: "Apache 2.0. Commercial use is permitted and the license includes an express patent grant. Attribution is not required but is welcomed by the maintainers.",
    peers: ["lucide", "tabler", "mingcute", "iconoir"],
    faq: [
      ["Do Remix icons come in filled variants?",
        "Yes. Almost every icon in the set has both a line and a fill version shipped in the same package, which makes it straightforward to show active states. On IconStash both variants are indexed, so searching a concept returns the line and fill forms side by side."],
      ["What stroke weight does Remix Icon use?",
        "Remix uses a 1.5px stroke on a 24×24 grid, lighter than the 2px used by most outline libraries. That makes the icons feel more precise at small sizes but slightly more delicate at display sizes — if you plan to render icons above 48px, consider a heavier set or increase the stroke on export."]
    ]
  },
  iconoir: {
    about: [
      "Iconoir started as one designer's answer to a simple frustration: good icon libraries kept gating the useful icons behind a paid tier. The set is 2,020 icons on a 24×24 grid with a 1.5px stroke, and there is no premium version — every icon is free, forever.",
      "The library is community-driven with a public icon request process, and new icons are added continuously based on what people actually ask for. The result is a set that covers unusual, specific concepts — the kind of icon you would otherwise have to draw yourself."
    ],
    fit: "Side projects, startups, and open-source tools that need breadth without a licensing conversation. Iconoir is a reliable default when you do not yet know which icons you will need.",
    alt: "<a href=\"/library/lucide/\">Lucide</a> has stronger governance and a larger community; <a href=\"/library/tabler/\">Tabler</a> has roughly triple the icon count. Iconoir's advantage is that nothing is ever paywalled.",
    lic: "MIT, with no premium tier at any size. Commercial use, modification, and redistribution are all permitted without attribution.",
    peers: ["lucide", "feather", "tabler", "radix"],
    faq: [
      ["Is Iconoir completely free?",
        "Yes. Iconoir has no pro tier, no paywalled icons, and no usage restrictions beyond the MIT license. This is unusual — most icon libraries of comparable size reserve a portion of the set for paying customers, which is the specific problem Iconoir was created to avoid."],
      ["How does Iconoir handle icon requests?",
        "Icon requests are handled publicly through the project's issue tracker, and accepted requests are added to the library in subsequent releases. Because the set grows from real requests, it covers many niche concepts that larger, more curated libraries skip."]
    ]
  },
  heroicons: {
    about: [
      "Heroicons is made by the team behind Tailwind CSS, and it is designed to drop straight into Tailwind projects. The 1,297 icons ship in outline and solid variants, each available at 16px, 20px, and 24px — three sizes that are drawn separately rather than scaled, so optical weight stays correct at each one.",
      "Because the same team maintains both, the icon components accept Tailwind utility classes directly. Sizing and colouring an icon is <code>className=\"size-6 text-slate-500\"</code> rather than a set of custom props, which is a genuine productivity difference if you already work in Tailwind."
    ],
    fit: "Tailwind CSS projects of any size, and teams that want their icons styled with the same utilities as the rest of their markup. The three drawn sizes also make Heroicons a good fit for interfaces with a strict type and spacing scale.",
    alt: "Outside the Tailwind ecosystem the utility-class ergonomics matter less, and <a href=\"/library/lucide/\">Lucide</a> or <a href=\"/library/tabler/\">Tabler</a> give you more icons. For dense 15px-scale interfaces, <a href=\"/library/radix/\">Radix Icons</a> is drawn specifically for that.",
    lic: "MIT. Both outline and solid sets, at all three sizes, are free for commercial use without attribution.",
    peers: ["lucide", "radix", "feather", "tabler"],
    faq: [
      ["What sizes do Heroicons come in?",
        "16px, 20px, and 24px, and they are drawn separately at each size rather than scaled from one master. A 16px Heroicon has slightly heavier strokes and simplified detail compared to the 24px version of the same icon, which is why it stays legible when scaled down."],
      ["Do I need Tailwind CSS to use Heroicons?",
        "No. Heroicons ships as plain SVG and as React and Vue component packages, and the components accept standard size and colour props alongside className. The Tailwind integration is a convenience, not a requirement — the icons work in any framework or in raw HTML."]
    ]
  },
  bootstrap: {
    about: [
      "Bootstrap Icons is the official icon set for the Bootstrap framework, built by the Bootstrap team. The 2,090 icons are drawn on a 16×16 grid — tighter than the 24×24 used by most libraries — which makes them pair naturally with Bootstrap's default typography and compact control sizing.",
      "The set deliberately spans multiple treatments: some icons are filled, some are outline, and some mix both within a single glyph. That is a conscious trade-off. Bootstrap optimised for immediate legibility at small sizes rather than strict stylistic uniformity across the set."
    ],
    fit: "Bootstrap-based projects, admin templates, and compact interfaces where icons sit next to 14px text and need to hold their own at 16px.",
    alt: "If you need strict visual consistency, the mixed fill and stroke treatment can look uneven next to <a href=\"/library/lucide/\">Lucide</a> or <a href=\"/library/feather/\">Feather</a>. For a larger set with similar small-size optimisation, compare <a href=\"/library/octicons/\">Octicons</a>.",
    lic: "MIT. The full set is free for commercial use, including the bundled brand and logo icons.",
    peers: ["feather", "lucide", "boxicons", "tabler"],
    faq: [
      ["Why is the Bootstrap Icons grid 16×16 instead of 24×24?",
        "Bootstrap Icons was designed to sit inline with Bootstrap's default text sizes, where a 24px icon would overwhelm 14px type. Drawing on a 16×16 grid keeps the icons optically matched to compact controls and labels. You can scale them to any size — they are vector — but the detail level is tuned for small rendering."],
      ["Are Bootstrap Icons stylistically consistent?",
        "Less so than most sets, by design. Bootstrap mixes filled, outline, and combined treatments across the library, optimising each icon for clarity at 16px rather than enforcing one stroke style. If you need a strictly uniform set, Lucide or Feather will look more coherent."]
    ]
  },
  feather: {
    about: [
      "Feather Icons is the library that defined the modern minimal outline icon. Created by Cole Bemis in 2017, its 286 icons are drawn on a 24×24 grid with a 2px stroke, rounded joins, and no fill — a formula that an entire generation of icon libraries has since copied.",
      "The deliberately small count is the point. Feather covers only the icons almost every interface needs, which means picking an icon takes seconds and the result always looks consistent. Development on the original project has slowed, but the set remains one of the most forked icon repositories on GitHub and is still a sound choice for small projects."
    ],
    fit: "Landing pages, portfolios, marketing sites, and small apps where you need perhaps thirty icons and want them to look calm and deliberate. Feather is also a good teaching reference for icon grid discipline.",
    alt: "For an actively maintained superset with the same aesthetic, use <a href=\"/library/lucide/\">Lucide</a> — it began as a Feather fork and now has 1,979 icons. <a href=\"/library/iconoir/\">Iconoir</a> is another minimalist option with far more coverage.",
    lic: "MIT. Free for commercial and personal use, modification, and redistribution, with no attribution required.",
    peers: ["lucide", "iconoir", "heroicons", "radix"],
    faq: [
      ["Is Feather Icons still maintained?",
        "Development on the original project has slowed considerably since 2020, and new icons are added only rarely. The set remains stable and fully usable, and it is still one of the most forked icon repositories on GitHub — but if you need active maintenance and regular additions, use <a href=\"/library/lucide/\">Lucide</a>, which began as a Feather fork and now ships 1,979 icons on the same design principles."],
      ["Why does Feather only have 286 icons?",
        "The small count is a deliberate constraint. Feather aims to cover only the icons that nearly every interface needs, which keeps the set fast to choose from and impossible to make look inconsistent. If your project outgrows 286 icons, Lucide is the natural upgrade path — it started as a Feather fork and kept the same design language."]
    ]
  },
  mingcute: {
    about: [
      "MingCute is a modern icon set of 3,352 icons from the team behind the MingCute design resources. Every icon ships in both line and filled variants, drawn on a 24×24 grid with rounded terminals and a slightly softened geometry that reads as contemporary rather than austere.",
      "The set is particularly strong on everyday product concepts — settings, social, media, and commerce — and the line and fill pairs are drawn to align precisely, so switching between them for active states never shifts the icon's optical position."
    ],
    fit: "Consumer apps, mobile interfaces, and products that want a friendly, rounded icon language without the strict geometry of Material or Carbon.",
    alt: "For more variant styles per icon, <a href=\"/library/solar/\">Solar</a> and <a href=\"/library/hugeicons/\">Huge Icons</a> offer six. For a more neutral, system-level look, <a href=\"/library/remix/\">Remix Icon</a> is the closer match.",
    lic: "Apache 2.0, including an express patent grant. Commercial use is permitted without attribution.",
    peers: ["remix", "solar", "hugeicons", "iconoir"],
    faq: [
      ["Does MingCute include filled versions of every icon?",
        "The large majority of the set ships in both line and filled form, though coverage is not absolutely complete across all 3,352 icons. The two variants are drawn to the same optical bounds, so toggling between them for hover or active state will not shift your layout."],
      ["How does MingCute compare to Remix Icon?",
        "Both ship line and fill variants on a 24×24 grid. MingCute uses rounded terminals and a softer, slightly more playful geometry; Remix uses a lighter 1.5px stroke and a more neutral, technical construction. MingCute suits consumer products, Remix suits tools and dashboards."]
    ]
  },
  solar: {
    about: [
      "Solar is a premium-feeling icon pack of 7,410 icons from 480 Design, and it is one of the most widely used sets in SaaS and mobile product design. Every icon comes in six styles: Linear, Outline, Bold, Duotone, Broken, and Bold Duotone.",
      "The Bold Duotone style in particular has become a signature look in modern dashboard design — a heavy primary form with a lighter secondary pass that adds depth without full colour. Broken, which deliberately gaps the stroke, is useful for a distinctive, slightly technical feel."
    ],
    fit: "SaaS dashboards, admin templates, and marketing sites that want a premium, contemporary look rather than a neutral system feel. Duotone styles work especially well in empty states and feature cards.",
    alt: "Solar is CC BY 4.0, so it requires attribution — if that is a problem, <a href=\"/library/phosphor/\">Phosphor</a> (MIT) offers a comparable six-weight range and <a href=\"/library/hugeicons/\">Huge Icons</a> (MIT) offers six styles of its own.",
    lic: "CC BY 4.0. Free for commercial use, but attribution to 480 Design is required. If you cannot provide credit, use an MIT-licensed alternative such as Phosphor or Huge Icons.",
    peers: ["phosphor", "hugeicons", "remix", "fluent"],
    faq: [
      ["Do I have to credit Solar Icons?",
        "Yes. Solar is released under CC BY 4.0, which permits commercial use and modification but requires attribution to 480 Design. Most products satisfy this with a line in the footer, an about page, or the project README. If attribution is not practical for your product, choose an MIT or Apache 2.0 library instead."],
      ["What does the Broken style look like?",
        "Broken deliberately gaps each icon's stroke at one or more points, giving a lighter, more technical appearance than a continuous outline. It works well for secondary navigation and decorative use, but reads as less solid than Outline or Bold for primary actions."]
    ]
  },
  octicons: {
    about: [
      "Octicons is GitHub's design-system icon library, and it has been shaped by a decade of real use across github.com, GitHub Desktop, GitHub Mobile, and GitHub Docs. The 929 icons are drawn on a 16×16 grid, matching the compact density of GitHub's own interface.",
      "Because the set was built for a product with enormous interface surface area, it is unusually strong on development and collaboration concepts — repositories, pull requests, issues, branches, merges, and CI states are all covered in depth. GitHub also maintains strict contribution guidelines, so the icons are visually tight."
    ],
    fit: "Developer tools, code hosting, CI dashboards, and any product whose users are software engineers. The vocabulary of Octicons is already familiar to anyone who uses GitHub daily.",
    alt: "For products that are not developer-focused, <a href=\"/library/lucide/\">Lucide</a> or <a href=\"/library/heroicons/\">Heroicons</a> offer broader general-purpose coverage. For enterprise design systems, <a href=\"/library/carbon/\">Carbon</a> and <a href=\"/library/fluent/\">Fluent UI</a> are the closer peers.",
    lic: "MIT. The full set, including the GitHub-specific mark-like icons, is free for commercial use. Note GitHub's trademark policy still applies to the GitHub logo itself.",
    peers: ["carbon", "fluent", "radix", "lucide"],
    faq: [
      ["Are Octicons free to use outside GitHub projects?",
        "Yes. Octicons are MIT licensed and free for commercial use in any product. The MIT license covers the icon drawings; GitHub's trademark and logo policy is separate and applies to the GitHub logo mark itself rather than to the general icon set."],
      ["Why is the Octicons grid 16×16?",
        "GitHub's interface is dense, with icons sitting inline beside small text in file trees, diff views, and issue lists. A 16×16 grid keeps the icons optically matched to that density. They scale cleanly as vectors, but the level of detail is tuned for small sizes."]
    ]
  },
  cssgg: {
    about: [
      "css.gg takes a different approach from every other library here: each of its 705 icons is a single, self-contained CSS file. There is no SVG sprite, no icon font, and no JavaScript — you add the icon with a class name and the glyph is drawn entirely in CSS.",
      "That has real practical benefits. Icons can be styled with ordinary CSS properties, animate with transitions, and inherit colour automatically, all without shipping a second asset format. css.gg also publishes SVG and React versions of every icon, so you are not locked into the CSS approach."
    ],
    fit: "Projects that want zero-dependency icons, CSS-only prototypes, and interfaces where icons need to animate or respond to CSS state without JavaScript.",
    alt: "If you want a much larger set, <a href=\"/library/lucide/\">Lucide</a> and <a href=\"/library/tabler/\">Tabler</a> cover far more ground. CSS-drawn icons are also less suited to very large display sizes, where vector libraries hold up better.",
    lic: "MIT. Every icon, in all three formats (CSS, SVG, React), is free for commercial use without attribution.",
    peers: ["feather", "lucide", "radix", "pixelarticons"],
    faq: [
      ["How do I add a css.gg icon to a page?",
        "Include the icon's CSS file and add the matching class to an element — for example <code>&lt;i class=\"gg-home\"&gt;&lt;/i&gt;</code>. The glyph is drawn with CSS pseudo-elements, so no image request is made. IconStash shows the exact class name and import line for every icon in the Code tab."],
      ["Are CSS-drawn icons worse for performance?",
        "Usually not. A css.gg icon is a small stylesheet rule with no network request for image assets, and it scales and recolours with plain CSS. Trade-offs appear in complexity: very intricate glyphs are harder to express in CSS, which is partly why the set is 705 icons rather than several thousand."]
    ]
  },
  radix: {
    about: [
      "Radix Icons is a deliberately small set of 345 icons from the Radix UI team, drawn on a 15×15 grid. That grid is the whole point: Radix icons are designed to sit inside dense product interfaces — tables, toolbars, context menus, and form controls — where a 24×24 icon would force you to loosen your spacing.",
      "The icons are pixel-snapped to the 15×15 grid, so they render crisply at their intended size without the blurring that comes from scaling a 24px drawing down to 15px. They are built to sit next to Radix Primitives, but they are plain SVG components and work anywhere."
    ],
    fit: "Dense product UI: data tables, command palettes, context menus, settings panels, and anywhere you need an icon to occupy as little space as possible while staying legible.",
    alt: "The 345-icon count is small, so you will hit gaps quickly in a large product. <a href=\"/library/heroicons/\">Heroicons</a> also ships a drawn 16px size with many more icons; <a href=\"/library/lucide/\">Lucide</a> covers far more concepts at 24×24.",
    lic: "MIT. The full set is free for commercial use, including inside proprietary products, with no attribution required.",
    peers: ["heroicons", "lucide", "octicons", "feather"],
    faq: [
      ["Why is the Radix Icons grid 15×15?",
        "Because the set is built for dense product interfaces where icons sit inside 20–24px hit targets alongside small text. Drawing at 15×15 rather than scaling a 24×24 icon down keeps every stroke on a pixel boundary, so the icons stay crisp at the size they are actually used."],
      ["Do I need to use Radix Primitives to use these icons?",
        "No. Radix Icons ship as standalone React components and plain SVG, and they work in any framework or in raw HTML. They were designed to sit comfortably beside Radix Primitives components, but there is no dependency in either direction."]
    ]
  },
  antdesign: {
    about: [
      "Ant Design Icons is the official icon set for Ant Design, the enterprise React UI framework maintained by Ant Group and widely used across Chinese enterprise software. The 1,870 icons ship in three styles: Outlined, Filled, and TwoTone.",
      "The TwoTone style is the notable one — each icon carries a primary form plus a secondary pass at lower opacity, and the secondary colour can be themed independently at runtime. That makes it straightforward to match icons to a brand palette without exporting new files."
    ],
    fit: "Enterprise React applications, internal admin systems, and B2B products — particularly those already using Ant Design components, where the icons inherit theme tokens automatically.",
    alt: "Outside the Ant Design ecosystem the icons still work, but <a href=\"/library/fluent/\">Fluent UI</a> and <a href=\"/library/carbon/\">Carbon</a> are the comparable enterprise sets with much larger counts. For lighter-weight general use, <a href=\"/library/lucide/\">Lucide</a> is simpler.",
    lic: "MIT. All three styles are free for commercial use without attribution.",
    peers: ["carbon", "fluent", "materialsymbols", "iconparkoutline"],
    faq: [
      ["What is the TwoTone style in Ant Design Icons?",
        "TwoTone draws each icon with two colour passes: a primary form and a secondary form at lower opacity. Both can be themed independently, so you can match icons to a brand palette at runtime rather than exporting recoloured assets. It is a good fit for enterprise products with strict colour requirements."],
      ["Do Ant Design Icons require the Ant Design framework?",
        "No. They ship as a standalone React package and as SVG, usable in any project. If you do use Ant Design, the icons pick up theme tokens automatically — but that integration is a convenience, not a requirement."]
    ]
  },
  fluent: {
    about: [
      "Fluent UI Icons is Microsoft's icon library for the Fluent Design System, and at 20,170 icons it is the largest set indexed on IconStash. The icons are drawn across multiple sizes from 12px to 48px and in Regular and Filled styles.",
      "The multi-size approach is unusual and practical: rather than scaling one drawing, Microsoft draws simplified variants for small sizes and more detailed variants for large ones. A 16px Fluent icon has less internal detail than the 48px version of the same concept, which is why it stays readable across the whole range."
    ],
    fit: "Enterprise applications, Microsoft 365 integrations, and products that already follow Fluent or need extremely broad coverage. The count alone means you will rarely need to look elsewhere.",
    alt: "The size is also a drawback — with 20,170 icons, maintaining visual consistency across a product takes more discipline. <a href=\"/library/lucide/\">Lucide</a> and <a href=\"/library/heroicons/\">Heroicons</a> are far easier to keep coherent.",
    lic: "MIT. The full set across all sizes and styles is free for commercial use. Microsoft's trademark policy applies separately to the Microsoft and Office logos.",
    peers: ["carbon", "materialsymbols", "antdesign", "ionicons"],
    faq: [
      ["Why are Fluent icons drawn at multiple sizes?",
        "An icon that reads well at 48px usually turns to mush at 16px, and one tuned for 16px looks sparse when scaled up. Fluent solves this by drawing size-specific variants with different detail levels, so the same concept stays legible from 12px to 48px instead of being scaled from a single master."],
      ["Is Fluent UI Icons too large for a small project?",
        "Probably. Twenty thousand icons is a huge amount of surface area, and keeping a small product visually consistent is harder when the library offers so much choice. For smaller projects, a curated set like Lucide or Heroicons usually produces a tighter result with less effort."]
    ]
  },
  carbon: {
    about: [
      "Carbon Icons is IBM's open-source icon library, built as part of the Carbon Design System. The 2,644 icons are drawn on a 32×32 grid — significantly larger than the 24×24 most libraries use — which gives the set a slightly more generous, open feel and room for finer internal detail.",
      "IBM maintains the set to enterprise standards, with strict contribution review and a strong emphasis on accessibility and international neutrality. The icons avoid culture-specific metaphors wherever a neutral alternative exists, which matters for products shipping globally."
    ],
    fit: "Enterprise software, data and analytics platforms, and products that need to satisfy accessibility review and ship in multiple locales.",
    alt: "For a lighter, more contemporary feel, <a href=\"/library/lucide/\">Lucide</a> and <a href=\"/library/tabler/\">Tabler</a> are easier to work with. <a href=\"/library/fluent/\">Fluent UI</a> is the other major enterprise set, with far more icons.",
    lic: "Apache 2.0 with an express patent grant. Free for commercial use; IBM asks that you not use the icons in a way that implies IBM endorsement.",
    peers: ["fluent", "antdesign", "materialsymbols", "octicons"],
    faq: [
      ["Why is the Carbon grid 32×32?",
        "Carbon's grid gives each icon more internal room than the common 24×24, which suits the data-dense enterprise interfaces IBM builds — charts, tables, and instrumentation panels where icons carry fine detail. The icons scale down cleanly, but their detail level is tuned for clarity rather than minimalism."],
      ["Are Carbon Icons accessible by default?",
        "Carbon is maintained with accessibility as a design constraint rather than an afterthought, and the set avoids culture-specific metaphors where a neutral alternative exists. That said, accessibility still depends on how you implement icons — decorative icons should be hidden from assistive technology and meaningful ones need accessible labels."]
    ]
  },
  ionicons: {
    about: [
      "Ionicons was built for the Ionic Framework and has been refined since 2013, which makes it one of the longest-maintained icon sets here. The 2,607 icons ship in three variants — Outline, Filled, and Sharp — each drawn on a 24×24 grid.",
      "The Sharp variant is what distinguishes it: squarer terminals and tighter corners than the rounded default, which gives interfaces a crisper, more technical character. Having three variants of each icon means you can express hierarchy and state without mixing libraries."
    ],
    fit: "Mobile and hybrid apps, cross-platform products, and interfaces that want three clear icon variants from one consistent source.",
    alt: "For a more modern, minimal aesthetic, <a href=\"/library/lucide/\">Lucide</a> and <a href=\"/library/heroicons/\">Heroicons</a> are the current defaults. <a href=\"/library/material/\">Material Design Icons</a> offers five themes if you need more range.",
    lic: "MIT. All three variants are free for commercial use without attribution.",
    peers: ["material", "boxicons", "remix", "eva"],
    faq: [
      ["What is the Sharp variant in Ionicons?",
        "Sharp uses squared terminals and tighter corner radii instead of the rounded ends used by the Outline and Filled variants. The result reads as crisper and more technical, and it holds up well at small sizes where rounded terminals can look soft. All three variants share the same 24×24 grid and optical weight."],
      ["Do Ionicons require the Ionic Framework?",
        "No. Ionicons ships as a web component, as plain SVG, and as React and Vue packages, and it works in any framework. The Ionic integration is convenient but optional — the icons are standard SVG assets underneath."]
    ]
  },
  eva: {
    about: [
      "Eva Icons is a compact set of 490 icons from Akveo, the team behind the Nebular UI kit. Every icon ships in both Fill and Outline variants on a consistent 24×24 grid, with a slightly rounded, friendly construction that sits between Feather's austerity and Material's geometry.",
      "Four hundred and ninety icons is small by the standards of this list, but it is curated rather than truncated — the set focuses on the actions and objects that appear in almost every application, and it covers them completely in both styles."
    ],
    fit: "Small to medium applications, prototypes, and products where you want a complete fill-and-outline pair set without sorting through thousands of options.",
    alt: "You will outgrow 490 icons in a large product. <a href=\"/library/boxicons/\">Boxicons</a> and <a href=\"/library/remix/\">Remix Icon</a> offer similar fill-plus-outline coverage at much larger scale.",
    lic: "MIT. Both Fill and Outline variants are free for commercial use with no attribution required.",
    peers: ["heroicons", "feather", "lucide", "boxicons"],
    faq: [
      ["Does every Eva icon have a filled version?",
        "Yes. All 490 icons ship in both Fill and Outline form, which makes Eva one of the smaller libraries with complete variant coverage. In practice that means you can express selected, active, and hover states without ever reaching for a second icon set."],
      ["Is 490 icons enough for a real product?",
        "For most small and medium applications, yes — the set is curated around the actions and objects that actually appear in product UI. For large enterprise products, or anything with domain-specific concepts, you will hit gaps and should consider Remix Icon or Boxicons instead."]
    ]
  },
  boxicons: {
    about: [
      "Boxicons is a long-running free icon pack by Atisa, with 3,389 icons across three families: Regular (outline), Solid (filled), and Logos. The logo set is a significant part of the appeal — hundreds of brand marks maintained alongside the UI icons.",
      "The Regular and Solid families mirror each other, so an icon's outline and filled forms have the same optical footprint. The set is drawn on a 24×24 grid with a slightly heavier, rounder construction than the minimal outline libraries, which makes it read clearly even at small sizes."
    ],
    fit: "Websites and apps that need UI icons and brand logos from one package — particularly portfolios, link-in-bio pages, tech stack sections, and footers.",
    alt: "For pure brand logos with a cleaner license, <a href=\"/library/simpleicons/\">Simple Icons</a> is CC0 and has 3,714 marks. For UI icons alone, <a href=\"/library/remix/\">Remix Icon</a> and <a href=\"/library/tabler/\">Tabler</a> are more consistent.",
    lic: "MIT for the icon set. Brand logos are trademarks of their respective owners — using them to represent the brand is generally fine, but do not use them to imply endorsement.",
    peers: ["remix", "ionicons", "tabler", "eva"],
    faq: [
      ["Does Boxicons include brand logos?",
        "Yes — the Logos family contains hundreds of brand marks maintained alongside the Regular and Solid UI icon sets. It is convenient for tech stack sections, footers, and social links. Remember that brand logos remain trademarks of their owners regardless of the icon license."],
      ["What is the difference between Boxicons Regular and Solid?",
        "Regular is the outline family and Solid is the filled family. They are drawn to the same optical footprint, so toggling between them for hover or active state does not shift your layout. Logos is a third, separate family of brand marks with a different visual treatment."]
    ]
  },
  materialsymbols: {
    about: [
      "Material Symbols is Google's current icon format and the successor to Material Icons. It is built on variable font technology: all 18,547 icons live in a single font file, and four axes — Weight, Fill, Grade, and Optical Size — can be adjusted continuously rather than by swapping between five static themes.",
      "The practical effect is that one file replaces what used to require five separate icon sets. You can set weight from 100 to 700, animate the Fill axis to transition an icon from outline to solid, and tune optical size so icons stay balanced from 20px to 48px."
    ],
    fit: "Products that want continuous control over icon weight and fill state, and teams that would rather ship one font file than manage five icon sets.",
    alt: "If you need individually imported SVG components with tree-shaking, the older <a href=\"/library/material/\">Material Icons</a> set or <a href=\"/library/lucide/\">Lucide</a> is a better fit — a variable font loads all 18,547 glyphs even if you use thirty of them.",
    lic: "Apache 2.0 with an express patent grant. Free for commercial use. You may not use the icons to imply Google endorsement.",
    peers: ["material", "materialsymbolslight", "fluent", "carbon"],
    faq: [
      ["What are the four Material Symbols axes?",
        "Weight (100–700) controls stroke thickness, Fill (0–1) animates an icon from outline to solid, Grade adjusts weight in finer increments without changing icon width, and Optical Size (20–48) optimises the drawing for the size you are rendering at. The Fill axis is particularly useful because it can be transitioned in CSS."],
      ["Should I use Material Symbols or Material Icons?",
        "Use Material Symbols if you want continuous weight and fill control from a single file and are comfortable with a font-based approach. Use Material Icons if you need individually imported, tree-shakeable SVG components, or if your tooling handles SVG more naturally than variable fonts."]
    ]
  },
  materialsymbolslight: {
    about: [
      "Material Symbols Light is the 300-weight cut of Google's Material Symbols, containing 15,969 icons. It takes the variable-font icon system and fixes the weight at its light end, producing a set tuned for interfaces where a standard-weight icon would look heavy.",
      "Light-weight icons work particularly well on large type, in spacious layouts, and in products with an editorial or premium feel. They are less suited to dense toolbars and small text, where thin strokes lose contrast against the background."
    ],
    fit: "Marketing sites, editorial layouts, premium SaaS products, and any interface with generous spacing and larger type where a lighter icon weight looks more refined.",
    alt: "If you want the full weight range rather than a single light cut, use <a href=\"/library/materialsymbols/\">Material Symbols</a> and set the Weight axis yourself. For dense interfaces, the standard <a href=\"/library/material/\">Material Icons</a> weight holds up better.",
    lic: "Apache 2.0 with an express patent grant. Free for commercial use; the icons should not be used to imply Google endorsement.",
    peers: ["materialsymbols", "material", "hugeicons", "iconoir"],
    faq: [
      ["When should I use light-weight icons?",
        "When your interface has generous spacing, larger type, and a calm visual tone — light icons look refined there and heavy icons look clumsy. Avoid them in dense toolbars, small tables, or anywhere icons sit beside 12–13px text, because thin strokes lose contrast and become hard to scan."],
      ["How is Symbols Light different from Material Symbols?",
        "Symbols Light is the 300-weight rendering of the Material Symbols set, fixed at one weight and containing 15,969 icons. Full Material Symbols gives you the same icons as a variable font with a Weight axis you can set anywhere from 100 to 700 — use that if you need flexibility rather than one specific weight."]
    ]
  },
  iconparkoutline: {
    about: [
      "IconPark Outline is ByteDance's open-source icon library, built around an unusual idea: each icon exposes multiple theme properties — outline, fill, two-tone, and multi-colour — from a single component, with colours configurable at runtime rather than baked into the asset.",
      "The 2,658 outline icons are drawn on a 24×24 grid with a clean, slightly rounded construction. What distinguishes IconPark is the component API: you can switch an icon between outline, filled, two-tone, and four-colour treatments with a prop, and set each colour independently."
    ],
    fit: "Products that need colour-configurable icons from a single asset, and teams using IconPark's React, Vue, or Svelte component packages.",
    alt: "If you only need static SVG, the component-based theming is unused complexity and <a href=\"/library/lucide/\">Lucide</a> is simpler. For filled icons, use the sibling <a href=\"/library/iconparksolid/\">IconPark Solid</a> set.",
    lic: "Apache 2.0 with an express patent grant. Free for commercial use without attribution.",
    peers: ["iconparksolid", "antdesign", "remix", "mingcute"],
    faq: [
      ["What icon themes does IconPark support?",
        "Four: outline, filled, two-tone, and multi-colour. Each is available from the same component via a theme prop, and the colours used by two-tone and multi-colour modes can be set independently at runtime. That means one imported icon can serve as an outline in one context and a coloured glyph in another."],
      ["How does IconPark Outline differ from IconPark Solid?",
        "Outline is the 2,658-icon stroke-based set; Solid is the 1,970-icon filled set. They share the same component API, grid, and theming system, so you can mix them in one project without visual clash — use Outline for default state and Solid for active or selected state."]
    ]
  },
  iconparksolid: {
    about: [
      "IconPark Solid is the filled counterpart to ByteDance's IconPark Outline, with 1,970 solid-style icons on the same 24×24 grid and the same component API. Both sets are themeable at runtime and support multi-colour configuration.",
      "Filled icons carry more visual weight than outlines, which makes them the standard choice for active navigation items, selected filters, and primary calls to action. Pairing Solid for active state with Outline for default state is the intended usage pattern across the two IconPark sets."
    ],
    fit: "Active and selected states in navigation, filters, and tab bars — particularly in products already using IconPark Outline for default state.",
    alt: "For a much larger filled set, <a href=\"/library/material/\">Material Design Icons</a> ships a full Filled theme and <a href=\"/library/simpleicons/\">Simple Icons</a> is entirely solid. For filled icons with more style range, compare <a href=\"/library/phosphor/\">Phosphor</a>.",
    lic: "Apache 2.0 with an express patent grant. Free for commercial use without attribution.",
    peers: ["iconparkoutline", "material", "boxicons", "simpleicons"],
    faq: [
      ["When should I use filled icons instead of outline?",
        "For active navigation, selected filters, current tab indicators, and primary actions — anywhere you need the icon to read as engaged rather than available. Filled icons occupy more visual weight, so using them everywhere tends to make an interface feel heavy. Outline for default, filled for active is the usual pattern."],
      ["Can I mix IconPark Solid and IconPark Outline?",
        "Yes, and it is the intended pattern. Both sets share the same 24×24 grid, component API, and theming system, so an outline icon and its solid counterpart have matching optical bounds and will not shift your layout when the state changes."]
    ]
  },
  hugeicons: {
    about: [
      "Huge Icons is a professional icon set of 5,115 icons in six styles: Stroke, Duotone, Solid, Bulk, Twotone, and Sharp Stroke. It is designed specifically for product interfaces and has become a common choice for modern SaaS dashboards.",
      "The Bulk style is the distinguishing one — a heavy, high-contrast treatment with layered weight that reads almost as a small illustration. That makes it effective for empty states, feature cards, and onboarding screens where a plain outline would disappear."
    ],
    fit: "SaaS products, dashboards, and marketing sites that want a premium, contemporary icon language with enough style range to carry different levels of visual emphasis.",
    alt: "<a href=\"/library/solar/\">Solar</a> offers a comparable six-style range but is CC BY 4.0 and requires attribution, whereas Huge Icons is MIT. For a neutral system feel, <a href=\"/library/lucide/\">Lucide</a> remains the simpler default.",
    lic: "MIT. All six styles are free for commercial use with no attribution required, which is a meaningful advantage over similarly styled premium packs.",
    peers: ["solar", "phosphor", "remix", "mingcute"],
    faq: [
      ["What is the Bulk style in Huge Icons?",
        "Bulk is the heaviest treatment in the set: a high-contrast, layered style where part of the icon carries full weight and part sits lighter behind it. It reads almost like a small illustration, which makes it effective for empty states, feature cards, and onboarding — and too heavy for dense toolbars."],
      ["How does Huge Icons compare to Solar?",
        "Both offer six styles and a premium, contemporary look aimed at SaaS products. The meaningful difference is licensing: Huge Icons is MIT with no attribution required, while Solar is CC BY 4.0 and does require credit. If attribution is impractical for your product, Huge Icons is the safer choice."]
    ]
  },
  pixelarticons: {
    about: [
      "Pixel Art Icons is exactly what it sounds like: 1,099 icons drawn on a strict pixel grid, so every stroke lands on a whole pixel and the result has the hard-edged, aliased character of classic 8-bit and 16-bit game art.",
      "The set is drawn on a 24×24 grid with each pixel treated as a discrete unit, rather than as vector paths that happen to look blocky. That distinction matters — scaled up, the icons keep their crisp stair-stepped edges instead of softening, because the geometry is genuinely pixel-based."
    ],
    fit: "Games, retro-styled interfaces, creative portfolios, streaming overlays, and any project that wants deliberate nostalgia rather than a modern flat look.",
    alt: "Pixel icons will look out of place in a conventional product interface. For general use, <a href=\"/library/lucide/\">Lucide</a>, <a href=\"/library/heroicons/\">Heroicons</a>, or <a href=\"/library/remix/\">Remix Icon</a> are the appropriate choices.",
    lic: "MIT. The full set is free for commercial use, including in commercial games, with no attribution required.",
    peers: ["cssgg", "feather", "linemd", "simpleicons"],
    faq: [
      ["Do pixel icons scale well?",
        "They scale, but they are intended to look pixelated — the geometry is genuinely grid-based, so edges stay hard instead of smoothing out. Render them at integer multiples (24px, 48px, 72px) and disable image smoothing in CSS with image-rendering: pixelated to keep the edges crisp at large sizes."],
      ["Can I use Pixel Art Icons in a commercial game?",
        "Yes. The set is MIT licensed, which permits commercial use, modification, and distribution without attribution. You can recolour and edit the icons to match your game's palette as needed."]
    ]
  },
  linemd: {
    about: [
      "Line MD is a set of 1,279 animated SVG icons built around smooth path animation. Each icon animates its own stroke — drawing on, looping, or transitioning between states — using SVG and CSS, with no JavaScript required.",
      "The set is aimed squarely at interface feedback: loading spinners, upload and download progress, success and error transitions, and onboarding flourishes. Because the animation is native SVG, icons stay lightweight and can be recoloured and resized like any other vector."
    ],
    fit: "Loading states, form submission feedback, onboarding flows, empty states, and anywhere a static icon feels dead.",
    alt: "Animated icons are inappropriate for navigation and dense UI, where motion becomes distracting — use <a href=\"/library/lucide/\">Lucide</a> or <a href=\"/library/heroicons/\">Heroicons</a> for those. Line MD is a complement to a static set, not a replacement.",
    lic: "MIT. The full set, including the animations, is free for commercial use without attribution.",
    peers: ["lucide", "pixelarticons", "heroicons", "cssgg"],
    faq: [
      ["Do Line MD icons need JavaScript to animate?",
        "No. The animations are built from SVG path animation and CSS, so they run without any JavaScript. That keeps them lightweight and means they work in contexts where scripting is restricted, such as email templates or sandboxed embeds."],
      ["Should I use animated icons throughout my interface?",
        "No. Animation draws the eye, so it works for feedback and state changes — loading, success, error, progress — and becomes distracting when applied to navigation or dense toolbars. A good pattern is a static set like Lucide for structure and Line MD for moments of feedback. Remember to respect prefers-reduced-motion."]
    ]
  },
  simpleicons: {
    about: [
      "Simple Icons is the definitive source for brand logos in a developer-friendly format: 3,714 single-colour SVG marks covering technologies, platforms, companies, and products, maintained by a large open-source community.",
      "Every icon is a single-path, single-colour rendering of the brand mark, which makes them consistent in weight and trivial to recolour — ideal for tech stack sections, README badges, integration directories, and footer link rows. Brands are added and updated continuously as companies refresh their identities."
    ],
    fit: "Tech stack sections, integration directories, documentation, README files, and anywhere you need to represent third-party platforms consistently.",
    alt: "Brand logos are for representing brands, not for interface actions — use a UI library such as <a href=\"/library/lucide/\">Lucide</a> or <a href=\"/library/remix/\">Remix Icon</a> for those. <a href=\"/library/boxicons/\">Boxicons</a> also ships a logos family alongside its UI icons.",
    lic: "CC0 1.0 — effectively public domain, with no attribution requirement. Note that the underlying brand marks remain trademarks of their respective owners.",
    peers: ["boxicons", "ionicons", "octicons", "bootstrap"],
    faq: [
      ["Are Simple Icons free to use commercially?",
        "Yes. The icon files are released under CC0 1.0, which is effectively a public domain dedication with no attribution requirement. The underlying brand marks are still trademarks of their owners, so use them to identify the brand rather than to imply partnership or endorsement."],
      ["Why are Simple Icons single-colour?",
        "Single-colour, single-path renderings keep 3,714 brand marks visually consistent with each other and make them trivial to recolour with CSS. That consistency is why the set works so well in tech stack rows, where multi-colour logos of varying weights would look chaotic."]
    ]
  }
};

/* ────────────────────────────────────────────────────────────────────────────
   4. Helpers
   ──────────────────────────────────────────────────────────────────────────── */

const escapeHtml = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** Returns text preserving inline markup (links, code, formatting). */
function richText(s) {
  return String(s || "");
}

const pretty = (name) => String(name || "")
  .replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim()
  .replace(/\b\w/g, (c) => c.toUpperCase());

const brokenLinks = [];
const slugOk = (slug) => fs.existsSync(path.join(ICONS_DIR, slug, "index.html"));
const linkCache = new Map();

/** Emits a verified /icons/ link, or drops it and records the miss. */
function iconLink(slug, label, where) {
  if (!slug) return null;
  if (!linkCache.has(slug)) linkCache.set(slug, slugOk(slug));
  if (!linkCache.get(slug)) { brokenLinks.push(`${where}: /icons/${slug}/`); return null; }
  return `<a href="/icons/${encodeURI(slug)}/">${escapeHtml(label || pretty(slug))}</a>`;
}

function iconLinks(list, where) {
  const out = [];
  for (const [slug, label] of list) {
    const html = iconLink(slug, label, where);
    if (html) out.push(html);
  }
  return out;
}

const joinLinks = (arr) => arr.join(' <span aria-hidden="true">·</span> ');

/**
 * Picks real, verified icon rows for a hub.
 * Concept-first: matches the icon's base name against a concept list so hubs
 * lead with icons people actually search for, then fills from top-score.
 */
const CONCEPTS = ["home", "search", "settings", "user", "heart", "star", "cart", "bell", "mail",
  "calendar", "clock", "folder", "file", "download", "upload", "trash", "image", "video", "music",
  "camera", "lock", "cloud", "edit", "eye", "menu", "plus", "check", "phone", "map", "chart",
  "filter", "tag", "gift", "wallet", "shield", "key", "globe", "book", "link", "share"];

function pickFor(rows, { want = 8, concepts = CONCEPTS, exclude = new Set() } = {}) {
  const byConcept = new Map();
  const fallback = [];
  const sorted = rows.slice().sort((a, b) => (b.score || 0) - (a.score || 0));

  for (const row of sorted) {
    const meta = iconMeta.get(row.iconId);
    const base = String((meta && meta.name) || row.iconId).toLowerCase();
    // Prefer short slugs — they are the head terms and almost always the direct-id form.
    if (!concepts.includes(base)) continue;
    if (exclude.has(row.iconId)) continue;
    if (!byConcept.has(base)) byConcept.set(base, row);
  }
  const chosen = concepts.map((c) => byConcept.get(c)).filter(Boolean).slice(0, want);
  const picked = new Set(chosen.map((r) => r.iconId));

  if (chosen.length < want) {
    for (const row of sorted) {
      if (chosen.length >= want) break;
      if (picked.has(row.iconId) || exclude.has(row.iconId)) continue;
      if (row.slug.length > 42) continue;
      chosen.push(row); picked.add(row.iconId); fallback.push(row);
    }
  }
  return chosen;
}

function labelFor(row) {
  const meta = iconMeta.get(row.iconId);
  return pretty((meta && meta.name) || row.iconId);
}

function makeCard(title, list, where) {
  if (!list.length) return "";
  return `<article class="card"><h2>${escapeHtml(title)}</h2><p class="hub-links">${joinLinks(iconLinks(list, where))}</p></article>`;
}

/* ────────────────────────────────────────────────────────────────────────────
   5. Shell
   ──────────────────────────────────────────────────────────────────────────── */

function sidebar(activeType, activeSlug) {
  const libRows = LIBRARIES.map((lib) => {
    const on = activeType === "library" && lib.slug === activeSlug;
    return `<a class="lib-row${on ? " active" : ""}" href="/library/${lib.slug}/"><span class="lib-name">${escapeHtml(lib.name)}</span><span class="lib-count">${escapeHtml(lib.count)}</span></a>`;
  }).join("\n              ");

  const catRows = CATEGORY_SLUGS.map((slug, i) => {
    const on = activeType === "category" && slug === activeSlug;
    const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
    const info = CATEGORY_INFO[slug];
    return `<a class="category-item${on ? " active" : ""}" href="/category/${slug}/"><span class="category-dot" style="background:${color}"></span><span>${escapeHtml(info.name)}</span></a>`;
  }).join("\n              ");

  const styleRows = STYLES.map((s) => {
    const on = activeType === "style" && s.slug === activeSlug;
    return `<a class="style-pill${on ? " active" : ""}" href="/style/${s.slug}/">${escapeHtml(s.name)}</a>`;
  }).join("\n              ");

  return `<aside id="left-sidebar" aria-label="Browse icon libraries">
        <div class="sidebar-content">
          <section class="filter-section">
            <div class="filter-header"><h2>Libraries</h2><span class="muted">${LIBRARIES.length}</span></div>
            <div class="lib-list">
              ${libRows}
            </div>
          </section>

          <section class="sidebar-card expandable open" id="category-section">
            <div class="filter-header"><h2>Categories</h2></div>
            <div class="card-content category-list">
              ${catRows}
            </div>
          </section>

          <section class="sidebar-card expandable open" id="style-section">
            <div class="filter-header"><h2>Styles</h2></div>
            <div class="card-content style-pills">
              ${styleRows}
            </div>
          </section>
        </div>
      </aside>`;
}

function footer() {
  return `<footer class="home-footer">
              <div class="footer-container">
                <div class="footer-left">
                  <a class="footer-logo" href="/" aria-label="IconStash.io home">
                    <svg class="logo-icon" viewBox="0 0 24 24"><path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z"/><path d="m8 9 4-2 4 2v6l-4 2-4-2V9Z"/></svg>
                    <span class="logo-text">IconStash<span class="logo-io">.io</span></span>
                  </a>
                  <p class="footer-tagline">Instant, browser-based icon search engine. Unify ${LIBRARIES.length} open-source icon libraries into a single lightning-fast search.</p>
                </div>
                <div class="footer-right">
                  <div class="footer-line">This website is offered to you by <a href="https://greatsoftwarecompany.com" target="_blank" rel="noopener" class="footer-link">Great Software Company</a> in collaboration with Huzzi.</div>
                  <div class="footer-line"><a href="/about/" class="footer-link">About</a> &middot; <a href="/contact/" class="footer-link">Contact</a> &middot; <a href="/terms/" class="footer-link">Terms of Service</a> &middot; <a href="/privacy/" class="footer-link">Privacy Policy</a> &middot; <a href="/stats/" class="footer-link">Library Stats</a> &middot; <a href="/articles/" class="footer-link">Articles</a></div>
                  <div class="footer-line">Browse: <a href="/library/" class="footer-link">Icon libraries</a> &middot; <a href="/category/" class="footer-link">Icon categories</a> &middot; <a href="/style/" class="footer-link">Icon styles</a> &middot; <a href="/compare/" class="footer-link">Comparisons</a> &middot; <a href="/alternatives/" class="footer-link">Alternatives</a> &middot; <a href="/icons-for/" class="footer-link">By framework</a></div>
                  <div class="footer-line">Popular: <a href="/library/lucide/" class="footer-link">Lucide</a> &middot; <a href="/library/tabler/" class="footer-link">Tabler</a> &middot; <a href="/library/phosphor/" class="footer-link">Phosphor</a> &middot; <a href="/library/material/" class="footer-link">Material Design</a> &middot; <a href="/library/heroicons/" class="footer-link">Heroicons</a> &middot; <a href="/library/bootstrap/" class="footer-link">Bootstrap Icons</a></div>
                  <div class="footer-line">Questions? Feedback? Contact us at <a href="mailto:heybro@iconstash.io" class="footer-link">heybro@iconstash.io</a></div>
                  <div class="footer-line">&copy; ${new Date().getFullYear()} IconStash.io. All rights reserved.</div>
                </div>
              </div>
            </footer>`;
}

function head({ title, description, canonical, schema, activeType }) {
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <script async src="https://plausible.io/js/pa--bfaHBAPFGUV3yUn96sF4.js"></script>
  <script>window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()</script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${SITE_URL}/logo.png">
  <meta property="og:site_name" content="IconStash">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${SITE_URL}/logo.png">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=20260602-brandlogo">
  <link rel="stylesheet" href="/style.css?v=${CSS_VERSION}">
  <script type="application/ld+json">
  ${JSON.stringify(schema)}
  </script>
</head>`;
}

function page({ title, description, canonical, schema, activeType, activeSlug, crumbs, body }) {
  return `${head({ title, description, canonical, schema, activeType })}
<body class="pseo-page">
  <div class="bg-canvas" aria-hidden="true">
    <div class="mesh-orb orb-1"></div>
    <div class="mesh-orb orb-2"></div>
    <div class="mesh-orb orb-3"></div>
    <div class="mesh-orb orb-4"></div>
    <div class="corner-glow glow-tl"></div>
    <div class="corner-glow glow-br"></div>
    <div class="scanlines"></div>
    <div class="noise"></div>
  </div>

  <div class="app-shell">
    <header id="main-header">
      <div class="header-left">
        <a class="logo" href="/" aria-label="IconStash.io home">
          <svg class="logo-icon" viewBox="0 0 24 24"><path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z"/><path d="m8 9 4-2 4 2v6l-4 2-4-2V9Z"/></svg>
          <span class="logo-text">IconStash<span class="logo-io">.io</span></span>
        </a>
      </div>
      <div class="header-right">
        <a href="/" class="nav-link">Icons</a>
        <button class="nav-link" id="theme-toggle" title="Toggle theme">Light</button>
      </div>
    </header>

    <div class="workspace">
      ${sidebar(activeType, activeSlug)}

      <main id="main-content">
        <section class="route-view pseo-view active">
          <div class="pseo-document">

            <nav class="crumbs" aria-label="Breadcrumb">
              ${crumbs}
            </nav>

${body}

            ${footer()}

          </div>
        </section>
      </main>
    </div>
  </div>
  <script>
    (() => {
      const root = document.documentElement;
      const themeToggle = document.getElementById("theme-toggle");
      const updateThemeUI = (theme) => { root.dataset.theme = theme; if (themeToggle) themeToggle.textContent = theme === "light" ? "Dark" : "Light"; };
      try { updateThemeUI(localStorage.getItem("iconvault-theme") || "dark"); } catch (_) { updateThemeUI("dark"); }
      themeToggle?.addEventListener("click", () => { const next = root.dataset.theme === "light" ? "dark" : "light"; updateThemeUI(next); try { localStorage.setItem("iconvault-theme", next); } catch (_) {} });
    })();
  </script>
</body>
</html>
`;
}

function faqBlock(faqs) {
  return faqs.map(([q, a]) => `<article class="card faq-item">
                <h2>${escapeHtml(q)}</h2>
                <p>${richText(a)}</p>
              </article>`).join("\n              ");
}

function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") }
    }))
  };
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem", position: i + 1, name: it.name, item: it.url
    }))
  };
}

function collectionSchema({ name, url, description, count }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name, url, description,
    isPartOf: { "@type": "WebSite", name: "IconStash", url: `${SITE_URL}/` },
    mainEntity: { "@type": "ItemList", numberOfItems: count, itemListElement: [] }
  };
}

/* ────────────────────────────────────────────────────────────────────────────
   6. Indexes over the keyword database
   ──────────────────────────────────────────────────────────────────────────── */

const byLibrary = new Map();
const byCategory = new Map();
const byStyle = new Map();

for (const row of KEYWORDS) {
  if (row.librarySlug) {
    if (!byLibrary.has(row.librarySlug)) byLibrary.set(row.librarySlug, []);
    byLibrary.get(row.librarySlug).push(row);
  }
  if (row.category) {
    if (!byCategory.has(row.category)) byCategory.set(row.category, []);
    byCategory.get(row.category).push(row);
  }
}

/**
 * /style/ hubs classify on the icon's `style` field, which is authoritative
 * (outline 48k / fill 30k / bold 25k / light 18k / solid 6.5k / duotone 4.6k /
 * thin 1.6k). Slug patterns are a fallback for icons with no style field.
 * Patterns are boundary-anchored so `-twotone` at the end of a slug still hits.
 */
const edge = (word) => new RegExp(`(^|-)${word}(-|$)`);
const STYLE_MATCHERS = {
  outline: (r, m) => (m && m.style === "outline") || edge("outline(d)?").test(r.slug),
  solid: (r, m) => (m && m.style === "solid") || edge("solid").test(r.slug),
  duotone: (r, m) => (m && m.style === "duotone") || edge("duotone").test(r.slug) || edge("(two-?|two)?tone").test(r.slug),
  fill: (r, m) => (m && m.style === "fill") || edge("fill(ed)?").test(r.slug),
  bold: (r, m) => (m && m.style === "bold") || edge("bold").test(r.slug),
  thin: (r, m) => (m && m.style === "thin") || edge("thin").test(r.slug),
  light: (r, m) => (m && m.style === "light") || edge("light").test(r.slug)
};

/** Distinct icon count per style — used for ItemList numberOfItems. */
const styleIconCounts = new Map();
for (const style of STYLES) {
  const match = STYLE_MATCHERS[style.slug];
  const bucket = [];
  const seen = new Set();
  for (const row of KEYWORDS) {
    if (!match(row, iconMeta.get(row.iconId))) continue;
    bucket.push(row);
    seen.add(row.iconId);
  }
  byStyle.set(style.slug, bucket);
  styleIconCounts.set(style.slug, seen.size);
}

const catSlugOf = (name) => String(name || "").toLowerCase().replace(/\s+/g, "-");

/* ────────────────────────────────────────────────────────────────────────────
   7. Page builders
   ──────────────────────────────────────────────────────────────────────────── */

function buildLibraryPage(lib) {
  const copy = LIB_COPY[lib.slug];
  if (!copy) throw new Error(`Missing LIB_COPY for ${lib.slug}`);
  const url = `${SITE_URL}/library/${lib.slug}/`;
  const rows = byLibrary.get(lib.slug) || [];

  const pageRows = rows.filter((r) => r.slug.length <= 42);
  const groupA = pickFor(pageRows, { want: 8 });
  const usedA = new Set(groupA.map((r) => r.iconId));
  const groupB = pickFor(pageRows, { want: 7, exclude: usedA });
  const usedAB = new Set([...usedA, ...groupB.map((r) => r.iconId)]);
  const groupC = pickFor(pageRows, { want: 8, exclude: usedAB });
  const usedABC = new Set([...usedAB, ...groupC.map((r) => r.iconId)]);
  const groupD = pickFor(pageRows, { want: 7, exclude: usedABC });

  const toLinks = (rs) => rs.map((r) => [r.slug, labelFor(r)]);
  const where = `library:${lib.slug}`;

  /* Popular icons, grouped by the site's own category taxonomy. */
  const catCards = [];
  const sampleRows = pickFor(pageRows, { want: 40, exclude: new Set() });
  const byCat = new Map();
  for (const r of sampleRows) {
    const c = r.category || "Interface";
    if (!byCat.has(c)) byCat.set(c, []);
    if (byCat.get(c).length < 8) byCat.get(c).push(r);
  }
  for (const c of ["Navigation", "Communication", "Files", "Media", "Commerce", "Security", "Time", "Interface"]) {
    const rs = byCat.get(c);
    if (rs && rs.length >= 3) catCards.push(makeCard(c === "Interface" ? "Interface &amp; controls" : `${c} &amp; ${String(CATEGORY_INFO[catSlugOf(c)] ? CATEGORY_INFO[catSlugOf(c)].sub : "icons")}`, toLinks(rs), where));
  }
  while (catCards.length < 4) {
    const rs = pickFor(pageRows, { want: 7, exclude: new Set(sampleRows.map((r) => r.iconId).slice(0, catCards.length * 7)) });
    if (!rs.length) break;
    catCards.push(makeCard("More icons", toLinks(rs), where));
  }

  const peerRows = copy.peers.map((s) => LIB_BY_SLUG.get(s)).filter(Boolean);

  /* Six FAQs: four data-driven, two written specifically for this library. */
  const faqs = [
    [`What is ${lib.fullName}?`, copy.about[0]],
    [`Is ${lib.fullName} free for commercial use?`, licenseAnswer(lib)],
    [`How do I use ${lib.name} icons in React?`,
      `Install the package with <code>npm install ${lib.npm}</code>, then import icons as components. Every ${lib.name} page on IconStash shows the exact import statement and usage snippet for that specific icon in the Code tab, so you can copy working code without checking the docs. Tree-shakeable packages mean your bundler only includes the icons you actually import.`],
    [`Can I download ${lib.name} icons as PNG?`,
      `Yes. Open any ${lib.name} icon on IconStash and use the Download PNG button to export at 16, 32, 64, 128, 256, or 512 pixels. The PNG is generated client-side from the original vector, so it stays crisp at every size. You can also copy the raw SVG markup, export a React component, or build an SVG sprite without installing anything.`],
    ...copy.faq
  ];

  const description = `Browse ${lib.count} ${lib.fullName} — ${lib.style.toLowerCase()} SVG icons, ${lib.license} licensed. Copy SVG, export PNG, or install ${lib.npm}. Free, no login.`;
  const descriptionShort = description.length > 158
    ? `Browse ${lib.count} ${lib.fullName} — ${lib.style.toLowerCase()} SVG icons, ${lib.license} licensed. Copy SVG, export PNG, install ${lib.npm}.`
    : description;

  const body = `
            <section class="hero">
              <div class="preview">
                <div class="hub-stats">
                  <div class="hub-stat"><b>${escapeHtml(lib.count)}</b><span>Icons</span></div>
                  <div class="hub-stat"><b>${escapeHtml(lib.license.replace(" 1.0", "").replace(" 4.0", ""))}</b><span>License</span></div>
                  <div class="hub-stat"><b>${escapeHtml(lib.style.split(" ")[0])}</b><span>Style</span></div>
                  <div class="hub-stat"><b>${escapeHtml(lib.grid)}</b><span>Grid</span></div>
                </div>
              </div>
              <div>
                <h1>${escapeHtml(lib.fullName)}</h1>
                <p class="lead">${lib.count} ${escapeHtml(lib.license)}-licensed ${escapeHtml(lib.style.toLowerCase())} icons${lib.grid === "24×24" ? " on a 24×24 grid" : ` on a ${escapeHtml(lib.grid)} grid`}. ${escapeHtml(firstSentence(copy.about[1]))}</p>
                <div class="cta">
                  <a class="btn primary" href="/category/">Browse ${escapeHtml(lib.name)} icons by category</a>
                  <a class="btn" href="/compare/">Compare libraries</a>
                </div>
              </div>
            </section>

            <p class="section-title">About ${escapeHtml(lib.fullName)}</p>
            <div class="grid wide">
              <article class="card">
                <h2>What ${escapeHtml(lib.name)} is</h2>
                ${copy.about.map((p) => `<p>${richText(p)}</p>`).join("\n                ")}
                <p>IconStash indexes the complete ${escapeHtml(lib.fullName)} collection. You can search it alongside ${LIBRARIES.length - 1} other libraries, preview any icon at any size and colour, and export SVG, PNG, React JSX, Vue, CSS, or an SVG sprite without installing a package or creating an account.</p>
              </article>
            </div>

            <p class="section-title">Install and use ${escapeHtml(lib.name)}</p>
            <div class="grid wide">
              <article class="card">
                <h2>React</h2>
                <pre><code>npm install ${escapeHtml(lib.npm)}</code></pre>
                <p>The official package ships each icon as a tree-shakeable component, so bundlers only include the icons you actually import. Open any ${escapeHtml(lib.name)} icon on IconStash and the Code tab shows that icon's exact import statement and JSX.</p>
              </article>
              <article class="card">
                <h2>Plain SVG and other frameworks</h2>
                <p>You do not have to install anything. Every ${escapeHtml(lib.name)} page lets you copy the raw SVG markup and paste it inline, which avoids a dependency entirely and gives you full control over colour, size, and stroke width.</p>
                <p>IconStash also exports PNG at six sizes, Vue and CSS snippets, and SVG sprites — all generated in the browser from the original vector.</p>
              </article>
            </div>

            <p class="section-title">When to choose ${escapeHtml(lib.name)}</p>
            <div class="grid">
              <article class="card">
                <h2>Good fit</h2>
                <p>${richText(copy.fit)}</p>
              </article>
              <article class="card">
                <h2>Consider alternatives</h2>
                <p>${richText(copy.alt)}</p>
              </article>
              <article class="card">
                <h2>Licensing</h2>
                <p>${richText(copy.lic)}</p>
              </article>
            </div>

            <p class="section-title">${escapeHtml(lib.name)} compared to other libraries</p>
            <div class="grid wide">
              <article class="card">
                <table class="hub-table">
                  <thead><tr><th>Library</th><th>Icons</th><th>Style</th><th>License</th></tr></thead>
                  <tbody>
                    <tr><td><a href="/library/${lib.slug}/">${escapeHtml(lib.fullName)}</a></td><td>${escapeHtml(lib.count)}</td><td>${escapeHtml(lib.style)}</td><td>${escapeHtml(lib.license)}</td></tr>
                    ${peerRows.map((p) => `<tr><td><a href="/library/${p.slug}/">${escapeHtml(p.fullName)}</a></td><td>${escapeHtml(p.count)}</td><td>${escapeHtml(p.style)}</td><td>${escapeHtml(p.license)}</td></tr>`).join("\n                    ")}
                  </tbody>
                </table>
              </article>
            </div>

            <p class="section-title">Popular ${escapeHtml(lib.name)} icons</p>
            <div class="grid">
              ${catCards.slice(0, 4).join("\n              ")}
            </div>

            <p class="section-title">Browse ${escapeHtml(lib.name)} by category</p>
            <div class="grid">
              ${makeCard("Categories", CATEGORY_SLUGS.slice(0, 8).map((s) => CATEGORY_INFO[s]).map((c) => [null]).filter(() => false), where) || `<article class="card"><p class="hub-links">${CATEGORY_SLUGS.map((s) => `<a href="/category/${s}/">${escapeHtml(CATEGORY_INFO[s].name)} icons</a>`).join(' <span aria-hidden="true">·</span> ')}</p></article>`}
            </div>

            <p class="section-title">Frequently asked questions</p>
            <div class="grid wide">
              ${faqBlock(faqs)}
            </div>

            <p class="section-title">Explore other icon libraries</p>
            <div class="grid">
              ${(() => {
    const others = LIBRARIES.filter((l) => l.slug !== lib.slug && !copy.peers.includes(l.slug))
      .sort((a, b) => b.countNum - a.countNum).slice(0, 8);
    const links = [...copy.peers.map((s) => LIB_BY_SLUG.get(s)).filter(Boolean), ...others]
      .slice(0, 8).map((l) => `<a href="/library/${l.slug}/">${escapeHtml(l.fullName)}</a>`);
    return `<article class="card"><p class="hub-links">${links.join(' <span aria-hidden="true">·</span> ')}</p></article>`;
  })()}
            </div>
`;

  const schema = [
    breadcrumbSchema([
      { name: "IconStash", url: `${SITE_URL}/` },
      { name: "Icon Libraries", url: `${SITE_URL}/library/` },
      { name: lib.fullName, url }
    ]),
    collectionSchema({
      name: lib.fullName, url,
      description: `Complete index of ${lib.count} ${lib.fullName} icon pages on IconStash, with SVG code, PNG export, and React snippets for every icon.`,
      count: lib.countNum
    }),
    faqSchema(faqs)
  ];

  return {
    file: path.join(ROOT, "library", lib.slug, "index.html"),
    html: page({
      title: `${lib.fullName} — ${lib.count} Free ${lib.license} SVG Icons | IconStash`,
      description: descriptionShort,
      canonical: url, schema, activeType: "library", activeSlug: lib.slug,
      crumbs: `<a href="/">IconStash</a> / <a href="/library/">Libraries</a> / <span>${escapeHtml(lib.fullName)}</span>`,
      body
    })
  };
}

function licenseAnswer(lib) {
  switch (lib.license) {
    case "MIT":
      return `Yes. ${lib.fullName} is released under the MIT license, which permits unrestricted commercial use, modification, and distribution. No attribution is required, though it is appreciated. This makes ${lib.name} one of the safest icon libraries to use in commercial SaaS products, client work, and proprietary applications.`;
    case "Apache 2.0":
      return `Yes. ${lib.fullName} is released under Apache 2.0, which permits commercial use, modification, and distribution and includes an express patent grant from the licensor. Attribution is not required for ordinary use, but you should not use the icons in a way that implies the licensor endorses your product.`;
    case "ISC":
      return `Yes. ${lib.fullName} is released under the ISC license, a permissive license functionally equivalent to MIT. Commercial use, modification, and distribution are all permitted with no attribution requirement, making it safe for client work, commercial SaaS, and proprietary products.`;
    case "CC BY 4.0":
      return `Yes, with one condition. ${lib.fullName} is released under CC BY 4.0, which permits commercial use and modification but requires attribution to the original creator. Most products satisfy this with a credit line in the footer, an about page, or the project README. If providing credit is not practical for your product, use an MIT or Apache 2.0 library instead.`;
    case "CC0 1.0":
      return `Yes. ${lib.fullName} is released under CC0 1.0, which is effectively a public domain dedication — commercial use, modification, and redistribution are all permitted with no attribution required. Note that the underlying brand marks remain trademarks of their respective owners even though the icon files are CC0.`;
    default:
      return `Yes. ${lib.fullName} is released under the ${lib.license} license, which permits commercial use. Check the library's own license page for attribution requirements before shipping.`;
  }
}

function firstSentence(html) {
  const text = String(html || "").replace(/<[^>]+>/g, "");
  const m = text.match(/^[^.]+\./);
  return (m ? m[0] : text.slice(0, 140)).trim();
}

function buildCategoryPage(slug) {
  const info = CATEGORY_INFO[slug];
  const url = `${SITE_URL}/category/${slug}/`;
  const rows = (byCategory.get(info.name) || []).filter((r) => r.slug.length <= 42);
  const total = rows.length;

  /* Icons spread across libraries so the page demonstrates cross-library coverage. */
  const byLibUsed = new Map();
  const spread = [];
  const sorted = rows.slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  for (const r of sorted) {
    const n = byLibUsed.get(r.librarySlug) || 0;
    if (n >= 3) continue;
    byLibUsed.set(r.librarySlug, n + 1);
    spread.push(r);
    if (spread.length >= 36) break;
  }

  const conceptRows = pickFor(rows, { want: 40 });
  const cards = [];
  const used = new Set();
  const groups = [
    ["Most searched", conceptRows.slice(0, 8)],
    ["More in this category", conceptRows.slice(8, 16)],
    ["Across libraries", spread.slice(0, 8)],
    ["Still more", conceptRows.slice(16, 24)]
  ];
  for (const [title, rs] of groups) {
    const filtered = rs.filter((r) => !used.has(r.iconId));
    filtered.forEach((r) => used.add(r.iconId));
    if (filtered.length >= 3) cards.push(makeCard(title, filtered.map((r) => [r.slug, labelFor(r)]), `category:${slug}`));
  }

  /* Which libraries cover this category best. */
  const libCounts = new Map();
  for (const r of rows) libCounts.set(r.librarySlug, (libCounts.get(r.librarySlug) || 0) + 1);
  const topLibs = [...libCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([s, n]) => ({ lib: LIB_BY_SLUG.get(s), n })).filter((x) => x.lib);

  const subs = [...(subCategories.get(info.name) || new Map()).entries()]
    .sort((a, b) => b[1] - a[1]).slice(0, 12);

  const faqs = [
    [`What are ${info.name.toLowerCase()} icons?`,
      `${info.name} icons cover ${info.blurb}. IconStash indexes ${total.toLocaleString("en-US")} pages in this category across ${libCounts.size} icon libraries, so you can compare how different sets draw the same concept before committing to one.`],
    [`Which icon library has the best ${info.name.toLowerCase()} icons?`,
      topLibs.length
        ? `It depends on the look you want. By count, the strongest coverage on IconStash comes from ${topLibs.slice(0, 3).map((x) => `${x.lib.fullName} (${x.n.toLocaleString("en-US")} matching pages)`).join(", ")}. For a minimal, consistent outline set, <a href="/library/lucide/">Lucide</a> is the usual default; for multiple weights from one library, <a href="/library/phosphor/">Phosphor</a> gives you six.`
        : `Coverage varies by library. Search the category on IconStash and filter by library to see which set matches your product's visual language.`],
    [`Can I download ${info.name.toLowerCase()} icons as PNG?`,
      `Yes. Every icon in this category can be exported as PNG at 16, 32, 64, 128, 256, or 512 pixels, generated client-side from the original vector. You can also copy the raw SVG, export a React component, or build an SVG sprite.`],
    [`Are these ${info.name.toLowerCase()} icons free for commercial use?`,
      `The libraries indexed here are MIT, Apache 2.0, CC BY 4.0, or CC0 licensed, all of which permit commercial use. CC BY sets — such as <a href="/library/solar/">Solar Icons</a> — require attribution, so check the license shown on each icon page if you cannot provide credit.`],
    [`How do I pick the right ${info.name.toLowerCase()} icon?`,
      `Start from recognition rather than style. Choose the glyph your users already associate with the action, then pick the library whose weight matches your interface — lighter sets like <a href="/library/remix/">Remix Icon</a> suit dense UI, heavier sets like <a href="/library/solar/">Solar</a> suit marketing and empty states.`]
  ];

  const description = `${total.toLocaleString("en-US")} free ${info.name.toLowerCase()} icons — ${info.blurb}. Compare ${libCounts.size} libraries, copy SVG or export PNG. No login.`;
  const descriptionShort = description.length > 158
    ? `${total.toLocaleString("en-US")} free ${info.name.toLowerCase()} icons — ${info.blurb}. Compare ${libCounts.size} libraries, copy SVG, export PNG.`
    : description;

  const body = `
            <section class="hero">
              <div class="preview">
                <div class="hub-stats">
                  <div class="hub-stat"><b>${total.toLocaleString("en-US")}</b><span>Icons</span></div>
                  <div class="hub-stat"><b>${libCounts.size}</b><span>Libraries</span></div>
                  <div class="hub-stat"><b>${subs.length || info.sub}</b><span>${subs.length ? "Subcategories" : "Type"}</span></div>
                  <div class="hub-stat"><b>SVG</b><span>&amp; PNG</span></div>
                </div>
              </div>
              <div>
                <h1>${escapeHtml(info.name)} Icons</h1>
                <p class="lead">${total.toLocaleString("en-US")} free ${escapeHtml(info.name.toLowerCase())} icons indexed across ${libCounts.size} open-source libraries — ${escapeHtml(info.blurb)}. Compare how each library draws the same icon, then copy the SVG or export a PNG.</p>
                <div class="cta">
                  <a class="btn primary" href="/library/">Browse ${escapeHtml(info.name.toLowerCase())} icons by library</a>
                  <a class="btn" href="/compare/">Compare libraries</a>
                </div>
              </div>
            </section>

            <p class="section-title">About ${escapeHtml(info.name)} icons</p>
            <div class="grid wide">
              <article class="card">
                <h2>What this category covers</h2>
                <p>The ${escapeHtml(info.name.toLowerCase())} category collects icons for ${escapeHtml(info.blurb)}. Because IconStash indexes ${LIBRARIES.length} libraries side by side, a single search here returns the same concept drawn by many different design teams — which is the fastest way to find an icon that matches your product's existing visual language.</p>
                <p>Every result links to a page with the full SVG source, a live preview you can recolour and resize, PNG export at six sizes, and a ready-to-paste React snippet. Nothing is locked behind an account, and the icons come from libraries you can install directly from npm.</p>
              </article>
            </div>

            <p class="section-title">Popular ${escapeHtml(info.name.toLowerCase())} icons</p>
            <div class="grid">
              ${cards.join("\n              ")}
            </div>

            <p class="section-title">Libraries with strong ${escapeHtml(info.name.toLowerCase())} coverage</p>
            <div class="grid wide">
              <article class="card">
                <table class="hub-table">
                  <thead><tr><th>Library</th><th>${escapeHtml(info.name)} pages</th><th>Style</th><th>License</th></tr></thead>
                  <tbody>
                    ${topLibs.map((x) => `<tr><td><a href="/library/${x.lib.slug}/">${escapeHtml(x.lib.fullName)}</a></td><td>${x.n.toLocaleString("en-US")}</td><td>${escapeHtml(x.lib.style)}</td><td>${escapeHtml(x.lib.license)}</td></tr>`).join("\n                    ")}
                  </tbody>
                </table>
              </article>
            </div>

            ${subs.length ? `
            <p class="section-title">${escapeHtml(info.name)} subcategories</p>
            <div class="grid">
              <article class="card"><h2>Subcategories in this set</h2><p>IconStash splits ${escapeHtml(info.name.toLowerCase())} icons into ${subs.length} subcategories: ${subs.map(([s]) => `<strong>${escapeHtml(s)}</strong>`).join(", ")}. Open the live search to filter by any of them.</p></article>
            </div>` : ""}

            <p class="section-title">Browse other categories</p>
            <div class="grid">
              <article class="card"><p class="hub-links">${CATEGORY_SLUGS.filter((s) => s !== slug).map((s) => `<a href="/category/${s}/">${escapeHtml(CATEGORY_INFO[s].name)} icons</a>`).join(' <span aria-hidden="true">·</span> ')}</p></article>
            </div>

            <p class="section-title">Frequently asked questions</p>
            <div class="grid wide">
              ${faqBlock(faqs)}
            </div>

            <p class="section-title">Browse by style</p>
            <div class="grid">
              <article class="card"><p class="hub-links">${STYLES.map((s) => `<a href="/style/${s.slug}/">${escapeHtml(s.name)} icons</a>`).join(' <span aria-hidden="true">·</span> ')}</p></article>
            </div>
`;

  const schema = [
    breadcrumbSchema([
      { name: "IconStash", url: `${SITE_URL}/` },
      { name: "Icon Categories", url: `${SITE_URL}/category/` },
      { name: `${info.name} Icons`, url }
    ]),
    collectionSchema({
      name: `${info.name} Icons`, url,
      description: `Index of ${total.toLocaleString("en-US")} ${info.name.toLowerCase()} icon pages on IconStash across ${libCounts.size} open-source icon libraries.`,
      count: total
    }),
    faqSchema(faqs)
  ];

  return {
    file: path.join(ROOT, "category", slug, "index.html"),
    html: page({
      title: `${info.name} Icons — ${total.toLocaleString("en-US")} Free SVG Icons | IconStash`,
      description: descriptionShort,
      canonical: url, schema, activeType: "category", activeSlug: slug,
      crumbs: `<a href="/">IconStash</a> / <a href="/category/">Categories</a> / <span>${escapeHtml(info.name)} Icons</span>`,
      body
    })
  };
}

const STYLE_INFO = {
  outline: { blurb: "stroke-based icons with no fill, drawn as open paths on a consistent grid", tip: "Outline icons read as light and technical. They suit dense interfaces, dashboards, and any layout where a filled icon would feel heavy. Watch contrast on coloured or photographic backgrounds — thin strokes can disappear." },
  solid: { blurb: "fully filled icons with no internal stroke, carrying the most visual weight of any style", tip: "Solid icons are the standard choice for active navigation, selected filters, and primary actions. Used everywhere they make an interface feel heavy, so most products pair them with an outline set for default state." },
  duotone: { blurb: "two-tone icons that layer a lighter secondary pass behind a heavier primary form", tip: "Duotone adds depth without full colour, which is why it works well in empty states, feature cards, and onboarding. It is visually heavy, so avoid it in dense toolbars and small tables." },
  fill: { blurb: "filled icon variants — the same concepts as outline sets, rendered as solid shapes", tip: "Fill variants are the usual way to express state: outline for available, filled for active or selected. Because they mirror their outline counterparts, switching between them does not shift your layout." },
  bold: { blurb: "heavy-weight icons with thickened strokes or filled mass for maximum emphasis", tip: "Bold icons work at large sizes and in marketing layouts where a regular-weight icon looks weak. They lose definition below about 20px, so avoid them in compact controls." },
  thin: { blurb: "light-stroke icons drawn with the thinnest weights available in each library", tip: "Thin icons look refined next to large type in spacious layouts. They lose contrast against busy backgrounds and beside small text, so keep them out of dense tables and toolbars." },
  light: { blurb: "light-weight icons, typically a 300-weight cut, for interfaces that need a softer touch", tip: "Light icons suit editorial layouts, premium products, and generous spacing. At 12–16px beside small text they become hard to scan — use a regular or bold weight there instead." }
};

function buildStylePage(style) {
  const info = STYLE_INFO[style.slug];
  const url = `${SITE_URL}/style/${style.slug}/`;
  const rows = (byStyle.get(style.slug) || []).filter((r) => r.slug.length <= 42);
  const total = styleIconCounts.get(style.slug) || 0;

  const byLibUsed = new Map();
  const spread = [];
  const sorted = rows.slice().sort((a, b) => (b.score || 0) - (a.score || 0));
  for (const r of sorted) {
    const n = byLibUsed.get(r.librarySlug) || 0;
    if (n >= 3) continue;
    byLibUsed.set(r.librarySlug, n + 1);
    spread.push(r);
    if (spread.length >= 32) break;
  }

  const conceptRows = pickFor(rows, { want: 32 });
  const used = new Set();
  const cards = [];
  for (const [title, rs] of [
    ["Most searched", conceptRows.slice(0, 8)],
    ["More examples", conceptRows.slice(8, 16)],
    ["Across libraries", spread.slice(0, 8)],
    ["Still more", conceptRows.slice(16, 24)]
  ]) {
    const f = rs.filter((r) => !used.has(r.iconId));
    f.forEach((r) => used.add(r.iconId));
    if (f.length >= 3) cards.push(makeCard(title, f.map((r) => [r.slug, labelFor(r)]), `style:${style.slug}`));
  }

  const libCounts = new Map();
  for (const r of rows) libCounts.set(r.librarySlug, (libCounts.get(r.librarySlug) || 0) + 1);
  const topLibs = [...libCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([s, n]) => ({ lib: LIB_BY_SLUG.get(s), n })).filter((x) => x.lib);

  const catCounts = new Map();
  for (const r of rows) {
    const m = iconMeta.get(r.iconId);
    if (m && m.category) catCounts.set(m.category, (catCounts.get(m.category) || 0) + 1);
  }
  const topCats = [...catCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  const faqs = [
    [`What are ${style.name.toLowerCase()} icons?`,
      `${style.name} icons are ${info.blurb}. IconStash indexes ${total.toLocaleString("en-US")} of them across ${libCounts.size} open-source libraries, so you can compare the same drawing style as interpreted by different design teams.`],
    [`When should I use ${style.name.toLowerCase()} icons?`,
      info.tip],
    [`Which libraries include ${style.name.toLowerCase()} icons?`,
      topLibs.length
        ? `On IconStash the strongest coverage comes from ${topLibs.slice(0, 3).map((x) => `<a href="/library/${x.lib.slug}/">${x.lib.fullName}</a> (${x.n.toLocaleString("en-US")})`).join(", ")}. Open any library hub to see its full style range alongside install instructions.`
        : `Coverage varies. Search by style and filter by library to see which sets offer the weight you need.`],
    [`Can I export ${style.name.toLowerCase()} icons as PNG?`,
      `Yes. Every icon on IconStash exports to PNG at 16, 32, 64, 128, 256, or 512 pixels, generated in the browser from the original vector so it stays crisp at any size. You can also copy the raw SVG, export a React component, or build an SVG sprite.`],
    [`Are these ${style.name.toLowerCase()} icons free for commercial use?`,
      `The libraries indexed here are MIT, Apache 2.0, CC BY 4.0, or CC0 licensed, all of which permit commercial use. CC BY sets such as <a href="/library/solar/">Solar Icons</a> require attribution — check the license shown on each icon page if you cannot provide credit.`]
  ];

  const description = `${total.toLocaleString("en-US")} free ${style.name.toLowerCase()} icons — ${info.blurb}. Compare ${libCounts.size} libraries, copy SVG or export PNG. No login.`;
  const descriptionShort = description.length > 158
    ? `${total.toLocaleString("en-US")} free ${style.name.toLowerCase()} icons — ${info.blurb}. Compare ${libCounts.size} libraries, copy SVG, export PNG.`
    : description;

  const body = `
            <section class="hero">
              <div class="preview">
                <div class="hub-stats">
                  <div class="hub-stat"><b>${total.toLocaleString("en-US")}</b><span>Icons</span></div>
                  <div class="hub-stat"><b>${libCounts.size}</b><span>Libraries</span></div>
                  <div class="hub-stat"><b>${topCats.length}</b><span>Categories</span></div>
                  <div class="hub-stat"><b>SVG</b><span>&amp; PNG</span></div>
                </div>
              </div>
              <div>
                <h1>${escapeHtml(style.title)}</h1>
                <p class="lead">${total.toLocaleString("en-US")} free ${escapeHtml(style.name.toLowerCase())} icons indexed across ${libCounts.size} open-source libraries — ${escapeHtml(info.blurb)}. Preview, recolour, and export without an account.</p>
                <div class="cta">
                  <a class="btn primary" href="/">Search all ${escapeHtml(style.name.toLowerCase())} icons</a>
                  <a class="btn" href="/library/">Browse by library</a>
                </div>
              </div>
            </section>

            <p class="section-title">About ${escapeHtml(style.name.toLowerCase())} icons</p>
            <div class="grid wide">
              <article class="card">
                <h2>What this style means</h2>
                <p>${escapeHtml(style.name)} icons are ${escapeHtml(info.blurb)}. IconStash classifies icons by style across all ${LIBRARIES.length} indexed libraries, so you can hold the weight constant and compare how different design teams solve the same icon.</p>
                <p><strong>When to use them.</strong> ${escapeHtml(info.tip)}</p>
                <p>Every icon below links to a page with the full SVG source, a live preview you can recolour and resize, PNG export at six sizes, and a ready-to-paste React snippet.</p>
              </article>
            </div>

            <p class="section-title">Popular ${escapeHtml(style.name.toLowerCase())} icons</p>
            <div class="grid">
              ${cards.join("\n              ")}
            </div>

            <p class="section-title">Libraries with ${escapeHtml(style.name.toLowerCase())} icons</p>
            <div class="grid wide">
              <article class="card">
                <table class="hub-table">
                  <thead><tr><th>Library</th><th>${escapeHtml(style.name)} pages</th><th>Style</th><th>License</th></tr></thead>
                  <tbody>
                    ${topLibs.map((x) => `<tr><td><a href="/library/${x.lib.slug}/">${escapeHtml(x.lib.fullName)}</a></td><td>${x.n.toLocaleString("en-US")}</td><td>${escapeHtml(x.lib.style)}</td><td>${escapeHtml(x.lib.license)}</td></tr>`).join("\n                    ")}
                  </tbody>
                </table>
              </article>
            </div>

            ${topCats.length ? `
            <p class="section-title">${escapeHtml(style.name)} icons by category</p>
            <div class="grid">
              <article class="card"><p class="hub-links">${topCats.map(([c]) => `<a href="/category/${catSlugOf(c)}/">${escapeHtml(c)} icons</a>`).join(' <span aria-hidden="true">·</span> ')}</p></article>
            </div>` : ""}

            <p class="section-title">Browse other styles</p>
            <div class="grid">
              <article class="card"><p class="hub-links">${STYLES.filter((s) => s.slug !== style.slug).map((s) => `<a href="/style/${s.slug}/">${escapeHtml(s.name)} icons</a>`).join(' <span aria-hidden="true">·</span> ')}</p></article>
            </div>

            <p class="section-title">Frequently asked questions</p>
            <div class="grid wide">
              ${faqBlock(faqs)}
            </div>
`;

  const schema = [
    breadcrumbSchema([
      { name: "IconStash", url: `${SITE_URL}/` },
      { name: "Icon Styles", url: `${SITE_URL}/style/` },
      { name: style.title, url }
    ]),
    collectionSchema({
      name: style.title, url,
      description: `Index of ${total.toLocaleString("en-US")} ${style.name.toLowerCase()} icon pages on IconStash across ${libCounts.size} open-source icon libraries.`,
      count: total
    }),
    faqSchema(faqs)
  ];

  return {
    file: path.join(ROOT, "style", style.slug, "index.html"),
    html: page({
      title: `${style.title} — ${total.toLocaleString("en-US")} Free SVG Icons | IconStash`,
      description: descriptionShort,
      canonical: url, schema, activeType: "style", activeSlug: style.slug,
      crumbs: `<a href="/">IconStash</a> / <a href="/style/">Styles</a> / <span>${escapeHtml(style.title)}</span>`,
      body
    })
  };
}

/* Index pages ---------------------------------------------------------------- */

function buildLibraryIndex() {
  const url = `${SITE_URL}/library/`;
  const total = LIBRARIES.reduce((n, l) => n + l.countNum, 0);

  const rows = LIBRARIES.map((l) => `<tr><td><a href="/library/${l.slug}/">${escapeHtml(l.fullName)}</a></td><td>${escapeHtml(l.count)}</td><td>${escapeHtml(l.style)}</td><td>${escapeHtml(l.grid)}</td><td>${escapeHtml(l.license)}</td></tr>`).join("\n                    ");

  const faqs = [
    ["How many icon libraries does IconStash index?",
      `IconStash indexes ${LIBRARIES.length} open-source icon libraries containing roughly ${total.toLocaleString("en-US")} icons. Each library has its own hub page with install instructions, a comparison table against similar libraries, popular icons, and licensing notes.`],
    ["Which icon library should I use?",
      "It depends on your product. For a minimal, consistent outline set, <a href=\"/library/lucide/\">Lucide</a> is the usual default. For the largest single collection, <a href=\"/library/fluent/\">Fluent UI Icons</a> has over 20,000. For multiple weights from one library, <a href=\"/library/phosphor/\">Phosphor</a> offers six. If you are building with Tailwind, <a href=\"/library/heroicons/\">Heroicons</a> integrates most naturally."],
    ["Are all these icon libraries free for commercial use?",
      "All of them permit commercial use. Most are MIT or Apache 2.0, which require no attribution. Two are CC BY 4.0 — <a href=\"/library/solar/\">Solar Icons</a> — which does require credit, and <a href=\"/library/simpleicons/\">Simple Icons</a> is CC0 (public domain). Each library hub page states its license explicitly."],
    ["Can I search across all libraries at once?",
      "Yes. That is the core of IconStash — one search box covers every indexed library, so you can find how different sets draw the same concept and switch between them without leaving the page. You can also filter by category and style, and export SVG, PNG, React, Vue, or CSS from any result."]
  ];

  const body = `
            <section class="hero">
              <div class="preview">
                <div class="hub-stats">
                  <div class="hub-stat"><b>${LIBRARIES.length}</b><span>Libraries</span></div>
                  <div class="hub-stat"><b>${total.toLocaleString("en-US")}</b><span>Icons</span></div>
                  <div class="hub-stat"><b>${CATEGORY_SLUGS.length}</b><span>Categories</span></div>
                  <div class="hub-stat"><b>${STYLES.length}</b><span>Styles</span></div>
                </div>
              </div>
              <div>
                <h1>Icon Libraries</h1>
                <p class="lead">${LIBRARIES.length} open-source icon libraries indexed in one searchable catalogue — about ${total.toLocaleString("en-US")} icons. Compare counts, styles, grids, and licenses, then open any library to browse its icons and install instructions.</p>
                <div class="cta">
                  <a class="btn primary" href="/">Search all libraries at once</a>
                  <a class="btn" href="/category/">Browse by category</a>
                </div>
              </div>
            </section>

            <p class="section-title">All icon libraries</p>
            <div class="grid wide">
              <article class="card">
                <table class="hub-table">
                  <thead><tr><th>Library</th><th>Icons</th><th>Style</th><th>Grid</th><th>License</th></tr></thead>
                  <tbody>
                    ${rows}
                  </tbody>
                </table>
              </article>
            </div>

            <p class="section-title">Most popular libraries</p>
            <div class="grid">
              ${makeCard("Minimal outline sets", [["lucide-home", "Lucide"], ["feather-home", "Feather"], ["iconoir-home", "Iconoir"], ["tabler-home", "Tabler"]].map(([s, l]) => [s, l]), "library-index")}
              ${makeCard("Multiple weights", [["phosphor-house", "Phosphor"], ["solar-home-2-linear", "Solar"], ["hugeicons-home-01", "Huge Icons"], ["materialsymbols-home", "Material Symbols"]].map(([s, l]) => [s, l]), "library-index")}
            </div>

            <p class="section-title">Frequently asked questions</p>
            <div class="grid wide">
              ${faqBlock(faqs)}
            </div>

            <p class="section-title">Browse by category or style</p>
            <div class="grid">
              <article class="card"><h2>Categories</h2><p class="hub-links">${CATEGORY_SLUGS.map((s) => `<a href="/category/${s}/">${escapeHtml(CATEGORY_INFO[s].name)} icons</a>`).join(' <span aria-hidden="true">·</span> ')}</p></article>
              <article class="card"><h2>Styles</h2><p class="hub-links">${STYLES.map((s) => `<a href="/style/${s.slug}/">${escapeHtml(s.name)} icons</a>`).join(' <span aria-hidden="true">·</span> ')}</p></article>
            </div>
`;

  const schema = [
    breadcrumbSchema([
      { name: "IconStash", url: `${SITE_URL}/` },
      { name: "Icon Libraries", url }
    ]),
    collectionSchema({
      name: "Icon Libraries", url,
      description: `Index of ${LIBRARIES.length} open-source icon libraries on IconStash, covering roughly ${total.toLocaleString("en-US")} icons.`,
      count: LIBRARIES.length
    }),
    faqSchema(faqs)
  ];

  return {
    file: path.join(ROOT, "library", "index.html"),
    html: page({
      title: `${LIBRARIES.length} Free Icon Libraries — ${total.toLocaleString("en-US")} SVG Icons | IconStash`,
      description: `Compare ${LIBRARIES.length} free open-source icon libraries — ${total.toLocaleString("en-US")} SVG icons. Counts, styles, grids and licenses side by side. Search all at once.`,
      canonical: url, schema, activeType: "library", activeSlug: null,
      crumbs: `<a href="/">IconStash</a> / <span>Icon Libraries</span>`,
      body
    })
  };
}

function buildCategoryIndex() {
  const url = `${SITE_URL}/category/`;
  const counts = CATEGORY_SLUGS.map((s) => {
    const n = (byCategory.get(CATEGORY_INFO[s].name) || []).length;
    return { slug: s, info: CATEGORY_INFO[s], n };
  });

  const faqs = [
    ["How are icons categorised on IconStash?",
      `Icons are grouped into ${CATEGORY_SLUGS.length} categories — Media, Communication, Commerce, Navigation, Files, Editing, Devices, Development, Security, Health, Weather, Transport, Social, Time, Data, and Interface. Each category page lists its icons across all ${LIBRARIES.length} indexed libraries, so you can compare interpretations before choosing a set.`],
    ["Can I search icons by category?",
      "Yes. Every category has a hub page with popular icons, a table of the libraries with the strongest coverage in that category, and links to subcategories. You can also filter live search results by category in the app."],
    ["Which category has the most icons?",
      `${counts.slice().sort((a, b) => b.n - a.n).slice(0, 1).map((c) => `${c.info.name}, with ${c.n.toLocaleString("en-US")} indexed pages`)[0]}. Category sizes reflect how much product UI depends on that domain — interface, navigation, and communication concepts appear in nearly every application.`]
  ];

  const body = `
            <section class="hero">
              <div class="preview">
                <div class="hub-stats">
                  <div class="hub-stat"><b>${CATEGORY_SLUGS.length}</b><span>Categories</span></div>
                  <div class="hub-stat"><b>${LIBRARIES.length}</b><span>Libraries</span></div>
                  <div class="hub-stat"><b>SVG</b><span>&amp; PNG</span></div>
                  <div class="hub-stat"><b>Free</b><span>No login</span></div>
                </div>
              </div>
              <div>
                <h1>Icon Categories</h1>
                <p class="lead">Browse ${CATEGORY_SLUGS.length} icon categories across ${LIBRARIES.length} open-source libraries. Every category page shows the same concept drawn by many design teams, so you can pick the interpretation that matches your product.</p>
                <div class="cta">
                  <a class="btn primary" href="/">Search all icons</a>
                  <a class="btn" href="/library/">Browse by library</a>
                </div>
              </div>
            </section>

            <p class="section-title">All categories</p>
            <div class="grid wide">
              <article class="card">
                <table class="hub-table">
                  <thead><tr><th>Category</th><th>Icons</th><th>What it covers</th></tr></thead>
                  <tbody>
                    ${counts.map((c) => `<tr><td><a href="/category/${c.slug}/">${escapeHtml(c.info.name)} Icons</a></td><td>${c.n.toLocaleString("en-US")}</td><td>${escapeHtml(c.info.blurb)}</td></tr>`).join("\n                    ")}
                  </tbody>
                </table>
              </article>
            </div>

            <p class="section-title">Jump to a category</p>
            <div class="grid">
              <article class="card"><p class="hub-links">${counts.map((c) => `<a href="/category/${c.slug}/">${escapeHtml(c.info.name)}</a>`).join(' <span aria-hidden="true">·</span> ')}</p></article>
            </div>

            <p class="section-title">Frequently asked questions</p>
            <div class="grid wide">
              ${faqBlock(faqs)}
            </div>

            <p class="section-title">Browse by style</p>
            <div class="grid">
              <article class="card"><p class="hub-links">${STYLES.map((s) => `<a href="/style/${s.slug}/">${escapeHtml(s.name)} icons</a>`).join(' <span aria-hidden="true">·</span> ')}</p></article>
            </div>
`;

  const schema = [
    breadcrumbSchema([
      { name: "IconStash", url: `${SITE_URL}/` },
      { name: "Icon Categories", url }
    ]),
    collectionSchema({
      name: "Icon Categories", url,
      description: `Index of ${CATEGORY_SLUGS.length} icon categories on IconStash, covering all ${LIBRARIES.length} indexed open-source icon libraries.`,
      count: CATEGORY_SLUGS.length
    }),
    faqSchema(faqs)
  ];

  return {
    file: path.join(ROOT, "category", "index.html"),
    html: page({
      title: `Icon Categories — Browse by Topic | IconStash`,
      description: `Browse ${CATEGORY_SLUGS.length} icon categories across ${LIBRARIES.length} open-source libraries. Compare how each library draws the same concept, then copy SVG or export PNG.`,
      canonical: url, schema, activeType: "category", activeSlug: null,
      crumbs: `<a href="/">IconStash</a> / <span>Icon Categories</span>`,
      body
    })
  };
}

function buildStyleIndex() {
  const url = `${SITE_URL}/style/`;
  const counts = STYLES.map((s) => ({ ...s, n: (byStyle.get(s.slug) || []).length }));

  const faqs = [
    ["What icon styles does IconStash index?",
      `IconStash classifies icons into ${STYLES.length} styles: ${STYLES.map((s) => s.name).join(", ")}. Each style has a hub page listing its icons across all ${LIBRARIES.length} indexed libraries, so you can hold the visual weight constant and compare how different design teams handle it.`],
    ["What is the difference between outline and solid icons?",
      "Outline icons are drawn as open strokes with no fill and read as light and technical; solid icons are fully filled and carry much more visual weight. Most products use outline for default state and solid for active or selected state, which is why libraries that ship both — such as <a href=\"/library/heroicons/\">Heroicons</a> and <a href=\"/library/ionicons/\">Ionicons</a> — are convenient."],
    ["Which icon style should I use?",
      "Match the weight to your layout. Outline and thin suit dense interfaces and dashboards; solid and bold suit marketing pages, empty states, and large display sizes; duotone adds depth for feature cards and onboarding. The safest pattern is one outline set for structure plus its solid counterpart for active state."]
  ];

  const body = `
            <section class="hero">
              <div class="preview">
                <div class="hub-stats">
                  <div class="hub-stat"><b>${STYLES.length}</b><span>Styles</span></div>
                  <div class="hub-stat"><b>${LIBRARIES.length}</b><span>Libraries</span></div>
                  <div class="hub-stat"><b>SVG</b><span>&amp; PNG</span></div>
                  <div class="hub-stat"><b>Free</b><span>No login</span></div>
                </div>
              </div>
              <div>
                <h1>Icon Styles</h1>
                <p class="lead">Browse icons by visual weight across ${LIBRARIES.length} open-source libraries — outline, solid, duotone, fill, bold, thin, and light. Hold the style constant and compare how each design team handles it.</p>
                <div class="cta">
                  <a class="btn primary" href="/">Search all icons</a>
                  <a class="btn" href="/library/">Browse by library</a>
                </div>
              </div>
            </section>

            <p class="section-title">All styles</p>
            <div class="grid wide">
              <article class="card">
                <table class="hub-table">
                  <thead><tr><th>Style</th><th>Icons</th><th>What it means</th></tr></thead>
                  <tbody>
                    ${counts.map((s) => `<tr><td><a href="/style/${s.slug}/">${escapeHtml(s.title)}</a></td><td>${s.n.toLocaleString("en-US")}</td><td>${escapeHtml(STYLE_INFO[s.slug].blurb)}</td></tr>`).join("\n                    ")}
                  </tbody>
                </table>
              </article>
            </div>

            <p class="section-title">Jump to a style</p>
            <div class="grid">
              <article class="card"><p class="hub-links">${counts.map((s) => `<a href="/style/${s.slug}/">${escapeHtml(s.name)} icons</a>`).join(' <span aria-hidden="true">·</span> ')}</p></article>
            </div>

            <p class="section-title">Frequently asked questions</p>
            <div class="grid wide">
              ${faqBlock(faqs)}
            </div>

            <p class="section-title">Browse by category</p>
            <div class="grid">
              <article class="card"><p class="hub-links">${CATEGORY_SLUGS.map((s) => `<a href="/category/${s}/">${escapeHtml(CATEGORY_INFO[s].name)} icons</a>`).join(' <span aria-hidden="true">·</span> ')}</p></article>
            </div>
`;

  const schema = [
    breadcrumbSchema([
      { name: "IconStash", url: `${SITE_URL}/` },
      { name: "Icon Styles", url }
    ]),
    collectionSchema({
      name: "Icon Styles", url,
      description: `Index of ${STYLES.length} icon styles on IconStash, covering all ${LIBRARIES.length} indexed open-source icon libraries.`,
      count: STYLES.length
    }),
    faqSchema(faqs)
  ];

  return {
    file: path.join(ROOT, "style", "index.html"),
    html: page({
      title: `Icon Styles — Outline, Solid, Duotone &amp; More | IconStash`,
      description: `Browse icons by style across ${LIBRARIES.length} open-source libraries — outline, solid, duotone, fill, bold, thin, light. Copy SVG or export PNG free.`,
      canonical: url, schema, activeType: "style", activeSlug: null,
      crumbs: `<a href="/">IconStash</a> / <span>Icon Styles</span>`,
      body
    })
  };
}

/* ────────────────────────────────────────────────────────────────────────────
   8. Main
   ──────────────────────────────────────────────────────────────────────────── */

function write(p) {
  fs.mkdirSync(path.dirname(p.file), { recursive: true });
  fs.writeFileSync(p.file, p.html, "utf8");
  return p.file;
}

function main() {
  const written = [];
  const started = Date.now();

  for (const lib of LIBRARIES) written.push(write(buildLibraryPage(lib)));
  for (const slug of CATEGORY_SLUGS) written.push(write(buildCategoryPage(slug)));
  for (const style of STYLES) written.push(write(buildStylePage(style)));
  written.push(write(buildLibraryIndex()));
  written.push(write(buildCategoryIndex()));
  written.push(write(buildStyleIndex()));

  console.log(`Wrote ${written.length} hub pages in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  console.log(`  libraries: ${LIBRARIES.length} + index`);
  console.log(`  categories: ${CATEGORY_SLUGS.length} + index`);
  console.log(`  styles: ${STYLES.length} + index`);

  if (brokenLinks.length) {
    const unique = [...new Set(brokenLinks)];
    console.log(`\nDropped ${unique.length} broken /icons/ links:`);
    unique.slice(0, 40).forEach((b) => console.log("  " + b));
    if (unique.length > 40) console.log(`  ...and ${unique.length - 40} more`);
  } else {
    console.log("\nAll /icons/ links verified against disk.");
  }

  /* Sitemap fragment for the hub layer. */
  const urls = [
    "/library/", "/category/", "/style/",
    ...LIBRARIES.map((l) => `/library/${l.slug}/`),
    ...CATEGORY_SLUGS.map((s) => `/category/${s}/`),
    ...STYLES.map((s) => `/style/${s.slug}/`)
  ];
  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    + urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${u.split("/").filter(Boolean).length === 1 ? "0.9" : "0.8"}</priority></url>`).join("\n")
    + `\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, "sitemaps", "hubs.xml"), xml, "utf8");
  console.log(`\nWrote sitemaps/hubs.xml (${urls.length} URLs)`);
}

/* Only auto-run when invoked directly. `require`-ing this file to reuse its
   page shell must not rebuild the whole hub layer as a side effect. */
if (require.main === module) {
  main();
}

module.exports = {
  main, write, page, head, footer, sidebar, faqBlock, faqSchema,
  breadcrumbSchema, collectionSchema, iconLink, iconLinks, richText,
  LIBRARIES, LIB_BY_SLUG, LIB_COPY, STYLES, CATEGORY_SLUGS, CATEGORY_INFO,
  SITE_URL, CSS_VERSION, KEYWORDS, escapeHtml
};
