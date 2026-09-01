# IconStash

> **134,701 SVG icons across 28 libraries — search, preview, customize and download instantly.**

🌐 **Live site:** [iconstash.io](https://iconstash.io)

---

## What is IconStash?

IconStash is a free, open-source SVG icon search engine and browser. It aggregates the world's most popular open-source icon libraries into a single, fast interface — letting designers and developers find, preview, customize, and download icons without needing to install anything.

---

## Icon Libraries (28 total)

| Library | Icons | Style |
|---|---|---|
| Lucide | 1,979 | Outline |
| Tabler Icons | 6,324 | Outline |
| Phosphor | 9,198 | Multi-weight |
| Material Design Icons | 14,001 | Filled & Outline |
| Remix Icons | 3,244 | Dual-tone |
| Iconoir | 2,020 | Outline |
| Heroicons | 1,297 | Outline & Solid |
| Bootstrap Icons | 2,090 | Outline & Filled |
| Feather | 286 | Outline |
| Mingcute | 3,352 | Multi-style |
| Solar Icons | 7,410 | Multi-weight |
| Octicons | 929 | GitHub-style |
| CSS.gg | 705 | Minimal |
| Radix Icons | 345 | Crisp |
| Ant Design Icons | 1,870 | Product |
| Fluent UI Icons | 20,170 | Microsoft |
| Carbon Icons | 2,644 | IBM |
| Ionicons | 2,607 | Ionic |
| Eva Icons | 490 | Interface |
| Boxicons | 3,389 | Multi-style |
| Material Symbols | 18,547 | Google |
| Material Symbols Light | 15,969 | Google Light |
| IconPark Outline | 2,658 | ByteDance |
| IconPark Solid | 1,970 | ByteDance |
| Huge Icons | 5,115 | Modern |
| Pixel Art Icons | 1,099 | Pixel |
| Line MD | 1,279 | Animated |
| Simple Icons | 3,714 | Brands |

---

## Features

- **Instant Search** — Full-text search with 300ms debouncing and URL-based deep linking (`#/search?query=camera`)
- **Browse by Library** — Filter icons to one or more specific libraries via the sidebar
- **Browse by Category** — 16 categories: Media, Communication, Commerce, Navigation, Files, Editing, Devices, Development, Security, Health, Weather, Transport, Social, Time, Data, Interface
- **Customize Preview** — Live-adjust fill color and stroke width across all grid icons simultaneously
- **Compare Mode** — Select multiple icons and compare them side by side
- **Collections** — Save icons into named personal collections (persisted locally)
- **Bulk Actions** — Select multiple icons and download or collect them in one action
- **Detail Panel** — Per-icon panel with:
  - Live SVG preview with size, stroke and color controls
  - Code tab (copy SVG/JSX/HTML snippet)
  - Download tab (SVG, PNG, ZIP)
  - Use tab (npm install, import code)
  - Meta tab (tags, icon ID, library badge)
- **Cross-Library Matching** — Shows the same icon across other libraries in the detail panel
- **Dark / Light Theme** — Toggle with keyboard shortcut `T`
- **Programmatic SEO & AEO** — 137,000+ high-quality canonical icon pages, 3,746 concept hubs (e.g. `/icons/home-icon/`), library comparison matrices, and comprehensive `llms.txt` AEO integration.

---

## Performance Architecture

- **Pre-rendered HTML grid** — First paint shows icons instantly with no JavaScript data loading
- **Lazy background sync** — Library JSON data (150MB+) only starts downloading when the user interacts with search or filters
- **Virtual scroll** — Search results use a virtualized DOM grid to prevent memory bloat with 100k+ results
- **Chunked prerender** — Each library's icon grid is split into HTML chunks fetched progressively on scroll
- **Service Worker caching** — Prerender chunks are cached for instant subsequent loads

---

## License

All icon sets belong to their respective authors and are subject to their individual licenses. Please check each library's documentation before using icons in commercial projects.

The IconStash application code is open source.
