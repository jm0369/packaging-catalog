"use client";

import React from "react";
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { colors } from "@/lib/colors";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AnsprechpartnerPage() {
  const team = [
    {
      name: "Werner Fink",
      position: "Geschäftsleitung",
      image: "/team/werner.JPG",
      email: "w.fink@packchampion.com",
      phone: "+49 941 94589270 90",
      mobile: "+49 176 11909030",
      bio: "Werner ist Gründer von PackChampion. Mit über 20 Jahren Erfahrung in der Verpackungsindustrie leitet er unser Team mit Vision und Leidenschaft.",
    },
    {
      name: "Korbinian Fink",
      position: "Marketing & Sales / Prokurist",
      image: "/team/korbinian.JPG",
      email: "k.fink@packchampion.com",
      phone: "+49 941 94589270 92",
      mobile: "+49 170 82115221",
      bio: "Korbinian ist verantwortlich für Marketing und Vertrieb bei PackChampion. Er entwickelt innovative Strategien, um unsere Kunden bestmöglich zu betreuen.",
    },
    {
      name: "Mario Deilen",
      position: "Key-Account-Manager",
      image: "/team/mario.JPG",
      email: "m.deilen@packchampion.com",
      phone: "+49 941 945892-80",
      mobile: "+49 170 1232627",
      bio: "Mario ist Ihr Experte für alle Fragen rund um den Einkauf und die Beschaffung von Verpackungslösungen.",
    },
    {
      name: "Sieglinde Fink",
      position: "Buchhaltung & Verwaltung",
      image: "/team/sieglinde.JPG",
      email: "s.fink@packchampion.com",
      phone: "+49 89 123456-40",
      mobile: "+49 171 1234567",
      bio: "Sieglinde kümmert sich um die Finanzen und sorgt dafür, dass bei PackChampion alles reibungslos läuft.",
    },
    {
      name: "Jennifer Koval",
      position: "Vertrieb Innendienst",
      image: "/team/jennifer.JPG",
      email: "j.koval@packchampion.com",
      phone: "+49 89 123456-60",
      mobile: "+49 171 1234567",
      bio: "Jennifer ist Ihre Ansprechpartnerin im Innendienst und unterstützt Sie bei allen Fragen zu unseren Produkten und Dienstleistungen.",
    },
    {
      name: "Benedikt Imhofer",
      position: "Leiter Design",
      image: "/team/benedikt.JPG",
      email: "b.imhofer@packchampion.de",
      phone: "+49 89 123456-50",
      mobile: "+49 171 1234567",
      bio: "Benedikt leitet unser Design-Team und sorgt dafür, dass Ihre Verpackungen nicht nur funktional, sondern auch optisch ansprechend sind.",
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
                      href={`tel:${member.mobile}`}
                      className="flex items-center gap-2 text-foreground/70 hover:text-emerald-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {member.phone}
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
