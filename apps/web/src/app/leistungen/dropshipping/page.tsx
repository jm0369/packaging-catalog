"use client";

import React from "react";
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Warehouse, MapPin, Clock, BarChart3, CheckCircle2, Zap } from "lucide-react";
import { colors } from "@/lib/colors";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DropshippingPage() {
  const services = [
    {
      icon: Warehouse,
      title: "Lagerung",
      description: "Sichere Lagerung Ihrer Produkte in unserem modernen Logistikzentrum.",
      features: [
        "Klimatisierte Lagerhallen",
        "Videoüberwachung 24/7",
        "Flexible Lagerkapazitäten",
        "Bestandsverwaltung"
      ]
    },
    {
      icon: Package,
      title: "Kommissionierung",
      description: "Professionelle Zusammenstellung und Verpackung Ihrer Bestellungen.",
      features: [
        "Schnelle Bearbeitung",
        "Qualitätskontrolle",
        "Individuelle Verpackung",
        "Beilagen-Service"
      ]
    },
    {
      icon: Truck,
      title: "Versand",
      description: "Zuverlässiger Versand direkt an Ihre Endkunden weltweit.",
      features: [
        "Alle Versanddienstleister",
        "Tracking-Nummern",
        "Versandbenachrichtigung",
        "Retouren-Management"
      ]
    },
    {
      icon: BarChart3,
      title: "Reporting",
      description: "Transparente Echtzeit-Berichte über alle Lagerbewegungen und Versände.",
      features: [
        "Online-Dashboard",
        "Bestandsübersicht",
        "Versandstatistiken",
        "Kostenübersicht"
      ]
    },
  ];

  const advantages = [
    {
      icon: Zap,
      title: "Zeit sparen",
      description: "Konzentrieren Sie sich auf Ihr Kerngeschäft – wir kümmern uns um die Logistik."
    },
    {
      icon: Clock,
      title: "Schneller Versand",
      description: "Ihre Kunden erhalten ihre Bestellungen schnell und zuverlässig."
    },
    {
      icon: CheckCircle2,
      title: "Professionell",
      description: "Professionelle Verpackung und fehlerfreie Abwicklung."
    },
  ];

  const process = [
    {
      step: "01",
      title: "Wareneingang",
      description: "Sie liefern Ihre Produkte an unser Lager. Wir erfassen und lagern alles ein."
    },
    {
      step: "02",
      title: "Integration",
      description: "Anbindung Ihres Shops über API oder manuellen Bestellimport."
    },
    {
      step: "03",
      title: "Bestellung",
      description: "Bei jeder Bestellung kommissionieren und verpacken wir automatisch."
    },
    {
      step: "04",
      title: "Versand",
      description: "Direkter Versand an Ihre Endkunden mit Tracking-Information."
    },
  ];

  const features = [
    {
      title: "Flexible Verträge",
      description: "Keine Mindestlaufzeiten – kündbar bei Bedarf"
    },
    {
      title: "Skalierbar",
      description: "Wächst mit Ihrem Geschäft – von klein bis groß"
    },
    {
      title: "Transparente Kosten",
      description: "Klare Preisstruktur ohne versteckte Gebühren"
    },
    {
      title: "Persönlicher Support",
      description: "Direkter Ansprechpartner für alle Fragen"
    },
    {
      title: "Schnelle Reaktion",
      description: "Express-Versand am gleichen Tag möglich"
    },
    {
      title: "Nachhaltig",
      description: "Umweltfreundliche Verpackungen und CO₂-neutral"
    },
  ];

  const industries = [
    "E-Commerce & Online-Shops",
    "Direktvertrieb & Teleshopping",
    "Startups & kleine Händler",
    "Saisonale Geschäfte",
    "B2B-Großkunden",
    "Internationale Verkäufer",
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-20">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
                Dropshipping & Fulfillment
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
                Ihre Logistik in besten Händen
              </h1>
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                Lagern, verpacken, versenden – wir übernehmen die komplette Logistik für Ihr Unternehmen. 
                Mit unserem Dropshipping-Service versenden wir Ihre Produkte direkt an Ihre Endkunden, 
                während Sie sich auf Vertrieb und Marketing konzentrieren können. Schnell, zuverlässig und 
                professionell.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/unternehmen/kontakt">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Angebot anfordern
                  </Button>
                </Link>
                <Link href="/unternehmen/ansprechpartner">
                  <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Beratung vereinbaren
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/lieferung.png"
                alt="Dropshipping & Logistik"
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
            kicker="Unsere Services"
            title="Alles aus einer Hand"
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

      {/* Advantages Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-sm font-semibold tracking-widest uppercase mb-4 text-emerald-200">
                Ihre Vorteile
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                Warum Dropshipping mit PackChampion?
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

      {/* Process Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="So funktioniert's"
            title="Dropshipping in 4 einfachen Schritten"
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
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <Container>
          <SectionTitle
            kicker="Features"
            title="Das macht uns besonders"
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2" style={{ color: colors.darkGreen }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-foreground/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Industries Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Für wen"
            title="Ideal für diese Branchen"
            center
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {industries.map((industry, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-foreground/80 font-medium">{industry}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <MapPin className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Transparente Preise, keine Überraschungen
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Wir erstellen Ihnen ein individuelles Angebot basierend auf Ihrem Versandvolumen 
              und Ihren Anforderungen. Fordern Sie jetzt ein unverbindliches Angebot an.
            </p>
            <Link href="/unternehmen/kontakt">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-gray-100">
                Kostenloses Angebot anfordern
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Truck className="w-16 h-16 mx-auto mb-6" style={{ color: colors.darkGreen }} />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Starten Sie noch heute
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Vereinfachen Sie Ihre Logistik und konzentrieren Sie sich auf das Wachstum 
              Ihres Unternehmens. Kontaktieren Sie uns für ein persönliches Beratungsgespräch.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/unternehmen/kontakt">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Jetzt starten
                </Button>
              </Link>
              <Link href="/unternehmen/ansprechpartner">
                <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Experten sprechen
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
