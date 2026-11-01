const raiz = document.documentElement;

// =========================================================
// MODO CLARO / ESCURO
// =========================================================
document.querySelectorAll('.alternar-tema').forEach(btn => {
  btn.addEventListener('click', () => {
    const novo = raiz.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    raiz.setAttribute('data-theme', novo);
    try { localStorage.setItem('tema', novo); } catch (e) {}
  });
});

// =========================================================
// SEÇÕES (igual à referência: o site é uma página só)
// - Computador: passar o mouse numa coluna da barra troca a seção.
//   Enquanto o mouse está na barra, o objeto 3D vira pontinhos;
//   quando sai, o objeto sólido volta.
// - Celular: toca no ☰ e escolhe a seção.
// =========================================================
const itensNav = [...document.querySelectorAll('.nav-item')];
const paginas = [...document.querySelectorAll('.pagina')];
const nav = document.getElementById('nav');
let paginaAtual = 0;

const dados = itensNav.map(item => ({
  slug: item.dataset.slug,
  nome: item.dataset.nome,
  legenda: item.dataset.legenda
}));

function noComputador() { return window.innerWidth > 1024; }

function mudarPagina(indice) {
  if (indice === paginaAtual) return;
  paginaAtual = indice;
  const d = dados[indice];

  // Barra de seções
  itensNav.forEach((item, i) => item.classList.toggle('ativo', i === indice));

  // Conteúdo
  paginas.forEach((p, i) => p.classList.toggle('ativa', i === indice));

  // Faixas gigantes: apagam, trocam o nome da seção e acendem de novo
  const faixas = document.querySelector('.faixas');
  faixas.classList.add('apagadas');
  clearTimeout(mudarPagina.timer);
  mudarPagina.timer = setTimeout(() => {
    const texto = Array(5).fill(dados[paginaAtual].nome).join(' ');
    document.querySelectorAll('.faixa span').forEach(s => { s.textContent = texto; });
    faixas.classList.remove('apagadas');
  }, 350);

  // Cabeçalho do celular e legenda
  document.querySelector('.atual-nome').textContent = d.nome;
  document.querySelectorAll('.nav-mobile .lista button').forEach((b, i) => b.classList.toggle('atual', i === indice));
  document.querySelector('.legenda-texto').textContent = d.legenda;

  // Objeto 3D muda de forma
  if (window.cromado3d) window.cromado3d.mudar(indice);

  // Textos que ainda não apareceram
  paginas[indice].querySelectorAll('.revelar:not(.visivel)').forEach(el => observador.observe(el));
}

function atualizarEndereco() {
  const slug = dados[paginaAtual].slug;
  history.replaceState({}, '', slug ? `index.html?secao=${slug}` : 'index.html');
  document.title = paginaAtual === 0 ? 'Leonardo Costa | Portfólio' : `${dados[paginaAtual].nome} | Leonardo Costa`;
}

// Mouse em cima de uma coluna = troca a seção
itensNav.forEach((item, i) => {
  item.addEventListener('mouseenter', () => { if (noComputador()) mudarPagina(i); });
});

// Mouse entra na barra = pontinhos / sai da barra = objeto sólido
nav.addEventListener('mouseenter', () => {
  if (noComputador() && window.cromado3d) window.cromado3d.pontos();
});
nav.addEventListener('mouseleave', () => {
  if (!noComputador()) return;
  if (window.cromado3d) window.cromado3d.solido();
  atualizarEndereco();
});

// Subitens (Sobre, Contato...): rolam até a parte certa
document.querySelectorAll('[data-ir]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const alvo = document.getElementById(link.dataset.ir);
    if (alvo) alvo.scrollIntoView({ behavior: 'smooth' });
  });
});

// Botões que trocam de seção com clique (rodapé, celular, barra fixa)
function trocarComClique(indice) {
  alternarMenu(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const esperarTopo = () => {
    if (window.scrollY > 5) return requestAnimationFrame(esperarTopo);
    if (indice === paginaAtual) return;
    if (window.cromado3d) window.cromado3d.pontos();
    mudarPagina(indice);
    atualizarEndereco();
    setTimeout(() => { if (window.cromado3d) window.cromado3d.solido(); }, 900);
  };
  setTimeout(esperarTopo, 150);
}
document.querySelectorAll('.rodape-lista button[data-pagina], .nav-mobile .lista button, .barra-fixa button[data-pagina]').forEach(btn => {
  btn.addEventListener('click', () => trocarComClique(Number(btn.dataset.pagina)));
});

// =========================================================
// MENU DO CELULAR
// =========================================================
const btnMenu = document.getElementById('btn-menu');

function alternarMenu(abrir) {
  document.body.classList.toggle('menu-aberto', abrir);
  btnMenu.setAttribute('aria-expanded', abrir);
  btnMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
}
btnMenu.addEventListener('click', e => {
  e.stopPropagation();
  alternarMenu(!document.body.classList.contains('menu-aberto'));
});
document.addEventListener('click', e => { if (!e.target.closest('.nav-mobile')) alternarMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') alternarMenu(false); });

// =========================================================
// BARRA FIXA (computador) e LEGENDA (celular) conforme a rolagem
// =========================================================
const hero = document.querySelector('.hero');
const barraFixa = document.querySelector('.barra-fixa');
const legenda = document.querySelector('.hero-legenda');

function aoRolar() {
  const fimDoHero = hero.offsetTop + hero.offsetHeight - 80;
  barraFixa.classList.toggle('visivel', window.scrollY > fimDoHero);
  legenda.classList.toggle('escondida', window.scrollY > window.innerHeight * 0.25);
}
window.addEventListener('scroll', aoRolar, { passive: true });
aoRolar();

// =========================================================
// TEXTOS APARECENDO AO ROLAR
// =========================================================
const observador = new IntersectionObserver(entradas => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visivel');
      observador.unobserve(entrada.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.pagina.ativa .revelar').forEach(el => observador.observe(el));

// =========================================================
// ABRIR NA SEÇÃO CERTA (ex.: index.html?secao=estudos)
// =========================================================
const secaoInicial = new URLSearchParams(location.search).get('secao');
const indiceInicial = dados.findIndex(d => d.slug === secaoInicial);
window.paginaInicial = indiceInicial > 0 ? indiceInicial : 0;
if (window.paginaInicial > 0) mudarPagina(window.paginaInicial);

// =========================================================
// COPIAR E-MAIL
// =========================================================
const aviso = document.createElement('div');
aviso.className = 'aviso';
aviso.setAttribute('role', 'status');
document.body.appendChild(aviso);

document.querySelectorAll('[data-copiar]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const texto = btn.dataset.copiar;
    try { await navigator.clipboard.writeText(texto); }
    catch (e) {
      const campo = document.createElement('textarea');
      campo.value = texto; document.body.appendChild(campo);
      campo.select(); document.execCommand('copy'); campo.remove();
    }
    aviso.textContent = 'E-mail copiado';
    aviso.classList.add('mostrar');
    clearTimeout(aviso.t);
    aviso.t = setTimeout(() => aviso.classList.remove('mostrar'), 1800);
  });
});

// =========================================================
// ANO NO RODAPÉ
// =========================================================
document.querySelectorAll('.ano').forEach(el => { el.textContent = new Date().getFullYear(); });
