(function () {
  const COLORS = ["#00c3ff", "#ff2d9b", "#00ff88", "#bf00ff", "#ff6a00", "#f5ff00", "#00ffd5", "#ff003c"];
  const CATEGORY_META = [
    ["Media", "Photography", "M12 5v14M5 12h14", "#00c3ff"],
    ["Communication", "Messaging", "M4 5h16v12H7l-3 3V5Z", "#ff2d9b"],
    ["Commerce", "Payments", "M6 6h15l-2 8H8L6 6ZM6 6 5 3H2M9 20h.01M18 20h.01", "#00ff88"],
    ["Navigation", "Maps", "M3 11 22 2l-9 19-2-8-8-2Z", "#bf00ff"],
    ["Files", "Documents", "M14 2H6a2 2 0 0 0-2 2v16h16V8l-6-6Z", "#ff6a00"],
    ["Editing", "Design", "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z", "#f5ff00"],
    ["Devices", "Hardware", "M4 5h16v11H4V5ZM8 21h8M12 16v5", "#00ffd5"],
    ["Development", "Code", "M8 9 4 12l4 3M16 9l4 3-4 3M14 4l-4 16", "#ff003c"],
    ["Security", "Privacy", "M12 2 20 6v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4Z", "#00c3ff"],
    ["Health", "Medical", "M20.8 4.6a5.3 5.3 0 0 0-7.5 0L12 5.9l-1.3-1.3a5.3 5.3 0 1 0-7.5 7.5L12 21l8.8-8.9a5.3 5.3 0 0 0 0-7.5Z", "#ff2d9b"],
    ["Weather", "Nature", "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z", "#00ff88"],
    ["Transport", "Travel", "M5 17h14l2-7H3l2 7ZM7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM17 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z", "#bf00ff"],
    ["Social", "People", "M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M2 21v-2a4 4 0 0 1 3-3.9", "#ff6a00"],
    ["Time", "Productivity", "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 6v6l4 2", "#f5ff00"],
    ["Data", "Charts", "M4 19V5M8 19v-8M12 19V7M16 19v-5M20 19V9", "#00ffd5"],
    ["Interface", "Controls", "M4 7h16M4 12h16M4 17h16", "#ff003c"]
  ];
  const INDEX_FALLBACK = {
    generatedAt: new Date().toISOString(),
    marketingTotal: 134701,
    actualIndexed: 134701,
    libraries: [
      { name: "Lucide", slug: "lucide", count: 1979, color: "#ff2d9b", description: "Beautiful and consistent outline icons", version: "0.468.0", docsUrl: "https://lucide.dev/icons/", npmPackage: "lucide", remotePrefix: "lucide", tier: 1 },
      { name: "Tabler Icons", slug: "tabler", count: 6324, color: "#00c3ff", description: "Interface icons for product design", version: "3.24.0", docsUrl: "https://tabler.io/icons/icon/", npmPackage: "@tabler/icons", remotePrefix: "tabler", tier: 1 },
      { name: "Phosphor", slug: "phosphor", count: 9198, color: "#f5ff00", description: "Flexible icons across weights and fills", version: "2.1.0", docsUrl: "https://phosphoricons.com/", npmPackage: "@phosphor-icons/core", remotePrefix: "ph", tier: 2 },
      { name: "Material Design Icons", slug: "material", count: 14001, color: "#00ff88", description: "Community Material Design icon catalog", version: "7.4.47", docsUrl: "https://pictogrammers.com/library/mdi/icon/", npmPackage: "@mdi/js", remotePrefix: "mdi", tier: 2 },
      { name: "Remix Icons", slug: "remix", count: 3244, color: "#bf00ff", description: "Neutral symbol system for products and interfaces", version: "4.6.0", docsUrl: "https://remixicon.com/icon/", npmPackage: "remixicon", remotePrefix: "ri", tier: 2 },
      { name: "Iconoir", slug: "iconoir", count: 2020, color: "#ff6a00", description: "Icons crafted for modern interfaces", version: "7.10.0", docsUrl: "https://iconoir.com/", npmPackage: "iconoir", remotePrefix: "iconoir", tier: 2 },
      { name: "Heroicons", slug: "heroicons", count: 1297, color: "#00ffd5", description: "Outline and solid icons from Tailwind Labs", version: "2.2.0", docsUrl: "https://heroicons.com/", npmPackage: "heroicons", remotePrefix: "heroicons", tier: 1 },
      { name: "Bootstrap Icons", slug: "bootstrap", count: 2090, color: "#ff003c", description: "Official Bootstrap SVG icon library", version: "1.11.3", docsUrl: "https://icons.getbootstrap.com/icons/", npmPackage: "bootstrap-icons", remotePrefix: "bi", tier: 2 },
      { name: "Feather", slug: "feather", count: 286, color: "#ff2d9b", description: "Simply beautiful interface icons", version: "4.29.2", docsUrl: "https://feathericons.com/?query=", npmPackage: "feather-icons", remotePrefix: "feather", tier: 2 },
      { name: "Mingcute", slug: "mingcute", count: 3352, color: "#00c3ff", description: "Clean icons for high quality product work", version: "2.97.0", docsUrl: "https://www.mingcute.com/", npmPackage: "mingcute_icon", remotePrefix: "mingcute", tier: 2 },
      { name: "Solar Icons", slug: "solar", count: 7410, color: "#f5ff00", description: "A broad icon family with multiple expressive weights", version: "1.0.0", docsUrl: "https://www.figma.com/community/file/1166831539721848736", npmPackage: "solar-icon-set", remotePrefix: "solar", tier: 2 },
      { name: "Octicons", slug: "octicons", count: 929, color: "#00ff88", description: "GitHub interface iconography", version: "19.13.0", docsUrl: "https://primer.style/foundations/icons/", npmPackage: "@primer/octicons", remotePrefix: "octicon", tier: 2 },
      { name: "CSS.gg", slug: "cssgg", count: 705, color: "#bf00ff", description: "Minimal icons from the CSS.gg set", version: "2.1.1", docsUrl: "https://css.gg/", npmPackage: "css.gg", remotePrefix: "gg", tier: 2 },
      { name: "Radix Icons", slug: "radix", count: 345, color: "#ff6a00", description: "Crisp icons by the Radix design system", version: "1.3.2", docsUrl: "https://www.radix-ui.com/icons", npmPackage: "@radix-ui/react-icons", remotePrefix: "radix-icons", tier: 2 },
      { name: "Ant Design Icons", slug: "antdesign", count: 1870, color: "#00ffd5", description: "Ant Design product iconography", version: "5.5.2", docsUrl: "https://ant.design/components/icon", npmPackage: "@ant-design/icons", remotePrefix: "ant-design", tier: 2 },
      { name: "Fluent UI Icons", slug: "fluent", count: 20170, color: "#ff003c", description: "Microsoft Fluent icon system", version: "2.0.293", docsUrl: "https://github.com/microsoft/fluentui-system-icons", npmPackage: "@fluentui/svg-icons", remotePrefix: "fluent", tier: 3 },
      { name: "Carbon Icons", slug: "carbon", count: 2644, color: "#ff2d9b", description: "IBM Carbon Design System icons", version: "11.57.0", docsUrl: "https://carbondesignsystem.com/elements/icons/library/", npmPackage: "@carbon/icons", remotePrefix: "carbon", tier: 3 },
      { name: "Ionicons", slug: "ionicons", count: 2607, color: "#00c3ff", description: "Premium icons for Ionic apps and web interfaces", version: "7.4.0", docsUrl: "https://ionic.io/ionicons", npmPackage: "ionicons", remotePrefix: "ion", tier: 3 },
      { name: "Eva Icons", slug: "eva", count: 490, color: "#f5ff00", description: "Interface icons by Akveo", version: "1.1.3", docsUrl: "https://akveo.github.io/eva-icons/", npmPackage: "eva-icons", remotePrefix: "eva", tier: 3 },
      { name: "Boxicons", slug: "boxicons", count: 3389, color: "#00ff88", description: "High quality web icons for common product patterns", version: "2.1.4", docsUrl: "https://boxicons.com/", npmPackage: "boxicons", remotePrefix: "bx,bxs,bxl", tier: 3 },
      { name: "Material Symbols", slug: "materialsymbols", count: 18547, color: "#64748b", description: "Google Material Symbols icon family", version: "current", docsUrl: "https://fonts.google.com/icons", npmPackage: "material-symbols", remotePrefix: "material-symbols", tier: 4 },
      { name: "Material Symbols Light", slug: "materialsymbolslight", count: 15969, color: "#94a3b8", description: "Light weight Google Material Symbols collection", version: "current", docsUrl: "https://fonts.google.com/icons", npmPackage: "material-symbols", remotePrefix: "material-symbols-light", tier: 4 },
      { name: "IconPark Outline", slug: "iconparkoutline", count: 2658, color: "#2563eb", description: "ByteDance IconPark outline symbol library", version: "1.4.2", docsUrl: "https://iconpark.oceanengine.com/official", npmPackage: "@icon-park/svg", remotePrefix: "icon-park-outline", tier: 4 },
      { name: "IconPark Solid", slug: "iconparksolid", count: 1970, color: "#0f766e", description: "ByteDance IconPark solid icon variants", version: "1.4.2", docsUrl: "https://iconpark.oceanengine.com/official", npmPackage: "@icon-park/svg", remotePrefix: "icon-park-solid", tier: 4 },
      { name: "Huge Icons", slug: "hugeicons", count: 5115, color: "#7c3aed", description: "Large modern icon family for product interfaces", version: "current", docsUrl: "https://hugeicons.com/icons", npmPackage: "hugeicons", remotePrefix: "hugeicons", tier: 4 },
      { name: "Pixel Art Icons", slug: "pixelarticons", count: 1099, color: "#db2777", description: "Crisp pixel-style interface icons", version: "2.1.0", docsUrl: "https://pixelarticons.com/", npmPackage: "pixelarticons", remotePrefix: "pixelarticons", tier: 4 },
      { name: "Line MD", slug: "linemd", count: 1279, color: "#0891b2", description: "Animated and static material line icons", version: "3.0.5", docsUrl: "https://icon-sets.iconify.design/line-md/", npmPackage: "line-md", remotePrefix: "line-md", tier: 4 },
      { name: "Simple Icons", slug: "simpleicons", count: 3714, color: "#111827", description: "Brand and product glyphs from Simple Icons", version: "16.18.0", docsUrl: "https://simpleicons.org/", npmPackage: "simple-icons", remotePrefix: "simple-icons", tier: 4 }
    ]
  };

  const state = {
    icons: new Map(),
    libraries: [],
    loadedLibraries: new Set(),
    loadingLibraries: new Map(),
    failedLibraries: new Map(),
    selectedLibraries: new Set(),
    selectedIcons: new Set(),
    filteredIcons: [],
    activeStyle: "all",
    activeCategory: "",
    searchQuery: "",
    sort: "relevance",
    previewSize: 24,
    density: "default",
    selectMode: false,
    compareMode: false,
    focusedIndex: 0,
    currentIconId: "",
    lastFailedSlug: "",
    route: "#/",
    visibleLimit: 160,
    batchSize: 160,
    renderedCount: 0,
    inlineAdRendered: false,
    rowHeight: 88,
    cardMin: 80,
    cols: 8,
    detail: {
      color: "#2563eb",
      strokeWidth: 2,
      size: 128,
      bg: "dark",
      format: "svg"
    }
  };

  const els = {};
  let searchTimer = 0;
  let scrollRaf = 0;
  let searchIndexTimer = 0;
  let backgroundFilterTimer = 0;
  let homeRenderTimer = 0;
  let categoryRenderTimer = 0;
  let lazyLibraryLoad = null;

  function $(id) {
    return document.getElementById(id);
  }

  function cacheElements() {
    Object.assign(els, {
      html: document.documentElement,
      header: $("main-header"),
      sidebar: $("left-sidebar"),
      sidebarToggle: $("sidebar-toggle"),
      sidebarCollapse: $("sidebar-collapse"),
      logo: $("logo-btn"),
      search: $("main-search"),
      searchShell: $("search-shell"),
      searchClear: $("search-clear"),
      autocomplete: $("search-autocomplete"),
      resultCount: $("result-count"),
      libList: $("lib-list-container"),
      libSearch: $("lib-search"),
      selectedLibsCount: $("selected-libs-count"),
      categoryList: $("category-list-container"),
      categoryToggle: $("category-toggle"),
      stylePills: $("style-pills-container"),
      sortSelect: $("sort-select"),
      previewSlider: $("preview-size-slider"),
      previewLabel: $("preview-size-label"),
      clearFilters: $("clear-filters-btn"),
      home: $("homepage-view"),
      gridView: $("grid-view"),
      seoHeader: $("seo-header"),
      seoTitle: $("seo-title"),
      seoDescription: $("seo-description"),
      homeCategories: $("home-categories"),
      featuredLibraries: $("featured-libraries"),
      trendingIcons: $("trending-icons"),
      browseAll: $("browse-all-btn"),
      indexedStat: $("indexed-stat"),
      gridStatus: $("grid-status"),
      loadStatus: $("load-status"),
      gridContainer: $("virtual-grid-container"),
      gridSpacer: $("virtual-grid-spacer"),
      iconGrid: $("icon-grid"),
      loadingMore: $("loading-more"),
      noResults: $("no-results"),
      noResultsText: $("no-results-text"),
      suggestionChips: $("suggestion-chips"),
      libraryError: $("library-error-card"),
      libraryErrorText: $("library-error-text"),
      libraryRetry: $("library-retry-btn"),
      detailPanel: $("detail-panel"),
      dpClose: $("dp-close"),
      dpTitle: $("dp-title"),
      dpLibraryName: $("dp-library-name"),
      dpPreview: $("dp-preview-box"),
      dpSizeSlider: $("dp-size-slider"),
      dpSizeVal: $("dp-size-val"),
      dpExactSize: $("dp-exact-size"),
      dpStrokeSlider: $("dp-stroke-slider"),
      dpStrokeVal: $("dp-stroke-val"),
      dpColorInput: $("dp-color-input"),
      dpVariants: $("dp-variants"),
      dpMatches: $("dp-matches"),
      dpCodePreview: $("dp-code-preview"),
      dpCopyCode: $("dp-copy-code"),
      dpInstallCode: $("dp-install-code"),
      dpImportCode: $("dp-import-code"),
      dpDocsLink: $("dp-docs-link"),
      dpLibBadge: $("dp-lib-badge"),
      dpPopularityBar: $("dp-popularity-bar"),
      dpTags: $("dp-tags"),
      dpIconId: $("dp-icon-id"),
      dpShare: $("dp-share"),
      dpCompare: $("dp-compare"),
      dpDownloadSvg: $("dp-dl-svg"),
      dpDownloadZip: $("dp-dl-zip"),
      themeToggle: $("theme-toggle"),
      collectionsToggle: $("collections-toggle"),
      collectionBadge: $("collection-badge"),
      collectionsList: $("collections-list"),
      collectionNameInput: $("collection-name-input"),
      collectionCreate: $("collection-create-btn"),
      compareToggle: $("compare-toggle"),
      compareTitle: $("compare-title"),
      compareGrid: $("compare-grid"),
      compareDownload: $("compare-download"),
      shortcutsModal: $("shortcuts-modal"),
      selectMode: $("select-mode-btn"),
      bulkBar: $("bulk-action-bar"),
      bulkNum: $("bulk-num"),
      bulkDownload: $("bulk-download"),
      bulkCollect: $("bulk-collect"),
      bulkClear: $("bulk-clear"),
      bulkColor: $("bulk-color"),
      sitemap: $("sitemap-download")
    });
  }

  function request(url, options = {}) {
    return fetch(url, { cache: "force-cache", ...options });
  }

  async function loadIndex() {
    try {
      const response = await request("data/index.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const index = Array.isArray(data) ? { libraries: data } : data;
      state.libraries = (index.libraries || []).map((lib) => ({ ...lib, loaded: false }));
      els.indexedStat.dataset.target = String(index.actualIndexed || state.libraries.reduce((total, lib) => total + (lib.count || 0), 0));
    } catch (error) {
      state.libraries = INDEX_FALLBACK.libraries.map((lib) => ({ ...lib, loaded: false }));
      els.indexedStat.dataset.target = String(INDEX_FALLBACK.actualIndexed);
      ui().toast("Using built-in library index fallback", "warning");
    }
  }

  function ui() {
    return window.IconVoidUI;
  }

  function iconTools() {
    return window.IconVoidIcons;
  }

  function libraryBySlug(slug) {
    return state.libraries.find((lib) => lib.slug === slug);
  }

  function totalLibraryCount() {
    return state.libraries.reduce((total, lib) => total + Number(lib.count || 0), 0);
  }

  function libraryIconSvg(slug) {
    const paths = {
      lucide: '<path d="M12 3 4.5 7.3v8.8L12 21l7.5-4.9V7.3L12 3Z"></path><path d="M8.5 9.5h7M8.5 14.5h7"></path>',
      tabler: '<path d="M4 5h16v14H4z"></path><path d="M8 5v14M16 5v14M4 11h16"></path>',
      phosphor: '<path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M8.6 15.5A6.5 6.5 0 1 1 15.4 15.5c-.9.6-1.4 1.4-1.4 2.5h-4c0-1.1-.5-1.9-1.4-2.5Z"></path>',
      material: '<path d="M12 3a9 9 0 1 0 0 18h1.2a1.8 1.8 0 0 0 1.2-3.1 1.2 1.2 0 0 1 .8-2.1H17a4 4 0 0 0 4-4C21 6.9 17 3 12 3Z"></path><path d="M7.5 10.5h.01M9.5 7.5h.01M13.5 7.5h.01M16.5 10.5h.01"></path>',
      remix: '<path d="M5 5h9a5 5 0 0 1 0 10h-1l4 4h-5l-4-4H5V5Z"></path><path d="M9 9h5a1 1 0 0 1 0 2H9V9Z"></path>',
      iconoir: '<path d="M4 12a8 8 0 0 1 8-8h8v8a8 8 0 0 1-8 8H4v-8Z"></path><path d="M8 12a4 4 0 0 1 4-4h4v4a4 4 0 0 1-4 4H8v-4Z"></path>',
      heroicons: '<path d="M12 3 5 6v6c0 4.3 2.8 7.5 7 9 4.2-1.5 7-4.7 7-9V6l-7-3Z"></path><path d="m9 12 2 2 4-5"></path>',
      bootstrap: '<path d="M8 4h6.5a4 4 0 0 1 1 7.9A4.2 4.2 0 0 1 14 20H8V4Z"></path><path d="M11 7.5h3a1.7 1.7 0 0 1 0 3.5h-3zM11 13h3.4a1.8 1.8 0 0 1 0 3.6H11z"></path>',
      feather: '<path d="M20 4c-7 1-12 5.5-14 14l-2 2 2-2c8.5-2 13-7 14-14Z"></path><path d="M7 17 14 10"></path>',
      mingcute: '<path d="M4 6h16v12H4z"></path><path d="M8 10h8M8 14h5"></path>',
      solar: '<path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4"></path><circle cx="12" cy="12" r="4"></circle>',
      octicons: '<path d="M12 3a9 9 0 0 0-3 17c.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.5 1.1 3.1.8.1-.7.4-1.1.7-1.4-2.2-.2-4.5-1.1-4.5-4.9 0-1.1.4-2 1.1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.8 1a9.6 9.6 0 0 1 5.2 0c1.9-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7.7.7 1.1 1.6 1.1 2.7 0 3.8-2.3 4.7-4.5 4.9.4.3.8 1 .8 2v2.7c0 .3.2.6.8.5A9 9 0 0 0 12 3Z"></path>',
      cssgg: '<path d="M6 5h12l-1 12-5 2-5-2L6 5Z"></path><path d="M9 9h6M9.5 13h5l-.3 2.2-2.2.8-2.2-.8"></path>',
      radix: '<path d="M12 4a4 4 0 1 1 0 8H8V8a4 4 0 0 1 4-4Z"></path><path d="M8 12h4a4 4 0 1 1-4 4v-4Z"></path>',
      antdesign: '<path d="m12 3 9 16h-4l-1.5-3h-7L7 19H3l9-16Z"></path><path d="m10 12h4l-2-4-2 4Z"></path>',
      fluent: '<path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v5H4zM13 14h7v5h-7z"></path>',
      carbon: '<path d="M5 5h14v14H5z"></path><path d="M9 5v14M15 5v14M5 9h14M5 15h14"></path>',
      ionicons: '<circle cx="12" cy="12" r="8"></circle><path d="M18 5.5 20 3M12 8v4l3 2"></path>',
      eva: '<path d="M12 4 4 9l8 11 8-11-8-5Z"></path><path d="M4 9h16M9 9l3 11 3-11"></path>',
      boxicons: '<path d="M5 7 12 3l7 4v10l-7 4-7-4V7Z"></path><path d="m5 7 7 4 7-4M12 11v10"></path>',
      materialsymbols: '<path d="M5 5h14v14H5z"></path><path d="M9 9h6M9 12h6M9 15h4"></path>',
      materialsymbolslight: '<path d="M5 5h14v14H5z"></path><path d="M8 8h8M8 12h8M8 16h5"></path>',
      iconparkoutline: '<path d="M4 7 12 3l8 4v10l-8 4-8-4V7Z"></path><path d="m8 9 4 2 4-2M8 15l4-2 4 2"></path>',
      iconparksolid: '<path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z"></path><path d="M8 9.5 12 12l4-2.5M8 14.5 12 17l4-2.5"></path>',
      hugeicons: '<path d="M5 4v16M19 4v16M5 12h14"></path><path d="M9 8v8M15 8v8"></path>',
      pixelarticons: '<path d="M6 6h12v12H6z"></path><path d="M9 9h2v2H9zM13 9h2v2h-2zM9 13h6v2H9z"></path>',
      linemd: '<path d="M4 7h10a4 4 0 0 1 0 8H8"></path><path d="m8 11-4 4 4 4"></path><path d="M16 7h4M17 11h3M16 15h4"></path>',
      simpleicons: '<circle cx="12" cy="12" r="8"></circle><path d="M8 12h8M12 8v8"></path>',
      default: '<path d="M4 5h16v14H4z"></path><path d="M8 9h8M8 13h8"></path>'
    };
    return `<svg class="lib-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[slug] || paths.default}</svg>`;
  }

  function renderSidebarLibraries() {
    const filter = (els.libSearch.value || "").toLowerCase();
    const allRow = !filter ? `<a class="lib-row all-icons-row ${state.selectedLibraries.size === 0 && !state.activeCategory ? "active" : ""}" href="#/search" data-all-icons="true">
      <span class="lib-badge">${libraryIconSvg("default")}</span>
      <span class="lib-name">All Icons</span>
      <span class="lib-count">${totalLibraryCount().toLocaleString()}</span>
    </a>` : "";
    els.libList.innerHTML = allRow + state.libraries
      .filter((lib) => !filter || `${lib.name} ${lib.slug}`.toLowerCase().includes(filter))
      .map((lib, index) => {
        const active = state.selectedLibraries.has(lib.slug);
        const loading = state.loadingLibraries.has(lib.slug);
        const failed = state.failedLibraries.has(lib.slug);
        return `<label class="lib-row ${active ? "active" : ""} ${loading ? "loading" : ""}" data-slug="${lib.slug}" style="animation-delay:${Math.min(index * 30, 1000)}ms">
          <span class="lib-badge">${libraryIconSvg(lib.slug)}</span>
          <span class="lib-name">${escapeHtml(lib.name)}</span>
          <span class="lib-count">${failed ? "retry" : Number(lib.count || 0).toLocaleString()}</span>
          <input class="lib-check" type="checkbox" value="${lib.slug}" ${active ? "checked" : ""}>
        </label>`;
      }).join("");
    updateFilterCounters();
  }

  function isAllIconsGroupedMode() {
    return state.selectedLibraries.size === 0 &&
      !state.searchQuery &&
      !state.activeCategory &&
      (!state.activeStyle || state.activeStyle === "all");
  }

  function sortAllIconsByLibrary() {
    const order = new Map(state.libraries.map((lib, index) => [lib.slug, index]));
    state.filteredIcons.sort((a, b) => {
      const libDelta = (order.get(a.librarySlug) ?? 9999) - (order.get(b.librarySlug) ?? 9999);
      if (libDelta) return libDelta;
      return (b.popularity || 0) - (a.popularity || 0) || a.name.localeCompare(b.name);
    });
  }

  function renderCategories() {
    const counts = new Map();
    for (const icon of state.icons.values()) {
      counts.set(icon.category, (counts.get(icon.category) || 0) + 1);
    }
    els.categoryList.innerHTML = CATEGORY_META.map(([name, sub, , color]) => {
      const active = state.activeCategory === name;
      return `<button class="category-item ${active ? "active" : ""}" data-category="${escapeHtml(name)}">
        <span class="category-dot" style="background:${color};color:${color}"></span>
        <span>${escapeHtml(name)}</span>
        <span class="category-count">${Number(counts.get(name) || 0).toLocaleString()}</span>
      </button>
      <button class="category-item sub-category ${active ? "active" : ""}" data-category="${escapeHtml(name)}">
        <span></span><span>${escapeHtml(sub)}</span><span></span>
      </button>`;
    }).join("");
  }

  function scheduleCategoriesRender() {
    clearTimeout(categoryRenderTimer);
    categoryRenderTimer = setTimeout(() => {
      categoryRenderTimer = 0;
      renderCategories();
    }, 180);
  }

  function renderHome() {
    els.homeCategories.innerHTML = CATEGORY_META.map(([name, sub, path, color], index) => `
      <article class="category-card" data-home-category="${escapeHtml(name)}" style="background:linear-gradient(135deg, ${color}18, transparent 60%), var(--glass-2);animation-delay:${index * 35}ms">
        <svg viewBox="0 0 24 24" style="color:${color}"><path d="${path}"></path></svg>
        <h3>${escapeHtml(name)}</h3>
        <p>${escapeHtml(sub)}</p>
      </article>
    `).join("");
    els.featuredLibraries.innerHTML = state.libraries.slice(0, 8).map((lib, index) => `
      <article class="lib-card" data-home-library="${lib.slug}" style="animation-delay:${index * 35}ms">
        <span class="lib-card-mark">${libraryIconSvg(lib.slug)}</span>
        <h3>${escapeHtml(lib.name)}</h3>
        <p>${Number(lib.count || 0).toLocaleString()} icons - ${escapeHtml(lib.description || "")}</p>
      </article>
    `).join("");
    const trending = Array.from(state.icons.values()).sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 24);
    els.trendingIcons.innerHTML = trending.map((icon) => `
      <button class="trend-card" data-icon-id="${icon.id}">
        ${iconTools().renderSVG(icon)}
        <span>${escapeHtml(icon.name)}</span>
      </button>
    `).join("");
    renderMarquee(trending);
  }

  function renderMarquee(source) {
    const icons = source.length ? source.slice(0, 20) : Array.from(state.icons.values()).slice(0, 20);
    const row = icons.concat(icons).map((icon) => `<span class="mq-icon">${iconTools().renderSVG(icon)}</span>`).join("");
    const m1 = $("marquee-1");
    const m2 = $("marquee-2");
    if (m1) m1.innerHTML = row;
    if (m2) m2.innerHTML = icons.slice().reverse().concat(icons).map((icon) => `<span class="mq-icon">${iconTools().renderSVG(icon)}</span>`).join("");
  }

  function nextUnloadedLibrary() {
    return state.libraries.find((lib) => !state.loadedLibraries.has(lib.slug) && !state.failedLibraries.has(lib.slug));
  }

  function canLazyLoadBrowseLibrary() {
    if (els.gridView.classList.contains("hidden")) return false;
    if (state.selectedLibraries.size > 0) return false;
    return Boolean(nextUnloadedLibrary());
  }

  async function ensureInitialBrowseLibrary() {
    if (state.loadedLibraries.size || state.loadingLibraries.size) return;
    const lib = nextUnloadedLibrary();
    if (!lib) return;
    ui().createSkeletonRows(els.iconGrid, 2, Math.max(4, state.cols || 8));
    await loadLibrary(lib.slug);
    renderHome();
  }

  async function loadNextLibraryForBrowse() {
    if (!canLazyLoadBrowseLibrary()) return null;
    if (lazyLibraryLoad) return lazyLibraryLoad;
    const lib = nextUnloadedLibrary();
    if (!lib) return null;
    const previousVisibleLimit = state.visibleLimit;
    const previousResultCount = state.filteredIcons.length;
    els.loadingMore.classList.remove("hidden");
    lazyLibraryLoad = (async () => {
      await loadLibrary(lib.slug);
      if (!els.gridView.classList.contains("hidden") && state.selectedLibraries.size === 0) {
        applyFilters({ preserveLimit: true });
        const nextLimit = Math.max(previousVisibleLimit + state.batchSize, previousResultCount + state.batchSize);
        state.visibleLimit = Math.min(state.filteredIcons.length, nextLimit);
        updateVirtualScroll(true);
      }
      renderHome();
      generateSitemap();
      if (!nextUnloadedLibrary()) {
        els.loadStatus.textContent = `All ${state.libraries.reduce((total, item) => total + Number(item.count || 0), 0).toLocaleString()} icons are available`;
        setTimeout(() => {
          if (els.loadStatus.textContent.startsWith("All ")) els.loadStatus.textContent = "";
        }, 2500);
      }
      return lib.slug;
    })().finally(() => {
      lazyLibraryLoad = null;
      els.loadingMore.classList.add("hidden");
    });
    return lazyLibraryLoad;
  }

  async function loadLibrary(slug) {
    if (state.loadedLibraries.has(slug)) return Array.from(state.icons.values()).filter((icon) => icon.librarySlug === slug);
    if (state.loadingLibraries.has(slug)) return state.loadingLibraries.get(slug);
    const lib = libraryBySlug(slug);
    if (!lib) return [];
    const task = (async () => {
      setLibraryLoading(slug, true);
      try {
        let icons = await loadLocalLibrary(lib);
        icons = enrichVariants(icons);
        for (const icon of icons) state.icons.set(icon.id, icon);
        state.loadedLibraries.add(slug);
        state.failedLibraries.delete(slug);
        lib.loaded = true;
        scheduleCategoriesRender();
        scheduleSearchIndex();
        return icons;
      } catch (error) {
        state.failedLibraries.set(slug, error);
        state.lastFailedSlug = slug;
        showLibraryError(slug, error);
        ui().toast(`Failed to load ${lib.name}`, "error");
        return [];
      } finally {
        state.loadingLibraries.delete(slug);
        setLibraryLoading(slug, false);
      }
    })();
    state.loadingLibraries.set(slug, task);
    return task;
  }

  async function loadLocalLibrary(lib) {
    const response = await request(`data/${lib.slug}.json`);
    if (!response.ok) throw new Error(`Local JSON HTTP ${response.status}`);
    const data = await response.json();
    if (Array.isArray(data)) return data.map((icon, index) => completeIcon(icon, lib, index));
    return normalizeIconifySet(lib, data);
  }

  function completeIcon(icon, lib, index) {
    const [category, subCategory] = icon.category ? [icon.category, icon.subCategory || "Controls"] : categorize(icon.name);
    return {
      id: icon.id || `${lib.slug}-${icon.name}`,
      name: icon.name || icon.id,
      nameVariants: icon.nameVariants || tagsFor(icon.name, category, subCategory, lib).slice(0, 8),
      library: icon.library || lib.name,
      librarySlug: icon.librarySlug || lib.slug,
      libraryVersion: icon.libraryVersion || lib.version,
      style: icon.style || deriveStyle(icon.name, lib.remotePrefix || lib.slug),
      tags: icon.tags || tagsFor(icon.name, category, subCategory, lib),
      category,
      subCategory,
      svgContent: icon.svgContent || "",
      svgPath: icon.svgPath || icon.svgContent || "",
      viewBox: icon.viewBox || `0 0 ${icon.width || 24} ${icon.height || 24}`,
      width: icon.width || 24,
      height: icon.height || 24,
      strokeWidth: icon.strokeWidth ?? 2,
      hasVariants: Boolean(icon.hasVariants),
      variantIds: icon.variantIds || [],
      docsUrl: icon.docsUrl || `${lib.docsUrl || ""}${encodeURIComponent(icon.name || "")}`,
      npmPackage: icon.npmPackage || lib.npmPackage,
      jsxImport: icon.jsxImport || `import { ${pascal(icon.name)} } from '${lib.npmPackage || lib.slug}'`,
      popularity: icon.popularity || Math.max(100, 10000 - ((index * 17) % 9900)),
      dateAdded: icon.dateAdded || dateFor(index)
    };
  }

  function normalizeIconifySet(lib, data, prefixOverride) {
    const prefix = prefixOverride || data.prefix || lib.remotePrefix || lib.slug;
    const defaults = { width: data.width || 24, height: data.height || 24, left: data.left || 0, top: data.top || 0 };
    const entries = [];
    for (const [name, raw] of Object.entries(data.icons || {})) {
      entries.push([name, { ...defaults, ...raw }]);
    }
    for (const [name, alias] of Object.entries(data.aliases || {})) {
      const parent = data.icons?.[alias.parent];
      if (parent?.body) entries.push([name, { ...defaults, ...parent, ...alias, body: parent.body }]);
    }
    return entries.filter(([, raw]) => raw.body).map(([rawName, raw], index) => {
      const name = rawName.replace(/^(baseline|outline|round|sharp|twotone)-/, "").replace(/_(24|20|16|12)$/, "");
      const [category, subCategory] = categorize(name);
      const id = `${lib.slug}-${rawName}`.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
      return completeIcon({
        id,
        name,
        nameVariants: tagsFor(name, category, subCategory, lib).slice(0, 8),
        library: lib.name,
        librarySlug: lib.slug,
        libraryVersion: lib.version,
        style: deriveStyle(rawName, prefix),
        tags: tagsFor(name, category, subCategory, lib),
        category,
        subCategory,
        svgPath: raw.body,
        viewBox: `${raw.left || 0} ${raw.top || 0} ${raw.width || defaults.width} ${raw.height || defaults.height}`,
        width: raw.width || defaults.width,
        height: raw.height || defaults.height,
        strokeWidth: deriveStyle(rawName, prefix) === "thin" ? 1 : 2
      }, lib, index);
    });
  }

  function enrichVariants(icons) {
    const groups = new Map();
    for (const icon of icons) {
      const base = window.IconVoidSearch.baseName(icon.name);
      const list = groups.get(base) || [];
      list.push(icon.id);
      groups.set(base, list);
    }
    for (const icon of icons) {
      const list = groups.get(window.IconVoidSearch.baseName(icon.name)) || [];
      icon.hasVariants = list.length > 1;
      icon.variantIds = list.slice(0, 14);
    }
    return icons;
  }

  function setLibraryLoading(slug, loading) {
    renderSidebarLibraries();
    const row = els.libList.querySelector(`[data-slug="${CSS.escape(slug)}"]`);
    if (row) row.classList.toggle("loading", loading);
    els.loadStatus.textContent = loading ? `Loading ${libraryBySlug(slug)?.name || slug}...` : "";
  }

  function showLibraryError(slug, error) {
    els.libraryError.classList.remove("hidden");
    els.libraryErrorText.textContent = `${libraryBySlug(slug)?.name || slug}: ${error.message || error}`;
  }

  function hideLibraryError() {
    els.libraryError.classList.add("hidden");
  }

  function scheduleSearchIndex() {
    clearTimeout(searchIndexTimer);
    searchIndexTimer = setTimeout(() => {
      searchIndexTimer = 0;
      const build = () => window.IconVoidSearch.buildSearchIndex(Array.from(state.icons.values()));
      if ("requestIdleCallback" in window) requestIdleCallback(build, { timeout: 1600 });
      else setTimeout(build, 0);
    }, 240);
  }

  function scheduleBackgroundFilter() {
    clearTimeout(backgroundFilterTimer);
    backgroundFilterTimer = setTimeout(() => {
      backgroundFilterTimer = 0;
      if (!els.gridView.classList.contains("hidden")) applyFilters({ preserveLimit: true });
      else updateCounts();
    }, 180);
  }

  function scheduleHomeRender() {
    clearTimeout(homeRenderTimer);
    homeRenderTimer = setTimeout(() => {
      homeRenderTimer = 0;
      renderHome();
    }, 320);
  }

  function applyFilters(options = {}) {
    const filters = {
      librarySlugs: state.selectedLibraries,
      style: state.activeStyle,
      category: state.activeCategory,
      query: state.searchQuery,
      sort: state.sort
    };
    state.filteredIcons = window.IconVoidSearch.filterAndSort(Array.from(state.icons.values()), filters);
    if (isAllIconsGroupedMode()) sortAllIconsByLibrary();
    if (!options.preserveLimit) {
      state.visibleLimit = state.batchSize;
    } else {
      state.visibleLimit = Math.max(state.batchSize, Math.min(state.visibleLimit, state.filteredIcons.length));
    }
    state.renderedCount = 0;
    state.inlineAdRendered = false;
    updateSeoForRoute();
    updateCounts();
    buildRows();
    if (options.resetScroll) els.gridContainer.scrollTop = 0;
    updateVirtualScroll(true);
    renderSuggestions();
    if (state.filteredIcons.length === 0) {
      els.noResults.classList.remove("hidden");
      els.noResultsText.textContent = state.searchQuery ? `No icons found for "${state.searchQuery}".` : "No icons found.";
    } else {
      els.noResults.classList.add("hidden");
    }
  }

  function updateCounts() {
    const count = displayedCount();
    ui().animateNumber(els.resultCount, count);
    const label = state.selectedLibraries.size === 1
      ? `${libraryBySlug(Array.from(state.selectedLibraries)[0])?.name || "Library"}`
      : state.activeCategory || "All icons";
    els.gridStatus.innerHTML = `<strong>${escapeHtml(label)}</strong> <span>${count.toLocaleString()} icons</span>`;
    updateFilterCounters();
  }

  function displayedCount() {
    const hasQuery = Boolean(state.searchQuery);
    const hasStyle = state.activeStyle && state.activeStyle !== "all";
    const hasCategory = Boolean(state.activeCategory);
    if (!hasQuery && !hasStyle && !hasCategory && state.selectedLibraries.size === 1) {
      const slug = Array.from(state.selectedLibraries)[0];
      return Number(libraryBySlug(slug)?.count || state.filteredIcons.length);
    }
    if (!hasQuery && !hasStyle && !hasCategory && state.selectedLibraries.size === 0) {
      return state.libraries.reduce((total, lib) => total + Number(lib.count || 0), 0) || state.filteredIcons.length;
    }
    return state.filteredIcons.length;
  }

  function updateFilterCounters() {
    if (!els.selectedLibsCount) return;
    els.selectedLibsCount.textContent = state.selectedLibraries.size ? `${state.selectedLibraries.size} selected` : "All";
  }

  function buildRows() {
    els.gridSpacer.style.height = "0px";
  }

  function calculateGrid() {
    const width = Math.max(280, els.gridContainer.clientWidth - 12);
    if (state.density === "compact") {
      state.cardMin = 60;
      state.rowHeight = 68;
    } else if (state.density === "comfortable") {
      state.cardMin = 100;
      state.rowHeight = 118;
    } else {
      state.cardMin = 80;
      state.rowHeight = 88;
    }
    state.cols = Math.max(1, Math.floor((width + 8) / (state.cardMin + 8)));
    els.iconGrid.className = `density-${state.density} incremental-grid`;
    els.iconGrid.style.setProperty("--cols", state.cols);
    document.documentElement.style.setProperty("--card-row-height", `${state.rowHeight}px`);
  }

  function updateVirtualScroll(force = false) {
    if (!force && scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      if (!state.filteredIcons.length) {
        els.iconGrid.innerHTML = "";
        els.loadingMore.classList.add("hidden");
        state.renderedCount = 0;
        state.inlineAdRendered = false;
        return;
      }
      if (force || state.renderedCount > state.visibleLimit) {
        els.iconGrid.innerHTML = "";
        state.renderedCount = 0;
        state.inlineAdRendered = false;
      }
      const start = state.renderedCount;
      const end = Math.min(state.visibleLimit, state.filteredIcons.length);
      const parts = [];
      for (let index = start; index < end; index += 1) {
        if (isAllIconsGroupedMode() && shouldRenderLibraryHeader(index)) {
          parts.push(renderLibraryHeader(state.filteredIcons[index]));
        }
        parts.push(renderCard(state.filteredIcons[index], index));
      }
      if (parts.length) els.iconGrid.insertAdjacentHTML("beforeend", parts.join(""));
      state.renderedCount = end;
      els.loadingMore.classList.add("hidden");
    });
  }

  function shouldRenderLibraryHeader(index) {
    const icon = state.filteredIcons[index];
    if (!icon) return false;
    const previous = state.filteredIcons[index - 1];
    return index === 0 || !previous || previous.librarySlug !== icon.librarySlug;
  }

  function renderLibraryHeader(icon) {
    const lib = libraryBySlug(icon.librarySlug) || { name: icon.library, slug: icon.librarySlug, count: 0 };
    return `<div class="library-break" data-library-break="${escapeHtml(lib.slug)}">
      <span class="lib-badge">${libraryIconSvg(lib.slug)}</span>
      <div>
        <h2>${escapeHtml(lib.name)}</h2>
        <p>${Number(lib.count || 0).toLocaleString()} icons</p>
      </div>
    </div>`;
  }

  function renderCard(icon, visualIndex) {
    const selected = state.selectedIcons.has(icon.id);
    const focused = state.filteredIcons[state.focusedIndex]?.id === icon.id;
    const delay = Math.min(400, visualIndex * 15);
    return `<article class="icon-card ${selected ? "selected" : ""} ${focused ? "focused" : ""}" data-id="${icon.id}" tabindex="0" style="animation-delay:${delay}ms">
      <div class="icon-wrap" style="width:${state.previewSize}px;height:${state.previewSize}px">${iconTools().renderSVG(icon)}</div>
      ${state.density === "comfortable" ? `<div class="card-name">${escapeHtml(icon.name)}</div>` : ""}
      ${selected ? '<span class="select-check"><svg viewBox="0 0 24 24"><path d="m20 6-11 11-5-5"></path></svg></span>' : ""}
    </article>`;
  }

  function renderSuggestions() {
    if (!state.searchQuery) {
      els.suggestionChips.innerHTML = "";
      return;
    }
    const words = ["camera", "arrow", "user", "chart", "download", "lock"];
    els.suggestionChips.innerHTML = words.map((word, index) => `<button class="style-pill suggestion-chip" style="animation-delay:${index * 50}ms" data-suggest="${word}">${word}</button>`).join("");
  }

  function setRouteView(view) {
    const showHome = view === "home";
    els.home.classList.toggle("hidden", !showHome);
    els.home.classList.toggle("active", showHome);
    els.gridView.classList.toggle("hidden", showHome);
    els.gridView.classList.toggle("active", !showHome);
  }

  async function handleRoute() {
    state.route = window.location.hash || "#/";
    const hash = state.route;
    els.autocomplete.classList.add("hidden");
    hideLibraryError();
    if (hash === "#/" || hash === "#") {
      setRouteView("home");
      closeDetail(false);
      updateSeoHome();
      return;
    }
    setRouteView("grid");
    if (hash === "#/search" || hash === "#/all" || hash === "#/icons") {
      state.selectedLibraries.clear();
      state.activeCategory = "";
      renderSidebarLibraries();
      await ensureInitialBrowseLibrary();
      applyFilters({ resetScroll: true });
      ensureDesktopDetail();
    } else if (hash.startsWith("#/library/")) {
      const slug = decodeURIComponent(hash.split("/")[2] || "");
      state.selectedLibraries = new Set([slug]);
      renderSidebarLibraries();
      await loadLibrary(slug);
      state.activeCategory = "";
      applyFilters({ resetScroll: true });
      ensureDesktopDetail();
    } else if (hash.startsWith("#/category/")) {
      state.selectedLibraries.clear();
      state.activeCategory = decodeURIComponent(hash.split("/")[2] || "").replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
      renderSidebarLibraries();
      await ensureInitialBrowseLibrary();
      applyFilters({ resetScroll: true });
      ensureDesktopDetail();
    } else if (hash.startsWith("#/icon/")) {
      const id = decodeURIComponent(hash.split("/")[2] || "");
      const slug = id.split("-")[0];
      if (!state.icons.has(id) && libraryBySlug(slug)) await loadLibrary(slug);
      state.currentIconId = id;
      applyFilters();
      openDetail(id);
    } else if (hash.startsWith("#/collections")) {
      setRouteView("grid");
      applyFilters();
      ensureDesktopDetail();
      renderCollections();
      ui().openModal("collections-modal");
    } else {
      applyFilters({ resetScroll: true });
      ensureDesktopDetail();
    }
    renderCategories();
  }

  function normalizeStartupRoute() {
    const localDev = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(window.location.hostname);
    if (!window.location.hash || (localDev && window.location.hash === "#/search")) {
      history.replaceState(null, "", `${location.pathname}${location.search}#/`);
    }
  }

  function currentRouteHash() {
    return window.location.hash || "#/";
  }

  function slugForInitialRoute() {
    const hash = currentRouteHash();
    if (hash.startsWith("#/library/")) return decodeURIComponent(hash.split("/")[2] || "");
    if (hash.startsWith("#/icon/")) return decodeURIComponent(hash.split("/")[2] || "").split("-")[0];
    if (hash === "#/search" || hash === "#/all" || hash === "#/icons") return state.libraries[0]?.slug || "";
    return "";
  }

  async function prepareInitialIconsForRoute() {
    const slug = slugForInitialRoute();
    if (!slug || state.loadedLibraries.has(slug)) return;
    ui().createSkeletonRows(els.iconGrid, 3, Math.max(4, state.cols || 8));
    await loadLibrary(slug);
  }

  function updateSeoHome() {
    document.title = "IconVoid - 134,000+ Icons | Premium SVG Search";
    setMeta("description", "Search, compare, customize, copy, and download 134,000+ SVG icons in a frontend-only design tool.");
    setCanonical("#/");
    removeJsonLd();
  }

  function updateSeoForRoute() {
    const hash = window.location.hash || "#/";
    if (hash.startsWith("#/library/")) {
      const slug = decodeURIComponent(hash.split("/")[2] || "");
      const lib = libraryBySlug(slug);
      if (lib) {
        els.seoHeader.classList.remove("hidden");
        els.seoTitle.textContent = `${lib.name} Icons`;
        els.seoDescription.textContent = `${lib.description}. ${Number(lib.count || 0).toLocaleString()} indexed records, version ${lib.version}.`;
        document.title = `${lib.name} Icons - SVG Download | IconVoid`;
        setMeta("description", `Browse, customize, copy, and export ${lib.name} SVG icons in IconVoid.`);
        setCanonical(hash);
      }
    } else if (hash.startsWith("#/category/")) {
      els.seoHeader.classList.remove("hidden");
      els.seoTitle.textContent = `${state.activeCategory || "Category"} Icons`;
      els.seoDescription.textContent = `Filtered icon results for ${state.activeCategory || "this category"}.`;
      document.title = `${state.activeCategory || "Category"} Icons - SVG Download | IconVoid`;
      setMeta("description", `Browse and export ${state.activeCategory || "category"} SVG icons in IconVoid.`);
      setCanonical(hash);
    } else {
      els.seoHeader.classList.add("hidden");
    }
  }

  function updateSeoIcon(icon) {
    document.title = `${icon.name} Icon - SVG Download | IconVoid`;
    setMeta("description", `Download the ${icon.name} icon from ${icon.library}. Copy SVG, JSX, HTML, CSS, PNG, or ZIP from IconVoid.`);
    setMeta("og:title", `${icon.name} Icon - ${icon.library}`);
    setMeta("og:description", `SVG download for ${icon.name} from ${icon.library}.`);
    setCanonical(`#/icon/${icon.id}`);
    removeJsonLd();
    const script = document.createElement("script");
    script.id = "icon-jsonld";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ImageObject",
      name: `${icon.name} icon`,
      creator: icon.library,
      encodingFormat: "image/svg+xml",
      contentUrl: `${location.origin}${location.pathname}#/icon/${icon.id}`
    });
    document.head.appendChild(script);
  }

  function setMeta(name, content) {
    const selector = name.startsWith("og:") ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    const meta = document.querySelector(selector);
    if (meta) meta.setAttribute("content", content);
  }

  function setCanonical(hash) {
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `${location.origin}${location.pathname}${hash}`;
  }

  function removeJsonLd() {
    $("icon-jsonld")?.remove();
  }

  function openDetail(id) {
    const icon = state.icons.get(id);
    if (!icon) {
      showNotFound(id);
      return;
    }
    els.autocomplete.classList.add("hidden");
    state.currentIconId = id;
    const index = state.filteredIcons.findIndex((entry) => entry.id === id);
    if (index >= 0) state.focusedIndex = index;
    els.detailPanel.classList.remove("closed");
    renderDetail(icon);
    updateFocusedCard();
    updateSeoIcon(icon);
  }

  function openGridDetail(id) {
    const icon = state.icons.get(id);
    if (!icon) return;
    els.autocomplete.classList.add("hidden");
    state.currentIconId = id;
    const index = state.filteredIcons.findIndex((entry) => entry.id === id);
    if (index >= 0) state.focusedIndex = index;
    els.detailPanel.classList.remove("closed");
    renderDetail(icon);
    updateFocusedCard();
  }

  function updateFocusedCard() {
    ui().qsa(".icon-card.focused", els.iconGrid).forEach((card) => card.classList.remove("focused"));
    const card = els.iconGrid.querySelector(`[data-id="${CSS.escape(state.currentIconId)}"]`);
    if (card) card.classList.add("focused");
  }

  function ensureDesktopDetail() {
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    if (els.gridView.classList.contains("hidden")) return;
    if (!state.filteredIcons.length) {
      closeDetail(false);
      return;
    }
    const currentVisible = state.currentIconId && state.filteredIcons.some((icon) => icon.id === state.currentIconId);
    openGridDetail(currentVisible ? state.currentIconId : state.filteredIcons[0].id);
  }

  async function showAllIcons() {
    state.selectedLibraries.clear();
    state.activeCategory = "";
    state.activeStyle = "all";
    state.searchQuery = "";
    els.search.value = "";
    els.searchClear.classList.add("hidden");
    ui().qsa(".style-pill", els.stylePills).forEach((pill) => pill.classList.toggle("active", pill.dataset.style === "all"));
    renderSidebarLibraries();
    renderCategories();
    setRouteView("grid");
    document.body.classList.remove("sidebar-open");
    if (location.hash !== "#/search") history.replaceState(null, "", "#/search");
    await ensureInitialBrowseLibrary();
    applyFilters({ resetScroll: true });
    ensureDesktopDetail();
  }

  function showNotFound(id) {
    setRouteView("grid");
    els.noResults.classList.remove("hidden");
    els.noResultsText.textContent = `Icon not found: ${id}`;
    els.suggestionChips.innerHTML = '<button class="style-pill suggestion-chip" data-suggest="camera">camera</button><button class="style-pill suggestion-chip" data-suggest="arrow">arrow</button>';
  }

  function closeDetail(routeHome = true) {
    els.detailPanel.classList.add("closed");
    state.currentIconId = "";
    if (routeHome && window.location.hash.startsWith("#/icon/")) history.replaceState(null, "", "#/");
  }

  function renderDetail(icon) {
    els.dpTitle.textContent = "Customize";
    els.dpLibraryName.textContent = `${icon.library} / ${icon.name}`;
    refreshDetailPreview(icon);
    els.dpSizeSlider.value = state.detail.size;
    els.dpExactSize.value = state.detail.size;
    els.dpSizeVal.textContent = `${state.detail.size}px`;
    els.dpStrokeSlider.value = state.detail.strokeWidth;
    els.dpStrokeVal.textContent = `${state.detail.strokeWidth}px`;
    els.dpColorInput.value = state.detail.color;
    els.dpIconId.textContent = icon.id;
    els.dpLibBadge.textContent = `${icon.library} ${icon.libraryVersion || ""}`.trim();
    els.dpPopularityBar.style.width = `${Math.max(8, Math.min(100, (icon.popularity || 0) / 100))}%`;
    els.dpTags.innerHTML = (icon.tags || []).slice(0, 14).map((tag) => `<button class="tag-chip" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join("");
    els.dpInstallCode.textContent = `npm install ${icon.npmPackage || icon.librarySlug}`;
    els.dpImportCode.textContent = icon.jsxImport || `import { ${pascal(icon.name)} } from '${icon.npmPackage || icon.librarySlug}'`;
    els.dpDocsLink.href = icon.docsUrl || "#";
    renderDetailVariants(icon);
    renderMatches(icon);
    renderCodePreview();
  }

  function renderDetailVariants(icon) {
    const variants = (icon.variantIds || []).map((id) => state.icons.get(id)).filter(Boolean).slice(0, 8);
    els.dpVariants.innerHTML = variants.map((variant, index) => `<button class="variant-swatch" data-icon-id="${variant.id}" title="${escapeHtml(variant.name)}" style="animation-delay:${index * 40}ms">${iconTools().renderSVG(variant)}</button>`).join("");
  }

  function renderMatches(icon) {
    const base = window.IconVoidSearch.baseName(icon.name);
    const matches = Array.from(state.icons.values())
      .filter((candidate) => candidate.id !== icon.id && window.IconVoidSearch.baseName(candidate.name) === base)
      .slice(0, 8);
    els.dpMatches.innerHTML = matches.length ? matches.map((candidate, index) => `<button class="match-card" data-icon-id="${candidate.id}" title="${escapeHtml(candidate.library)}" style="animation-delay:${index * 40}ms">${iconTools().renderSVG(candidate)}</button>`).join("") : '<span class="muted">Load more libraries to reveal matches.</span>';
  }

  function renderCodePreview() {
    const icon = state.icons.get(state.currentIconId);
    if (!icon) return;
    els.dpCodePreview.textContent = iconTools().formatCode(icon, state.detail.format, {
      color: state.detail.color,
      strokeWidth: state.detail.strokeWidth,
      size: state.detail.size
    });
  }

  function refreshDetailPreview(icon = state.icons.get(state.currentIconId)) {
    if (!icon || !els.dpPreview) return;
    els.dpPreview.innerHTML = iconTools().renderSVG(icon, {
      color: state.detail.color,
      strokeWidth: state.detail.strokeWidth,
      size: state.detail.size
    });
    const svg = els.dpPreview.querySelector("svg");
    if (svg) {
      svg.style.width = `${state.detail.size}px`;
      svg.style.height = `${state.detail.size}px`;
      svg.style.color = state.detail.color;
      svg.setAttribute("stroke-width", String(state.detail.strokeWidth));
    }
  }

  function setDetailColor(color) {
    state.detail.color = color;
    if (els.dpColorInput.value !== color) els.dpColorInput.value = color;
    refreshDetailPreview();
    renderCodePreview();
  }

  function setDetailSize(size) {
    state.detail.size = Math.max(16, Math.min(512, Number(size) || 128));
    els.dpSizeSlider.value = state.detail.size;
    els.dpExactSize.value = state.detail.size;
    els.dpSizeVal.textContent = `${state.detail.size}px`;
    refreshDetailPreview();
    renderCodePreview();
  }

  function setDetailStroke(width) {
    const next = Math.max(0.5, Math.min(3, Number(width) || 2));
    state.detail.strokeWidth = Math.round(next * 10) / 10;
    els.dpStrokeSlider.value = state.detail.strokeWidth;
    els.dpStrokeVal.textContent = `${state.detail.strokeWidth}px`;
    refreshDetailPreview();
    renderCodePreview();
  }

  function setPreviewBackground(type) {
    state.detail.bg = type;
    ui().qsa(".bg-toggle").forEach((button) => button.classList.toggle("active", button.dataset.bg === type));
    if (type === "light") {
      els.dpPreview.style.background = "#ffffff";
      els.dpPreview.style.backgroundImage = "none";
    } else if (type === "checkered") {
      els.dpPreview.style.background = "#e5e5f7";
      els.dpPreview.style.backgroundImage = "linear-gradient(45deg,#bbb 25%,transparent 25%),linear-gradient(-45deg,#bbb 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#bbb 75%),linear-gradient(-45deg,transparent 75%,#bbb 75%)";
      els.dpPreview.style.backgroundSize = "20px 20px";
      els.dpPreview.style.backgroundPosition = "0 0,0 10px,10px -10px,-10px 0";
    } else {
      els.dpPreview.style.background = "var(--bg-void)";
      els.dpPreview.style.backgroundImage = "none";
    }
  }

  async function copyCurrentCode(button) {
    const text = els.dpCodePreview.textContent;
    await iconTools().copyText(text);
    ui().successButton(button || els.dpCopyCode, state.detail.format === "svg" ? "Copied!" : "Copied!");
    ui().toast("Copied to clipboard", "success");
  }

  async function copyIconSvg(icon, button) {
    await iconTools().copyText(iconTools().renderSVG(icon));
    ui().successButton(button, "Copied");
    ui().toast("SVG copied", "success");
  }

  async function downloadPng(icon, size = 512) {
    ui().toast(`Generating ${size}px PNG`, "info");
    await iconTools().exportPNG(icon, size, { color: state.detail.color, strokeWidth: state.detail.strokeWidth });
    ui().toast("PNG downloaded", "success");
  }

  async function downloadZip(icons, options = {}) {
    if (!icons.length) return;
    ui().toast(`Packaging ${Math.min(icons.length, 200)} icons`, "info");
    await iconTools().exportZIP(icons, { color: state.detail.color, strokeWidth: state.detail.strokeWidth, ...options });
    ui().toast("ZIP downloaded", "success");
  }

  function renderCollections() {
    const collections = window.IconVoidCollections.all();
    els.collectionBadge.textContent = String(window.IconVoidCollections.count());
    els.collectionBadge.classList.toggle("hidden", window.IconVoidCollections.count() === 0);
    els.collectionsList.innerHTML = collections.map((collection) => {
      const previews = collection.icons.slice(0, 5).map((id) => state.icons.get(id)).filter(Boolean);
      return `<article class="collection-row" data-collection-id="${collection.id}">
        <div>
          <h3 class="gradient-text">${escapeHtml(collection.name)}</h3>
          <p class="muted">${collection.icons.length} icons</p>
          <div class="collection-preview">${previews.map((icon) => `<span class="mini-icon">${iconTools().renderSVG(icon)}</span>`).join("")}</div>
        </div>
        <div class="collection-actions">
          <button class="glass-btn" data-collection-action="rename">Rename</button>
          <button class="glass-btn" data-collection-action="json">JSON list</button>
          <button class="glass-btn" data-collection-action="css">CSS sprite</button>
          <button class="glass-btn" data-collection-action="react">React file</button>
          <button class="glass-btn" data-collection-action="vue">Vue component</button>
          <button class="glass-btn" data-collection-action="sprite">Sprite SVG</button>
          <button class="gradient-btn" data-collection-action="zip">Download ZIP</button>
          ${collection.id !== "favorites" ? '<button class="glass-btn" data-collection-action="delete">Delete</button>' : ""}
        </div>
      </article>`;
    }).join("");
  }

  function renderCompare(icon) {
    const base = window.IconVoidSearch.baseName(icon.name);
    const matches = Array.from(state.icons.values()).filter((candidate) => window.IconVoidSearch.baseName(candidate.name) === base).slice(0, 80);
    els.compareTitle.textContent = `${icon.name} - across ${matches.length} libraries`;
    els.compareGrid.innerHTML = matches.map((candidate) => `<button class="compare-item" data-icon-id="${candidate.id}">
      ${iconTools().renderSVG(candidate, { color: state.detail.color, strokeWidth: state.detail.strokeWidth })}
      <span>${escapeHtml(candidate.library)}<br>${escapeHtml(candidate.style)}</span>
    </button>`).join("");
    els.compareDownload.onclick = () => downloadZip(matches);
    ui().openModal("compare-modal");
  }

  function updateBulkBar() {
    const count = state.selectedIcons.size;
    els.bulkBar.classList.toggle("hidden", count === 0);
    ui().animateNumber(els.bulkNum, count, 300);
  }

  function toggleSelect(id) {
    if (state.selectedIcons.has(id)) state.selectedIcons.delete(id);
    else state.selectedIcons.add(id);
    updateBulkBar();
    updateVirtualScroll(true);
  }

  function focusRelative(delta) {
    if (!state.filteredIcons.length) return;
    state.focusedIndex = Math.max(0, Math.min(state.filteredIcons.length - 1, state.focusedIndex + delta));
    const row = Math.floor(state.focusedIndex / state.cols);
    const targetTop = row * (state.rowHeight + 8);
    if (targetTop < els.gridContainer.scrollTop || targetTop > els.gridContainer.scrollTop + els.gridContainer.clientHeight - state.rowHeight) {
      els.gridContainer.scrollTo({ top: Math.max(0, targetTop - state.rowHeight), behavior: "smooth" });
    }
    updateVirtualScroll(true);
  }

  function focusedIcon() {
    return state.filteredIcons[state.focusedIndex] || state.filteredIcons[0];
  }

  function setupEvents() {
    els.search.addEventListener("focus", () => els.searchShell.classList.add("focused"));
    els.search.addEventListener("blur", () => setTimeout(() => els.searchShell.classList.remove("focused"), 100));
    els.search.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(async () => {
        state.searchQuery = els.search.value.trim();
        els.searchClear.classList.toggle("hidden", !state.searchQuery);
        if (state.searchQuery && (!location.hash || location.hash === "#/" || location.hash === "#")) history.replaceState(null, "", "#/search");
        renderAutocomplete();
        const shouldShowGrid = Boolean(state.searchQuery) || (location.hash !== "#/" && location.hash !== "#");
        setRouteView(shouldShowGrid ? "grid" : "home");
        if (shouldShowGrid) {
          await ensureInitialBrowseLibrary();
          applyFilters({ resetScroll: true });
          ensureDesktopDetail();
        } else {
          closeDetail(false);
          updateSeoHome();
        }
      }, 150);
    });
    els.searchClear.addEventListener("click", async () => {
      els.search.value = "";
      state.searchQuery = "";
      els.searchClear.classList.add("hidden");
      els.autocomplete.classList.add("hidden");
      if (location.hash === "#/search" || location.hash === "#/all" || location.hash === "#/icons") await ensureInitialBrowseLibrary();
      applyFilters({ resetScroll: true });
    });
    els.logo.addEventListener("click", (event) => {
      event.preventDefault();
      clearAllFilters();
      window.location.hash = "#/";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    els.libSearch.addEventListener("input", renderSidebarLibraries);
    els.libList.addEventListener("change", async (event) => {
      const input = event.target.closest(".lib-check");
      if (!input) return;
      const slug = input.value;
      if (input.checked) {
        state.selectedLibraries.add(slug);
        await loadLibrary(slug);
        window.location.hash = `#/library/${slug}`;
      } else {
        state.selectedLibraries.delete(slug);
        applyFilters({ resetScroll: true });
        renderSidebarLibraries();
      }
      document.body.classList.remove("sidebar-open");
    });
    els.libList.addEventListener("click", async (event) => {
      const allRow = event.target.closest("[data-all-icons='true']");
      if (allRow) {
        event.preventDefault();
        await showAllIcons();
        return;
      }
      const row = event.target.closest("[data-slug]");
      if (!row || event.target.matches("input")) return;
      event.preventDefault();
      const input = row.querySelector("input");
      input.checked = !input.checked;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
    els.stylePills.addEventListener("click", (event) => {
      const pill = event.target.closest(".style-pill");
      if (!pill) return;
      state.activeStyle = pill.dataset.style;
      ui().qsa(".style-pill", els.stylePills).forEach((node) => node.classList.toggle("active", node === pill));
      applyFilters({ resetScroll: true });
    });
    els.categoryToggle.addEventListener("click", () => {
      const section = $("category-section");
      section.classList.toggle("open");
      els.categoryToggle.setAttribute("aria-expanded", String(section.classList.contains("open")));
    });
    els.categoryList.addEventListener("click", (event) => {
      const item = event.target.closest("[data-category]");
      if (!item) return;
      state.activeCategory = item.dataset.category === state.activeCategory ? "" : item.dataset.category;
      if (state.activeCategory) window.location.hash = `#/category/${state.activeCategory.toLowerCase().replace(/\s+/g, "-")}`;
      else applyFilters({ resetScroll: true });
      renderCategories();
      document.body.classList.remove("sidebar-open");
    });
    els.previewSlider.addEventListener("input", () => {
      state.previewSize = Number(els.previewSlider.value);
      els.previewLabel.textContent = `Preview Size: ${state.previewSize}px`;
      ui().qsa(".icon-wrap").forEach((wrap) => {
        wrap.style.width = `${state.previewSize}px`;
        wrap.style.height = `${state.previewSize}px`;
      });
    });
    els.sortSelect.addEventListener("change", () => {
      state.sort = els.sortSelect.value;
      applyFilters({ resetScroll: true });
    });
    els.clearFilters.addEventListener("click", clearAllFilters);
    els.browseAll.addEventListener("click", () => { window.location.hash = "#/search"; });
    els.home.addEventListener("click", async (event) => {
      const category = event.target.closest("[data-home-category]");
      const library = event.target.closest("[data-home-library]");
      const icon = event.target.closest("[data-icon-id]");
      if (category) window.location.hash = `#/category/${category.dataset.homeCategory.toLowerCase().replace(/\s+/g, "-")}`;
      if (library) window.location.hash = `#/library/${library.dataset.homeLibrary}`;
      if (icon) window.location.hash = `#/icon/${icon.dataset.iconId}`;
    });
    els.gridContainer.addEventListener("scroll", () => {
      const nearBottom = els.gridContainer.scrollTop + els.gridContainer.clientHeight > els.gridContainer.scrollHeight - 900;
      if (nearBottom) {
        if (state.visibleLimit < state.filteredIcons.length) {
          state.visibleLimit = Math.min(state.filteredIcons.length, state.visibleLimit + state.batchSize);
          updateVirtualScroll(false);
        } else {
          loadNextLibraryForBrowse();
        }
      }
    }, { passive: true });
    window.addEventListener("resize", () => {
      calculateGrid();
      buildRows();
      updateVirtualScroll(true);
      ensureDesktopDetail();
    });
    els.iconGrid.addEventListener("click", handleGridClick);
    els.iconGrid.addEventListener("focusin", (event) => {
      const card = event.target.closest(".icon-card");
      if (!card) return;
      const index = state.filteredIcons.findIndex((icon) => icon.id === card.dataset.id);
      if (index >= 0) state.focusedIndex = index;
      updateFocusedCard();
    });
    els.selectMode.addEventListener("click", () => {
      state.selectMode = !state.selectMode;
      els.selectMode.classList.toggle("active", state.selectMode);
      if (!state.selectMode) state.selectedIcons.clear();
      updateBulkBar();
      updateVirtualScroll(true);
    });
    ui().qsa(".density-btn").forEach((button) => {
      button.addEventListener("click", () => {
        state.density = button.dataset.density;
        ui().qsa(".density-btn").forEach((node) => node.classList.toggle("active", node === button));
        calculateGrid();
        buildRows();
        updateVirtualScroll(true);
      });
    });
    els.dpClose.addEventListener("click", () => closeDetail());
    setupDetailEvents();
    setupCollectionEvents();
    setupKeyboard();
    els.themeToggle.addEventListener("click", toggleTheme);
    els.sidebarToggle.addEventListener("click", () => document.body.classList.toggle("sidebar-open"));
    els.sidebarCollapse.addEventListener("click", () => {
      const collapsed = document.body.classList.toggle("sidebar-collapsed");
      els.sidebarCollapse.setAttribute("aria-expanded", String(!collapsed));
      requestAnimationFrame(() => {
        calculateGrid();
        updateVirtualScroll(true);
      });
    });
    els.compareToggle.addEventListener("click", () => {
      state.compareMode = !state.compareMode;
      els.compareToggle.classList.toggle("active", state.compareMode);
      if (state.currentIconId) renderCompare(state.icons.get(state.currentIconId));
    });
    els.libraryRetry.addEventListener("click", () => {
      if (!state.lastFailedSlug) return;
      state.failedLibraries.delete(state.lastFailedSlug);
      hideLibraryError();
      loadLibrary(state.lastFailedSlug).then(() => applyFilters());
    });
    els.suggestionChips.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-suggest]");
      if (!chip) return;
      els.search.value = chip.dataset.suggest;
      state.searchQuery = chip.dataset.suggest;
      applyFilters({ resetScroll: true });
    });
    window.addEventListener("iconvoid:collections-changed", renderCollections);
    window.addEventListener("hashchange", handleRoute);
  }

  async function handleGridClick(event) {
    const card = event.target.closest(".icon-card");
    if (!card) return;
    const icon = state.icons.get(card.dataset.id);
    if (!icon) return;
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (state.selectMode) {
      toggleSelect(icon.id);
    } else {
      openGridDetail(icon.id);
    }
  }

  function addRipple(card, event) {
    return;
    const rect = card.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "card-ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 420);
  }

  function setupDetailEvents() {
    ui().qsa(".bg-toggle").forEach((button) => button.addEventListener("click", () => setPreviewBackground(button.dataset.bg)));
    $("color-preset-row").addEventListener("click", (event) => {
      const preset = event.target.closest("[data-color]");
      if (preset) {
        els.dpColorInput.value = preset.dataset.color;
        setDetailColor(preset.dataset.color);
      }
    });
    els.dpColorInput.addEventListener("input", () => setDetailColor(els.dpColorInput.value));
    els.dpSizeSlider.addEventListener("input", () => setDetailSize(els.dpSizeSlider.value));
    els.dpExactSize.addEventListener("input", () => setDetailSize(els.dpExactSize.value));
    els.dpStrokeSlider.addEventListener("input", () => setDetailStroke(els.dpStrokeSlider.value));
    ui().qsa(".tab-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const tab = button.dataset.tab;
        ui().qsa(".tab-btn").forEach((node) => node.classList.toggle("active", node === button));
        ui().qsa(".tab-content").forEach((node) => node.classList.toggle("active", node.id === `tab-${tab}`));
      });
    });
    ui().qsa(".format-btn").forEach((button) => {
      button.addEventListener("click", () => {
        state.detail.format = button.dataset.fmt;
        ui().qsa(".format-btn").forEach((node) => node.classList.toggle("active", node === button));
        els.dpCopyCode.textContent = state.detail.format === "svg" ? "Copy SVG" : "Copy";
        renderCodePreview();
      });
    });
    els.dpCopyCode.addEventListener("click", () => copyCurrentCode(els.dpCopyCode));
    document.addEventListener("click", async (event) => {
      const copyTarget = event.target.closest("[data-copy-target]");
      if (!copyTarget) return;
      const node = $(copyTarget.dataset.copyTarget);
      if (node) {
        await iconTools().copyText(node.textContent);
        ui().successButton(copyTarget, "Copied");
      }
    });
    ui().qsa(".size-btn").forEach((button) => button.addEventListener("click", () => {
      const icon = state.icons.get(state.currentIconId);
      if (icon) downloadPng(icon, Number(button.dataset.size));
    }));
    els.dpDownloadSvg.addEventListener("click", () => {
      const icon = state.icons.get(state.currentIconId);
      if (icon) {
        iconTools().exportSVG(icon, { color: state.detail.color, strokeWidth: state.detail.strokeWidth, size: state.detail.size });
        ui().toast("SVG downloaded", "success");
      }
    });
    els.dpDownloadZip.addEventListener("click", () => {
      const icon = state.icons.get(state.currentIconId);
      if (icon) downloadZip([icon], { pngSizes: [16, 32, 64, 128, 256, 512] });
    });
    els.dpVariants.addEventListener("click", (event) => {
      const button = event.target.closest("[data-icon-id]");
      if (button) window.location.hash = `#/icon/${button.dataset.iconId}`;
    });
    els.dpMatches.addEventListener("click", (event) => {
      const button = event.target.closest("[data-icon-id]");
      if (button) window.location.hash = `#/icon/${button.dataset.iconId}`;
    });
    els.dpTags.addEventListener("click", (event) => {
      const tag = event.target.closest("[data-tag]");
      if (!tag) return;
      els.search.value = tag.dataset.tag;
      state.searchQuery = tag.dataset.tag;
      window.location.hash = "#/search";
      applyFilters({ resetScroll: true });
    });
    els.dpIconId.addEventListener("click", async () => {
      await iconTools().copyText(els.dpIconId.textContent);
      ui().toast("Icon ID copied", "success");
    });
    els.dpShare.addEventListener("click", async () => {
      await iconTools().copyText(`${location.origin}${location.pathname}#/icon/${state.currentIconId}`);
      ui().successButton(els.dpShare, "Shared");
    });
    els.dpCompare.addEventListener("click", () => {
      const icon = state.icons.get(state.currentIconId);
      if (icon) renderCompare(icon);
    });
    els.compareGrid.addEventListener("click", (event) => {
      const item = event.target.closest("[data-icon-id]");
      if (!item) return;
      ui().closeModals();
      window.location.hash = `#/icon/${item.dataset.iconId}`;
    });
  }

  function setupCollectionEvents() {
    els.collectionsToggle.addEventListener("click", () => {
      renderCollections();
      ui().openModal("collections-modal");
    });
    els.collectionCreate.addEventListener("click", () => {
      window.IconVoidCollections.create(els.collectionNameInput.value);
      els.collectionNameInput.value = "";
      renderCollections();
    });
    els.collectionsList.addEventListener("click", async (event) => {
      const row = event.target.closest("[data-collection-id]");
      const action = event.target.closest("[data-collection-action]")?.dataset.collectionAction;
      if (!row || !action) return;
      const collection = window.IconVoidCollections.getCollection(row.dataset.collectionId);
      if (!collection) return;
      const icons = collection.icons.map((id) => state.icons.get(id)).filter(Boolean);
      if (action === "rename") {
        const name = prompt("Collection name", collection.name);
        if (name) window.IconVoidCollections.rename(collection.id, name);
      } else if (action === "delete") {
        window.IconVoidCollections.remove(collection.id);
      } else if (action === "json") {
        window.IconVoidCollections.exportJSON(collection);
      } else if (action === "css") {
        window.IconVoidCollections.exportCSSSprite(collection, state.icons);
      } else if (action === "react") {
        window.IconVoidCollections.exportReact(collection, state.icons);
      } else if (action === "vue") {
        window.IconVoidCollections.exportVue(collection, state.icons);
      } else if (action === "sprite") {
        window.IconVoidCollections.exportSpriteSVG(collection, state.icons);
      } else if (action === "zip") {
        await downloadZip(icons);
      }
      renderCollections();
    });
    els.bulkCollect.addEventListener("click", () => {
      window.IconVoidCollections.addIcons("favorites", Array.from(state.selectedIcons));
      ui().toast(`Added ${state.selectedIcons.size} icons to Favorites`, "success");
      state.selectedIcons.clear();
      updateBulkBar();
      updateVirtualScroll(true);
    });
    els.bulkClear.addEventListener("click", () => {
      state.selectedIcons.clear();
      state.selectMode = false;
      els.selectMode.classList.remove("active");
      updateBulkBar();
      updateVirtualScroll(true);
    });
    els.bulkDownload.addEventListener("click", async () => {
      const icons = Array.from(state.selectedIcons).map((id) => state.icons.get(id)).filter(Boolean);
      await downloadZip(icons);
    });
    els.bulkColor.addEventListener("input", () => {
      state.detail.color = els.bulkColor.value;
      updateVirtualScroll(true);
    });
  }

  function setupKeyboard() {
    document.addEventListener("keydown", async (event) => {
      const target = event.target;
      const editing = target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (event.key === "/" && !editing) {
        event.preventDefault();
        els.search.focus();
        els.searchShell.animate([{ boxShadow: "0 0 0 rgba(0,195,255,0)" }, { boxShadow: "var(--glow-blue)" }], { duration: 260, easing: "ease-out" });
      } else if (event.key === "Escape") {
        if (!document.querySelector("#modal-backdrop.hidden")) ui().closeModals();
        else if (!els.detailPanel.classList.contains("closed")) closeDetail();
        else if (state.searchQuery) {
          els.search.value = "";
          state.searchQuery = "";
          applyFilters({ resetScroll: true });
        }
      } else if (event.key === "?" && !editing) {
        ui().openModal("shortcuts-modal");
      } else if (event.key.startsWith("Arrow") && !editing) {
        if (event.key === "ArrowRight") focusRelative(1);
        if (event.key === "ArrowLeft") focusRelative(-1);
        if (event.key === "ArrowDown") focusRelative(state.cols);
        if (event.key === "ArrowUp") focusRelative(-state.cols);
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c" && !editing) {
        const icon = focusedIcon();
        if (icon) {
          event.preventDefault();
          await copyIconSvg(icon);
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d" && !editing) {
        const icon = focusedIcon();
        if (icon) {
          event.preventDefault();
          iconTools().exportSVG(icon);
        }
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a" && state.selectMode) {
        event.preventDefault();
        state.filteredIcons.forEach((icon) => state.selectedIcons.add(icon.id));
        updateBulkBar();
        updateVirtualScroll(true);
      } else if (event.key.toLowerCase() === "f" && !editing) {
        const icon = focusedIcon();
        if (icon) {
          window.IconVoidCollections.addIcon("favorites", icon.id);
          ui().toast("Saved to Favorites", "success");
        }
      }
    });
  }

  function renderAutocomplete() {
    if (!state.searchQuery || state.searchQuery.length < 2) {
      els.autocomplete.classList.add("hidden");
      return;
    }
    const matches = window.IconVoidSearch.suggestions(state.icons.values(), state.searchQuery, 5);
    if (!matches.length) {
      els.autocomplete.classList.add("hidden");
      return;
    }
    els.autocomplete.innerHTML = matches.map((icon) => `<div class="autocomplete-item" data-icon-id="${icon.id}" role="option">
      <span class="ac-icon">${iconTools().renderSVG(icon)}</span>
      <span class="ac-info"><span class="ac-name">${escapeHtml(icon.name)}</span><span class="ac-lib">${escapeHtml(icon.library)}</span></span>
      <span class="ac-tag">${escapeHtml((icon.tags || [])[0] || icon.style)}</span>
    </div>`).join("");
    els.autocomplete.classList.remove("hidden");
  }

  function clearAllFilters() {
    state.selectedLibraries.clear();
    state.activeStyle = "all";
    state.activeCategory = "";
    state.searchQuery = "";
    state.sort = "relevance";
    els.search.value = "";
    els.sortSelect.value = "relevance";
    els.searchClear.classList.add("hidden");
    ui().qsa(".style-pill", els.stylePills).forEach((pill) => pill.classList.toggle("active", pill.dataset.style === "all"));
    renderSidebarLibraries();
    renderCategories();
    if (location.hash.startsWith("#/library/") || location.hash.startsWith("#/category/") || location.hash.startsWith("#/icon/")) {
      history.replaceState(null, "", "#/search");
    }
    applyFilters({ resetScroll: true });
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("iconvault-theme", next);
  }

  function initTheme() {
    const stored = localStorage.getItem("iconvault-theme");
    const theme = stored || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.dataset.theme = theme;
  }

  function generateSitemap() {
    if (!els.sitemap) return;
    els.sitemap.href = "/sitemap.xml";
    els.sitemap.removeAttribute("download");
  }

  function escapeHtml(value) {
    return iconTools().escapeHtml(value);
  }

  function pascal(name) {
    return String(name || "Icon").split(/[-_\s]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("") || "Icon";
  }

  function deriveStyle(name, prefix) {
    const text = `${prefix || ""}-${name || ""}`.toLowerCase();
    if (/duotone|two-tone|twotone/.test(text)) return "duotone";
    if (/bold|filled|fill|solid|bxs-/.test(text)) return "bold";
    if (/thin/.test(text)) return "thin";
    if (/light/.test(text)) return "light";
    if (/sharp/.test(text)) return "solid";
    if (/regular|outline|linear|stroke|lucide|tabler|feather|iconoir|radix|hugeicons|line-md/.test(text)) return "outline";
    if (/bxl-|brand/.test(text)) return "fill";
    return "fill";
  }

  function categorize(name) {
    const text = String(name || "").toLowerCase();
    const rules = [
      ["Media", "Photography", /camera|image|photo|video|film|play|pause|music|mic|speaker|audio|volume|gallery|picture|podcast/],
      ["Communication", "Messaging", /mail|message|chat|comment|phone|call|send|inbox|reply|share|bell|notification/],
      ["Commerce", "Payments", /cart|shop|bag|store|cash|coin|credit|card|wallet|bank|receipt|ticket|tag|gift/],
      ["Navigation", "Maps", /map|pin|location|compass|route|arrow|chevron|direction|sign|road|globe/],
      ["Files", "Documents", /file|folder|document|book|note|clipboard|archive|copy|paper|pdf|code/],
      ["Editing", "Design", /edit|pen|pencil|brush|crop|palette|color|magic|wand|scissors|ruler|layout/],
      ["Devices", "Hardware", /phone|mobile|tablet|laptop|desktop|monitor|keyboard|mouse|printer|watch|cpu|server|database/],
      ["Development", "Code", /code|terminal|bug|git|branch|merge|api|webhook|cloud|database|server|package/],
      ["Security", "Privacy", /lock|unlock|shield|key|fingerprint|scan|secure|vpn|password|verified/],
      ["Health", "Medical", /heart|pulse|medical|hospital|doctor|pill|virus|health|first|aid|stethoscope/],
      ["Weather", "Nature", /sun|moon|cloud|rain|snow|wind|leaf|tree|flower|fire|water|earth/],
      ["Transport", "Travel", /car|bus|train|plane|ship|bike|truck|taxi|rocket|suitcase|luggage/],
      ["Social", "People", /user|person|people|team|group|face|smile|emoji|profile|account/],
      ["Time", "Productivity", /clock|time|calendar|timer|alarm|hour|watch|schedule|history/],
      ["Data", "Charts", /chart|graph|analytics|stats|database|table|trend|activity|bar|pie/]
    ];
    const match = rules.find(([, , rx]) => rx.test(text));
    return match ? [match[0], match[1]] : ["Interface", "Controls"];
  }

  function tagsFor(name, category, subCategory, lib) {
    const synonyms = {
      camera: ["cam", "photo", "snapshot", "capture", "lens"],
      search: ["find", "magnify", "lookup"],
      heart: ["love", "like", "favorite"],
      star: ["favorite", "rating", "bookmark"],
      user: ["person", "profile", "account"],
      home: ["house", "dashboard"],
      settings: ["gear", "preferences", "controls"],
      download: ["save", "export"],
      upload: ["import", "send"],
      trash: ["delete", "remove"]
    };
    const parts = String(name || "").split(/[-_\s]+/).filter(Boolean);
    const extra = parts.flatMap((part) => synonyms[part] || []);
    return Array.from(new Set([...parts, ...extra, category.toLowerCase(), subCategory.toLowerCase(), lib.slug]));
  }

  function dateFor(index) {
    const date = new Date(Date.UTC(2024, 0, 15));
    date.setUTCDate(date.getUTCDate() + (index % 420));
    return date.toISOString().slice(0, 10);
  }

  async function init() {
    cacheElements();
    initTheme();
    ui().init();
    setupEvents();
    calculateGrid();
    await loadIndex();
    normalizeStartupRoute();
    renderSidebarLibraries();
    renderCategories();
    renderHome();
    await prepareInitialIconsForRoute();
    generateSitemap();
    await handleRoute();
  }

  document.addEventListener("DOMContentLoaded", () => {
    init().catch((error) => {
      console.error(error);
      ui().toast(`IconVoid failed to start: ${error.message}`, "error", 6000);
    });
  });
})();
