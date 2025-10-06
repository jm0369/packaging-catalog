import Container from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, UserCheck, Database, Mail } from "lucide-react";
import { colors } from "@/lib/colors";
import Link from "next/link";

export const revalidate = 86400;

export default function Datenschutz() {
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
              Datenschutzerklärung
            </h1>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung 
              informiert Sie über die Art, den Umfang und Zweck der Verarbeitung personenbezogener Daten 
              auf unserer Website.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Data Controller */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">1. Verantwortlicher</h2>
                    <p className="text-gray-600 mb-4">
                      Verantwortlich für die Datenverarbeitung auf dieser Website ist:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-gray-700">
                      <p className="font-semibold">packCHAMPION GmbH</p>
                      <p>Musterstraße 123</p>
                      <p>12345 Musterstadt</p>
                      <p>Deutschland</p>
                      <p className="mt-3">Telefon: +49 (0) 123 456789</p>
                      <p>E-Mail: datenschutz@packchampion.de</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Database className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Erhebung und Speicherung personenbezogener Daten</h2>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.1 Beim Besuch der Website</h3>
                    <p className="text-gray-600 mb-4">
                      Beim Aufrufen unserer Website werden durch den auf Ihrem Endgerät zum Einsatz kommenden 
                      Browser automatisch Informationen an den Server unserer Website gesendet. Diese Informationen 
                      werden temporär in einem sogenannten Logfile gespeichert.
                    </p>
                    <p className="text-gray-600 mb-3">Folgende Informationen werden dabei ohne Ihr Zutun erfasst:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                      <li>IP-Adresse des anfragenden Rechners</li>
                      <li>Datum und Uhrzeit des Zugriffs</li>
                      <li>Name und URL der abgerufenen Datei</li>
                      <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                      <li>Verwendeter Browser und ggf. das Betriebssystem Ihres Rechners</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Bei Kontaktaufnahme</h3>
                    <p className="text-gray-600 mb-4">
                      Bei Ihrer Kontaktaufnahme mit uns per E-Mail oder über ein Kontaktformular werden die 
                      von Ihnen mitgeteilten Daten (Ihre E-Mail-Adresse, ggf. Ihr Name und Ihre Telefonnummer) 
                      von uns gespeichert, um Ihre Fragen zu beantworten.
                    </p>
                    <p className="text-gray-600">
                      Die in diesem Zusammenhang anfallenden Daten löschen wir, nachdem die Speicherung nicht 
                      mehr erforderlich ist, oder schränken die Verarbeitung ein, falls gesetzliche 
                      Aufbewahrungspflichten bestehen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Eye className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookies</h2>
                    <p className="text-gray-600 mb-4">
                      Unsere Website verwendet Cookies. Bei Cookies handelt es sich um kleine Textdateien, die 
                      auf Ihrem Endgerät gespeichert werden. Ihr Browser greift auf diese Dateien zu.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Durch den Einsatz von Cookies erhöht sich die Benutzerfreundlichkeit und Sicherheit 
                      dieser Website. Wir setzen folgende Cookie-Kategorien ein:
                    </p>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Notwendige Cookies</h4>
                        <p className="text-sm text-gray-600">
                          Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht 
                          deaktiviert werden.
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Funktionale Cookies</h4>
                        <p className="text-sm text-gray-600">
                          Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Analyse-Cookies</h4>
                        <p className="text-sm text-gray-600">
                          Diese Cookies helfen uns, die Website zu verbessern, indem sie Informationen über die 
                          Nutzung sammeln.
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Marketing-Cookies</h4>
                        <p className="text-sm text-gray-600">
                          Diese Cookies werden verwendet, um Werbung anzuzeigen, die für Sie relevant ist.
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-4">
                      Detaillierte Informationen und Einstellungsmöglichkeiten finden Sie auf unserer{" "}
                      <Link href="/cookies" className="text-emerald-600 hover:underline font-medium">
                        Cookie-Einstellungen Seite
                      </Link>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <UserCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Ihre Rechte</h2>
                    <p className="text-gray-600 mb-4">
                      Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden personenbezogenen Daten:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-600 font-bold mt-1">→</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">Recht auf Auskunft</h4>
                          <p className="text-sm text-gray-600">
                            Sie haben das Recht, Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-600 font-bold mt-1">→</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">Recht auf Berichtigung</h4>
                          <p className="text-sm text-gray-600">
                            Sie haben das Recht, unverzüglich die Berichtigung unrichtiger Daten zu verlangen.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-600 font-bold mt-1">→</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">Recht auf Löschung</h4>
                          <p className="text-sm text-gray-600">
                            Sie haben das Recht, die Löschung Ihrer personenbezogenen Daten zu verlangen.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-600 font-bold mt-1">→</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">Recht auf Einschränkung der Verarbeitung</h4>
                          <p className="text-sm text-gray-600">
                            Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer Daten zu verlangen.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-600 font-bold mt-1">→</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">Recht auf Datenübertragbarkeit</h4>
                          <p className="text-sm text-gray-600">
                            Sie haben das Recht, die Sie betreffenden Daten in einem strukturierten Format zu erhalten.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-600 font-bold mt-1">→</span>
                        <div>
                          <h4 className="font-semibold text-gray-900">Widerspruchsrecht</h4>
                          <p className="text-sm text-gray-600">
                            Sie haben das Recht, der Verarbeitung Ihrer Daten zu widersprechen.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Lock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Datensicherheit</h2>
                    <p className="text-gray-600 mb-4">
                      Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) 
                      in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Wir bedienen uns im Übrigen geeigneter technischer und organisatorischer Sicherheitsmaßnahmen, 
                      um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen 
                      Verlust, Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen.
                    </p>
                    <p className="text-gray-600">
                      Unsere Sicherheitsmaßnahmen werden entsprechend der technologischen Entwicklung fortlaufend verbessert.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-lg">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Kontakt zum Datenschutzbeauftragten</h2>
                    <p className="text-gray-600 mb-4">
                      Wenn Sie Fragen zum Datenschutz haben, schreiben Sie uns bitte eine E-Mail oder wenden Sie sich 
                      direkt an die für den Datenschutz zu Beginn dieser Datenschutzerklärung genannte verantwortliche 
                      Person in unserem Unternehmen.
                    </p>
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <p className="font-semibold text-gray-900 mb-2">Datenschutzbeauftragter</p>
                      <p className="text-gray-700">E-Mail: datenschutz@packchampion.de</p>
                      <p className="text-gray-700">Telefon: +49 (0) 123 456789</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600">
                  <strong>Stand dieser Datenschutzerklärung:</strong> Oktober 2025
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Wir behalten uns vor, diese Datenschutzerklärung gelegentlich anzupassen, damit sie stets den 
                  aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der 
                  Datenschutzerklärung umzusetzen.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}