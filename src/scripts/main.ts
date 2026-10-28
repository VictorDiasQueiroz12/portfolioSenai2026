const menu = document.querySelector<HTMLButtonElement>('#menu-toggle');
const nav = document.querySelector<HTMLElement>('#navigation');
function closeMenu() {
  menu?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-label', 'Abrir menu');
  nav?.classList.remove('open');
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  nav?.classList.toggle('open', open);
});
nav?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a')) closeMenu();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav?.classList.contains('open')) {
    closeMenu();
    menu?.focus();
  }
});
const themeButton = document.querySelector<HTMLButtonElement>('#theme-toggle');
const pref = matchMedia('(prefers-color-scheme: dark)');
function themeLabel() {
  themeButton?.setAttribute(
    'aria-label',
    document.documentElement.dataset.theme === 'dark'
      ? 'Ativar tema claro'
      : 'Ativar tema escuro',
  );
}
themeLabel();
themeButton?.addEventListener('click', () => {
  const next =
    document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {}
  themeLabel();
});
pref.addEventListener('change', () => {
  try {
    if (!localStorage.getItem('theme')) {
      document.documentElement.dataset.theme = pref.matches ? 'dark' : 'light';
      themeLabel();
    }
  } catch {}
});
const sectionObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        document.querySelectorAll('[data-section]').forEach((a) => {
          if (a.getAttribute('data-section') === entry.target.id)
            a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      }
    }
  },
  { rootMargin: '-15% 0px -65% 0px' },
);
document
  .querySelectorAll('main section[id]')
  .forEach((s) => sectionObserver.observe(s));
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          reveal.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll('.reveal').forEach((el) => {
    el.classList.add('will-reveal');
    reveal.observe(el);
  });
}
const cards = [...document.querySelectorAll<HTMLElement>('.project-card')];
const search = document.querySelector<HTMLInputElement>('#project-search');
const trimester = document.querySelector<HTMLSelectElement>('#trimester');
let category = 'all';
const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
function filter() {
  let count = 0;
  cards.forEach((card) => {
    const show =
      (category === 'all' || card.dataset.category === category) &&
      (!trimester ||
        trimester.value === 'all' ||
        card.dataset.trimester === trimester.value) &&
      normalize(card.dataset.search || '').includes(
        normalize(search?.value || ''),
      );
    card.hidden = !show;
    if (show) count++;
  });
  const results = document.querySelector('#results-count');
  if (results)
    results.textContent = count + ' registro' + (count === 1 ? '' : 's');
  const empty = document.querySelector<HTMLElement>('#no-results');
  if (empty) empty.hidden = count > 0;
}
document
  .querySelectorAll<HTMLButtonElement>('[data-filter]')
  .forEach((button) =>
    button.addEventListener('click', () => {
      category = button.dataset.filter!;
      document
        .querySelectorAll('[data-filter]')
        .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      filter();
    }),
  );
search?.addEventListener('input', filter);
trimester?.addEventListener('change', filter);
document.querySelectorAll<HTMLButtonElement>('.video-load').forEach((button) =>
  button.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = button.dataset.video!;
    iframe.title = button.dataset.title!;
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    button.replaceWith(iframe);
    iframe.focus();
  }),
);
