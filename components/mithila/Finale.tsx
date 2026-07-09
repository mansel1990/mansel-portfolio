"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { finale, lands } from "@/lib/mithila/data";
import { useMithila } from "@/lib/mithila/store";
import { audio } from "./audio";

type Stage = "gather" | "age" | "candles" | "letter";

// sample pixel positions that spell out a text string
function sampleText(text: string, w: number, h: number, count: number): [number, number][] {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  let size = Math.floor(w / (text.length * 0.62));
  size = Math.min(size, Math.floor(h * 0.7));
  ctx.font = `600 ${size}px Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);
  const data = ctx.getImageData(0, 0, w, h).data;
  const pts: [number, number][] = [];
  const step = 3;
  for (let y = 0; y < h; y += step)
    for (let x = 0; x < w; x += step)
      if (data[(y * w + x) * 4 + 3] > 128) pts.push([x, y]);
  // pick `count` random points
  const out: [number, number][] = [];
  for (let i = 0; i < count; i++) out.push(pts[Math.floor(Math.random() * pts.length)] || [w / 2, h / 2]);
  return out;
}

export default function Finale() {
  const setFinaleSeen = useMithila((s) => s.setFinaleSeen);
  const [stage, setStage] = useState<Stage>("gather");
  const [blown, setBlown] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<Stage>("gather");

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  // finale song from the start
  useEffect(() => {
    audio.playMusic(finale.song.src, { loop: false, volume: 1 });
    return () => audio.stopMusic();
  }, []);

  // particle engine
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = Math.floor(window.innerHeight * 0.5));
    const COUNT = 900;

    const nameTargets = sampleText(finale.name, W, H, COUNT);
    const ageTargets = sampleText(String(finale.age), W, H, COUNT);

    const parts = Array.from({ length: COUNT }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: 0,
      vy: 0,
      t: i,
      size: 0.8 + Math.random() * 1.6,
      tw: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let dead = false;
    const tick = (time: number) => {
      if (dead) return;
      ctx.clearRect(0, 0, W, H);
      const s = stageRef.current;
      const targets = s === "gather" ? nameTargets : ageTargets;
      for (const p of parts) {
        if (s === "candles" || s === "letter") {
          // drift upward and fade like sparks
          p.x += p.vx;
          p.y += p.vy - 0.25;
          p.vx *= 0.99;
        } else {
          const [tx, ty] = targets[p.t];
          p.x += (tx - p.x) * 0.055;
          p.y += (ty - p.y) * 0.055;
        }
        const alpha = s === "letter" ? 0.12 : 0.45 + Math.sin(time * 0.004 + p.tw) * 0.35;
        ctx.fillStyle = `rgba(240,184,102,${Math.max(0, alpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, ((p.y % (H + 40)) + H + 40) % (H + 40), p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  // stage progression
  useEffect(() => {
    const t1 = setTimeout(() => setStage("age"), 5200);
    const t2 = setTimeout(() => setStage("candles"), 9000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // letter line reveal
  useEffect(() => {
    if (stage !== "letter") return;
    if (lineCount >= finale.letter.length) return;
    const t = setTimeout(() => setLineCount((c) => c + 1), lineCount === 0 ? 800 : 1600);
    return () => clearTimeout(t);
  }, [stage, lineCount]);

  const blow = () => {
    if (blown) return;
    setBlown(true);
    if (navigator.vibrate) navigator.vibrate([40, 60, 40, 60, 120]);
    setTimeout(() => setStage("letter"), 1600);
  };

  const allPhotos = lands.flatMap((c) => c.photos.map((p) => p.src));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="absolute inset-0 z-40 overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 110%, #171d4d 0%, #090b22 55%, #04050f 100%)" }}
    >
      {/* photo mosaic backdrop (letter stage) */}
      <AnimatePresence>
        {stage === "letter" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.13 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 grid grid-cols-6 md:grid-cols-9 gap-1 pointer-events-none"
          >
            {allPhotos.slice(0, 54).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: "50vh" }} />

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-6">
        <AnimatePresence mode="wait">
          {stage === "gather" && (
            <motion.p
              key="g"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              className="italic text-lg text-center mb-16"
            >
              Every star you lit tonight knows your name.
            </motion.p>
          )}

          {stage === "age" && (
            <motion.p
              key="a"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              exit={{ opacity: 0 }}
              className="italic text-lg text-center mb-16"
            >
              Thirty-six looks good written in stars.
            </motion.p>
          )}

          {stage === "candles" && (
            <motion.div
              key="c"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-8 w-full max-w-lg"
            >
              {/* 36 candles */}
              <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-4 mb-8">
                {Array.from({ length: finale.age }, (_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      style={{
                        width: 7,
                        height: 10,
                        borderRadius: "50% 50% 40% 40%",
                        background: blown ? "transparent" : "radial-gradient(circle at 50% 80%, #fff3c9, #f0b866 60%, transparent)",
                        boxShadow: blown ? "none" : "0 0 12px 3px rgba(240,184,102,0.6)",
                        animation: blown ? "none" : `mithila-flame ${0.5 + (i % 5) * 0.13}s ease-in-out infinite`,
                        opacity: blown ? 0 : 1,
                        transition: `opacity 0.3s ${i * 0.03}s`,
                      }}
                    />
                    <div style={{ width: 3, height: 14, background: "rgba(245,240,232,0.5)", borderRadius: 2, marginTop: 1 }} />
                  </div>
                ))}
              </div>
              <p className="italic text-xl mb-6" style={{ color: "#f0b866" }}>
                Make a wish, Mithila.
              </p>
              {!blown && (
                <button className="mithila-btn" onClick={blow}>
                  blow out the candles
                </button>
              )}
            </motion.div>
          )}

          {stage === "letter" && (
            <motion.div
              key="l"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-md text-center max-h-[70vh] overflow-y-auto mithila-noscrollbar"
            >
              {finale.letter.slice(0, lineCount).map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: line ? 0.95 : 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="italic text-lg leading-relaxed"
                  style={{ minHeight: line ? undefined : 16 }}
                >
                  {line}
                </motion.p>
              ))}
              {lineCount >= finale.letter.length && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1.5 }}>
                  <p className="mt-8 text-xs tracking-[0.4em] uppercase" style={{ opacity: 0.5 }}>
                    {finale.birthday}
                  </p>
                  <button className="mithila-btn-ghost mt-6" onClick={setFinaleSeen}>
                    return to your city ✦
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
