/* ==========================================================================
   Burks Roofing — main scripts
   - mobile navigation
   - sticky header shadow
   - scroll reveal
   - contact form: hidden _page field, fetch submission, ?submitted=1 notice
   ========================================================================== */
(function () {
  'use strict';

  var FORM_ENDPOINT = 'https://vision.leadrai.com/api/forms/e5b75e314bdad658de4c453efc765a73';

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---------- Hidden _page fields (so visitors return to this page) ---------- */
  function syncPageFields() {
    var href = window.location.href;
    document.querySelectorAll('input[name="_page"]').forEach(function (input) {
      input.value = href;
    });
  }
  syncPageFields();
  window.addEventListener('pageshow', syncPageFields);

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('primary-nav');

  function closeNav() {
    if (!nav || !navToggle) { return; }
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.tagName === 'A' && window.innerWidth <= 960) { closeNav(); }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { closeNav(); }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) { closeNav(); }
    });
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (!header) { return; }
    if (window.scrollY > 8) { header.classList.add('is-stuck'); }
    else { header.classList.remove('is-stuck'); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.section__head, .card, .quote, .trustbar__item, .projects__item, .about__media, .about__content, .contact__info, .contact__form-wrap'
  );
  var revealList = Array.prototype.slice.call(revealTargets);
  revealList.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealList.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + 'ms';
      observer.observe(el);
    });
  } else {
    revealList.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Success notice (?submitted=1 or fetch response) ---------- */
  var successBox = document.getElementById('form-success');
  var form = document.getElementById('contact-form');

  function showSuccess() {
    if (!successBox) { return; }
    successBox.hidden = false;
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get('submitted') === '1' && successBox) {
    showSuccess();
    if (form) { form.reset(); }
    // Clean the parameter from the address bar without reloading the page.
    if (window.history && window.history.replaceState) {
      params.delete('submitted');
      var qs = params.toString();
      window.history.replaceState({}, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
    }
  }

  /* ---------- Contact form: inline validation + fetch submission ---------- */
  function markInvalid(field, invalid) {
    if (!field) { return; }
    field.classList.toggle('is-invalid', invalid);
  }

  function validate() {
    if (!form) { return false; }
    var ok = true;
    var required = form.querySelectorAll('[required]');
    required.forEach(function (field) {
      var valid = field.checkValidity() && String(field.value).trim() !== '';
      markInvalid(field, !valid);
      if (!valid) { ok = false; }
    });
    return ok;
  }

  if (form) {
    form.addEventListener('input', function (event) {
      if (event.target.classList && event.target.classList.contains('is-invalid')) {
        markInvalid(event.target, false);
      }
    });

    form.addEventListener('submit', function (event) {
      // Let the browser submit normally when fetch is unavailable.
      if (typeof window.fetch !== 'function' || !window.FormData) { return; }

      if (!validate()) {
        event.preventDefault();
        var firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      event.preventDefault();
      syncPageFields();

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      var formData = new FormData(form);
      // Ensure _page is part of the JSON body as well.
      formData.set('_page', window.location.href);

      var payload = {};
      formData.forEach(function (value, key) { payload[key] = value; });

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) { throw new Error('Request failed: ' + response.status); }
          showSuccess();
          form.reset();
        })
        .catch(function () {
          // Fall back to a plain form POST so the message still reaches us.
          HTMLFormElement.prototype.submit.call(form);
        })
        .then(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
        });
    });
  }
})();