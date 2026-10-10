
const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  createParticles();
}

function heartPoint(t, scale) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3) * scale,
    y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t)
      - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale
  };
}

function createParticles() {
  particles = [];

  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const scale = Math.min(w / 38, h / 34);
  const cx = w / 2;
  const cy = h / 2 + 5;

  for (let i = 0; i < 750; i++) {
    const t = Math.random() * Math.PI * 2;
    const p = heartPoint(t, scale);

    particles.push({
      x: cx + p.x + (Math.random() - 0.5) * 12,
      y: cy + p.y + (Math.random() - 0.5) * 12,
      size: Math.random() * 2 + 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.04 + 0.01,
      color: Math.random() > 0.5 ? "#ff174d" : "#ffb5d0"
    });
  }
}

let time = 0;

function animate() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  ctx.clearRect(0, 0, w, h);
  time += 0.03;

  for (const p of particles) {
    const glow = (Math.sin(time + p.phase) + 1) / 2;

    ctx.globalAlpha = 0.25 + glow * 0.75;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = glow * 10;
    ctx.beginPath();
    ctx.arc(
      p.x,
      p.y,
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
