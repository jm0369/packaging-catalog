"use client";

import React from "react";
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Lightbulb, TrendingUp, Heart, Coffee, GraduationCap, Trophy } from "lucide-react";
import { colors } from "@/lib/colors";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function KarrierePage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Karriereentwicklung",
      description: "Individuelle Weiterbildungs- und Entwicklungsmöglichkeiten für Ihre berufliche Zukunft.",
    },
    {
      icon: Users,
      title: "Teamgeist",
      description: "Ein motiviertes und hilfsbereites Team, das zusammenhält und gemeinsam Erfolge feiert.",
    },
    {
      icon: Coffee,
      title: "Work-Life-Balance",
      description: "Flexible Arbeitszeiten und Home-Office-Möglichkeiten für eine ausgewogene Work-Life-Balance.",
    },
    {
      icon: Heart,
      title: "Gesundheit",
      description: "Gesundheitsfördernde Maßnahmen, ergonomische Arbeitsplätze und betriebliche Gesundheitsvorsorge.",
    },
    {
      icon: GraduationCap,
      title: "Weiterbildung",
      description: "Regelmäßige Schulungen, Workshops und Zugang zu Lernplattformen.",
    },
    {
      icon: Trophy,
      title: "Attraktive Vergütung",
      description: "Leistungsgerechte Bezahlung mit zusätzlichen Benefits und Bonussystemen.",
    },
  ];

  const positions = [
    {
      title: "Verpackungsingenieur (m/w/d)",
      department: "Produktentwicklung",
      location: "München",
      type: "Vollzeit",
    },
    {
      title: "Vertriebsmitarbeiter (m/w/d)",
      department: "Sales",
      location: "Hamburg",
      type: "Vollzeit",
    },
    {
      title: "Grafik Designer (m/w/d)",
      department: "Design",
      location: "Berlin",
      type: "Vollzeit / Teilzeit",
    },
    {
      title: "Nachhaltigkeitsmanager (m/w/d)",
      department: "Sustainability",
      location: "München",
      type: "Vollzeit",
    },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Wir fördern kreative Ideen und innovative Lösungen.",
    },
    {
      icon: Users,
      title: "Zusammenarbeit",
      description: "Gemeinsam erreichen wir mehr – Teamwork ist unser Fundament.",
    },
    {
      icon: Heart,
      title: "Verantwortung",
      description: "Nachhaltigkeit und soziale Verantwortung sind uns wichtig.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
              Karriere bei PackChampion
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Werden Sie Teil unseres Teams
            </h1>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              Bei PackChampion arbeiten Sie in einem dynamischen Umfeld, das Innovation und Nachhaltigkeit 
              vereint. Gestalten Sie mit uns die Zukunft der Verpackungsindustrie und entwickeln Sie sich 
              persönlich sowie beruflich weiter.
            </p>
            <Link href="/unternehmen/kontakt">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Jetzt bewerben
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Unsere Benefits"
            title="Was wir Ihnen bieten"
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6" style={{ color: colors.darkGreen }} />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-sm font-semibold tracking-widest uppercase mb-4 text-emerald-200">
                Unsere Werte
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                Wofür wir stehen
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-8">
              {values.map((value, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-white/80">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Open Positions Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Offene Stellen"
            title="Aktuelle Jobangebote"
            center
          />
          <div className="max-w-4xl mx-auto space-y-4">
            {positions.map((position, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2" style={{ color: colors.darkGreen }}>
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-foreground/70">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {position.department}
                        </span>
                        <span>📍 {position.location}</span>
                        <span>⏰ {position.type}</span>
                      </div>
                    </div>
                    <Link href="/unternehmen/kontakt">
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Bewerben
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Users className="w-16 h-16 mx-auto mb-6" style={{ color: colors.darkGreen }} />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Initiativbewerbung
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Sie haben keine passende Stelle gefunden? Senden Sie uns gerne eine Initiativbewerbung. 
              Wir freuen uns darauf, Sie kennenzulernen!
            </p>
            <Link href="/unternehmen/kontakt">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Jetzt Kontakt aufnehmen
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
