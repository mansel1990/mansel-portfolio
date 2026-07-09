"use client";

import { useEffect, useState } from "react";
import type { ZoomPlacePuzzle } from "@/lib/mithila/data";
import { matchAnswer } from "@/lib/mithila/fuzzy";

// Photo starts zoomed way in and slowly zooms out.
// If puzzle.answers is empty, it's a cinematic reveal with a confirm button.
export default function ZoomPlace({ puzzle, onSolve }: { puzzle: ZoomPlacePuzzle; onSolve: () => void }) {
  const [zoom, setZoom] = useState(7);
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(0);
  const freeMode = puzzle.answers.length === 0;

  useEffect(() => {
    const iv = setInterval(() => setZoom((z) => Math.max(1, z - 0.06)), 120);
    return () => clearInterval(iv);
  }, []);

  const submit = () => {
    if (matchAnswer(value, puzzle.answers)) onSolve();
    else {
      setWrong((w) => w + 1);
      setZoom((z) => Math.max(1, z - 1.2)); // wrong answers zoom out faster — mercy
    }
  };

  return (
    <div className="text-center">
      <span className="mithila-badge mb-4">where in the world…</span>
      <p className="italic my-4 text-sm" style={{ opacity: 0.8 }}>
        {puzzle.prompt}
      </p>
      <div
        className="mx-auto rounded-xl overflow-hidden"
        style={{ width: "min(78vw, 330px)", height: "min(60vw, 260px)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={puzzle.photo}
          alt=""
          className="w-full h-full object-cover"
          style={{ transform: `scale(${zoom})`, transition: "transform 0.5s linear" }}
          draggable={false}
        />
      </div>
      {freeMode ? (
        <button className="mithila-btn mt-6 w-full" disabled={zoom > 2.4} onClick={onSolve} style={{ opacity: zoom > 2.4 ? 0.4 : 1 }}>
          {zoom > 2.4 ? "wait for it…" : "I know this place!"}
        </button>
      ) : (
        <>
          <input
            className="mithila-input mt-5"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="name the place…"
            autoComplete="off"
          />
          <button className="mithila-btn mt-4 w-full" onClick={submit}>
            that&apos;s the place
          </button>
          {wrong > 0 && (
            <p className="mt-3 text-sm italic" style={{ opacity: 0.65 }}>
              Not yet — keep watching, it&apos;s zooming out…
            </p>
          )}
        </>
      )}
    </div>
  );
}
