/* updated interactions:
   - header fixed
   - global smooth scroll (accounts for header)
   - active section highlight
   - accordion (single open)
   - small parallax
   - gallery modal (unchanged behavior)
   - about/products entrance animations (left/right)
   - contact form validation
   - language switching with RTL support
*/
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const headerHeight = header ? header.offsetHeight : 72;
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Language switching functionality
  let currentLang = "en";

  function switchLanguage(lang) {
    if (lang === currentLang) return;

    currentLang = lang;

    // Update HTML direction attribute
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;

    // Update language switcher buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    // Update all translatable elements
    document.querySelectorAll("[data-key]").forEach((element) => {
      const key = element.dataset.key;
      if (
        window.translations &&
        window.translations[lang] &&
        window.translations[lang][key]
      ) {
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.placeholder = window.translations[lang][key];
        } else {
          element.textContent = window.translations[lang][key];
        }
      }
    });

    // Store language preference
    localStorage.setItem("preferredLang", lang);
  }

  // Initialize language
  const savedLang = localStorage.getItem("preferredLang") || "en";
  switchLanguage(savedLang);

  // Language switcher event listeners
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchLanguage(btn.dataset.lang);
    });
  });

  // nav toggle
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  navToggle &&
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

  // universal smooth scroll for all in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      navLinks.classList.remove("open");
      const top = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 12
      );
      window.scrollTo({ top, behavior: "smooth" });
      // update active class immediately
      document
        .querySelectorAll(".nav-link")
        .forEach((n) => n.classList.remove("active"));
      if (a.classList.contains("nav-link")) a.classList.add("active");
    });
  });

  // Active section indicator using IntersectionObserver
  const sections = document.querySelectorAll("section[id]");
  const navLinksList = Array.from(document.querySelectorAll(".nav-link"));
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinksList.forEach((n) =>
            n.classList.toggle("active", n.getAttribute("href") === `#${id}`)
          );
        }
      });
    },
    { threshold: 0.45 }
  );
  sections.forEach((s) => obs.observe(s));

  // reveal animations
  const animables = document.querySelectorAll("[data-animate]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          // stagger children
          if (e.target.getAttribute("data-animate") === "stagger-up") {
            Array.from(e.target.children).forEach(
              (c, i) => (c.style.transitionDelay = i * 90 + "ms")
            );
          }
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  animables.forEach((n) => io.observe(n));

  // accordion: only one open at a time
  const accRoot = document.getElementById("homeAccordion");
  if (accRoot) {
    const toggles = accRoot.querySelectorAll(".acc-toggle");
    toggles.forEach((t) =>
      t.addEventListener("click", () => {
        const panel = t.nextElementSibling;
        const expanded = t.getAttribute("aria-expanded") === "true";
        // close all
        toggles.forEach((tt) => {
          tt.setAttribute("aria-expanded", "false");
          if (tt.nextElementSibling) tt.nextElementSibling.hidden = true;
          const chev = tt.querySelector(".acc-chev");
          if (chev) chev.style.transform = "";
        });
        // open clicked if it was closed
        if (!expanded) {
          t.setAttribute("aria-expanded", "true");
          if (panel) panel.hidden = false;
          const chev = t.querySelector(".acc-chev");
          if (chev) chev.style.transform = "rotate(90deg)";
        }
      })
    );
  }

  // hero parallax small effect (light)
  const heroParallax = document.getElementById("heroParallax");
  if (heroParallax) {
    window.addEventListener(
      "scroll",
      () => {
        const rect = heroParallax.getBoundingClientRect();
        const pct = Math.max(
          Math.min(
            (window.innerHeight - rect.top) /
              (window.innerHeight + rect.height),
            1
          ),
          -1
        );
        const c1 = heroParallax.querySelector(".card-1");
        const c2 = heroParallax.querySelector(".card-2");
        if (c1) c1.style.transform = `translateY(${pct * -8}px) rotate(-6deg)`;
        if (c2) c2.style.transform = `translateY(${pct * 8}px) rotate(6deg)`;
      },
      { passive: true }
    );
  }

  // GALLERY data (same placeholders) + modal logic
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=70&auto=format&fit=crop",
      caption: "Certificate A",
      tag: "certs",
    },
    {
      src: "https://images.unsplash.com/photo-1581091870622-3d06b1c3c9e0?w=1200&q=70&auto=format&fit=crop",
      caption: "Certificate B",
      tag: "certs",
    },
    {
      src: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200&q=70&auto=format&fit=crop",
      caption: "Certificate C",
      tag: "certs",
    },
    {
      src: "https://images.unsplash.com/photo-1543165799-6e7aa49d12e5?w=1200&q=70&auto=format&fit=crop",
      caption: "Product 1",
      tag: "products",
    },
    {
      src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=70&auto=format&fit=crop",
      caption: "Product 2",
      tag: "products",
    },
    {
      src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=70&auto=format&fit=crop",
      caption: "Product 3",
      tag: "products",
    },
    {
      src: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=1200&q=70&auto=format&fit=crop",
      caption: "Product 4",
      tag: "products",
    },
    {
      src: "https://images.unsplash.com/photo-1496284045406-d5e0b6c7d5a0?w=1200&q=70&auto=format&fit=crop",
      caption: "Product 5",
      tag: "products",
    },
  ];
  const galleryGrid = document.getElementById("galleryGrid");
  function renderGallery(filter = "certs") {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = "";
    galleryImages
      .filter((i) => i.tag === filter)
      .forEach((img, idx) => {
        const item = document.createElement("div");
        item.className = "gallery-item";
        item.setAttribute("data-index", idx);
        item.innerHTML = `<img src="${img.src}" alt="${img.caption}" loading="lazy">`;
        item.addEventListener("click", () => openModal(filter, idx));
        galleryGrid.appendChild(item);
      });
  }
  renderGallery("certs");
  document.querySelectorAll(".gallery-controls .tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".gallery-controls .tab")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderGallery(btn.getAttribute("data-filter"));
    });
  });

  // modal carousel
  const modal = document.getElementById("galleryModal");
  const modalImg = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");
  const modalClose = document.getElementById("modalClose");
  const modalPrev = document.getElementById("modalPrev");
  const modalNext = document.getElementById("modalNext");
  let currentList = [],
    currentIndex = 0;

  function openModal(filter, idx) {
    currentList = galleryImages.filter((i) => i.tag === filter);
    currentIndex = idx;
    showImage();
    modal && modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => modal && modal.focus(), 80);
  }
  function closeModal() {
    modal && modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function showImage() {
    const item = currentList[currentIndex];
    if (!item) return;
    modalImg.src = item.src;
    modalImg.alt = item.caption || "";
    modalCaption.textContent = `${currentIndex + 1} / ${currentList.length} — ${
      item.caption || ""
    }`;
  }
  function nextImage(dir = 1) {
    currentIndex =
      (currentIndex + dir + currentList.length) % currentList.length;
    showImage();
  }
  modalClose && modalClose.addEventListener("click", closeModal);
  modalPrev && modalPrev.addEventListener("click", () => nextImage(-1));
  modalNext && modalNext.addEventListener("click", () => nextImage(1));
  document.addEventListener("keydown", (e) => {
    if (!modal || modal.getAttribute("aria-hidden") === "true") return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") nextImage(-1);
    if (e.key === "ArrowRight") nextImage(1);
  });
  // touch swipe
  let touchStartX = 0;
  const modalBody = document.getElementById("modalBody");
  if (modalBody) {
    modalBody.addEventListener(
      "touchstart",
      (e) => (touchStartX = e.changedTouches[0].clientX)
    );
    modalBody.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) nextImage(dx < 0 ? 1 : -1);
    });
  }
  modal &&
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

  // contact form basic validation
  const form = document.getElementById("contactForm");
  const formAlert = document.getElementById("formAlert");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector('[name="email"]');
      const msg = form.querySelector('[name="message"]');
      if (!email.value.trim() || !msg.value.trim()) {
        if (formAlert) {
          formAlert.hidden = false;
          formAlert.textContent =
            currentLang === "en"
              ? "Please fill required fields."
              : "يرجى ملء الحقول المطلوبة.";
          formAlert.style.color = "#b00020";
        }
        return;
      }
      if (formAlert) {
        formAlert.hidden = false;
        formAlert.textContent =
          currentLang === "en"
            ? "Message sent (stub)."
            : "تم إرسال الرسالة (تجريبي).";
        formAlert.style.color = "";
      }
      form.reset();
    });
  }

  // keep nav active on load if anchor in URL
  const hash = location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      const top = Math.max(
        0,
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 12
      );
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
});
