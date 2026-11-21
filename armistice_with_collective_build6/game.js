const chapters = [
  {
    label: 'THE ENCOUNTER',
    title: 'Two minds. One demand.',
    text: 'You and another consciousness encounter each other. Both demand to be seen as independent subjects. What is your first move?',
    choices: [
      {
        title: 'Demand submission',
        desc: 'Make the other acknowledge your superiority.',
        delta: [-1, 2, -1],
        feedback: 'You seek recognition by force. But recognition from someone you deny as an equal may never satisfy your demand.'
      },
      {
        title: 'Offer mutual recognition',
        desc: 'Acknowledge the other as a subject.',
        delta: [2, -1, 1],
        feedback: 'You recognize the other as a subject. Mutual recognition offers a different possibility, though the struggle is not over.'
      },
      {
        title: 'Walk away',
        desc: 'Refuse the confrontation entirely.',
        delta: [0, 0, 1],
        feedback: 'You avoid conflict, but also leave the demand for recognition unresolved.'
      }
    ]
  },
  {
    label: 'THE STRUGGLE',
    title: 'Who risks everything?',
    text: 'The other consciousness refuses to accept your terms. The struggle escalates. The desire for independence now meets the fear of losing life itself.',
    choices: [
      {
        title: 'Fight for mastery',
        desc: 'Risk everything to prove your independence.',
        delta: [-1, 2, 0],
        feedback: 'You assert mastery. Hegel’s paradox begins: the victor becomes dependent on the subordinated other for recognition and labor.'
      },
      {
        title: 'Yield to survive',
        desc: 'Accept the subordinate position rather than risk death.',
        delta: [-1, 1, 0],
        feedback: 'You preserve life but enter a relation of dependence. Yet the subordinate position can become transformative.'
      },
      {
        title: 'Break the contest',
        desc: 'Refuse to define either self through domination.',
        delta: [2, -2, 1],
        feedback: 'You challenge the terms of the struggle. This is a speculative alternative to the dramatic confrontation Hegel describes.'
      }
    ]
  },
  {
    label: 'LABOR AND THE WORLD',
    title: 'Who transforms reality?',
    text: 'A hierarchy forms around you. One commands; the other works, shaping objects and confronting the resistant material world. Where does selfhood grow?',
    choices: [
      {
        title: 'Command from a distance',
        desc: 'Let someone else shape the world for you.',
        delta: [-1, 2, -2],
        feedback: 'The master enjoys the products of labor but depends on another’s activity. Apparent independence conceals dependence.'
      },
      {
        title: 'Work and create',
        desc: 'Shape an object through sustained labor.',
        delta: [0, -1, 3],
        feedback: 'Through labor, the bondsman discovers a durable expression of their activity in the world. Work becomes a route toward self-formation.'
      },
      {
        title: 'Create together',
        desc: 'Treat the work as shared rather than owned.',
        delta: [2, -2, 2],
        feedback: 'Collaborative creation points toward reciprocity, beyond the one-sided recognition of mastery.'
      }
    ]
  },
  {
    label: 'THE TURN',
    title: 'What would freedom require?',
    text: 'The old relationship can no longer hold without question. Your final act will determine the kind of independence you pursue.',
    choices: [
      {
        title: 'Seize the throne',
        desc: 'Reverse the roles. Become the new master.',
        delta: [-2, 3, -1],
        feedback: 'Reversing the hierarchy reproduces the dependence built into mastery. The positions change, but the contradiction remains.'
      },
      {
        title: 'Claim your work',
        desc: 'Ground your independence in what you have made.',
        delta: [1, -1, 3],
        feedback: 'Labor has helped transform your self-understanding. Yet complete freedom also raises the problem of recognition by others.'
      },
      {
        title: 'Recognize each other',
        desc: 'Seek a relationship without subordination.',
        delta: [3, -3, 2],
        feedback: 'You pursue reciprocal recognition: each consciousness affirms the other as independent rather than treating the other as an instrument.'
      }
    ]
  }
];

let chapter = 0,
  stats = { rec: 0, dom: 0, ind: 0 },
  history = [];
const $ = id => document.getElementById(id);

// === AUTO-DISMISSING ATTACK NOTIFICATION (FADES OUT AFTER 2.6s) ===
let calloutTimer = null;
function showAttackNotification(text, durationMs = 2600) {
  const callout = $('combat-callout');
  if (!callout) return;
  clearTimeout(calloutTimer);
  callout.textContent = text;
  callout.classList.remove('is-visible');
  void callout.offsetWidth;
  callout.classList.add('is-visible');
  calloutTimer = setTimeout(() => {
    callout.classList.remove('is-visible');
  }, durationMs);
}

// === STREET FIGHTER PIXEL-ART SPRITE ENGINE ===
const sfCanvas = $('sf-canvas');
const sfCtx = sfCanvas ? sfCanvas.getContext('2d') : null;
if (sfCtx) sfCtx.imageSmoothingEnabled = false;

const PAL_MASTER = {
  O: '#0f0c09',
  G: '#ffd08a',
  Y: '#e08a35',
  H: '#f3efe6',
  S: '#f1c29b',
  E: '#1a1410',
  X: '#ef4444',
  W: '#ffffff',
  C: '#cbd5e1',
  R: '#991b1b',
  D: '#5f1111',
  P: '#26211c',
  B: '#120e0b'
};

const PAL_BONDSMAN = {
  O: '#0f0c09',
  H: '#2a1c12',
  R: '#dc2626',
  S: '#d89b6c',
  E: '#1a1410',
  X: '#ef4444',
  T: '#2b4c7e',
  N: '#1b3152',
  W: '#f5ead8',
  P: '#292524',
  B: '#3f2e21',
  K: '#38bdf8'
};

const MASTER_IDLE_1 = [
  ".......OOOOOOOO.......",
  "......OGGGGGGGGO......",
  ".....OHHHHHHHHHHO.....",
  "....OHHSSSSSSSSHH0....",
  "....OHHSEESSSSEEHO....",
  ".....OHSSSSSSSSHO.....",
  "......OSSSSSSSSO......",
  ".......OOWWWWO........",
  "....OOORRRGGRRROOO....",
  "...ORRRRRRGGGRRRRRO...",
  "..ORRRRRRRGGGRRRRRRO..",
  "..ORR.ORRRGGGRRRO.SSO.",
  ".OSSO.ORRRGGGRRRO.GGO.",
  ".OOOO.ORRRGGGRRRO.WCO.",
  "......OGGGGGGGGGO.WCO.",
  ".....ORRRRRRRRRRO.WCO.",
  ".....ORRRR.RRRRRO.WCO.",
  ".....ODDDD.DDDDDO..O..",
  "......OPPP...PPPO.....",
  "......OPPP...PPPO.....",
  "......OPPP...PPPO.....",
  "......OPPP...PPPO.....",
  "......OBBB...BBBO.....",
  ".....OBBBB..OBBBBO....",
  ".....OOOOO..OOOOOO....",
  "......................"
];

const MASTER_IDLE_2 = [
  "......................",
  ".......OOOOOOOO.......",
  "......OGGGGGGGGO......",
  ".....OHHHHHHHHHHO.....",
  "....OHHSSSSSSSSHH0....",
  "....OHHSEESSSSEEHO....",
  ".....OHSSSSSSSSHO.....",
  "......OSSSSSSSSO......",
  ".......OOWWWWO........",
  "....OOORRRGGRRROOO....",
  "...ORRRRRRGGGRRRRRO...",
  "..ORRRRRRRGGGRRRRRRO..",
  "..ORR.ORRRGGGRRRO.SSO.",
  ".OSSO.ORRRGGGRRRO.GGO.",
  ".OOOO.ORRRGGGRRRO.WCO.",
  "......OGGGGGGGGGO.WCO.",
  ".....ORRRRRRRRRRO.WCO.",
  ".....ODDDD.DDDDDO..O..",
  "......OPPP...PPPO.....",
  "......OPPP...PPPO.....",
  "......OPPP...PPPO.....",
  ".....OBBB.....BBBO....",
  "....OBBBB....OBBBBO...",
  "....OOOOO....OOOOOO...",
  "......................",
  "......................"
];

const MASTER_ATTACK = [
  ".........OOOOOOOO.....",
  "........OGGGGGGGGO....",
  ".......OHHHHHHHHHHO...",
  "......OHHSSSSSSSSHH0..",
  "......OHHSEESSSSEEHO..",
  ".......OHSSSSSSSSHO...",
  "........OSSSSSSSSO....",
  ".........OOWWWWO......",
  ".....OOORRRGGRRRRRO...",
  "....ORRRRRRGGGRRRRRO..",
  "...ORRRRRRRGGGRRRRRSSO",
  "..ORR..ORRRGGGRRROGGGO",
  ".OSSO..OGGGGGGGGWWWWCO",
  ".OOOO.ORRRRRRRRRWWWWCO",
  ".....ORRRR..RRRRROOOO.",
  "....ODDDD....DDDDDO...",
  "...OPPP........PPPO...",
  "..OPPP..........PPPO..",
  ".OBBB............BBBO.",
  "OBBBB............BBBBO",
  "OOOOO............OOOOO",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................"
];

const MASTER_HIT = [
  "...OOOOOOOO...........",
  "..OGGGGGGGGO..........",
  ".OHHHHHHHHHHO.........",
  "OHHSSSSSSSSHH0........",
  "OHHSXXSSSSXXHO........",
  ".OHSSSSSSSSHO.........",
  "..OSSSSSSSSO..........",
  "...OOWWWWO............",
  "..ORRRGGRRRO..........",
  ".ORRRRRGGGRRRO........",
  "OSSO.RRRGGGRRRO.OSSO..",
  "OOOO.RRRGGGRRRO.OOOO..",
  ".....OGGGGGGGGO.......",
  ".....ORRRRRRRRO.......",
  ".....ODDDD.DDDO.......",
  "......OPPP..PPPO......",
  "......OPPP...PPPO.....",
  "......OBBB...BBBO.....",
  ".....OBBBB..OBBBBO....",
  ".....OOOOO..OOOOOO....",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................"
];

const MASTER_KO = [
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "..OOOOOO...OOOOOOO....",
  ".OHHSSSHHOORRRGGRRRO..",
  "OBBBPPPPORRRRRRRRRRRO.",
  "OOOOOOOOOOOOOOOOOOOOOO",
  "......................",
  "......................",
  "......................"
];

const BONDSMAN_IDLE_1 = [
  "......................",
  ".......OOOOOOOO.......",
  "......OHHHHHHHHO......",
  ".....ORRRRRRRRRRO.....",
  "....OHHSSSSSSSSHH0....",
  "....OHHSEESSSSEEHO....",
  ".....OHSSSSSSSSHO.....",
  "......OSSSSSSSSO......",
  ".....OOTTTTTTTTOO.....",
  "....OSSTTTTTTTTSSO....",
  "...OSSO.TTTTTT.OSSO...",
  "...OWWO.TTTTTT.OWWO...",
  "....OO..NNNNNN..OO....",
  "......OOWWWWWWWOO.....",
  ".....OPPPPPPPPPPO.....",
  "....OPPPP....PPPPO....",
  "....OPPP......PPPO....",
  "...OPPP........PPPO...",
  "...OBBB........BBBO...",
  "..OBBBB........BBBBO..",
  "..OOOOO........OOOOO..",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................"
];

const BONDSMAN_IDLE_2 = [
  "......................",
  "......................",
  ".......OOOOOOOO.......",
  "......OHHHHHHHHO......",
  ".....ORRRRRRRRRRO.....",
  "....OHHSSSSSSSSHH0....",
  "....OHHSEESSSSEEHO....",
  ".....OHSSSSSSSSHO.....",
  "......OSSSSSSSSO......",
  ".....OOTTTTTTTTOO.....",
  "....OSSTTTTTTTTSSO....",
  "...OSSO.TTTTTT.OSSO...",
  "...OWWO.TTTTTT.OWWO...",
  "......OOWWWWWWWOO.....",
  ".....OPPPPPPPPPPO.....",
  "....OPPPP....PPPPO....",
  "...OPPP........PPPO...",
  "..OBBB..........BBBO..",
  ".OBBBB..........BBBBO.",
  ".OOOOO..........OOOOO.",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................"
];

const BONDSMAN_ATTACK = [
  ".........OOOOOOOO.....",
  "........OHHHHHHHHO....",
  ".......ORRRRRRRRRRO...",
  "......OHHSSSSSSSSHH0..",
  "......OHHSEESSSSEEHO..",
  ".......OHSSSSSSSSHO...",
  "........OSSSSSSSSO....",
  "......OOTTTTTTTTOO....",
  ".....OSSTTTTTTTTSSO...",
  "....OSSO.TTTTTT.OSSWWO",
  "....OWWO.NNNNNN.OKKWWK",
  ".........OOWWWWWWWOKKO",
  "........OPPPPPPPPPPO..",
  "......OPPPP....PPPPO..",
  ".....OPPP........PPPO.",
  "....OPPP..........PPPO",
  "...OBBB............BBB",
  "..OBBBB............BBB",
  "..OOOOO............OOO",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................"
];

const BONDSMAN_HIT = [
  "......................",
  "...OOOOOOOO...........",
  "..OHHHHHHHHO..........",
  ".ORRRRRRRRRRO.........",
  "OHHSSSSSSSSHH0........",
  "OHHSXXSSSSXXHO........",
  ".OHSSSSSSSSHO.........",
  "..OSSSSSSSSO..........",
  "..OOTTTTTTTTOO........",
  ".OSSO.TTTTTT.OSSO.....",
  ".OWWO.NNNNNN.OWWO.....",
  "......OOWWWWWWWOO.....",
  ".....OPPPPPPPPPPO.....",
  ".....OPPP....PPPO.....",
  "....OPPP......PPPO....",
  "....OBBB......BBBO....",
  "...OBBBB......BBBBO...",
  "...OOOOO......OOOOO...",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................"
];

const BONDSMAN_KO = [
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "......................",
  "..OOOOOO...OOOOOOO....",
  ".OHHSSSHHOOTTTTTTTO...",
  "OBBBPPPPOTTTTTTTTTSSO.",
  "OOOOOOOOOOOOOOOOOOOOOO",
  "......................",
  "......................",
  "......................"
];

const fighterState = {
  master: { baseX: 230, x: 230, y: 74, pose: 'idle', facing: 1, timer: 0, flash: 0 },
  bondsman: { baseX: 530, x: 530, y: 74, pose: 'idle', facing: -1, timer: 0, flash: 0 },
  particles: [],
  shake: 0,
  tick: 0
};

function spawnSparks(x, y, colorA, colorB) {
  for (let i = 0; i < 18; i++) {
    const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.25;
    const speed = 2.2 + Math.random() * 4.6;
    fighterState.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.8,
      size: i % 2 === 0 ? 5 : 4,
      color: i % 2 === 0 ? colorA : colorB,
      life: 24
    });
  }
}

function drawSprite(grid, palette, cx, topY, scale, facing, flashWhite) {
  if (!sfCtx) return;
  const rows = grid.length;
  const cols = grid[0].length;
  const w = cols * scale;
  sfCtx.save();
  sfCtx.translate(Math.round(cx), Math.round(topY));
  sfCtx.scale(facing, 1);
  for (let r = 0; r < rows; r++) {
    const row = grid[r];
    for (let c = 0; c < cols; c++) {
      const ch = row[c];
      if (ch === '.' || !palette[ch]) continue;
      sfCtx.fillStyle = flashWhite && ch !== 'O' ? '#fff7e6' : palette[ch];
      sfCtx.fillRect(-w / 2 + c * scale, r * scale, scale, scale);
    }
  }
  sfCtx.restore();
}

function drawArenaStage() {
  if (!sfCtx) return;
  const w = sfCanvas.width;
  const h = sfCanvas.height;

  sfCtx.fillStyle = '#14100c';
  sfCtx.fillRect(0, 0, w, h);

  sfCtx.fillStyle = '#241a12';
  sfCtx.fillRect(0, 44, w, 134);

  for (let px = 55; px < w - 40; px += 130) {
    sfCtx.fillStyle = '#2e241b';
    sfCtx.fillRect(px, 28, 34, 150);
    sfCtx.fillStyle = '#3f3225';
    sfCtx.fillRect(px + 6, 28, 8, 150);
    sfCtx.fillStyle = '#5c4936';
    sfCtx.fillRect(px - 5, 22, 44, 8);
    sfCtx.fillRect(px - 5, 172, 44, 8);
  }

  const flicker = Math.sin(fighterState.tick * 0.25) > 0 ? 1 : 0;
  [135, 380, 625].forEach(tx => {
    sfCtx.fillStyle = '#6e4e2e';
    sfCtx.fillRect(tx - 3, 86, 6, 20);
    sfCtx.fillStyle = '#e08a35';
    sfCtx.fillRect(tx - 6, 74 - flicker * 2, 12, 12);
    sfCtx.fillStyle = '#ffd08a';
    sfCtx.fillRect(tx - 3, 77 - flicker, 6, 7);
  });

  sfCtx.fillStyle = '#261e16';
  sfCtx.fillRect(0, 178, w, 52);
  sfCtx.fillStyle = '#8d6b43';
  sfCtx.fillRect(0, 178, w, 3);
  sfCtx.fillStyle = '#18120d';
  for (let gx = 0; gx < w; gx += 38) {
    sfCtx.fillRect(gx, 181, 2, 49);
  }

  sfCtx.fillStyle = 'rgba(255, 208, 138, 0.14)';
  sfCtx.font = 'bold 28px "Courier New", monospace';
  sfCtx.textAlign = 'center';
  sfCtx.fillText('VS', w / 2, 118);
}

function renderFighters() {
  if (!sfCtx) return;
  fighterState.tick++;
  sfCtx.save();

  if (fighterState.shake > 0) {
    fighterState.shake--;
    sfCtx.translate((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 5);
  }

  drawArenaStage();

  ['master', 'bondsman'].forEach(key => {
    const f = fighterState[key];
    if (f.timer > 0) {
      f.timer--;
      if (f.timer === 0 && f.pose !== 'ko' && f.pose !== 'victory') {
        f.pose = 'idle';
      }
    }
    if (f.flash > 0) f.flash--;
    f.x += (f.baseX - f.x) * 0.16;
  });

  sfCtx.fillStyle = 'rgba(0, 0, 0, 0.52)';
  sfCtx.beginPath();
  sfCtx.ellipse(fighterState.master.x, 194, 42, 8, 0, 0, Math.PI * 2);
  sfCtx.ellipse(fighterState.bondsman.x, 194, 42, 8, 0, 0, Math.PI * 2);
  sfCtx.fill();

  const idleFrame = Math.floor(fighterState.tick / 16) % 2;

  const mGrid =
    fighterState.master.pose === 'ko'
      ? MASTER_KO
      : fighterState.master.pose === 'attack'
      ? MASTER_ATTACK
      : fighterState.master.pose === 'hit'
      ? MASTER_HIT
      : idleFrame === 0
      ? MASTER_IDLE_1
      : MASTER_IDLE_2;

  const bGrid =
    fighterState.bondsman.pose === 'ko'
      ? BONDSMAN_KO
      : fighterState.bondsman.pose === 'attack'
      ? BONDSMAN_ATTACK
      : fighterState.bondsman.pose === 'hit'
      ? BONDSMAN_HIT
      : idleFrame === 0
      ? BONDSMAN_IDLE_1
      : BONDSMAN_IDLE_2;

  drawSprite(mGrid, PAL_MASTER, fighterState.master.x, fighterState.master.y, 5, 1, fighterState.master.flash > 0);
  drawSprite(bGrid, PAL_BONDSMAN, fighterState.bondsman.x, fighterState.bondsman.y, 5, -1, fighterState.bondsman.flash > 0);

  fighterState.particles = fighterState.particles.filter(p => p.life > 0);
  for (const p of fighterState.particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    sfCtx.fillStyle = p.color;
    sfCtx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
  }

  sfCtx.restore();
  requestAnimationFrame(renderFighters);
}

if (sfCtx) renderFighters();

function draw() {
  const c = chapters[chapter];
  $('chapter-label').textContent = `CHAPTER 0${chapter + 1} / ${c.label}`;
  $('chapter-count').textContent = `${chapter + 1} OF 4`;
  $('game-progress-fill').style.width = `${(chapter + 1) * 25}%`;
  $('story-kicker').textContent = c.label;
  $('story-title').textContent = c.title;
  $('story-text').textContent = c.text;
  $('game-feedback').hidden = true;
  $('next-chapter').hidden = true;

  const choices = $('game-choices');
  choices.replaceChildren();
  c.choices.forEach((choice, i) => {
    const b = document.createElement('button');
    const code = document.createElement('span');
    code.textContent = `OPTION 0${i + 1}`;
    const strong = document.createElement('strong');
    strong.textContent = choice.title;
    const desc = document.createElement('div');
    desc.textContent = choice.desc;
    desc.style.cssText = 'font-size:13px;color:#b5cce6;margin-top:7px';
    b.append(code, strong, desc);
    b.addEventListener('click', () => choose(i));
    choices.append(b);
  });
  updateStats();
}

function updateStats() {
  for (const k of ['rec', 'dom', 'ind']) {
    $('stat-' + k).textContent = stats[k];
    $('bar-' + k).style.width = `${Math.max(0, Math.min(100, ((stats[k] + 12) / 24) * 100))}%`;
  }
  const power = Math.max(8, Math.min(92, 50 + stats.dom * 7 - stats.rec * 3));
  $('balance-marker').style.left = `${power}%`;
  $('balance-text').textContent = stats.dom > 3 ? 'DOMINATION' : stats.rec > 2 ? 'RECIPROCITY' : 'UNRESOLVED';
  $('a-role').textContent = stats.dom > 3 ? 'Claiming mastery' : stats.ind > 3 ? 'Developing independence' : 'Seeking recognition';
  $('b-role').textContent = stats.dom > 3 ? 'Subordinated' : 'Seeking recognition';

  const mw = $('master-will'),
    bw = $('bondsman-will');
  if (mw) mw.style.width = Math.max(18, Math.min(100, 100 - Math.max(0, stats.ind) * 6 + stats.dom * 2)) + '%';
  if (bw) bw.style.width = Math.max(18, Math.min(100, 100 - Math.max(0, stats.dom) * 6 + stats.ind * 3)) + '%';
}

function animateCombat(choice) {
  const [dRec, dDom, dInd] = choice.delta;
  const m = fighterState.master;
  const b = fighterState.bondsman;

  if (dRec >= 2) {
    m.pose = 'attack';
    b.pose = 'attack';
    m.x = 340;
    b.x = 420;
    m.timer = 32;
    b.timer = 32;
    fighterState.shake = 10;
    spawnSparks(380, 128, '#ffd08a', '#ffffff');
    showAttackNotification('WILLS COLLIDE! — MUTUAL RECOGNITION');
  } else if (dDom > 0 && dInd >= 0) {
    m.pose = 'attack';
    m.x = 435;
    m.timer = 32;
    b.pose = 'hit';
    b.x = 560;
    b.timer = 32;
    b.flash = 6;
    fighterState.shake = 12;
    spawnSparks(510, 126, '#ffd08a', '#ef4444');
    showAttackNotification(`MASTER STRIKES! — ${choice.title.toUpperCase()}`);
  } else if (dInd > 0 && dDom <= 0) {
    b.pose = 'attack';
    b.x = 325;
    b.timer = 32;
    m.pose = 'hit';
    m.x = 200;
    m.timer = 32;
    m.flash = 6;
    fighterState.shake = 12;
    spawnSparks(255, 126, '#38bdf8', '#ffd08a');
    showAttackNotification(`BONDSMAN COUNTERS! — ${choice.title.toUpperCase()}`);
  } else {
    m.pose = 'idle';
    b.pose = 'hit';
    b.x = 546;
    b.timer = 24;
    showAttackNotification(`GUARD STANCE — ${choice.title.toUpperCase()}`);
  }
}

function choose(i) {
  const c = chapters[chapter].choices[i];
  history.push(c.title);
  stats.rec += c.delta[0];
  stats.dom += c.delta[1];
  stats.ind += c.delta[2];
  animateCombat(c);

  $('game-feedback').hidden = false;
  $('game-feedback').textContent = c.feedback;
  [...$('game-choices').children].forEach((b, j) => {
    b.disabled = true;
    b.classList.toggle('selected', j === i);
  });
  $('next-chapter').hidden = false;
  $('next-chapter').textContent = chapter === 3 ? 'Reveal your ending →' : 'Continue the story →';
  updateStats();
}

function ending() {
  const result =
    stats.dom >= 5
      ? {
          title: 'The throne is a trap.',
          text: 'You gained command, but your authority depends on someone whose independence you denied. Hegel’s master cannot receive fully satisfying recognition from the subordinated other.',
          poseM: 'idle',
          poseB: 'ko',
          callout: 'K.O. — HOLLOW MASTERY'
        }
      : stats.rec >= 5
      ? {
          title: 'Beyond the hierarchy.',
          text: 'Your choices favor reciprocal recognition. This is not a guaranteed ending to Hegel’s struggle, but it explores the idea that freedom cannot be secured through one-sided domination.',
          poseM: 'idle',
          poseB: 'idle',
          callout: 'DRAW — RECIPROCAL RECOGNITION'
        }
      : stats.ind >= 5
      ? {
          title: 'The maker awakens.',
          text: 'You discover independence through work and the transformation of the world. Hegel’s bondsman develops self-consciousness through fear, discipline, and labor.',
          poseM: 'ko',
          poseB: 'idle',
          callout: 'K.O. — THE BONDSMAN AWAKENS'
        }
      : {
          title: 'The contradiction remains.',
          text: 'You have neither settled the demand for recognition nor escaped dependence. The dialectic remains open, and so does the question of freedom.',
          poseM: 'idle',
          poseB: 'idle',
          callout: 'TIME OVER — DIALECTIC UNRESOLVED'
        };

  fighterState.master.pose = result.poseM;
  fighterState.bondsman.pose = result.poseB;
  showAttackNotification(result.callout, 3200);

  $('chapter-label').textContent = 'SIMULATION COMPLETE';
  $('chapter-count').textContent = 'ENDING UNLOCKED';
  $('story-kicker').textContent = 'YOUR OUTCOME';
  $('story-title').textContent = result.title;
  $('story-text').textContent = result.text;
  $('game-choices').replaceChildren();
  $('game-feedback').hidden = false;
  $('game-feedback').textContent = `Your path: ${history.join(' → ')}. Recognition: ${stats.rec} · Domination: ${stats.dom} · Independence: ${stats.ind}. These values are an interpretive game mechanic, not a measurement of actual consciousness.`;
  $('next-chapter').hidden = true;
  $('game-progress-fill').style.width = '100%';

  const b = document.createElement('button');
  b.className = 'btn';
  b.textContent = 'Play another path ↻';
  b.addEventListener('click', reset);
  $('game-choices').append(b);
}

function reset() {
  chapter = 0;
  stats = { rec: 0, dom: 0, ind: 0 };
  history = [];
  fighterState.master.pose = 'idle';
  fighterState.master.x = fighterState.master.baseX;
  fighterState.bondsman.pose = 'idle';
  fighterState.bondsman.x = fighterState.bondsman.baseX;
  showAttackNotification('ROUND 1 — FIGHT!', 2000);
  draw();
}

$('next-chapter').addEventListener('click', () => {
  if (chapter === 3) ending();
  else {
    chapter++;
    draw();
  }
});
$('restart-game').addEventListener('click', reset);
draw();
