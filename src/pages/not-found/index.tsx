import { useEffect, useRef } from "preact/hooks";
import { motion } from "framer-motion";

export default function NotFound404() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Tiny starfield background (no deps)
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stars: { x: number; y: number; z: number }[] = [];
    const STAR_COUNT = 20;

    const resize = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: (Math.random() - 0.5) * c.width,
        y: (Math.random() - 0.5) * c.height,
        z: Math.random() * 0.8 + 0.2,
      }));
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#000C24";
      ctx.fillRect(0, 0, c.width, c.height);

      for (const s of stars) {
        const px = (s.x += 0.05 * s.z);
        const py = (s.y += 0.02 * s.z);
        if (px > c.width / 2) s.x = -c.width / 2;
        if (py > c.height / 2) s.y = -c.height / 2;

        const sx = px + c.width / 2;
        const sy = py + c.height / 2;
        const size = 1.2 + s.z * 1.5;
        ctx.globalAlpha = 0.6 + s.z * 0.4;
        ctx.fillStyle = "#94a3b8"; // slate-400
        ctx.fillRect(sx, sy, size, size);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-slate-200">
      {/* Background visuals */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_10%,#0b1223_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_500px_at_90%_80%,#1b2240_0%,transparent_60%)]" />

      {/* Content */}
      <main className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-300/80">
            <span className="size-2 rounded-full bg-rose-500/80" />
            <span>Status Code</span>
            <span className="font-mono">404</span>
          </div>

          <h1 className="mb-2 bg-gradient-to-r from-sky-300 via-cyan-200 to-violet-300 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent md:text-7xl leading-[120%]">
            Page not found
          </h1>
          <p className="mx-auto mb-8 max-w-prose text-sm leading-relaxed text-slate-400 md:text-base">
            The page you’re looking for doesn’t exist or has been moved. Check
            the URL or try one of the options below.
          </p>

          <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur transition hover:border-white/20 hover:bg-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
              >
                <path d="M11.7 3.3a1 1 0 0 1 1.4 0l7 7a1 1 0 0 1-1.4 1.4L19 10.4V20a1 1 0 0 1-1 1h-4v-5H10v5H6a1 1 0 0 1-1-1v-9.6l-.7.7A1 1 0 0 1 2.9 10l7-7z" />
              </svg>
              Go home
            </a>
          </div>
        </motion.div>

        {/* Footer note */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-slate-500"
        >
          <span className="font-mono text-slate-400/80">#404</span> · It seems
          you’ve drifted off course
        </motion.footer>
      </main>

      {/* Glow accents */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
    </div>
  );
}
