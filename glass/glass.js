/* ============================================================================
   Liquid Glass 2026 — theme toggle + "alive" effect layer

   This file is ALWAYS loaded but never alters the iOS 6 experience: its effects
   only run while <html> has class "theme-glass". It is purely additive and does
   NOT touch main.js's overlay / inert / focus-trap / confetti machinery.

   Responsibilities:
     1. Wire the nav-bar theme switch (an accessible radiogroup), persist the
        choice to localStorage, and keep <html>'s theme class in sync.
     2. Run the gated effect layer in Glass mode only:
          • pointer-tracked specular highlight  → writes --px/--py on the hovered
            .group (consumed by .group::before in glass.css)
          • gentle scroll parallax              → writes --scrolly on <html>
        Both are skipped under prefers-reduced-motion; pointer tracking also
        requires a fine pointer (mouse/trackpad), so touch devices stay calm.

   The pre-paint theme class is applied by a tiny inline script in <head> (see
   index.html) so a saved Glass preference never flashes iOS 6.
   ============================================================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "acsite.theme";
  var html = document.documentElement;

  var reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var fineMQ = window.matchMedia("(pointer: fine)");
  var darkMQ = window.matchMedia("(prefers-color-scheme: dark)");

  function onMQChange(mq, fn) {
    if (mq.addEventListener) mq.addEventListener("change", fn);
    else if (mq.addListener) mq.addListener(fn); // older Safari
  }

  function currentTheme() {
    return html.classList.contains("theme-glass") ? "glass" : "ios";
  }

  /* ---- nav-bar browser chrome color (mobile) ---------------------------- */
  function updateThemeColor(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    if (theme === "glass") {
      meta.setAttribute("content", darkMQ.matches ? "#0b1020" : "#eef2ff");
    } else {
      meta.setAttribute("content", "#67789a"); // original iOS 6 nav blue
    }
  }

  /* ---- the toggle (radiogroup) ------------------------------------------ */
  var toggle = document.querySelector("header.navbar .theme-toggle");
  var segs = toggle
    ? Array.prototype.slice.call(toggle.querySelectorAll(".seg"))
    : [];

  function syncToggle(theme) {
    for (var i = 0; i < segs.length; i++) {
      var on = segs[i].getAttribute("data-theme") === theme;
      segs[i].setAttribute("aria-checked", on ? "true" : "false");
      segs[i].tabIndex = on ? 0 : -1; // roving tabindex
    }
  }

  function setTheme(theme, persist) {
    if (theme === "glass") {
      html.classList.add("theme-glass");
      html.classList.remove("theme-ios");
    } else {
      html.classList.add("theme-ios");
      html.classList.remove("theme-glass");
    }
    if (persist !== false) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    }
    syncToggle(theme);
    updateThemeColor(theme);
    evaluateEffects();
    try {
      document.dispatchEvent(
        new CustomEvent("themechange", { detail: { theme: theme } })
      );
    } catch (e) {}
  }

  if (toggle && segs.length) {
    for (var s = 0; s < segs.length; s++) {
      (function (seg) {
        seg.addEventListener("click", function () {
          setTheme(seg.getAttribute("data-theme"), true);
          seg.focus();
        });
      })(segs[s]);
    }

    // Arrow keys move + select within the group; Space/Enter selects the focused
    // option (standard radiogroup keyboard behavior).
    toggle.addEventListener("keydown", function (e) {
      var idx = segs.indexOf(document.activeElement);
      if (idx === -1) return;
      var next = idx;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        next = (idx + 1) % segs.length;
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        next = (idx - 1 + segs.length) % segs.length;
      } else if (e.key === " " || e.key === "Spacebar" || e.key === "Enter") {
        e.preventDefault();
        setTheme(segs[idx].getAttribute("data-theme"), true);
        return;
      } else {
        return;
      }
      e.preventDefault();
      setTheme(segs[next].getAttribute("data-theme"), true);
      segs[next].focus();
    });
  }

  /* ---- effect layer (Glass + motion allowed only) ----------------------- */
  var effectsOn = false;
  var pmRaf = 0;
  var lastPointer = null;
  var scRaf = 0;

  function onPointerMove(e) {
    lastPointer = e;
    if (pmRaf) return;
    pmRaf = requestAnimationFrame(function () {
      pmRaf = 0;
      var ev = lastPointer;
      if (!ev || !ev.target || !ev.target.closest) return;
      var group = ev.target.closest(".group");
      if (!group) return;
      var r = group.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var x = ((ev.clientX - r.left) / r.width) * 100;
      var y = ((ev.clientY - r.top) / r.height) * 100;
      group.style.setProperty("--px", x.toFixed(1) + "%");
      group.style.setProperty("--py", y.toFixed(1) + "%");
    });
  }

  function onScroll() {
    if (scRaf) return;
    scRaf = requestAnimationFrame(function () {
      scRaf = 0;
      var y = window.pageYOffset || html.scrollTop || 0;
      var v = Math.max(-40, Math.min(40, y * 0.06));
      html.style.setProperty("--scrolly", v.toFixed(1) + "px");
    });
  }

  function enableEffects() {
    if (effectsOn) return;
    effectsOn = true;
    window.addEventListener("scroll", onScroll, { passive: true });
    if (fineMQ.matches) {
      document.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    onScroll(); // set initial parallax value
  }

  function disableEffects() {
    if (!effectsOn) return;
    effectsOn = false;
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("pointermove", onPointerMove);
    if (scRaf) { cancelAnimationFrame(scRaf); scRaf = 0; }
    if (pmRaf) { cancelAnimationFrame(pmRaf); pmRaf = 0; }
    html.style.removeProperty("--scrolly");
  }

  function evaluateEffects() {
    if (currentTheme() === "glass" && !reducedMQ.matches) enableEffects();
    else disableEffects();
  }

  // React to runtime capability/preference changes.
  onMQChange(reducedMQ, evaluateEffects);
  onMQChange(fineMQ, function () {
    if (effectsOn) { disableEffects(); enableEffects(); }
  });
  onMQChange(darkMQ, function () {
    if (currentTheme() === "glass") updateThemeColor("glass");
  });

  /* ---- init: sync UI to the theme the FOUC guard already applied -------- */
  var initial = currentTheme();
  syncToggle(initial);
  updateThemeColor(initial);
  evaluateEffects();
})();
