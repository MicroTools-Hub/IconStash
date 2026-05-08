(function () {
  const VOID_NS = "http://www.w3.org/2000/svg";
  let zipLibraryPromise = null;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function slugFilePart(value) {
    return String(value || "icon")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "icon";
  }

  function normalizeSvgBody(icon, options = {}) {
    const body = icon.svgPath || icon.svgContent || "";
    let normalized = body;
    if (!/<(path|g|circle|rect|line|polyline|polygon|ellipse|defs|use|clipPath|mask)\b/i.test(body)) {
      normalized = `<path d="${escapeHtml(body)}"></path>`;
    }
    normalized = normalized.replace(/\s(fill|stroke)="(?!none\b|transparent\b|url\()[^"]*"/gi, (_match, attr) => ` ${attr}="currentColor"`);
    normalized = normalized.replace(/\s(fill|stroke)='(?!none\b|transparent\b|url\()[^']*'/gi, (_match, attr) => ` ${attr}="currentColor"`);
    if (options.strokeWidth) {
      if (/\sstroke-width=/i.test(normalized)) {
        normalized = normalized
          .replace(/\sstroke-width="[^"]*"/gi, ` stroke-width="${escapeHtml(options.strokeWidth)}"`)
          .replace(/\sstroke-width='[^']*'/gi, ` stroke-width="${escapeHtml(options.strokeWidth)}"`);
      }
    }
    return normalized;
  }

  function renderSVG(icon, options = {}) {
    if (!icon) return "";
    const viewBox = icon.viewBox || `0 0 ${icon.width || 24} ${icon.height || 24}`;
    const size = options.size || "100%";
    const strokeWidth = options.strokeWidth ?? icon.strokeWidth ?? 2;
    const color = options.color || "currentColor";
    const fillStyles = new Set(["fill", "solid", "bold"]);
    const fill = options.fill || (fillStyles.has(icon.style) ? "currentColor" : "none");
    const hasCustomStroke = Object.prototype.hasOwnProperty.call(options, "strokeWidth");
    const stroke = options.stroke || (fill === "none" || hasCustomStroke ? "currentColor" : "none");
    const attrs = [
      `viewBox="${escapeHtml(viewBox)}"`,
      `width="${escapeHtml(size)}"`,
      `height="${escapeHtml(size)}"`,
      `role="img"`,
      `aria-label="${escapeHtml(icon.name || icon.id)} icon"`,
      `fill="${fill}"`,
      `stroke="${stroke}"`,
      `stroke-width="${escapeHtml(strokeWidth)}"`,
      `stroke-linecap="round"`,
      `stroke-linejoin="round"`,
      `paint-order="stroke fill markers"`,
      `style="color:${escapeHtml(color)};fill:${escapeHtml(fill)};stroke:${escapeHtml(stroke)};stroke-width:${escapeHtml(strokeWidth)}"`
    ];
    return `<svg xmlns="${VOID_NS}" ${attrs.join(" ")}>${normalizeSvgBody(icon, options)}</svg>`;
  }

  function formatCode(icon, format, options = {}) {
    const svg = renderSVG(icon, options);
    const encoded = encodeURIComponent(svg);
    const base64 = btoa(unescape(encodeURIComponent(svg)));
    const componentName = (icon.name || "icon")
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("") || "Icon";
    if (format === "jsx") {
      return icon.jsxImport || `import { ${componentName} } from '${icon.npmPackage || icon.librarySlug}';`;
    }
    if (format === "xml") {
      return `<?xml version="1.0" encoding="UTF-8"?>\n${svg}`;
    }
    if (format === "vue") {
      return `<template>\n  ${svg}\n</template>`;
    }
    if (format === "svelte") {
      return `<script>\n  export let size = ${options.size || 24};\n</script>\n${svg.replace(/width="[^"]+"/, 'width="{size}"').replace(/height="[^"]+"/, 'height="{size}"')}`;
    }
    if (format === "angular") {
      return `<span class="iconvoid-icon" aria-hidden="true">${svg}</span>`;
    }
    if (format === "html") {
      return `<img src="data:image/svg+xml,${encoded}" width="${options.size || icon.width || 24}" height="${options.size || icon.height || 24}" alt="${escapeHtml(icon.name)} icon">`;
    }
    if (format === "css") {
      return `.icon-${slugFilePart(icon.name)} {\n  width: ${options.size || 24}px;\n  height: ${options.size || 24}px;\n  background-color: currentColor;\n  mask: url("data:image/svg+xml,${encoded}") center / contain no-repeat;\n}`;
    }
    if (format === "base64") {
      return `data:image/svg+xml;base64,${base64}`;
    }
    return svg;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      textarea.remove();
    }
  }

  function downloadBlob(blob, filename) {
    if (window.saveAs) {
      window.saveAs(blob, filename);
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function svgToDataUrl(svg) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (typeof JSZip !== "undefined") resolve();
        else {
          existing.addEventListener("load", resolve, { once: true });
          existing.addEventListener("error", reject, { once: true });
        }
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Unable to load ${src}`));
      document.head.appendChild(script);
    });
  }

  async function ensureJSZip() {
    if (typeof JSZip !== "undefined") return JSZip;
    if (!zipLibraryPromise) zipLibraryPromise = loadScript("vendor/jszip.min.js");
    await zipLibraryPromise;
    if (typeof JSZip === "undefined") throw new Error("ZIP support could not be loaded.");
    return JSZip;
  }

  function svgToCanvas(svg, size) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const scale = window.devicePixelRatio || 1;
      canvas.width = size * scale;
      canvas.height = size * scale;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      const ctx = canvas.getContext("2d");
      ctx.scale(scale, scale);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        resolve(canvas);
      };
      img.onerror = reject;
      img.src = svgToDataUrl(svg);
    });
  }

  async function exportPNG(icon, size = 512, options = {}) {
    const svg = renderSVG(icon, { ...options, size });
    const canvas = await svgToCanvas(svg, size);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        downloadBlob(blob, `${slugFilePart(icon.librarySlug)}-${slugFilePart(icon.name)}-${size}.png`);
        resolve(blob);
      }, "image/png");
    });
  }

  function exportSVG(icon, options = {}) {
    const svg = renderSVG(icon, options);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    downloadBlob(blob, `${slugFilePart(icon.librarySlug)}-${slugFilePart(icon.name)}.svg`);
  }

  async function exportZIP(icons, options = {}) {
    if (!icons || !icons.length) return;
    const Zip = await ensureJSZip();
    const capped = icons.slice(0, 200);
    const zip = new Zip();
    const folder = zip.folder("IconVoid");
    const sizes = options.pngSizes || [];
    for (const icon of capped) {
      const base = `${slugFilePart(icon.librarySlug)}-${slugFilePart(icon.name)}`;
      const svg = renderSVG(icon, options);
      folder.file(`${base}.svg`, svg);
      for (const size of sizes) {
        const canvas = await svgToCanvas(renderSVG(icon, { ...options, size }), size);
        const dataUrl = canvas.toDataURL("image/png");
        folder.file(`${base}-${size}.png`, dataUrl.split(",")[1], { base64: true });
      }
    }
    const manifest = capped.map((icon) => ({
      id: icon.id,
      name: icon.name,
      library: icon.library,
      tags: icon.tags
    }));
    folder.file("icons.json", JSON.stringify(manifest, null, 2));
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, options.filename || "IconVoid-icons.zip");
  }

  function createSprite(icons, options = {}) {
    const symbols = icons.map((icon) => {
      const body = normalizeSvgBody(icon);
      const viewBox = icon.viewBox || `0 0 ${icon.width || 24} ${icon.height || 24}`;
      return `<symbol id="${escapeHtml(icon.id)}" viewBox="${escapeHtml(viewBox)}">${body}</symbol>`;
    }).join("\n");
    return `<svg xmlns="${VOID_NS}" style="display:none" aria-hidden="true">\n${symbols}\n</svg>`;
  }

  window.IconVoidIcons = {
    escapeHtml,
    slugFilePart,
    normalizeSvgBody,
    renderSVG,
    formatCode,
    copyText,
    downloadBlob,
    exportPNG,
    exportSVG,
    exportZIP,
    createSprite
  };
})();
