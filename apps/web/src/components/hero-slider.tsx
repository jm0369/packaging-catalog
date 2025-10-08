"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";
import { colors } from "@/lib/colors";
import Container from "./container";

const AUTOPLAY_MS = 12000;
const PREFade_MS = 1000; // Text fades out this long before the slide switches
const TEXT_FADE_MS = 500; // Must match the motion transition duration for text

type Slide = {
  id: string; // key referencing translation entry
  img: string;
  lines: string[]; // 1-3 lines for headline
  sub1: string;
  sub2: string;
  badge: string;
};

// Base slide order + default German content used as fallback for all locales.
const baseSlides: Slide[] = [
  {
    id: "intro",
    img: "/hero-4.png",
    lines: ["Wir sind", "pack", "CHAMPIONS."],
    sub1: "Ihr Star für starke Versandverpackungen.",
    sub2: "Clever. Stark. Nachhaltig.",
    badge: "Zukunftsweisende CO₂‑Standards",
  },
  {
    id: "fiber",
    img: "/forest.png",
    lines: ["Weniger", "Frischfaser.", "Mehr Verantwortung."],
    sub1: "Wir reduzieren den Frischfaseranteil in unseren Verpackungen um bis zu 80% und achten dabei auf den passenden Mix aus Frischfasern und Recyclingmaterial.",
    sub2: "Zukunftsfähig. Mit Umweltvorteil.",
    badge: "Unsere CO2-Master",
  },
  {
    id: "reduction",
    img: "/fliegend.png",
    lines: ["Champions", "in Sachen", "CO₂‑Reduktion."],
    sub1: "Material‑ und Gewichtsreduktion, Recyclingfasern & flexible Logistikkonzepte.",
    sub2: "Weniger Fußabdruck – mehr Wirkung.",
    badge: "Nachhaltig gedacht",
  },
  {
    id: "volume",
    img: "/roof.png",
    lines: ["Wir reduzieren", "das Volumen.", "Nicht die Qualität."],
    sub1: "Wir bieten ein breites Sortiment an volumenreduzierter Verpackung und sparen Platz und CO2.",
    sub2: "Weniger Volumen. Weniger Kosten.",
    badge: "Unsere Kraftpakete.",
  },
  {
    id: "weight",
    img: "/scale.png",
    lines: ["Jedes Gramm zählt.", "Für uns und", "für’s Klima."],
    sub1: "Wir reduzieren konsequent das Flächengewicht der eingesetzten Papiere auf bis 80 g/qm.",
    sub2: "Weniger Gewicht. Gleiche Wirkung.",
    badge: "Optimale Papierqualität.",
  },
  {
    id: "certified",
    img: "/zertifiziert.png",
    lines: ["100% zertifiziert.", "100% FSC."],
    sub1: "Wir setzen ausnahmslos FSC-zertifizierte Materialien ein – für echten Wald- und Ressourcenschutz.",
    sub2: "Mehr Umweltschutz. Volle Transparenz.",
    badge: "Zertifizierte Materialstandards.",
  },
  {
    id: "partners",
    img: "/lieferung.png",
    lines: ["Unser", "Partnerschafts-konzept."],
    sub1: "Exklusiv-Partner unterstützen wir mit attraktiven Benefits wie z.B. Sonderrabbate, Vertriebsunterstützung und Marketingunterstützung.",
    sub2: "Gemeinsam mehr erreichen.",
    badge: "Partner & Lieferanten.",
  },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  // timers for pre-fade and slide change
  const changeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const preFadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const manualChangeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [textKey, setTextKey] = useState(0);
  const [textFadingOut, setTextFadingOut] = useState(false);
  const isManualTransitioningRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (changeTimerRef.current) clearTimeout(changeTimerRef.current);
    if (preFadeTimerRef.current) clearTimeout(preFadeTimerRef.current);
  if (manualChangeTimerRef.current) clearTimeout(manualChangeTimerRef.current);
  }, []);

  const scheduleSlide = () => {
    clearTimers();
    // Schedule text pre-fade
    preFadeTimerRef.current = setTimeout(() => {
      setTextFadingOut(true);
    }, Math.max(0, AUTOPLAY_MS - PREFade_MS));
    // Schedule actual slide change
    changeTimerRef.current = setTimeout(() => {
      setI((v) => (v + 1) % baseSlides.length);
      setTextFadingOut(false);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    scheduleSlide();
    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, baseSlides.length]);

  // Update a text key to re-trigger text animation when slide changes
  useEffect(() => {
    setTextKey((k) => k + 1);
  }, [i]);

  const goTo = useCallback((idx: number) => {
    if (idx === i || isManualTransitioningRef.current) return;
    // Cancel any scheduled auto transitions
    clearTimers();
    // Start manual fade-out, then switch slide after fade completes
    isManualTransitioningRef.current = true;
    setTextFadingOut(true);
    manualChangeTimerRef.current = setTimeout(() => {
      setI(idx);
      setTextFadingOut(false);
      isManualTransitioningRef.current = false;
      // Timers will be rescheduled by the effect that listens to `i`
    }, TEXT_FADE_MS + 20);
  }, [clearTimers, i]);

  const current = baseSlides[i];
  // Parallax background: move up slightly on scroll
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0px", "20vh"]);

  const nextSlide = useCallback(() => goTo((i + 1) % baseSlides.length), [goTo, i, baseSlides.length]);
  const prevSlide = useCallback(() => goTo((i - 1 + baseSlides.length) % baseSlides.length), [goTo, i, baseSlides.length]);

  // Global keyboard navigation: allow arrow/Home/End keys to control the slider anywhere
  useEffect(() => {
    const onGlobalKey = (e: KeyboardEvent) => {
      // Skip if already handled by a focused element
      if (e.defaultPrevented) return;
      // Respect modifier keys
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      // Avoid interfering with typing/editable controls
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isEditable =
        !!target && (target.isContentEditable || tag === "input" || tag === "textarea" || tag === "select");
      if (isEditable) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(baseSlides.length - 1);
      }
    };
    window.addEventListener("keydown", onGlobalKey);
    return () => window.removeEventListener("keydown", onGlobalKey);
    // We intentionally depend on functions so the latest closure state is used
  }, [nextSlide, prevSlide, goTo, baseSlides.length]);

  return (
    <section
      className="relative isolate overflow-hidden focus:outline-none min-h-[80vh]"
      role="region"
      aria-roledescription="Karussell"
      aria-label="Hero-Slider"
      ref={sectionRef}
    >
      {/* Screen reader announcement for slide changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" role="status">
        {`Hero-Slider: Folie ${i + 1} von ${baseSlides.length}.`}
      </div>
    
  {/* Framer Motion crossfade for backgrounds */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${current.img})`, y: bgY }}
          />
        </AnimatePresence>
      </div>
      {/* Overlay gradient above images */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(0deg, rgba(7,94,61,0.65), rgba(7,94,61,0.65))" }}
      />

      <Container className="grid min-h-[60vh] md:min-h-[90vh] content-center py-14 md:py-24 text-white relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={textKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: textFadingOut ? 0 : 1, y: textFadingOut ? 0 : 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-xl space-y-6"
          >
          <h1 className="text-[44px] md:text-[64px] font-extrabold leading-[1.05] drop-shadow">
            {current.lines.map((l: string, idx: number) => (
              <React.Fragment key={idx}>
                {l}
                {idx < current.lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <div className="space-y-3">
            <p className="text-white/95">{current.sub1}</p>
            <p className="font-semibold">{current.sub2}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="text-[13px]" style={{ backgroundColor: colors.copper, color: "white" }}>
              {current.badge}
            </Badge>
          </div>
          {/* Dots moved outside animated content */}
          </motion.div>
        </AnimatePresence>
      </Container>

  {/* Slide indicator dots outside animation, bottom-center */}
  <div
    className="pointer-events-auto absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3"
    role="group"
    aria-label="Hero-Slider Navigation"
  >
        {baseSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
    aria-label={`Zur Folie ${idx + 1} wechseln`}
            className={`size-5 rounded-full transition hover:opacity-100 focus:outline-none focus-visible:shadow-[0_0_0_2px_#c8dc00cc] ${
              idx === i ? "scale-110" : ""
            }`}
            style={{
              backgroundColor: colors.lightGreen,
              opacity: idx === i ? 1 : 0.7,
            }}
          />
        ))}
      </div>

      <div
        className="absolute bottom-[-10px] left-0 right-0 h-8"
        style={{ backgroundColor: colors.lightGreen, transform: "skewY(-2deg)" }}
      />
    </section>
  );
}
