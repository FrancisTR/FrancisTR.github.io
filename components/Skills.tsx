'use client';
import { useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';

// Constants
const WALL_THICKNESS = 40;
const WALL_PADDING = 2;
const BALL_SPAWN_HEIGHT_RATIO = 0.35;
const CAT_BALL = 0x0001;
const CAT_WALL = 0x0002;
const SCROLL_VELOCITY_CLAMP = 1;
const ANGULAR_VELOCITY_JITTER = 0.02;
const MIN_DIMENSION = 10;
const SCROLL_SHAKE_THROTTLE = 16; // ~60fps throttling (ms)
const OPTIMAL_PIXEL_RATIO = 1.5; // Balance between clarity and performance

// Utility function for random integer generation
const randInt = (a: number, b: number): number =>
  Math.floor(Math.random() * (b - a + 1)) + a;

type PhysicsConfig = {
  minBalls?: number;
  maxBalls?: number;
  colors: string[];
  gravity?: number;
  radiusRange?: [number, number];
  restitution?: number;
  friction?: number;
  frictionAir?: number;
  pixelRatio?: number;
  shakeForce?: number;
};

type Skill = {
  name: string;
  src: string;
  palette: string[];
  options?: Omit<PhysicsConfig, 'colors'>;
};

function PhysicsCanvas({
  logoSrc,
  logoAlt,
  config,
  className = 'h-40 sm:h-44 md:h-48',
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

      // Config with performance optimizations
      const cfg: Required<PhysicsConfig> = {
        minBalls: config.minBalls ?? 5,
        maxBalls: typeof window !== 'undefined' && window.innerWidth < 768 ? 4 : (config.maxBalls ?? 8),
        colors: config.colors.length ? config.colors : ['#3b82f6', '#22c55e', '#ef4444'],
        gravity: config.gravity ?? 1,
        radiusRange: config.radiusRange ?? [10, 16],
        restitution: config.restitution ?? 0.85,
        friction: config.friction ?? 0.05,
        frictionAir: config.frictionAir ?? 0.003,
        pixelRatio: Math.min(OPTIMAL_PIXEL_RATIO, typeof window !== 'undefined' ? window.devicePixelRatio ?? 1 : 1),
        shakeForce: config.shakeForce ?? 0.002,
      };

      // Size to bounding box
      const rect = el.getBoundingClientRect();
      let width = Math.max(MIN_DIMENSION, Math.floor(rect.width));
      let height = Math.max(MIN_DIMENSION, Math.floor(rect.height));

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
      const makeWalls = () => {
        const t = WALL_THICKNESS;
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

      // Ball creation loop
      const createBalls = () => {
        const [rmin, rmax] = cfg.radiusRange;
        const count = randInt(cfg.minBalls, cfg.maxBalls);
        const ballList: Matter.Body[] = [];

        for (let i = 0; i < count; i++) {
          const r = randInt(rmin, rmax);
          const x = randInt(r + WALL_PADDING, width - r - WALL_PADDING);
          const y = randInt(r + WALL_PADDING, Math.max(r + WALL_PADDING, Math.floor(height * BALL_SPAWN_HEIGHT_RATIO)));
          const color = cfg.colors[randInt(0, cfg.colors.length - 1)];
          const ball = Bodies.circle(x, y, r, {
            restitution: cfg.restitution,
            friction: cfg.friction,
            frictionAir: cfg.frictionAir,
            collisionFilter: { category: CAT_BALL, mask: CAT_BALL | CAT_WALL },
            render: {
              fillStyle: color,
              strokeStyle: 'rgba(0,0,0,0.08)',
              lineWidth: 1,
            },
          });
          ballList.push(ball);
          Composite.add(engine.world, ball);
        }
        return ballList;
      };
      const balls = createBalls();

      // Allow page scroll while over the canvas
      const setupScrollPassThrough = (canvas: HTMLCanvasElement) => {
        canvas.style.touchAction = 'pan-y';
        const opts: AddEventListenerOptions = { passive: true, capture: true };

        const handlers = {
          onWheel: (e: Event) => {
            e.stopImmediatePropagation();
          },
          onTouchMove: (e: Event) => {
            e.stopImmediatePropagation();
          },
        };

        canvas.addEventListener('wheel', handlers.onWheel as EventListener, opts);
        canvas.addEventListener('mousewheel', handlers.onWheel as EventListener, opts);
        canvas.addEventListener('DOMMouseScroll', handlers.onWheel as EventListener, opts);
        canvas.addEventListener('touchmove', handlers.onTouchMove as EventListener, opts);

        return () => {
          canvas.removeEventListener('wheel', handlers.onWheel as EventListener, true);
          canvas.removeEventListener('mousewheel', handlers.onWheel as EventListener, true);
          canvas.removeEventListener('DOMMouseScroll', handlers.onWheel as EventListener, true);
          canvas.removeEventListener('touchmove', handlers.onTouchMove as EventListener, true);
        };
      };

      detachScrollPassThrough = setupScrollPassThrough(render.canvas);

      // Keep a body fully inside the rectangle [0..width]x[0..height]
      const clampInside = (b: Matter.Body) => {
        const radius = (b as any).circleRadius ?? 12;
        const bounds = {
          minX: radius + WALL_PADDING,
          maxX: width - radius - WALL_PADDING,
          minY: radius + WALL_PADDING,
          maxY: height - radius - WALL_PADDING,
        };

        const nx = Math.min(bounds.maxX, Math.max(bounds.minX, b.position.x));
        const ny = Math.min(bounds.maxY, Math.max(bounds.minY, b.position.y));

        if (nx !== b.position.x || ny !== b.position.y) {
          Body.setPosition(b, { x: nx, y: ny });

          const vx = b.velocity.x;
          const vy = b.velocity.y;

          const isOutHorizontal = (b.position.x <= bounds.minX && vx < 0) || (b.position.x >= bounds.maxX && vx > 0);
          const isOutVertical = (b.position.y <= bounds.minY && vy < 0) || (b.position.y >= bounds.maxY && vy > 0);

          Body.setVelocity(b, {
            x: isOutHorizontal ? 0 : vx,
            y: isOutVertical ? 0 : vy,
          });
        }
      };

      // Clamp every tick: ensures no ball escapes
      Events.on(engine, 'afterUpdate', () => {
        for (const b of balls) clampInside(b);
      });

      // Shake on scroll with throttling and motion preference
      const setupScrollShake = () => {
        let lastY = window.scrollY;
        let lastT = performance.now();
        let lastShakeT = performance.now();
        const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const onScroll = () => {
          if (prefersReducedMotion) return;

          const now = performance.now();
          if (now - lastShakeT < SCROLL_SHAKE_THROTTLE) return;

          lastShakeT = now;

          const dy = window.scrollY - lastY;
          const dt = Math.max(8, now - lastT);
          lastY = window.scrollY;
          lastT = now;

          const velocity = Math.max(-SCROLL_VELOCITY_CLAMP, Math.min(SCROLL_VELOCITY_CLAMP, dy / dt));
          const forceY = cfg.shakeForce * velocity;
          const forceX = cfg.shakeForce * velocity * (Math.random() * 0.6 - 0.3);

          balls.forEach((b) => {
            Body.applyForce(b, b.position, { x: forceX, y: forceY });
            Body.setAngularVelocity(
              b,
              b.angularVelocity + (Math.random() * ANGULAR_VELOCITY_JITTER - ANGULAR_VELOCITY_JITTER / 2),
            );
          });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('wheel', onScroll, { passive: true });

        return () => {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('wheel', onScroll);
        };
      };

      removeScrollHandlers = setupScrollShake();

      // Start simulation
      Render.run(render);
      Runner.run(runner, engine);

      // Sync canvas size on container resize with debouncing
      let resizeTimeout: NodeJS.Timeout | null = null;
      const handleResize = () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          const rect = el.getBoundingClientRect();
          width = Math.max(MIN_DIMENSION, Math.floor(rect.width));
          height = Math.max(MIN_DIMENSION, Math.floor(rect.height));

          render.canvas.width = width * cfg.pixelRatio;
          render.canvas.height = height * cfg.pixelRatio;
          render.canvas.style.width = `${width}px`;
          render.canvas.style.height = `${height}px`;
          render.options.width = width;
          render.options.height = height;

          Composite.remove(engine.world, walls);
          walls = makeWalls();

          balls.forEach((b) => clampInside(b));
        }, 150);
      };

      resizeObs = new ResizeObserver(handleResize);
      resizeObs.observe(el);
    })();

    return () => {
      mounted = false;
      if (resizeObs) resizeObs.disconnect();
      if (removeScrollHandlers) removeScrollHandlers();
      if (detachScrollPassThrough) detachScrollPassThrough();

      const canvas = containerRef.current?.querySelector('canvas');
      try {
        canvas?.remove();
      } catch {
        // no-op
      }
    };
  }, [config]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-xl border border-white/10 ${className} bg-white/10 dark:bg-white/5 backdrop-blur-md supports-[backdrop-filter]:bg-white/10 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.15),0_8px_24px_rgba(0,0,0,0.08)]`}
    >
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={160}
        height={96}
        className="pointer-events-none absolute inset-0 z-10 m-auto h-24 w-40 object-contain opacity-90 will-change-transform backface-visibility-hidden"
        loading="lazy"
      />
    </div>
  );
}

export default function Skills() {
  const skills: Skill[] = useMemo(() => [
    { name: 'Ruby on Rails', src: './RubyonRails.webp', palette: ['#CC0000', '#8B0000', '#FF4D4D', '#660000'] },
    { name: 'HTML', src: './html.webp', palette: ['#E34F26', '#F06529', '#FF8A50', '#FFC2A1'] },
    { name: 'CSS', src: './css.webp', palette: ['#1572B6', '#2965F1', '#5DADE2', '#A9CCE3'] },
    { name: 'TypeScript', src: './Typescript.webp', palette: ['#3178C6', '#235A97', '#5AA9E6', '#A7D3F5'] },
    { name: 'Next.js', src: './Nextjs.webp', palette: ['#000000', '#111827', '#6B7280', '#E5E7EB'] },
    { name: 'Tailwind CSS', src: './Tailwind.webp', palette: ['#06B6D4', '#0891B2', '#67E8F9', '#CFFAFE'] },
    { name: 'PostgreSQL', src: './postgresql.webp', palette: ['#336791', '#2D5A88', '#6699CC', '#B3D4FC'] },
    { name: 'Redis', src: './Redis.png', palette: ['#DC382D', '#A41E11', '#FF6B6B', '#F5B7B1'] },
    { name: 'Vite', src: './Vite.webp', palette: ['#646CFF', '#4F46E5', '#A5B4FC', '#E0E7FF'] },
    { name: 'Docker', src: './Docker.webp', palette: ['#2496ED', '#0B5FFF', '#6FB6FF', '#CFE8FF'] },
    { name: 'Salesforce', src: './Salesforce.png', palette: ['#00A1E0', '#1589EE', '#6EC1FF', '#CFE9FF'] },
    { name: 'Git', src: './Git.webp', palette: ['#F05032', '#BD2C00', '#FF7F50', '#FFD6CC'] },
  ], []);

  const baseConfig: Omit<PhysicsConfig, 'colors'> = {
    minBalls: 5,
    maxBalls: 10,
    gravity: 1,
    radiusRange: [10, 16],
    restitution: 0.85,
    friction: 0.05,
    frictionAir: 0.003,
    shakeForce: 0.002,
  };

  return (
    <section id="skills" className="scroll-mt-16" data-section="skills">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:static lg:mb-0 lg:w-auto lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <h2 className="shiny text-xl font-bold uppercase tracking-widest lg:hidden text-start">
          Skills
        </h2>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <h2 className="shiny hidden text-3xl font-bold lg:block lg:text-start">Skills</h2>
      </div>

      <ul role="list" className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
        {skills.map((s) => (
          <li key={s.name} className="overflow-hidden rounded-xl border border-white/10 transition-shadow hover:shadow-md">
            <PhysicsCanvas
              logoSrc={s.src}
              logoAlt={`${s.name} logo`}
              config={{ ...baseConfig, colors: s.palette, ...(s.options ?? {}) }}
              className="h-40 sm:h-44 md:h-48"
            />
            <div className="px-4 py-3">
              <p className="text-center text-sm font-medium">{s.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}