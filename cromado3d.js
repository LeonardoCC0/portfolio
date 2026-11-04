// =========================================================
// OBJETO 3D DO TOPO (Three.js) — funciona como na referência:
//
// • Cada seção tem um objeto 3D de metal cromado (o texto de
//   data-objeto de cada coluna da barra: "Coxstaa", "</>", "{ }", "@").
// • O objeto gira sozinho em volta do próprio eixo (não segue o mouse).
// • Com o mouse em cima da barra de seções, ele vira uma nuvem de
//   1500 pontinhos brancos. Passando por outra seção, os pontinhos
//   se reorganizam no formato do objeto daquela seção.
// • Quando o mouse sai da barra, um círculo vindo de cima revela o
//   objeto sólido de novo e os pontinhos somem.
// =========================================================
import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import * as opentypeModulo from 'opentype';

const opentype = opentypeModulo.parse ? opentypeModulo : opentypeModulo.default;
const FONTE_URL = 'https://cdn.jsdelivr.net/npm/@fontsource/yellowtail@5/files/yellowtail-latin-400-normal.woff';

const TOTAL_PONTOS = 1500;     // quantidade de pontinhos
const VEL_MAXIMA = 0.008;      // velocidade máxima do giro (por quadro)
const ACELERACAO = 0.0001;     // quanto o giro acelera a cada quadro
const RAIO_CIRCULO = 2000;     // raio do círculo que revela o objeto (px)
const CENTRO_CIRCULO = -600;   // centro do círculo, acima do objeto (px)

const caixa = document.querySelector('.cromado');
const textos = [...document.querySelectorAll('.nav-item')].map(item => item.dataset.objeto);

// ---------- Estado (pode ser mudado antes do 3D terminar de carregar) ----------
let atual = window.paginaInicial || 0;
let abertura = 0;          // 0 = só pontinhos, 1 = objeto sólido
let passoAbertura = 0;     // quanto a abertura muda por quadro
let carregado = false;

window.cromado3d = {
  mudar(indice) { atual = indice; if (carregado) iniciarMorph(indice); else mostrarTextoReserva(); },
  pontos() { if (carregado) passoAbertura = -0.03; },
  solido() { if (carregado) passoAbertura = 0.01; }
};

let iniciarMorph = () => {};

if (caixa) iniciar().catch(erro => {
  console.error('[cromado3d]', erro);
  caixa.innerHTML = '';
  caixa.classList.add('sem-3d');
  mostrarTextoReserva();
});

// Plano B (sem internet / navegador sem WebGL): texto cromado em CSS
function mostrarTextoReserva() {
  if (!caixa.classList.contains('sem-3d')) return;
  caixa.innerHTML = '';
  const span = document.createElement('span');
  span.textContent = textos[atual];
  caixa.appendChild(span);
}

// Estúdio de luz usado como reflexo do metal
function criarEstudio() {
  const estudio = new THREE.Scene();
  estudio.background = new THREE.Color(0x0b1520);
  estudio.add(new THREE.Mesh(
    new THREE.SphereGeometry(50, 32, 16),
    new THREE.MeshBasicMaterial({ color: 0x26384a, side: THREE.BackSide })
  ));
  const faixa = (largura, altura, x, y, z, intensidade, cor = 0xffffff) => {
    const mat = new THREE.MeshBasicMaterial({ color: cor, side: THREE.DoubleSide });
    mat.color.multiplyScalar(intensidade);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(largura, altura), mat);
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    estudio.add(m);
  };
  faixa(40, 6, 0, 18, 6, 6);
  faixa(4, 30, -18, 0, 10, 5);
  faixa(4, 30, 18, 2, 8, 4);
  faixa(30, 2.5, 0, -2, 20, 3.5);
  faixa(30, 8, 0, -18, 4, 2.2, 0xa5c4d9);   // luz de baixo no azul do blazer (reflexo azulado)
  faixa(4, 26, -16, -4, -14, 2.5, 0xa5c4d9);
  faixa(12, 12, 10, 10, -20, 2.5);
  return estudio;
}

// Transforma um texto da fonte em geometria 3D
function criarGeometria(fonte, texto) {
  const caminho = fonte.getPath(texto, 0, 0, 100);
  const shapePath = new THREE.ShapePath();
  for (const c of caminho.commands) {
    if (c.type === 'M') shapePath.moveTo(c.x, -c.y);
    else if (c.type === 'L') shapePath.lineTo(c.x, -c.y);
    else if (c.type === 'Q') shapePath.quadraticCurveTo(c.x1, -c.y1, c.x, -c.y);
    else if (c.type === 'C') shapePath.bezierCurveTo(c.x1, -c.y1, c.x2, -c.y2, c.x, -c.y);
  }
  const geo = new THREE.ExtrudeGeometry(shapePath.toShapes(false), {
    depth: 14, curveSegments: 14,
    bevelEnabled: true, bevelThickness: 7, bevelSize: 2.6, bevelSegments: 10
  });
  geo.center();
  // Todos os objetos ficam do mesmo tamanho visual
  geo.computeBoundingBox();
  const t = new THREE.Vector3();
  geo.boundingBox.getSize(t);
  const escala = Math.min(300 / t.x, 170 / t.y);
  geo.scale(escala, escala, escala);
  geo.computeVertexNormals();
  return geo;
}

// Sorteia 1500 pontos na superfície do objeto
function criarNuvem(geo) {
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(geo)).build();
  const pontos = new Float32Array(TOTAL_PONTOS * 3);
  const p = new THREE.Vector3();
  for (let i = 0; i < TOTAL_PONTOS; i++) {
    sampler.sample(p);
    pontos[i * 3] = p.x; pontos[i * 3 + 1] = p.y; pontos[i * 3 + 2] = p.z;
  }
  return pontos;
}

function texturaBolinha() {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(16, 16, 15, 0, Math.PI * 2); ctx.fill();
  return new THREE.CanvasTexture(c);
}

async function iniciar() {
  // ---------- Dois desenhos: objeto sólido e pontinhos ----------
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const rSolido = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  rSolido.setPixelRatio(dpr);
  rSolido.toneMapping = THREE.ACESFilmicToneMapping;
  rSolido.toneMappingExposure = 1.15;
  rSolido.outputColorSpace = THREE.SRGBColorSpace;
  rSolido.domElement.className = 'solido';

  const rPontos = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  rPontos.setPixelRatio(dpr);
  rPontos.domElement.className = 'pontos-3d';

  const camera = new THREE.PerspectiveCamera(20, 1, 1, 10000);

  // Cena do objeto sólido
  const cenaSolido = new THREE.Scene();
  cenaSolido.environment = new THREE.PMREMGenerator(rSolido).fromScene(criarEstudio(), 0.02).texture;
  const luz1 = new THREE.DirectionalLight(0xffffff, 2.2); luz1.position.set(-300, 400, 500);
  const luz2 = new THREE.DirectionalLight(0xffffff, 1.2); luz2.position.set(400, -200, 300);
  cenaSolido.add(luz1, luz2);

  // Cena dos pontinhos (a névoa deixa os pontos de trás mais apagados)
  const cenaPontos = new THREE.Scene();
  cenaPontos.fog = new THREE.Fog(0x050505, 1, 2);

  // ---------- Fonte e objetos ----------
  const buffer = await fetch(FONTE_URL).then(r => {
    if (!r.ok) throw new Error('Fonte não carregou');
    return r.arrayBuffer();
  });
  const fonte = opentype.parse(buffer);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 1, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.05
  });

  const grupoSolido = new THREE.Group();
  cenaSolido.add(grupoSolido);
  const objetos = [], nuvens = [];
  for (const texto of textos) {
    const geo = criarGeometria(fonte, texto);
    const mesh = new THREE.Mesh(geo, material);
    mesh.visible = false;
    grupoSolido.add(mesh);
    objetos.push(mesh);
    nuvens.push(criarNuvem(geo));
  }

  caixa.append(rSolido.domElement, rPontos.domElement);

  // ---------- Pontinhos ----------
  const posicoes = new Float32Array(nuvens[atual]);
  const geoPontos = new THREE.BufferGeometry();
  geoPontos.setAttribute('position', new THREE.BufferAttribute(posicoes, 3));
  geoPontos.setDrawRange(0, 0);
  const matPontos = new THREE.PointsMaterial({
    size: 4.5, sizeAttenuation: false, map: texturaBolinha(),
    transparent: true, alphaTest: 0.01, depthWrite: false, color: 0xffffff
  });
  const grupoPontos = new THREE.Group();
  grupoPontos.add(new THREE.Points(geoPontos, matPontos));
  cenaPontos.add(grupoPontos);

  // Morph: os pontinhos saem da forma atual e vão para a forma nova
  let de = new Float32Array(nuvens[atual]);
  let para = nuvens[atual];
  let progressoMorph = 1;
  iniciarMorph = indice => {
    de = new Float32Array(posicoes);
    para = nuvens[indice];
    progressoMorph = 0;
  };

  // ---------- Tamanho ----------
  let H = 1;
  function redimensionar() {
    const W = caixa.clientWidth;
    H = caixa.clientHeight;
    if (!W || !H) return;
    rSolido.setSize(W, H, false);
    rPontos.setSize(W, H, false);
    camera.aspect = W / H;
    const meia = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const dist = Math.max(150 / (meia * camera.aspect) / 0.8, 85 / meia / 0.8);
    camera.position.set(0, 0, dist);
    camera.near = dist / 4; camera.far = dist * 4;
    camera.updateProjectionMatrix();
    cenaPontos.fog.near = dist - 150;
    cenaPontos.fog.far = dist + 260;
  }
  new ResizeObserver(redimensionar).observe(caixa);
  redimensionar();

  // ---------- Tema claro/escuro ----------
  function ajustarTema() {
    const css = getComputedStyle(document.documentElement);
    material.color.set(css.getPropertyValue('--metal').trim());
    matPontos.color.set(css.getPropertyValue('--pontinhos').trim());
    cenaPontos.fog.color.set(getComputedStyle(document.documentElement).getPropertyValue('--fundo').trim());
  }
  ajustarTema();
  new MutationObserver(ajustarTema).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ---------- Animação ----------
  let angulo = 0, velocidade = 0, quantidade = 0;
  const suave = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  let visivel = true;
  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }).observe(caixa);

  carregado = true;
  if (atual !== (window.paginaInicial || 0)) iniciarMorph(atual);
  // Entrada: os pontinhos vão aparecendo e depois o objeto sólido é revelado
  setTimeout(() => {
    if (!document.getElementById('nav').matches(':hover')) window.cromado3d.solido();
  }, 1100);

  function loop() {
    requestAnimationFrame(loop);
    if (!visivel) return;

    // Quantidade de pontinhos crescendo no começo
    if (quantidade < TOTAL_PONTOS) {
      quantidade += (TOTAL_PONTOS - quantidade) * 0.1;
      if (quantidade > TOTAL_PONTOS - 5) quantidade = TOTAL_PONTOS;
      geoPontos.setDrawRange(0, Math.round(quantidade));
    }

    // Giro: acelera até a velocidade máxima
    if (quantidade >= TOTAL_PONTOS && velocidade < VEL_MAXIMA) velocidade += ACELERACAO;
    angulo += velocidade;
    grupoSolido.rotation.y = -angulo;
    grupoPontos.rotation.y = -angulo;

    // Abertura do círculo (pontinhos ↔ sólido)
    if (passoAbertura) {
      abertura = Math.min(1, Math.max(0, abertura + passoAbertura));
      if (abertura === 0 || abertura === 1) passoAbertura = 0;
    }

    // Só troca o objeto sólido quando ele está escondido
    if (abertura <= 0.05) objetos.forEach((o, i) => { o.visible = i === atual; });

    // Morph dos pontinhos (só anda enquanto o sólido está quase fechado)
    if (progressoMorph < 1 && abertura < 0.4) {
      progressoMorph = Math.min(1, progressoMorph + 0.02);
      const k = suave(progressoMorph);
      for (let i = 0; i < posicoes.length; i++) posicoes[i] = de[i] + (para[i] - de[i]) * k;
      geoPontos.attributes.position.needsUpdate = true;
    }

    // Círculo que revela o sólido, vindo de cima
    rSolido.domElement.style.clipPath = `circle(${abertura * RAIO_CIRCULO}px at 50% ${H / 2 + CENTRO_CIRCULO}px)`;
    matPontos.opacity = Math.max(0, 1 - abertura * 1.1);
    rPontos.domElement.style.visibility = abertura >= 0.95 ? 'hidden' : 'visible';

    if (abertura > 0) rSolido.render(cenaSolido, camera);
    if (abertura < 0.95) rPontos.render(cenaPontos, camera);
  }
  requestAnimationFrame(loop);
}
