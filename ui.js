(function () {
  const toasts = new Set();
  const trail = [];
  let cursorX = -100;
  let cursorY = -100;
  let ringX = -100;
  let ringY = -100;
  let cursorRaf = 0;

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function toast(message, type = "info", duration = 3200) {
    const container = qs("#toast-container");
    if (!container) return;
    const node = document.createElement("div");
    node.className = `toast toast-${type}`;
    node.style.setProperty("--toast-ms", `${duration}ms`);
    const label = document.createElement("span");
    label.textContent = message;
    node.appendChild(label);
    container.appendChild(node);
    toasts.add(node);
    setTimeout(() => {
      node.classList.add("exiting");
      setTimeout(() => {
        toasts.delete(node);
        node.remove();
      }, 220);
    }, duration);
  }

  function openModal(id) {
    const modal = qs(`#${id}`);
    const backdrop = qs("#modal-backdrop");
    if (!modal || !backdrop) return;
    qsa(".modal").forEach((entry) => entry.classList.add("hidden"));
    backdrop.classList.remove("hidden");
    modal.classList.remove("hidden");
  }

  function closeModals() {
    qsa(".modal").forEach((entry) => entry.classList.add("hidden"));
    qs("#modal-backdrop")?.classList.add("hidden");
  }

  function particleBurst(target) {
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 6; i += 1) {
      const dot = document.createElement("i");
      const angle = (Math.PI * 2 * i) / 6;
      dot.className = "particle";
      dot.style.left = `${cx}px`;
      dot.style.top = `${cy}px`;
      dot.style.background = i % 2 ? "var(--neon-pink)" : "var(--neon-blue)";
      dot.style.setProperty("--tx", `${Math.cos(angle) * 42}px`);
      dot.style.setProperty("--ty", `${Math.sin(angle) * 42}px`);
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 520);
    }
  }

  function successButton(button, label = "Copied!") {
    if (!button) return;
    const old = button.textContent;
    button.classList.add("copy-success");
    button.textContent = label;
    particleBurst(button);
    setTimeout(() => {
      button.classList.remove("copy-success");
      button.textContent = old;
    }, 1500);
  }

  function animateNumber(element, target, duration = 700) {
    if (!element) return;
    const start = Number(String(element.textContent || "0").replace(/,/g, "")) || 0;
    const end = Number(target) || 0;
    const started = performance.now();
    element.classList.remove("number-pop");
    void element.offsetWidth;
    element.classList.add("number-pop");
    function frame(now) {
      const t = Math.min(1, (now - started) / duration);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const value = Math.round(start + (end - start) * eased);
      element.textContent = value.toLocaleString();
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function setupCursor() {
    return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = qs("#cursor");
    const ring = qs("#cursor-ring");
    const trailRoot = qs("#cursor-trail");
    if (!dot || !ring || !trailRoot) return;
    for (let i = 0; i < 8; i += 1) {
      const trailDot = document.createElement("i");
      trailDot.className = "trail-dot";
      trailDot.style.opacity = `${0.45 - i * 0.045}`;
      trailDot.style.background = i % 3 === 0 ? "var(--neon-pink)" : i % 3 === 1 ? "var(--neon-blue)" : "var(--neon-purple)";
      trailRoot.appendChild(trailDot);
      trail.push({ node: trailDot, x: -100, y: -100 });
    }
    document.addEventListener("mousemove", (event) => {
      cursorX = event.clientX;
      cursorY = event.clientY;
      const button = event.target.closest("button, a, input, select, .glass-btn, .gradient-btn");
      const card = event.target.closest(".icon-card");
      document.body.classList.toggle("cursor-button", Boolean(button));
      document.body.classList.toggle("cursor-card", Boolean(card));
      if (button) {
        const rect = button.getBoundingClientRect();
        document.body.style.setProperty("--cursor-w", `${Math.min(160, Math.max(56, rect.width + 18))}px`);
      }
      if (!cursorRaf) cursorRaf = requestAnimationFrame(cursorLoop);
    }, { passive: true });
    document.addEventListener("click", () => {
      ring.animate([
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: "translate(-50%, -50%) scale(1.7)", opacity: 0 }
      ], { duration: 300, easing: "ease-out" });
    });
    function cursorLoop() {
      cursorRaf = 0;
      ringX += (cursorX - ringX) * 0.18;
      ringY += (cursorY - ringY) * 0.18;
      dot.style.left = `${cursorX}px`;
      dot.style.top = `${cursorY}px`;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      let tx = cursorX;
      let ty = cursorY;
      for (const item of trail) {
        item.x += (tx - item.x) * 0.32;
        item.y += (ty - item.y) * 0.32;
        item.node.style.left = `${item.x}px`;
        item.node.style.top = `${item.y}px`;
        tx = item.x;
        ty = item.y;
      }
      if (Math.abs(ringX - cursorX) > 0.5 || Math.abs(ringY - cursorY) > 0.5) {
        cursorRaf = requestAnimationFrame(cursorLoop);
      }
    }
  }

  function setupModalClosers() {
    qsa(".modal-close, #modal-backdrop").forEach((node) => {
      node.addEventListener("click", closeModals);
    });
  }

  function setupStatsObserver() {
    const stats = qs("#stats-bar");
    if (!stats) return;
    const run = () => {
      qsa(".stat-num", stats).forEach((node) => animateNumber(node, Number(node.dataset.target || 0), 1500));
    };
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          run();
          observer.disconnect();
        }
      }, { threshold: 0.3 });
      observer.observe(stats);
    } else {
      run();
    }
  }

  function setupNetworkGate() {
    const gate = qs("#network-gate");
    if (gate) gate.classList.add("hidden");
    const retry = qs("#network-retry");
    retry?.addEventListener("click", () => {
      gate?.classList.add("hidden");
      toast("IconVoid core files are bundled locally", "info");
    });
  }

  function createSkeletonRows(container, rows = 4, cols = 8) {
    if (!container) return;
    const html = Array.from({ length: rows }, (_, row) => (
      `<div class="virtual-row icons-row" style="--cols:${cols};height:var(--card-row-height);animation-delay:${row * 30}ms">` +
      Array.from({ length: cols }, () => '<div class="icon-card skeleton-card"></div>').join("") +
      "</div>"
    )).join("");
    container.innerHTML = html;
  }

  function init() {
    setupCursor();
    setupModalClosers();
    setupStatsObserver();
    setupNetworkGate();
  }

  window.IconVoidUI = {
    qs,
    qsa,
    toast,
    openModal,
    closeModals,
    particleBurst,
    successButton,
    animateNumber,
    createSkeletonRows,
    init
  };
})();
