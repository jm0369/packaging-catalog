"use client";

import React from "react";
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Recycle, TreePine, Wind, Droplets, Sun, Award, CheckCircle2 } from "lucide-react";
import { colors } from "@/lib/colors";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NachhaltigkeitPage() {
  const initiatives = [
    {
      icon: Recycle,
      title: "100% Recycelbare Materialien",
      description: "Alle unsere Verpackungen werden aus recycelbaren oder bereits recycelten Materialien hergestellt.",
    },
    {
      icon: TreePine,
      title: "FSC-Zertifiziert",
      description: "Unsere Papier- und Kartonprodukte stammen aus nachhaltig bewirtschafteten Wäldern.",
    },
    {
      icon: Wind,
      title: "CO₂-Neutral",
      description: "Wir kompensieren alle unvermeidbaren CO₂-Emissionen durch zertifizierte Klimaschutzprojekte.",
    },
    {
      icon: Droplets,
      title: "Wasserschonend",
      description: "Unsere Produktionsprozesse minimieren den Wasserverbrauch und vermeiden Gewässerverschmutzung.",
    },
    {
      icon: Sun,
      title: "Erneuerbare Energie",
      description: "Unsere Produktion läuft zu 100% mit erneuerbaren Energien aus Wind und Solar.",
    },
    {
      icon: Award,
      title: "Zertifiziert",
      description: "Wir halten höchste Umweltstandards ein und sind mehrfach zertifiziert.",
    },
  ];

  const goals = [
    "Reduzierung des CO₂-Fußabdrucks um 50% bis 2030",
    "100% plastikfreie Verpackungen bis 2028",
    "Kreislaufwirtschaft in allen Produktionsschritten",
    "Förderung von Aufforstungsprojekten weltweit",
    "Transparente Lieferketten mit nachhaltigen Partnern",
    "Kontinuierliche Innovation für umweltfreundlichere Lösungen",
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-20">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
                Nachhaltigkeit
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
                Verantwortung für unsere Umwelt
              </h1>
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                Nachhaltigkeit ist nicht nur ein Schlagwort für uns – es ist das Herzstück unseres Unternehmens. 
                Wir entwickeln Verpackungslösungen, die sowohl funktional als auch umweltfreundlich sind und 
                aktiv zum Schutz unseres Planeten beitragen.
              </p>
              <Link href="/produkte/co2-master">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  CO₂-Master entdecken
                </Button>
              </Link>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/forest.png"
                alt="Nachhaltigkeit"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Initiatives Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Unsere Initiativen"
            title="Was wir für die Umwelt tun"
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map((initiative, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <initiative.icon className="w-6 h-6" style={{ color: colors.darkGreen }} />
                  </div>
                  <CardTitle className="text-xl">{initiative.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">{initiative.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Goals Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-sm font-semibold tracking-widest uppercase mb-4 text-emerald-200">
                Unsere Ziele
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                Unser Weg in die Zukunft
              </h2>
              <p className="text-xl text-white/90">
                Wir setzen uns ambitionierte Ziele, um einen echten Unterschied zu machen.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {goals.map((goal, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0 mt-1" />
                  <p className="text-lg text-white/90">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Certifications Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Zertifizierungen"
            title="Unsere Umweltzertifikate"
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Award className="w-12 h-12" style={{ color: colors.darkGreen }} />
              </div>
              <h3 className="font-bold text-lg mb-2">FSC®</h3>
              <p className="text-sm text-foreground/70">Forest Stewardship Council</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Award className="w-12 h-12" style={{ color: colors.darkGreen }} />
              </div>
              <h3 className="font-bold text-lg mb-2">ISO 14001</h3>
              <p className="text-sm text-foreground/70">Umweltmanagement</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Award className="w-12 h-12" style={{ color: colors.darkGreen }} />
              </div>
              <h3 className="font-bold text-lg mb-2">Blauer Engel</h3>
              <p className="text-sm text-foreground/70">Deutsches Umweltzeichen</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Award className="w-12 h-12" style={{ color: colors.darkGreen }} />
              </div>
              <h3 className="font-bold text-lg mb-2">EU Ecolabel</h3>
              <p className="text-sm text-foreground/70">Europäisches Umweltzeichen</p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Leaf className="w-16 h-16 mx-auto mb-6" style={{ color: colors.darkGreen }} />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Gemeinsam für eine nachhaltige Zukunft
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Entdecken Sie unsere umweltfreundlichen Verpackungslösungen und tragen Sie aktiv zum Umweltschutz bei.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/produkte">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Produkte ansehen
                </Button>
              </Link>
              <Link href="/unternehmen/kontakt">
                <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Beratung anfragen
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
