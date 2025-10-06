"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/colors";
import Container from "./container";
import Link from "next/link";

export default function Footer() {

  return (
    <footer className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white border-t border-emerald-700/30">
      <Container>
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid md:grid-cols-4 gap-12 lg:gap-16">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Image src="/logo-white.png" alt="PackChampion Logo" width={160} height={40} className="h-10 w-auto" />
              </div>
              <p className="text-emerald-50/90 text-base leading-relaxed mb-6 max-w-md">
                Ihre Champions für Ihre Verpackung. Nachhaltig. Stark. Innovativ.
              </p>
              <p className="text-emerald-50/70 text-sm leading-relaxed max-w-md">
                Von individuellen Verpackungslösungen bis zu nachhaltigen Materialien – 
                wir bieten maßgeschneiderte Lösungen für jeden Bedarf.
              </p>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-bold text-white mb-5 text-sm tracking-wide uppercase">Unternehmen</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/unternehmen" className="text-emerald-50/80 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center group">
                    <span className="group-hover:underline">Über uns</span>
                  </Link>
                </li>
                <li>
                  <Link href="/unternehmen/ansprechpartner" className="text-emerald-50/80 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center group">
                    <span className="group-hover:underline">Ansprechpartner</span>
                  </Link>
                </li>
                <li>
                  <Link href="/unternehmen/nachhaltigkeit" className="text-emerald-50/80 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center group">
                    <span className="group-hover:underline">Nachhaltigkeit</span>
                  </Link>
                </li>
                <li>
                  <Link href="/unternehmen/karriere" className="text-emerald-50/80 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center group">
                    <span className="group-hover:underline">Karriere</span>
                  </Link>
                </li>
                <li>
                  <Link href="/unternehmen/kontakt" className="text-emerald-50/80 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center group">
                    <span className="group-hover:underline">Kontakt</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-white mb-5 text-sm tracking-wide uppercase">Schnellzugriff</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/leistungen" className="text-emerald-50/80 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center group">
                    <span className="group-hover:underline">Leistungen</span>
                  </Link>
                </li>
                <li>
                  <Link href="/verpackungskategorien" className="text-emerald-50/80 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center group">
                    <span className="group-hover:underline">Verpackungskategorien</span>
                  </Link>
                </li>
                <li>
                  <Link href="/artikelgruppen" className="text-emerald-50/80 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center group">
                    <span className="group-hover:underline">Artikelgruppen</span>
                  </Link>
                </li>
                <li>
                  <Link href="/artikel" className="text-emerald-50/80 hover:text-white hover:translate-x-1 transition-all duration-200 inline-flex items-center group">
                    <span className="group-hover:underline">Artikel</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-emerald-700/30 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-emerald-50/70 text-sm">
              © {new Date().getFullYear()} packCHAMPION GmbH. Alle Rechte vorbehalten.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link href="/impressum" className="text-emerald-50/80 hover:text-white transition-colors duration-200 hover:underline">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-emerald-50/80 hover:text-white transition-colors duration-200 hover:underline">
                Datenschutz
              </Link>
              <Link href="/cookies" className="text-emerald-50/80 hover:text-white transition-colors duration-200 hover:underline">
                Cookie-Einstellungen
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
