"use client";

import React from "react";
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Sparkles, Eye, Printer, CheckCircle2, Layers, Image as ImageIcon, Award } from "lucide-react";
import { colors } from "@/lib/colors";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VerpackungsdesignPage() {
  const services = [
    {
      icon: Palette,
      title: "Konzeptentwicklung",
      description: "Kreative Designkonzepte, die Ihre Marke perfekt repräsentieren.",
      features: [
        "Markenanalyse",
        "Moodboards",
        "Designentwürfe",
        "Farbkonzepte"
      ]
    },
    {
      icon: ImageIcon,
      title: "Grafikdesign",
      description: "Professionelles Layout und Gestaltung für Ihre Verpackungen.",
      features: [
        "Logo-Integration",
        "Typografie",
        "Illustrationen",
        "Bildbearbeitung"
      ]
    },
    {
      icon: Layers,
      title: "3D-Visualisierung",
      description: "Realistische 3D-Darstellungen Ihrer Verpackung vor der Produktion.",
      features: [
        "Fotorealistische Darstellung",
        "Verschiedene Perspektiven",
        "Materialsimulation",
        "Mockups"
      ]
    },
    {
      icon: Printer,
      title: "Druckvorstufe",
      description: "Professionelle Aufbereitung für den perfekten Druck.",
      features: [
        "Datenprüfung",
        "Farbmanagement",
        "Druckfreigabe",
        "Qualitätssicherung"
      ]
    },
  ];

  const designPrinciples = [
    {
      icon: Eye,
      title: "Markengerecht",
      description: "Designs, die Ihre Markenidentität stärken und konsistent kommunizieren."
    },
    {
      icon: Sparkles,
      title: "Einzigartig",
      description: "Kreative Lösungen, die Ihre Produkte aus der Masse hervorheben."
    },
    {
      icon: Award,
      title: "Hochwertig",
      description: "Professionelle Umsetzung auf höchstem gestalterischen Niveau."
    },
  ];

  const designTypes = [
    {
      title: "Produktverpackungen",
      description: "Verpackungsdesign für Ihre Produkte – vom einfachen Karton bis zur Premiumverpackung.",
      examples: ["E-Commerce Verpackungen", "Einzelhandelsverpackungen", "Geschenkverpackungen"]
    },
    {
      title: "Corporate Design",
      description: "Einheitliches Design über alle Verpackungen hinweg für starke Markenerkennung.",
      examples: ["Markenrichtlinien", "Designvorlagen", "Serielles Design"]
    },
    {
      title: "Limited Editions",
      description: "Besondere Designs für Sonderaktionen, Feiertage oder limitierte Auflagen.",
      examples: ["Saisonale Designs", "Aktionsverpackungen", "Jubiläumsausgaben"]
    },
    {
      title: "Nachhaltigkeitsdesign",
      description: "Designs, die Ihre Umweltverantwortung sichtbar kommunizieren.",
      examples: ["Eco-Design", "Minimalistische Gestaltung", "Nachhaltigkeitslabels"]
    },
  ];

  const process = [
    {
      step: "01",
      title: "Briefing",
      description: "Wir erfassen Ihre Wünsche, Ziele und Markenwerte."
    },
    {
      step: "02",
      title: "Konzeption",
      description: "Entwicklung verschiedener Designkonzepte zur Auswahl."
    },
    {
      step: "03",
      title: "Gestaltung",
      description: "Ausarbeitung des gewählten Konzepts bis ins Detail."
    },
    {
      step: "04",
      title: "Finalisierung",
      description: "Druckvorbereitung und finale Freigabe."
    },
  ];

  const features = [
    "Unbegrenzte Revisionen bis zur Zufriedenheit",
    "Professionelle 3D-Visualisierungen",
    "Alle gängigen Dateiformate",
    "Druckfähige Dateien inklusive",
    "Persönlicher Ansprechpartner",
    "Schnelle Umsetzung möglich",
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-20">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
                Verpackungsdesign
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
                Design, das Ihre Marke zum Strahlen bringt
              </h1>
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                Professionelles Verpackungsdesign ist mehr als schöne Optik – es ist ein mächtiges 
                Werkzeug für Ihre Marke. Wir gestalten Verpackungen, die Aufmerksamkeit erregen, 
                Emotionen wecken und Ihre Botschaft klar kommunizieren. Von der Konzeption bis zur 
                druckfertigen Datei.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/unternehmen/kontakt">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Designprojekt starten
                  </Button>
                </Link>
                <Link href="/leistungen/verpackungsentwicklung">
                  <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Verpackungsentwicklung
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/hero-4.png"
                alt="Verpackungsdesign"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Unsere Design-Services"
            title="Vom Konzept zur fertigen Gestaltung"
            center
          />
          <div className="grid sm:grid-cols-2 gap-6">
            {services.map((service, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <service.icon className="w-7 h-7" style={{ color: colors.darkGreen }} />
                  </div>
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, fidx) => (
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

      {/* Design Principles Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-sm font-semibold tracking-widest uppercase mb-4 text-emerald-200">
                Design-Prinzipien
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                Unsere Design-Philosophie
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {designPrinciples.map((principle, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <principle.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{principle.title}</h3>
                  <p className="text-white/80">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Design Types Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Design-Bereiche"
            title="Was wir für Sie gestalten"
            center
          />
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {designTypes.map((type, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl mb-2">{type.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70 mb-4">{type.description}</p>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground/70 mb-2">Beispiele:</p>
                    {type.examples.map((example, eidx) => (
                      <div key={eidx} className="flex items-center gap-2 text-sm text-foreground/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {example}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <Container>
          <SectionTitle
            kicker="Unser Prozess"
            title="So entstehen Ihre Designs"
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="text-6xl font-extrabold mb-4 text-emerald-100">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: colors.darkGreen }}>
                  {step.title}
                </h3>
                <p className="text-foreground/70">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Leistungen"
            title="Das ist bei uns inklusive"
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-foreground/80">{feature}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Portfolio CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Lassen Sie sich inspirieren
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Sehen Sie sich unsere bisherigen Designprojekte an oder lassen Sie uns 
              gemeinsam Ihr nächstes Verpackungsdesign entwickeln.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/unternehmen/kontakt">
                <Button size="lg" className="bg-white text-emerald-900 hover:bg-gray-100">
                  Design anfragen
                </Button>
              </Link>
              <Link href="/unternehmen/ansprechpartner">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Designer kontaktieren
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Palette className="w-16 h-16 mx-auto mb-6" style={{ color: colors.darkGreen }} />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Bereit für Ihr Designprojekt?
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Egal ob Sie ein komplett neues Design benötigen oder eine bestehende Verpackung 
              überarbeiten möchten – wir freuen uns auf Ihr Projekt!
            </p>
            <Link href="/unternehmen/kontakt">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Jetzt Designprojekt starten
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
