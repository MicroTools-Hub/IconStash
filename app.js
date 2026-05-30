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
    librariesExpanded: false,
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
    prerender: {
      manifest: null,
      active: false,
      mode: "",
      libraryIndex: 0,
      chunkIndex: -1,
      slug: "",
      loading: false,
      initialDomUsed: false,
      chunkCache: new Map()
    },
    backgroundSyncStarted: false,
    customColor: "",
    customStrokeWidth: "1.5",
    rowHeight: 88,
    cardMin: 80,
    cols: 8,
    detail: {
      color: "#2563eb",
      strokeWidth: 2,
      size: 128,
      bg: "dark",
      format: "svg",
      pngSize: 256
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

  function ensureCustomizePreviewSection() {
    if ($("customize-section")) return;
    const sortSection = $("sort-select")?.closest(".filter-section");
    if (!sortSection) return;
    sortSection.insertAdjacentHTML("afterend", `
          <section class="filter-section expandable" id="customize-section">
            <button class="filter-header category-toggle" id="customize-toggle" aria-expanded="false">
              <h2>Customize Preview</h2>
              <svg class="chevron" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <div class="category-list customize-preview-controls" id="customize-content">
              <div class="customize-field">
                <div>Fill Color</div>
                <div class="customize-color-row">
                  <input type="text" id="cust-color-hex" class="mini-search" placeholder="#ffffff" value="#ffffff" />
                  <button type="button" id="cust-color-btn" class="color-wheel-btn" aria-label="Choose fill color"></button>
                  <input type="color" id="cust-color-wheel" class="hidden-color-input" value="#ffffff" tabindex="-1">
                </div>
              </div>
              <div class="customize-field">
                <div class="customize-stroke-row">
                  <span>Stroke Width</span>
                  <span id="cust-stroke-label">1.5px</span>
                </div>
                <input type="range" id="cust-stroke-slider" class="neon-slider" min="0.5" max="3" step="0.5" value="1.5">
              </div>
              <button id="cust-reset-btn" class="outlined-neon-btn custom-preview-reset">Reset</button>
            </div>
          </section>`);
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
      dpFavorite: $("dp-favorite"),
      dpDownloadSvg: $("dp-dl-svg"),
      dpDownloadPng: $("dp-dl-png"),
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
      sitemap: $("sitemap-download"),
      custColorHex: $("cust-color-hex"),
      custColorBtn: $("cust-color-btn"),
      custColorWheel: $("cust-color-wheel"),
      custStrokeLabel: $("cust-stroke-label"),
      custStrokeSlider: $("cust-stroke-slider"),
      custResetBtn: $("cust-reset-btn")
    });
  }

  function request(url, options = {}) {
    return fetch(url, options);
  }

  async function loadIndex() {
    try {
      if (window.__INDEX_DATA__) {
        const data = window.__INDEX_DATA__;
        const index = Array.isArray(data) ? { libraries: data } : data;
        state.libraries = (index.libraries || []).map((lib) => ({ ...lib, loaded: false }));
        if (els.indexedStat) els.indexedStat.dataset.target = String(index.actualIndexed || state.libraries.reduce((total, lib) => total + (lib.count || 0), 0));
        return;
      }
      const response = await request("data/index.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const index = Array.isArray(data) ? { libraries: data } : data;
      state.libraries = (index.libraries || []).map((lib) => ({ ...lib, loaded: false }));
      if (els.indexedStat) els.indexedStat.dataset.target = String(index.actualIndexed || state.libraries.reduce((total, lib) => total + (lib.count || 0), 0));
    } catch (error) {
      state.libraries = INDEX_FALLBACK.libraries.map((lib) => ({ ...lib, loaded: false }));
      if (els.indexedStat) els.indexedStat.dataset.target = String(INDEX_FALLBACK.actualIndexed);
      ui().toast("Using built-in library index fallback", "warning");
    }
  }

  function ui() {
    return window.IconStashUI;
  }

  function iconTools() {
    return window.IconStashIcons;
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
    
    // Check if we can perform in-place DOM updates to prevent scroll resetting & flickering!
    if (!filter) {
      const listContainer = els.libList.querySelector(".lib-collapse-list");
      const allIconsRow = els.libList.querySelector(".all-icons-row");
      if (listContainer && allIconsRow) {
        const isAllIconsActive = state.selectedLibraries.size === 0 && !state.activeCategory;
        allIconsRow.classList.toggle("active", isAllIconsActive);
        
        state.libraries.forEach(lib => {
          const row = listContainer.querySelector(`[data-slug="${lib.slug}"]`);
          if (row) {
            const active = state.selectedLibraries.has(lib.slug);
            const loading = state.loadingLibraries.has(lib.slug);
            const failed = state.failedLibraries.has(lib.slug);
            
            row.classList.toggle("active", active);
            row.classList.toggle("loading", loading);
            
            const check = row.querySelector(".lib-check");
            if (check) check.checked = active;
            
            const countEl = row.querySelector(".lib-count");
            if (countEl) {
              if (loading) {
                if (!countEl.querySelector(".lib-loading-spinner")) {
                  countEl.innerHTML = `<svg class="lib-loading-spinner" viewBox="0 0 24 24" width="12" height="12"><circle class="spinner-path" cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></circle></svg>`;
                }
              } else if (failed) {
                countEl.textContent = "retry";
              } else {
                countEl.textContent = Number(lib.count || 0).toLocaleString();
              }
            }
          }
        });
        
        const toggle = els.libList.querySelector(".lib-toggle");
        if (toggle) {
          toggle.setAttribute("aria-expanded", state.librariesExpanded);
          const chevron = toggle.querySelector(".chevron");
          if (chevron) {
            chevron.style.transform = state.librariesExpanded ? "rotate(90deg)" : "rotate(0deg)";
          }
        }
        listContainer.style.maxHeight = state.librariesExpanded ? "700px" : "0";
        
        updateFilterCounters();
        return;
      }
    }

    const allRow = !filter ? `<a class="lib-row all-icons-row ${state.selectedLibraries.size === 0 && !state.activeCategory ? "active" : ""}" href="#/search" data-all-icons="true">
      <span class="lib-badge">${libraryIconSvg("default")}</span>
      <span class="lib-name">All Icons</span>
      <span class="lib-count">${totalLibraryCount().toLocaleString()}</span>
    </a>` : "";
    const libRows = state.libraries
      .filter((lib) => !filter || `${lib.name} ${lib.slug}`.toLowerCase().includes(filter))
      .map((lib, index) => {
        const active = state.selectedLibraries.has(lib.slug);
        const loading = state.loadingLibraries.has(lib.slug);
        const failed = state.failedLibraries.has(lib.slug);
        
        let countDisplay = Number(lib.count || 0).toLocaleString();
        if (loading) {
          countDisplay = `<svg class="lib-loading-spinner" viewBox="0 0 24 24" width="12" height="12"><circle class="spinner-path" cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></circle></svg>`;
        } else if (failed) {
          countDisplay = "retry";
        }
        
        return `<label class="lib-row ${active ? "active" : ""} ${loading ? "loading" : ""}" data-slug="${lib.slug}" style="animation-delay:${Math.min(index * 30, 1000)}ms">
          <span class="lib-badge">${libraryIconSvg(lib.slug)}</span>
          <span class="lib-name">${escapeHtml(lib.name)}</span>
          <span class="lib-count">${countDisplay}</span>
          <input class="lib-check" type="checkbox" value="${lib.slug}" ${active ? "checked" : ""}>
        </label>`;
      }).join("");

    if (filter) {
      els.libList.innerHTML = libRows;
    } else {
      const isExpanded = state.librariesExpanded;
      const toggleHtml = `
        <button class="filter-header lib-toggle" id="lib-toggle" aria-expanded="${isExpanded}" style="margin-top: 10px; margin-bottom: 5px; cursor: pointer; background: transparent; border: none; padding: 0 7px; width: 100%; display: flex; align-items: center; justify-content: space-between;">
          <h2 style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: var(--text-secondary); margin: 0;">Libraries</h2>
          <svg class="chevron" viewBox="0 0 24 24" style="width: 16px; height: 16px; transition: transform 200ms ease; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transform: ${isExpanded ? "rotate(90deg)" : "rotate(0deg)"};"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      `;
      els.libList.innerHTML = `
        ${allRow}
        ${toggleHtml}
        <div class="lib-collapse-list" id="lib-collapse-list" style="overflow: hidden; max-height: ${isExpanded ? "700px" : "0"}; transition: max-height 250ms ease-in-out; display: flex; flex-direction: column; gap: 5px;">
          ${libRows}
        </div>
      `;
    }
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
    els.categoryList.innerHTML = CATEGORY_META.map(([name, , , color]) => {
      const active = state.activeCategory === name;
      return `<button class="category-item ${active ? "active" : ""}" data-category="${escapeHtml(name)}">
        <span class="category-dot" style="background:${color};color:${color}"></span>
        <span>${escapeHtml(name)}</span>
        <span class="category-count">${Number(counts.get(name) || 0).toLocaleString()}</span>
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
    // Skip re-rendering if content is already pre-rendered and we have no new data
    const isPrerendered = document.documentElement.hasAttribute("data-prerendered");
    const hasIcons = state.icons.size > 0;
    if (isPrerendered && !hasIcons) return;
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
    if (trending.length) {
      els.trendingIcons.innerHTML = trending.map((icon) => `
        <button class="trend-card" data-icon-id="${icon.id}">
          ${iconTools().renderSVG(icon)}
          <span>${escapeHtml(icon.name)}</span>
        </button>
      `).join("");
      renderMarquee(trending);
    }
  }

  function renderMarquee(source) {
    const icons = source.length ? source.slice(0, 20) : Array.from(state.icons.values()).slice(0, 20);
    const row = icons.concat(icons).map((icon) => `<span class="mq-icon">${iconTools().renderSVG(icon)}</span>`).join("");
    const m1 = $("marquee-1");
    const m2 = $("marquee-2");
    if (m1) m1.innerHTML = row;
    if (m2) m2.innerHTML = icons.slice().reverse().concat(icons).map((icon) => `<span class="mq-icon">${iconTools().renderSVG(icon)}</span>`).join("");
  }

  async function loadPrerenderManifest() {
    try {
      if (window.__PRERENDER_MANIFEST__) {
        state.prerender.manifest = window.__PRERENDER_MANIFEST__;
        prefetchAllChunkZeros();
        return;
      }
      const response = await request("data/prerender/manifest.json");
      if (!response.ok) return;
      state.prerender.manifest = await response.json();
      prefetchAllChunkZeros();
    } catch (_error) {
      state.prerender.manifest = null;
    }
  }

  function prefetchAllChunkZeros() {
    const manifest = state.prerender.manifest;
    if (!manifest?.libraries?.length) return;
    manifest.libraries.forEach((lib) => {
      const key = `${lib.slug}_0`;
      if (!state.prerender.chunkCache.has(key)) {
        const fetchPromise = (async () => {
          try {
            const response = await request("data/prerender/libraries/" + encodeURIComponent(lib.slug) + "/chunk-0.html");
            if (response.ok) {
              const text = await response.text();
              state.prerender.chunkCache.set(key, text);
              return text;
            }
          } catch (_) {}
          return "";
        })();
        state.prerender.chunkCache.set(key, fetchPromise);
      }
    });
  }

  function prerenderLibraryBySlug(slug) {
    return state.prerender.manifest?.libraries?.find((lib) => lib.slug === slug) || null;
  }

  function shouldUsePrerenderBrowse() {
    return Boolean(state.prerender.manifest) &&
      !state.searchQuery &&
      !state.activeCategory &&
      (!state.activeStyle || state.activeStyle === "all") &&
      (!state.sort || state.sort === "relevance");
  }

  function resetPrerenderGrid() {
    state.prerender.initialDomUsed = true;
    if (!state.prerender.active) return;
    state.prerender.active = false;
    state.prerender.mode = "";
    state.prerender.slug = "";
    state.prerender.chunkIndex = -1;
    state.prerender.loading = false;
  }

  function setGridCountLabel(label, count) {
    const val = Number(count || 0);
    ui().animateNumber(els.resultCount, val);
    if (els.resultCount) {
      els.resultCount.classList.toggle("hidden", val === 0 || state.route === "#/" || state.route === "#");
    }
    if (state.searchQuery) {
      els.gridStatus.textContent = `Search results: ${val.toLocaleString()} icons`;
    } else {
      els.gridStatus.textContent = `All icons: ${val.toLocaleString()}`;
    }
    updateFilterCounters();
  }

  function inlinePrerenderChunk(slug, chunkIndex) {
    const firstSlug = state.prerender.manifest?.libraries?.[0]?.slug;
    if (chunkIndex !== 0 || slug !== firstSlug) return "";
    const template = $("prerender-all-initial");
    return template ? template.innerHTML.trim() : "";
  }

  async function fetchPrerenderChunk(slug, chunkIndex) {
    const inline = inlinePrerenderChunk(slug, chunkIndex);
    if (inline) return inline;
    const lib = prerenderLibraryBySlug(slug);
    if (!lib || chunkIndex < 0 || chunkIndex >= lib.chunks) return "";
    const response = await request("data/prerender/libraries/" + encodeURIComponent(slug) + "/chunk-" + chunkIndex + ".html");
    if (!response.ok) return "";
    return response.text();
  }

  async function showPrerenderedGrid(options = {}) {
    const manifest = state.prerender.manifest;
    if (!manifest?.libraries?.length) return false;
    const mode = options.mode || "all";
    const lib = mode === "library" ? prerenderLibraryBySlug(options.slug) : manifest.libraries[0];
    if (!lib) return false;

    // Check if we can reuse the initial DOM prerender
    const isInitialDomPrerender = mode === "all" && !state.prerender.initialDomUsed && els.iconGrid.querySelector(".icon-card");
    let html = "";
    if (isInitialDomPrerender) {
      html = els.iconGrid.innerHTML;
    } else {
      html = await fetchPrerenderChunk(lib.slug, 0);
      if (!html) return false;
    }

    state.prerender.initialDomUsed = true;
    state.prerender.active = true;
    state.prerender.mode = mode;
    state.prerender.slug = lib.slug;
    state.prerender.libraryIndex = Math.max(0, manifest.libraries.findIndex((item) => item.slug === lib.slug));
    state.prerender.chunkIndex = 0;
    state.prerender.loading = false;
    state.filteredIcons = [];
    state.renderedCount = 0;
    state.inlineAdRendered = false;
    if (options.resetScroll) els.gridContainer.scrollTop = 0;

    if (!isInitialDomPrerender) {
      els.iconGrid.innerHTML = html;
    }

    els.loadingMore.classList.add("hidden");
    els.noResults.classList.add("hidden");
    const label = mode === "library" ? lib.name : "All icons";
    const count = mode === "library" ? lib.count : (manifest.totalCount || totalLibraryCount());
    setGridCountLabel(label, count);
    updateSeoForRoute();

    // Sync the favorites hearts to show active heart states instantly
    syncPrerenderFavoriteButtons();

    prefetchNextChunks(lib.slug, 0);

    checkViewportFill();

    return true;
  }

  async function appendNextPrerenderChunk() {
    const manifest = state.prerender.manifest;
    if (!state.prerender.active || state.prerender.loading || !manifest?.libraries?.length) return false;
    let libIndex = state.prerender.libraryIndex;
    let lib = manifest.libraries[libIndex];
    if (!lib) return false;
    let nextChunk = state.prerender.chunkIndex + 1;
    if (nextChunk >= lib.chunks) {
      if (state.prerender.mode === "library") return false;
      libIndex += 1;
      lib = manifest.libraries[libIndex];
      if (!lib) return false;
      nextChunk = 0;
    }
    state.prerender.loading = true;
    els.loadingMore.classList.remove("hidden");
    let success = false;
    try {
      const html = await fetchPrerenderChunk(lib.slug, nextChunk);
      if (html) {
        els.iconGrid.insertAdjacentHTML("beforeend", html);
        state.prerender.libraryIndex = libIndex;
        state.prerender.slug = lib.slug;
        state.prerender.chunkIndex = nextChunk;
        ui().qsa(".icon-wrap", els.iconGrid).forEach((wrap) => {
          wrap.style.width = state.previewSize + "px";
          wrap.style.height = state.previewSize + "px";
        });
        
        // Sync favorite states on the newly appended chunk nodes
        syncPrerenderFavoriteButtons();
        prefetchNextChunks(lib.slug, nextChunk);
        success = true;
      }
    } finally {
      state.prerender.loading = false;
      els.loadingMore.classList.add("hidden");
      if (success) {
        checkViewportFill();
      }
    }
    return success;
  }

  function syncPrerenderFavoriteButtons() {
    const allCollections = window.IconStashCollections.all();
    const collectedIds = new Set(allCollections.flatMap(col => col.icons));
    const btns = els.iconGrid.querySelectorAll(".card-favorite-btn");
    btns.forEach(btn => {
      const id = btn.dataset.favoriteId;
      const isCollected = collectedIds.has(id);
      btn.classList.toggle("collected", isCollected);
      const svg = btn.querySelector("svg");
      if (svg) {
        svg.setAttribute("fill", isCollected ? "currentColor" : "none");
      }
    });
  }

  async function fetchPrerenderChunk(slug, chunkIndex) {
    const inline = inlinePrerenderChunk(slug, chunkIndex);
    if (inline) return inline;
    const lib = prerenderLibraryBySlug(slug);
    if (!lib || chunkIndex < 0 || chunkIndex >= lib.chunks) return "";

    const key = `${slug}_${chunkIndex}`;
    if (state.prerender.chunkCache.has(key)) {
      return state.prerender.chunkCache.get(key);
    }

    const response = await request("data/prerender/libraries/" + encodeURIComponent(slug) + "/chunk-" + chunkIndex + ".html");
    if (!response.ok) return "";
    const text = await response.text();
    state.prerender.chunkCache.set(key, text);
    return text;
  }

  function prefetchNextChunks(slug, chunkIndex) {
    const manifest = state.prerender.manifest;
    if (!manifest?.libraries?.length) return;
    
    let libIndex = manifest.libraries.findIndex((l) => l.slug === slug);
    if (libIndex === -1) return;
    
    let currentLib = manifest.libraries[libIndex];
    let prefetchedCount = 0;
    let tempLibIndex = libIndex;
    let tempChunkIndex = chunkIndex;
    let tempLib = currentLib;
    
    while (prefetchedCount < 3) {
      tempChunkIndex += 1;
      if (tempChunkIndex >= tempLib.chunks) {
        if (state.prerender.mode === "library") break;
        tempLibIndex += 1;
        tempLib = manifest.libraries[tempLibIndex];
        if (!tempLib) break;
        tempChunkIndex = 0;
      }
      
      const key = `${tempLib.slug}_${tempChunkIndex}`;
      if (!state.prerender.chunkCache.has(key)) {
        const fetchPromise = (async () => {
          try {
            const response = await request("data/prerender/libraries/" + encodeURIComponent(tempLib.slug) + "/chunk-" + tempChunkIndex + ".html");
            if (response.ok) {
              const text = await response.text();
              state.prerender.chunkCache.set(key, text);
              return text;
            }
          } catch (_) {}
          return "";
        })();
        state.prerender.chunkCache.set(key, fetchPromise);
      }
      prefetchedCount++;
    }
  }

  function getPrerenderChunkSync(slug, chunkIndex) {
    const inline = inlinePrerenderChunk(slug, chunkIndex);
    if (inline) return inline;
    const key = `${slug}_${chunkIndex}`;
    const cached = state.prerender.chunkCache.get(key);
    if (typeof cached === "string") return cached;
    return "";
  }

  function checkViewportFill() {
    if (els.gridView.classList.contains("hidden")) return;
    const container = els.gridContainer;
    if (!container) return;
    
    let nearBottom = container.scrollTop + container.clientHeight > container.scrollHeight - 1800;
    if (!nearBottom) return;

    if (state.prerender.active) {
      if (state.prerender.loading) return;
      const manifest = state.prerender.manifest;
      if (!manifest?.libraries?.length) return;
      
      while (nearBottom && !state.prerender.loading) {
        let libIndex = state.prerender.libraryIndex;
        let lib = manifest.libraries[libIndex];
        if (!lib) break;
        
        let nextChunk = state.prerender.chunkIndex + 1;
        if (nextChunk >= lib.chunks) {
          if (state.prerender.mode === "library") break;
          libIndex += 1;
          lib = manifest.libraries[libIndex];
          if (!lib) break;
          nextChunk = 0;
        }
        
        const cachedHtml = getPrerenderChunkSync(lib.slug, nextChunk);
        if (cachedHtml) {
          els.iconGrid.insertAdjacentHTML("beforeend", cachedHtml);
          state.prerender.libraryIndex = libIndex;
          state.prerender.slug = lib.slug;
          state.prerender.chunkIndex = nextChunk;
          
          ui().qsa(".icon-wrap", els.iconGrid).forEach((wrap) => {
            wrap.style.width = state.previewSize + "px";
            wrap.style.height = state.previewSize + "px";
          });
          
          syncPrerenderFavoriteButtons();
          prefetchNextChunks(lib.slug, nextChunk);
          
          nearBottom = container.scrollTop + container.clientHeight > container.scrollHeight - 1800;
        } else {
          appendNextPrerenderChunk();
          break;
        }
      }
    } else {
      while (nearBottom) {
        if (state.visibleLimit < state.filteredIcons.length) {
          state.visibleLimit = Math.min(state.filteredIcons.length, state.visibleLimit + state.batchSize);
          
          const start = state.renderedCount;
          const end = Math.min(state.visibleLimit, state.filteredIcons.length);
          const parts = [];
          const allCollections = window.IconStashCollections.all();
          const collectedIds = new Set(allCollections.flatMap(col => col.icons));
          for (let index = start; index < end; index += 1) {
            if (isAllIconsGroupedMode() && shouldRenderLibraryHeader(index)) {
              parts.push(renderLibraryHeader(state.filteredIcons[index]));
            }
            parts.push(renderCard(state.filteredIcons[index], index, collectedIds));
          }
          if (parts.length) els.iconGrid.insertAdjacentHTML("beforeend", parts.join(""));
          state.renderedCount = end;
          
          nearBottom = container.scrollTop + container.clientHeight > container.scrollHeight - 1800;
        } else if (canLazyLoadBrowseLibrary() && !lazyLibraryLoad) {
          loadNextLibraryForBrowse();
          break;
        } else {
          break;
        }
      }
      els.loadingMore.classList.add("hidden");
    }
  }

  function iconSlugFromId(id) {
    const value = String(id || "");
    return state.libraries
      .map((lib) => lib.slug)
      .sort((a, b) => b.length - a.length)
      .find((slug) => value === slug || value.startsWith(slug + "-")) || "";
  }
  function iconFromPrerenderCard(card) {
    if (!card) return null;
    const id = card.dataset.id || "";
    const slug = card.dataset.library || iconSlugFromId(id);
    const lib = libraryBySlug(slug) || prerenderLibraryBySlug(slug) || { slug, name: slug, version: "" };
    const svg = card.querySelector("svg");
    if (!id || !slug || !svg) return null;
    const label = (svg.getAttribute("aria-label") || "").replace(/\s+icon$/i, "").trim();
    const rawName = id.startsWith(slug + "-") ? id.slice(slug.length + 1) : id;
    const name = label || rawName.replace(/[-_]+/g, " ");
    const viewBox = svg.getAttribute("viewBox") || "0 0 24 24";
    const [, , width = 24, height = 24] = viewBox.split(/\s+/).map(Number);
    const style = svg.getAttribute("fill") && svg.getAttribute("fill") !== "none" ? "fill" : deriveStyle(name, slug);
    const [category, subCategory] = categorize(name);
    return completeIcon({
      id,
      name,
      library: lib.name || slug,
      librarySlug: slug,
      libraryVersion: lib.version || "",
      style,
      tags: tagsFor(name, category, subCategory, lib),
      category,
      subCategory,
      svgPath: svg.innerHTML,
      viewBox,
      width: Number(width) || 24,
      height: Number(height) || 24,
      strokeWidth: Number(svg.getAttribute("stroke-width")) || 2,
      popularity: 5000
    }, lib, 0);
  }

  function hydratePrerenderIcon(card) {
    const icon = iconFromPrerenderCard(card);
    if (!icon) return null;
    if (!state.icons.has(icon.id)) state.icons.set(icon.id, icon);
    return state.icons.get(icon.id) || icon;
  }

  function warmLibraryAfterPrerenderClick(slug, id) {
    if (!slug || state.loadedLibraries.has(slug) || state.loadingLibraries.has(slug)) return;
    loadLibrary(slug).then(() => {
      const hydrated = state.icons.get(id);
      if (hydrated && state.currentIconId === id && !els.detailPanel.classList.contains("closed")) {
        renderDetail(hydrated);
      }
    });
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

  async function loadLibrary(slug, options = {}) {
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

        // Refresh currently active comparison and matches
        if (state.currentIconId) {
          const icon = state.icons.get(state.currentIconId);
          if (icon) {
            if (els.detailPanel && !els.detailPanel.classList.contains("hidden")) {
              renderMatches(icon);
            }
            const compModal = document.getElementById("compare-modal");
            if (compModal && !compModal.classList.contains("hidden")) {
              renderCompare(icon);
            }
          }
        }

        // Apply filters in background to include newly loaded icons in the search grid
        scheduleBackgroundFilter(slug);

        return icons;
      } catch (error) {
        state.failedLibraries.set(slug, error);
        state.lastFailedSlug = slug;
        if (!options.isBackground) {
          showLibraryError(slug, error);
          ui().toast(`Failed to load ${lib.name}`, "error");
        } else {
          console.error(`Background load failed for ${lib.name}:`, error);
        }
        return [];
      } finally {
        state.loadingLibraries.delete(slug);
        setLibraryLoading(slug, false);
      }
    })();
    state.loadingLibraries.set(slug, task);
    return task;
  }

  function triggerBackgroundSync() {
    if (state.backgroundSyncStarted) return;
    state.backgroundSyncStarted = true;
    
    // Set initial loadStatus when sync starts
    const loadedCount = state.loadedLibraries.size;
    const totalCount = state.libraries.length;
    els.loadStatus.textContent = `Syncing libraries: ${loadedCount}/${totalCount} loaded...`;
    
    loadAllLibrariesInBackground();
  }

  function sanitizeQuery(query) {
    if (!query) return "";
    // Strip all HTML tags completely
    let sanitized = query.replace(/<[^>]*>/g, "");
    // Strip JavaScript (e.g. javascript:, script tags)
    sanitized = sanitized.replace(/javascript:/gi, "");
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    // Remove all special characters except letters, numbers, spaces, hyphens, and underscores
    sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-_]/g, "");
    // Limit query length to maximum 100 characters
    return sanitized.slice(0, 100);
  }

  function getQueryParam(queryString, param) {
    const params = new URLSearchParams(queryString);
    return params.get(param) || "";
  }

  async function loadAllLibrariesInBackground() {
    // Wait a brief moment to let the main UI settle down
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Prioritize loading based on tiers (Tiers 1 & 2 first, followed by 3 & 4)
    const priorityList = state.libraries
      .filter((lib) => !state.loadedLibraries.has(lib.slug) && !state.loadingLibraries.has(lib.slug))
      .sort((a, b) => (a.tier || 4) - (b.tier || 4));

    for (const lib of priorityList) {
      try {
        // Yield to the main thread briefly between downloads to prevent UI stutters
        await new Promise((resolve) => setTimeout(resolve, 150));
        await loadLibrary(lib.slug, { isBackground: true });
      } catch (e) {
        console.error(`Background load error for ${lib.slug}:`, e);
      }
    }
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
      const base = window.IconStashSearch.baseName(icon.name);
      const list = groups.get(base) || [];
      list.push(icon.id);
      groups.set(base, list);
    }
    for (const icon of icons) {
      const list = groups.get(window.IconStashSearch.baseName(icon.name)) || [];
      icon.hasVariants = list.length > 1;
      icon.variantIds = list.slice(0, 14);
    }
    return icons;
  }

  function setLibraryLoading(slug, loading) {
    const row = els.libList.querySelector(`[data-slug="${CSS.escape(slug)}"]`);
    if (row) {
      row.classList.toggle("loading", loading);
      const countEl = row.querySelector(".lib-count");
      if (countEl) {
        if (loading) {
          countEl.innerHTML = `<svg class="lib-loading-spinner" viewBox="0 0 24 24" width="12" height="12"><circle class="spinner-path" cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></circle></svg>`;
        } else {
          const lib = libraryBySlug(slug);
          const failed = state.failedLibraries.has(slug);
          if (failed) {
            countEl.textContent = "retry";
          } else {
            countEl.textContent = Number(lib?.count || 0).toLocaleString();
          }
        }
      }
    }
    
    // Elegant background sync text
    const loadedCount = state.loadedLibraries.size;
    const totalCount = state.libraries.length;
    if (loadedCount < totalCount) {
      if (state.backgroundSyncStarted) {
        els.loadStatus.textContent = `Syncing libraries: ${loadedCount}/${totalCount} loaded...`;
      } else {
        els.loadStatus.textContent = "";
      }
    } else {
      els.loadStatus.textContent = `All ${totalLibraryCount().toLocaleString()} icons are available`;
      setTimeout(() => {
        if (els.loadStatus.textContent.includes("available")) els.loadStatus.textContent = "";
      }, 2500);
    }
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
      const build = () => window.IconStashSearch.buildSearchIndex(Array.from(state.icons.values()));
      if ("requestIdleCallback" in window) requestIdleCallback(build, { timeout: 1600 });
      else setTimeout(build, 0);
    }, 240);
  }

  function scheduleBackgroundFilter(slug) {
    clearTimeout(backgroundFilterTimer);
    backgroundFilterTimer = setTimeout(() => {
      backgroundFilterTimer = 0;
      if (state.prerender.active) {
        updateCounts();
        return;
      }
      
      const hasSearch = Boolean(state.searchQuery);
      const hasCategory = Boolean(state.activeCategory);
      const isViewingLoadedLib = slug && state.selectedLibraries.has(slug);
      
      if (!els.gridView.classList.contains("hidden") && (hasSearch || hasCategory || isViewingLoadedLib)) {
        applyFilters({ preserveLimit: true });
      } else {
        updateCounts();
      }
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
    resetPrerenderGrid();
    const filters = {
      librarySlugs: state.selectedLibraries,
      style: state.activeStyle,
      category: state.activeCategory,
      query: state.searchQuery,
      sort: state.sort
    };
    state.filteredIcons = window.IconStashSearch.filterAndSort(Array.from(state.icons.values()), filters);
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
    if (els.resultCount) {
      els.resultCount.classList.toggle("hidden", count === 0 || state.route === "#/" || state.route === "#");
    }
    if (state.searchQuery) {
      els.gridStatus.textContent = `Search results: ${count.toLocaleString()} icons`;
    } else {
      els.gridStatus.textContent = `All icons: ${count.toLocaleString()}`;
    }
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
    els.iconGrid.classList.remove("density-compact", "density-default", "density-comfortable");
    els.iconGrid.classList.add(`density-${state.density}`, "incremental-grid");
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
      const allCollections = window.IconStashCollections.all();
      const collectedIds = new Set(allCollections.flatMap(col => col.icons));
      for (let index = start; index < end; index += 1) {
        if (isAllIconsGroupedMode() && shouldRenderLibraryHeader(index)) {
          parts.push(renderLibraryHeader(state.filteredIcons[index]));
        }
        parts.push(renderCard(state.filteredIcons[index], index, collectedIds));
      }
      if (parts.length) els.iconGrid.insertAdjacentHTML("beforeend", parts.join(""));
      state.renderedCount = end;
      els.loadingMore.classList.add("hidden");
      checkViewportFill();
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

  function renderCard(icon, visualIndex, collectedIds) {
    const selected = state.selectedIcons.has(icon.id);
    const focused = state.filteredIcons[state.focusedIndex]?.id === icon.id;
    const delay = Math.min(400, visualIndex * 15);
    
    const set = collectedIds || new Set(window.IconStashCollections.all().flatMap(col => col.icons));
    const isCollected = set.has(icon.id);
    const fillAttr = isCollected ? 'fill="currentColor"' : 'fill="none"';
    const collectedClass = isCollected ? "collected" : "";

    return `<article class="icon-card ${selected ? "selected" : ""} ${focused ? "focused" : ""}" data-id="${icon.id}" tabindex="0" style="animation-delay:${delay}ms">
      <button class="card-favorite-btn ${collectedClass}" data-favorite-id="${icon.id}" aria-label="Add to collection" title="Add to collection">
        <svg viewBox="0 0 24 24" ${fillAttr} stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>
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
    if (els.resultCount) {
      const count = displayedCount();
      els.resultCount.classList.toggle("hidden", showHome || count === 0);
    }
  }

  async function handleRoute() {
    state.route = window.location.hash || "#/";
    const hash = state.route;
    
    const hashParts = hash.split("?");
    const basePath = hashParts[0];
    const queryString = hashParts[1] || "";

    // Parse and sanitize query parameters strictly (CRITICAL SECURITY REQUIREMENT)
    const urlQuery = getQueryParam(queryString, "query");
    const sanitized = sanitizeQuery(urlQuery);
    if (sanitized) {
      if (sanitized !== state.searchQuery) {
        state.searchQuery = sanitized;
        els.search.value = sanitized;
        els.searchClear.classList.remove("hidden");
        triggerBackgroundSync();
      }
    } else if (basePath === "#/search" && state.searchQuery) {
      // Clear search query if URL hash says #/search but has no query parameter
      state.searchQuery = "";
      els.search.value = "";
      els.searchClear.classList.add("hidden");
    }

    // Auto-start sync if deep-linking into category, icon, or search with active query on page load
    if (hash.startsWith("#/category/") || hash.startsWith("#/icon/") || state.searchQuery) {
      triggerBackgroundSync();
    }
    
    els.autocomplete.classList.add("hidden");
    hideLibraryError();
    if (basePath === "#/" || basePath === "#") {
      setRouteView("home");
      closeDetail(false);
      updateSeoHome();
      return;
    }
    setRouteView("grid");
    if (basePath === "#/search" || basePath === "#/all" || basePath === "#/icons") {
      state.selectedLibraries.clear();
      state.activeCategory = "";
      renderSidebarLibraries();
      if (shouldUsePrerenderBrowse() && await showPrerenderedGrid({ mode: "all", resetScroll: true })) {
        closeDetail(false);
        renderCategories();
        return;
      }
      await ensureInitialBrowseLibrary();
      applyFilters({ resetScroll: true });
      ensureDesktopDetail();
    } else if (basePath.startsWith("#/library/")) {
      const slug = decodeURIComponent(basePath.split("/")[2] || "");
      state.selectedLibraries = new Set([slug]);
      state.activeCategory = "";
      renderSidebarLibraries();
      if (shouldUsePrerenderBrowse() && await showPrerenderedGrid({ mode: "library", slug, resetScroll: true })) {
        closeDetail(false);
        renderCategories();
        return;
      }
      await loadLibrary(slug);
      applyFilters({ resetScroll: true });
      ensureDesktopDetail();
    } else if (basePath.startsWith("#/category/")) {
      state.selectedLibraries.clear();
      state.activeCategory = decodeURIComponent(basePath.split("/")[2] || "").replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
      renderSidebarLibraries();
      await ensureInitialBrowseLibrary();
      applyFilters({ resetScroll: true });
      ensureDesktopDetail();
    } else if (basePath.startsWith("#/icon/")) {
      const id = decodeURIComponent(basePath.split("/")[2] || "");
      const slug = id.split("-")[0];
      if (!state.icons.has(id) && libraryBySlug(slug)) await loadLibrary(slug);
      state.currentIconId = id;
      const cardExists = els.iconGrid.querySelector(`[data-id="${CSS.escape(id)}"]`);
      if (!cardExists) {
        applyFilters({ preserveLimit: true });
      }
      openDetail(id);
    } else if (basePath.startsWith("#/collections")) {
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
    const hash = currentRouteHash();
    if (shouldUsePrerenderBrowse() && (hash === "#/search" || hash === "#/all" || hash === "#/icons" || hash.startsWith("#/library/"))) return;
    const slug = slugForInitialRoute();
    if (!slug || state.loadedLibraries.has(slug)) return;
    ui().createSkeletonRows(els.iconGrid, 3, Math.max(4, state.cols || 8));
    await loadLibrary(slug);
  }

  function updateSeoHome() {
    document.title = "IconStash - 134,000+ Icons | SVG & PNG Command Center";
    setMeta("description", "Search, compare, customize, copy, and download 134,000+ premium SVG & PNG icons with custom resolution PNG downloads and zip packs.");
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
        document.title = `${lib.name} Icons - SVG & PNG Download | IconStash`;
        setMeta("description", `Browse, customize, copy, and download ${lib.name} SVG & PNG icons in IconStash.`);
        setCanonical(hash);
      }
    } else if (hash.startsWith("#/category/")) {
      els.seoHeader.classList.remove("hidden");
      els.seoTitle.textContent = `${state.activeCategory || "Category"} Icons`;
      els.seoDescription.textContent = `Filtered icon results for ${state.activeCategory || "this category"}.`;
      document.title = `${state.activeCategory || "Category"} Icons - SVG & PNG Download | IconStash`;
      setMeta("description", `Browse, export, and download ${state.activeCategory || "category"} SVG & PNG icons in IconStash.`);
      setCanonical(hash);
    } else {
      els.seoHeader.classList.add("hidden");
    }
  }

  function updateSeoIcon(icon) {
    document.title = `${icon.name} Icon - SVG & PNG Download | IconStash`;
    setMeta("description", `Download the ${icon.name} icon from ${icon.library}. Copy SVG, JSX, HTML, CSS, custom PNG, or multi-resolution ZIP packs from IconStash.`);
    setMeta("og:title", `${icon.name} Icon - ${icon.library}`);
    setMeta("og:description", `SVG & PNG download for ${icon.name} from ${icon.library}. Customize size, color, and download premium PNG or ZIP files.`);
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
    if (state.prerender.active) return;
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
    if (shouldUsePrerenderBrowse() && await showPrerenderedGrid({ mode: "all", resetScroll: true })) {
      closeDetail(false);
      return;
    }
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
    ui().qsa(".size-btn").forEach((btn) => {
      btn.classList.toggle("active", Number(btn.dataset.size) === (state.detail.pngSize || 256));
    });
    renderDetailVariants(icon);
    renderMatches(icon);
    renderCodePreview();
  }

  function renderDetailVariants(icon) {
    const variants = (icon.variantIds || []).map((id) => state.icons.get(id)).filter(Boolean).slice(0, 8);
    els.dpVariants.innerHTML = variants.map((variant, index) => `<button class="variant-swatch" data-icon-id="${variant.id}" title="${escapeHtml(variant.name)}" style="animation-delay:${index * 40}ms">${iconTools().renderSVG(variant)}</button>`).join("");
  }

  function renderMatches(icon) {
    const base = window.IconStashSearch.baseName(icon.name);
    const matches = Array.from(state.icons.values())
      .filter((candidate) => candidate.id !== icon.id && window.IconStashSearch.baseName(candidate.name) === base)
      .slice(0, 8);
    els.dpMatches.innerHTML = matches.length ? matches.map((candidate, index) => `
      <div class="match-card-wrapper" style="display: flex; flex-direction: column; gap: 4px; align-items: center; min-width: 0;">
        <button class="match-card" data-icon-id="${candidate.id}" title="${escapeHtml(candidate.library)}" style="animation-delay:${index * 40}ms; width: 100%; margin: 0;">
          ${iconTools().renderSVG(candidate)}
        </button>
        <span style="color: var(--text-muted); font-size: 11px; text-align: center; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;" title="${escapeHtml(candidate.library)}">${escapeHtml(candidate.library)}</span>
      </div>
    `).join("") : '<span class="muted">No similar icons in other libraries.</span>';
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
    const collections = window.IconStashCollections.all();
    els.collectionBadge.textContent = String(window.IconStashCollections.count());
    els.collectionBadge.classList.toggle("hidden", window.IconStashCollections.count() === 0);
    els.collectionsList.innerHTML = collections.map((collection) => {
      const previews = collection.icons.map((id) => state.icons.get(id)).filter(Boolean);
      return `<article class="collection-row" data-collection-id="${collection.id}">
        <div class="collection-row-info">
          <h3 class="collection-name-title">${escapeHtml(collection.name)}</h3>
          <p class="muted">${collection.icons.length} icons</p>
          <div class="collection-preview">${previews.map((icon) => `
            <span class="mini-icon">
              ${iconTools().renderSVG(icon)}
              <button class="remove-mini-icon-btn" data-icon-id="${icon.id}" title="Remove from collection">&times;</button>
            </span>
          `).join("")}</div>
        </div>
        <div class="collection-actions-group">
          <div class="actions-primary">
            <button class="glass-btn text-btn" data-collection-action="rename">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>
              <span>Rename</span>
            </button>
            <button class="gradient-btn text-btn" data-collection-action="zip">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              <span>Download ZIP</span>
            </button>
            <button class="gradient-btn text-btn" data-collection-action="png-zip">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              <span>Download PNG ZIP</span>
            </button>
            ${collection.id !== "favorites" ? `
            <button class="glass-btn delete-btn" data-collection-action="delete" title="Delete Collection">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
            </button>` : ""}
          </div>
          <div class="actions-exports">
            <span class="export-label">Developer Exports</span>
            <div class="export-buttons">
              <button class="glass-btn mini-export-btn" data-collection-action="react" title="Export React JSX components">React JSX</button>
              <button class="glass-btn mini-export-btn" data-collection-action="vue" title="Export Vue component snippets">Vue</button>
              <button class="glass-btn mini-export-btn" data-collection-action="sprite" title="Export SVG Symbol Sprite">SVG Sprite</button>
              <button class="glass-btn mini-export-btn" data-collection-action="css" title="Export CSS mask-image sprite">CSS Sprite</button>
              <button class="glass-btn mini-export-btn" data-collection-action="json" title="Export JSON list of icon data">JSON list</button>
            </div>
          </div>
        </div>
      </article>`;
    }).join("");
  }

  function renderCompare(icon) {
    const toolbar = document.querySelector(".compare-toolbar");
    if (toolbar) toolbar.style.display = "flex";
    
    const base = window.IconStashSearch.baseName(icon.name);
    const matches = Array.from(state.icons.values()).filter((candidate) => window.IconStashSearch.baseName(candidate.name) === base).slice(0, 80);
    els.compareTitle.textContent = `${icon.name} - across ${matches.length} libraries`;
    els.compareGrid.innerHTML = matches.map((candidate) => `<button class="compare-item" data-icon-id="${candidate.id}">
      ${iconTools().renderSVG(candidate, { color: state.detail.color, strokeWidth: state.detail.strokeWidth })}
      <span>${escapeHtml(candidate.library)}<br>${escapeHtml(candidate.style)}</span>
    </button>`).join("");
    els.compareDownload.onclick = () => downloadZip(matches);
    ui().openModal("compare-modal");
  }

  function renderComparePlaceholder() {
    const toolbar = document.querySelector(".compare-toolbar");
    if (toolbar) toolbar.style.display = "none";
    
    els.compareTitle.textContent = "Compare Mode";
    els.compareGrid.innerHTML = `
      <div class="compare-placeholder-card">
        <div class="placeholder-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3H3v4M21 7V3h-4M3 17v4h4M17 21h4v-4M8 8l8 8M16 8l-8 8"/></svg>
        </div>
        <h3>Audit & Compare Across Libraries</h3>
        <p class="placeholder-desc">Compare Mode lets you cross-examine the exact same icon across all 80+ loaded icon libraries (e.g. Lucide, Feather, FontAwesome, etc.) in real-time. Customize stroke weights, colors, compare layouts, and download the full matching bundle in one click.</p>
        
        <div class="placeholder-steps">
          <div class="placeholder-step">
            <span class="step-badge">1</span>
            <div>
              <h4>Select an Icon</h4>
              <p>Close this modal and click any icon card in the main grid to view its details.</p>
            </div>
          </div>
          <div class="placeholder-step">
            <span class="step-badge">2</span>
            <div>
              <h4>Click Compare Mode</h4>
              <p>With the icon open, click the Compare Mode button (crosshair) in the top-right header.</p>
            </div>
          </div>
          <div class="placeholder-step">
            <span class="step-badge">3</span>
            <div>
              <h4>Audit and Download</h4>
              <p>Customize stroke widths, check contrast, and download all matching styles at once.</p>
            </div>
          </div>
        </div>
        
        <button class="gradient-btn close-compare-btn" id="close-compare-placeholder">Start Browsing Icons</button>
      </div>
    `;
    
    // Bind the start browsing button
    const closeBtn = document.getElementById("close-compare-placeholder");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        ui().closeModals();
      });
    }
    
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
    if (!state.prerender.active) updateVirtualScroll(true);
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

  function showCollectionSelector(anchor, iconIds, onComplete) {
    const ids = Array.isArray(iconIds) ? iconIds : [iconIds];
    if (ids.length === 0) return;

    // Remove any existing popovers
    const existing = document.querySelector(".collection-popover");
    if (existing) existing.remove();

    // Create the popover element
    const popover = document.createElement("div");
    popover.className = "collection-popover glass-panel";
    
    const collections = window.IconStashCollections.all();
    
    let html = `<div class="popover-header">Add to Collection</div>`;
    
    collections.forEach(col => {
      const hasAll = ids.every(id => col.icons.includes(id));
      const statusIcon = hasAll ? "✓" : "";
      html += `
        <button class="popover-item" data-id="${col.id}">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" class="popover-folder-icon"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          <span class="col-name">${escapeHtml(col.name)}</span>
          <span class="col-check">${statusIcon}</span>
        </button>
      `;
    });
    
    html += `
      <div class="popover-divider"></div>
      <button class="popover-item create-new">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        <span>Create New Folder</span>
      </button>
    `;
    
    popover.innerHTML = html;
    document.body.appendChild(popover);
    
    const rect = anchor.getBoundingClientRect();
    const popoverWidth = 200;
    
    let top = rect.bottom + window.scrollY + 6;
    let left = rect.left + window.scrollX + (rect.width / 2) - (popoverWidth / 2);
    
    if (left < 10) left = 10;
    if (left + popoverWidth > window.innerWidth - 10) {
      left = window.innerWidth - popoverWidth - 10;
    }
    
    // Position check: if it goes below screen height, place it above
    const popoverHeight = 160; // approximate
    if (rect.bottom + popoverHeight > window.innerHeight && rect.top - popoverHeight > 0) {
      top = rect.top + window.scrollY - popoverHeight - 6;
    }
    
    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
    popover.style.width = `${popoverWidth}px`;
    
    popover.querySelectorAll(".popover-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        if (item.classList.contains("create-new")) {
          const name = prompt("Enter new folder name:");
          if (name && name.trim()) {
            const col = window.IconStashCollections.create(name);
            window.IconStashCollections.addIcons(col.id, ids);
            ui().toast(`Created "${col.name}" & added ${ids.length} icon(s)`, "success");
            renderCollections();
            if (onComplete) onComplete(col.id);
            popover.remove();
          }
        } else {
          const colId = item.dataset.id;
          const col = window.IconStashCollections.getCollection(colId);
          if (col) {
            window.IconStashCollections.addIcons(colId, ids);
            ui().toast(`Added ${ids.length} icon(s) to "${col.name}"`, "success");
            renderCollections();
            if (onComplete) onComplete(colId);
            popover.remove();
          }
        }
      });
    });
    
    popover.addEventListener("click", (e) => e.stopPropagation());
    
    const closePopover = () => {
      popover.remove();
      document.removeEventListener("click", closePopover);
      window.removeEventListener("scroll", closePopover, true);
    };
    
    setTimeout(() => {
      document.addEventListener("click", closePopover);
      window.addEventListener("scroll", closePopover, true);
    }, 10);
  }

  function debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function setupEvents() {
    els.search.addEventListener("focus", () => {
      els.searchShell.classList.add("focused");
      triggerBackgroundSync();
    });
    els.search.addEventListener("blur", () => setTimeout(() => els.searchShell.classList.remove("focused"), 100));
    
    const handleSearchInput = debounce(async () => {
      state.searchQuery = els.search.value.trim();
      els.searchClear.classList.toggle("hidden", !state.searchQuery);
      
      // Automatically update the URL hash to reflect the search term
      if (state.searchQuery) {
        history.replaceState(null, "", `#/search?query=${encodeURIComponent(state.searchQuery)}`);
      } else {
        history.replaceState(null, "", "#/search");
      }
      
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
    }, 300);

    els.search.addEventListener("input", () => {
      triggerBackgroundSync();
      handleSearchInput();
    });
    els.searchClear.addEventListener("click", async () => {
      els.search.value = "";
      state.searchQuery = "";
      els.searchClear.classList.add("hidden");
      els.autocomplete.classList.add("hidden");
      history.replaceState(null, "", "#/search");
      const basePath = location.hash.split("?")[0];
      if (basePath === "#/search" || basePath === "#/all" || basePath === "#/icons") await ensureInitialBrowseLibrary();
      applyFilters({ resetScroll: true });
    });
    els.autocomplete.addEventListener("click", (event) => {
      const item = event.target.closest(".autocomplete-item");
      if (!item) return;
      const id = item.dataset.iconId;
      els.autocomplete.classList.add("hidden");
      window.location.hash = `#/icon/${id}`;
    });
    els.logo.addEventListener("click", (event) => {
      event.preventDefault();
      clearAllFilters({ skipRender: true });
      window.location.hash = "#/";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    els.libSearch.addEventListener("input", renderSidebarLibraries);
    els.libList.addEventListener("change", async (event) => {
      triggerBackgroundSync();
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
      const toggle = event.target.closest("#lib-toggle");
      if (toggle) {
        event.preventDefault();
        state.librariesExpanded = !state.librariesExpanded;
        const collapseList = $("lib-collapse-list");
        const chevron = toggle.querySelector(".chevron");
        if (collapseList) {
          if (state.librariesExpanded) {
            collapseList.style.maxHeight = "700px";
            if (chevron) chevron.style.transform = "rotate(90deg)";
            toggle.setAttribute("aria-expanded", "true");
          } else {
            collapseList.style.maxHeight = "0";
            if (chevron) chevron.style.transform = "rotate(0deg)";
            toggle.setAttribute("aria-expanded", "false");
          }
        }
        return;
      }
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
      triggerBackgroundSync();
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
      triggerBackgroundSync();
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
      triggerBackgroundSync();
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
      const nearBottom = els.gridContainer.scrollTop + els.gridContainer.clientHeight > els.gridContainer.scrollHeight - 1800;
      if (nearBottom) {
        if (state.prerender.active) {
          appendNextPrerenderChunk();
          return;
        }
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
      if (!state.prerender.active) {
        updateVirtualScroll(true);
      } else {
        checkViewportFill();
      }
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
      els.iconGrid.classList.toggle("select-mode-active", state.selectMode);
      if (!state.selectMode) state.selectedIcons.clear();
      updateBulkBar();
      if (!state.prerender.active) updateVirtualScroll(true);
    });
    ui().qsa(".density-btn").forEach((button) => {
      button.addEventListener("click", () => {
        state.density = button.dataset.density;
        ui().qsa(".density-btn").forEach((node) => node.classList.toggle("active", node === button));
        calculateGrid();
        buildRows();
        if (!state.prerender.active) updateVirtualScroll(true);
      });
    });
    els.dpClose.addEventListener("click", () => closeDetail());
    setupDetailEvents();
    setupCompareEvents();
    setupCollectionEvents();
    setupKeyboard();
    els.themeToggle.addEventListener("click", toggleTheme);
    els.sidebarToggle.addEventListener("click", () => document.body.classList.toggle("sidebar-open"));
    els.sidebarCollapse.addEventListener("click", () => {
      const collapsed = document.body.classList.toggle("sidebar-collapsed");
      els.sidebarCollapse.setAttribute("aria-expanded", String(!collapsed));
      requestAnimationFrame(() => {
        calculateGrid();
        if (!state.prerender.active) updateVirtualScroll(true);
      });
    });
    els.compareToggle.addEventListener("click", () => {
      if (state.currentIconId) {
        const isActive = els.compareToggle.classList.toggle("active");
        if (isActive) {
          renderCompare(state.icons.get(state.currentIconId));
        } else {
          ui().closeModals();
        }
      } else {
        els.compareToggle.classList.add("active");
        renderComparePlaceholder();
      }
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
      triggerBackgroundSync();
      els.search.value = chip.dataset.suggest;
      state.searchQuery = chip.dataset.suggest;
      history.replaceState(null, "", `#/search?query=${encodeURIComponent(chip.dataset.suggest)}`);
      applyFilters({ resetScroll: true });
    });
    window.addEventListener("iconstash:collections-changed", () => {
      renderCollections();
      syncPrerenderFavoriteButtons();
    });
    window.addEventListener("hashchange", handleRoute);

    // Collapsible Customize Preview Sidebar Section Toggle
    if (els.custColorHex) {
      const custToggle = $("customize-toggle");
      const custSection = $("customize-section");
      const custContent = $("customize-content");
      if (custToggle && custSection && custContent) {
        custToggle.addEventListener("click", () => {
          const isOpen = custSection.classList.toggle("open");
          custToggle.setAttribute("aria-expanded", String(isOpen));
        });
      }

      // Live Color Customization sync (hex input + color wheel button)
      const themePreviewColor = () => (
        document.documentElement.dataset.theme === "light" ? "#000000" : "#ffffff"
      );

      const applyAutoColor = () => {
        state.customColor = "";
        els.iconGrid.style.setProperty("--custom-icon-color", themePreviewColor());
        els.iconGrid.classList.add("customized-preview-color");
      };

      const applyColor = (color) => {
        if (!color) {
          applyAutoColor();
          return;
        }
        state.customColor = color;
        els.iconGrid.style.setProperty("--custom-icon-color", color);
        els.iconGrid.classList.add("customized-preview-color");
      };

      const syncDefaultColorInput = () => {
        if (state.customColor) return;
        const color = themePreviewColor();
        els.custColorHex.value = color;
        els.custColorWheel.value = color;
      };

      els.custColorBtn.addEventListener("click", () => {
        els.custColorWheel.click();
      });

      els.custColorWheel.addEventListener("input", () => {
        const color = els.custColorWheel.value;
        els.custColorHex.value = color;
        applyColor(color);
      });

      const normalizeHex = (value) => {
        let val = String(value || "").trim();
        if (/^#?[A-Fa-f0-9]{3}$/.test(val)) {
          val = val.replace("#", "").split("").map((char) => char + char).join("");
        } else if (!/^#?[A-Fa-f0-9]{6}$/.test(val)) {
          return "";
        }
        return (val.startsWith("#") ? val : "#" + val).toLowerCase();
      };

      els.custColorHex.addEventListener("input", () => {
        const val = normalizeHex(els.custColorHex.value);
        if (val) {
          els.custColorWheel.value = val;
          applyColor(val);
        } else if (els.custColorHex.value.trim() === "") {
          applyColor("");
        }
      });

      // Live Stroke Width Customization sync
      const applyStroke = (stroke) => {
        if (!stroke) {
          state.customStrokeWidth = "";
          els.iconGrid.style.removeProperty("--custom-stroke-width");
          els.iconGrid.classList.remove("customized-preview-stroke");
          return;
        }
        state.customStrokeWidth = stroke;
        els.iconGrid.style.setProperty("--custom-stroke-width", stroke + "px");
        els.iconGrid.classList.add("customized-preview-stroke");
      };

      els.custStrokeSlider.addEventListener("input", () => {
        const val = els.custStrokeSlider.value;
        els.custStrokeLabel.textContent = `${Number(val).toFixed(1)}px`;
        applyStroke(val);
      });

      // Reset button
      els.custResetBtn.addEventListener("click", () => {
        applyAutoColor();
        syncDefaultColorInput();
        els.custStrokeSlider.value = "1.5";
        els.custStrokeLabel.textContent = "1.5px";
        applyStroke("1.5");
      });

      // Initialize inputs and apply defaults on startup
      syncDefaultColorInput();
      els.custStrokeSlider.value = state.customStrokeWidth;
      els.custStrokeLabel.textContent = `${Number(state.customStrokeWidth).toFixed(1)}px`;
      applyAutoColor();
      applyStroke(state.customStrokeWidth);
    }
  }

  async function handleGridClick(event) {
    const favBtn = event.target.closest(".card-favorite-btn");
    if (favBtn) {
      event.stopPropagation();
      event.preventDefault();
      const id = favBtn.dataset.favoriteId;
      showCollectionSelector(favBtn, id, () => {
        syncPrerenderFavoriteButtons();
      });
      return;
    }

    const card = event.target.closest(".icon-card");
    if (!card) return;
    const id = card.dataset.id;
    const slug = card.dataset.library || iconSlugFromId(id);
    let icon = state.icons.get(id) || hydratePrerenderIcon(card);
    if (!icon && slug) {
      await loadLibrary(slug);
      icon = state.icons.get(id);
    }
    if (!icon) return;
    if (state.selectMode) {
      toggleSelect(icon.id);
    } else {
      els.autocomplete.classList.add("hidden");
      state.currentIconId = icon.id;
      els.detailPanel.classList.remove("closed");
      renderDetail(icon);
      updateFocusedCard();
      warmLibraryAfterPrerenderClick(slug, icon.id);
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
      state.detail.pngSize = Number(button.dataset.size);
      ui().qsa(".size-btn").forEach((node) => node.classList.toggle("active", node === button));
    }));
    els.dpDownloadSvg.addEventListener("click", () => {
      const icon = state.icons.get(state.currentIconId);
      if (icon) {
        iconTools().exportSVG(icon, { color: state.detail.color, strokeWidth: state.detail.strokeWidth, size: state.detail.size });
        ui().toast("SVG downloaded", "success");
      }
    });
    els.dpDownloadPng.addEventListener("click", () => {
      const icon = state.icons.get(state.currentIconId);
      if (icon) {
        downloadPng(icon, state.detail.pngSize || 256);
      }
    });
    els.dpDownloadZip.addEventListener("click", () => {
      const icon = state.icons.get(state.currentIconId);
      if (icon) downloadZip([icon], { pngSizes: [16, 32, 64, 128, 256, 512] });
    });
    els.dpVariants.addEventListener("click", (event) => {
      const button = event.target.closest("[data-icon-id]");
      if (button) {
        event.preventDefault();
        event.stopPropagation();
        window.location.hash = `#/icon/${button.dataset.iconId}`;
      }
    });
    els.dpMatches.addEventListener("click", (event) => {
      const button = event.target.closest("[data-icon-id]");
      if (button) {
        event.preventDefault();
        event.stopPropagation();
        window.location.hash = `#/icon/${button.dataset.iconId}`;
      }
    });
    els.dpTags.addEventListener("click", (event) => {
      const tag = event.target.closest("[data-tag]");
      if (!tag) return;
      els.search.value = tag.dataset.tag;
      state.searchQuery = tag.dataset.tag;
      window.location.hash = `#/search?query=${encodeURIComponent(tag.dataset.tag)}`;
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
    els.dpFavorite.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!state.currentIconId) return;
      showCollectionSelector(els.dpFavorite, state.currentIconId);
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

  function setupCompareEvents() {
    const compareToolbar = document.querySelector(".compare-toolbar");
    if (compareToolbar) {
      compareToolbar.addEventListener("click", (event) => {
        const btn = event.target.closest("button");
        if (!btn) return;
        
        if (btn.dataset.compareLabels) {
          compareToolbar.querySelectorAll("[data-compare-labels]").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          const showLabels = btn.dataset.compareLabels === "on";
          els.compareGrid.classList.toggle("no-labels", !showLabels);
        } else if (btn.dataset.compareBg) {
          compareToolbar.querySelectorAll("[data-compare-bg]").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          const bgType = btn.dataset.compareBg; // "dark" or "light"
          els.compareGrid.classList.remove("bg-dark", "bg-light");
          els.compareGrid.classList.add(`bg-${bgType}`);
        }
      });
    }
  }

  function setupCollectionEvents() {
    els.collectionsToggle.addEventListener("click", () => {
      renderCollections();
      ui().openModal("collections-modal");
    });
    els.collectionCreate.addEventListener("click", () => {
      window.IconStashCollections.create(els.collectionNameInput.value);
      els.collectionNameInput.value = "";
      renderCollections();
    });
    els.collectionsList.addEventListener("click", async (event) => {
      const removeBtn = event.target.closest(".remove-mini-icon-btn");
      if (removeBtn) {
        event.stopPropagation();
        event.preventDefault();
        const row = event.target.closest("[data-collection-id]");
        if (!row) return;
        const colId = row.dataset.collectionId;
        const iconId = removeBtn.dataset.iconId;
        window.IconStashCollections.removeIcon(colId, iconId);
        ui().toast("Removed from collection", "success");
        return;
      }
      const row = event.target.closest("[data-collection-id]");
      const action = event.target.closest("[data-collection-action]")?.dataset.collectionAction;
      if (!row || !action) return;
      const collection = window.IconStashCollections.getCollection(row.dataset.collectionId);
      if (!collection) return;
      const icons = collection.icons.map((id) => state.icons.get(id)).filter(Boolean);
      if (action === "rename") {
        const name = prompt("Collection name", collection.name);
        if (name) window.IconStashCollections.rename(collection.id, name);
      } else if (action === "delete") {
        window.IconStashCollections.remove(collection.id);
      } else if (action === "json") {
        window.IconStashCollections.exportJSON(collection);
      } else if (action === "css") {
        window.IconStashCollections.exportCSSSprite(collection, state.icons);
      } else if (action === "react") {
        window.IconStashCollections.exportReact(collection, state.icons);
      } else if (action === "vue") {
        window.IconStashCollections.exportVue(collection, state.icons);
      } else if (action === "sprite") {
        window.IconStashCollections.exportSpriteSVG(collection, state.icons);
      } else if (action === "zip") {
        await downloadZip(icons);
      } else if (action === "png-zip") {
        await downloadZip(icons, { pngSizes: [16, 32, 48, 64, 128, 256, 512], filename: `${iconTools().slugFilePart(collection.name)}-png.zip` });
      }
      renderCollections();
    });
    els.bulkCollect.addEventListener("click", (event) => {
      event.stopPropagation();
      if (state.selectedIcons.size === 0) return;
      showCollectionSelector(els.bulkCollect, Array.from(state.selectedIcons), () => {
        state.selectedIcons.clear();
        updateBulkBar();
        if (!state.prerender.active) updateVirtualScroll(true);
      });
    });
    els.bulkClear.addEventListener("click", () => {
      state.selectedIcons.clear();
      state.selectMode = false;
      els.selectMode.classList.remove("active");
      els.iconGrid.classList.remove("select-mode-active");
      updateBulkBar();
      if (!state.prerender.active) updateVirtualScroll(true);
    });
    els.bulkDownload.addEventListener("click", async () => {
      const icons = Array.from(state.selectedIcons).map((id) => state.icons.get(id)).filter(Boolean);
      await downloadZip(icons);
    });
    els.bulkColor.addEventListener("input", () => {
      state.detail.color = els.bulkColor.value;
      if (!state.prerender.active) updateVirtualScroll(true);
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
          history.replaceState(null, "", "#/search");
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
        if (!state.prerender.active) updateVirtualScroll(true);
      } else if (event.key.toLowerCase() === "f" && !editing) {
        const icon = focusedIcon();
        if (icon) {
          window.IconStashCollections.addIcon("favorites", icon.id);
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
    const matches = window.IconStashSearch.suggestions(state.icons.values(), state.searchQuery, 5);
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

  async function clearAllFilters(options = {}) {
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
    if (options.skipRender) return;
    if (location.hash.startsWith("#/library/") || location.hash.startsWith("#/category/") || location.hash.startsWith("#/icon/")) {
      history.replaceState(null, "", "#/search");
    }
    setRouteView("grid");
    if (shouldUsePrerenderBrowse() && await showPrerenderedGrid({ mode: "all", resetScroll: true })) {
      closeDetail(false);
      return;
    }
    await ensureInitialBrowseLibrary();
    applyFilters({ resetScroll: true });
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("iconvault-theme", next);
    if (!state.customColor && els.custColorHex && els.custColorWheel) {
      const color = next === "light" ? "#000000" : "#ffffff";
      els.custColorHex.value = color;
      els.custColorWheel.value = color;
      els.iconGrid?.style.setProperty("--custom-icon-color", color);
      els.iconGrid?.classList.add("customized-preview-color");
    }
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
    ensureCustomizePreviewSection();
    cacheElements();
    initTheme();
    ui().init();
    setupEvents();
    calculateGrid();
    await loadIndex();
    await loadPrerenderManifest();
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
      ui().toast(`IconStash failed to start: ${error.message}`, "error", 6000);
    });
  });
})();
// Trigger deploy
