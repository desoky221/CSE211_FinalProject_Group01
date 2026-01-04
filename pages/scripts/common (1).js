// File: scripts/common.js
// Shared JavaScript utilities used across all pages

document.addEventListener('DOMContentLoaded', () => {
  updateCopyrightYear();
  setActiveNavLink();
  enableSmoothScroll();
  secureExternalLinks();
});

/* Update copyright year automatically */
function updateCopyrightYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll('.copyright-year').forEach(el => {
    el.textContent = year;
  });
}

/* Highlight active navigation link */
function setActiveNavLink() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.navLink').forEach(link => {
    const linkPage = link.getAttribute('href');
    link.classList.toggle('active', linkPage === currentPage);
  });
}

/* Smooth scrolling for anchor links */
function enableSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* Add security attributes to external links */
function secureExternalLinks() {
  const host = location.hostname;

  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(host)) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });
}
