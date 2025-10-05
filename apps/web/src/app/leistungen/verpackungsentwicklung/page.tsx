"use client";

import React from "react";
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Ruler, FlaskConical, Box, CheckCircle2, Cog, Users, TrendingUp } from "lucide-react";
import { colors } from "@/lib/colors";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerpackungsentwicklungPage() {
  const phases = [
    {
      icon: Users,
      title: "1. Beratung & Analyse",
      description: "Wir analysieren Ihre Anforderungen und beraten Sie zu den besten Lösungsansätzen.",
      details: [
        "Anforderungsanalyse",
        "Produktanalyse",
        "Zielgruppenbestimmung",
        "Budget- und Zeitplanung"
      ]
    },
    {
      icon: Lightbulb,
      title: "2. Konzeptentwicklung",
      description: "Kreative Ideenfindung und Entwicklung verschiedener Lösungskonzepte.",
      details: [
        "Ideenworkshops",
        "Konzeptskizzen",
        "Materialauswahl",
        "Nachhaltigkeitsbewertung"
      ]
    },
    {
      icon: Ruler,
      title: "3. Konstruktion & Design",
      description: "Technische Umsetzung und detaillierte Konstruktion der Verpackung.",
      details: [
        "CAD-Konstruktion",
        "Technische Zeichnungen",
        "Materialtests",
        "Optimierung der Konstruktion"
      ]
    },
    {
      icon: FlaskConical,
      title: "4. Prototyping",
      description: "Erstellung und Test von Prototypen für Funktionalität und Stabilität.",
      details: [
        "Musterherstellung",
        "Belastungstests",
        "Versandtests",
        "Anpassungen und Optimierung"
      ]
    },
    {
      icon: Box,
      title: "5. Produktion & Lieferung",
      description: "Serienproduktion und pünktliche Lieferung Ihrer maßgeschneiderten Verpackung.",
      details: [
        "Produktionsvorbereitung",
        "Qualitätskontrolle",
        "Serienfertigung",
        "Logistik und Versand"
      ]
    },
  ];

  const advantages = [
    {
      icon: Cog,
      title: "Maßgeschneidert",
      description: "Individuelle Entwicklung passgenau für Ihre Produkte und Anforderungen."
    },
    {
      icon: TrendingUp,
      title: "Kostenoptimiert",
      description: "Effiziente Lösungen reduzieren Material- und Versandkosten nachhaltig."
    },
    {
      icon: CheckCircle2,
      title: "Nachhaltig",
      description: "Umweltfreundliche Materialien und ressourcenschonende Produktionsprozesse."
    },
  ];

  const services = [
    {
      title: "Neuentwicklung",
      description: "Entwicklung völlig neuer Verpackungslösungen von Grund auf.",
      icon: Lightbulb
    },
    {
      title: "Optimierung",
      description: "Verbesserung bestehender Verpackungen hinsichtlich Kosten und Funktion.",
      icon: TrendingUp
    },
    {
      title: "Prototyping",
      description: "Schnelle Erstellung von Mustern und funktionsfähigen Prototypen.",
      icon: FlaskConical
    },
    {
      title: "Beratung",
      description: "Umfassende Beratung zu Materialien, Konstruktion und Nachhaltigkeit.",
      icon: Users
    },
  ];

  const examples = [
    {
      title: "E-Commerce Versandverpackung",
      challenge: "Reduzierung der Versandkosten bei gleichzeitiger Produktsicherheit.",
      solution: "Entwicklung einer maßgeschneiderten Verpackung mit 30% weniger Material.",
      result: "25% Kostenersparnis und verbesserte Kundenzufriedenheit."
    },
    {
      title: "Nachhaltige Lebensmittelverpackung",
      challenge: "Umstellung auf 100% kompostierbare Verpackung für Bio-Produkte.",
      solution: "Entwicklung einer innovativen Verpackung aus Graspapier.",
      result: "CO₂-Reduktion um 40% und positives Markenimage."
    },
    {
      title: "Schutzhülle für Elektronik",
      challenge: "Sicherer Transport empfindlicher elektronischer Geräte.",
      solution: "Konstruktion mit integrierten Dämpfungselementen und antistatischem Material.",
      result: "Reduzierung der Transportschäden um 85%."
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
                Verpackungsentwicklung
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
                Innovative Verpackungslösungen nach Maß
              </h1>
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                Von der ersten Idee bis zur Serienproduktion – wir entwickeln maßgeschneiderte 
                Verpackungslösungen, die perfekt zu Ihren Produkten passen. Mit jahrelanger Erfahrung 
                und innovativen Technologien schaffen wir Verpackungen, die schützen, begeistern und 
                die Umwelt schonen.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/unternehmen/kontakt">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Projekt anfragen
                  </Button>
                </Link>
                <Link href="/leistungen/verpackungsdesign">
                  <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Verpackungsdesign
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/hero-4.png"
                alt="Verpackungsentwicklung"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Development Process Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Unser Prozess"
            title="Von der Idee zur fertigen Verpackung"
            center
          />
          <div className="space-y-6 max-w-4xl mx-auto">
            {phases.map((phase, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                        <phase.icon className="w-8 h-8" style={{ color: colors.darkGreen }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: colors.darkGreen }}>
                        {phase.title}
                      </h3>
                      <p className="text-foreground/70 mb-4">{phase.description}</p>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {phase.details.map((detail, didx) => (
                          <li key={didx} className="flex items-center gap-2 text-sm text-foreground/80">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-sm font-semibold tracking-widest uppercase mb-4 text-emerald-200">
                Ihre Vorteile
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                Warum maßgeschneiderte Entwicklung?
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {advantages.map((advantage, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <advantage.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
                  <p className="text-white/80">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Unsere Services"
            title="Was wir für Sie entwickeln"
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow text-center">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-7 h-7" style={{ color: colors.darkGreen }} />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Examples Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <Container>
          <SectionTitle
            kicker="Erfolgsgeschichten"
            title="Unsere Entwicklungsprojekte"
            center
          />
          <div className="grid md:grid-cols-3 gap-6">
            {examples.map((example, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg mb-2">{example.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground/70 mb-1">Herausforderung</h4>
                    <p className="text-sm text-foreground/80">{example.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground/70 mb-1">Lösung</h4>
                    <p className="text-sm text-foreground/80">{example.solution}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground/70 mb-1">Ergebnis</h4>
                    <p className="text-sm font-semibold" style={{ color: colors.darkGreen }}>
                      {example.result}
                    </p>
                  </div>
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
            <Lightbulb className="w-16 h-16 mx-auto mb-6" style={{ color: colors.darkGreen }} />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Lassen Sie uns Ihre Idee verwirklichen
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Egal ob Neuentwicklung oder Optimierung bestehender Verpackungen – wir helfen Ihnen dabei, 
              die perfekte Lösung zu finden. Kontaktieren Sie uns für ein unverbindliches Beratungsgespräch.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/unternehmen/kontakt">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Projekt starten
                </Button>
              </Link>
              <Link href="/unternehmen/ansprechpartner">
                <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Experten kontaktieren
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
