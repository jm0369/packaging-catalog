"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Leaf, CheckCircle2, ArrowRight, Boxes, Sparkles } from "lucide-react";
import { colors } from "@/lib/colors";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Category = {
  id: string;
  name: string;
  color: string;
  description?: string;
  groupCount: number;
  media: string[];
};

export default function ProduktePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const r = await fetch(`${API}/api/categories`);
        if (r.ok) {
          const data = await r.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const highlights = [
    {
      icon: Leaf,
      title: "100% nachhaltig",
      description: "Alle Produkte aus recycelbaren und umweltfreundlichen Materialien"
    },
    {
      icon: Boxes,
      title: "Große Auswahl",
      description: "Über 5000 verschiedene Verpackungslösungen im Sortiment"
    },
    {
      icon: Sparkles,
      title: "Premium Qualität",
      description: "Höchste Qualitätsstandards und geprüfte Materialien"
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-20">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
                Unsere Produktkategorien
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
                Verpackungskategorien für jeden Bedarf
              </h1>
              <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                Entdecken Sie unsere vielfältigen Verpackungskategorien. Von nachhaltigen 
                Lösungen bis zu individuellen Designs – wir haben die perfekte Verpackung 
                für jeden Bedarf.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/unternehmen/kontakt">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Beratung anfragen
                  </Button>
                </Link>
                <Link href="/leistungen">
                  <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Unsere Leistungen
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-32 bg-emerald-100 rounded-lg" />
                  <div className="h-48 bg-emerald-200 rounded-lg" />
                </div>
                <div className="space-y-4 mt-8">
                  <div className="h-48 bg-emerald-300 rounded-lg" />
                  <div className="h-32 bg-emerald-200 rounded-lg" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-24 h-24 text-emerald-600 opacity-50" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="pt-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                    <highlight.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{highlight.title}</h3>
                  <p className="text-foreground/70">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Products Categories Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <SectionTitle 
              title="Produktkategorien" 
              kicker="Wählen Sie aus unseren spezialisierten Verpackungskategorien"
              center
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Produkte werden geladen...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Keine Produkte verfügbar.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const firstImage = category.media?.[0];
                const imageUrl = firstImage || null;

                return (
                  <Link
                    key={category.id}
                    href={`/produktkategorien/${encodeURIComponent(category.name)}`}
                    className="group"
                  >
                    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
                      {/* Image */}
                      {imageUrl ? (
                        <div className="aspect-video w-full overflow-hidden bg-gray-100">
                          <img
                            src={imageUrl}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div 
                          className="aspect-video w-full flex items-center justify-center relative overflow-hidden"
                          style={{ backgroundColor: category.color + '20' }}
                        >
                          <div 
                            className="w-20 h-20 rounded-full group-hover:scale-125 transition-transform duration-500"
                            style={{ backgroundColor: category.color }}
                          />
                        </div>
                      )}

                      {/* Content */}
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: category.color }}
                          />
                          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {category.name}
                          </h2>
                        </div>
                        
                        {category.description && (
                          <p className="text-foreground/70 mb-4 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-emerald-600">
                            {category.groupCount} {category.groupCount === 1 ? 'Produkt' : 'Produkte'}
                          </div>
                          <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Finden Sie nicht die passende Lösung?
            </h2>
            <p className="text-lg text-emerald-50 mb-8">
              Wir entwickeln gerne eine individuelle Verpackungslösung speziell für Ihre Anforderungen. 
              Kontaktieren Sie unser Expertenteam für eine kostenlose Beratung.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/unternehmen/kontakt">
                <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Jetzt Kontakt aufnehmen
                </Button>
              </Link>
              <Link href="/leistungen/verpackungsentwicklung">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-600">
                  Individuelle Entwicklung
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
