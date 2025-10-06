"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Zap, Boxes, PackageSearch, Timer, Recycle, Truck, ChevronRight, Package2 } from "lucide-react";
import { colors } from "@/lib/colors";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import HeroSlider from "@/components/hero-slider";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Category = {
  id: string;
  name: string;
  color: string;
  description?: string;
  properties?: Array<{ name: string; description: string }>;
  applications?: string[];
  formatsSpecifications?: string[];
  keyFigures?: Array<{ name: string; description: string }>;
  ordering?: Array<{ name: string; description: string }>;
  orderingNotes?: string[];
  media: string[];
  groupCount: number;
};

async function fetchCategories(): Promise<Category[]> {
  const r = await fetch(`${API}/api/categories`, { next: { revalidate: 600 } });
  if (!r.ok) return [];
  return r.json();
}

const uspBullets = [
    "nachhaltig.",
    "innovativ.",
    "vielseitig.",
    "schnell.",
];

const features = [
    {
        title: "Nachhaltige Verpackungen",
        text: "Unsere umweltfreundlichen Lösungen reduzieren den ökologischen Fußabdruck Ihres Unternehmens.",
        img: "/selbstklebeverschluss.png",
    },
    {
        title: "Maßgeschneiderte Lösungen",
        text: "Wir bieten individuell angepasste Verpackungslösungen, die genau auf Ihre Bedürfnisse zugeschnitten sind.",
        img: "/aufreissfaden.png",
    },
    {
        title: "Zuverlässiger Service",
        text: "Unser engagiertes Team sorgt für eine reibungslose Abwicklung und pünktliche Lieferung Ihrer Bestellungen.",
        img: "/co2.png",
    },
];

const co2Items = [
    {
        title: "Reduzierte Emissionen",
        text: "Unsere Verpackungen sind so konzipiert, dass sie den CO₂-Ausstoß während der Herstellung und des Transports minimieren.",
    },
    {
        title: "Recycelbare Materialien",
        text: "Wir verwenden Materialien, die leicht recycelbar sind, um die Umweltbelastung zu verringern.",
    },
    {
        title: "Nachhaltige Lieferkette",
        text: "Wir arbeiten mit Lieferanten zusammen, die nachhaltige Praktiken fördern und umsetzen.",
    },
    {
        title: "Kompakte Designs",
        text: "Unsere Verpackungen sind platzsparend gestaltet, um den Transport effizienter zu machen und Emissionen zu reduzieren.",
    },
];

const services = [
    {
        title: "Beratung & Planung",
        text: "Unser Expertenteam unterstützt Sie bei der Auswahl der optimalen Verpackungslösungen für Ihre Produkte.",
        icon: "/icons/standard.svg",
        color: colors.lightCopper,
    },
    {
        title: "Individuelle Anfertigung",
        text: "Wir bieten maßgeschneiderte Verpackungen, die genau auf Ihre Anforderungen und Ihr Branding abgestimmt sind.",
        icon: "/icons/individuell.svg",
        color: colors.copper,
    },
    {
        title: "Schnelle Lieferung",
        text: "Dank unseres effizienten Logistiknetzwerks garantieren wir eine pünktliche Lieferung Ihrer Bestellungen.",
        icon: "/icons/service.svg",
        color: colors.darkGreen,
    },
];

const teamMembers = [
    { name: "WERNER FINK", role: "Geschäftsführer" },
    { name: "KORBINIAN FINK", role: "Vertrieb & Marketing" },
    { name: "MARIO DEILEN", role: "Vertrieb & Einkauf" },
    { name: "SIEGLINDE FINK", role: "Buchhaltung & Verwaltung" },
    { name: "JENNIFER KOVAL", role: "Vertrieb Innendienst" },
    { name: "BENEDIKT IMHOFER", role: "Einkauf & Logistik" },
]

export default function Page() {

    //const categories = await fetchCategories();

    const [categories, setCategories] = React.useState<Category[]>([]);

    React.useEffect(() => {
        fetchCategories().then(setCategories);
    }, []);

    const fadeUp: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    };
    const viewport = { once: false, amount: 0.2 } as const;
    const scaleIn: Variants = {
        hidden: { opacity: 0, scale: 0.96 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    };

    return (
        <div className="bg-white" style={{ color: colors.darkGreen }}>
            {/* HERO (now a slider) */}
            <HeroSlider />

            {/* USP STRIP */}
            <section className="py-10" style={{ backgroundColor: colors.darkGreen, color: "white" }}>
                <Container>
                    <motion.div
                        className="grid md:grid-cols-[1fr_auto] items-center gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        variants={fadeUp}
                    >
                        <div>
                            <h3 className="text-2xl md:text-3xl font-extrabold">Wir liefern Lösungen.</h3>
                            <p className="opacity-90 mt-2 max-w-3xl">Unser Ziel ist es, nicht nur Produkte, sondern komplette Lösungen zu bieten.</p>
                        </div>
                        <Button asChild>
                            <Link href="/leistungen">Unsere Leistungen</Link>
                        </Button>
                    </motion.div>
                    <div className="mt-7 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center text-[15px]">
                        {uspBullets.map((b: string, idx: number) => {
                            const Icon = [Leaf, Zap, PackageSearch, Timer][idx];
                            return (
                                <motion.div
                                    key={b}
                                    className="space-y-2"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={viewport}
                                    variants={fadeUp}
                                    transition={{ delay: idx * 0.08 }}
                                >
                                    <div><Icon className="mx-auto size-10" style={{ color: colors.lightGreen }} /></div>
                                    <div className="font-semibold">{b}</div>
                                </motion.div>
                            );
                        })}
                    </div>
                </Container>
            </section>

            {/* VERPACKUNG WEITERGEDACHT */}
            <section id="unternehmen" className="py-16 md:py-24">
                <Container>
                    <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
                        <SectionTitle center title={"Verpackungen weitergedacht."} />
                    </motion.div>
                    <motion.div className="text-center opacity-80 max-w-3xl mx-auto" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} transition={{ delay: 0.05 }}>
                        Sortiment, Qualität und Verfügbarkeit sind Standards –
                        aber keine Differenzierung.
                        Wir denken in Lösungen:
                        Praktische Details wie Aufreißfaden und Selbstklebeverschluss
                        verbessern das Nutzungserlebnis, während unsere Co2-reduzierten
                        Verpackungen für Nachhaltigkeit und Innovation stehen.
                    </motion.div>

                    <div className="mt-10 grid gap-7 md:grid-cols-3">
                        {features.map((c: { title: string; text: string; img: string }, idx: number) => (
                            <motion.div
                                key={c.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewport}
                                variants={fadeUp}
                                transition={{ delay: idx * 0.08 }}
                            >
                                <Card className="overflow-hidden shadow-sm border-primary/50">
                                    <motion.div
                                        className="h-60 w-full bg-center bg-cover"
                                        style={{ backgroundImage: `url(${c.img})` }}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={viewport}
                                        variants={scaleIn}
                                    />
                                    <CardHeader>
                                        <CardTitle className="text-lg" style={{ color: colors.green900 }}>{c.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="opacity-80">{c.text}</CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                </Container>
            </section>

            {/* PRODUCT CLUSTERS – big row */}
            <section id="produkte" className="py-10 md:py-16" style={{ backgroundColor: colors.lightCopper }}>
                <Container>
                    <motion.h3
                        className="text-3xl md:text-4xl font-extrabold mb-20 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        variants={fadeUp}
                    >
                        Unser Standard.
                        <br />
                        <span style={{ color: colors.lightGreen }}>Ihre Produkte, unsere Lösungen.</span>
                    </motion.h3>
                    <div className="grid gap-6 md:grid-cols-3">
                        {categories.map((c: Category, idx: number) => (
                            <motion.div
                                key={c.id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewport}
                                variants={fadeUp}
                                transition={{ delay: idx * 0.08 }}
                            >
                                <Link href={"/produkte/" + c.id} aria-label={"what"} className="relative isolate overflow-hidden shadow block group">
                                    <motion.div
                                        className="h-60 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${c.media[0]})` }}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={viewport}
                                        variants={scaleIn}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                                        <div className="font-extrabold tracking-wide">{c.name}</div>
                                        <span className="inline-flex items-center justify-center rounded-full bg-white/15 group-hover:bg-white/25 transition w-9 h-9">
                                            <ChevronRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                </Container>
            </section>

            {/* CO2 banner */}
            <section className="py-16 md:py-20 text-white text-center" style={{ backgroundColor: colors.darkGreen }}>
                <Container>
                    <motion.h3
                        className="text-3xl md:text-4xl font-extrabold"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        variants={fadeUp}
                    >
                        Champions in Sachen
                        <br />
                        <span style={{ color: colors.lightGreen }}>CO₂‑Reduktion.</span>
                    </motion.h3>
                    <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-sm">
                        {co2Items.map((co: { title: string; text: string }, idx: number) => {
                            const Icon = [Boxes, Package2, Recycle, Truck][idx];
                            return (
                                <motion.div
                                    key={co.title}
                                    className="space-y-2"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={viewport}
                                    variants={fadeUp}
                                    transition={{ delay: idx * 0.08 }}
                                >
                                    <div><Icon className="mx-auto size-14" style={{ color: colors.lightGreen }} /></div>
                                    <div className="font-semibold">{co.title}</div>
                                    <p className="text-white/85 leading-snug">{co.text}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                    <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} transition={{ delay: 0.15 }}>
                        <Button asChild className="mt-8">
                            <Link href="/produktkategorien/co2-master">CO₂‑Fußabdruck reduzieren</Link>
                        </Button>
                    </motion.div>
                </Container>
            </section>

            {/* Leistungen */}
            <section id="leistungen" className="py-16 md:py-24">
                <Container>
                    <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
                        <SectionTitle center title={"Unser Leistungsangebot."} />
                    </motion.div>
                    <div className="grid gap-14 md:gap-6 md:grid-cols-3 mt-20">
                        {services.map((s: { title: string; text: string; icon: string; color: string }, idx: number) => (
                            <motion.div
                                key={s.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewport}
                                variants={fadeUp}
                                transition={{ delay: idx * 0.08 }}
                            >
                                <Card className="text-center text-white" style={{ borderColor: s.color, backgroundColor: s.color }}>
                                    <CardHeader>
                                        <Image className="mx-auto mb-2 mt-[-75px]" width="100" height="100" src={s.icon} alt=""></Image>
                                        <CardTitle>{s.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="opacity-80">{s.text}</CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Team */}
            <section className="mt-[-75px] py-16 md:py-24">
                <Container>
                    <motion.div initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp}>
                        <SectionTitle center title={"Unsere Champions für Sie"} />
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div
                            className="overflow-hidden shadow relative w-full h-full min-h-70"
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewport}
                            variants={scaleIn}
                        >
                            <Image src="/team.JPG" alt="Team" fill className="object-cover" />
                        </motion.div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 content-start">
                            {teamMembers.map((p: { name: string; role: string }, idx: number) => {
                                // Map names to image file names (ensure these exist in /public)
                                const imageMap: Record<string, string> = {
                                    "WERNER FINK": "/team/werner.JPG",
                                    "KORBINIAN FINK": "/team/korbinian.JPG",
                                    "MARIO DEILEN": "/team/mario.JPG",
                                    "SIEGLINDE FINK": "/team/sieglinde.JPG",
                                    "JENNIFER KOVAL": "/team/jennifer.JPG",
                                    "BENEDIKT IMHOFER": "/team/benedikt.JPG",
                                    // Preserve others if added later (could fallback to generic placeholder)
                                };
                                const imgSrc = imageMap[p.name] || "/team.JPG"; // fallback
                                return (
                                    <motion.div
                                        key={p.name}
                                        className="text-center"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={viewport}
                                        variants={fadeUp}
                                        transition={{ delay: idx * 0.08 }}
                                    >
                                        <div className="relative mx-auto h-24 w-24 overflow-hidden shadow-sm">
                                            <Image
                                                src={imgSrc}
                                                alt={p.name}
                                                fill
                                                sizes="96px"
                                                className="object-cover"
                                                priority={idx < 2}
                                            />
                                        </div>
                                        <div className="mt-3 font-semibold leading-tight" style={{ color: colors.green900 }}>{p.name}</div>
                                        <div className="text-xs opacity-75">{p.role}</div>
                                    </motion.div>
                                );
                            })}
                            <motion.div className="col-span-full" initial="hidden" whileInView="visible" viewport={viewport} variants={fadeUp} transition={{ delay: 0.15 }}>
                                <Button className="w-full">Alle Ansprechpartner</Button>
                            </motion.div>
                        </div>
                    </div>
                </Container>
            </section>

        </div>
    );
}
