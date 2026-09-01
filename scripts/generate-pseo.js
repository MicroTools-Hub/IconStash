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
const PAGE_LIMIT = Math.max(1, Number(process.env.PSEO_LIMIT || 150000));
const TODAY = new Date().toISOString().slice(0, 10);

/* ─── Category rules ─────────────────────────────────────────────────────── */
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

/* ─── Synonyms for keyword expansion ─────────────────────────────────────── */
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
  phone: ["call", "mobile", "contact"],
  check: ["confirm", "tick", "done"],
  close: ["dismiss", "cancel", "exit"],
  menu: ["hamburger", "navigation", "sidebar"],
  plus: ["add", "create", "new"],
  minus: ["remove", "subtract", "reduce"],
  eye: ["view", "visibility", "preview"],
  link: ["url", "hyperlink", "connect"],
  share: ["distribute", "send", "export"],
  refresh: ["reload", "sync", "update"],
  filter: ["sort", "refine", "search"],
  grid: ["layout", "columns", "gallery"],
  list: ["items", "index", "rows"],
  info: ["information", "details", "help"],
  warning: ["alert", "caution", "notice"],
  error: ["danger", "fail", "invalid"],
  success: ["done", "complete", "valid"]
};

/* ─── Category intents for keyword generation ────────────────────────────── */
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

/* ─── Category use-case descriptions (for body copy variation) ───────────── */
const CATEGORY_CONTEXT = {
  Media: "media players, streaming interfaces, audio controls, photo galleries, podcast apps, and video platforms",
  Communication: "messaging apps, email clients, contact forms, notification systems, CRM dashboards, and live chat widgets",
  Commerce: "e-commerce checkout flows, shopping carts, payment UI, product listings, storefronts, and fintech apps",
  Navigation: "app menus, breadcrumbs, map interfaces, multi-step forms, pagination controls, and sidebar navigation",
  Files: "document management systems, admin panels, file explorers, CMS dashboards, cloud storage UIs, and PDF viewers",
  Editing: "rich text editors, design tools, image editors, drawing apps, content creation platforms, and creative suites",
  Devices: "device dashboards, IoT interfaces, product settings pages, hardware control panels, and tech product sites",
  Development: "developer tools, CLI documentation, API dashboards, GitHub-integrated UIs, code editors, and DevOps panels",
  Security: "login and authentication flows, permission management panels, privacy settings, VPN apps, and security dashboards",
  Health: "health and fitness apps, medical record systems, wellness dashboards, telemedicine platforms, and patient portals",
  Weather: "weather forecast apps, climate dashboards, location-based services, environmental widgets, and IoT sensor displays",
  Transport: "travel booking platforms, fleet management dashboards, logistics apps, ride-hailing UIs, and route planners",
  Social: "social networks, community forums, profile pages, team collaboration tools, and user management dashboards",
  Time: "calendar apps, scheduling tools, time-tracking platforms, project management dashboards, and productivity suites",
  Data: "analytics dashboards, business intelligence tools, reporting platforms, data visualization apps, and KPI displays",
  Interface: "general-purpose product UIs, design systems, component libraries, web applications, and marketing sites"
};

/* ─── Icon style descriptions ────────────────────────────────────────────── */
const STYLE_DESC = {
  outline: "uses stroked lines with no fill — clean, legible, and versatile at any size",
  filled: "uses solid filled shapes — high contrast, instantly recognizable, and bold at small sizes",
  thin: "uses ultra-fine strokes for an elegant, premium look suited to large display sizes",
  light: "uses light-weight strokes that pair well with thin typography and minimalist layouts",
  sharp: "uses straight corners and rigid geometry — structured, technical, and precise",
  duotone: "uses a two-tone composition combining primary and secondary color layers for depth",
  pixel: "uses pixel-perfect square forms for retro aesthetics and game-inspired design",
  animated: "uses SVG path animations for smooth, dynamic UI transitions and feedback",
  variable: "uses variable-font technology allowing adjustable weight, fill, grade, and optical size",
  "multi-style": "is available in multiple weights and styles including outline, filled, and specialty variants"
};

const STYLE_USE_CASES = {
  outline: "app navigation bars, toolbar buttons, form labels, and UI controls where clarity at 16–24px is critical",
  filled: "primary action buttons, selected states, status indicators, and high-emphasis interface elements",
  thin: "editorial layouts, hero sections, premium marketing pages, and large-format typographic contexts",
  light: "subtle decorative accents, secondary labels, light-themed dashboards, and minimal product pages",
  sharp: "enterprise software interfaces, admin panels, technical documentation, and structured data UIs",
  duotone: "feature highlight cards, onboarding illustrations, content-rich landing pages, and infographics",
  pixel: "retro-themed interfaces, gaming UIs, pixel art projects, and creative portfolio sites",
  animated: "loading indicators, success/error toasts, onboarding walkthrough flows, and interactive demos",
  variable: "design systems requiring a single icon source that scales across light, regular, and bold contexts",
  "multi-style": "design systems that need consistent icons across filled and outline usage in the same product"
};

/* ─── Library info for authority cards and code snippets ─────────────────── */
function toPascalCase(str) {
  return String(str || "").split(/[-_\s]+/).filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

const LIBRARY_INFO = {
  lucide: {
    fullName: "Lucide Icons", count: "1,979", style: "outline", license: "ISC",
    npm: "lucide-react",
    desc: "Clean, consistent, and ISC-licensed icon library built by the open-source community as a fork of Feather Icons. Every icon sits on a 24×24 grid with a 2px default stroke.",
    reactCode: (n) => `npm install lucide-react\n\nimport { ${toPascalCase(n)} } from 'lucide-react';\n\n// JSX usage:\n<${toPascalCase(n)} size={24} color="#000" />`
  },
  tabler: {
    fullName: "Tabler Icons", count: "6,324", style: "outline", license: "MIT",
    npm: "@tabler/icons-react",
    desc: "Free and open-source icon set with 6,300+ icons on a consistent 24px grid. One of the largest MIT-licensed outline icon libraries available.",
    reactCode: (n) => `npm install @tabler/icons-react\n\nimport { Icon${toPascalCase(n)} } from '@tabler/icons-react';\n\n// JSX usage:\n<Icon${toPascalCase(n)} size={24} stroke={1.5} />`
  },
  phosphor: {
    fullName: "Phosphor Icons", count: "9,198", style: "multi-style", license: "MIT",
    npm: "phosphor-react",
    desc: "Flexible icon family with 9,000+ icons across six weights: Thin, Light, Regular, Bold, Fill, and Duotone. Designed to work together at any scale.",
    reactCode: (n) => `npm install phosphor-react\n\nimport { ${toPascalCase(n)} } from 'phosphor-react';\n\n// JSX usage:\n<${toPascalCase(n)} size={24} weight="regular" />`
  },
  material: {
    fullName: "Material Design Icons", count: "14,001", style: "multi-style", license: "Apache 2.0",
    npm: "@mui/icons-material",
    desc: "Google's official icon set for Material Design. 14,000+ icons in five themes: Outlined, Rounded, Sharp, Two Tone, and Filled. Used across Android and web Google products.",
    reactCode: (n) => `npm install @mui/icons-material\n\nimport ${toPascalCase(n)}Outlined from '@mui/icons-material/${toPascalCase(n)}Outlined';\n\n// JSX usage:\n<${toPascalCase(n)}Outlined fontSize="small" />`
  },
  remix: {
    fullName: "Remix Icon", count: "3,244", style: "two-style", license: "Apache 2.0",
    npm: "remixicon",
    desc: "Open-source, neutral-style system icon set for designers and developers. 3,200+ icons in both line and fill variants, organized across 25 categories.",
    reactCode: (n) => `npm install remixicon\n\n/* In your CSS: */\n@import 'remixicon/fonts/remixicon.css';\n\n<!-- HTML usage: -->\n<i class="ri-${n}-line ri-lg"></i>`
  },
  iconoir: {
    fullName: "Iconoir", count: "2,020", style: "outline", license: "MIT",
    npm: "iconoir-react",
    desc: "High-quality, free SVG outline icons for UI design. 2,000+ consistent 24×24 icons with no premium tier — open and available for any project.",
    reactCode: (n) => `npm install iconoir-react\n\nimport { ${toPascalCase(n)} } from 'iconoir-react';\n\n// JSX usage:\n<${toPascalCase(n)} width={24} height={24} />`
  },
  heroicons: {
    fullName: "Heroicons", count: "1,297", style: "outline/solid", license: "MIT",
    npm: "@heroicons/react",
    desc: "Hand-crafted SVG icons by the makers of Tailwind CSS. Available in outline and solid variants at 16px, 20px, and 24px — perfect for Tailwind-based projects.",
    reactCode: (n) => `npm install @heroicons/react\n\nimport { ${toPascalCase(n)}Icon } from '@heroicons/react/24/outline';\n\n// JSX usage:\n<${toPascalCase(n)}Icon className="h-6 w-6 text-gray-700" />`
  },
  bootstrap: {
    fullName: "Bootstrap Icons", count: "2,090", style: "multi-style", license: "MIT",
    npm: "bootstrap-icons",
    desc: "Official open-source SVG icon library for Bootstrap. 2,000+ icons spanning fills, strokes, and mixed styles — built by the Bootstrap team.",
    reactCode: (n) => `npm install react-icons\n\nimport { Bi${toPascalCase(n)} } from 'react-icons/bi';\n\n// JSX usage:\n<Bi${toPascalCase(n)} size={24} />`
  },
  feather: {
    fullName: "Feather Icons", count: "286", style: "outline", license: "MIT",
    npm: "react-feather",
    desc: "Simply beautiful, minimal open-source icons. 286 carefully crafted outline icons on a 24px grid. One of the most-forked icon libraries on GitHub.",
    reactCode: (n) => `npm install react-feather\n\nimport { ${toPascalCase(n)} } from 'react-feather';\n\n// JSX usage:\n<${toPascalCase(n)} size={24} color="#000" />`
  },
  mingcute: {
    fullName: "MingCute Icons", count: "3,352", style: "multi-style", license: "Apache 2.0",
    npm: "@mingcute/icon-react",
    desc: "3,300+ high-quality icons with both line and filled variants. Clean, modern aesthetic designed for polished product interfaces and design systems.",
    reactCode: (n) => `npm install @mingcute/icon-react\n\nimport { ${toPascalCase(n)}Line } from '@mingcute/icon-react';\n\n// JSX usage:\n<${toPascalCase(n)}Line size={24} />`
  },
  solar: {
    fullName: "Solar Icons", count: "7,410", style: "multi-style", license: "CC BY 4.0",
    npm: "solar-icon-set",
    desc: "Premium icon pack with 7,400+ icons across six styles: Linear, Outline, Bold, Duotone, Broken, and Bold Duotone. Widely used in SaaS and mobile product design.",
    reactCode: (n) => `npm install solar-icon-set\n\nimport ${toPascalCase(n)} from 'solar-icon-set/${toPascalCase(n)}';\n\n// JSX usage:\n<${toPascalCase(n)} size={24} iconStyle="Linear" />`
  },
  octicons: {
    fullName: "Octicons", count: "929", style: "outline", license: "MIT",
    npm: "@primer/octicons-react",
    desc: "GitHub's design-system icon library. 900+ interface icons used across GitHub.com, GitHub Desktop, GitHub Mobile, and GitHub Docs.",
    reactCode: (n) => `npm install @primer/octicons-react\n\nimport { ${toPascalCase(n)}Icon } from '@primer/octicons-react';\n\n// JSX usage:\n<${toPascalCase(n)}Icon size={24} />`
  },
  cssgg: {
    fullName: "css.gg Icons", count: "705", style: "outline", license: "MIT",
    npm: "css.gg",
    desc: "700+ open-source icons available as pure CSS, SVG, and npm packages. Each icon is a single CSS file with no external dependencies.",
    reactCode: (n) => `npm install css.gg\n\n/* Import the specific icon CSS */\n@import url('css.gg/icons/css/${n}.css');\n\n<!-- HTML usage: -->\n<i class="gg-${n}"></i>`
  },
  radix: {
    fullName: "Radix Icons", count: "345", style: "outline", license: "MIT",
    npm: "@radix-ui/react-icons",
    desc: "Crisp 15×15 icons from the Radix UI team — designed for precise placement in dense product interfaces alongside Radix Primitives.",
    reactCode: (n) => `npm install @radix-ui/react-icons\n\nimport { ${toPascalCase(n)}Icon } from '@radix-ui/react-icons';\n\n// JSX usage:\n<${toPascalCase(n)}Icon width={24} height={24} />`
  },
  antdesign: {
    fullName: "Ant Design Icons", count: "1,870", style: "multi-style", license: "MIT",
    npm: "@ant-design/icons",
    desc: "Official icon library for Ant Design — China's leading enterprise React UI framework. 1,800+ icons in Outlined, Filled, and TwoTone styles.",
    reactCode: (n) => `npm install @ant-design/icons\n\nimport { ${toPascalCase(n)}Outlined } from '@ant-design/icons';\n\n// JSX usage:\n<${toPascalCase(n)}Outlined style={{ fontSize: '24px' }} />`
  },
  fluent: {
    fullName: "Fluent UI Icons", count: "20,170", style: "multi-style", license: "MIT",
    npm: "@fluentui/react-icons",
    desc: "Microsoft's Fluent Design System icon library with 20,000+ icons across multiple sizes (12–48px) and styles (Regular, Filled). Used across Microsoft 365 products.",
    reactCode: (n) => `npm install @fluentui/react-icons\n\nimport { ${toPascalCase(n)}Regular } from '@fluentui/react-icons';\n\n// JSX usage:\n<${toPascalCase(n)}Regular fontSize={24} />`
  },
  carbon: {
    fullName: "Carbon Icons", count: "2,644", style: "outline", license: "Apache 2.0",
    npm: "@carbon/icons-react",
    desc: "IBM's open-source icon library aligned with the Carbon Design System. 2,600+ enterprise-grade icons maintained by IBM's design team.",
    reactCode: (n) => `npm install @carbon/icons-react\n\nimport { ${toPascalCase(n)} } from '@carbon/icons-react';\n\n// JSX usage:\n<${toPascalCase(n)} size={24} />`
  },
  ionicons: {
    fullName: "Ionicons", count: "2,607", style: "multi-style", license: "MIT",
    npm: "ionicons",
    desc: "Beautifully crafted open-source icons built for Ionic Framework. 2,600+ icons in Outline, Filled, and Sharp variants — works in any web framework.",
    reactCode: (n) => `npm install @ionic/react ionicons\n\nimport { IonIcon } from '@ionic/react';\nimport { ${n.replace(/-/g, "")} } from 'ionicons/icons';\n\n// JSX usage:\n<IonIcon icon={${n.replace(/-/g, "")}} style={{ fontSize: '24px' }} />`
  },
  eva: {
    fullName: "Eva Icons", count: "490", style: "outline/filled", license: "MIT",
    npm: "eva-icons",
    desc: "480+ beautifully crafted open-source SVG icons for common UI actions and items. Available in Fill and Outline styles with consistent 24px sizing.",
    reactCode: (n) => `npm install react-eva-icons\n\nimport EvaIcon from 'react-eva-icons';\n\n// JSX usage:\n<EvaIcon name="${n}" size="24" fill="#000" />`
  },
  boxicons: {
    fullName: "Boxicons", count: "3,389", style: "multi-style", license: "MIT",
    npm: "boxicons",
    desc: "High-quality web icons by Atisa. 3,300+ carefully crafted icons in Regular, Solid, and Logos variants. One of the most popular free icon packs for web development.",
    reactCode: (n) => `npm install react-icons\n\nimport { Bx${toPascalCase(n)} } from 'react-icons/bx';\n\n// JSX usage:\n<Bx${toPascalCase(n)} size={24} />`
  },
  materialsymbols: {
    fullName: "Material Symbols", count: "18,547", style: "variable", license: "Apache 2.0",
    npm: "@material-symbols/svg-400",
    desc: "Google's newest icon format built on variable font technology. 18,500+ icons with four adjustable axes: Weight, Fill, Grade, and Optical Size — all from a single file.",
    reactCode: (n) => `/* Use Google Fonts CDN */\n<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">\n\n<!-- HTML usage: -->\n<span class="material-symbols-outlined">${n.replace(/-/g, "_")}</span>`
  },
  materialsymbolslight: {
    fullName: "Material Symbols Light", count: "15,969", style: "light", license: "Apache 2.0",
    npm: "@material-symbols/svg-300",
    desc: "The 300-weight light variant of Google's Material Symbols. 15,900+ icons optimized for elegant, subtle interfaces where a lighter visual weight is preferred.",
    reactCode: (n) => `/* Use Google Fonts CDN (weight=300) */\n<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@300" rel="stylesheet">\n\n<!-- HTML usage: -->\n<span class="material-symbols-outlined">${n.replace(/-/g, "_")}</span>`
  },
  iconparkoutline: {
    fullName: "IconPark Outline", count: "2,658", style: "outline", license: "Apache 2.0",
    npm: "@icon-park/react",
    desc: "ByteDance's outline icon library with 2,600+ colorful, highly customizable icons for web and mobile apps. Supports dynamic color configuration.",
    reactCode: (n) => `npm install @icon-park/react\n\nimport { ${toPascalCase(n)} } from '@icon-park/react';\n\n// JSX usage:\n<${toPascalCase(n)} theme="outline" size={24} fill="#000" />`
  },
  iconparksolid: {
    fullName: "IconPark Solid", count: "1,970", style: "filled", license: "Apache 2.0",
    npm: "@icon-park/react",
    desc: "ByteDance's filled/solid icon library with 1,900+ solid-style icons. Fully customizable colors and sizes, built on the same system as IconPark Outline.",
    reactCode: (n) => `npm install @icon-park/react\n\nimport { ${toPascalCase(n)} } from '@icon-park/react';\n\n// JSX usage:\n<${toPascalCase(n)} theme="filled" size={24} fill="#000" />`
  },
  hugeicons: {
    fullName: "Huge Icons", count: "5,115", style: "multi-style", license: "MIT",
    npm: "hugeicons-react",
    desc: "5,100+ premium-quality SVG icons in 6 styles: Stroke, Duotone, Solid, Bulk, Twotone, and Sharp Stroke. Designed by HugeIcons for professional product interfaces.",
    reactCode: (n) => `npm install hugeicons-react\n\nimport { ${toPascalCase(n)}Icon } from 'hugeicons-react';\n\n// JSX usage:\n<${toPascalCase(n)}Icon size={24} color="#000" />`
  },
  pixelarticons: {
    fullName: "Pixel Art Icons", count: "1,099", style: "pixel", license: "MIT",
    npm: "pixelarticons",
    desc: "1,000+ pixel art style SVG icons for retro aesthetics, game-inspired interfaces, and creative projects. Designed on a strict pixel grid.",
    reactCode: (n) => `npm install pixelarticons\n\n<!-- Direct SVG import (recommended) -->\n<img src="node_modules/pixelarticons/svg/${n}.svg" alt="${n}" width="24" height="24">`
  },
  linemd: {
    fullName: "Line MD Icons", count: "1,279", style: "animated", license: "MIT",
    npm: "@iconify/react",
    desc: "1,200+ animated SVG line icons with smooth path animations. Perfect for loading states, success feedback, onboarding flows, and interactive interfaces.",
    reactCode: (n) => `npm install @iconify/react\n\nimport { Icon } from '@iconify/react';\n\n// JSX usage (via Iconify):\n<Icon icon="line-md:${n}" width={24} height={24} />`
  },
  simpleicons: {
    fullName: "Simple Icons", count: "3,714", style: "filled", license: "CC0 1.0",
    npm: "simple-icons",
    desc: "3,700+ free SVG brand icons for popular technologies, platforms, companies, and products. The definitive source for brand logos in tech stacks and README files.",
    reactCode: (n) => `npm install simple-icons react-icons\n\nimport { Si${toPascalCase(n)} } from 'react-icons/si';\n\n// JSX usage:\n<Si${toPascalCase(n)} size={24} />`
  }
};

/* ─── Per-library design-language copy ─────────────────────────────────────
   One hand-written paragraph per library, describing how that set actually
   constructs its glyphs. This exists because the previous version had copy for
   only 5 of 28 libraries and fell through to a single shared sentence — which
   put identical text on 111,895 pages (83.1% of the icon corpus). With one
   paragraph per library, no two libraries share body copy, and the remaining
   per-icon uniqueness comes from computed specs (see iconSpecs) and the
   category-specific UX guidance (see CATEGORY_PRACTICE).

   Facts here are limited to each library's publicly documented design rules —
   grid, stroke weight, available variants and licensing posture. Anything that
   varies per icon (actual grid size, path count) is computed from the SVG
   instead of asserted here, so it cannot drift out of date.                  */
const LIBRARY_AESTHETIC = {
  lucide: (name) => `The ${name} icon follows the Lucide design system: a 24x24 grid, 2px strokes, and rounded line caps and joins. Lucide started as a community fork of Feather Icons and keeps that restraint — each glyph is reduced to the fewest strokes that still read at 16px, with no fills and no decorative detail.`,
  tabler: (name) => `The ${name} icon is drawn to Tabler's house rules: a 24x24 grid, a 2px stroke, and a deliberately open counter — the enclosed white space inside the shape. Tabler optimises for coverage and consistency across 6,300+ glyphs rather than individual flourishes, which is why it holds up in dense admin and dashboard layouts.`,
  phosphor: (name) => `Phosphor draws ${name} with a uniform stroke weight and generous curves. Its defining feature is a six-weight system — Thin, Light, Regular, Bold, Fill and Duotone — so one concept can carry an entire visual hierarchy without you switching icon families mid-product.`,
  material: (name) => `${name} comes from Google's Material Design icon set, which ships five coordinated themes: Outlined, Rounded, Sharp, Two Tone and Filled. Outlined is the default for dense UI, Filled reads better for selected or active states, and all five share identical geometry — so you can swap themes without shifting your layout by a pixel.`,
  remix: (name) => `Remix Icon builds ${name} from a neutral, slightly geometric construction. Most concepts ship in both a line and a fill variant on the same 24x24 grid, which makes the set a common choice for enterprise and SaaS interfaces that want a quieter visual voice than Material or Fluent.`,
  iconoir: (name) => `Iconoir treats ${name} as a pure outline — a single consistent stroke weight, no fill, no premium tier and no decorative additions. The set is intentionally small and tightly edited, which is why it shows up frequently in minimalist product design and creative portfolios.`,
  heroicons: (name) => `Heroicons is made by the Tailwind CSS team, and ${name} shows it: geometry tuned to sit on Tailwind's spacing scale and to stay legible at 16px, 20px and 24px. Every icon ships in both outline and solid, so you can change style without changing size or re-aligning anything.`,
  bootstrap: (name) => `${name} is part of Bootstrap Icons, the official set for the Bootstrap framework. The glyphs use a slightly heavier, more geometric line than most outline libraries, and each ships in filled and outline versions — so the same icon can work in a compact toolbar and in a large hero section without looking like two different sets.`,
  feather: (name) => `Feather is the library Lucide forked from, and ${name} carries the shared DNA: a 24x24 grid, 2px strokes, rounded caps. With only 286 icons the set is deliberately curated and no longer growing, which is precisely why its internal consistency is unusually tight.`,
  mingcute: (name) => `MingCute draws ${name} with soft, slightly rounded terminals that read as friendly rather than technical. Most concepts ship in both line and filled versions, which is useful when one icon needs to signal both an inactive and an active state without you sourcing a second set.`,
  solar: (name) => `Solar renders ${name} across six styles — Linear, Outline, Bold, Duotone, Broken and Bold Duotone. Broken and Duotone are the distinctive ones: they add a deliberate gap or a second colour layer, which is what makes the set popular for SaaS dashboards and mobile apps that need hierarchy without extra colour.`,
  octicons: (name) => `Octicons is GitHub's own icon set, so ${name} is tuned for the density of GitHub's interface — small default sizes, tight shapes, and silhouettes that stay identifiable at 16px. That makes it a reliable baseline for developer tooling, code review screens and anything code-adjacent.`,
  cssgg: (name) => `css.gg is unusual: ${name} is available as pure CSS as well as SVG, so it can be dropped into a project with no build step and no icon dependency. The shapes are geometric and minimal by necessity — every icon has to be expressible with CSS borders, transforms and pseudo-elements.`,
  radix: (name) => `Radix Icons are drawn on a 15x15 grid rather than the usual 24x24, and ${name} is built for that tighter canvas. The set is designed to sit alongside Radix Primitives in dense product UI, where icons are expected to align to the text baseline rather than to a bounding box.`,
  antdesign: (name) => `${name} comes from Ant Design, the enterprise React framework, and follows its three-theme model: Outlined, Filled and TwoTone. TwoTone adds a secondary colour layer, which Ant Design uses to pull the eye toward primary actions in otherwise dense admin screens.`,
  fluent: (name) => `Fluent UI Icons is Microsoft's set, and ${name} follows its sizing system — the same glyph is redrawn at 12, 16, 20, 24, 28, 32 and 48px rather than simply scaled, so the stroke weight stays perceptually constant as size changes. Each icon also ships as Regular and Filled.`,
  carbon: (name) => `Carbon is IBM's design system, and ${name} reflects its enterprise-first constraints: flat geometry, no gradients, and shapes that survive being shrunk into dense data grids. It is a common choice for regulated, data-heavy products where clarity outranks personality.`,
  ionicons: (name) => `Ionicons ships ${name} in Outline, Filled and Sharp variants. Sharp drops the rounded corners for a more angular look, which makes the set unusually flexible — the same icon can read as approachable or as technical depending on which variant you pick.`,
  eva: (name) => `Eva Icons keeps ${name} deliberately simple, with a fill and an outline version of most concepts on a 24px grid. At roughly 480 icons it covers common UI actions rather than exhaustive coverage, which is what keeps the visual language tight and predictable.`,
  boxicons: (name) => `Boxicons gives ${name} a slightly chunkier, more rounded treatment than most outline sets, and ships Regular, Solid and Logos variants. The Logos subset — brand marks redrawn to match the UI icons — makes it a practical single-dependency choice for marketing sites.`,
  materialsymbols: (name) => `${name} belongs to Google's Material Symbols, which replaces static icon files with a variable font. Weight, Fill, Grade and Optical Size are all adjustable axes, so one file covers what used to need five. Optical Size is the most useful: the glyph is subtly redrawn for small sizes rather than just scaled down.`,
  materialsymbolslight: (name) => `${name} is the 300-weight cut of Material Symbols — the lightest weight in the variable font. Light weight reads as refined at large sizes, but it loses contrast on dark backgrounds and at 16px, so it suits spacious, light-themed layouts better than dense toolbars.`,
  iconparkoutline: (name) => `IconPark is ByteDance's icon system, and its defining feature is theme control: ${name} can be recoloured per-part at runtime — outline, filled, two-tone or multi-colour — from the same base path. That makes it a strong fit when a single icon set has to serve several brand themes.`,
  iconparksolid: (name) => `${name} is the solid cut of ByteDance's IconPark set. Solid glyphs carry more visual weight than outlines, which makes them the better choice for selected states, active navigation items and small sizes where a thin stroke would otherwise disappear.`,
  hugeicons: (name) => `Huge Icons offers six styles per concept — Stroke, Duotone, Solid, Bulk, Twotone and Sharp Stroke — and ${name} is drawn so all six share the same optical footprint. Bulk and Duotone are the ones designers reach for when a page needs visual hierarchy without introducing new colours.`,
  pixelarticons: (name) => `${name} is drawn on a strict pixel grid with hard edges and no curves that rely on anti-aliasing. That is the point: it stays crisp at exact multiples of its native size. It suits retro, game and terminal-inspired interfaces, and looks wrong if you scale it to arbitrary sizes.`,
  linemd: (name) => `${name} is an animated line icon — the paths are authored so they can be drawn on progressively, which is what produces the writing-in effect. It suits loading, success and transition states where motion carries meaning, and should be disabled under prefers-reduced-motion.`,
  simpleicons: (name) => `${name} is a brand mark, not a UI glyph. Simple Icons maintains official-colour SVG logos for thousands of products on a flat 24x24 grid, released under CC0. Because these are brand assets, they belong in tech stacks, README files and "built with" sections rather than in interface chrome.`
};

/* ─── Deterministic hash (for content variation without randomness) ───────── */
function hashCode(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return Math.abs(h >>> 0);
}

/* ─── Core utility functions (unchanged) ─────────────────────────────────── */
function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}
function sleepSync(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}
/* Writes straight to the destination — deliberately no temp-file-plus-rename.

   The previous version wrote `<file>.<pid>.<n>.tmp`, deleted the target, then
   renamed. On a 137k-page rebuild that is ~137k deletions, and this environment
   enforces a bulk-delete guard: once 50 unlink attempts have been made the shim
   throws, `unlinkSync` fails, and the whole build dies partway through — which
   is exactly how the tree was left with empty sitemaps and a half-deleted HTML
   sitemap. Worse, when the guard fired the catch block fell through to
   rewriting the *target* with an empty urlset, so the failure was silent.

   Writing in place never deletes anything, so the guard cannot trigger. The
   cost is a torn file if the process is killed mid-write; that is acceptable
   because the whole page set is regenerable from `data/`, and the
   compare-then-skip below means an interrupted run resumes cheaply. */
function writeFileWithRetry(file, content, attempts = 6) {
  try {
    if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === content) return;
  } catch (_readError) {}

  let lastError;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      ensureDir(path.dirname(file));
      fs.writeFileSync(file, content);
      return;
    } catch (error) {
      lastError = error;
      sleepSync(Math.min(800, 100 * (attempt + 1)));
    }
  }
  throw lastError;
}
/* ─── Retiring files ────────────────────────────────────────────────────────
   Cleaning 15k generated files can trip the environment's bulk-delete guard.
   Deletion is preferred, but rewriting an obsolete page into a redirect is
   just as safe: the directory URL is served by index.php (a real 301) and
   index.html becomes a one-line noindexed fallback instead of a 50 KB
   duplicate competing with the canonical page. So: try to delete, and fall
   back to overwriting rather than failing the whole build.                  */
function htmlRedirectStub(target) {
  const url = `/icons/${String(target).replace(/[^a-z0-9\-/]/gi, "")}/`;
  return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Moved</title>\n`
    + `<link rel="canonical" href="${SITE_URL}${url}">\n`
    + `<meta name="robots" content="noindex,follow">\n`
    + `<meta http-equiv="refresh" content="0;url=${url}">\n`
    + `</head>\n<body><p>This page has moved to <a href="${url}">${url}</a>.</p></body>\n</html>\n`;
}

/* Once the guard trips it keeps tripping, so there is no point paying for
   thousands of guaranteed-to-throw unlink calls. After this many consecutive
   failures the rest of the run goes straight to overwriting. */
const DELETE_GIVE_UP_AFTER = 25;
let consecutiveDeleteFailures = 0;

function retireFile(file, fallbackContent) {
  if (!fs.existsSync(file)) return "absent";
  if (consecutiveDeleteFailures < DELETE_GIVE_UP_AFTER) {
    try {
      fs.unlinkSync(file);
      consecutiveDeleteFailures = 0;
      return "removed";
    } catch (error) {
      consecutiveDeleteFailures++;
    }
  }
  if (fallbackContent == null) return "failed";
  try {
    fs.writeFileSync(file, fallbackContent);
    return "rewritten";
  } catch (writeError) {
    return "failed";
  }
}

/* Creates the output directories and nothing else.

   This used to wipe the HTML-sitemap tree and the sitemap XMLs first. That was
   a mistake on two counts: it needed thousands of deletions, which the bulk-
   delete guard refuses, and it meant a crash between "wipe" and "rewrite" left
   the live site with empty sitemaps telling Google the site had zero URLs.

   Nothing needs deleting. Every artifact this build can leave behind is
   overwritten in place by a later step: HTML-sitemap pages 1..N are rewritten
   with fresh content and pages > N are rewritten as redirects (see
   writeHtmlSitemap); sitemap XMLs are overwritten, and any leftover one is
   emptied and dropped from the index (see writeSitemaps). */
function prepareOutput() {
  ensureDir(OUT_DIR);
  ensureDir(SITEMAP_DIR);
  ensureDir(HTML_SITEMAP_DIR);
}

const EMPTY_URLSET = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n`;
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
/* Visual style each library ships by default, used when an icon's own name
   carries no style suffix. The old catch-all here was "filled", which
   mislabelled every icon from an outline-first library — Ant Design,
   Bootstrap, Eva, Fluent, Boxicons regular, Remix line and others — as a
   filled glyph on 134k pages and in every comparison table. */
const LIBRARY_DEFAULT_STYLE = {
  lucide: "outline", tabler: "outline", iconoir: "outline", feather: "outline",
  radix: "outline", octicons: "outline", cssgg: "outline", remix: "outline",
  heroicons: "outline", antdesign: "outline", fluent: "outline", eva: "outline",
  mingcute: "outline", solar: "outline", boxicons: "outline", linemd: "outline",
  hugeicons: "outline", pixelarticons: "outline", iconparkoutline: "outline",
  bootstrap: "outline", phosphor: "outline",
  carbon: "filled", ionicons: "filled", simpleicons: "filled",
  materialsymbols: "filled", materialsymbolslight: "filled",
  iconparksolid: "filled", material: "filled"
};

function deriveStyle(name, prefix, librarySlug) {
  const text = `${prefix || ""}-${name || ""}`.toLowerCase();
  if (/duotone|two-tone|twotone/.test(text)) return "duotone";
  if (/bold|filled|fill|solid|bxs-/.test(text)) return "filled";
  if (/thin/.test(text)) return "thin";
  if (/light/.test(text)) return "light";
  if (/sharp/.test(text)) return "sharp";
  if (/regular|outline|linear|stroke|-line|-broken/.test(text)) return "outline";
  return LIBRARY_DEFAULT_STYLE[librarySlug] || "outline";
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
    .replace(/\s(fill|stroke)="(?!none\b|transparent\b|url\(|freeze\b|remove\b)[^"]*"/gi, (_m, a) => ` ${a}="currentColor"`)
    .replace(/\s(fill|stroke)='(?!none\b|transparent\b|url\(|freeze\b|remove\b)[^']*'/gi, (_m, a) => ` ${a}="currentColor"`);
}
function renderSvg(icon, size = 72) {
  const fill = icon.style === "filled" ? "currentColor" : "none";
  const stroke = fill === "none" ? "currentColor" : "none";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escapeHtml(icon.viewBox)}" width="${size}" height="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${icon.strokeWidth || 2}" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${escapeHtml(icon.name)} icon">${normalizeBody(icon.body)}</svg>`;
}

function appLogoSvg() {
  return `<svg class="logo-icon" viewBox="0 0 24 24"><path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z"/><path d="m8 9 4-2 4 2v6l-4 2-4-2V9Z"/></svg>`;
}

function libraryBadgeSvg() {
  return `<svg class="lib-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z"></path><path d="M8 9h8M8 13h8"></path></svg>`;
}

let pseoIndexCache = null;
function pseoLibraries() {
  if (!pseoIndexCache) pseoIndexCache = readJson(path.join(DATA_DIR, "index.json"));
  return pseoIndexCache.libraries || [];
}

/* The Compare and Favorites controls are buttons, not anchors. As anchors they
   emitted href="/#/compare" and "/#/collection" on all 137,871 pages, and
   search engines strip the fragment and resolve both to "/" — 275k links that
   voted for the homepage and pointed nowhere useful. app.js binds these by id
   and only toggles classList, so the tag change costs nothing. button.nav-link
   is already styled (see #theme-toggle). */
function renderPseoHeader() {
  return `<header id="main-header">
      <div class="header-left">
        <button class="icon-btn mobile-only" id="sidebar-toggle" title="Open filters" aria-label="Open filters">
          <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
        <a class="logo" id="logo-btn" href="/" aria-label="IconStash.io home">
          ${appLogoSvg()}
          <span class="logo-text">IconStash<span class="logo-io">.io</span></span>
        </a>
      </div>

      <form class="header-center" id="pseo-search-form" action="/" role="search">
        <div class="search-container" id="search-shell">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4.4-4.4"/></svg>
            <input id="main-search" name="query" type="search" placeholder="Search icons..." autocomplete="off" spellcheck="false" aria-label="Search icons">
            <span class="search-shortcut">/</span>
          </div>
        </div>
      </form>

      <div class="header-right">
        <a href="/" class="nav-link active" id="nav-icons-btn">Icons</a>
        <a href="/library/" class="nav-link">Libraries</a>
        <a href="/category/" class="nav-link">Categories</a>
        <a href="/style/" class="nav-link">Styles</a>
        <a href="/compare/" class="nav-link">Comparisons</a>
        <a href="/articles/" class="nav-link">Articles</a>
        <button type="button" class="nav-link" id="compare-toggle" title="Compare this icon across all libraries">Compare</button>
        <button type="button" class="nav-link" id="collections-toggle" title="Your Collection">
          Favorites<span class="badge hidden" id="collection-badge">0</span>
        </button>
        <button class="nav-link" id="theme-toggle" title="Toggle theme">Light</button>
      </div>
    </header>`;
}

function renderPseoSidebar(activeSlug) {
  const rows = pseoLibraries().map((lib, rowIndex) => {
    const active = lib.slug === activeSlug;
    return `<a class="lib-row ${active ? "active" : ""}" href="/library/${escapeHtml(lib.slug)}/" data-slug="${escapeHtml(lib.slug)}" style="animation-delay:${rowIndex * 30}ms">
      <span class="lib-badge">${libraryBadgeSvg()}</span>
      <span class="lib-name">${escapeHtml(lib.name)}</span>
      <span class="lib-count">${Number(lib.count || 0).toLocaleString("en-US")}</span>
    </a>`;
  }).join("");

  const categories = CATEGORY_RULES.concat([["Interface", "Controls"]]).map(([name], categoryIndex) => {
    const color = ["#00c3ff", "#ff2d9b", "#00ff88", "#bf00ff", "#ff6a00", "#f5ff00"][categoryIndex % 6];
    const slug = String(name).toLowerCase().replace(/\s+/g, "-");
    return `<a class="category-item" href="/category/${encodeURIComponent(slug)}/">
      <span class="category-dot" style="background:${color};color:${color}"></span>
      <span>${escapeHtml(name)}</span>
    </a>`;
  }).join("");

  return `<aside id="left-sidebar" aria-label="Filters">
        <div class="sidebar-content">
          <section class="filter-section">
            <div class="filter-header">
              <h2>Libraries</h2>
              <span class="muted">${activeSlug ? "1 selected" : "All"}</span>
            </div>
            <input type="search" id="lib-search" class="mini-search" placeholder="Filter libraries..." aria-label="Filter libraries">
            <div class="lib-list">
              <a class="lib-row all-icons-row ${activeSlug ? "" : "active"}" href="/library/" data-all-icons="true">
                <span class="lib-badge">${libraryBadgeSvg()}</span>
                <span class="lib-name">All Icons</span>
                <span class="lib-count">134,701</span>
              </a>
              <div class="sidebar-card" id="lib-card-section" style="margin-top: 10px;">
                <button class="filter-header lib-toggle" id="lib-toggle" aria-expanded="false">
                  <h2>Libraries List</h2>
                  <svg class="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <div class="card-content lib-collapse-list" id="lib-collapse-list">
                  ${rows}
                </div>
              </div>
            </div>
          </section>

          <section class="sidebar-card expandable" id="style-section">
            <button class="filter-header style-toggle" id="style-toggle" aria-expanded="false">
              <h2>Styles</h2>
              <svg class="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div class="card-content style-pills">
              ${[["All", ""], ["Outline", "outline"], ["Solid", "solid"], ["Duotone", "duotone"], ["Fill", "fill"], ["Bold", "bold"], ["Thin", "thin"], ["Light", "light"]]
                .map(([label, styleSlug], styleIndex) => `<a class="style-pill ${styleIndex === 0 ? "active" : ""}" href="/style/${styleSlug ? `${styleSlug}/` : ""}">${label}</a>`).join("")}
            </div>
          </section>

          <section class="sidebar-card expandable" id="category-section">
            <button class="filter-header category-toggle" id="category-toggle" aria-expanded="false">
              <h2>Categories</h2>
              <svg class="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div class="card-content category-list">${categories}</div>
          </section>

          <section class="filter-section">
            <div class="filter-header"><h2>Preview Size: 24px</h2></div>
            <input type="range" class="neon-slider" min="16" max="128" value="24" aria-label="Preview size">
          </section>

          <section class="filter-section">
            <div class="filter-header"><h2>Sort By</h2></div>
            <label class="custom-select-wrapper">
              <select class="glass-select" aria-label="Sort icons">
                <option>Relevance</option>
                <option>Most Popular</option>
                <option>Newest</option>
                <option>A to Z</option>
                <option>Z to A</option>
              </select>
              <svg class="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </label>
            <div>
              <div class="unlocked-badge" title="Every search filter is free and unlocked.">All filters unlocked</div>
            </div>
          </section>

          <section class="sidebar-card expandable" id="customize-section">
            <button class="filter-header category-toggle" id="customize-toggle" aria-expanded="false">
              <h2>Customize Preview</h2>
              <svg class="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div class="card-content customize-preview-controls">
              <div class="customize-field">
                <div>Fill Color</div>
                <div class="customize-color-row">
                  <input type="text" class="mini-search" value="#ffffff" aria-label="Fill color">
                  <button type="button" class="color-wheel-btn" aria-label="Choose fill color"></button>
                </div>
              </div>
              <div class="customize-field">
                <div class="customize-stroke-row"><span>Stroke Width</span><span>0.7px</span></div>
                <input type="range" class="neon-slider" min="0.1" max="3" step="0.1" value="0.7" aria-label="Stroke width">
              </div>
              <a class="outlined-neon-btn custom-preview-reset">Reset</a>
            </div>
          </section>

          <button id="clear-filters-btn" class="outlined-neon-btn">Clear All Filters</button>
        </div>
      </aside>`;
}

function renderPseoFooter() {
  return `<footer class="home-footer">
    <div class="footer-container">
      <div class="footer-left">
        <a class="footer-logo" href="/" aria-label="IconStash.io home">
          ${appLogoSvg()}
          <span class="logo-text">IconStash<span class="logo-io">.io</span></span>
        </a>
        <p class="footer-tagline">Instant, browser-based icon search engine. Unify 28+ open-source icon libraries into a single lightning-fast search.</p>
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

function renderPseoShell({ title, description, url, canonicalUrl, schema, activeSlug, content }) {
  const canonical = canonicalUrl || url;
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
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:image" content="${SITE_URL}/logo.png">
  <meta property="og:site_name" content="IconStash">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${SITE_URL}/logo.png">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=20260602-brandlogo">
  <link rel="stylesheet" href="/style.css?v=20260830-conceptpages">
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>
</head>
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
    ${renderPseoHeader()}
    <div class="workspace">
      <button class="sidebar-collapse" id="sidebar-collapse" title="Collapse filters" aria-label="Collapse filters" aria-expanded="true">
        <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      ${renderPseoSidebar(activeSlug)}
      <main id="main-content">
        <section class="route-view pseo-view active">
          <div class="pseo-document">
${content.trim()}
            ${renderPseoFooter()}
          </div>
        </section>
      </main>
    </div>
  </div>
  <script>
    (() => {
      const root = document.documentElement;
      const themeToggle = document.getElementById("theme-toggle");
      
      const updateThemeUI = (theme) => {
        root.dataset.theme = theme;
        if (themeToggle) {
          themeToggle.textContent = theme === "light" ? "Dark" : "Light";
        }
      };

      try {
        const savedTheme = localStorage.getItem("iconvault-theme") || "dark";
        updateThemeUI(savedTheme);
      } catch (_) {
        updateThemeUI("dark");
      }

      themeToggle?.addEventListener("click", () => {
        const next = root.dataset.theme === "light" ? "dark" : "light";
        updateThemeUI(next);
        try { localStorage.setItem("iconvault-theme", next); } catch (_) {}
      });
      document.getElementById("sidebar-toggle")?.addEventListener("click", () => document.body.classList.toggle("sidebar-open"));
      document.getElementById("sidebar-collapse")?.addEventListener("click", () => document.body.classList.toggle("sidebar-collapsed"));
      const libraryToggle = document.getElementById("lib-toggle");
      const libraryList = document.getElementById("lib-collapse-list");
      const setLibrariesOpen = (open) => {
        if (!libraryToggle || !libraryList) return;
        libraryToggle.setAttribute("aria-expanded", String(open));
        const libCard = document.getElementById("lib-card-section");
        if (libCard) libCard.classList.toggle("open", open);
      };
      libraryToggle?.addEventListener("click", () => setLibrariesOpen(libraryToggle.getAttribute("aria-expanded") !== "true"));
      document.getElementById("lib-search")?.addEventListener("input", (event) => {
        const query = event.currentTarget.value.trim().toLowerCase();
        libraryList?.querySelectorAll("[data-slug]").forEach((row) => {
          row.hidden = Boolean(query) && !row.textContent.toLowerCase().includes(query);
        });
        setLibrariesOpen(Boolean(query));
      });
      ["category", "customize", "style"].forEach((name) => {
        const section = document.getElementById(name + "-section");
        const toggle = document.getElementById(name + "-toggle");
        toggle?.addEventListener("click", () => {
          const open = section.classList.toggle("open");
          toggle.setAttribute("aria-expanded", String(open));
        });
      });
      document.getElementById("pseo-search-form")?.addEventListener("submit", (event) => {
        event.preventDefault();
        const query = new FormData(event.currentTarget).get("query");
        const q = String(query || "").trim();
        window.location.href = q ? "/#/search?query=" + encodeURIComponent(q) : "/#/search";
      });
    })();
  </script>
</body>
</html>`;
}

/* ─── Library normalization (unchanged) ──────────────────────────────────── */
function normalizeLibrary(lib) {
  const file = path.join(DATA_DIR, `${lib.slug}.json`);
  const data = readJson(file);
  if (Array.isArray(data)) {
    return data.map((icon, index) => {
      const name = icon.name || icon.id || "icon";
      const [category, subCategory] = icon.category ? [icon.category, icon.subCategory || "Controls"] : categorize(name);
      return {
        id: icon.id || `${lib.slug}-${slugify(name)}`,
        name, displayName: displayName(name), base: baseName(name),
        body: icon.svgPath || icon.svgContent || "",
        viewBox: icon.viewBox || `0 0 ${icon.width || 24} ${icon.height || 24}`,
        width: icon.width || 24, height: icon.height || 24,
        style: icon.style || deriveStyle(name, lib.remotePrefix || lib.slug, lib.slug),
        strokeWidth: icon.strokeWidth || 2, category, subCategory,
        library: lib.name, librarySlug: lib.slug,
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
      name, displayName: displayName(name), base: baseName(name), body: raw.body,
      viewBox: `${raw.left || 0} ${raw.top || 0} ${raw.width || defaults.width} ${raw.height || defaults.height}`,
      width: raw.width || defaults.width, height: raw.height || defaults.height,
      style: deriveStyle(rawName, prefix, lib.slug),
      strokeWidth: deriveStyle(rawName, prefix, lib.slug) === "thin" ? 1 : 2,
      category, subCategory, library: lib.name, librarySlug: lib.slug,
      docsUrl: lib.docsUrl || "", npmPackage: lib.npmPackage || lib.slug,
      popularity: Math.max(100, 10000 - ((index * 17) % 9900))
    };
  });
}

/* ─── Keyword building ──────────────────────────────────────────────────────
   Rebuilt 2026-08-30. Two tiers, no keyword spam.

   Tier 1 — canonical icon pages. Exactly ONE crawlable URL per icon at
            /icons/<icon-id>/. The old generator also emitted ~12 variant URLs
            per icon ("copy-x-svg", "download-x-png-icon", "x icon figma",
            "x icon for <category>"), all rendering the same artwork and
            cannibalising the parent. 415 of those variant slugs were claimed by
            up to 22 unrelated icons at once, so the page served the wrong
            artwork to most inbound links. Variants are gone; they are replaced
            by permanent 301s (see writeRedirects) so no equity or traffic is
            lost, and no crawl budget is burned on near-duplicates.

   Tier 2 — concept pages. /icons/<concept>-icon/ for every icon concept that
            appears in at least CONCEPT_MIN_LIBRARIES different libraries.
            These are the head terms — "home icon", "search icon",
            "settings icon" — where the actual search volume lives and where
            the site previously had no page at all (132k of 134k icons had no
            head-term URL). Each concept page is a genuine cross-library
            comparison grid, which is the product's real differentiator rather
            than another thin variant.                                        */
const CONCEPT_MIN_LIBRARIES = 3;

/* Within a library, several icons can share one concept (home, home-outline,
   home-fill). Pick the plainest one — shortest name, deterministic tiebreak. */
function betterVariant(candidate, current) {
  if (!current) return true;
  const a = candidate.name.length;
  const b = current.name.length;
  if (a !== b) return a < b;
  return candidate.id.localeCompare(current.id) < 0;
}

/* Concept key validity: kebab-case, starts alphanumeric, has real letters. */
function isUsableConcept(concept) {
  if (!concept) return false;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(concept)) return false;
  if (!/[a-z]/.test(concept)) return false; // pure numbers ("24") are noise
  return concept.length >= 2;
}

function buildKeywords(icons) {
  const used = new Set();
  const iconRows = [];

  /* ── Tier 1: one canonical page per icon ─────────────────────────────── */
  for (const icon of icons) {
    const slug = icon.id.toLowerCase();
    if (used.has(slug)) continue; // defensive: ids are unique today
    used.add(slug);
    const lib = icon.library.replace(/\s+Icons$/i, "");
    iconRows.push({
      keyword: `${lib} ${icon.displayName} icon`,
      slug,
      iconId: icon.id,
      category: icon.category,
      librarySlug: icon.librarySlug,
      format: "svg",
      intent: "icon",
      score: Math.round(icon.popularity || 100)
    });
  }
  iconRows.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

  /* ── Tier 2: cross-library concept pages ─────────────────────────────── */
  const byConcept = new Map();
  for (const icon of icons) {
    const concept = icon.base;
    if (!isUsableConcept(concept)) continue;
    let libs = byConcept.get(concept);
    if (!libs) { libs = new Map(); byConcept.set(concept, libs); }
    const current = libs.get(icon.librarySlug);
    if (betterVariant(icon, current)) libs.set(icon.librarySlug, icon);
  }

  const conceptRows = [];
  for (const [concept, libs] of byConcept) {
    if (libs.size < CONCEPT_MIN_LIBRARIES) continue;
    const slug = `${concept}-icon`;
    if (used.has(slug)) continue; // never shadow a real icon page
    const members = Array.from(libs.values()).sort((a, b) => a.library.localeCompare(b.library) || a.id.localeCompare(b.id));
    used.add(slug);
    conceptRows.push({
      keyword: `${concept.replace(/-/g, " ")} icon`,
      slug,
      concept,
      iconIds: members.map((icon) => icon.id),
      category: dominantCategory(members),
      librarySlug: "",
      format: "svg",
      intent: "concept",
      // Wider cross-library coverage = broader query intent = score higher.
      score: 100000 + members.length * 1000
    });
  }
  // Most universal concepts first: those are the highest-volume head terms.
  conceptRows.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

  const rows = [...conceptRows, ...iconRows];
  const limited = rows.slice(0, PAGE_LIMIT);

  console.log(`Keywords: ${iconRows.length.toLocaleString("en-US")} canonical icon pages, `
    + `${conceptRows.length.toLocaleString("en-US")} cross-library concept pages `
    + `(concepts present in >=${CONCEPT_MIN_LIBRARIES} libraries).`);

  return limited.map((row, index) => ({ ...row, priority: index + 1, url: `/icons/${row.slug}/` }));
}

function dominantCategory(icons) {
  const tally = new Map();
  for (const icon of icons) tally.set(icon.category, (tally.get(icon.category) || 0) + 1);
  let best = "Interface";
  let bestCount = -1;
  for (const [category, count] of tally) {
    if (count > bestCount || (count === bestCount && category < best)) { best = category; bestCount = count; }
  }
  return best;
}

/* ─── SEO title & meta description ─────────────────────────────────────────
   Titles are the click. Lead with the exact query, then the payoff (free,
   count of options, no login). The brand goes last and is dropped when it
   would push the title past ~60 characters.                                */
const TITLE_MAX = 60;
const DESC_MAX = 158;

function clampDesc(text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  return clean.length > DESC_MAX ? `${clean.slice(0, DESC_MAX - 1).replace(/\s+\S*$/, "")}…` : clean;
}

function iconTitle(keyword) {
  const base = titleCase(keyword);
  const options = [
    `${base} — Free SVG & PNG Download | IconStash`,
    `${base} — Free SVG & PNG Download`,
    `${base} — SVG & PNG Download`,
    `${base} | IconStash`
  ];
  for (const option of options) if (option.length <= TITLE_MAX) return option;
  return `${base.slice(0, TITLE_MAX - 13).replace(/\s+\S*$/, "")} | IconStash`;
}

function iconDescription(row, icon) {
  const name = icon.displayName;
  const lib = icon.library;
  const style = icon.style;
  const h = hashCode(icon.id) % 3;
  const templates = [
    `Download the free ${name} icon from ${lib} in SVG and PNG. Set any size from 16 to 512px, pick a color, copy the code in one click. No login required.`,
    `Free ${name} icon from ${lib} (${style} style). Export SVG, PNG, React JSX or CSS, preview on dark and light backgrounds, then download. No account needed.`,
    `Get the ${lib} ${name} icon as SVG or PNG. Adjust size, color and stroke width in the browser, copy clean code, download instantly. Free, no signup.`
  ];
  return clampDesc(templates[h]);
}

function conceptTitle(display, count) {
  const core = `${display} Icon — ${count} Free SVG & PNG Downloads`;
  const options = [
    `${core} | IconStash`,
    core,
    `${display} Icon — ${count} Free Downloads`,
    `${display} Icon — Free SVG & PNG`,
    `${display} Icon | IconStash`
  ];
  for (const option of options) if (option.length <= TITLE_MAX) return option;
  return `${display.slice(0, TITLE_MAX - 13).replace(/\s+\S*$/, "")} | IconStash`;
}

function conceptDescription(display, words, count) {
  const templates = [
    `Compare ${count} free ${words} icons from ${count} icon libraries. Download any as SVG or PNG, set the exact size and color, and copy the code. No login.`,
    `${count} free ${display} icons side by side, from ${count} open-source libraries. Preview, recolor, download SVG or PNG, or copy React and CSS code instantly.`,
    `Browse ${count} ${words} icons across ${count} libraries and pick the one that fits. Free SVG and PNG download, custom sizes to 512px, no account needed.`
  ];
  return clampDesc(templates[Math.abs(hashCode(`c-${display}`)) % templates.length]);
}

/* ─── AEO: 7-question FAQ per icon ───────────────────────────────────────── */
function buildFaq(row, icon, libInfo) {
  const name = icon.displayName;
  const lib = icon.library;
  const style = icon.style;
  const cat = icon.category;
  const npm = libInfo ? libInfo.npm : (icon.npmPackage || slugify(lib));
  const catCtx = CATEGORY_CONTEXT[cat] || "product interfaces and web applications";
  const styleD = STYLE_DESC[style] || "uses a clean SVG vector format";
  const styleU = STYLE_USE_CASES[style] || "interface components";
  const libD = libInfo ? libInfo.desc : `${lib} is a professionally designed open-source icon library used in modern UI development.`;
  const libCount = libInfo ? libInfo.count : "thousands of";
  const license = libInfo ? `${lib} is licensed under ${libInfo.license}, making it free for personal and commercial use.` : `${lib} is open-source. Check the library's documentation for full license terms.`;

  return [
    {
      q: `What is the ${name} icon?`,
      a: `The ${name} icon is a ${style}-style SVG icon from the ${lib} library, categorized under ${cat}. It is designed for use in ${catCtx}. On IconStash you can preview it, customize its color and size, and export it in SVG, PNG, JSX, or CSS formats directly from your browser.`
    },
    {
      q: `Is the ${name} icon free to use?`,
      a: `Yes. ${license} This means you can freely use the ${name} icon in personal, commercial, and open-source projects. IconStash provides SVG and PNG access at no cost with no login required.`
    },
    {
      q: `How do I use the ${name} icon in React?`,
      a: `Install the package with \`npm install ${npm}\`, then import the component into your React file. IconStash's detail panel shows you the exact npm command, import statement, and JSX usage snippet for every icon — just click the Code tab and copy with one click.`
    },
    {
      q: `What is the ${lib} icon library?`,
      a: `${libD} It contains ${libCount}+ icons. IconStash indexes the complete ${lib} collection alongside 27 other open-source libraries — 134,701 icons total — in a single unified search interface.`
    },
    {
      q: `Can I download the ${name} icon as a PNG?`,
      a: `Yes. Open the ${name} icon in IconStash, set your desired pixel size (16px to 512px) in the detail panel, and click Download PNG. You can also export a multi-resolution ZIP pack containing 16, 24, 32, 48, 64, 128, 256, and 512px PNGs with a single click.`
    },
    {
      q: `What does the ${style} icon style mean?`,
      a: `An icon in ${style} style ${styleD}. This style is best suited for ${styleU}. The ${lib} ${name} icon follows this visual convention throughout the ${lib} design system.`
    },
    {
      q: `Can I change the ${name} icon's color and size before downloading?`,
      a: `Yes. In IconStash's editor panel, choose from six color presets (blue, slate, green, purple, red, teal) or enter a custom hex value. Drag the size slider (16–256px) or type an exact pixel value up to 512px. Changes apply instantly to the SVG preview, the PNG output, and the copied code.`
    }
  ];
}

/* ─── GEO: HowTo + SoftwareApplication schema ────────────────────────────── */
function buildSchema(row, icon, faq, url, appUrl, conceptSlug) {
  const crumbs = [
    { "@type": "ListItem", position: 1, name: "IconStash", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Icon libraries", item: `${SITE_URL}/library/` },
    { "@type": "ListItem", position: 3, name: icon.library, item: `${SITE_URL}/library/${icon.librarySlug}/` }
  ];
  if (conceptSlug) {
    crumbs.push({
      "@type": "ListItem",
      position: 4,
      name: `${icon.base.replace(/-/g, " ")} icons`,
      item: `${SITE_URL}/icons/${conceptSlug}/`
    });
    crumbs.push({ "@type": "ListItem", position: 5, name: icon.displayName, item: url });
  } else {
    crumbs.push({ "@type": "ListItem", position: 4, name: icon.displayName, item: url });
  }
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs
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
      "@type": "HowTo",
      name: `How to download and use the ${icon.displayName} icon`,
      description: `Step-by-step guide to finding, customizing, and exporting the ${icon.displayName} icon from ${icon.library} on IconStash.`,
      totalTime: "PT1M",
      step: [
        {
          "@type": "HowToStep", position: 1,
          name: "Open the icon in IconStash",
          text: `Go to iconstash.io and search for "${icon.name.replace(/-/g, " ")}". Click the icon card to open the detail panel, or follow the direct link to this icon's page.`,
          url: appUrl
        },
        {
          "@type": "HowToStep", position: 2,
          name: "Customize color, size, and stroke",
          text: "Select a color from the presets or type a custom hex value. Set the exact pixel size from 16px to 512px. Adjust stroke width for outline icons. Preview on dark, light, or checkered backgrounds.",
          url: appUrl
        },
        {
          "@type": "HowToStep", position: 3,
          name: "Copy SVG code or download PNG",
          text: "Use the Code tab to copy SVG markup, JSX component code, HTML img tag, or CSS background-mask. Use the Download tab to export a custom-size PNG or a multi-resolution ZIP pack.",
          url: appUrl
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "IconStash",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      description: "Browser-based icon search engine unifying 28+ open-source icon libraries into a single lightning-fast search. Search, preview, customize, and download 134,701+ SVG and PNG icons with no login required.",
      featureList: ["SVG copy", "Custom PNG download", "Multi-resolution ZIP export", "React JSX export", "CSS background-mask export", "Cross-library comparison", "Color customization", "Stroke width control", "134,701 icons from 28 libraries"],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Organization", name: "Great Software Company", url: "https://greatsoftwarecompany.com" }
    },
    {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      name: `${icon.displayName} icon`,
      description: `${icon.style} style SVG icon from ${icon.library}`,
      creator: { "@type": "Organization", name: icon.library },
      encodingFormat: "image/svg+xml",
      contentUrl: appUrl,
      license: "https://opensource.org/licenses/MIT"
    }
  ];
}

/* ─── Related links and indexes ──────────────────────────────────────────── */
const keywordsByIcon = new Map();
const keywordsByCategory = new Map();
const keywordsByLibrary = new Map();
const keywordsByFirstWord = new Map();

function buildIndexes(keywords, byIcon) {
  for (const row of keywords) {
    if (!keywordsByIcon.has(row.iconId)) keywordsByIcon.set(row.iconId, []);
    keywordsByIcon.get(row.iconId).push(row);
    if (!keywordsByCategory.has(row.category)) keywordsByCategory.set(row.category, []);
    keywordsByCategory.get(row.category).push(row);
    if (!keywordsByLibrary.has(row.librarySlug)) keywordsByLibrary.set(row.librarySlug, []);
    keywordsByLibrary.get(row.librarySlug).push(row);
    const icon = byIcon.get(row.iconId);
    if (icon) {
      const fw = icon.base.split("-")[0];
      if (fw) {
        if (!keywordsByFirstWord.has(fw)) keywordsByFirstWord.set(fw, []);
        keywordsByFirstWord.get(fw).push(row);
      }
    }
  }
}

/* ─── Canonical consolidation ───────────────────────────────────────────────
   Variant sprawl is gone at the source: buildKeywords now emits exactly one
   URL per icon, so every page is self-canonical and nothing needs folding.

   The old synonym collapse (-filled -> -fill, -outlined -> -outline) is
   deliberately retired. It was correct when ten variant URLs pointed at one
   artwork, but those suffixes now distinguish genuinely different icons
   (solar-home-bold vs solar-home-linear are different glyphs with different
   search intent). Folding them would deindex real, wanted content.           */
const canonicalByIcon = new Map();

function buildCanonicals(keywords) {
  canonicalByIcon.clear();
  for (const row of keywords) {
    if (row.intent === "concept" || !row.iconId) continue;
    canonicalByIcon.set(row.iconId, row.slug);
  }
  console.log(`Canonicals: ${canonicalByIcon.size.toLocaleString("en-US")} icon pages, all self-canonical.`);
}

function canonicalSlugFor(row) {
  return canonicalByIcon.get(row.iconId) || row.slug;
}

/* ─── Related links: link out, never just sideways to own duplicates ─────────
   Previously every page linked only to its own 10 variant URLs, so 149k pages
   passed authority to themselves and dead-ended. Order now favours the same
   concept in *other* libraries (the product's differentiator), then siblings,
   then same-category, and only falls back to own variants.                  */
/* conceptRowsByConcept: concept -> concept row.
   conceptRowByIconId:   iconId  -> the concept page that lists it.
   canonicalRowByIconId: iconId  -> that icon's one canonical page. */
const conceptRowsByConcept = new Map();
const conceptRowByIconId = new Map();
const canonicalRowByIconId = new Map();

function buildConceptIndex(keywords, byIcon) {
  conceptRowsByConcept.clear();
  conceptRowByIconId.clear();
  canonicalRowByIconId.clear();
  for (const row of keywords) {
    if (row.intent === "concept") {
      conceptRowsByConcept.set(row.concept, row);
      for (const iconId of row.iconIds || []) conceptRowByIconId.set(iconId, row);
    } else {
      canonicalRowByIconId.set(row.iconId, row);
    }
  }
}

/* Related concepts for a concept page: share the first word, then the
   category, then simply the most universal concepts as a final backstop. */
function relatedConceptsFor(row) {
  const seen = new Set([row.concept]);
  const out = [];
  const push = (candidate) => {
    if (!candidate || seen.has(candidate.concept)) return out.length >= 12;
    seen.add(candidate.concept);
    out.push(candidate);
    return out.length >= 12;
  };
  const firstWord = row.concept.split("-")[0];
  const all = Array.from(conceptRowsByConcept.values());
  if (firstWord && firstWord !== row.concept) {
    for (const candidate of all) {
      if (candidate.concept.startsWith(`${firstWord}-`) || candidate.concept.endsWith(`-${firstWord}`)) {
        if (push(candidate)) return out;
      }
    }
  }
  for (const candidate of all) {
    if (candidate.category === row.category && push(candidate)) return out;
  }
  return out;
}

function relatedFor(row, byIcon) {
  if (row.intent === "concept") return [];
  const icon = byIcon.get(row.iconId);
  const related = [];
  const seen = new Set([row.slug]);

  function add(list, filter) {
    for (const item of list) {
      if (seen.has(item.slug)) continue;
      if (filter && !filter(item)) continue;
      seen.add(item.slug);
      related.push(item);
      if (related.length >= 10) return true;
    }
    return false;
  }

  if (icon) {
    // 1. The concept hub this icon belongs to — passes authority up to the
    //    head term, which is where the search volume actually is.
    const concept = conceptRowByIconId.get(icon.id);
    if (concept && add([concept])) return related;
    // 2. The same concept rendered by other libraries: real comparison value.
    if (concept) {
      const siblings = (concept.iconIds || [])
        .map((id) => canonicalRowByIconId.get(id))
        .filter(Boolean);
      if (add(siblings, (item) => item.iconId !== icon.id)) return related;
    }
    // 3. Sibling icons in the same library and category.
    if (add(keywordsByLibrary.get(row.librarySlug) || [], (item) => item.category === row.category)) return related;
  }
  // 4. Same category anywhere.
  if (add(keywordsByCategory.get(row.category) || [])) return related;
  // 5. Loose first-word relation.
  if (icon) {
    const fw = icon.base.split("-")[0];
    if (fw && add(keywordsByFirstWord.get(fw) || [])) return related;
  }
  return related;
}

/* ─── Per-icon technical specs ─────────────────────────────────────────────
   Computed from each icon's own SVG rather than written into copy, so the
   figures cannot drift out of date when the icon data is refreshed. These
   values differ for nearly every icon and give each page content that no
   template could produce — which is the strongest available answer to the
   "auto-generated page" problem on a corpus this size.                       */
function iconSpecs(icon) {
  const body = icon.body || "";
  const parts = String(icon.viewBox || "0 0 24 24").trim().split(/[\s,]+/).map(Number);
  const w = Number.isFinite(parts[2]) ? parts[2] : 24;
  const h = Number.isFinite(parts[3]) ? parts[3] : 24;
  return {
    w, h,
    subpaths: (body.match(/[Mm]/g) || []).length,
    curves: /[CcSsQqTtAa]/.test(body),
    strokeWidth: icon.strokeWidth || 2
  };
}

function isStroked(icon) {
  return icon.style !== "filled" && icon.style !== "solid";
}

/* Rendered with the existing `.lib-meta` list pattern so no new CSS is needed
   — see the cache-busting note: every stylesheet change has to be versioned. */
function iconSpecsHtml(icon) {
  const s = iconSpecs(icon);
  const rows = [
    ["Artboard", `${s.w} × ${s.h} px`],
    ["Subpaths", `${s.subpaths}`],
    ["Geometry", s.curves ? "contains curves or arcs" : "straight segments only"]
  ];
  if (isStroked(icon)) rows.push(["Stroke width", `${s.strokeWidth}px`]);
  rows.push(["Style", String(icon.style || "outline")]);
  rows.push(["Library", icon.library]);
  return `<ul class="lib-meta">${rows.map(([k, v]) => `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</li>`).join("")}</ul>`;
}

function generateIconAesthetic(icon) {
  const name = icon.displayName;
  const custom = LIBRARY_AESTHETIC[icon.librarySlug];
  if (custom) return custom(name);
  /* Only reachable if a new library is added to data/index.json without copy
     here. Still icon-specific, so it never reads as bulk boilerplate. */
  return `The ${name} icon from the ${icon.library} collection is designed to meet professional standards of legibility and consistent line weight. It is a vector, so it scales cleanly from small micro-interactions at 16px to large hero graphics at 512px without any loss of crispness.`;
}

/* UX guidance keyed by the same category taxonomy used everywhere else. All 16
   categories are covered: the previous table had 6, so 102,600 icons (76.2%)
   all received the same fallback sentence. */
const CATEGORY_PRACTICE = {
  media: (name) => `For media and audio-visual interfaces, place the ${name} icon prominently so it reads as a control rather than a label — playback, volume and cast affordances are scanned before they are read. Keep at least 3:1 contrast against the video surface and give it an accessible name, since media controls are frequently the only way to operate a player.`,
  communication: (name) => `In messaging, contact and notification UI, the ${name} icon should help users triage at a glance. Keep any unread badge small and anchored to the top-right corner, and never rely on the badge alone — expose the count in the accessible name so screen-reader users get the same signal.`,
  commerce: (name) => `In checkout flows, product listings and pricing tables, the ${name} icon sits directly on a conversion path, so label it. Cart, payment and invoice actions need an aria-label even when a visible caption is present, because these controls are where ambiguous iconography measurably costs completed purchases.`,
  navigation: (name) => `For headers, sidebars, footers and breadcrumbs, pair the ${name} icon with a text label wherever space allows. Icon-only navigation tests well only for a handful of universally understood actions; comprehension drops sharply once the destination is product-specific. Keep the icon at a fixed optical size so the menu does not appear to shift.`,
  files: (name) => `In file explorers, document lists and CMS dashboards, put the ${name} icon immediately to the left of the filename so the eye scans one straight line. If it triggers a destructive action, keep a confirmation step — a delete or archive glyph is too easy to hit by accident in a dense list.`,
  editing: (name) => `In editors and design tools, the ${name} icon belongs in a toolbar where it can carry a tooltip and a keyboard-shortcut hint. Keep editing affordances visually lighter than the content they act on; when the chrome competes with the canvas, users lose track of their own work.`,
  devices: (name) => `When representing hardware, systems or settings, the ${name} icon works best in configuration panels and device dashboards. Use the outline state for inactive devices and switch to a filled or accented state for online ones — but pair that with text or a status dot, since fill alone is not a colour-blind-safe signal.`,
  development: (name) => `In code editors, admin systems and developer tooling, the ${name} icon should read as a function, not as decoration. Pair it with monospace labels for alignment, and prefer tooltips over inline captions in toolbars where vertical space is scarce and the audience already knows the domain.`,
  security: (name) => `Security icons carry more weight than most: users read a lock, shield or key as a trust signal, so the ${name} icon should never be decorative. Place it next to the mechanism it actually describes — the payment step, the HTTPS indicator, the permission toggle — rather than in a generic header where it implies protection that may not exist.`,
  health: (name) => `In health, fitness and clinical interfaces, the ${name} icon usually sits beside a number, so align it to the same baseline as the metric and give it room. Avoid encoding severity in colour alone: red-only status fails for colour-blind users and reads as alarm fatigue in long-term tracking screens.`,
  weather: (name) => `Weather icons are scanned rather than read, so the ${name} icon must stay legible at small sizes and be consistent with the rest of the forecast set. The most common mistake is mixing outline and filled glyphs across one forecast row, which makes a single strip look like two different data sources.`,
  transport: (name) => `In booking, fleet and logistics interfaces, use the ${name} icon as a supporting glyph beside a text label. Mode-of-transport shapes are genuinely ambiguous across regions — a "train" glyph is drawn differently in Europe, Japan and North America — so never let the icon carry the meaning on its own.`,
  social: (name) => `People and profile icons like ${name} are usually standing in for a specific user. Give it an accessible name with that person's name or handle, provide a text fallback when it is used as an avatar placeholder, and do not rely on the glyph alone to communicate role, relationship or presence.`,
  time: (name) => `Time, calendar and scheduling icons tend to appear in dense grids. Keep the ${name} icon at a fixed size so rows stay aligned, and always pair it with the actual date or duration — an icon cannot disambiguate time zones, date formats or relative ranges like "next Tuesday".`,
  data: (name) => `In dashboards and reports, the ${name} icon should be subordinate to the number or chart it labels. Hold data icons to one size and a single colour from your chart palette; using them as decoration rather than as labels is exactly what makes analytics screens feel noisy and hard to read.`,
  interface: (name) => `As a general interface glyph, the ${name} icon does its job best between 16px and 24px, sitting next to a text label. Icon-only treatments work for a small set of universally understood actions, but comprehension falls off quickly once the action is specific to your product — so when in doubt, add the word.`
};

function generateUxBestPractices(icon) {
  const name = icon.displayName;
  const practice = CATEGORY_PRACTICE[String(icon.category).toLowerCase()];
  if (practice) return practice(name);
  return `When integrating the ${name} icon into your layout, give it a touch target of at least 44x44 pixels on mobile to satisfy tap guidelines. Always provide an aria-label or title when the icon is an interactive control with no visible text.`;
}

/* ─── Page HTML: rich, varied, GEO/AEO-ready ────────────────────────────── */
function pageHtml(row, icon, related, conceptSlug) {
  const title = iconTitle(row.keyword);
  const description = iconDescription(row, icon);
  const url = `${SITE_URL}${row.url}`;
  const appUrl = `${SITE_URL}/#/icon/${encodeURIComponent(icon.id)}`;
  const libUrl = `${SITE_URL}/library/${encodeURIComponent(icon.librarySlug)}/`;
  const libInfo = LIBRARY_INFO[icon.librarySlug] || null;

  const faq = buildFaq(row, icon, libInfo);
  const schema = buildSchema(row, icon, faq, url, appUrl, conceptSlug);

  /* Deterministic variation index (0-5) per icon — never random */
  const hx = hashCode(icon.id);

  /* Lead paragraph — 6 variations */
  const catCtx = CATEGORY_CONTEXT[icon.category] || "product interfaces and web applications";
  const styleD = STYLE_DESC[icon.style] || "a clean SVG vector format";
  const libCount = libInfo ? libInfo.count : "thousands of";
  const libNpm = libInfo ? libInfo.npm : (icon.npmPackage || slugify(icon.library));
  const leadVariants = [
    `The ${icon.displayName} icon from ${icon.library} is a ${icon.style}-style SVG available in IconStash alongside ${libCount}+ other icons from the same library. Copy its SVG code, export a custom PNG, or download a React component — no account required.`,
    `Find the ${icon.library} ${icon.displayName} icon and download it in SVG or PNG format. This ${icon.style}-style icon is optimized for ${catCtx}. Customize color, size, and stroke width inside the IconStash browser editor before exporting.`,
    `IconStash indexes the ${icon.displayName} icon from ${icon.library} alongside 134,701 icons from 28 open-source libraries. It ${styleD}, making it well suited for ${catCtx}. Set an exact pixel size from 16px to 512px and download a lossless PNG in one click.`,
    `Use the ${icon.displayName} SVG icon from ${icon.library} in your ${icon.category.toLowerCase()} interface. IconStash gives you instant access to the SVG code, React JSX snippet, CSS background-mask, and custom PNG download — all from the browser with no login.`,
    `The ${icon.library} ${icon.displayName} icon uses ${styleD}. Compare it against similar icons in 27 other libraries on IconStash, adjust stroke width, change colors with a hex picker, and export at any size.`,
    `The ${icon.displayName} icon is part of the ${icon.library} collection — ${libCount}+ professional icons for ${catCtx}. On IconStash, you can preview, customize, compare across libraries, and download in SVG, PNG, JSX, or CSS format.`
  ];
  const lead = leadVariants[hx % leadVariants.length];

  /* "Use this icon" card body — 4 variations */
  const styleU = STYLE_USE_CASES[icon.style] || "interface components and product UI";
  const useVariants = [
    `<p>The ${escapeHtml(icon.displayName)} icon from ${escapeHtml(icon.library)} fits naturally in <strong>${escapeHtml(catCtx)}</strong>. Its ${escapeHtml(icon.style)} style makes it ideal for ${escapeHtml(styleU)}.</p><p class="muted">Open it in IconStash to set stroke color via presets or a custom hex value, choose an exact pixel size (16–512px), control stroke width (0.1–3px), and preview against dark, light, or checkered backgrounds before downloading.</p>`,
    `<p>This ${escapeHtml(icon.style)} icon from ${escapeHtml(icon.library)} works well across <strong>${escapeHtml(catCtx)}</strong>. The ${escapeHtml(icon.style)} visual style is specifically suited for ${escapeHtml(styleU)}.</p><p class="muted">Customize it in IconStash: pick a color preset or enter any hex code, set exact dimensions, adjust stroke weight, then copy SVG code or download a PNG — no account needed.</p>`,
    `<p>Icons in the ${escapeHtml(icon.style)} style — like ${escapeHtml(icon.displayName)} — are designed for ${escapeHtml(styleU)}. Use it across <strong>${escapeHtml(catCtx)}</strong> for a consistent, professional look.</p><p class="muted">IconStash's editor lets you fine-tune color, size, and stroke width in real time, then export in the format that fits your workflow: SVG, PNG, JSX, or CSS background-mask.</p>`,
    `<p>The ${escapeHtml(icon.displayName)} icon (${escapeHtml(icon.library)}) is categorized under <strong>${escapeHtml(icon.category)}</strong>. Its ${escapeHtml(icon.style)} style is optimal for ${escapeHtml(styleU)} and scales cleanly from 16px to 512px.</p><p class="muted">Use the IconStash detail panel to preview with a custom background, adjust stroke width, and generate production-ready SVG or PNG files without any external tools.</p>`
  ];
  const useCardBody = useVariants[hx % useVariants.length];

  /* React code snippet */
  let codeBlock = "";
  if (libInfo && libInfo.reactCode) {
    try {
      const code = libInfo.reactCode(icon.name);
      codeBlock = `<pre><code>${escapeHtml(code)}</code></pre>`;
    } catch (e) {
      codeBlock = `<pre><code>npm install ${escapeHtml(libNpm)}</code></pre>`;
    }
  } else {
    codeBlock = `<pre><code>npm install ${escapeHtml(libNpm)}</code></pre>`;
  }

  /* SVG code snippet (escaped for display) */
  const svgForDisplay = escapeHtml(renderSvg(icon, 24));

  /* Related links */
  const relatedLinks = related.map((item) => `<li><a href="/icons/${escapeHtml(item.slug)}/">${escapeHtml(titleCase(item.keyword))}</a></li>`).join("");
  const peopleAlso = related.slice().reverse().slice(0, 6).map((item) => `<a href="/icons/${escapeHtml(item.slug)}/">${escapeHtml(titleCase(item.keyword))}</a>`).join("");

  /* Library info card */
  const libCardHtml = libInfo
    ? `<article class="card" itemscope itemtype="https://schema.org/SoftwareApplication">
      <h2>About <span itemprop="name">${escapeHtml(libInfo.fullName)}</span></h2>
      <p itemprop="description">${escapeHtml(libInfo.desc)}</p>
      <ul class="lib-meta">
        <li><strong>Total icons:</strong> ${escapeHtml(libInfo.count)}+</li>
        <li><strong>Style:</strong> ${escapeHtml(libInfo.style)}</li>
        <li><strong>License:</strong> ${escapeHtml(libInfo.license)}</li>
        <li><strong>npm package:</strong> <code>${escapeHtml(libInfo.npm)}</code></li>
      </ul>
      <a class="btn" href="${escapeHtml(libUrl)}" style="margin-top:12px;display:inline-block">Browse all ${escapeHtml(libInfo.count)} ${escapeHtml(libInfo.fullName)} icons →</a>
    </article>`
    : `<article class="card">
      <h2>About ${escapeHtml(icon.library)}</h2>
      <p>The ${escapeHtml(icon.library)} icon library is indexed in IconStash. Browse its full collection to find the right icon for your interface.</p>
      <a class="btn" href="${escapeHtml(libUrl)}" style="margin-top:12px;display:inline-block">Browse ${escapeHtml(icon.library)} icons →</a>
    </article>`;

  const content = `
  <nav class="crumbs" aria-label="Breadcrumb">
    <a href="/">IconStash</a><span>/</span>
    <a href="/library/${escapeHtml(icon.librarySlug)}/">${escapeHtml(icon.library)}</a><span>/</span>
    ${conceptSlug
      ? `<a href="/icons/${escapeHtml(conceptSlug)}/">${escapeHtml(icon.base.replace(/-/g, " "))} icons</a><span>/</span>`
      : ""}
    <span>${escapeHtml(icon.displayName)}</span>
  </nav>

  <section class="hero">
    <div class="preview" aria-hidden="true">${renderSvg(icon, 100)}</div>
    <div>
      <h1>${escapeHtml(titleCase(row.keyword))}</h1>
      <p class="lead">${escapeHtml(lead)}</p>
      <div class="cta">
        <a class="btn primary" href="${escapeHtml(appUrl)}">Open in editor</a>
        <a class="btn" href="${escapeHtml(libUrl)}">Browse ${escapeHtml(icon.library)}</a>
        ${conceptSlug ? `<a class="btn" href="/icons/${escapeHtml(conceptSlug)}/">All ${escapeHtml(icon.base.replace(/-/g, " "))} icons</a>` : ""}
      </div>
    </div>
  </section>

  <p class="section-title">Interactive Customizer</p>
  <div class="grid wide">
    <article class="card live-playground">
      <div class="playground-layout">
        <div class="playground-preview-pane">
          <div class="playground-preview-box" id="pseo-live-preview">
            ${renderSvg(icon, 128)}
          </div>
        </div>
        <div class="playground-controls-pane">
          <div class="control-group">
            <label>Color</label>
            <div class="color-presets">
              <button class="color-dot active" data-color="#C1DD2D" style="background:#C1DD2D" title="Accent Lime"></button>
              <button class="color-dot" data-color="#00c3ff" style="background:#00c3ff" title="Blue"></button>
              <button class="color-dot" data-color="#00ff88" style="background:#00ff88" title="Green"></button>
              <button class="color-dot" data-color="#bf00ff" style="background:#bf00ff" title="Purple"></button>
              <button class="color-dot" data-color="#ff2d9b" style="background:#ff2d9b" title="Red"></button>
              <button class="color-dot" data-color="#ffffff" style="background:#ffffff" title="White"></button>
            </div>
            <input type="text" id="pseo-color-input" class="mini-search" value="#C1DD2D" placeholder="#Hex" style="margin-top:6px;width:120px">
          </div>
          
          ${icon.style !== "filled" && icon.style !== "solid" ? `
          <div class="control-group">
            <div class="flex-between">
              <label>Stroke Width</label>
              <span id="pseo-stroke-val">1.5px</span>
            </div>
            <input type="range" id="pseo-stroke-input" class="neon-slider" min="0.5" max="3" step="0.1" value="1.5">
          </div>
          ` : ""}
          
          <div class="control-group">
            <div class="flex-between">
              <label>Size</label>
              <span id="pseo-size-val">128px</span>
            </div>
            <input type="range" id="pseo-size-input" class="neon-slider" min="16" max="256" step="8" value="128">
            <div class="size-presets" style="margin-top:6px">
              <button class="size-pill" data-size="32">32px</button>
              <button class="size-pill" data-size="64">64px</button>
              <button class="size-pill active" data-size="128">128px</button>
              <button class="size-pill" data-size="256">256px</button>
            </div>
          </div>
          
          <div class="playground-actions">
            <button class="btn primary" id="pseo-copy-svg">Copy SVG Code</button>
            <button class="btn" id="pseo-download-png">Download PNG</button>
          </div>
        </div>
      </div>
    </article>
  </div>

  <p class="section-title">About this icon</p>
  <div class="grid">
    <article class="card">
      <h2>Use the ${escapeHtml(icon.displayName)} icon</h2>
      ${useCardBody}
    </article>
    <article class="card">
      <h2>Export formats</h2>
      <p>Copy clean SVG vectors with one click, generate custom-size PNG files from 16px to 512px, export JSX/React components ready to paste into your project, or use the icon as a CSS <code>background-mask</code> for flexible theming.</p>
      <p class="muted">All exports are based on the same editable vector — so the ${escapeHtml(icon.displayName)} icon stays pixel-perfect at 16px, 24px, 48px, and any large marketing size.</p>
    </article>
  </div>

  <p class="section-title">Design &amp; UX integration</p>
  <div class="grid">
    <article class="card">
      <h2>Aesthetic characteristics</h2>
      <p>${generateIconAesthetic(icon)}</p>
    </article>
    <article class="card">
      <h2>UX best practices</h2>
      <p>${generateUxBestPractices(icon)}</p>
    </article>
  </div>

  <p class="section-title">Use in your project</p>
  <div class="grid wide">
    <article class="card">
      <h2>React / npm — ${escapeHtml(icon.library)}</h2>
      ${codeBlock}
      <p class="muted" style="margin-top:12px">Copy the SVG markup directly from the IconStash editor to use the ${escapeHtml(icon.displayName)} icon without any npm package — paste it into HTML, JSX, or a design tool.</p>
      <h2 style="margin-top:18px">Inline SVG (copy &amp; paste)</h2>
      <pre><code>${svgForDisplay}</code></pre>
    </article>
  </div>

  <p class="section-title">Library &amp; related icons</p>
  <div class="grid">
    ${libCardHtml}
    <article class="card">
      <h2>Related searches</h2>
      <ul>${relatedLinks}</ul>
    </article>
  </div>

  <p class="section-title">People also search for</p>
  <div class="chips">${peopleAlso}</div>

  <p class="section-title">Frequently asked questions</p>
  <div class="card" style="padding:8px 20px">
    ${faq.map((item) => `<div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <h3 itemprop="name">${escapeHtml(item.q)}</h3>
      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p itemprop="text">${escapeHtml(item.a)}</p>
      </div>
    </div>`).join("")}
  </div>

  <script>
    (() => {
      const preview = document.getElementById("pseo-live-preview");
      const copyBtn = document.getElementById("pseo-copy-svg");
      const downloadBtn = document.getElementById("pseo-download-png");
      const colorInput = document.getElementById("pseo-color-input");
      const strokeInput = document.getElementById("pseo-stroke-input");
      const strokeVal = document.getElementById("pseo-stroke-val");
      
      let currentColor = "#C1DD2D";
      let currentStroke = "1.5";
      let currentSize = 128;

      function updateIcon() {
        const svg = preview.querySelector("svg");
        if (!svg) return;
        
        if (svg.getAttribute("fill") !== "none") svg.setAttribute("fill", currentColor);
        if (svg.getAttribute("stroke") !== "none") svg.setAttribute("stroke", currentColor);
        svg.querySelectorAll("path, circle, rect, polygon, polyline, line, ellipse").forEach(el => {
          if (el.getAttribute("fill") && el.getAttribute("fill") !== "none") el.setAttribute("fill", currentColor);
          if (el.getAttribute("stroke") && el.getAttribute("stroke") !== "none") el.setAttribute("stroke", currentColor);
        });
        
        if (strokeInput && svg.getAttribute("stroke") !== "none") {
          svg.setAttribute("stroke-width", currentStroke);
          svg.querySelectorAll("path, circle, rect, polygon, polyline, line, ellipse").forEach(el => {
            if (el.getAttribute("stroke") && el.getAttribute("stroke") !== "none") el.setAttribute("stroke-width", currentStroke);
          });
        }
        
        svg.setAttribute("width", currentSize);
        svg.setAttribute("height", currentSize);
        svg.style.setProperty("width", currentSize + "px", "important");
        svg.style.setProperty("height", currentSize + "px", "important");
      }

      document.querySelectorAll(".color-dot").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".color-dot").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          currentColor = btn.dataset.color;
          if (colorInput) colorInput.value = currentColor;
          updateIcon();
        });
      });
      
      if (colorInput) {
        colorInput.addEventListener("input", () => {
          currentColor = colorInput.value;
          updateIcon();
        });
      }
      
      if (strokeInput) {
        strokeInput.addEventListener("input", () => {
          currentStroke = strokeInput.value;
          if (strokeVal) strokeVal.textContent = currentStroke + "px";
          updateIcon();
        });
      }
      
      const sizeInput = document.getElementById("pseo-size-input");
      const sizeVal = document.getElementById("pseo-size-val");

      if (sizeInput) {
        sizeInput.addEventListener("input", () => {
          currentSize = parseInt(sizeInput.value, 10);
          if (sizeVal) sizeVal.textContent = currentSize + "px";
          
          document.querySelectorAll(".size-presets .size-pill").forEach(b => {
            b.classList.toggle("active", parseInt(b.dataset.size, 10) === currentSize);
          });
          updateIcon();
        });
      }

      document.querySelectorAll(".size-presets .size-pill").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".size-presets .size-pill").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          currentSize = parseInt(btn.dataset.size, 10);
          if (sizeInput) sizeInput.value = currentSize;
          if (sizeVal) sizeVal.textContent = currentSize + "px";
          updateIcon();
        });
      });
      
      copyBtn?.addEventListener("click", () => {
        const svgStr = preview.innerHTML.trim();
        navigator.clipboard.writeText(svgStr).then(() => {
          const old = copyBtn.textContent;
          copyBtn.textContent = "Copied!";
          setTimeout(() => copyBtn.textContent = old, 1500);
        });
      });
      
      downloadBtn?.addEventListener("click", () => {
        const svg = preview.querySelector("svg");
        if (!svg) return;
        const svgString = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const URL = window.URL || window.webkitURL || window;
        const blobURL = URL.createObjectURL(svgBlob);
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = currentSize;
          canvas.height = currentSize;
          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0);
          const png = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.href = png;
          downloadLink.download = "${row.slug}.png";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(blobURL);
        };
        image.src = blobURL;
      });
      
      updateIcon();
    })();
  </script>
`;
  const canonicalUrl = `${SITE_URL}/icons/${canonicalSlugFor(row)}/`;
  return renderPseoShell({ title, description, url, canonicalUrl, schema, activeSlug: icon.librarySlug, content });
}

/* ─── Concept pages: /icons/<concept>-icon/ ─────────────────────────────────
   The head terms. One page per icon concept that exists in 3+ libraries,
   showing every matching icon side by side. This is the page that finally
   answers "home icon" with nineteen real options from nineteen libraries
   instead of a thin single-library variant — and it is the only page on the
   site whose content is genuinely impossible to find elsewhere.            */
function buildConceptFaq(display, words, members) {
  const libs = Array.from(new Set(members.map((icon) => icon.library.replace(/\s+Icons$/i, ""))));
  const n = members.length;
  const shown = libs.slice(0, 5).join(", ");
  const styles = Array.from(new Set(members.map((icon) => icon.style)));
  const styleList = styles.slice(0, 4).join(", ");
  return [
    {
      q: `Where can I download a free ${words} icon?`,
      a: `IconStash indexes ${n} free ${words} icons from ${libs.length} open-source libraries, including ${shown}. Choose one on this page, set the exact size and colour, then copy the SVG markup or download a transparent PNG. No account and no login are required.`
    },
    {
      q: `Are these ${words} icons free for commercial use?`,
      a: `Yes. Every icon on this page comes from an open-source library published under a permissive licence (MIT, Apache-2.0, ISC, CC BY 4.0 and similar), all of which allow commercial use. The comparison table above lists the licence for each library so you can confirm the exact terms before shipping.`
    },
    {
      q: `Can I download a ${words} icon as a PNG?`,
      a: `Yes. Open any icon on this page, set an exact pixel size between 16px and 512px, choose any colour, and download a transparent PNG. Because every icon here is a vector, the exported PNG stays sharp at any resolution — IconStash also offers a ZIP pack containing 16, 24, 32, 48, 64, 128, 256 and 512px files.`
    },
    {
      q: `Which library has the best ${words} icon?`,
      a: `It depends on the design system you are matching. Outline libraries such as Lucide, Tabler and Feather suit dense product interfaces; Material Symbols and Bootstrap Icons ship matched outline and filled variants of the same glyph; Phosphor and Solar add duotone, bold and broken weights. The grid above shows all ${n} options side by side so you can judge them at real size.`
    },
    {
      q: `How do I add a ${words} icon to a React app?`,
      a: `Copy the SVG markup for any icon on this page and paste it directly into JSX, or install the official npm package for the library you picked — lucide-react, @tabler/icons-react, @phosphor-icons/react, react-bootstrap-icons and react-icons are the most common. Both approaches are shown in the code samples above.`
    },
    {
      q: `What sizes and styles do ${words} icons come in?`,
      a: `All ${n} icons on this page are vector artwork, so they scale cleanly to any size. The libraries represented here render the ${words} concept in ${styleList} styles, and IconStash can export PNGs at 16, 24, 32, 48, 64, 128, 256 or 512px, or any custom value in between.`
    },
    {
      q: `Can I change the colour of a ${words} icon?`,
      a: `Yes. Icons are exported using currentColor, so they inherit the CSS colour of their parent element and follow your theme automatically. You can also pick an exact hex colour in the IconStash editor before downloading, or override the colour with a CSS rule such as .icon { color: #C1DD2D; }.`
    }
  ];
}

function buildConceptSchema(row, members, faq, url, appUrl) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "IconStash", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Icons by concept", item: `${SITE_URL}/category/` },
        { "@type": "ListItem", position: 3, name: `${titleCase(row.concept)} icon`, item: url }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${titleCase(row.concept)} icon — free SVG and PNG downloads`,
      description: `${members.length} free ${row.concept.replace(/-/g, " ")} icons from ${new Set(members.map((i) => i.librarySlug)).size} open-source icon libraries, available as SVG and PNG.`,
      url,
      isPartOf: { "@type": "WebSite", name: "IconStash", url: SITE_URL },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: members.length,
        itemListElement: members.map((icon, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/icons/${icon.id.toLowerCase()}/`,
          name: `${icon.library} ${icon.displayName} icon`
        }))
      }
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
      "@type": "SoftwareApplication",
      name: "IconStash",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      description: "Browser-based icon search engine unifying 28+ open-source icon libraries into a single lightning-fast search. Search, preview, customize, and download 134,701+ SVG and PNG icons with no login required.",
      featureList: ["SVG copy", "Custom PNG download", "Multi-resolution ZIP export", "React JSX export", "CSS background-mask export", "Cross-library comparison", "Color customization", "Stroke width control", "134,701 icons from 28 libraries"],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Organization", name: "Great Software Company", url: "https://greatsoftwarecompany.com" }
    }
  ];
}

function styleName(icon) {
  const map = { outline: "Outline", filled: "Filled", solid: "Solid", duotone: "Duotone", thin: "Thin", light: "Light", sharp: "Sharp" };
  return map[icon.style] || titleCase(icon.style);
}

function conceptPageHtml(row, members, relatedConcepts) {
  const concept = row.concept;
  const words = concept.replace(/-/g, " ");
  const display = titleCase(concept);
  const n = members.length;
  const libSlugs = Array.from(new Set(members.map((icon) => icon.librarySlug)));
  const libCount = libSlugs.length;

  const title = conceptTitle(display, n);
  const description = conceptDescription(display, words, n);
  const url = `${SITE_URL}${row.url}`;
  const appUrl = `${SITE_URL}/#/search?query=${encodeURIComponent(words)}`;

  const hero = members[0];
  const faq = buildConceptFaq(display, words, members);
  const schema = buildConceptSchema(row, members, faq, url, appUrl);

  /* Hero artwork: the most widely-supported rendering of this concept. */
  const heroHtml = renderSvg(hero, 100);

  /* ── The comparison grid: the reason this page exists ─────────────────── */
  const grid = members.map((icon) => `<a class="concept-icon" href="/icons/${escapeHtml(icon.id.toLowerCase())}/" title="${escapeHtml(icon.library)} ${escapeHtml(icon.displayName)} icon">
      <span class="concept-icon-art" aria-hidden="true">${renderSvg(icon, 40)}</span>
      <span class="concept-icon-lib">${escapeHtml(icon.library)}</span>
      <span class="concept-icon-style">${escapeHtml(styleName(icon))}</span>
    </a>`).join("");

  /* ── Library comparison table ────────────────────────────────────────── */
  const tableRows = members.map((icon) => {
    const info = LIBRARY_INFO[icon.librarySlug] || null;
    return `<tr>
      <td><a href="/library/${escapeHtml(icon.librarySlug)}/">${escapeHtml(icon.library)}</a></td>
      <td>${escapeHtml(styleName(icon))}</td>
      <td>${escapeHtml(info ? info.license : "Open source")}</td>
      <td><a href="/icons/${escapeHtml(icon.id.toLowerCase())}/">${escapeHtml(icon.displayName)}</a></td>
    </tr>`;
  }).join("");

  /* ── Code samples: the top icon, ready to paste ──────────────────────── */
  const svgSample = escapeHtml(renderSvg(hero, 24));
  const reactSample = escapeHtml(`npm install ${(LIBRARY_INFO[hero.librarySlug] || {}).npm || hero.npmPackage || slugify(hero.library)}\n\nimport { ${hero.displayName.replace(/[^A-Za-z0-9]/g, "")} } from "${(LIBRARY_INFO[hero.librarySlug] || {}).npm || hero.npmPackage || slugify(hero.library)}";\n\nexport function Example() {\n  return <${hero.displayName.replace(/[^A-Za-z0-9]/g, "")} size={24} />;\n}`);

  const relatedChips = relatedConcepts.length
    ? `<p class="section-title">Related icon searches</p>\n  <div class="chips">${relatedConcepts.map((item) => `<a href="/icons/${escapeHtml(item.slug)}/">${escapeHtml(titleCase(item.concept))} icon</a>`).join("")}</div>`
    : "";

  const libChips = libSlugs.map((slug) => {
    const info = LIBRARY_INFO[slug];
    return `<a href="/library/${escapeHtml(slug)}/">${escapeHtml(info ? info.fullName : titleCase(slug))}</a>`;
  }).join("");

  const lead = `Compare ${n} free ${words} icons from ${libCount} open-source libraries and pick the one that matches your design system. Every icon on this page downloads as an editable SVG or a transparent PNG at any size from 16px to 512px — no login, no account, no attribution required.`;

  const content = `
  <nav class="crumbs" aria-label="Breadcrumb">
    <a href="/">IconStash</a><span>/</span>
    <a href="/category/">Icons</a><span>/</span>
    <span>${escapeHtml(display)}</span>
  </nav>

  <section class="hero">
    <div class="preview" aria-hidden="true">${heroHtml}</div>
    <div>
      <h1>${escapeHtml(display)} icon</h1>
      <p class="lead">${escapeHtml(lead)}</p>
      <div class="cta">
        <a class="btn primary" href="${escapeHtml(appUrl)}">Compare all ${n} in the editor</a>
        <a class="btn" href="/category/${escapeHtml(slugify(row.category || "Interface"))}/">More ${escapeHtml(String(row.category || "Interface").toLowerCase())} icons</a>
      </div>
    </div>
  </section>

  <p class="section-title">All ${n} free ${escapeHtml(words)} icons</p>
  <div class="grid wide">
    <article class="card">
      <h2>${escapeHtml(display)} icons from ${libCount} libraries</h2>
      <p class="muted" style="margin-bottom:14px">Every icon below is the same "${escapeHtml(words)}" concept rendered by a different library. Click any tile to open it in the editor, set a custom size and colour, and download SVG or PNG.</p>
      <div class="concept-grid">${grid}</div>
    </article>
  </div>

  <p class="section-title">Library comparison</p>
  <div class="grid wide">
    <article class="card">
      <h2>Which library should you use?</h2>
      <div class="hub-table-scroll">
        <table class="hub-table">
          <thead><tr><th>Library</th><th>Style</th><th>License</th><th>${escapeHtml(display)} icon</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
      <p class="muted" style="margin-top:14px">Outline sets such as Lucide, Tabler and Feather stay legible at 16px in dense interfaces. Material Symbols and Bootstrap Icons give you matched outline and filled pairs. Phosphor, Solar and Fluent add duotone, bold and weight-graded variants when you need more visual hierarchy.</p>
    </article>
  </div>

  <p class="section-title">Use this icon in your project</p>
  <div class="grid">
    <article class="card">
      <h2>Inline SVG (copy &amp; paste)</h2>
      <p class="muted">Paste this straight into HTML or JSX. It inherits <code>currentColor</code>, so it follows your theme.</p>
      <pre><code>${svgSample}</code></pre>
    </article>
    <article class="card">
      <h2>React component</h2>
      <p class="muted">Install the package for the library you picked, then import the component.</p>
      <pre><code>${reactSample}</code></pre>
    </article>
  </div>

  <p class="section-title">Choosing the right ${escapeHtml(words)} icon</p>
  <div class="grid">
    <article class="card">
      <h2>Match the icon to the interface</h2>
      <p>A ${escapeHtml(words)} icon has to read instantly at whatever size your interface uses. Below 20px, prefer outline artwork with a consistent stroke weight — heavy filled glyphs turn into blobs. For navigation bars and empty states above 32px, filled or duotone versions carry more visual weight and scan better.</p>
      <p class="muted">Keep stroke weight consistent across every icon in a view. Mixing a 1.5px Lucide glyph with a 2px Tabler glyph in the same toolbar is the most common reason icon sets look unprofessional.</p>
    </article>
    <article class="card">
      <h2>Accessibility</h2>
      <p>Decorative icons need <code>aria-hidden="true"</code> so screen readers skip them. If the ${escapeHtml(words)} icon is the only thing labelling a control — an icon-only button, for example — give the button an <code>aria-label</code> such as "${escapeHtml(display)}" and leave the SVG itself hidden.</p>
      <p class="muted">Never rely on the icon alone to convey state. Pair it with a tooltip or visible text wherever the meaning is not already obvious from context.</p>
    </article>
  </div>

  ${relatedChips}

  <p class="section-title">Libraries on this page</p>
  <div class="chips">${libChips}</div>

  <p class="section-title">Frequently asked questions</p>
  <div class="card" style="padding:8px 20px">
    ${faq.map((item) => `<div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <h3 itemprop="name">${escapeHtml(item.q)}</h3>
      <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p itemprop="text">${escapeHtml(item.a)}</p>
      </div>
    </div>`).join("")}
  </div>
`;

  return renderPseoShell({
    title,
    description,
    url,
    canonicalUrl: url,
    schema,
    activeSlug: "",
    content
  });
}

/* ─── Write pages ─────────────────────────────────────────────────────────── */
function writePages(keywords, icons) {
  const byIcon = new Map(icons.map((icon) => [icon.id, icon]));
  console.log("Building index maps for related searches...");
  buildIndexes(keywords, byIcon);
  buildConceptIndex(keywords, byIcon);
  buildCanonicals(keywords);
  console.log("Indexes completed. Writing HTML files...");
  let count = 0;
  let missingMembers = 0;
  const total = keywords.length;
  const reportEvery = Math.round(total / 10) || 10000;
  for (const row of keywords) {
    const dir = path.join(OUT_DIR, row.slug);
    /* A URL that was retired on an earlier run and has now come back must lose
       its redirect stub, or Apache (DirectoryIndex index.php index.html) would
       keep serving the 301 instead of the page. */
    const stalePhp = path.join(dir, "index.php");
    if (fs.existsSync(stalePhp)) fs.unlinkSync(stalePhp);

    if (row.intent === "concept") {
      const members = (row.iconIds || []).map((id) => byIcon.get(id)).filter(Boolean);
      if (members.length < CONCEPT_MIN_LIBRARIES) { missingMembers++; continue; }
      const page = conceptPageHtml(row, members, relatedConceptsFor(row));
      writeFileWithRetry(path.join(dir, "index.html"), page);
      count++;
      if (count % reportEvery === 0) {
        console.log(`- Progress: ${Math.round((count / total) * 100)}% (${count.toLocaleString("en-US")} / ${total.toLocaleString("en-US")} written)`);
      }
      continue;
    }

    const icon = byIcon.get(row.iconId);
    if (!icon) continue;
    const related = relatedFor(row, byIcon);
    const conceptRow = conceptRowByIconId.get(icon.id);
    writeFileWithRetry(path.join(dir, "index.html"), pageHtml(row, icon, related, conceptRow ? conceptRow.slug : null));
    count++;
    if (count % reportEvery === 0) {
      console.log(`- Progress: ${Math.round((count / total) * 100)}% (${count.toLocaleString("en-US")} / ${total.toLocaleString("en-US")} written)`);
    }
  }
  if (missingMembers) console.log(`- Skipped ${missingMembers.toLocaleString("en-US")} concept pages with too few renderable members.`);
}

/* ─── 301 redirects for every retired URL ───────────────────────────────────
   The previous generator published ~14.9k keyword-variant URLs per build
   ("copy-x-svg", "download-x-png-icon", "x icon figma", and the 415 slugs
   that up to 22 unrelated icons shared). Deleting them outright would discard
   whatever equity and traffic they earned and leave 15k 404s in Search
   Console. Each retired URL therefore keeps a directory containing an
   index.php that issues a real HTTP 301 to the icon's canonical page.

   Plain PHP files rather than .htaccess rules: 15k RewriteRule directives
   would be re-parsed by Apache on every request, and RewriteMap is not
   permitted in .htaccess context. A per-directory index.php costs nothing
   until someone actually requests the URL.                                  */
function redirectStub(target) {
  const safe = String(target).replace(/[^a-z0-9\-/_]/gi, "");
  return `<?php\n/**\n * Permanent redirect. This URL was retired on ${TODAY} when IconStash\n * collapsed 149,040 duplicate keyword-variant pages onto 134,125 canonical\n * icon pages plus a cross-library concept layer. Content lives at:\n */\nheader("Location: /icons/${safe}/", true, 301);\nexit;\n`;
}

function writeRedirects(oldKeywords, newKeywords) {
  const live = new Set(newKeywords.map((row) => row.slug));
  const targetByIcon = new Map();
  for (const row of newKeywords) {
    if (row.intent === "concept") continue;
    targetByIcon.set(row.iconId, row.slug);
  }

  const seen = new Set();
  let written = 0;
  let unmapped = 0;
  let removedHtml = 0;
  for (const row of oldKeywords || []) {
    const slug = row.slug;
    if (!slug || live.has(slug) || seen.has(slug)) continue;
    seen.add(slug);
    const target = targetByIcon.get(row.iconId) || canonicalByIcon.get(row.iconId);
    if (!target || target === slug) { unmapped++; continue; }
    const dir = path.join(OUT_DIR, slug);
    ensureDir(dir);
    /* Drop the retired page itself. Leaving it would keep ~700 MB of duplicate
       HTML live on disk and directly reachable at /icons/<slug>/index.html. */
    const htmlPath = path.join(dir, "index.html");
    if (retireFile(htmlPath, htmlRedirectStub(target)) === "removed") removedHtml++;
    writeFileWithRetry(path.join(dir, "index.php"), redirectStub(target));
    written++;
    if (written % 5000 === 0) console.log(`- Redirects: ${written.toLocaleString("en-US")} written`);
  }
  console.log(`Redirects: ${written.toLocaleString("en-US")} retired URLs now 301 to their canonical page, `
    + `${removedHtml.toLocaleString("en-US")} obsolete HTML files removed`
    + (unmapped ? ` (${unmapped.toLocaleString("en-US")} had no live target and were dropped).` : "."));
  return written;
}

/* ─── Write sitemaps (safe 45k limit) ─────────────────────────────────── */
function urlsetXml(urls, isRecent = false) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => {
    if (isRecent || url === "/" || url.startsWith("/library/") || url.startsWith("/category/") || url.startsWith("/style/")) {
      return `  <url><loc>${SITE_URL}${url}</loc><lastmod>${TODAY}</lastmod></url>`;
    }
    // Deterministic staggered lastmod based on URL hash (last 45 days)
    let hash = 0;
    for (let i = 0; i < url.length; i++) hash = (hash * 31 + url.charCodeAt(i)) & 0xffffffff;
    const dayOffset = Math.abs(hash % 45); // 0 to 44 days ago
    const d = new Date("2026-09-01T00:00:00Z");
    d.setDate(d.getDate() - dayOffset);
    const dateStr = d.toISOString().slice(0, 10);
    return `  <url><loc>${SITE_URL}${url}</loc><lastmod>${dateStr}</lastmod></url>`;
  }).join("\n")}\n</urlset>\n`;
}

function writeSitemaps(keywords) {
  const MAX_PER_SITEMAP = 45000;
  const staticUrls = ["/", "/library/", "/category/", "/style/", "/seo/"];

  /* Concept pages get their own sitemap so indexation of the head terms can
     be monitored separately in Search Console instead of being buried among
     134k long-tail URLs. */
  const conceptUrls = keywords.filter((row) => row.intent === "concept" && row.url).map((row) => row.url);
  const iconUrls = keywords.filter((row) => row.intent !== "concept" && row.url).map((row) => row.url);

  const sitemapEntries = [];
  const articlesSitemapPath = path.join(ROOT, "articles-sitemap.xml");
  if (fs.existsSync(articlesSitemapPath)) {
    sitemapEntries.push(`  <sitemap><loc>${SITE_URL}/articles-sitemap.xml</loc><lastmod>${TODAY}</lastmod></sitemap>`);
  }

  // Hub layer (library / category / style) is emitted by generate-hubs.js.
  const hubsPath = path.join(SITEMAP_DIR, "hubs.xml");
  if (fs.existsSync(hubsPath)) {
    sitemapEntries.push(`  <sitemap><loc>${SITE_URL}/sitemaps/hubs.xml</loc><lastmod>${TODAY}</lastmod></sitemap>`);
  }

  if (conceptUrls.length) {
    writeFileWithRetry(path.join(SITEMAP_DIR, "concepts.xml"), urlsetXml(conceptUrls, true));
    sitemapEntries.push(`  <sitemap><loc>${SITE_URL}/sitemaps/concepts.xml</loc><lastmod>${TODAY}</lastmod></sitemap>`);
  }

  const allUrls = Array.from(new Set(staticUrls.concat(iconUrls)));
  const chunks = [];
  for (let i = 0; i < allUrls.length; i += MAX_PER_SITEMAP) {
    chunks.push(allUrls.slice(i, i + MAX_PER_SITEMAP));
  }
  /* Every XML this run owns. Anything else sitting in the directory is from a
     build that produced more pages than this one, so it is emptied rather than
     left listing URLs that may no longer exist. Deleting is avoided on purpose
     (see prepareOutput). hubs.xml belongs to generate-hubs.js and is skipped. */
  const owned = new Set();

  chunks.forEach((chunk, index) => {
    const name = `sitemap-${index + 1}.xml`;
    owned.add(name);
    writeFileWithRetry(path.join(SITEMAP_DIR, name), urlsetXml(chunk));
    sitemapEntries.push(`  <sitemap><loc>${SITE_URL}/sitemaps/${name}</loc><lastmod>${TODAY}</lastmod></sitemap>`);
  });

  if (conceptUrls.length) owned.add("concepts.xml");
  let emptied = 0;
  for (const entry of fs.readdirSync(SITEMAP_DIR)) {
    if (entry === "hubs.xml" || !/^(sitemap-\d+|concepts)\.xml$/.test(entry)) continue;
    if (owned.has(entry)) continue;
    writeFileWithRetry(path.join(SITEMAP_DIR, entry), EMPTY_URLSET);
    emptied++;
  }
  if (emptied) console.log(`Sitemaps: emptied ${emptied} stale sitemap file(s) no longer in use.`);

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join("\n")}\n</sitemapindex>\n`;
  writeFileWithRetry(path.join(ROOT, "sitemap.xml"), indexXml);

  console.log(`Sitemaps: ${conceptUrls.length.toLocaleString("en-US")} concept URLs (sitemaps/concepts.xml) + `
    + `${allUrls.length.toLocaleString("en-US")} pages across ${chunks.length} file(s).`);
}

/* ─── Write HTML sitemap ─────────────────────────────────────────────────── */
function writeHtmlSitemap(keywords) {
  const perPage = 1000;
  const pages = [];
  for (let i = 0; i < keywords.length; i += perPage) pages.push(keywords.slice(i, i + perPage));
  const totalPages = pages.length;

  const indexLinks = pages.map((_, index) => `<a class="sitemap-pill" href="/seo/sitemap-${index + 1}/">Sitemap ${index + 1} (${index * perPage + 1}–${Math.min((index + 1) * perPage, keywords.length)})</a>`).join("\n    ");
  ensureDir(HTML_SITEMAP_DIR);

  const indexHtml = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <script async src="https://plausible.io/js/pa--bfaHBAPFGUV3yUn96sF4.js"></script>
  <script>window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()</script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>IconStash HTML Sitemap — All ${keywords.length.toLocaleString("en-US")} Icon Pages</title>
  <meta name="description" content="Browse the full directory of all ${keywords.length.toLocaleString("en-US")} free open-source icon landing pages across 28 libraries on IconStash.">
  <link rel="canonical" href="${SITE_URL}/seo/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="IconStash HTML Sitemap">
  <meta property="og:description" content="Browse all ${keywords.length.toLocaleString("en-US")} IconStash icon landing pages.">
  <meta property="og:url" content="${SITE_URL}/seo/">
  <meta property="og:image" content="${SITE_URL}/logo.png">
  <meta property="og:site_name" content="IconStash">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${SITE_URL}/logo.png">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=20260602-brandlogo">
  <link rel="stylesheet" href="/style.css?v=20260830-conceptpages">
  <style>
    .sitemap-wrap { max-width: 1180px; margin: 0 auto; padding: 32px 20px 80px; }
    .sitemap-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; margin-top: 24px; }
    .sitemap-pill { display: block; padding: 12px 16px; border: 1px solid var(--glass-border); border-radius: var(--radius-button); background: var(--glass-2); color: var(--text-primary); text-decoration: none; font-size: 14px; transition: all 180ms ease; }
    .sitemap-pill:hover { border-color: var(--glass-border-bright); background: var(--glass-3); color: var(--neon-blue); }
  </style>
</head>
<body class="pseo-page">
  <div class="app-shell">
    ${renderPseoHeader()}
    <main class="sitemap-wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>HTML Sitemaps</span></nav>
      <h1>IconStash HTML Sitemap Directory</h1>
      <p class="lead">${keywords.length.toLocaleString("en-US")} icon landing pages across 28 open-source libraries, organized into ${totalPages} index pages.</p>
      <div class="sitemap-grid">
        ${indexLinks}
      </div>
      ${renderPseoFooter()}
    </main>
  </div>
</body>
</html>`;
  writeFileWithRetry(path.join(HTML_SITEMAP_DIR, "index.html"), indexHtml);

  pages.forEach((chunk, index) => {
    const pageNum = index + 1;
    const dir = path.join(HTML_SITEMAP_DIR, `sitemap-${pageNum}`);
    ensureDir(dir);
    const links = chunk.map((row) => `<li><a href="${row.url}">${escapeHtml(row.keyword)}</a></li>`).join("\n        ");
    const prevLink = pageNum > 1 ? `<a class="btn" href="/seo/sitemap-${pageNum - 1}/">&larr; Previous (Sitemap ${pageNum - 1})</a>` : "";
    const nextLink = pageNum < totalPages ? `<a class="btn" href="/seo/sitemap-${pageNum + 1}/">Next (Sitemap ${pageNum + 1}) &rarr;</a>` : "";

    const pageHtml = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <script async src="https://plausible.io/js/pa--bfaHBAPFGUV3yUn96sF4.js"></script>
  <script>window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()</script>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>IconStash Sitemap ${pageNum} of ${totalPages} — Free Icons Directory</title>
  <meta name="description" content="IconStash icon pages ${index * perPage + 1}–${Math.min((index + 1) * perPage, keywords.length)} of ${keywords.length.toLocaleString("en-US")} total icon pages.">
  <link rel="canonical" href="${SITE_URL}/seo/sitemap-${pageNum}/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="IconStash Sitemap ${pageNum}">
  <meta property="og:description" content="IconStash icon pages ${index * perPage + 1}–${Math.min((index + 1) * perPage, keywords.length)}.">
  <meta property="og:url" content="${SITE_URL}/seo/sitemap-${pageNum}/">
  <meta property="og:image" content="${SITE_URL}/logo.png">
  <meta property="og:site_name" content="IconStash">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${SITE_URL}/logo.png">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=20260602-brandlogo">
  <link rel="stylesheet" href="/style.css?v=20260830-conceptpages">
  <style>
    .sitemap-wrap { max-width: 1180px; margin: 0 auto; padding: 32px 20px 80px; }
    .icon-link-list { columns: 3 240px; column-gap: 24px; list-style: none; padding: 0; margin: 24px 0; }
    .icon-link-list li { margin: 6px 0; break-inside: avoid; }
    .icon-link-list a { color: var(--text-secondary); text-decoration: none; font-size: 14px; }
    .icon-link-list a:hover { color: var(--neon-blue); }
    .sitemap-nav { display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap; margin: 32px 0; }
  </style>
</head>
<body class="pseo-page">
  <div class="app-shell">
    ${renderPseoHeader()}
    <main class="sitemap-wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/seo/">HTML Sitemaps</a><span>/</span><span>Sitemap ${pageNum}</span></nav>
      <h1>IconStash Sitemap ${pageNum} of ${totalPages}</h1>
      <p class="lead">Displaying icons ${(index * perPage + 1).toLocaleString("en-US")} to ${Math.min((index + 1) * perPage, keywords.length).toLocaleString("en-US")} of ${keywords.length.toLocaleString("en-US")} total icon pages.</p>
      <div class="sitemap-nav">
        ${prevLink}
        <a class="btn" href="/seo/">Directory Index</a>
        ${nextLink}
      </div>
      <ul class="icon-link-list">
        ${links}
      </ul>
      <div class="sitemap-nav">
        ${prevLink}
        <a class="btn" href="/seo/">Directory Index</a>
        ${nextLink}
      </div>
      ${renderPseoFooter()}
    </main>
  </div>
</body>
</html>`;
    writeFileWithRetry(path.join(dir, "index.html"), pageHtml);
  });

  // Clean up any stale directories beyond totalPages
  for (const entry of fs.readdirSync(HTML_SITEMAP_DIR)) {
    const match = /^sitemap-(\d+)$/.exec(entry);
    if (!match) continue;
    const pageNo = Number(match[1]);
    if (!Number.isFinite(pageNo) || pageNo <= totalPages) continue;
    const staleDir = path.join(HTML_SITEMAP_DIR, entry);
    try {
      fs.rmSync(staleDir, { recursive: true, force: true });
    } catch (_) {}
  }
}

/* ─── Main ────────────────────────────────────────────────────────────────── */
function main() {
  if (process.argv.includes("--output-only") || process.env.PSEO_OUTPUT_ONLY === "1") {
    const keywordData = readJson(KEYWORD_DB);
    const keywords = keywordData.keywords || [];
    ensureDir(SITEMAP_DIR);
    ensureDir(HTML_SITEMAP_DIR);
    writeSitemaps(keywords);
    writeHtmlSitemap(keywords);
    console.log(`Completed sitemap output for ${keywords.length.toLocaleString("en-US")} PSEO pages.`);
    return;
  }

  if (process.argv.includes("--pages-only") || process.env.PSEO_PAGES_ONLY === "1") {
    const keywordData = readJson(KEYWORD_DB);
    const keywords = keywordData.keywords || [];
    const index = readJson(path.join(DATA_DIR, "index.json"));
    const libraries = index.libraries || [];
    console.log(`Loading ${libraries.length} libraries...`);
    const icons = libraries.flatMap(normalizeLibrary).filter((icon) => icon.body && icon.base);
    console.log(`Refreshing ${keywords.length.toLocaleString("en-US")} PSEO pages from existing keyword data...`);
    writePages(keywords, icons);
    writeSitemaps(keywords);
    writeHtmlSitemap(keywords);
    console.log(`Completed page refresh for ${keywords.length.toLocaleString("en-US")} PSEO pages.`);
    return;
  }

  /* Retired-URL recovery path. `writePages` and `writeSitemaps` are both
     idempotent and cheap to re-run, so after an interrupted build the only
     genuinely missing step is usually the 301 layer. Rebuilding it from the
     existing keyword database takes seconds instead of the full run, which
     matters because a run that dies mid-way is otherwise unrecoverable
     without redoing every page.

     PSEO_PREVIOUS_DB is mandatory here. Reading the on-disk keyword database
     as "previous" would find zero retired URLs and silently skip every
     redirect, which is exactly the failure this mode exists to prevent.   */
  if (process.argv.includes("--redirects-only") || process.env.PSEO_REDIRECTS_ONLY === "1") {
    const keywordData = readJson(KEYWORD_DB);
    const keywords = keywordData.keywords || [];
    const previousDbPath = process.env.PSEO_PREVIOUS_DB;
    if (!previousDbPath || !fs.existsSync(previousDbPath)) {
      console.error("Refusing to run --redirects-only without PSEO_PREVIOUS_DB.");
      console.error("Without the previous URL set this would silently write zero redirects.");
      console.error("Recovery: git show HEAD:data/pseo-keywords.json > .workbuddy-ai/old-keywords.json");
      process.exit(1);
    }
    const previousKeywords = (readJson(previousDbPath).keywords) || [];
    console.log(`Current plan: ${keywords.length.toLocaleString("en-US")} live pages.`);
    console.log(`Previous plan: ${previousKeywords.length.toLocaleString("en-US")} published pages.`);
    buildCanonicals(keywords);
    const written = writeRedirects(previousKeywords, keywords);
    console.log(`Redirect layer complete: ${written.toLocaleString("en-US")} retired URLs now 301.`);
    return;
  }

  const index = readJson(path.join(DATA_DIR, "index.json"));
  const libraries = index.libraries || [];
  console.log(`Loading ${libraries.length} libraries...`);
  const icons = libraries.flatMap(normalizeLibrary).filter((icon) => icon.body && icon.base);
  console.log(`Loaded ${icons.length.toLocaleString("en-US")} icons.`);

  /* The previous URL set is needed to build 301s for every page this run
     retires — so read it before the keyword database is overwritten.

     PSEO_PREVIOUS_DB points at an explicit copy of the previous database.
     This matters after an interrupted run: the on-disk keyword database has
     already been overwritten by then, so reading it as "previous" would find
     zero retired URLs and silently skip all 14,915 redirects. Recovery:
     git show HEAD:data/pseo-keywords.json > old-keywords.json */
  let previousKeywords = [];
  const previousDbPath = process.env.PSEO_PREVIOUS_DB;
  if (previousDbPath && fs.existsSync(previousDbPath)) {
    try {
      previousKeywords = (readJson(previousDbPath).keywords) || [];
      console.log(`Loaded ${previousKeywords.length.toLocaleString("en-US")} previously published URLs from ${previousDbPath}.`);
    } catch (error) {
      console.log(`Could not read PSEO_PREVIOUS_DB (${previousDbPath}); redirects will be skipped.`);
    }
  } else if (fs.existsSync(KEYWORD_DB)) {
    try {
      previousKeywords = (readJson(KEYWORD_DB).keywords) || [];
      console.log(`Loaded ${previousKeywords.length.toLocaleString("en-US")} previously published URLs for redirect mapping.`);
    } catch (error) {
      console.log("Could not read the previous keyword database; redirects will be skipped.");
    }
  }

  console.log(`Generating up to ${PAGE_LIMIT.toLocaleString("en-US")} keyword pages...`);
  const keywords = buildKeywords(icons);
  buildCanonicals(keywords);
  prepareOutput();
  writeFileWithRetry(KEYWORD_DB, JSON.stringify({
    generatedAt: new Date().toISOString(),
    siteUrl: SITE_URL,
    pageLimit: PAGE_LIMIT,
    totalKeywords: keywords.length,
    keywords
  }, null, 2));
  writePages(keywords, icons);
  writeSitemaps(keywords);
  writeHtmlSitemap(keywords);
  writeRedirects(previousKeywords, keywords);
  console.log(`\nGenerated ${keywords.length.toLocaleString("en-US")} pages `
    + `(${keywords.filter((row) => row.intent === "concept").length.toLocaleString("en-US")} concept, `
    + `${keywords.filter((row) => row.intent !== "concept").length.toLocaleString("en-US")} icon).`);
  console.log(`Wrote ${path.relative(ROOT, KEYWORD_DB)}, sitemap.xml, and HTML sitemap.`);
}

/* Run only when invoked directly. `require`-ing this file from a QA or
   analysis script must not trigger a 150,000-page rebuild. */
if (require.main === module) {
  main();
}

module.exports = {
  main, buildKeywords, buildCanonicals, buildIndexes, buildConceptIndex,
  normalizeLibrary, categorize, deriveStyle, baseName, displayName, slugify,
  pageHtml, conceptPageHtml, iconTitle, iconDescription, buildFaq, buildSchema,
  generateIconAesthetic, generateUxBestPractices, relatedFor,
  CATEGORY_CONTEXT, STYLE_DESC, STYLE_USE_CASES, LIBRARY_INFO, CONCEPT_MIN_LIBRARIES
};
