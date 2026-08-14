(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     Footer year
  ---------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     Navbar background on scroll
  ---------------------------------------------------------- */
  var navbar = document.getElementById("navbar");
  function onScroll() {
    if (window.scrollY > 12) {
      navbar.classList.add("is-scrolled");
    } else {
      navbar.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------
     Mobile drawer
  ---------------------------------------------------------- */
  var menuToggle = document.getElementById("menuToggle");
  var mobileDrawer = document.getElementById("mobileDrawer");

  function closeDrawer() {
    mobileDrawer.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  function toggleDrawer() {
    var isOpen = mobileDrawer.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("no-scroll", isOpen);
  }

  menuToggle.addEventListener("click", toggleDrawer);

  mobileDrawer.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeDrawer);
  });

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  /* ----------------------------------------------------------
     Hero style selector (visual-only theming of the frame)
  ---------------------------------------------------------- */
  var styleDots = document.querySelectorAll(".style-dot");
  var heroFrame = document.querySelector(".hero-visual-frame");

  var frameStyles = {
    dark: "linear-gradient(155deg, #241c3c 0%, #150f24 45%, #0c0916 100%)",
    white: "linear-gradient(155deg, #f4f2fb 0%, #dcd7ef 45%, #cfc9e6 100%)",
    lime: "linear-gradient(155deg, #2a3a12 0%, #1c2a0c 45%, #0f1806 100%)"
  };

  styleDots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      styleDots.forEach(function (d) {
        d.classList.remove("is-active");
        d.setAttribute("aria-pressed", "false");
      });
      dot.classList.add("is-active");
      dot.setAttribute("aria-pressed", "true");

      var styleKey = dot.getAttribute("data-style");
      if (heroFrame && frameStyles[styleKey]) {
        heroFrame.style.background = frameStyles[styleKey];
      }
    });
  });

  /* ----------------------------------------------------------
     Scroll reveal
  ---------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     Active nav link on scroll
  ---------------------------------------------------------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinkMap = {};
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    var id = link.getAttribute("href").replace("#", "");
    navLinkMap[id] = link;
  });

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = navLinkMap[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            Object.keys(navLinkMap).forEach(function (id) {
              navLinkMap[id].classList.remove("active");
            });
            link.classList.add("active");
          }
        });
      },
      { threshold: 0.3, rootMargin: "-30% 0px -55% 0px" }
    );

    sections.forEach(function (section) {
      if (navLinkMap[section.id]) navObserver.observe(section);
    });
  }
})();