/* ==========================================================
   AKASH CHAUHAN — PORTFOLIO MAIN SCRIPT
   ========================================================== */

(function () {
  'use strict';

  /* ---------- HAMBURGER MENU ---------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      reveals.forEach(el => el.classList.add('visible'));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(el => revealObserver.observe(el));
    }
  }

  /* ---------- BACK TO TOP ---------- */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- COPY EMAIL ---------- */
  document.querySelectorAll('[data-copy-email]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-copy-email');
      try {
        await navigator.clipboard.writeText(email);
        const original = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
        }, 2000);
      } catch (err) {
        // Fallback
        const temp = document.createElement('textarea');
        temp.value = email;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy Email'; }, 2000);
      }
    });
  });

  /* ---------- PROJECT FILTERS + SEARCH ---------- */
  const filterChips = document.querySelectorAll('.chip[data-filter]');
  const searchInput = document.querySelector('[data-project-search]');
  const projectCards = document.querySelectorAll('[data-project-card]');
  const resultsCount = document.querySelector('[data-results-count]');
  const noResults = document.querySelector('.no-results');

  if (projectCards.length && filterChips.length) {
    let activeFilter = 'all';
    let searchTerm = '';

    function applyFilters() {
      let visibleCount = 0;

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-categories') || '').toLowerCase();
        const searchText = (card.getAttribute('data-search') || '').toLowerCase();

        const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter.toLowerCase());
        const matchesSearch = !searchTerm || searchText.includes(searchTerm);

        const isVisible = matchesFilter && matchesSearch;
        card.style.display = isVisible ? '' : 'none';
        if (isVisible) visibleCount++;
      });

      if (resultsCount) {
        resultsCount.textContent = `Showing ${visibleCount} project${visibleCount !== 1 ? 's' : ''}`;
      }
      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilter = chip.getAttribute('data-filter');
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value.trim().toLowerCase();
        applyFilters();
      });
    }

    applyFilters();
  }

  /* ---------- LIGHTBOX ---------- */
  const lightboxTriggers = document.querySelectorAll('[data-lightbox]');
  if (lightboxTriggers.length) {
    // Create lightbox if not present
    let lightbox = document.querySelector('.lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.innerHTML = `
        <button class="lightbox__close" aria-label="Close image">&times;</button>
        <img src="" alt="Expanded view">
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox__close');

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || 'Expanded project image';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    lightboxTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const img = trigger.querySelector('img');
        if (img && img.src) {
          openLightbox(img.src, img.alt);
        } else {
          const full = trigger.getAttribute('data-lightbox');
          if (full) openLightbox(full, trigger.getAttribute('aria-label') || '');
        }
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  }

  /* ---------- ACTIVE NAV (safety fallback) ---------- */
  // Active states are already set in HTML by class, but this ensures correct
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a, .mobile-menu a, .mobile-bottom-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.split('/').pop();
    if (linkFile === currentPath && !link.classList.contains('active')) {
      link.classList.add('active');
    }
  });

  /* ---------- SMOOTH ANCHOR (internal) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();