(function () {
  const state = {
    collections: [
      { id: "favorites", name: "Favorites", icons: [] }
    ]
  };

  // Restore collections from localStorage on startup
  try {
    const saved = localStorage.getItem("iconstash-collections");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        state.collections = parsed;
        // Keep Favorites as the first item
        const favIdx = state.collections.findIndex(c => c.id === "favorites");
        if (favIdx < 0) {
          state.collections.unshift({ id: "favorites", name: "Favorites", icons: [] });
        }
      }
    }
  } catch (e) {
    console.error("Failed to restore collections:", e);
  }

  function makeId(name) {
    return (window.IconStashIcons?.slugFilePart(name) || "collection") + "-" + Math.random().toString(36).slice(2, 7);
  }

  function getCollection(id) {
    return state.collections.find((collection) => collection.id === id);
  }

  function create(name) {
    const trimmed = String(name || "").trim() || "Untitled Collection";
    const collection = { id: makeId(trimmed), name: trimmed, icons: [] };
    state.collections.push(collection);
    notify();
    return collection;
  }

  function rename(id, name) {
    const collection = getCollection(id);
    if (!collection) return null;
    collection.name = String(name || "").trim() || collection.name;
    notify();
    return collection;
  }

  function remove(id) {
    if (id === "favorites") return false;
    const before = state.collections.length;
    state.collections = state.collections.filter((collection) => collection.id !== id);
    notify();
    return state.collections.length !== before;
  }

  function addIcon(id, iconId) {
    const collection = getCollection(id) || state.collections[0];
    if (!collection.icons.includes(iconId)) collection.icons.push(iconId);
    notify();
    return collection;
  }

  function addIcons(id, iconIds) {
    const collection = getCollection(id) || state.collections[0];
    for (const iconId of iconIds) {
      if (!collection.icons.includes(iconId)) collection.icons.push(iconId);
    }
    notify();
    return collection;
  }

  function removeIcon(id, iconId) {
    const collection = getCollection(id);
    if (!collection) return;
    collection.icons = collection.icons.filter((value) => value !== iconId);
    notify();
  }

  function reorderIcon(id, fromIndex, toIndex) {
    const collection = getCollection(id);
    if (!collection) return;
    const [item] = collection.icons.splice(fromIndex, 1);
    collection.icons.splice(toIndex, 0, item);
    notify();
  }

  function clear(id) {
    const collection = getCollection(id);
    if (!collection) return;
    collection.icons = [];
    notify();
  }

  function count() {
    return state.collections.reduce((total, collection) => total + collection.icons.length, 0);
  }

  function notify() {
    try {
      localStorage.setItem("iconstash-collections", JSON.stringify(state.collections));
    } catch (e) {
      console.error("Failed to save collections:", e);
    }
    window.dispatchEvent(new CustomEvent("iconstash:collections-changed", { detail: state.collections }));
  }

  function exportJSON(collection) {
    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: "application/json;charset=utf-8" });
    window.IconStashIcons.downloadBlob(blob, `${window.IconStashIcons.slugFilePart(collection.name)}.json`);
  }

  function exportCSSSprite(collection, iconMap) {
    const rules = collection.icons
      .map((id) => iconMap.get(id))
      .filter(Boolean)
      .map((icon) => {
        const svg = window.IconStashIcons.renderSVG(icon);
        return `.icon-${window.IconStashIcons.slugFilePart(icon.id)} {\n  display:inline-block;\n  width:1em;\n  height:1em;\n  background-color:currentColor;\n  mask:url("data:image/svg+xml,${encodeURIComponent(svg)}") center / contain no-repeat;\n}`;
      })
      .join("\n\n");
    window.IconStashIcons.downloadBlob(new Blob([rules], { type: "text/css;charset=utf-8" }), `${window.IconStashIcons.slugFilePart(collection.name)}.css`);
  }

  function exportReact(collection, iconMap) {
    const imports = collection.icons
      .map((id) => iconMap.get(id))
      .filter(Boolean)
      .map((icon) => {
        const name = icon.name.split(/[-_\s]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
        return `export const ${name || "Icon"} = (props) => (${window.IconStashIcons.renderSVG(icon).replace("<svg ", "<svg {...props} ")});`;
      })
      .join("\n\n");
    window.IconStashIcons.downloadBlob(new Blob([imports], { type: "text/javascript;charset=utf-8" }), `${window.IconStashIcons.slugFilePart(collection.name)}.jsx`);
  }

  function exportVue(collection, iconMap) {
    const icons = collection.icons
      .map((id) => iconMap.get(id))
      .filter(Boolean)
      .map((icon) => `<template id="${icon.id}">\n  ${window.IconStashIcons.renderSVG(icon)}\n</template>`)
      .join("\n\n");
    window.IconStashIcons.downloadBlob(new Blob([icons], { type: "text/plain;charset=utf-8" }), `${window.IconStashIcons.slugFilePart(collection.name)}.vue-snippets`);
  }

  function exportSpriteSVG(collection, iconMap) {
    const icons = collection.icons.map((id) => iconMap.get(id)).filter(Boolean);
    const sprite = window.IconStashIcons.createSprite(icons);
    window.IconStashIcons.downloadBlob(new Blob([sprite], { type: "image/svg+xml;charset=utf-8" }), `${window.IconStashIcons.slugFilePart(collection.name)}-sprite.svg`);
  }

  window.IconStashCollections = {
    state,
    all: () => state.collections,
    getCollection,
    create,
    rename,
    remove,
    addIcon,
    addIcons,
    removeIcon,
    reorderIcon,
    clear,
    count,
    exportJSON,
    exportCSSSprite,
    exportReact,
    exportVue,
    exportSpriteSVG
  };
})();
