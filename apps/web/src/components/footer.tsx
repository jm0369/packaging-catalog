"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { colors } from "@/lib/colors";
import Container from "./container";
import Link from "next/link";

export default function Footer() {

  return (
    <footer className="py-14 mt-10 text-white" style={{ backgroundColor: colors.darkGreen }}>
      <Container>
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 font-extrabold">
              <Image src="/logo-white.png" alt="PackChampion Logo" width={120} height={36} />
            </div>
            <p className="mt-4 text-white/85 text-sm max-w-xs">Ihre Champions für Ihre Verpackung. Nachhaltig. Stark. Innovativ.</p>
          </div>
          <div>
            <div className="font-semibold mb-3">UNTERNEHMEN</div>
            <ul className="space-y-2 text-sm text-white/95">
              <li>
                <Link href="/unternehmen/ansprechpartner" className="hover:underline">
                  Ansprechpartner
                </Link>
              </li>
              <li>
                <Link href="/unternehmen/nachhaltigkeit" className="hover:underline">
                  Nachhaltigkeit
                </Link>
              </li>
              <li>
                <Link href="/unternehmen/karriere" className="hover:underline">
                  Karriere
                </Link>
              </li>
              <li>
                <Link href="/unternehmen/kontakt" className="hover:underline">
                   Kontakt
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">QUICK LINKS</div>
            <ul className="space-y-2 text-sm text-white/95">
              <li>
                <Link href="/" className="hover:underline">
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="/unternehmen" className="hover:underline">
                  Unternehmen
                </Link>
              </li>
              <li>
                <Link href="/leistungen" className="hover:underline">
                  Leistungen
                </Link>
              </li>
              <li>
                <Link href="/produkte" className="hover:underline">
                  Produkte
                </Link>
              </li>
            </ul>
          </div>
          
        </div>
        <div className="mt-10 border-t border-white/30 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/95">
          <div>2025 © packCHAMPION GmbH</div>
          <div className="flex gap-4">
            <Link href="/impressum" className="hover:underline">Impressum</Link>
            <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
            <Link href="/cookies" className="hover:underline">Cookie Einstellungen</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
