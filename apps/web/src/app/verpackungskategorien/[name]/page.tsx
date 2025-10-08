"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Lightbox } from '@/components/lightbox';
import Container from "@/components/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, CheckCircle2, Info, Ruler, BarChart3, ShoppingCart, ArrowLeft, ArrowRight, ExternalLink, ImageIcon } from "lucide-react";
import { colors } from "@/lib/colors";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Category = {
  id: string;
  name: string;
  color: string;
  type: string;
  description?: string;
  properties?: Array<{ name: string; description: string }>;
  applications?: string[];
  formatsSpecifications?: string[];
  keyFigures?: Array<{ name: string; description: string }>;
  ordering?: Array<{ name: string; description: string }>;
  orderingNotes?: string[];
  media: string[];
  groups: Array<{ id: string; externalId: string; name: string }>;
  articles: Array<{ id: string; externalId: string; title: string }>;
};

type ProduktDetailPageProps = {
  params: Promise<{ name: string }>;
};

export default function ProduktDetailPage({ params }: ProduktDetailPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState<string>("");
  const [lightboxImages, setLightboxImages] = useState<string[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: string[], index: number = 0) => {
    setLightboxImages(images);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxImages(null);
    setLightboxIndex(0);
  };

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
          console.log(data);
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
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-16 overflow-hidden">
        <Container className="overflow-hidden">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              href="/verpackungskategorien"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zu den Verpackungskategorien
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="min-w-0">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-xl shadow-lg flex-shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                <div className="text-sm font-semibold text-emerald-600 break-words">
                  {category.type === 'Article'
                    ? `${category.articles.length} ${category.articles.length === 1 ? 'Artikel' : 'Artikel'} verfügbar`
                    : `${category.groups.length} ${category.groups.length === 1 ? 'Produkt' : 'Produkte'} verfügbar`
                  }
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold mb-6 break-words hyphens-auto" style={{ color: colors.darkGreen, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {category.name}
              </h1>

              {category.description && (
                <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
                  {category.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                <Link href={category.type === 'Article'
                  ? `/artikel?category=${encodeURIComponent(category.name)}`
                  : `/artikelgruppen?category=${encodeURIComponent(category.name)}`
                }>
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
              <div className="space-y-4">
                {/* Main Image */}
                <button
                  onClick={() => openLightbox(category.media, 0)}
                  className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 shadow-2xl"
                  aria-label="Bilder anzeigen"
                >
                  <Image
                    src={category.media[0]}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                      <ExternalLink className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
                  {category.media.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {category.media.length} Bilder
                    </div>
                  )}
                </button>

                {/* Thumbnail Grid */}
                {category.media.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {category.media.slice(1, 5).map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => openLightbox(category.media, idx + 1)}
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-gray-100 shadow-md hover:shadow-xl transition-all"
                        aria-label={`Bild ${idx + 2} anzeigen`}
                      >
                        <Image
                          src={image}
                          alt={`${category.name} - Bild ${idx + 2}`}
                          fill
                          sizes="150px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        {idx === 3 && category.media.length > 5 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white text-lg font-bold">+{category.media.length - 5}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      {lightboxImages && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}

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
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white overflow-hidden">
        <Container className="overflow-hidden">
          <div className="text-center max-w-3xl mx-auto min-w-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 break-words hyphens-auto" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              Interessiert an {category.name}?
            </h2>
            <p className="text-lg text-emerald-50 mb-8">
              Kontaktieren Sie unser Expertenteam für eine individuelle Beratung und
              finden Sie die perfekte Verpackungslösung für Ihre Anforderungen.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href={category.type === 'Article'
                ? `/artikel?category=${encodeURIComponent(category.name)}`
                : `/artikelgruppen?category=${encodeURIComponent(category.name)}`
              }>
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
