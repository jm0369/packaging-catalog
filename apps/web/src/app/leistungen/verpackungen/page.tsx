"use client";

import React from "react";
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Box, FileText, Layers, Shield, Truck, CheckCircle2, Star } from "lucide-react";
import { colors } from "@/lib/colors";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerpackungenPage() {
  const categories = [
    {
      icon: Package,
      title: "Versandtaschen",
      description: "Leichte und robuste Versandtaschen für sichere Zustellung.",
      link: "/verpackungskategorien/versandtaschen",
      image: "/kategorien/versandtaschen.jpg"
    },
    {
      icon: Box,
      title: "Versandkartons",
      description: "Stabile Kartons in verschiedenen Größen für jeden Bedarf.",
      link: "/verpackungskategorien/versandkartons",
      image: "/kategorien/versandkartons.jpg"

    },
    {
      icon: FileText,
      title: "Versandhülsen",
      description: "Idealer Schutz für Dokumente, Poster und empfindliche Waren.",
      link: "/verpackungskategorien/versandhuelsen",
      image: "/kategorien/versandhuelsen.jpg"
    },
    {
      icon: Layers,
      title: "Universalverpackungen",
      description: "Flexible Verpackungen für unterschiedlichste Produkte.",
      link: "/verpackungskategorien/universalverpackungen",
      image: "/kategorien/universalverpackungen.jpg"
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Optimaler Schutz",
      description: "Sichere Verpackungen schützen Ihre Produkte während des Transports."
    },
    {
      icon: Truck,
      title: "Versandoptimiert",
      description: "Gewichts- und größenoptimiert für minimale Versandkosten."
    },
    {
      icon: CheckCircle2,
      title: "Nachhaltig",
      description: "Umweltfreundliche Materialien und 100% recycelbar."
    },
    {
      icon: Star,
      title: "Markengerecht",
      description: "Individuell bedruckbar für perfekte Markenpräsentation."
    },
  ];

  const materials = [
    {
      name: "Wellpappe",
      description: "Robust und recycelbar – ideal für den Versand.",
      properties: ["Stoßfest", "Leicht", "Recyclebar"]
    },
    {
      name: "Kraftpapier",
      description: "Natürlich braunes Papier mit hoher Festigkeit.",
      properties: ["Reißfest", "Umweltfreundlich", "Bedruckbar"]
    },
    {
      name: "Recyclingpapier",
      description: "Aus 100% Altpapier für maximale Nachhaltigkeit.",
      properties: ["100% recycelt", "Ressourcenschonend", "Qualitativ hochwertig"]
    },
  ];

  const solutions = [
    {
      title: "Standard-Sortiment",
      description: "Sofort verfügbare Standardgrößen für den schnellen Bedarf.",
      features: ["Große Auswahl", "Schnelle Lieferung", "Attraktive Preise"]
    },
    {
      title: "Individuelle Größen",
      description: "Maßgefertigte Verpackungen passgenau für Ihre Produkte.",
      features: ["Exakte Abmessungen", "Optimaler Produktschutz", "Kosteneffizient"]
    },
    {
      title: "Bedruckte Verpackungen",
      description: "Verpackungen mit Ihrem Logo und Design für starke Markenpräsenz.",
      features: ["Markengerecht", "Hohe Druckqualität", "Individuelle Gestaltung"]
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-20">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
                Verpackungen
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
                Hochwertige Verpackungslösungen
              </h1>
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                Entdecken Sie unser umfangreiches Sortiment an Verpackungslösungen. Von Versandtaschen
                über Kartons bis hin zu spezialisierten Verpackungen – bei uns finden Sie die perfekte
                Lösung für Ihre Produkte. Nachhaltig, sicher und in höchster Qualität.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/verpackungskategorien">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Produkte entdecken
                  </Button>
                </Link>
                <Link href="/unternehmen/kontakt">
                  <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Beratung anfragen
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/hero-4.png"
                alt="Verpackungslösungen"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Produktkategorien"
            title="Unser Verpackungssortiment"
            center
          />
          <div className="grid sm:grid-cols-2 gap-6">
            {categories.map((category, idx) => (
              <Link key={idx} href={category.link}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer group overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                      <category.icon className="w-6 h-6" style={{ color: colors.darkGreen }} />
                    </div>
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-sm font-semibold tracking-widest uppercase mb-4 text-emerald-200">
                Vorteile
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                Warum unsere Verpackungen?
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-white/80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Materials Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Materialien"
            title="Nachhaltige Verpackungsmaterialien"
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {materials.map((material, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{material.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70 mb-4">{material.description}</p>
                  <ul className="space-y-2">
                    {material.properties.map((prop, pidx) => (
                      <li key={pidx} className="flex items-center gap-2 text-sm text-foreground/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {prop}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <Container>
          <SectionTitle
            kicker="Lösungen"
            title="Für jeden Bedarf die richtige Verpackung"
            center
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {solutions.map((solution, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">{solution.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 mb-4">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-sm text-foreground/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Package className="w-16 h-16 mx-auto mb-6" style={{ color: colors.darkGreen }} />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Finden Sie die perfekte Verpackung
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Stöbern Sie durch unser umfangreiches Produktsortiment oder lassen Sie sich von
              unseren Experten beraten. Wir helfen Ihnen, die optimale Verpackungslösung zu finden.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/verpackungskategorien">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Alle Produkte ansehen
                </Button>
              </Link>
              <Link href="/unternehmen/kontakt">
                <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Beratungstermin vereinbaren
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
