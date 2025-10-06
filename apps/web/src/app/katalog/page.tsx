"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Grid3x3, ArrowRight } from "lucide-react";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function KatalogPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500 py-20 md:py-32">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <Container className="relative">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm mb-6">
                            <Package className="h-4 w-4" />
                            <span>Vollständiger Produktkatalog</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Unser Katalog
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl">
                            Durchsuchen Sie unseren umfassenden Katalog mit Artikelgruppen und einzelnen Artikeln. 
                            Finden Sie die perfekte Verpackungslösung für Ihre Anforderungen.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Main Content */}
            <section className="py-16 md:py-24">
                <Container>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Artikelgruppen Card */}
                        <Card className="group relative overflow-hidden border-2 hover:border-emerald-600 hover:shadow-2xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative p-8">
                                <div className="mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mb-4 group-hover:scale-110 transition-transform">
                                        <Grid3x3 className="h-8 w-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                        Artikelgruppen
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        Erkunden Sie unsere organisierten Artikelgruppen. Jede Gruppe enthält 
                                        verwandte Artikel, die nach Kategorien und Eigenschaften sortiert sind.
                                    </p>
                                </div>
                                <ul className="space-y-2 mb-8 text-sm text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                        Übersichtliche Gruppierung nach Produkttypen
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                        Detaillierte Produktbeschreibungen
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                        Filterung nach Kategorien
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                        Bildergalerien und Spezifikationen
                                    </li>
                                </ul>
                                <Link href="/artikelgruppen">
                                    <Button className="w-full group-hover:bg-emerald-700">
                                        Artikelgruppen durchsuchen
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>

                        {/* Artikel Card */}
                        <Card className="group relative overflow-hidden border-2 hover:border-emerald-600 hover:shadow-2xl transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative p-8">
                                <div className="mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mb-4 group-hover:scale-110 transition-transform">
                                        <Package className="h-8 w-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                        Artikel
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        Durchsuchen Sie alle einzelnen Artikel in unserem Sortiment. 
                                        Finden Sie spezifische Produkte mit detaillierten technischen Daten.
                                    </p>
                                </div>
                                <ul className="space-y-2 mb-8 text-sm text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                        Vollständige Artikelübersicht
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                        Technische Spezifikationen
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                        Suchfunktion für schnellen Zugriff
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                        Maße, VPE und Palettierungsangaben
                                    </li>
                                </ul>
                                <Link href="/artikel">
                                    <Button className="w-full group-hover:bg-emerald-700">
                                        Artikel durchsuchen
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>

                    {/* Additional Info Section */}
                    <div className="mt-16 max-w-3xl mx-auto text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Nicht sicher, wo Sie anfangen sollen?
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            Unsere Artikelgruppen bieten einen strukturierten Überblick über verwandte Artikel, 
                            während die Artikelsuche direkten Zugriff auf spezifische Produkte ermöglicht. 
                            Beide Wege führen Sie zu detaillierten Produktinformationen und Spezifikationen.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/produktkategorien">
                                <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                                    Zu den Produktkategorien
                                </Button>
                            </Link>
                            <Link href="/unternehmen/kontakt">
                                <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                                    Kontakt aufnehmen
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-500">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Bereit, die perfekte Verpackung zu finden?
                        </h2>
                        <p className="text-lg text-white/90 mb-8">
                            Starten Sie jetzt Ihre Suche in unserem umfassenden Katalog.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/artikelgruppen">
                                <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100">
                                    Artikelgruppen erkunden
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/artikel">
                                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                                    Artikel durchsuchen
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}
