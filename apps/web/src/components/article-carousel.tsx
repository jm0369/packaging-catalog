'use client';

import { useMemo, useRef, useState, useEffect, KeyboardEvent, TouchEvent } from 'react';
import Lightbox from './lightbox';

export type CarouselImage = {
    id: string;
    url: string | null;
    altText?: string | null;
    sortOrder?: number;
    width?: number | null;
    height?: number | null;
};

type Props = {
    title: string;
    images: CarouselImage[];
    className?: string;
};

export default function ArticleCarousel({ title, images, className }: Props) {

    const [lightboxOpen, setLightboxOpen] = useState(false);

    // Normalize list
    const items = useMemo(
        () =>
            (images ?? [])
                .filter((i) => i.url)
                .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id.localeCompare(b.id)),
        [images],
    );

    const [idx, setIdx] = useState(0);

    // Refs
    const regionRef = useRef<HTMLDivElement | null>(null);
    const thumbsBarRef = useRef<HTMLDivElement | null>(null);
    const thumbRefs = useRef<Record<string, HTMLImageElement | null>>({});
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchActive = useRef(false);

    // Clamp index if items shrink
    useEffect(() => {
        if (idx > items.length - 1) setIdx(Math.max(0, items.length - 1));
    }, [items, idx]);

    // Scroll active thumbnail into view on change
    useEffect(() => {
        const active = items[idx];
        if (!active) return;
        const el = thumbRefs.current[active.id];
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        // Also ensure the whole strip is focusable with keyboard:
        thumbsBarRef.current?.setAttribute('tabIndex', '0');
    }, [idx, items]);

    if (items.length === 0) return null;

    const go = (n: number) => setIdx((prev) => (n + items.length) % items.length);
    const goNext = () => go(idx + 1);
    const goPrev = () => go(idx - 1);
    const goFirst = () => setIdx(0);
    const goLast = () => setIdx(items.length - 1);

    // Keyboard nav
    const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
            case 'ArrowRight':
            case 'l':
                e.preventDefault();
                goNext();
                break;
            case 'ArrowLeft':
            case 'h':
                e.preventDefault();
                goPrev();
                break;
            case 'Home':
                e.preventDefault();
                goFirst();
                break;
            case 'End':
                e.preventDefault();
                goLast();
                break;
            default:
                break;
        }
    };

    // Touch / swipe
    const SWIPE_MIN_X = 40;   // px threshold horizontally
    const SWIPE_MAX_Y = 60;   // max vertical tolerance

    const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        if (e.touches.length !== 1) return;
        touchActive.current = true;
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        // Prevent vertical scroll from being blocked unless we're clearly swiping
        if (!touchActive.current || touchStartX.current == null || touchStartY.current == null) return;
        const dx = e.touches[0].clientX - touchStartX.current;
        const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
        if (Math.abs(dx) > SWIPE_MIN_X && dy < SWIPE_MAX_Y) {
            // we’re swiping horizontally; prevent page scroll
            e.preventDefault();
        }
    };

    const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
        if (!touchActive.current || touchStartX.current == null || touchStartY.current == null) return;
        const end = e.changedTouches[0];
        const dx = end.clientX - touchStartX.current;
        const dy = Math.abs(end.clientY - touchStartY.current);
        touchActive.current = false;
        touchStartX.current = null;
        touchStartY.current = null;

        if (Math.abs(dx) >= SWIPE_MIN_X && dy < SWIPE_MAX_Y) {
            if (dx < 0) goNext(); // swipe left -> next
            else goPrev();        // swipe right -> prev
        }
    };

    const active = items[idx];

    return (
        <>
        <div
            ref={regionRef}
            role="region"
            aria-label={`${title} images`}
            tabIndex={0}
            onKeyDown={onKey}
            className={`select-none outline-none ${className ?? ''}`}
        >
            {/* Main image with swipe handlers */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={active.url!}
                alt={active.altText ?? title}
                className="w-full max-h-[520px] object-contain rounded border"
                draggable={false}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onClick={() => setLightboxOpen(true)}
            />

            {/* Controls */}
            <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                    Bild {idx + 1} / {items.length}
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={goPrev}
                        className="px-2 py-1 rounded border hover:bg-gray-50"
                        aria-label="Vorheriges Bild"
                    >
                        ←
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        className="px-2 py-1 rounded border hover:bg-gray-50"
                        aria-label="Nächstes Bild"
                    >
                        →
                    </button>
                </div>
            </div>

            {/* Thumbnails (active thumb autofocus via useEffect) */}
            <div
                ref={thumbsBarRef}
                className="mt-2 flex gap-2 overflow-x-auto py-1"
                aria-label="Thumbnails"
            >
                {items.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        key={img.id}
                        ref={(el) => (thumbRefs.current[img.id] = el)}
                        src={img.url!}
                        alt={img.altText ?? title}
                        className={`h-20 w-28 object-cover rounded border flex-none cursor-pointer transition ${i === idx ? 'ring-2 ring-black' : 'hover:opacity-90'
                            }`}
                        onClick={() => setIdx(i)}
                        draggable={false}
                    />
                ))}
            </div>
        </div>
        <Lightbox
    open={lightboxOpen}
    onClose={() => setLightboxOpen(false)}
    src={active.url!}
    alt={active.altText ?? title}
  />
        </>
    );
}