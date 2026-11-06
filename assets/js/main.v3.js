/* ИП Чушев А. Г.: меню-панель, фильтр работ, заявка */
var WA_BASE = 'https://wa.me/375336012494';

document.addEventListener('DOMContentLoaded', function () {
  initDrawer();
  initWorks();
  initForm();
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

/* Полноэкранное меню: блокировка прокрутки, закрытие по ссылке, фону и Escape */
function initDrawer() {
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  if (!burger || !drawer) return;
  var lastFocus = null;

  function open() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-locked');
    var first = drawer.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  }

  function close() {
    drawer.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  var closeBtn = document.getElementById('drawer-close');
  if (closeBtn) closeBtn.addEventListener('click', close);

  burger.addEventListener('click', function () {
    if (drawer.hidden) open(); else close();
  });

  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a')) { close(); return; }
    if (!e.target.closest('.drawer__inner')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !drawer.hidden) close();
    if (e.key === 'Tab' && !drawer.hidden) {
      var items = drawer.querySelectorAll('a, button');
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 1180 && !drawer.hidden) close();
  });
}

/* Фильтр работ */
function initWorks() {
  var grid = document.getElementById('works-grid');
  if (!grid) return;
  var chips = [].slice.call(document.querySelectorAll('.chip'));
  var items = [].slice.call(grid.querySelectorAll('.work'));
  var count = document.getElementById('works-count');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var cat = chip.getAttribute('data-cat');
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-pressed', String(on));
      });
      var shown = 0;
      items.forEach(function (it) {
        var ok = cat === 'all' || it.getAttribute('data-cat') === cat;
        it.hidden = !ok;
        if (ok) shown++;
      });
      if (count) count.textContent = shown + ' ' + (shown === 1 ? 'работа' : shown < 5 ? 'работы' : 'работ');
    });
  });
}

/* Заявка: собираем текст и открываем WhatsApp */
function initForm() {
  var form = document.getElementById('lead-form');
  if (!form) return;
  var name = document.getElementById('f-name');
  var phone = document.getElementById('f-phone');
  var what = document.getElementById('f-what');
  var note = document.getElementById('f-note');
  var ok = document.getElementById('form-ok');
  var pre = document.getElementById('order-text');
  var link = document.getElementById('ok-wa');

  [name, phone].forEach(function (el) {
    el.addEventListener('input', function () { el.setCustomValidity(''); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!name.value.trim()) { name.setCustomValidity('Как к вам обращаться?'); name.reportValidity(); return; }
    if (!phone.value.trim()) { phone.setCustomValidity('Нужен номер для связи'); phone.reportValidity(); return; }

    var text = 'Заявка с сайта\nИмя: ' + name.value.trim() +
      '\nТелефон: ' + phone.value.trim() +
      '\nИнтересует: ' + what.value +
      (note.value.trim() ? '\nДетали: ' + note.value.trim() : '');

    var url = WA_BASE + '?text=' + encodeURIComponent(text);
    pre.textContent = text;
    link.setAttribute('href', url);
    form.hidden = true;
    ok.hidden = false;
    window.open(url, '_blank');
  });
}
