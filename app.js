(function () {
  // часы работы: [открытие, закрытие] в часах, Пн = 0
  var HOURS = [[11, 23], [11, 23], [11, 23], [11, 23], [11, 23], [11, 23], [11, 23]];
  var DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

  // --- menu ---
  var body = document.getElementById('menuBody');
  var tabs = document.querySelectorAll('.tab');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(p) { return p.split(' / ').map(function (v) { return v.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }).join(' / ') + ' ₽'; }
  function render(key) {
    body.innerHTML = window.MATI_MENU[key].map(function (g) {
      return '<section class="mgroup"><h3>' + esc(g.title) + (g.note ? ' <small>' + esc(g.note) + '</small>' : '') + '</h3><ul>' +
        g.items.map(function (it) {
          var sub = [it[3], it[2]].filter(Boolean).join(' · ');
          return '<li><div class="mrow"><span>' + esc(it[0]) + '</span><i aria-hidden="true"></i><b>' + fmt(it[1]) + '</b></div>' +
            (sub ? '<small class="mdesc">' + esc(sub) + '</small>' : '') + '</li>';
        }).join('') + '</ul></section>';
    }).join('');
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      t.classList.add('is-active'); t.setAttribute('aria-selected', 'true');
      render(t.dataset.tab);
    });
  });
  render('dough');

  // --- day ruler: open / closed (Moscow time) ---
  function hh(h) { return (h < 10 ? '0' : '') + h + ':00'; }
  function left(mins) {
    var h = Math.floor(mins / 60), m = Math.round(mins % 60);
    if (m === 60) { h++; m = 0; }
    return (h ? h + ' ч ' : '') + (m ? m + ' мин' : '').trim();
  }
  var msk = new Date(Date.now() + (new Date().getTimezoneOffset() + 180) * 60000);
  var d = (msk.getDay() + 6) % 7, h = msk.getHours() + msk.getMinutes() / 60;
  var cur = HOURS[d], open = h >= cur[0] && h < cur[1];
  var pct = Math.max(0, Math.min(1, (h - cur[0]) / (cur[1] - cur[0]))) * 100;
  var day = document.getElementById('day');
  day.classList.add(open ? 'is-open' : 'is-closed');
  document.getElementById('dayFill').style.width = pct + '%';
  document.getElementById('dayNow').style.left = pct + '%';
  if (open) {
    document.getElementById('dayState').textContent = 'Сейчас открыто';
    document.getElementById('dayLeft').textContent = 'кухня работает ещё ' + left((cur[1] - h) * 60);
  } else {
    document.getElementById('dayState').textContent = 'Сейчас закрыто';
    document.getElementById('dayLeft').textContent = h < cur[0] ? 'откроемся сегодня в ' + hh(cur[0]) : 'ждём завтра с ' + hh(HOURS[(d + 1) % 7][0]);
  }

  document.getElementById('week').innerHTML = DAYS.map(function (n, i) {
    return '<li' + (i === d ? ' class="is-today"' : '') + '><span>' + n + '</span><span>' + hh(HOURS[i][0]) + '–' + hh(HOURS[i][1]) + '</span></li>';
  }).join('');

  // --- header ---
  var top = document.querySelector('.top');
  var onScroll = function () { top.classList.toggle('is-solid', window.scrollY > 30); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var o = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', o);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { document.body.classList.remove('nav-open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  // --- reveal ---
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
