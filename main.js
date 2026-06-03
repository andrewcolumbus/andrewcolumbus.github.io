(function () {
  "use strict";

  var BIRTHDAY = { year: 2002, month: 6, day: 8 }; // June 8, 2002
  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Live clock in the status bar ----------
  function updateClock() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var ampm = h >= 12 ? "PM" : "AM";
    h = h % 12; if (h === 0) h = 12;
    var mm = m < 10 ? "0" + m : "" + m;
    document.getElementById("sb-time").textContent = h + ":" + mm + " " + ampm;
  }
  updateClock();
  setInterval(updateClock, 10000);

  // ---------- Compute age ----------
  function computeAge() {
    var now = new Date();
    var age = now.getFullYear() - BIRTHDAY.year;
    var hadBirthday =
      (now.getMonth() + 1 > BIRTHDAY.month) ||
      (now.getMonth() + 1 === BIRTHDAY.month && now.getDate() >= BIRTHDAY.day);
    if (!hadBirthday) age -= 1;
    return age;
  }
  function isBirthdayToday() {
    var now = new Date();
    return (now.getMonth() + 1 === BIRTHDAY.month) && (now.getDate() === BIRTHDAY.day);
  }
  var currentAge = computeAge();
  document.getElementById("age-value").textContent = currentAge;

  // ---------- Optional headshot ----------
  var hs = document.getElementById("headshot");
  hs.onload = function () {
    hs.style.display = "block";
    document.getElementById("initials").style.display = "none";
  };
  hs.onerror = function () { hs.style.display = "none"; };
  hs.src = "assets/headshot.jpg";

  // ---------- Toast ----------
  var toastEl = document.getElementById("toast");
  var toastTimer = null;
  function showToast(html) {
    toastEl.innerHTML = html;
    toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 5200);
  }

  // ---------- Confetti (vanilla canvas) ----------
  var canvas = document.getElementById("confetti");
  var ctx = canvas.getContext("2d");
  var pieces = [];
  var rafId = null;
  var running = false;
  var COLORS = ["#ff3b30", "#ff9500", "#ffcc00", "#34c759", "#007aff", "#5856d6", "#ff2d55"];

  function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawn(count) {
    for (var i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * canvas.height * 0.4,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        vy: 2 + Math.random() * 3.5,
        vx: -1.5 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2,
        vr: -0.2 + Math.random() * 0.4,
        sway: Math.random() * Math.PI * 2
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = pieces.length - 1; i >= 0; i--) {
      var p = pieces[i];
      p.sway += 0.05;
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.sway) * 0.8;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      if (p.y - p.h > canvas.height) pieces.splice(i, 1);
    }
    if (pieces.length > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      running = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function celebrate() {
    var msg =
      '<span class="cake">&#127874;</span>' +
      "It's my birthday! I'm turning " + currentAge + " today. " +
      "Thanks for stopping by &#127881;";
    // On the actual birthday the computed age already reflects the new age.
    showToast(msg);

    if (reduceMotion) return;
    sizeCanvas();
    spawn(140);
    setTimeout(function () { spawn(80); }, 600);
    if (!running) { running = true; rafId = requestAnimationFrame(tick); }
  }

  window.addEventListener("resize", function () {
    if (running) sizeCanvas();
  });

  // ---------- Birthday only: make the Age cell celebratory on June 8 ----------
  // On every other day the Age cell is a plain, non-interactive row.
  if (isBirthdayToday()) {
    var ageCell = document.getElementById("age-cell");
    ageCell.classList.add("birthday-cell");
    ageCell.setAttribute("role", "button");
    ageCell.setAttribute("tabindex", "0");
    ageCell.setAttribute("aria-label", "It's my birthday - tap to celebrate");
    ageCell.addEventListener("click", function () {
      ageCell.classList.add("tapped");
      setTimeout(function () { ageCell.classList.remove("tapped"); }, 180);
      celebrate();
    });
    ageCell.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); celebrate(); }
    });
    // Auto-fire once on load on the real birthday.
    setTimeout(celebrate, 700);
  }

  // ---------- Dialog / focus management (drill-down screens + alert popups) ----------
  // Modern browsers expose the `inert` property; we use it so that everything
  // outside the open overlay is neither focusable nor exposed to assistive tech.
  // Keeping the closed overlays inert also keeps the off-screen drill-down links
  // out of the tab order.
  var screenEl = document.querySelector(".screen");
  var mainNavbar = document.querySelector("header.navbar");
  var mainContent = document.getElementById("main-content");
  var overlays = [
    document.getElementById("royalston-detail"),
    document.getElementById("a11y-detail"),
    document.getElementById("iupui-modal"),
    document.getElementById("france-modal")
  ].filter(Boolean);

  var activeOverlay = null;
  var lastFocused = null;

  function applyInert(active) {
    var bg = !!active; // background goes inert only while an overlay is open
    if (mainNavbar) mainNavbar.inert = bg;
    if (mainContent) mainContent.inert = bg;
    overlays.forEach(function (o) { o.inert = (o !== active); });
  }

  function getFocusable(container) {
    var sel = 'a[href], button:not([disabled]), input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var nodes = container.querySelectorAll(sel);
    var out = [];
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.offsetWidth || n.offsetHeight || n.getClientRects().length) out.push(n);
    }
    return out;
  }

  function openOverlay(overlay, focusTarget, scrollTop) {
    if (!overlay) return;
    lastFocused = document.activeElement;       // remember the trigger
    if (scrollTop) window.scrollTo(0, 0);
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    applyInert(overlay);
    activeOverlay = overlay;
    // The off-screen (translateX(100%)) panels make .screen horizontally scrollable;
    // focusing a control while a panel is still sliding in would scroll .screen sideways.
    // Reset any stray scroll and focus without triggering scroll-into-view.
    if (screenEl) screenEl.scrollLeft = 0;
    var target = focusTarget || getFocusable(overlay)[0] || overlay;
    if (target && target.focus) target.focus({ preventScroll: true });
  }

  function closeOverlay(overlay) {
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    applyInert(null);
    activeOverlay = null;
    if (lastFocused && lastFocused.focus) lastFocused.focus(); // return focus
    lastFocused = null;
  }

  function trapTab(e, container) {
    var f = getFocusable(container);
    if (!f.length) { e.preventDefault(); return; }
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first || !container.contains(document.activeElement)) {
        e.preventDefault(); last.focus();
      }
    } else {
      if (document.activeElement === last || !container.contains(document.activeElement)) {
        e.preventDefault(); first.focus();
      }
    }
  }

  // One key handler drives whichever overlay is open: Escape closes, Tab is trapped.
  document.addEventListener("keydown", function (e) {
    if (!activeOverlay) return;
    if (e.key === "Escape") { e.preventDefault(); closeOverlay(activeOverlay); }
    else if (e.key === "Tab") { trapTab(e, activeOverlay); }
  });

  // Drill-down screens (iOS push navigation): Royalston Square, Accessibility.
  function wireDetail(cellId, detailId, backId) {
    var cell = document.getElementById(cellId);
    var detail = document.getElementById(detailId);
    var back = document.getElementById(backId);
    if (cell && detail) {
      cell.addEventListener("click", function () { openOverlay(detail, back, true); });
    }
    if (back && detail) {
      back.addEventListener("click", function () { closeOverlay(detail); });
    }
  }
  wireDetail("royalston-cell", "royalston-detail", "royalston-back");
  wireDetail("a11y-cell", "a11y-detail", "a11y-back");

  // Alert-style popups (IUPUI, France Education International).
  function wireModal(cellId, modalId, closeId) {
    var cell = document.getElementById(cellId);
    var modal = document.getElementById(modalId);
    var closeBtn = document.getElementById(closeId);
    if (cell && modal) {
      cell.addEventListener("click", function () { openOverlay(modal, closeBtn); });
    }
    if (closeBtn && modal) {
      closeBtn.addEventListener("click", function () { closeOverlay(modal); });
    }
    if (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) closeOverlay(modal); // click the dimmed backdrop
      });
    }
  }
  wireModal("iupui-cell", "iupui-modal", "iupui-close");
  wireModal("france-cell", "france-modal", "france-close");

  // Default state: main UI active, every drill-down / popup inert and hidden.
  applyInert(null);

  // ---------- Favicon fallback (neutral rounded square if one fails) ----------
  var FAV_FALLBACK = "data:image/svg+xml," +
    "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E" +
    "%3Crect width='32' height='32' rx='6' fill='%23c2c8ce'/%3E%3C/svg%3E";
  var favs = document.querySelectorAll("img.fav");
  for (var f = 0; f < favs.length; f++) {
    favs[f].addEventListener("error", function () {
      if (this.src !== FAV_FALLBACK) { this.src = FAV_FALLBACK; }
    });
  }
})();
