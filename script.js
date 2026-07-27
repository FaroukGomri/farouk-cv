// ---- Content: edit this to update your CV ----
const commands = {
  help: () => `Available commands:
  whoami       - who is Farouk
  experience   - work history
  skills       - technical skills
  education    - degree info
  languages    - spoken languages
  contact      - how to reach me
  github       - open my GitHub
  clear        - clear the screen`,

  whoami: () => `Farouk Gomri
Junior Software Developer — Sfax, Tunisia
Backend-focused, .NET / ASP.NET Core specialist.
Building scalable APIs with clean architecture since 2024.`,

  experience: () => `<span class="cyan">2025 — Current</span>  Freelance Backend Developer
  Designed backend systems using ASP.NET Core.
  Built scalable APIs with modular architecture.
  Implemented authentication & role-based authorization.

<span class="cyan">2025</span>            Intern @ ACS Advanced Computer Solutions
  Built an asset management system for tracking resources.
  Diagnosed and resolved functionality issues.

<span class="cyan">2024</span>            Intern @ Infosoft
  Contributed to application development and debugging.`,

  skills: () => `C#   Python   JavaScript   SQL   .NET`,

  education: () => `Bachelor's Degree, Computer Science — Big Data Analysis (2025)
University of Sfax — Higher Institute of Multimedia`,

  languages: () => `Arabic     native
English    fluent
French     intermediate
Spanish    basic`,

  contact: () => `Email    farouk.gomri@gmail.com
Phone    22 604 485
Address  Sfax, Tunisia`,

  github: () => {
    window.open('https://github.com/FaroukGomri', '_blank');
    return `Opening github.com/FaroukGomri ...`;
  },

  clear: () => { screen.innerHTML = ''; return null; }
};

let cursorEl = null;
function showCursor(){
  if (cursorEl) cursorEl.remove();
  cursorEl = document.createElement('span');
  cursorEl.className = 'cursor-blink';
  screen.appendChild(cursorEl);
  screen.scrollTop = screen.scrollHeight;
}

const screen = document.getElementById('screen');
const input = document.getElementById('cmd-input');

function print(html) {
  const line = document.createElement('div');
  line.innerHTML = html;
  screen.appendChild(line);
  screen.scrollTop = screen.scrollHeight;
}

async function typeLine(text, delay = 15) {
  const line = document.createElement('div');
  screen.appendChild(line);
  for (const char of text) {
    line.innerHTML += char;
    await new Promise(r => setTimeout(r, delay));
  }
  screen.scrollTop = screen.scrollHeight;
}

async function boot() {
  screen.innerHTML = '';
  const bootLines = [
    'Booting farouk@sfax OS...',
    'Loading CV modules... done',
    'Type "help" to see available commands.',
  ];
  for (const line of bootLines) {
    await typeLine(line);
  }
  showCursor();
}

input.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const raw = input.value.trim();
  const cmd = raw.toLowerCase();
  print(`<span class="cyan">farouk@sfax:~$</span> ${raw}`);
  input.value = '';

  if (cmd in commands) {
    const output = commands[cmd]();
    if (output) print(output);
  } else if (cmd === '') {
    
  } else {
    print(`<span class="red">command not found: ${cmd}</span> — type <span class="cyan">help</span>`);
  }
  showCursor();
});

document.getElementById('quick-commands').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const cmd = btn.dataset.cmd;
  print(`<span class="cyan">farouk@sfax:~$</span> ${cmd}`);
  const output = commands[cmd]();
  if (output) print(output);
  input.focus();
  showCursor();
});

const crtToggle = document.getElementById('crt-toggle');
const CRT_KEY = 'crt-mode-enabled';

function setCrtMode(enabled) {
  document.body.classList.toggle('crt-mode', enabled);
  crtToggle.setAttribute('aria-pressed', enabled);
  localStorage.setItem(CRT_KEY, enabled ? '1' : '0');
}

crtToggle.addEventListener('click', () => {
  const isOn = document.body.classList.contains('crt-mode');
  setCrtMode(!isOn);
});

const savedCrt = localStorage.getItem(CRT_KEY) === '1';
setCrtMode(savedCrt);

const revealObserver  = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.5});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== Background code rain (layered over the dot-grid) =====
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const rainChars = '01アイウエオカキクケコ{}[]<>/;=+-'.split('');
let columns, drops;

function setupRain() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const fontSize = 16;
  columns = Math.floor(canvas.width / fontSize);
  drops = new Array(columns).fill(0).map(() => Math.random() * -100);
}

function drawRain() {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(232, 180, 101, 0.35)';
  ctx.font = '16px JetBrains Mono, monospace';

  drops.forEach((y, i) => {
    const char = rainChars[Math.floor(Math.random() * rainChars.length)];
    const x = i * 16;
    ctx.fillText(char, x, y);
    if (y > canvas.height && Math.random() > 0.98) {
      drops[i] = 0;
    } else {
      drops[i] += 16;
    }
  });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  setupRain();
  window.addEventListener('resize', setupRain);
  setInterval(drawRain, 90);
}

boot();