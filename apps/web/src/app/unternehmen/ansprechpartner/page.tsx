"use client";

import React from "react";
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Linkedin } from "lucide-react";
import { colors } from "@/lib/colors";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AnsprechpartnerPage() {
  const team = [
    {
      name: "Werner Fink",
      position: "Geschäftsführer",
      image: "/team/werner.JPG",
      email: "m.schmidt@packchampion.de",
      phone: "+49 89 123456-10",
      linkedin: "#",
      bio: "Mit über 20 Jahren Erfahrung in der Verpackungsindustrie leitet Dr. Schmidt unser Unternehmen mit Vision und Leidenschaft für Nachhaltigkeit.",
    },
    {
      name: "Korbinian Fink",
      position: "Vertrieb & Marketing",
      image: "/team/korbinian.JPG",
      email: "s.mueller@packchampion.de",
      phone: "+49 89 123456-20",
      linkedin: "#",
      bio: "Sarah ist Ihre erste Ansprechpartnerin für alle Vertriebs- und Kundenanfragen. Mit ihrer Expertise berät sie Sie umfassend.",
    },
    {
      name: "Mario Deilen",
      position: "Vertrieb & Einkauf",
      image: "/team/mario.JPG",
      email: "t.wagner@packchampion.de",
      phone: "+49 89 123456-30",
      linkedin: "#",
      bio: "Thomas und sein Team entwickeln innovative Verpackungslösungen, die sowohl funktional als auch nachhaltig sind.",
    },
    {
      name: "Sieglinde Fink",
      position: "Buchhaltung & Verwaltung",
      image: "/team/sieglinde.JPG",
      email: "l.becker@packchampion.de",
      phone: "+49 89 123456-40",
      linkedin: "#",
      bio: "Lisa verantwortet alle Nachhaltigkeitsinitiativen und stellt sicher, dass wir unsere Umweltziele erreichen.",
    },
    {
      name: "Jennifer Koval",
      position: "Vertrieb Innendienst",
      image: "/team/jennifer.JPG",
      email: "a.richter@packchampion.de",
      phone: "+49 89 123456-60",
      linkedin: "#",
      bio: "Anna steht Ihnen bei allen Fragen rund um Ihre Bestellung und bestehende Projekte zur Verfügung.",
    },
    {
      name: "Benedikt Imhofer",
      position: "Leiter Design",
      image: "/team/benedikt.JPG",
      email: "m.schulz@packchampion.de",
      phone: "+49 89 123456-50",
      linkedin: "#",
      bio: "Marc und sein kreatives Team gestalten einzigartige Verpackungsdesigns, die Ihre Marke perfekt in Szene setzen.",
    },
  ];

  const departments = [
    {
      title: "Vertrieb & Beratung",
      email: "vertrieb@packchampion.de",
      phone: "+49 89 123456-20",
      description: "Für Anfragen zu unseren Produkten und individuellen Lösungen.",
    },
    {
      title: "Produktentwicklung",
      email: "entwicklung@packchampion.de",
      phone: "+49 89 123456-30",
      description: "Für technische Fragen und maßgeschneiderte Verpackungslösungen.",
    },
    {
      title: "Design",
      email: "design@packchampion.de",
      phone: "+49 89 123456-50",
      description: "Für kreative Anfragen und Designprojekte.",
    },
    {
      title: "Kundenservice",
      email: "service@packchampion.de",
      phone: "+49 89 123456-60",
      description: "Für Fragen zu bestehenden Bestellungen und allgemeine Anliegen.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
              Unser Team
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Ihre Ansprechpartner bei PackChampion
            </h1>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              Lernen Sie die Menschen hinter PackChampion kennen. Unser engagiertes Team steht Ihnen 
              mit Rat und Tat zur Seite und freut sich darauf, Sie bei Ihren Verpackungsprojekten 
              zu unterstützen.
            </p>
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <Container>
          <SectionTitle
            kicker="Unser Team"
            title="Die Menschen hinter PackChampion"
            center
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-64 bg-gray-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1" style={{ color: colors.darkGreen }}>
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium mb-3" style={{ color: colors.lightGreen }}>
                    {member.position}
                  </p>
                  <p className="text-sm text-foreground/70 mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="space-y-2 text-sm">
                    <a 
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-2 text-foreground/70 hover:text-emerald-600 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </a>
                    <a 
                      href={`tel:${member.phone}`}
                      className="flex items-center gap-2 text-foreground/70 hover:text-emerald-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </a>
                    <a 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground/70 hover:text-emerald-600 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Departments Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <Container>
          <SectionTitle
            kicker="Abteilungen"
            title="Direkter Kontakt zu unseren Abteilungen"
            center
          />
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {departments.map((dept, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.darkGreen }}>
                    {dept.title}
                  </h3>
                  <p className="text-sm text-foreground/70 mb-4">
                    {dept.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <a 
                      href={`mailto:${dept.email}`}
                      className="flex items-center gap-2 text-foreground/70 hover:text-emerald-600 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {dept.email}
                    </a>
                    <a 
                      href={`tel:${dept.phone}`}
                      className="flex items-center gap-2 text-foreground/70 hover:text-emerald-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {dept.phone}
                    </a>
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
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Haben Sie Fragen?
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              Unser Team steht Ihnen gerne zur Verfügung. Kontaktieren Sie uns für eine 
              persönliche Beratung oder besuchen Sie unsere Kontaktseite.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/unternehmen/kontakt">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Kontaktformular
                </Button>
              </Link>
              <a href="tel:+498912345600">
                <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Jetzt anrufen
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
