// Language toggle, sticky-nav border and scroll reveal.
// Chinese is written in the HTML. English lives in data-en (inner HTML), data-en-alt and data-en-label.
(function () {
  var KEY = 'iteration-lang';
  var root = document.documentElement;
  var TARGETS = [
    { en: 'en', zh: 'zh', attr: null },
    { en: 'enAlt', zh: 'zhAlt', attr: 'alt' },
    { en: 'enLabel', zh: 'zhLabel', attr: 'aria-label' },
  ];

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function store(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }
  function initialLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'zh') return q;
    var s = stored();
    if (s === 'en' || s === 'zh') return s;
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'zh';
    return /^zh/i.test(nav) ? 'zh' : 'en';
  }

  function apply(lang) {
    root.lang = lang === 'en' ? 'en' : 'zh-Hant-TW';
    root.dataset.lang = lang;
    TARGETS.forEach(function (t) {
      var selector = '[data-' + t.en.replace(/[A-Z]/g, function (c) { return '-' + c.toLowerCase(); }) + ']';
      document.querySelectorAll(selector).forEach(function (el) {
        if (el.dataset[t.zh] === undefined) {
          el.dataset[t.zh] = t.attr ? el.getAttribute(t.attr) || '' : el.innerHTML;
        }
        var value = lang === 'en' ? el.dataset[t.en] : el.dataset[t.zh];
        if (t.attr) el.setAttribute(t.attr, value);
        else if (el.tagName === 'TITLE') document.title = value;
        else el.innerHTML = value;
      });
    });
    document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
      btn.textContent = lang === 'en' ? '中文' : 'EN';
      btn.setAttribute('aria-label', lang === 'en' ? '切換成中文' : 'Switch to English');
    });
  }

  var current = initialLang();
  apply(current);
  document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      current = current === 'en' ? 'zh' : 'en';
      store(current);
      apply(current);
    });
  });

  var nav = document.querySelector('.nav');
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  if (nav) {
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px';
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      nav.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  reveals.forEach(function (el) { io.observe(el); });
})();
