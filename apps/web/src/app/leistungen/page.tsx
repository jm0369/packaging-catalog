"use client";

import React from "react";
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Lightbulb, Palette, Truck, Settings, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { colors } from "@/lib/colors";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LeistungenPage() {
  const services = [
    {
      icon: Package,
      title: "Verpackungen",
      description: "Hochwertige Verpackungslösungen für jeden Bedarf – von Standard bis individuell.",
      link: "/leistungen/verpackungen",
      features: ["Große Produktvielfalt", "Schnelle Lieferung", "Beste Qualität"]
    },
    {
      icon: Lightbulb,
      title: "Verpackungsentwicklung",
      description: "Maßgeschneiderte Entwicklung innovativer Verpackungslösungen für Ihre Anforderungen.",
      link: "/leistungen/verpackungsentwicklung",
      features: ["Individuelle Konzepte", "Prototyping", "Optimierung"]
    },
    {
      icon: Palette,
      title: "Verpackungsdesign",
      description: "Kreatives Design, das Ihre Marke perfekt in Szene setzt und Kunden begeistert.",
      link: "/leistungen/verpackungsdesign",
      features: ["Markengerechtes Design", "3D-Visualisierung", "Druckvorstufe"]
    },
    {
      icon: Truck,
      title: "Dropshipping",
      description: "Effiziente Logistiklösungen – wir versenden direkt an Ihre Kunden.",
      link: "/leistungen/dropshipping",
      features: ["Lagerung", "Kommissionierung", "Direktversand"]
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Schnell & Flexibel",
      description: "Kurze Reaktionszeiten und flexible Anpassungen an Ihre Bedürfnisse."
    },
    {
      icon: Settings,
      title: "Maßgeschneidert",
      description: "Individuelle Lösungen, die perfekt zu Ihren Anforderungen passen."
    },
    {
      icon: CheckCircle2,
      title: "Qualitätsgarantie",
      description: "Höchste Qualitätsstandards bei allen Produkten und Dienstleistungen."
    },
  ];

  const process = [
    {
      step: "01",
      title: "Beratung",
      description: "Wir analysieren Ihre Anforderungen und beraten Sie umfassend zu den besten Lösungen."
    },
    {
      step: "02",
      title: "Konzeption",
      description: "Entwicklung eines maßgeschneiderten Konzepts mit detaillierter Planung."
    },
    {
      step: "03",
      title: "Umsetzung",
      description: "Professionelle Realisierung mit kontinuierlicher Abstimmung."
    },
    {
      step: "04",
      title: "Lieferung",
      description: "Pünktliche Lieferung in höchster Qualität direkt zu Ihnen."
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
                Unsere Leistungen
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
                Verpackungslösungen für jeden Anspruch
              </h1>
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                Von der ersten Idee bis zur fertigen Verpackung – wir begleiten Sie durch den gesamten Prozess. 
                Unsere umfassenden Leistungen verbinden innovative Entwicklung, kreatives Design und 
                effiziente Logistik zu einer Komplettlösung aus einer Hand.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/unternehmen/kontakt">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Jetzt beraten lassen
                  </Button>
                </Link>
                <Link href="/produkte">
                  <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Produkte ansehen
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

      {/* Services Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Was wir bieten"
            title="Unsere Leistungen im Überblick"
            center
          />
          <div className="grid sm:grid-cols-2 gap-6">
            {services.map((service, idx) => (
              <Link key={idx} href={service.link}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                      <service.icon className="w-7 h-7" style={{ color: colors.darkGreen }} />
                    </div>
                    <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70 mb-4">{service.description}</p>
                    <ul className="space-y-2 mb-4">
                      {service.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-center gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 text-emerald-600 font-medium group-hover:gap-3 transition-all">
                      Mehr erfahren
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-sm font-semibold tracking-widest uppercase mb-4 text-emerald-200">
                Ihre Vorteile
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                Warum PackChampion?
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-white/80">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Unser Prozess"
            title="Vom Konzept zur fertigen Verpackung"
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="text-6xl font-extrabold mb-4 text-emerald-100">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.darkGreen }}>
                    {step.title}
                  </h3>
                  <p className="text-foreground/70">
                    {step.description}
                  </p>
                </div>
                {idx < process.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-[2px] bg-emerald-200 -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <Container>
          <SectionTitle
            kicker="Branchen"
            title="Für wen wir arbeiten"
            center
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              "E-Commerce",
              "Einzelhandel",
              "Lebensmittel",
              "Kosmetik",
              "Textil",
              "Elektronik",
              "Pharma",
              "Bürobedarf",
              "Bücher",
              "Geschenkartikel"
            ].map((industry, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="font-medium text-foreground/80">{industry}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Bereit für Ihre perfekte Verpackung?
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Kontaktieren Sie uns für eine unverbindliche Beratung. Gemeinsam finden wir die 
              optimale Lösung für Ihre Verpackungsanforderungen.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/unternehmen/kontakt">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Kontakt aufnehmen
                </Button>
              </Link>
              <Link href="/unternehmen/ansprechpartner">
                <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Ansprechpartner
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
