"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, ChevronDown, Mail, MessageCircle } from "lucide-react";
import Container from "./container";
import Link from "next/link";

const header = {
    company: "UNTERNEHMEN",
    sustainability: "Nachhaltigkeit",
    careers: "Karriere",
    contacts: "Ansprechpartner",
    contact: "Kontakt",
    services: "LEISTUNGEN",
    packaging: "Verpackungen",
    packagingDevelopment: "Verpackungsentwicklung",
    packagingDesign: "Verpackungsdesign",
    dropshipping: "Dropshipping",
    products: "PRODUKTE",
    allProducts: "Alle Produkte",
    catalog: "KATALOG",
    productGroups: "Produktgruppen",
    articles: "Artikel",
    shop: "SHOP",
    b2b: "B2B",
    login: "Login",
    logout: "Logout",
    cart: "Warenkorb",
    wishlist: "Merkliste",
    overview: "Übersicht",
};

type Category = {
    id: string;
    name: string;
    color: string;
    description?: string;
    groupCount: number;
    media: string[];
};

const API = process.env.NEXT_PUBLIC_API_BASE!;

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showSug, setShowSug] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [categories, setCategories] = useState<Category[]>([]);
    type MenuKey = "unternehmen" | "leistungen" | "produkte" | "katalog" | "shop" | "b2b";
    const [menuForceClosed, setMenuForceClosed] = useState<Record<MenuKey, boolean>>({
        unternehmen: false,
        leistungen: false,
        produkte: false,
        katalog: false,
        shop: false,
        b2b: false,
    });
    // Hover-out delay state for desktop dropdowns
    const [hoverOpen, setHoverOpen] = useState<Record<MenuKey, boolean>>({
        unternehmen: false,
        leistungen: false,
        produkte: false,
        katalog: false,
        shop: false,
        b2b: false,
    });
    const hoverTimers = useRef<Record<MenuKey, number | null>>({
        unternehmen: null,
        leistungen: null,
        produkte: null,
        katalog: null,
        shop: null,
        b2b: null,
    });
    const clearHoverTimer = (key: MenuKey) => {
        const id = hoverTimers.current[key];
        if (id) {
            window.clearTimeout(id);
            hoverTimers.current[key] = null;
        }
    };
    const onMenuEnter = (key: MenuKey) => {
        clearHoverTimer(key);
        setHoverOpen((s) => ({ ...s, [key]: true }));
    };
    const onMenuLeave = (key: MenuKey) => {
        clearHoverTimer(key);
        hoverTimers.current[key] = window.setTimeout(() => {
            setHoverOpen((s) => ({ ...s, [key]: false }));
            hoverTimers.current[key] = null;
        }, 140);
    };
    const pathname = usePathname();
    const router = useRouter();
    const desktopInputRef = useRef<HTMLInputElement | null>(null);
    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
    const isExact = (href: string) => pathname === href;

    // Fetch categories
    useEffect(() => {
        async function fetchCategories() {
            try {
                const r = await fetch(`${API}/api/categories`);
                if (r.ok) {
                    const data = await r.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        }
        fetchCategories();
    }, []);

    // Close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                const target = e.target as EventTarget | null;
                const el = target instanceof HTMLElement ? target : null;
                const tag = (el?.tagName || "").toLowerCase();
                const editable = el ? el.isContentEditable : false;
                // If user is typing in an input/textarea/contentEditable, only clear active item
                if (tag === "input" || tag === "textarea" || editable) {
                    e.preventDefault();
                    setActiveIndex(-1);
                    return;
                }
                // Otherwise close menus/dropdowns
                setMobileOpen(false);
                setShowSug(false);
            }
            // '/' to focus desktop search when not typing in an input/textarea/contentEditable
            if (
                e.key === "/" &&
                !e.metaKey &&
                !e.ctrlKey &&
                !e.altKey &&
                !e.shiftKey
            ) {
                const target = e.target as EventTarget | null;
                const el = target instanceof HTMLElement ? target : null;
                const tag = (el?.tagName || "").toLowerCase();
                const editable = el ? el.isContentEditable : false;
                if (tag !== "input" && tag !== "textarea" && !editable) {
                    e.preventDefault();
                    desktopInputRef.current?.focus();
                    setShowSug(true);
                }
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Close desktop dropdowns by removing focus from the clicked link
    function blurActive() {
        const el = document.activeElement;
        if (el instanceof HTMLElement) el.blur();
    }

    function forceCloseMenu(key: MenuKey) {
        setMenuForceClosed((s) => ({ ...s, [key]: true }));
        window.setTimeout(() => {
            setMenuForceClosed((s) => ({ ...s, [key]: false }));
        }, 300);
    }

    return (
        <>
            <header className={`sticky "top-0" z-[70] w-full border-b bg-white relative`}>
                <Container className="flex h-16 items-center gap-6">
                    <Link href="/" className="shrink-0">
                        <Image src="/logo.png" alt="PackChampion Logo" width={140} height={36} />
                    </Link>
                    <nav className="hidden md:flex items-center gap-7 text-[15px] font-medium text-foreground/90 ml-3">
                        {/* Unternehmen dropdown */}
                        <div className="relative group" onMouseEnter={() => onMenuEnter("unternehmen")} onMouseLeave={() => onMenuLeave("unternehmen")}>
                            <Link
                                href="/unternehmen"
                                aria-current={isActive("/unternehmen") ? "page" : undefined}
                                className={
                                    "hover:opacity-100 hover:text-emerald-900 inline-flex items-center gap-1 group-focus-within:opacity-100 relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-emerald-600 after:transition-[width] after:duration-200 " +
                                    (isActive("/unternehmen") ? "text-emerald-900 after:w-full" : "hover:after:w-full")
                                }
                                onClick={() => { blurActive(); forceCloseMenu("unternehmen"); }}
                            >
                                {header.company}
                                <ChevronDown className="h-4 w-4 opacity-70 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                            </Link>
                            <div
                                className={`absolute left-0 top-full min-w-[240px] z-50 p-2
              opacity-0 translate-y-2 pointer-events-none transition-all duration-150 ease-out
              group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
              group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto
              rounded-xl border border-emerald-900/10 bg-white shadow-xl ring-1 ring-black/5 ${hoverOpen.unternehmen ? "opacity-100 translate-y-0 pointer-events-auto" : ""} ${menuForceClosed.unternehmen ? "hidden" : ""}`}
                            >
                                <Link href="/unternehmen/nachhaltigkeit" onClick={() => { blurActive(); forceCloseMenu("unternehmen"); }} className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-emerald-50 ${isExact("/unternehmen/nachhaltigkeit") ? "bg-emerald-50 font-semibold text-emerald-900" : "text-foreground/90"}`}>
                                    {header.sustainability}
                                </Link>
                                <Link href="/unternehmen/karriere" onClick={() => { blurActive(); forceCloseMenu("unternehmen"); }} className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-emerald-50 ${isExact("/unternehmen/karriere") ? "bg-emerald-50 font-semibold text-emerald-900" : "text-foreground/90"}`}>
                                    {header.careers}
                                </Link>
                                <Link href="/unternehmen/ansprechpartner" onClick={() => { blurActive(); forceCloseMenu("unternehmen"); }} className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-emerald-50 ${isExact("/unternehmen/ansprechpartner") ? "bg-emerald-50 font-semibold text-emerald-900" : "text-foreground/90"}`}>
                                    {header.contacts}
                                </Link>
                                <Link href="/unternehmen/kontakt" onClick={() => { blurActive(); forceCloseMenu("unternehmen"); }} className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-emerald-50 ${isExact("/unternehmen/kontakt") ? "bg-emerald-50 font-semibold text-emerald-900" : "text-foreground/90"}`}>
                                    {header.contact}
                                </Link>
                            </div>
                        </div>
                        {/* Leistungen dropdown */}
                        <div className="relative group" onMouseEnter={() => onMenuEnter("leistungen")} onMouseLeave={() => onMenuLeave("leistungen")}>
                            <Link
                                href="/leistungen"
                                aria-current={isActive("/leistungen") ? "page" : undefined}
                                className={
                                    "hover:opacity-100 hover:text-emerald-900 inline-flex items-center gap-1 group-focus-within:opacity-100 relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-emerald-600 after:transition-[width] after:duration-200 " +
                                    (isActive("/leistungen") ? "text-emerald-900 after:w-full" : "hover:after:w-full")
                                }
                                onClick={() => { blurActive(); forceCloseMenu("leistungen"); }}
                            >
                                {header.services}
                                <ChevronDown className="h-4 w-4 opacity-70 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                            </Link>
                            <div
                                className={`absolute left-0 top-full min-w-[260px] z-50 p-2
              opacity-0 translate-y-2 pointer-events-none transition-all duration-150 ease-out
              group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
              group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto
              rounded-xl border border-emerald-900/10 bg-white shadow-xl ring-1 ring-black/5 ${hoverOpen.leistungen ? "opacity-100 translate-y-0 pointer-events-auto" : ""} ${menuForceClosed.leistungen ? "hidden" : ""}`}
                            >
                                <Link href="/leistungen/verpackungen" onClick={() => { blurActive(); forceCloseMenu("leistungen"); }} className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-emerald-50 ${isExact("/leistungen/verpackungen") ? "bg-emerald-50 font-semibold text-emerald-900" : "text-foreground/90"}`}>{header.packaging}</Link>
                                <Link href="/leistungen/verpackungsentwicklung" onClick={() => { blurActive(); forceCloseMenu("leistungen"); }} className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-emerald-50 ${isExact("/leistungen/verpackungsentwicklung") ? "bg-emerald-50 font-semibold text-emerald-900" : "text-foreground/90"}`}>{header.packagingDevelopment}</Link>
                                <Link href="/leistungen/verpackungsdesign" onClick={() => { blurActive(); forceCloseMenu("leistungen"); }} className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-emerald-50 ${isExact("/leistungen/verpackungsdesign") ? "bg-emerald-50 font-semibold text-emerald-900" : "text-foreground/90"}`}>{header.packagingDesign}</Link>
                                <Link href="/leistungen/dropshipping" onClick={() => { blurActive(); forceCloseMenu("leistungen"); }} className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-emerald-50 ${isExact("/leistungen/dropshipping") ? "bg-emerald-50 font-semibold text-emerald-900" : "text-foreground/90"}`}>{header.dropshipping}</Link>
                            </div>
                        </div>
                        {/* Produkte dropdown */}
                        <div className="relative group" onMouseEnter={() => onMenuEnter("produkte")} onMouseLeave={() => onMenuLeave("produkte")}>
                            <Link
                                href="/produkte"
                                aria-current={isActive("/produkte") ? "page" : undefined}
                                className={
                                    "hover:opacity-100 hover:text-emerald-900 inline-flex items-center gap-1 group-focus-within:opacity-100 relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-emerald-600 after:transition-[width] after:duration-200 " +
                                    (isActive("/produkte") ? "text-emerald-900 after:w-full" : "hover:after:w-full")
                                }
                                onClick={() => { blurActive(); forceCloseMenu("produkte"); }}
                            >
                                {header.products}
                                <ChevronDown className="h-4 w-4 opacity-70 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                            </Link>
                            <div
                                className={`absolute left-0 top-full min-w-[280px] max-h-[70vh] overflow-y-auto z-50 p-2
              opacity-0 translate-y-2 pointer-events-none transition-all duration-150 ease-out
              group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
              group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto
              rounded-xl border border-emerald-900/10 bg-white shadow-xl ring-1 ring-black/5 ${hoverOpen.produkte ? "opacity-100 translate-y-0 pointer-events-auto" : ""} ${menuForceClosed.produkte ? "hidden" : ""}`}
                            >
                                <Link href="/produkte" onClick={() => { blurActive(); forceCloseMenu("produkte"); }} className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-emerald-50 font-semibold ${isExact("/produkte") ? "bg-emerald-50 text-emerald-900" : "text-foreground/90"}`}>
                                    {header.allProducts}
                                </Link>
                                {categories.length > 0 && (
                                    <div className="border-t border-emerald-900/10 my-2" />
                                )}
                                {categories.map((category) => (
                                    <Link 
                                        key={category.id}
                                        href={`/produkte/${category.id}`} 
                                        onClick={() => { blurActive(); forceCloseMenu("produkte"); }} 
                                        className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-emerald-50 ${isActive(`/produkte/${category.id}`) ? "bg-emerald-50 font-semibold text-emerald-900" : "text-foreground/90"}`}
                                    >
                                        <div 
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: category.color }}
                                        />
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {/* Katalog dropdown */}
                        <div className="relative group" onMouseEnter={() => onMenuEnter("katalog")} onMouseLeave={() => onMenuLeave("katalog")}>
                            <Link
                                href="/katalog"
                                aria-current={isActive("/katalog") ? "page" : undefined}
                                className={
                                    "hover:opacity-100 hover:text-emerald-900 inline-flex items-center gap-1 group-focus-within:opacity-100 relative pb-1 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-emerald-600 after:transition-[width] after:duration-200 " +
                                    (isActive("/katalog") ? "text-emerald-900 after:w-full" : "hover:after:w-full")
                                }
                                onClick={() => { blurActive(); forceCloseMenu("katalog"); }}
                            >
                                {header.catalog}
                                <ChevronDown className="h-4 w-4 opacity-70 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                            </Link>
                            <div
                                className={`absolute left-0 top-full min-w-[240px] z-50 p-2
              opacity-0 translate-y-2 pointer-events-none transition-all duration-150 ease-out
              group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
              group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto
              rounded-xl border border-emerald-900/10 bg-white shadow-xl ring-1 ring-black/5 ${hoverOpen.katalog ? "opacity-100 translate-y-0 pointer-events-auto" : ""} ${menuForceClosed.katalog ? "hidden" : ""}`}
                            >
                                <Link href="/produktgruppen" onClick={() => { blurActive(); forceCloseMenu("katalog"); }} className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-emerald-50 ${isExact("/produktgruppen") || isActive("/produktgruppen/") ? "bg-emerald-50 font-semibold text-emerald-900" : "text-foreground/90"}`}>
                                    {header.productGroups}
                                </Link>
                                <Link href="/artikel" onClick={() => { blurActive(); forceCloseMenu("katalog"); }} className={`flex items-center gap-2 rounded-md px-3 py-2 hover:bg-emerald-50 ${isExact("/artikel") || isActive("/artikel/") ? "bg-emerald-50 font-semibold text-emerald-900" : "text-foreground/90"}`}>
                                    {header.articles}
                                </Link>
                            </div>
                        </div>

                    </nav>
                    <a
                        href="mailto:info@packchampion.de"
                        aria-label="E-Mail senden"
                        className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-emerald-900 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8dc00]"
                    >
                        <Mail className="h-6 w-6" />
                    </a>
                    <a
                        href="https://wa.me/4912345678900"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp öffnen"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-emerald-900 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c8dc00]"
                    >
                        <MessageCircle className="h-6 w-6" />
                    </a>
                    <div className="flex items-center gap-3">

                        {/* Mobile hamburger (moved to the right) */}
                        <button
                            type="button"
                            className="md:hidden inline-flex items-center justify-center p-2 text-foreground/80 hover:text-foreground focus:outline-none"
                            aria-label={"open"}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-menu"
                            onClick={() => setMobileOpen((v) => !v)}
                        >
                            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </Container>

                {/* Mobile menu panel */}
                {mobileOpen && (
                    <>
                        <div
                            id="mobile-menu"
                            className={`md:hidden fixed left-0 right-0 top-16 z-[60] rounded-b-2xl border border-emerald-900/10 bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-4`}
                        >
                            <Container className="py-4">
                                <nav className="flex flex-col gap-1.5 text-[15px] font-medium">
                                    {/* Unternehmen collapsible */}
                                    <details className="group rounded-lg">
                                        <summary className="flex items-center justify-between cursor-pointer py-3 px-2 -mx-1 rounded-md hover:bg-emerald-50">
                                            <span className={isActive("/unternehmen") ? "text-emerald-900 font-semibold" : undefined}>{header.company}</span>
                                            <ChevronDown className="h-4 w-4 opacity-70 transition-transform group-open:rotate-180" />
                                        </summary>
                                        <div className="pl-3 pb-2 ml-2 border-l border-primary/50 flex flex-col text-[14px]">
                                            <Link href="/unternehmen" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/unternehmen") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.overview}
                                            </Link>
                                            <Link href="/unternehmen/nachhaltigkeit" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/unternehmen/nachhaltigkeit") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.sustainability}
                                            </Link>
                                            <Link href="/unternehmen/karriere" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/unternehmen/karriere") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.careers}
                                            </Link>
                                            <Link href="/unternehmen/ansprechpartner" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/unternehmen/ansprechpartner") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.contacts}
                                            </Link>
                                            <Link href="/unternehmen/kontakt" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/unternehmen/kontakt") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.contact}
                                            </Link>
                                        </div>
                                    </details>
                                    <details className="group rounded-lg">
                                        <summary className="flex items-center justify-between cursor-pointer py-3 px-2 -mx-1 rounded-md hover:bg-emerald-50">
                                            <span className={isActive("/leistungen") ? "text-emerald-900 font-semibold" : undefined}>{header.services}</span>
                                            <ChevronDown className="h-4 w-4 opacity-70 transition-transform group-open:rotate-180" />
                                        </summary>
                                        <div className="pl-3 pb-2 ml-2 border-l border-primary/50 flex flex-col text-[14px]">
                                            <Link href="/leistungen" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/leistungen") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.overview}
                                            </Link>
                                            <Link href="/leistungen/verpackungen" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/leistungen/verpackungen") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.packaging}
                                            </Link>
                                            <Link href="/leistungen/verpackungsentwicklung" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/leistungen/verpackungsentwicklung") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.packagingDevelopment}
                                            </Link>
                                            <Link href="/leistungen/verpackungsdesign" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/leistungen/verpackungsdesign") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.packagingDesign}
                                            </Link>
                                            <Link href="/leistungen/dropshipping" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/leistungen/dropshipping") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.dropshipping}
                                            </Link>
                                        </div>
                                    </details>
                                    <details className="group rounded-lg">
                                        <summary className="flex items-center justify-between cursor-pointer py-3 px-2 -mx-1 rounded-md hover:bg-emerald-50">
                                            <span className={isActive("/produkte") ? "text-emerald-900 font-semibold" : undefined}>{header.products}</span>
                                            <ChevronDown className="h-4 w-4 opacity-70 transition-transform group-open:rotate-180" />
                                        </summary>
                                        <div className="pl-3 pb-2 ml-2 border-l border-primary/50 flex flex-col text-[14px]">
                                            <Link href="/produkte" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/produkte") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.allProducts}
                                            </Link>
                                            {categories.map((category) => (
                                                <Link 
                                                    key={category.id}
                                                    href={`/produkte/${category.id}`} 
                                                    className={`py-2 px-3 rounded-md hover:bg-emerald-50 flex items-center gap-2 ${isActive(`/produkte/${category.id}`) ? "text-emerald-900 font-semibold" : ""}`} 
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    <div 
                                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: category.color }}
                                                    />
                                                    {category.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </details>
                                    <details className="group rounded-lg">
                                        <summary className="flex items-center justify-between cursor-pointer py-3 px-2 -mx-1 rounded-md hover:bg-emerald-50">
                                            <span className={isActive("/katalog") ? "text-emerald-900 font-semibold" : undefined}>{header.catalog}</span>
                                            <ChevronDown className="h-4 w-4 opacity-70 transition-transform group-open:rotate-180" />
                                        </summary>
                                        <div className="pl-3 pb-2 ml-2 border-l border-primary/50 flex flex-col text-[14px]">
                                            <Link href="/katalog" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/katalog") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.overview}
                                            </Link>
                                            <Link href="/produktgruppen" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/produktgruppen") || isActive("/produktgruppen/") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.productGroups}
                                            </Link>
                                            <Link href="/artikel" className={`py-2 px-3 rounded-md hover:bg-emerald-50 ${isExact("/artikel") || isActive("/artikel/") ? "text-emerald-900 font-semibold" : ""}`} onClick={() => setMobileOpen(false)}>
                                                {header.articles}
                                            </Link>
                                        </div>
                                    </details>


                                </nav>
                            </Container>
                        </div>
                    </>
                )}
            </header>
        </>
    );
}
