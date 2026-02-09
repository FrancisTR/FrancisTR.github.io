'use client';
import React, { useEffect, useRef } from 'react';

type PhysicsConfig = {
  // Random ball count per tile
  minBalls?: number;
  maxBalls?: number;

  // Per-tile color palette (required)
  colors: string[];

  // Physics tuning
  gravity?: number; // 0..1 (1 ~ earth)
  radiusRange?: [number, number]; // px
  restitution?: number; // bounciness 0..1
  friction?: number; // surface friction
  frictionAir?: number; // air drag (0..~0.05)
  pixelRatio?: number; // default: devicePixelRatio

  // Shake intensity when user scrolls (0.0005..0.01 typical)
  shakeForce?: number;
};

type Skill = {
  name: string;
  src: string; // icon path
  palette: string[]; // ball colors for this skill
  options?: Omit<PhysicsConfig, 'colors'>;
};

function PhysicsCanvas({
  logoSrc,
  logoAlt,
  config,
  className = 'h-40 sm:h-44 md:h-48', // tweak height or use "aspect-square"
}: {
  logoSrc: string;
  logoAlt: string;
  config: PhysicsConfig;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    let resizeObs: ResizeObserver | null = null;
    let removeScrollHandlers: (() => void) | null = null;
    let detachScrollPassThrough: (() => void) | null = null;

    (async () => {
      const el = containerRef.current;
      if (!el) return;

      // SSR-safe: load Matter.js only on the client
      const Matter = await import('matter-js');
      if (!mounted) return;

      const {
        Engine,
        Render,
        Runner,
        Composite,
        Bodies,
        Body,
        Events,
      } = Matter;

      //Config (sensible defaults)
      const cfg: Required<PhysicsConfig> = {
        minBalls: config.minBalls ?? 6,
        maxBalls: config.maxBalls ?? 12,
        colors: config.colors.length ? config.colors : ['#3b82f6', '#22c55e', '#ef4444'],
        gravity: config.gravity ?? 1,
        radiusRange: config.radiusRange ?? [8, 18],
        restitution: config.restitution ?? 0.9,
        friction: config.friction ?? 0.04,
        frictionAir: config.frictionAir ?? 0.002,
        pixelRatio:
          config.pixelRatio ??
          (typeof window !== 'undefined' ? window.devicePixelRatio ?? 1 : 1),
        shakeForce: config.shakeForce ?? 0.002, // gentle jostle on scroll
      };

      // Size to bounding box
      const rect = el.getBoundingClientRect();
      let width = Math.max(10, Math.floor(rect.width));
      let height = Math.max(10, Math.floor(rect.height));

      // Engine, renderer, runner (Matter)
      const engine = Engine.create();
      engine.gravity.y = cfg.gravity;

      const render = Render.create({
        element: el,
        engine,
        options: {
          width,
          height,
          background: 'transparent',
          wireframes: false,
          pixelRatio: cfg.pixelRatio,
        },
      });

      const runner = Runner.create();

      // Walls (keep balls inside)
      const CAT_BALL = 0x0001;
      const CAT_WALL = 0x0002;

      const makeWalls = () => {
        const t = 40; // wall thickness (thick prevents tunneling)
        const half = t / 2;
        const walls = [
          Bodies.rectangle(width / 2, -half, width, t, {
            isStatic: true,
            collisionFilter: { category: CAT_WALL, mask: CAT_BALL },
            render: { fillStyle: 'transparent' },
          }),
          Bodies.rectangle(width / 2, height + half, width, t, {
            isStatic: true,
            collisionFilter: { category: CAT_WALL, mask: CAT_BALL },
            render: { fillStyle: 'transparent' },
          }),
          Bodies.rectangle(-half, height / 2, t, height, {
            isStatic: true,
            collisionFilter: { category: CAT_WALL, mask: CAT_BALL },
            render: { fillStyle: 'transparent' },
          }),
          Bodies.rectangle(width + half, height / 2, t, height, {
            isStatic: true,
            collisionFilter: { category: CAT_WALL, mask: CAT_BALL },
            render: { fillStyle: 'transparent' },
          }),
        ];
        Composite.add(engine.world, walls);
        return walls;
      };

      let walls = makeWalls();

      // Balls
      const randInt = (a: number, b: number) =>
        Math.floor(Math.random() * (b - a + 1)) + a;

      const [rmin, rmax] = cfg.radiusRange;
      const count = randInt(cfg.minBalls, cfg.maxBalls);
      const balls: Matter.Body[] = [];

      for (let i = 0; i < count; i++) {
        const r = randInt(rmin, rmax);
        const x = randInt(r + 4, width - r - 4);
        const y = randInt(r + 4, Math.max(r + 4, Math.floor(height * 0.35)));
        const color = cfg.colors[randInt(0, cfg.colors.length - 1)];
        const ball = Bodies.circle(x, y, r, {
          restitution: cfg.restitution,
          friction: cfg.friction,
          frictionAir: cfg.frictionAir,
          collisionFilter: { category: CAT_BALL, mask: CAT_BALL | CAT_WALL }, // always collide with walls
          render: {
            fillStyle: color,
            strokeStyle: 'rgba(0,0,0,0.08)',
            lineWidth: 1,
          },
        });
        balls.push(ball);
        Composite.add(engine.world, ball);
      }

      // Mouse/drag interaction removed to prevent touch scroll conflicts on mobile.

      // Allow page scroll while over the canvas
      const enableWheelScrollPassThrough = (canvas: HTMLCanvasElement) => {
        // Let the browser do native vertical panning on touch.
        canvas.style.touchAction = 'pan-y';

        // Use capturing + passive listener so we never call preventDefault,
        // and we run before Matter's own bubbling listeners. We stop propagation
        // so Matter doesn't receive the event and thus can't cancel page scroll.
        const useCapture = true;
        const opts: AddEventListenerOptions = { passive: true, capture: useCapture };

        const onWheel = (e: Event) => {
          e.stopImmediatePropagation();
          // No preventDefault — we want the page to scroll.
        };
        const onTouchMove = (e: Event) => {
          e.stopImmediatePropagation();
        };

        canvas.addEventListener('wheel', onWheel as EventListener, opts);
        canvas.addEventListener('mousewheel', onWheel as EventListener, opts); // legacy
        canvas.addEventListener('DOMMouseScroll', onWheel as EventListener, opts); // Firefox legacy
        canvas.addEventListener('touchmove', onTouchMove as EventListener, opts);

        return () => {
          canvas.removeEventListener('wheel', onWheel as EventListener, useCapture);
          canvas.removeEventListener('mousewheel', onWheel as EventListener, useCapture);
          canvas.removeEventListener('DOMMouseScroll', onWheel as EventListener, useCapture);
          canvas.removeEventListener('touchmove', onTouchMove as EventListener, useCapture);
        };
      };

      // Enable scroll pass-through now that the canvas exists
      detachScrollPassThrough = enableWheelScrollPassThrough(render.canvas);

      // Helper: keep a body fully inside the rectangle [0..width]x[0..height]
      const clampInside = (b: Matter.Body) => {
        const r = (b as any).circleRadius ?? 12;
        const minX = r + 1;
        const maxX = width - r - 1;
        const minY = r + 1;
        const maxY = height - r - 1;

        const nx = Math.min(maxX, Math.max(minX, b.position.x));
        const ny = Math.min(maxY, Math.max(minY, b.position.y));

        if (nx !== b.position.x || ny !== b.position.y) {
          // Move inside and damp outward velocity to avoid jitter
          Body.setPosition(b, { x: nx, y: ny });

          const vx = b.velocity.x;
          const vy = b.velocity.y;

          // Zero out velocity pointing outside the box
          const outLeft = b.position.x <= minX && vx < 0;
          const outRight = b.position.x >= maxX && vx > 0;
          const outTop = b.position.y <= minY && vy < 0;
          const outBottom = b.position.y >= maxY && vy > 0;

          Body.setVelocity(b, {
            x: (outLeft || outRight) ? 0 : vx,
            y: (outTop || outBottom) ? 0 : vy,
          });
        }
      };

      // Clamp every tick: ensures NO ball escapes (even while shaking)
      Events.on(engine, 'afterUpdate', () => {
        for (const b of balls) clampInside(b);
      });

      // Shake on scroll
      // Apply a small impulse to all balls based on scroll velocity.
      const addScrollShakeListeners = () => {
        let lastY = window.scrollY;
        let lastT = performance.now();

        const onScroll = () => {
          const now = performance.now();
          const dy = window.scrollY - lastY; // px
          const dt = Math.max(8, now - lastT); // ms
          lastY = window.scrollY;
          lastT = now;

          const v = Math.max(-1, Math.min(1, dy / dt)); // px/ms clamp
          // Tiny force so it feels like a jostle, not chaos
          const fy = cfg.shakeForce * v;
          const fx = cfg.shakeForce * v * (Math.random() * 0.6 - 0.3);

          for (const b of balls) {
            Body.applyForce(b, b.position, { x: fx, y: fy });
            Body.setAngularVelocity(
              b,
              b.angularVelocity + (Math.random() * 0.02 - 0.01),
            );
          }
        };

        // Passive listeners to never block scrolling
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('wheel', onScroll, { passive: true });

        return () => {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('wheel', onScroll);
        };
      };

      removeScrollHandlers = addScrollShakeListeners();

      /* Start */
      Render.run(render);
      Runner.run(runner, engine);

      /* Resize sync */
      const onResize = () => {
        const r = el.getBoundingClientRect();
        width = Math.max(10, Math.floor(r.width));
        height = Math.max(10, Math.floor(r.height));

        render.canvas.width = width * cfg.pixelRatio;
        render.canvas.height = height * cfg.pixelRatio;
        render.canvas.style.width = `${width}px`;
        render.canvas.style.height = `${height}px`;
        render.options.width = width;
        render.options.height = height;

        Composite.remove(engine.world, walls);
        walls = makeWalls();

        // Also clamp current balls so none sit outside after resize
        for (const b of balls) clampInside(b);
      };

      resizeObs = new ResizeObserver(onResize);
      resizeObs.observe(el);
    })();

    return () => {
      mounted = false;
      if (resizeObs) resizeObs.disconnect();
      if (removeScrollHandlers) removeScrollHandlers();
      if (detachScrollPassThrough) detachScrollPassThrough();

      // Best-effort teardown: remove the canvas;
      // Matter objects will be GC'd after render/runner stop.
      const el = containerRef.current;
      const canvas = el?.querySelector('canvas');
      try {
        canvas?.remove();
      } catch {
        /* no-op */
      }
    };
  }, [config]);

  return (
    <div
      ref={containerRef}
      /* This div is the *card box* — the canvas fills to the border.
         No padding here so balls reach the visible edges (but remain inside). */
      className={`relative w-full overflow-hidden ${className}`}
    >
      {/* Centered logo; pointer-events:none so you can drag balls beneath it */}
      <img
        src={logoSrc}
        alt={logoAlt}
        className="pointer-events-none absolute inset-0 z-10 m-auto h-24 w-40 object-contain opacity-90"
        loading="lazy"
      />
    </div>
  );
}

export default function Skills() {
  // Per-tile palettes (customize freely)
  const skills: Skill[] = [
    { name: 'Python', src: './Python.png', palette: ['#3776AB', '#FFE873', '#306998', '#FFCA3A'] },
    { name: 'HTML', src: './html.webp', palette: ['#E34F26', '#F06529', '#F29C6B', '#FF7A45'] },
    { name: 'CSS', src: './css.webp', palette: ['#1572B6', '#2965F1', '#60A5FA', '#93C5FD'] },
    { name: 'TypeScript', src: './Typescript.webp', palette: ['#3178C6', '#2F74C0', '#4AA3FF', '#90CAF9'] },
    { name: 'React', src: './React.png', palette: ['#61DAFB', '#38BDF8', '#22D3EE', '#06B6D4'] },
    { name: 'Tailwind CSS', src: './Tailwind.webp', palette: ['#06B6D4', '#22D3EE', '#7DD3FC', '#A5F3FC'] },
    { name: 'Next.js', src: './Nextjs.png', palette: ['#111827', '#4B5563', '#9CA3AF', '#D1D5DB'] },
    { name: 'SupaBase', src: './Supabase.png', palette: ['#3ECF8E', '#10B981', '#34D399', '#6EE7B7'] },
    { name: 'Salesforce', src: './Salesforce.png', palette: ['#00A1E0', '#33C3F0', '#60A5FA', '#93C5FD'] },
  ];

  // Global defaults; override per skill via `options` if desired
  const baseConfig: Omit<PhysicsConfig, 'colors'> = {
    minBalls: 6,
    maxBalls: 12,
    gravity: 1,
    radiusRange: [8, 18],
    restitution: 0.9,
    friction: 0.04,
    frictionAir: 0.002,
    shakeForce: 0.002, // increase for stronger jostle on scroll
  };

  return (
    <section id="skills" className="scroll-mt-16">
      {/* Sticky header for accessibility (unchanged) */}
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="shiny text-xl font-bold uppercase tracking-widest lg:sr-only">
          Skills
        </h2>
      </div>

      <div className="mb-8 flex flex-col gap-4">
        <h2 className="shiny hidden text-3xl font-bold lg:block lg:text-start">Skills</h2>
      </div>

      {/* Responsive grid: 2 cols on tiny screens, 3 cols from sm+ */}
      <ul role="list" className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
        {skills.map((s) => (
          <li
            key={s.name}
            className="group overflow-hidden rounded-xl border transition-shadow hover:shadow-md"
          >
            {/* Physics area fills up to the border */}
            <PhysicsCanvas
              logoSrc={s.src}
              logoAlt={`${s.name} logo`}
              config={{ ...baseConfig, colors: s.palette, ...(s.options ?? {}) }}
              className="h-40 sm:h-44 md:h-48" // or "aspect-square"
            />

            {/* Label inside the same card (clean, simple) */}
            <div className="p-4 bg-[var(--skills-card-bg)]">
              <p className="text-center text-sm font-medium text-foreground">
                {s.name}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}