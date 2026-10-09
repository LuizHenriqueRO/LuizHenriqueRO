// Gera os SVGs minimalistas do README (versões clara e escura) em ../assets
// uso: node generator/gen.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
mkdirSync(OUT, { recursive: true });

const SANS = "'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Ubuntu, Arial, sans-serif";
const MONO = "ui-monospace, 'Cascadia Code', 'SF Mono', Consolas, Menlo, 'DejaVu Sans Mono', monospace";

const THEMES = {
  light: { fg: "#0a0a0a", muted: "#6b7280", line: "#e5e7eb", soft: "#f4f4f5", accent: "#059669", accentSoft: "#d1fae5", bubble: "#ffffff" },
  dark: { fg: "#f0f6fc", muted: "#8b949e", line: "#30363d", soft: "#161b22", accent: "#3fb950", accentSoft: "#12261e", bubble: "#0d1117" },
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const n = (v) => Math.round(v * 100) / 100;
const pc = (t, T) => n((t / T) * 100);

const svg = (w, h, body, style, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img"><title>${esc(title)}</title><style>${style.replace(/\s*\n\s*/g, "")}</style>${body}</svg>`;

function write(name, content) {
  writeFileSync(join(OUT, name), content);
  console.log(`${name.padEnd(22)} ${(Buffer.byteLength(content) / 1024).toFixed(1)} KB`);
}

// keyframes que deixam um elemento visível dentro de janelas [ini, fim] de um ciclo de T segundos
function windows(name, wins, T, hidden = "opacity:0", shown = "opacity:1", ease = 0.25) {
  const steps = [`0%{${hidden}}`];
  for (const [a, b] of wins) {
    steps.push(`${pc(Math.max(a - 0.001, 0), T)}%{${hidden}}`, `${pc(a + ease, T)}%{${shown}}`, `${pc(b, T)}%{${shown}}`, `${pc(b + ease, T)}%{${hidden}}`);
  }
  steps.push(`100%{${hidden}}`);
  return `@keyframes ${name}{${steps.join("")}}`;
}

/* ───────────────────────────── CABEÇALHO ───────────────────────────── */
function header(t, mode) {
  const W = 900, H = 250;
  const roles = ["Automação & integrações", "Chatbots com inteligência artificial", "Desenvolvimento web e mobile"];
  const RT = 9;
  const nodes = [[700, 70, "WhatsApp"], [820, 112, "API"], [742, 178, "IA"], [640, 150, "Drive"]];
  const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]];
  const style = `
    .in{opacity:0;animation:in .9s cubic-bezier(.2,.7,.2,1) forwards}
    @keyframes in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    .role{opacity:0;animation:role ${RT}s infinite}
    @keyframes role{0%{opacity:0;transform:translateY(12px)}4%,30%{opacity:1;transform:none}34%,100%{opacity:0;transform:translateY(-12px)}}
    .draw{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.6s .5s cubic-bezier(.6,0,.2,1) forwards}
    @keyframes draw{to{stroke-dashoffset:0}}
    .edge{stroke-dasharray:4 6;animation:flow 3s linear infinite}
    @keyframes flow{to{stroke-dashoffset:-20}}
    .pulse{animation:pulse 2.4s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:.35}50%{opacity:1}}
    .cur{animation:blink 1s steps(1) infinite}@keyframes blink{50%{opacity:0}}`;
  const body = `
    <text x="0" y="34" font-family="${MONO}" font-size="13" fill="${t.muted}" class="in">~/luiz-henrique <tspan fill="${t.accent}" class="cur">▍</tspan></text>
    <text x="-3" y="108" font-family="${SANS}" font-size="58" font-weight="600" letter-spacing="-2" fill="${t.fg}" class="in" style="animation-delay:.15s">Luiz Henrique</text>
    ${roles.map((r, i) => `<text x="0" y="150" font-family="${SANS}" font-size="22" fill="${t.muted}" class="role" style="animation-delay:${i * (RT / 3)}s">${esc(r)}</text>`).join("")}
    <line x1="0" y1="182" x2="520" y2="182" stroke="${t.line}" stroke-width="1"/>
    <line x1="0" y1="182" x2="140" y2="182" stroke="${t.accent}" stroke-width="2" pathLength="1" class="draw"/>
    <text x="0" y="214" font-family="${MONO}" font-size="12.5" fill="${t.muted}" class="in" style="animation-delay:.4s">Goiás, Brasil  ·  ADS — IFG  ·  co-fundador da <tspan fill="${t.fg}">RDL Development</tspan></text>
    ${edges.map(([a, b]) => `<line x1="${nodes[a][0]}" y1="${nodes[a][1]}" x2="${nodes[b][0]}" y2="${nodes[b][1]}" stroke="${t.muted}" stroke-opacity=".6" stroke-width="1" class="edge"/>`).join("")}
    ${nodes.map(([x, y, label], i) => `<g>
      <circle cx="${x}" cy="${y}" r="16" fill="${t.accent}" opacity=".18" class="pulse" style="animation-delay:${n(i * 0.6)}s"/>
      <circle cx="${x}" cy="${y}" r="5" fill="${i === 0 ? t.accent : t.fg}"/>
      <text x="${x}" y="${y + (y > 120 ? 34 : -24)}" text-anchor="middle" font-family="${MONO}" font-size="11.5" fill="${t.muted}">${label}</text></g>`).join("")}`;
  write(`header-${mode}.svg`, svg(W, H, body, style, "Luiz Henrique — automação, integrações e chatbots"));
}

/* ───────────────────────────── CHATBOT CORAL ───────────────────────────── */
function coral(t, mode) {
  const W = 900, H = 460, T = 16, END = 13.4;
  const PX = 40, PY = 20, PW = 300, PH = 420;
  const style = [];
  let k = 0;
  const appear = (start) => {
    const name = `a${k++}`;
    style.push(windows(name, [[start, END]], T, "opacity:0;transform:translateY(8px)", "opacity:1;transform:none", 0.3));
    return `style="animation:${name} ${T}s infinite;opacity:0"`;
  };
  const between = (wins) => {
    const name = `w${k++}`;
    style.push(windows(name, wins, T, "opacity:0", "opacity:1", 0.15));
    return `style="animation:${name} ${T}s infinite;opacity:0"`;
  };

  // balões
  const bubble = (x, y, lines, mine, start) => {
    const w = Math.max(...lines.map((l) => l.length)) * 6.6 + 24, h = lines.length * 17 + 14;
    const bx = mine ? PX + PW - 16 - w : PX + 16;
    return `<g ${appear(start)}>
      <rect x="${n(bx)}" y="${y}" width="${n(w)}" height="${h}" rx="12" fill="${mine ? t.accentSoft : t.soft}" stroke="${mine ? "none" : t.line}"/>
      ${lines.map((l, i) => `<text x="${n(bx + 12)}" y="${y + 22 + i * 17}" font-family="${SANS}" font-size="12" fill="${t.fg}">${esc(l)}</text>`).join("")}</g>`;
  };
  const typing = (y, a, b) => `<g ${between([[a, b]])}>
      <rect x="${PX + 16}" y="${y}" width="54" height="30" rx="12" fill="${t.soft}" stroke="${t.line}"/>
      ${[0, 1, 2].map((i) => `<circle cx="${PX + 31 + i * 12}" cy="${y + 15}" r="3" fill="${t.muted}" style="animation:dot 1s ${i * 0.15}s infinite"/>`).join("")}</g>`;
  const audio = (y, start) => {
    const bx = PX + 16, w = 220;
    let wave = "";
    for (let i = 0; i < 26; i++) {
      const hh = 3 + Math.abs(Math.sin(i * 1.7) * 9) + (i % 3) * 1.5;
      wave += `<rect x="${bx + 44 + i * 5.4}" y="${n(y + 22 - hh / 2)}" width="2.6" height="${n(hh)}" rx="1.3" fill="${t.muted}"/>`;
    }
    return `<g ${appear(start)}>
      <rect x="${bx}" y="${y}" width="${w}" height="62" rx="12" fill="${t.soft}" stroke="${t.line}"/>
      <circle cx="${bx + 22}" cy="${y + 22}" r="12" fill="${t.accent}"/><path d="M${bx + 18} ${y + 15.5}L${bx + 28} ${y + 22}L${bx + 18} ${y + 28.5}Z" fill="${t.bubble}"/>
      ${wave}
      <text x="${bx + 12}" y="${y + 52}" font-family="${MONO}" font-size="10.5" fill="${t.muted}">Tenor — Alfa e Ômega.mp3</text></g>`;
  };

  const chat = [
    bubble(0, 96, ["Oi! Tem a música Alfa e Ômega?"], true, 0.6),
    typing(140, 1.4, 2.5),
    bubble(0, 140, ["Tenho sim! Quer o kit de voz,", "a partitura ou a letra?"], false, 2.6),
    bubble(0, 202, ["Manda a pista de tenor"], true, 4.4),
    typing(246, 5.0, 6.3),
    audio(246, 6.4),
    bubble(0, 322, ["Pronto! Quer as outras vozes", "da mesma música?"], false, 7.6),
  ].join("");

  // fluxo
  const steps = [
    ["WhatsApp Cloud API", "a mensagem chega pelo webhook", [[0.6, 1.2], [4.4, 5.0]]],
    ["Node.js + Express", "servidor recebe e orquestra", [[0.9, 1.5], [4.7, 5.3]]],
    ["Redis", "lembra o contexto da conversa", [[1.2, 1.8], [5.0, 5.6]]],
    ["OpenAI · gpt-4o-mini", "entende a intenção (function calling)", [[1.5, 2.3], [5.3, 6.0]]],
    ["Google Drive API", "busca a mídia no acervo", [[5.7, 6.3]]],
    ["Entrega", "envia áudio, PDF ou texto", [[2.3, 2.9], [6.1, 6.8], [7.4, 8.0]]],
  ];
  const FX = 420, FY = 78, FS = 60;
  const flow = `
    <text x="${FX - 12}" y="44" font-family="${MONO}" font-size="12" fill="${t.muted}">// o que acontece a cada mensagem</text>
    <line x1="${FX}" y1="${FY}" x2="${FX}" y2="${FY + FS * (steps.length - 1)}" stroke="${t.line}" stroke-width="1.5"/>
    ${steps.map(([title, sub, wins], i) => {
      const y = FY + i * FS;
      return `<g>
        <circle cx="${FX}" cy="${y}" r="7" fill="${t.bubble}" stroke="${t.muted}" stroke-width="1.5"/>
        <text x="${FX + 26}" y="${y + 1}" font-family="${SANS}" font-size="15" font-weight="600" fill="${t.fg}">${esc(title)}</text>
        <text x="${FX + 26}" y="${y + 20}" font-family="${SANS}" font-size="12.5" fill="${t.muted}">${esc(sub)}</text>
        <g ${between(wins)}>
          <circle cx="${FX}" cy="${y}" r="15" fill="${t.accent}" opacity=".2"/>
          <circle cx="${FX}" cy="${y}" r="7" fill="${t.accent}"/>
          <text x="${FX + 26}" y="${y + 1}" font-family="${SANS}" font-size="15" font-weight="600" fill="${t.accent}">${esc(title)}</text>
        </g></g>`;
    }).join("")}`;

  const phone = `
    <rect x="${PX}" y="${PY}" width="${PW}" height="${PH}" rx="34" stroke="${t.line}" stroke-width="1.5" fill="${t.bubble}"/>
    <rect x="${PX + PW / 2 - 34}" y="${PY + 10}" width="68" height="8" rx="4" fill="${t.line}"/>
    <circle cx="${PX + 34}" cy="${PY + 50}" r="15" fill="${t.accentSoft}"/>
    <path d="M${PX + 29} ${PY + 55}V${PY + 44}L${PX + 39} ${PY + 42}V${PY + 53}" stroke="${t.accent}" stroke-width="1.8" fill="none"/>
    <circle cx="${PX + 27}" cy="${PY + 55}" r="2.6" fill="${t.accent}"/><circle cx="${PX + 37}" cy="${PY + 53}" r="2.6" fill="${t.accent}"/>
    <text x="${PX + 58}" y="${PY + 47}" font-family="${SANS}" font-size="13.5" font-weight="600" fill="${t.fg}">Bot Coral Jovem</text>
    <text x="${PX + 58}" y="${PY + 63}" font-family="${SANS}" font-size="11" fill="${t.accent}">online</text>
    <line x1="${PX}" y1="${PY + 78}" x2="${PX + PW}" y2="${PY + 78}" stroke="${t.line}"/>`;

  const css = `@keyframes dot{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(-3px);opacity:1}}${style.join("")}`;
  write(`coral-${mode}.svg`, svg(W, H, phone + chat + flow, css, "Chatbot Coral: conversa no WhatsApp e o fluxo de cada mensagem"));
}

/* ───────────────────────────── RDL ───────────────────────────── */
function rdl(t, mode) {
  const W = 900, H = 150;
  const letters = [["R", "Robson"], ["D", "Daniel"], ["L", "Luiz"]];
  const style = `
    .sweep{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 5s cubic-bezier(.6,0,.2,1) infinite}
    @keyframes draw{0%{stroke-dashoffset:1}40%,80%{stroke-dashoffset:0}100%{stroke-dashoffset:-1}}
    .me{animation:pulse 2.6s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:.45}50%{opacity:1}}`;
  const body = `
    <text x="0" y="40" font-family="${MONO}" font-size="12.5" fill="${t.muted}">startup</text>
    <text x="-1" y="80" font-family="${SANS}" font-size="30" font-weight="600" letter-spacing="-.8" fill="${t.fg}">RDL Development</text>
    <text x="0" y="110" font-family="${SANS}" font-size="15" fill="${t.muted}">Tiramos ideias do papel e colocamos no ar.</text>
    <line x1="0" y1="132" x2="380" y2="132" stroke="${t.accent}" stroke-width="2" pathLength="1" class="sweep"/>
    ${letters.map(([ch, name], i) => {
      const x = 600 + i * 100, me = ch === "L";
      return `<g>
        ${me ? `<rect x="${x - 6}" y="20" width="84" height="84" rx="16" fill="${t.accent}" opacity=".18" class="me"/>` : ""}
        <rect x="${x}" y="26" width="72" height="72" rx="12" fill="${me ? t.accent : "none"}" stroke="${me ? t.accent : t.line}" stroke-width="1.5"/>
        <text x="${x + 36}" y="76" text-anchor="middle" font-family="${SANS}" font-size="34" font-weight="600" fill="${me ? t.bubble : t.fg}">${ch}</text>
        <text x="${x + 36}" y="126" text-anchor="middle" font-family="${MONO}" font-size="11.5" fill="${me ? t.accent : t.muted}">${name}</text></g>`;
    }).join("")}`;
  write(`rdl-${mode}.svg`, svg(W, H, body, style, "RDL Development — Robson, Daniel e Luiz"));
}

for (const [mode, t] of Object.entries(THEMES)) {
  header(t, mode);
  coral(t, mode);
  rdl(t, mode);
}
