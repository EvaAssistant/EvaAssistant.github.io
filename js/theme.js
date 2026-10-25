// 25.10.2026 Claude-А: светлая / тёмная тема сайта. В светлой — фон «Аврора», как в панели Евы.
(function () {
  var KEY = 'eva_theme', root = document.documentElement;
  function sys() { try { return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; } catch (e) { return 'dark'; } }
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function swapImages(t) {                       // снимок панели: в светлой теме — светлый
    var ims = document.querySelectorAll('img[data-light]');
    for (var i = 0; i < ims.length; i++) {
      var im = ims[i]; if (!im.dataset.dark) im.dataset.dark = im.getAttribute('src');
      im.setAttribute('src', t === 'light' ? im.dataset.light : im.dataset.dark);
    }
  }
  function apply(t) {
    root.setAttribute('data-theme', t);
    var b = document.getElementById('themeBtn');
    if (b) { b.textContent = t === 'light' ? '🌙' : '☀'; b.title = (root.lang === 'ru' ? (t === 'light' ? 'Тёмная тема' : 'Светлая тема') : (t === 'light' ? 'Dark theme' : 'Light theme')); b.setAttribute('aria-label', b.title); }
    if (document.body) swapImages(t);
  }
  apply(saved() || sys());
  try { matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () { if (!saved()) apply(sys()); }); } catch (e) {}

  // ---- «Аврора»: те же облака и шёлковые ленты, что в eva_panel.html (светлый вариант) ----
  function aurora() {
    var c = document.createElement('canvas'); c.id = 'auroraBg'; c.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(c, document.body.firstChild);
    var x = c.getContext('2d'), W = 0, H = 0, D = 1, last = 0;
    var still = false; try { still = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    var R = [
      { y: .30, a: .16, f: 1.6, sp: .05, c1: [79, 208, 255], c2: [139, 123, 255], n: 34 },
      { y: .62, a: .2, f: 1.15, sp: -.04, c1: [255, 99, 209], c2: [139, 123, 255], n: 30 },
      { y: .85, a: .12, f: 2.1, sp: .03, c1: [53, 212, 154], c2: [79, 208, 255], n: 22 }];
    function size() { D = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight; c.width = Math.round(W * D); c.height = Math.round(H * D); last = 0; draw(performance.now(), true); }
    function glow(px, py, r, col, a) { var g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, 'rgba(' + col + ',' + a + ')'); g.addColorStop(1, 'rgba(' + col + ',0)'); x.fillStyle = g; x.fillRect(px - r, py - r, r * 2, r * 2); }
    function draw(now, force) {
      if (!force) requestAnimationFrame(draw);
      if (root.getAttribute('data-theme') !== 'light' || document.hidden) return;
      if (!force && (still || now - last < 50)) return;
      last = now; var t = still ? 0 : now / 1000;
      x.setTransform(D, 0, 0, D, 0, 0); x.fillStyle = '#f2f3fb'; x.fillRect(0, 0, W, H);
      var A = .55;
      glow(W * (.18 + .05 * Math.sin(t * .11)), H * (.25 + .06 * Math.cos(t * .09)), W * .42, '79,140,255', A);
      glow(W * (.82 + .05 * Math.cos(t * .08)), H * (.2 + .05 * Math.sin(t * .1)), W * .38, '255,99,209', A * .9);
      glow(W * (.55 + .06 * Math.sin(t * .07)), H * (.95 + .04 * Math.sin(t * .12)), W * .45, '53,212,200', A * .8);
      glow(W * (.45 + .04 * Math.cos(t * .13)), H * .5, W * .3, '139,123,255', A * .7);
      x.lineWidth = 1;
      for (var q = 0; q < R.length; q++) { var r = R[q];
        for (var k = 0; k < r.n; k++) { var u = k / (r.n - 1), off = (u - .5) * H * .09, cc = [0, 1, 2].map(function (i) { return Math.round(r.c1[i] + (r.c2[i] - r.c1[i]) * u); });
          x.strokeStyle = 'rgba(' + cc[0] + ',' + cc[1] + ',' + cc[2] + ',' + (.32 * (1 - Math.abs(u - .5) * 1.2)) + ')';
          x.beginPath();
          for (var px = -20; px <= W + 20; px += 14) { var p = px / W;
            var py = H * r.y + off * (1 + .6 * Math.sin(p * 3 + t * .3)) + Math.sin(p * Math.PI * r.f + t * r.sp * 6 + u * 1.2) * H * r.a + Math.sin(p * 9 + t * .5 + k * .1) * 6;
            px === -20 ? x.moveTo(px, py) : x.lineTo(px, py); }
          x.stroke(); } }
    }
    addEventListener('resize', size); size(); requestAnimationFrame(draw);
    return function () { last = 0; draw(performance.now(), true); };
  }

  document.addEventListener('DOMContentLoaded', function () {
    var redraw = aurora();
    var b = document.createElement('button');
    b.id = 'themeBtn'; b.className = 'theme-btn'; b.type = 'button';
    b.onclick = function () { var t = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'; try { localStorage.setItem(KEY, t); } catch (e) {} apply(t); redraw(); };
    document.body.appendChild(b); apply(root.getAttribute('data-theme'));
  });
})();
