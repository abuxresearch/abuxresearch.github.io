(() => {
  const targets = document.querySelectorAll("#solutions, .about, #clients");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!targets.length || reduceMotion.matches || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  targets.forEach((target) => {
    target.classList.add("reveal-on-scroll");
    observer.observe(target);
  });
})();

(() => {
  const canvas = document.querySelector(".hero-datapoints");
  const hero = canvas?.closest(".hero");
  const context = canvas?.getContext("2d");
  if (!canvas || !hero || !context) return;

  const dots = [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let animationFrame = 0;
  let seed = 417;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const resize = () => {
    const bounds = hero.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    dots.length = 0;

    const gapX = width < 700 ? 17 : 21;
    const gapY = width < 700 ? 17 : 20;
    for (let x = 0; x <= width; x += gapX) {
      const sweep = Math.min(x / Math.max(width, 1), 1);
      const top = height * (.96 * (1 - Math.pow(sweep, 2.8)));
      for (let y = top; y <= height; y += gapY) {
        dots.push({
          x: x + (random() - .5) * 4,
          y: y + (random() - .5) * 4,
          radius: .65 + random() * 1.05,
          alpha: .34 + random() * .5,
          phase: random() * Math.PI * 2,
          speed: .00035 + random() * .00045,
          drift: 1.2 + random() * 1.8,
        });
      }
    }
  };

  const draw = (timestamp) => {
    context.clearRect(0, 0, width, height);

    dots.forEach((dot) => {
      const time = reduceMotion ? 0 : timestamp;
      const x = dot.x + Math.sin(time * dot.speed + dot.phase) * dot.drift;
      const y = dot.y + Math.cos(time * dot.speed * .8 + dot.phase) * dot.drift;
      context.beginPath();
      context.arc(x, y, dot.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 255, 255, ${dot.alpha})`;
      context.fill();
    });

    if (!reduceMotion) animationFrame = window.requestAnimationFrame(draw);
  };

  resize();
  if (reduceMotion) draw(0);
  else animationFrame = window.requestAnimationFrame(draw);
  window.addEventListener("resize", () => {
    resize();
    if (reduceMotion) draw(0);
  }, { passive: true });
})();
