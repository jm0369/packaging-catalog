"use client";

import React, { useState, useEffect } from "react";
import Container from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cookie, Shield, Settings, Eye, Target, CheckCircle } from "lucide-react";
import { colors } from "@/lib/colors";
import { 
  getCookiePreferences, 
  saveCookiePreferences, 
  type CookiePreferences,
  initializeAnalytics,
  initializeMarketing,
  initializeFunctional,
  COOKIE_CONSENT_KEY
} from "@/lib/cookies";

export default function CookiesPage() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);
  const [consentDate, setConsentDate] = useState<string | null>(null);

  useEffect(() => {
    // Load existing preferences
    const savedPrefs = getCookiePreferences();
    if (savedPrefs) {
      setPreferences(savedPrefs);
    }
    
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (savedConsent) {
      try {
        const data = JSON.parse(savedConsent);
        if (data.timestamp) {
          setConsentDate(new Date(data.timestamp).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }));
        }
      } catch (e) {
        console.error("Failed to parse cookie preferences", e);
      }
    }
  }, []);

  const handleSavePreferences = (prefs: CookiePreferences) => {
    saveCookiePreferences(prefs);
    
    // Initialize services based on preferences
    if (prefs.functional) {
      initializeFunctional();
    }
    if (prefs.analytics) {
      initializeAnalytics();
    }
    if (prefs.marketing) {
      initializeMarketing();
    }

    setSaved(true);
    setConsentDate(new Date().toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }));

    setTimeout(() => setSaved(false), 3000);
  };

  const handleSave = () => {
    handleSavePreferences(preferences);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    handleSavePreferences(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(necessaryOnly);
    handleSavePreferences(necessaryOnly);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-16">
        <Container>
          <div className="max-w-4xl">
            <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
              Datenschutz
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Cookie-Einstellungen
            </h1>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Verwalten Sie Ihre Cookie-Präferenzen und erfahren Sie, wie wir Cookies verwenden, 
              um Ihre Erfahrung auf unserer Website zu verbessern.
            </p>
          </div>
        </Container>
      </section>

      {/* Current Settings Status */}
      {consentDate && (
        <section className="py-6 bg-white border-b">
          <Container>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Ihre Einstellungen wurden zuletzt aktualisiert am: <strong>{consentDate}</strong></span>
            </div>
          </Container>
        </section>
      )}

      {/* Cookie Settings */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Success Message */}
            {saved && (
              <Card className="border-emerald-500 bg-emerald-50 mb-6 animate-in slide-in-from-top duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 text-emerald-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Ihre Einstellungen wurden erfolgreich gespeichert!</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Schnellauswahl</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={acceptAll}
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                  >
                    Alle Cookies akzeptieren
                  </Button>
                  <Button
                    onClick={acceptNecessary}
                    size="lg"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1"
                  >
                    Nur notwendige Cookies
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Individual Cookie Settings */}
            <div className="space-y-6">
              {/* Necessary Cookies */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-lg">
                          <Shield className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">Notwendige Cookies</h3>
                            <span className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-medium">
                              Immer aktiv
                            </span>
                          </div>
                          <p className="text-gray-700">
                            Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <h4 className="font-semibold text-gray-900 mb-3">Was wir speichern:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">•</span>
                        <span>Session-Informationen für die Funktionalität der Website</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">•</span>
                        <span>Ihre Cookie-Präferenzen</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">•</span>
                        <span>Sicherheitsrelevante Informationen</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Functional Cookies */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gray-50 p-6 border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-white rounded-lg border">
                          <Settings className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Funktionale Cookies</h3>
                          <p className="text-gray-700">
                            Ermöglichen erweiterte Funktionen wie Spracheinstellungen und personalisierte Inhalte.
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                          type="checkbox"
                          checked={preferences.functional}
                          onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <h4 className="font-semibold text-gray-900 mb-3">Beispiele:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Spracheinstellungen speichern</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Bevorzugte Anzeigeoptionen merken</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Personalisierte Inhaltsvorschläge</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics Cookies */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gray-50 p-6 border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-white rounded-lg border">
                          <Eye className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Analyse-Cookies</h3>
                          <p className="text-gray-700">
                            Helfen uns zu verstehen, wie Besucher mit der Website interagieren, um sie zu verbessern.
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <h4 className="font-semibold text-gray-900 mb-3">Was wir messen:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Besucherzahlen und Seitenaufrufe</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Nutzungsverhalten und Klickpfade</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Verweildauer und Absprungraten</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Technische Informationen (Browser, Gerät, etc.)</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Marketing Cookies */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gray-50 p-6 border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-white rounded-lg border">
                          <Target className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Marketing-Cookies</h3>
                          <p className="text-gray-700">
                            Werden verwendet, um Werbung anzuzeigen, die für Sie und Ihre Interessen relevant ist.
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <h4 className="font-semibold text-gray-900 mb-3">Verwendungszwecke:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Personalisierte Werbung auf anderen Websites</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Remarketing und Retargeting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Messung der Werbeeffektivität</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span>Social Media Integration</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Save Button */}
            <Card className="border-0 shadow-lg mt-8">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Ändern Sie Ihre Einstellungen nach Belieben und speichern Sie Ihre Präferenzen.
                  </p>
                  <Button
                    onClick={handleSave}
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                  >
                    Einstellungen speichern
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Additional Information */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Cookie className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Weitere Informationen zu Cookies
                    </h2>
                    <div className="space-y-4 text-gray-600">
                      <p>
                        Cookies sind kleine Textdateien, die von Websites auf Ihrem Computer oder Mobilgerät gespeichert werden. 
                        Sie werden häufig verwendet, um Websites funktionsfähig zu machen oder effizienter arbeiten zu lassen, 
                        sowie um Informationen an die Eigentümer der Website zu übermitteln.
                      </p>
                      <p>
                        Die meisten Webbrowser ermöglichen eine gewisse Kontrolle über die meisten Cookies durch die Browsereinstellungen. 
                        Um mehr über Cookies zu erfahren, einschließlich wie man sieht, welche Cookies gesetzt wurden und wie man sie 
                        verwaltet und löscht, besuchen Sie{" "}
                        <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                          www.allaboutcookies.org
                        </a>.
                      </p>
                      <p>
                        Sie können Ihre Cookie-Einstellungen jederzeit auf dieser Seite ändern. Ihre Wahl wird für 12 Monate gespeichert. 
                        Wenn Sie Ihre Cookies löschen, müssen Sie Ihre Einstellungen erneut vornehmen.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
