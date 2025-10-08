import Container from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Mail, Phone, Scale, User, FileText } from "lucide-react";
import { colors } from "@/lib/colors";
import Link from "next/link";

export const revalidate = 86400;

export default function Impressum() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-16">
        <Container>
          <div className="max-w-4xl">
            <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
              Rechtliches
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Impressum
            </h1>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Angaben gemäß § 5 TMG und verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Company Information */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Building2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Firmeninformationen</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xl font-bold text-gray-900">packCHAMPION GmbH</p>
                        <p className="text-gray-600 mt-2">Merianweg 3</p>
                        <p className="text-gray-600">93051 Regensburg</p>
                        <p className="text-gray-600">Deutschland</p>
                      </div>

                      <div className="pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-emerald-600" />
                          <div>
                            <p className="text-sm text-gray-500">Telefon</p>
                            <p className="text-gray-900 font-medium">+49 (0) 123 456789</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-emerald-600" />
                          <div>
                            <p className="text-sm text-gray-500">E-Mail</p>
                            <a href="mailto:info@packchampion.de" className="text-emerald-600 hover:underline font-medium">
                              info@packchampion.com
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Representatives */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <User className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Vertretungsberechtigte</h2>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="text-gray-700">
                        <span className="font-semibold">Geschäftsführer:</span> Max Mustermann, Erika Musterfrau
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Registergericht:</span> Amtsgericht Musterstadt
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Registernummer:</span> HRB 12345
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Umsatzsteuer-ID:</span> DE123456789
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dispute Resolution */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Scale className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Streitschlichtung</h2>
                    <p className="text-gray-600 mb-4">
                      Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                    </p>
                    <a 
                      href="https://ec.europa.eu/consumers/odr/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:underline font-medium inline-flex items-center gap-2"
                    >
                      https://ec.europa.eu/consumers/odr/
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <p className="text-gray-600 mt-4">
                      Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                      Verbraucherschlichtungsstelle teilzunehmen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liability */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Haftung für Inhalte</h2>
                    <p className="text-gray-600 mb-4">
                      Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den 
                      allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht 
                      verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen 
                      zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                    </p>
                    <p className="text-gray-600 mb-6">
                      Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
                      Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt 
                      der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden 
                      Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">Haftung für Links</h3>
                    <p className="text-gray-600 mb-4">
                      Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                      Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der 
                      verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                    </p>
                    <p className="text-gray-600 mb-6">
                      Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. 
                      Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche 
                      Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht 
                      zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">Urheberrecht</h3>
                    <p className="text-gray-600">
                      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
                      Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                      Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. 
                      Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Weitere Informationen</h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Berufsbezeichnung:</span> Handel mit Verpackungsmaterialien
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Zuständige Kammer:</span> IHK Musterstadt
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Aufsichtsbehörde:</span> Gewerbeaufsichtsamt Musterstadt
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Weitere rechtliche Informationen finden Sie in unserer{" "}
                    <Link href="/datenschutz" className="text-emerald-600 hover:underline font-medium">
                      Datenschutzerklärung
                    </Link>.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Copyright Notice */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 text-center">
                  © {new Date().getFullYear()} packCHAMPION GmbH. Alle Rechte vorbehalten.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}