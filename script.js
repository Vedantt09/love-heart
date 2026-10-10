
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let time = 0;

const count = 1000;

const colorChoices = [
  "#ff174d",
  "#ff4d88",
  "#ffb5d0",
  "#ff003c",
  "#ff80ab"
];

const parameters = {
  max: 0.04
};

// Arrays inspired by your original particle loop
const randoms = new Float32Array(count);
const randoms1 = new Float32Array(count);
const scales = new Float32Array(count);
const colors = new Float32Array(count * 3);
const speeds = new Float32Array(count);

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  createParticles();
}

function heartPoint(t, scale) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3) * scale,
    y: -(13 * Math.cos(t)
      - 5 * Math.cos(2 * t)
      - 2 * Math.cos(3 * t)
      - Math.cos(4 * t)) * scale
  };
}

function createParticles() {
  particles = [];

  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  const scale = Math.min(w / 38, h / 34) * 0.85;
  const cx = w / 2;
  const cy = h / 2 + 5;

  // Corrected version of your original loop
  for (let i = 0; i < count; i++) {
    const phi = Math.random() * Math.PI * 2;
    const i3 = 3 * i;

    randoms[i] = Math.random();
    randoms1[i] = Math.random();

    scales[i] = Math.random() * 0.35;

    const colorIndex = Math.floor(
      Math.random() * colorChoices.length
    );

    const color = colorChoices[colorIndex];

    // Convert hex color into RGB components
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;

    colors[i3 + 0] = r;
    colors[i3 + 1] = g;
    colors[i3 + 2] = b;

    speeds[i] = Math.random() * parameters.max;

    const p = heartPoint(phi, scale);

    // Spread particles slightly around the heart outline
    const spread = 5 + scales[i] * 22;
    const x = cx + p.x
      + (Math.random() - 0.5) * spread;
    const y = cy + p.y
      + (Math.random() - 0.5) * spread;

    particles.push({
      x,
      y,
      size: 0.5 + randoms[i] * 2.2,
      phase: randoms1[i] * Math.PI * 2,
      speed: speeds[i],
      color,
      drift: scales[i] * 0.5
    });
  }
}

function animate() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  ctx.clearRect(0, 0, w, h);

  time += 0.03;

  for (const p of particles) {
    const glow =
      (Math.sin(time + p.phase) + 1) / 2;

    const driftX =
      Math.sin(time * 2 + p.phase) * p.drift;

    const driftY =
      Math.cos(time * 2 + p.phase) * p.drift;

    ctx.globalAlpha = 0.3 + glow * 0.7;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 4 + glow * 12;

    ctx.beginPath();

    ctx.arc(
      p.x + driftX,
      p.y + driftY,
      p.size * (0.7 + glow * 0.7),
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animate();
