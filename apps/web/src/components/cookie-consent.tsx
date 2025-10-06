"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Settings, X } from "lucide-react";
import { 
  hasGivenConsent, 
  saveCookiePreferences, 
  type CookiePreferences,
  initializeAnalytics,
  initializeMarketing,
  initializeFunctional
} from "@/lib/cookies";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    if (!hasGivenConsent()) {
      // Delay showing banner slightly for better UX
      setTimeout(() => setShowBanner(true), 1000);
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
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    handleSavePreferences(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    handleSavePreferences(necessaryOnly);
    setShowBanner(false);
    setShowSettings(false);
  };

  const saveCustomPreferences = () => {
    handleSavePreferences(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-end md:items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-4xl border-0 shadow-2xl animate-in slide-in-from-bottom duration-500 md:slide-in-from-bottom-0">
        <CardContent className="p-0">
          {!showSettings ? (
            // Main Banner
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-emerald-100 rounded-lg flex-shrink-0">
                  <Cookie className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Wir verwenden Cookies
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Wir verwenden Cookies und ähnliche Technologien, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
                    Einige Cookies sind für die Funktion der Website erforderlich, während andere uns helfen, unsere Inhalte zu verbessern 
                    und Ihr Nutzererlebnis zu personalisieren.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">✓ Notwendige Cookies</div>
                    <p className="text-gray-600">Erforderlich für die Funktion der Website</p>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700 mb-1">Funktionale Cookies</div>
                    <p className="text-gray-600">Verbessern Ihre Benutzererfahrung</p>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700 mb-1">Analyse-Cookies</div>
                    <p className="text-gray-600">Helfen uns, die Website zu optimieren</p>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700 mb-1">Marketing-Cookies</div>
                    <p className="text-gray-600">Ermöglichen personalisierte Werbung</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={acceptAll}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-initial"
                >
                  Alle akzeptieren
                </Button>
                <Button
                  onClick={acceptNecessary}
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 flex-1 sm:flex-initial"
                >
                  Nur notwendige
                </Button>
                <Button
                  onClick={() => setShowSettings(true)}
                  size="lg"
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 flex-1 sm:flex-initial"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Einstellungen
                </Button>
              </div>

              <div className="mt-4 text-center">
                <Link
                  href="/cookies"
                  className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  Mehr über unsere Cookie-Richtlinie erfahren
                </Link>
              </div>
            </div>
          ) : (
            // Settings Panel
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Cookie-Einstellungen</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Zurück"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Wählen Sie, welche Cookies Sie zulassen möchten. Sie können Ihre Einstellungen jederzeit ändern.
              </p>

              <div className="space-y-4 mb-8">
                {/* Necessary Cookies */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="font-semibold text-gray-900">Notwendige Cookies</div>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                        Immer aktiv
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">Funktionale Cookies</div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Ermöglichen erweiterte Funktionen wie Spracheinstellungen und personalisierte Inhalte.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">Analyse-Cookies</div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Helfen uns zu verstehen, wie Besucher mit der Website interagieren, um sie zu verbessern.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">Marketing-Cookies</div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Werden verwendet, um Werbung anzuzeigen, die für Sie relevant ist.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={saveCustomPreferences}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                >
                  Auswahl speichern
                </Button>
                <Button
                  onClick={acceptAll}
                  size="lg"
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 flex-1 sm:flex-initial"
                >
                  Alle akzeptieren
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
