// ================================
// AERA / Motion & interactions
// Vanilla JS — без библиотек
// ================================

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Loader
window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelector(".page-loader")?.classList.add("is-hidden");
  }, reducedMotion ? 0 : 650);
});

// Header scroll state
const header = document.querySelector(".site-header");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 40);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

// Mobile menu
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

// Reveal on scroll
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const siblings = [...element.parentElement.querySelectorAll(".reveal")];
        const index = siblings.indexOf(element);

        element.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
        element.classList.add("is-visible");

        revealObserver.unobserve(element);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -7% 0px",
    }
  );

  revealItems.forEach((el) => revealObserver.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}

// Scroll effects (hero, bottle, textures, parallax)
const heroImage = document.querySelector(".hero-media img");
const motionSection = document.querySelector(".motion-section");
const motionBottle = document.querySelector(".motion-bottle");
const textureSection = document.querySelector(".texture-section");
const textureImage = document.querySelector(".texture-full img");
const parallaxItems = document.querySelectorAll(".parallax-item");

let ticking = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function viewportProgress(element) {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const total = window.innerHeight + rect.height;
  return clamp((window.innerHeight - rect.top) / total, 0, 1);
}

function updateScrollEffects() {
  if (reducedMotion) return;

  const y = window.scrollY;

  // hero zoom + slight vertical drift
  if (heroImage) {
    const heroProgress = clamp(y / window.innerHeight, 0, 1);
    const scale = 1.06 + heroProgress * 0.06;
    const translate = heroProgress * 34;
    heroImage.style.transform = `translate3d(0, ${translate}px, 0) scale(${scale})`;
  }

  // bottle scroll animation
  if (motionSection && motionBottle) {
    const p = viewportProgress(motionSection);
    const rotate = -10 + p * 26;
    const moveY = 80 - p * 150;
    const moveX = Math.sin(p * Math.PI) * 24;
    const scale = 0.88 + p * 0.22;

    motionBottle.style.transform =
      `translate3d(${moveX}px, ${moveY}px, 0) rotate(${rotate}deg) scale(${scale})`;
  }

  // full texture slow zoom
  if (textureSection && textureImage) {
    const p = viewportProgress(textureSection);
    textureImage.style.transform = `scale(${1.09 - p * 0.07}) translateY(${(p - .5) * 20}px)`;
  }

  // abstract texture parallax
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0);
    const rect = item.parentElement.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const offset = (window.innerHeight / 2 - center) * speed;
    item.style.transform = `translate3d(0, ${offset}px, 0)`;
  });

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  },
  { passive: true }
);

updateScrollEffects();

// Ingredient preview
const ingredientRows = document.querySelectorAll(".ingredient-row");
const ingredientPreview = document.querySelector(".ingredient-preview");
const ingredientPreviewImage = ingredientPreview?.querySelector("img");

ingredientRows.forEach((row) => {
  row.addEventListener("mouseenter", () => {
    const next = row.dataset.image;
    if (!next || !ingredientPreviewImage || !ingredientPreview) return;

    ingredientPreviewImage.src = next;
    ingredientPreview.classList.add("is-active");
  });

  row.addEventListener("mouseleave", () => {
    ingredientPreview?.classList.remove("is-active");
  });

  row.addEventListener("mousemove", (event) => {
    if (!ingredientPreview) return;

    // легкое следование за курсором, без прямого позиционирования под ним
    const x = event.clientX + 160;
    const y = event.clientY;
    ingredientPreview.style.left = `${clamp(x, 180, window.innerWidth - 180)}px`;
    ingredientPreview.style.top = `${clamp(y, 180, window.innerHeight - 180)}px`;
  });
});

// Newsletter demo
const newsletter = document.querySelector(".newsletter-form");

newsletter?.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = newsletter.querySelector('input[type="email"]');
  const message = newsletter.querySelector(".form-message");

  if (!email?.value.trim()) return;

  message.textContent = "Thank you — you’re on the AERA list.";
  newsletter.reset();
});

// Play button demo
document.querySelector(".play-button")?.addEventListener("click", () => {
  alert("Здесь можно открыть modal с твоим motion-видео AERA.");
});
