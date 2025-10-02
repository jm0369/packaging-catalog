'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type LightboxProps = {
  open: boolean;
  onClose: () => void;
  src: string;
  alt?: string | null;

  /** NEW: navigation */
  index?: number;            // current slide (0-based)
  count?: number;            // total slides
  onPrev?: () => void;       // go to previous slide
  onNext?: () => void;       // go to next slide
};

export default function Lightbox({
  open,
  onClose,
  src,
  alt,
  index,
  count,
  onPrev,
  onNext,
}: LightboxProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // pan & zoom state (unchanged)
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const pinchRef = useRef<{
    startDist: number;
    startScale: number;
    startMid: { x: number; y: number };
    active: boolean;
  } | null>(null);
  const lastTap = useRef<number>(0);

  // reset view on open or when slide changes
  useEffect(() => {
    if (!open) return;
    setScale(1);
    setTx(0);
    setTy(0);
    setDragging(false);
    dragStart.current = null;
    pinchRef.current = null;
  }, [open, src]);

  // ESC to close + Arrow navigation
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, onPrev, onNext]);

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const setScaleAroundPoint = (next: number, clientX: number, clientY: number) => {
    const container = wrapRef.current;
    if (!container) return setScale(next);
    const rect = container.getBoundingClientRect();
    const cx = clientX - rect.left - rect.width / 2;
    const cy = clientY - rect.top - rect.height / 2;

    const prev = scale;
    const k = next / prev;
    setTx((t) => t - cx * (k - 1));
    setTy((t) => t - cy * (k - 1));
    setScale(next);
  };

  const onWheel: React.WheelEventHandler = (e) => {
    e.preventDefault();
    const dir = e.deltaY > 0 ? -1 : 1;
    const factor = 1 + dir * 0.12;
    const next = clamp(scale * factor, 1, 6);
    setScaleAroundPoint(next, e.clientX, e.clientY);
  };

  const onMouseDown: React.MouseEventHandler = (e) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, tx, ty };
  };
  const onMouseMove: React.MouseEventHandler = (e) => {
    if (!dragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setTx(dragStart.current.tx + dx);
    setTy(dragStart.current.ty + dy);
  };
  const endDrag = () => {
    setDragging(false);
    dragStart.current = null;
  };

  const onDouble = (clientX: number, clientY: number) => {
    const next = scale <= 1.1 ? 2 : 1;
    setScaleAroundPoint(next, clientX, clientY);
    if (next === 1) {
      setTx(0);
      setTy(0);
    }
  };
  const onDoubleClick: React.MouseEventHandler = (e) => {
    e.preventDefault();
    onDouble(e.clientX, e.clientY);
  };

  // touch (drag + pinch + double-tap)
  const dist = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  const mid = (a: Touch, b: Touch) => ({ x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 });

  const onTouchStart: React.TouchEventHandler = (e) => {
    if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        const t = e.touches[0];
        onDouble(t.clientX, t.clientY);
      }
      lastTap.current = now;

      setDragging(true);
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, tx, ty };
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const [a, b] = [e.touches[0], e.touches[1]];
      pinchRef.current = {
        startDist: dist(a, b),
        startScale: scale,
        startMid: mid(a, b),
        active: true,
      };
    }
  };
  const onTouchMove: React.TouchEventHandler = (e) => {
    if (e.touches.length === 1 && dragging && dragStart.current) {
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setTx(dragStart.current.tx + dx);
      setTy(dragStart.current.ty + dy);
    } else if (e.touches.length === 2 && pinchRef.current?.active) {
      e.preventDefault();
      const [a, b] = [e.touches[0], e.touches[1]];
      const d = dist(a, b);
      const next = clamp((d / pinchRef.current.startDist) * pinchRef.current.startScale, 1, 6);
      setScaleAroundPoint(next, pinchRef.current.startMid.x, pinchRef.current.startMid.y);
    }
  };
  const onTouchEnd = () => {
    setDragging(false);
    dragStart.current = null;
    if (pinchRef.current) pinchRef.current.active = false;
  };

  const transform = useMemo(
    () => `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
    [tx, ty, scale],
  );

  if (!open) return null;

  const showPrev = typeof index === 'number' && typeof count === 'number' && index > 0;
  const showNext = typeof index === 'number' && typeof count === 'number' && index < count - 1;

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => {
        if (e.target === wrapRef.current) onClose();
      }}
      onWheel={onWheel}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 rounded bg-white/10 text-white px-3 py-1 text-sm hover:bg-white/20"
        aria-label="Close"
      >
        Close
      </button>

      {/* Prev / Next */}
      {showPrev && (
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 rounded bg-white/10 text-white px-3 py-2 text-lg hover:bg-white/20"
          aria-label="Previous image"
        >
          ‹
        </button>
      )}
      {showNext && (
        <button
          type="button"
          onClick={onNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 rounded bg-white/10 text-white px-3 py-2 text-lg hover:bg-white/20"
          aria-label="Next image"
        >
          ›
        </button>
      )}

      {/* Main image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ''}
        className={`max-h-[90vh] max-w-[95vw] select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ transform, transition: dragging ? 'none' : 'transform 120ms ease-out' }}
        draggable={false}
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        onTouchStart={onTouchStart}
      />

      {/* Index indicator (optional) */}
      {typeof index === 'number' && typeof count === 'number' && (
        <div className="absolute bottom-4 text-white/80 text-sm">
          {index + 1} / {count}
        </div>
      )}
    </div>
  );
}