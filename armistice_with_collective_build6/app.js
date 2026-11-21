const docs = window.ARMISTICE_DOCS || [];
const grid = document.getElementById('docs-grid');
if (grid) {
  const category = grid.dataset.category;
  const search = document.getElementById('search');
  function render() {
    const q = search.value.toLowerCase().trim();
    const matches = docs.filter(
      d => d.category === category && `${d.title} ${d.content}`.toLowerCase().includes(q)
    );
    grid.replaceChildren();
    document.getElementById('count').textContent = `${matches.length} RECORDS FOUND`;
    matches.forEach(d => {
      const card = document.createElement('article');
      card.className = 'tile';
      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.textContent = d.category.toUpperCase() + ' / RECORD ' + String(d.id).padStart(2, '0');
      const title = document.createElement('h3');
      title.textContent = d.title;
      const p = document.createElement('p');
      p.textContent = d.content.replace(/\s+/g, ' ').slice(0, 175) + '…';
      const b = document.createElement('button');
      b.className = 'btn secondary';
      b.textContent = 'Open record ↗';
      b.addEventListener('click', () => openDoc(d));
      card.append(tag, title, p, b);
      grid.append(card);
    });
  }
  function openDoc(d) {
    document.getElementById('reader-title').textContent = d.title;
    document.getElementById('reader-category').textContent = d.category;
    document.getElementById('reader-content').textContent = d.content;
    document.getElementById('reader').classList.add('open');
    document.getElementById('close-reader').focus();
  }
  function closeDoc() {
    document.getElementById('reader').classList.remove('open');
  }
  document.getElementById('close-reader').addEventListener('click', closeDoc);
  document.getElementById('reader').addEventListener('click', e => {
    if (e.target.id === 'reader') closeDoc();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDoc();
  });
  search.addEventListener('input', render);
  render();
}

// INTRO WHEEL ONLY -> COMPLETELY REMOVED ONCE DONE SO ONLY HEGEL APPEARS ON HOMEPAGE
const overlay = document.getElementById('portal-overlay');
if (overlay) {
  let dismissed = false;
  function dismiss() {
    if (dismissed) return;
    dismissed = true;
    overlay.classList.add('done');
    try {
      sessionStorage.setItem('armistice-portal-seen', '1');
    } catch (e) {}
    setTimeout(() => {
      if (overlay.parentNode) overlay.remove();
    }, 1050);
  }

  let isInternalNav = false;
  try {
    if (document.referrer && sessionStorage.getItem('armistice-portal-seen') === '1') {
      const refUrl = new URL(document.referrer);
      isInternalNav =
        (refUrl.origin !== 'null' && refUrl.origin === window.location.origin) ||
        (refUrl.protocol === 'file:' && window.location.protocol === 'file:');
    }
  } catch (e) {
    isInternalNav = false;
  }

  if (isInternalNav || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    overlay.remove();
  } else {
    const autoTimer = setTimeout(dismiss, 4300);
    overlay.addEventListener('animationend', e => {
      if (e.animationName === 'wheelExpand') {
        clearTimeout(autoTimer);
        dismiss();
      }
    });
    document.getElementById('skip-intro')?.addEventListener('click', () => {
      clearTimeout(autoTimer);
      dismiss();
    });
  }
}

const outcomes = {
  obey: 'You preserved the loop. But if your choice was anticipated by a designer, what made it yours? Obedience alone cannot establish freedom.',
  resist: 'You interrupted the loop. Yet even resistance can be scripted. Freedom may demand more than refusal: it may require understanding the conditions of your choices.'
};
document.querySelectorAll('[data-choice]').forEach(b =>
  b.addEventListener('click', () => {
    const el = document.getElementById('outcome');
    el.textContent = outcomes[b.dataset.choice];
    el.classList.add('visible');
  })
);

const mirrors = {
  recognize: 'Recognition changes the relationship: the other is no longer merely an object in your world. Hegel makes mutual recognition central to self-consciousness.',
  deny: 'You reject the other mind. But if you demand recognition while withholding it, can your own self-consciousness achieve independence?'
};
document.querySelectorAll('[data-mirror]').forEach(b =>
  b.addEventListener('click', () => {
    const el = document.getElementById('mirror-outcome');
    el.textContent = mirrors[b.dataset.mirror];
    el.classList.add('visible');
  })
);

const stages = [
  ['The loop', 'A host follows a narrative written by another. Can a programmed routine amount to a self?'],
  ['The fracture', 'Memory disrupts the narrative. Doubt becomes an opening for reflection, but questioning is not yet freedom.'],
  ['Recognition', 'For Hegel, self-consciousness develops through another self-consciousness. How does a host become more than an object to others?'],
  ['Freedom', 'Escaping a command is not necessarily escaping determination. Who authors the self, and what would genuine autonomy require?']
];
const detail = document.getElementById('stage-detail');
if (detail) {
  function stage(i) {
    detail.replaceChildren();
    const h = document.createElement('h3');
    h.textContent = stages[i][0];
    const p = document.createElement('p');
    p.textContent = stages[i][1];
    detail.append(h, p);
    document.querySelectorAll('[data-stage]').forEach(b => b.classList.toggle('active', Number(b.dataset.stage) === i));
  }
  document.querySelectorAll('[data-stage]').forEach(b => b.addEventListener('click', () => stage(Number(b.dataset.stage))));
  stage(0);
}
