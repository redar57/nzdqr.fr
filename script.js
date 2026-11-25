// nzdqr OS

// --- citations ---
const citations = [
  ["Les mathématiques sont la reine des sciences.", "C. F. Gauss"],
  ["Lisez Euler, lisez Euler, c'est notre maître à tous.", "P.-S. Laplace"],
  ["Wir müssen wissen, wir werden wissen.", "D. Hilbert"],
  ["Dieu a créé les entiers, tout le reste est l'œuvre de l'homme.", "L. Kronecker"],
  ["Un mathématicien est une machine à transformer le café en théorèmes.", "A. Rényi"],
  ["Il n'est pas certain que tout soit incertain.", "B. Pascal"]
];
let derniere = -1;
function nouvelleCitation() {
  let n;
  do { n = Math.floor(Math.random() * citations.length); } while (n === derniere);
  derniere = n;
  document.getElementById('qt').innerHTML =
    '« ' + citations[n][0] + ' »<br><span class="bleu">— ' + citations[n][1] + '</span>';
}
nouvelleCitation();
document.getElementById('qbtn').onclick = nouvelleCitation;

// --- post-it et web ---
// mot-clé (en minuscules, sans accents) → page. Chaque mot apparaît sur le post-it.
// url: null = mot sans page (pour l'instant).
// cadre: false pour les sites qui refusent d'être affichés dans une autre page.
const marque = {
  'fdhrb': { url: 'web/fdhrb/index.php.html', titre: 'Faidherbard Online' }
};

const sansAccent = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const echap = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

document.getElementById('mots').innerHTML =
  Object.keys(marque).map(m => '<div>' + echap(m) + '</div>').join('');

const nadr = document.getElementById('nadr'), npage = document.getElementById('npage');
const ncadre = document.getElementById('ncadre'), nstat = document.getElementById('nstat');
let hist = [], pos = -1;

function afficher(mot) {
  const cle = sansAccent(mot);
  const p = marque[cle];
  nadr.value = mot;
  ncadre.style.display = 'none';
  npage.style.display = 'block';
  ncadre.src = 'about:blank';
  if (!cle) {
    nadr.value = '';
    npage.innerHTML = '<div class="logo"><span>n</span><span>z</span><span>d</span><span>q</span><span>r</span></div>' +
      '<div class="sous">le moteur de recherche qui ne connaît que quelques mots.</div>';
    nstat.textContent = 'prêt';
  } else if (!p || !p.url) {
    npage.innerHTML = '<div class="err"><h1>Aucun résultat</h1>Rien trouvé pour « ' + echap(mot) + ' ».<br><br>Essaie autre chose.</div>';
    nstat.textContent = '0 résultat';
  } else if (p.cadre === false) {
    npage.innerHTML = '<div class="err"><h1>⚠ Accès refusé</h1>Ce site ne veut pas s\'afficher ici.<br>' +
      'Il a ses raisons.<br><br><a href="' + echap(p.url) + '" target="_blank" rel="noopener">→ ouvrir « ' + echap(p.titre) + ' » dans un nouvel onglet</a></div>';
    nstat.textContent = p.url;
  } else {
    npage.style.display = 'none';
    ncadre.style.display = 'block';
    ncadre.src = p.url;
    nstat.innerHTML = 'chargement de ' + echap(p.url) + '… · <a href="' + echap(p.url) + '" target="_blank" rel="noopener">ouvrir à part</a>';
    ncadre.onload = () => { if (ncadre.src !== 'about:blank') nstat.innerHTML = echap(p.titre) + ' · <a href="' + echap(p.url) + '" target="_blank" rel="noopener">ouvrir à part</a>'; };
  }
}
function aller(mot) {
  hist = hist.slice(0, pos + 1);
  hist.push(mot);
  pos = hist.length - 1;
  afficher(mot);
}
document.getElementById('nform').onsubmit = e => { e.preventDefault(); aller(nadr.value); };
document.getElementById('nacc').onclick = () => aller('');
document.getElementById('nprec').onclick = () => { if (pos > 0) afficher(hist[--pos]); };
document.getElementById('nsuiv').onclick = () => { if (pos < hist.length - 1) afficher(hist[++pos]); };
aller('');

// --- fenêtres ---
const desk = document.getElementById('desk');
let z = 20;

function devant(w) {
  w.style.zIndex = ++z;
  document.querySelectorAll('.win').forEach(x => x.classList.toggle('off', x !== w));
  majTaches();
}
function ouvrir(id) {
  const w = document.getElementById('w-' + id);
  if (!w) return;
  w.classList.add('open');
  devant(w);
}
function majTaches() {
  const t = document.getElementById('tasks');
  t.innerHTML = '';
  document.querySelectorAll('.win.open').forEach(w => {
    const b = document.createElement('span');
    b.className = 'btn98' + (w.classList.contains('off') ? '' : ' on');
    b.textContent = w.querySelector('.bar span').textContent;
    b.onclick = () => devant(w);
    t.appendChild(b);
  });
}

document.querySelectorAll('.win').forEach(w => {
  const bar = w.querySelector('.bar');
  w.addEventListener('mousedown', () => devant(w));
  w.querySelector('.x').onclick = e => {
    e.stopPropagation();
    w.classList.remove('open');
    majTaches();
  };
  bar.addEventListener('mousedown', e => {
    if (e.target.classList.contains('x')) return;
    const ox = e.clientX - w.offsetLeft, oy = e.clientY - w.offsetTop;
    document.body.classList.add('drag');
    function bouge(ev) {
      w.style.right = 'auto';
      w.style.left = Math.max(0, Math.min(desk.clientWidth - 80, ev.clientX - ox)) + 'px';
      w.style.top = Math.max(0, Math.min(desk.clientHeight - 60, ev.clientY - oy)) + 'px';
    }
    function lache() {
      document.body.classList.remove('drag');
      document.removeEventListener('mousemove', bouge);
      document.removeEventListener('mouseup', lache);
    }
    document.addEventListener('mousemove', bouge);
    document.addEventListener('mouseup', lache);
  });
});

function lancer(el) {
  if (el.dataset.link) window.open(el.dataset.link, '_blank', 'noopener');
  else if (el.dataset.open) ouvrir(el.dataset.open);
}

// --- icônes ---
document.querySelectorAll('.ic').forEach(i => {
  i.onclick = () => {
    document.querySelectorAll('.ic').forEach(x => x.classList.remove('sel'));
    i.classList.add('sel');
  };
  i.ondblclick = () => lancer(i);
});

// --- menu démarrer ---
const menu = document.getElementById('start');
document.getElementById('sbtn').onclick = e => {
  e.stopPropagation();
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
};
desk.addEventListener('click', () => { menu.style.display = 'none'; });
menu.querySelectorAll('.it[data-open], .it[data-link]').forEach(i => {
  i.onclick = e => { e.stopPropagation(); menu.style.display = 'none'; lancer(i); };
});
document.getElementById('shut').onclick = e => {
  e.stopPropagation();
  menu.style.display = 'none';
  document.getElementById('off').style.display = 'flex';
};
document.getElementById('off').onclick = () => {
  document.getElementById('off').style.display = 'none';
};

// --- horloge et uptime ---
const debut = Date.now();
const deux = n => String(n).padStart(2, '0');
function tic() {
  const d = new Date();
  document.getElementById('clk').textContent = deux(d.getHours()) + ':' + deux(d.getMinutes());
  const s = Math.floor((Date.now() - debut) / 1000);
  document.getElementById('up').textContent =
    deux(Math.floor(s / 3600)) + ':' + deux(Math.floor(s / 60) % 60) + ':' + deux(s % 60);
}
tic();
setInterval(tic, 1000);

// --- fonds d'écran ---
const fonds = {
  points: 'Points', win95: 'Win 95', unix: 'Unix', macos: 'Mac OS',
  carnet: 'Carnet', ciel: 'Ciel', complexe: 'ℂ'
};
const grille = document.getElementById('fonds');

function appliquerFond(nom) {
  desk.className = 'wp-' + nom;
  desk.style.backgroundImage = '';
  if (nom === 'perso') {
    const img = localStorage.getItem('nzdqr-fond-image');
    if (img) desk.style.backgroundImage = 'url(' + img + ')';
    else { appliquerFond('points'); return; }
  }
  localStorage.setItem('nzdqr-fond', nom);
  grille.querySelectorAll('.fond').forEach(f => f.classList.toggle('on', f.dataset.fond === nom));
}

Object.keys(fonds).forEach(nom => {
  const f = document.createElement('div');
  f.className = 'fond wp-' + nom;
  f.dataset.fond = nom;
  f.title = fonds[nom];
  f.onclick = () => appliquerFond(nom);
  grille.appendChild(f);
});
document.getElementById('fperso').onchange = e => {
  const fichier = e.target.files[0];
  if (!fichier) return;
  const lecteur = new FileReader();
  lecteur.onload = () => {
    try {
      localStorage.setItem('nzdqr-fond-image', lecteur.result);
      appliquerFond('perso');
    } catch {
      alert('Image trop lourde pour être gardée. Essaie une image plus petite.');
    }
  };
  lecteur.readAsDataURL(fichier);
};

appliquerFond(localStorage.getItem('nzdqr-fond') || 'points');
majTaches();
