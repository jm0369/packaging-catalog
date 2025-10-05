"use client";

import React from "react";
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Heart, Target, Award, Lightbulb } from "lucide-react";
import { colors } from "@/lib/colors";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnternehmenPage() {
  const values = [
    {
      icon: Heart,
      title: "Nachhaltigkeit",
      description: "Umweltfreundliche Verpackungslösungen für eine grünere Zukunft.",
      link: "/unternehmen/nachhaltigkeit"
    },
    {
      icon: Users,
      title: "Teamarbeit",
      description: "Ein starkes Team mit Leidenschaft für innovative Verpackungen.",
      link: "/unternehmen/ansprechpartner"
    },
    {
      icon: Target,
      title: "Qualität",
      description: "Höchste Qualitätsstandards in jedem Produkt.",
      link: "/produkte"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Kontinuierliche Entwicklung neuer Verpackungslösungen.",
      link: "/leistungen/verpackungsentwicklung"
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-20">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
                Über PackChampion
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
                Ihr Partner für nachhaltige Verpackungen
              </h1>
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                PackChampion ist Ihr zuverlässiger Partner für innovative und nachhaltige Verpackungslösungen. 
                Mit jahrelanger Erfahrung und einem engagierten Team entwickeln wir maßgeschneiderte Lösungen, 
                die Ihre Produkte optimal schützen und gleichzeitig die Umwelt schonen.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/unternehmen/kontakt">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Kontakt aufnehmen
                  </Button>
                </Link>
                <Link href="/unternehmen/karriere">
                  <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Karriere
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/team.JPG"
                alt="PackChampion Team"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Unsere Werte"
            title="Was uns ausmacht"
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <Link key={idx} href={value.link}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                      <value.icon className="w-6 h-6" style={{ color: colors.darkGreen }} />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{value.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Unsere Mission
            </h2>
            <p className="text-xl leading-relaxed text-white/90">
              Wir streben danach, die nachhaltigsten und innovativsten Verpackungslösungen auf dem Markt anzubieten. 
              Unser Ziel ist es, Unternehmen dabei zu unterstützen, ihre ökologischen Ziele zu erreichen, 
              ohne Kompromisse bei Qualität und Funktionalität einzugehen.
            </p>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-2" style={{ color: colors.darkGreen }}>
                15+
              </div>
              <div className="text-foreground/70 font-medium">Jahre Erfahrung</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-2" style={{ color: colors.darkGreen }}>
                5000+
              </div>
              <div className="text-foreground/70 font-medium">Zufriedene Kunden</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-2" style={{ color: colors.darkGreen }}>
                100%
              </div>
              <div className="text-foreground/70 font-medium">Nachhaltig</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-extrabold mb-2" style={{ color: colors.darkGreen }}>
                24/7
              </div>
              <div className="text-foreground/70 font-medium">Support</div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <SectionTitle
              title="Werden Sie Teil unserer Erfolgsgeschichte"
              center
            />
            <p className="text-lg text-foreground/70 mb-8">
              Entdecken Sie mehr über unsere Nachhaltigkeitsinitiativen, lernen Sie unser Team kennen 
              oder kontaktieren Sie uns für eine individuelle Beratung.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/unternehmen/nachhaltigkeit">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Nachhaltigkeit
                </Button>
              </Link>
              <Link href="/unternehmen/ansprechpartner">
                <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Unser Team
                </Button>
              </Link>
              <Link href="/unternehmen/kontakt">
                <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Kontakt
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
