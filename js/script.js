// ==========================================================================
// Panchhi Chems — Global Script
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
    document.querySelectorAll('.main-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* ---------- Header shadow / back-to-top on scroll ---------- */
  var backTop = document.querySelector('.back-top');
  window.addEventListener('scroll', function () {
    if (backTop) {
      if (window.scrollY > 480) backTop.classList.add('show');
      else backTop.classList.remove('show');
    }
  });
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Products: search ---------- */
  var searchInput = document.getElementById('productSearch');
  var productChips = document.querySelectorAll('.product-chip');
  var noResults = document.getElementById('noResults');

  function applyFilters() {
    var query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    var anyVisible = false;

    productChips.forEach(function (chip) {
      var name = chip.dataset.name || '';
      var show = name.indexOf(query) !== -1;
      chip.hidden = !show;
      if (show) anyVisible = true;
    });

    if (noResults) noResults.classList.toggle('show', !anyVisible);
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);

  /* ---------- Contact form (Web3Forms AJAX submit) ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    var msgBox = document.getElementById('formMsg');
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var formData = new FormData(form);
      var payload = Object.fromEntries(formData);

      submitBtn.disabled = true;
      var originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          msgBox.classList.remove('error', 'success');
          if (data.success) {
            msgBox.classList.add('success', 'show');
            msgBox.textContent = "Thank you! Your message has been sent successfully. Our team will get back to you shortly.";
            form.reset();
          } else {
            msgBox.classList.add('error', 'show');
            msgBox.textContent = "Something went wrong while sending your message. Please try again or email us directly.";
          }
        })
        .catch(function () {
          msgBox.classList.remove('success');
          msgBox.classList.add('error', 'show');
          msgBox.textContent = "Network error. Please check your connection and try again.";
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  }

});
