"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ImageGallery } from '@/components/image-gallery';
import Container from "@/components/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, CheckCircle2, Info, Ruler, BarChart3, ShoppingCart, ArrowLeft, ArrowRight } from "lucide-react";
import { colors } from "@/lib/colors";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Category = {
  id: string;
  name: string;
  color: string;
  description?: string;
  properties?: Array<{ name: string; description: string }>;
  applications?: string[];
  formatsSpecifications?: string[];
  keyFigures?: Array<{ name: string; description: string }>;
  ordering?: Array<{ name: string; description: string }>;
  orderingNotes?: string[];
  media: string[];
  groupCount: number;
};

type ProduktDetailPageProps = {
  params: Promise<{ name: string }>;
};

export default function ProduktDetailPage({ params }: ProduktDetailPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    params.then((p) => setCategoryName(p.name));
  }, [params]);

  useEffect(() => {
    if (!categoryName) return;

    async function fetchCategory() {
      try {
        const r = await fetch(`${API}/api/categories/by-name/${encodeURIComponent(categoryName)}`);
        if (r.ok) {
          const data = await r.json();
          setCategory(data.statusCode === 404 ? null : data);
        } else {
          setCategory(null);
        }
      } catch (error) {
        console.error('Failed to fetch category:', error);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCategory();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Produkt wird geladen...</p>
      </div>
    );
  }

  if (!category) {
    return notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-16">
        <Container>
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/produktkategorien"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zu den Produktkategorien
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-xl shadow-lg"
                  style={{ backgroundColor: category.color }}
                />
                <div className="text-sm font-semibold text-emerald-600">
                  {category.groupCount} {category.groupCount === 1 ? 'Produkt' : 'Produkte'} verfügbar
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
                {category.name}
              </h1>
              
              {category.description && (
                <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                  {category.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                <Link href={`/produktgruppen?category=${encodeURIComponent(category.name)}`}>
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Alle {category.name} anzeigen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/unternehmen/kontakt">
                  <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Beratung anfragen
                  </Button>
                </Link>
              </div>
            </div>

            {/* Media Gallery */}
            {category.media && category.media.length > 0 && (
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageGallery images={category.media} alt={category.name} />
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Properties */}
      {category.properties && category.properties.length > 0 && (
        <section className="py-16 bg-white">
          <Container>
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold" style={{ color: colors.darkGreen }}>
                Eigenschaften
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {category.properties.map((prop, idx) => (
                <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{prop.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{prop.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Applications */}
      {category.applications && category.applications.length > 0 && (
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold" style={{ color: colors.darkGreen }}>
                Anwendungen
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {category.applications.map((app, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{app}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Formats & Specifications */}
      {category.formatsSpecifications && category.formatsSpecifications.length > 0 && (
        <section className="py-16 bg-white">
          <Container>
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100">
                <Ruler className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold" style={{ color: colors.darkGreen }}>
                Formate & Spezifikationen
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.formatsSpecifications.map((format, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <Info className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{format}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Key Figures */}
      {category.keyFigures && category.keyFigures.length > 0 && (
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold" style={{ color: colors.darkGreen }}>
                Kennzahlen
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {category.keyFigures.map((figure, idx) => (
                <Card key={idx} className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{figure.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{figure.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Ordering */}
      {category.ordering && category.ordering.length > 0 && (
        <section className="py-16 bg-white">
          <Container>
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold" style={{ color: colors.darkGreen }}>
                Bestellinformationen
              </h2>
            </div>
            <div className="space-y-4">
              {category.ordering.map((order, idx) => (
                <Card key={idx} className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg">{order.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{order.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Ordering Notes */}
      {category.orderingNotes && category.orderingNotes.length > 0 && (
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100">
                <Info className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold" style={{ color: colors.darkGreen }}>
                Hinweise zur Bestellung
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {category.orderingNotes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/80">{note}</span>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Interessiert an {category.name}?
            </h2>
            <p className="text-lg text-emerald-50 mb-8">
              Kontaktieren Sie unser Expertenteam für eine individuelle Beratung und 
              finden Sie die perfekte Verpackungslösung für Ihre Anforderungen.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href={`/produktgruppen?category=${encodeURIComponent(category.name)}`}>
                <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Alle {category.name} anzeigen
                </Button>
              </Link>
              <Link href="/unternehmen/kontakt">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-600">
                  Jetzt beraten lassen
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
