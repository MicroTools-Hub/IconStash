(function () {
  let fuse = null;
  let indexedIds = new Set();

  function tokenize(value) {
    return String(value || "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean);
  }

  function baseName(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/[-_\s]?(outline|regular|solid|filled|fill|bold|duotone|thin|light|sharp|round|linear|twotone|two-tone|24|20|16|12)$/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function buildSearchIndex(icons) {
    const list = Array.from(icons || []);
    indexedIds = new Set(list.map((icon) => icon.id));
    if (typeof Fuse === "undefined") {
      fuse = null;
      return null;
    }
    fuse = new Fuse(list, {
      includeScore: true,
      threshold: 0.32,
      distance: 96,
      ignoreLocation: true,
      minMatchCharLength: 1,
      keys: [
        { name: "name", weight: 0.62 },
        { name: "nameVariants", weight: 0.2 },
        { name: "tags", weight: 0.48 },
        { name: "category", weight: 0.12 },
        { name: "subCategory", weight: 0.1 },
        { name: "library", weight: 0.08 },
        { name: "librarySlug", weight: 0.06 }
      ]
    });
    return fuse;
  }

  function needsIndexRebuild(icons) {
    if (!fuse) return true;
    for (const icon of icons) {
      if (!indexedIds.has(icon.id)) return true;
    }
    return indexedIds.size !== icons.length;
  }

  function textFallback(list, query) {
    const words = tokenize(query);
    if (!words.length) return list;
    return list
      .map((icon) => {
        const haystack = [
          icon.name,
          icon.library,
          icon.librarySlug,
          icon.category,
          icon.subCategory,
          ...(icon.tags || []),
          ...(icon.nameVariants || [])
        ].join(" ").toLowerCase();
        let score = 0;
        for (const word of words) {
          if (haystack.includes(word)) score += icon.name.toLowerCase().includes(word) ? 4 : 1;
        }
        return score ? { icon, score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || (b.icon.popularity || 0) - (a.icon.popularity || 0))
      .map((entry) => entry.icon);
  }

  function search(list, query) {
    const q = String(query || "").trim();
    if (!q) return list.slice();
    if (typeof Fuse !== "undefined") {
      if (needsIndexRebuild(list)) buildSearchIndex(list);
      if (fuse) return fuse.search(q).map((result) => result.item);
    }
    return textFallback(list, q);
  }

  function filterAndSort(icons, filters) {
    let result = Array.from(icons || []);
    if (filters.librarySlugs && filters.librarySlugs.size) {
      result = result.filter((icon) => filters.librarySlugs.has(icon.librarySlug));
    }
    if (filters.style && filters.style !== "all") {
      result = result.filter((icon) => icon.style === filters.style);
    }
    if (filters.category) {
      result = result.filter((icon) => icon.category === filters.category);
    }
    if (filters.query) {
      result = search(result, filters.query);
    }
    const sort = filters.sort || "relevance";
    if (sort === "popular") {
      result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (sort === "newest") {
      result.sort((a, b) => String(b.dateAdded || "").localeCompare(String(a.dateAdded || "")));
    } else if (sort === "az") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "za") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    return result;
  }

  function suggestions(icons, query, limit = 5) {
    const matches = search(Array.from(icons || []), query).slice(0, limit);
    return matches;
  }

  window.IconStashSearch = {
    baseName,
    tokenize,
    buildSearchIndex,
    filterAndSort,
    suggestions
  };
})();
