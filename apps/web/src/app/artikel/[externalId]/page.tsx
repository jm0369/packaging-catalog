"use client";

import React, { useEffect, useState } from "react";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Lightbox } from '@/components/lightbox';
import { ArticlesTable } from '@/components/articles-table';
import Container from "@/components/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Tag, Clock, Ruler, Box, Layers, Info, ExternalLink, ImageIcon } from "lucide-react";
import { colors } from "@/lib/colors";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Category = {
  id: string;
  name: string;
  color: string;
  type: string;
};

type ArticleGroup = {
  externalId: string;
  name?: string;
  categories?: Category[];
};

type ArticleData = {
  id: string;
  externalId: string;
  title: string;
  description?: string | null;
  sku?: string | null;
  media: string[];
  categories: Category[];
  attributes?: {
    _INNENLAENGE?: string;
    _INNENBREITE?: string;
    _INNENHOEHE?: string;
    _AUSSENLAENGE?: string;
    _AUSSENBREITE?: string;
    _AUSSENHOEHE?: string;
    _VE2UEBERVERMENGE?: string;
    _VE2UEBERVERPART?: string;
    _VE2UEBERVERPLAENGE?: string;
    _VE2UEBERVERPBREITE?: string;
    _VE2UEBERVERPHOEHE?: string;
    _VE3VERPACKUNGMENGE?: string;
    _VE3PALETTENLAENGE?: string;
    _VE3PALETTENBREITE?: string;
    _VE3PALETTENHOEHE?: string;
  } | null;
  group: ArticleGroup;
  updatedAt?: string;
};

type ArticlePageProps = {
  params: Promise<{ externalId: string }>;
};

export default function ArticlePage({ params }: ArticlePageProps) {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [externalId, setExternalId] = useState<string>("");
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
    params.then((p) => setExternalId(p.externalId));
  }, [params]);

  useEffect(() => {
    if (!externalId) return;

    async function fetchArticle() {
      setLoading(true);
      try {
        const r = await fetch(`${API}/api/articles/${encodeURIComponent(externalId)}`);
        if (r.status === 404) {
          setArticle(null);
        } else if (r.ok) {
          const data = await r.json();
          
          // Merge article categories with group categories, removing duplicates
          const articleCategoryIds = new Set(data.categories.map((c: Category) => c.id));
          const groupCategories = data.group?.categories || [];
          const uniqueGroupCategories = groupCategories.filter((c: Category) => !articleCategoryIds.has(c.id));
          const allCategories = [...data.categories, ...uniqueGroupCategories];
          
          setArticle({
            ...data,
            categories: allCategories,
          });
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [externalId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500">Artikel wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-16">
        <Container>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
                Artikel Details
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: colors.darkGreen }}>
                {article.title}
              </h1>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-500 font-mono">
                  Art.-Nr.: {article.externalId}
                </p>
                {article.sku && (
                  <p className="text-sm text-gray-500 font-mono">
                    SKU: {article.sku}
                  </p>
                )}
              </div>

              {article.description ? (
                <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                  {article.description}
                </p>
              ) : (
                <p className="text-lg text-gray-400 italic mb-6">
                  Keine Beschreibung verfügbar.
                </p>
              )}

              {/* Product Group */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-gray-700">Produktgruppe:</span>
                </div>
                <Link 
                  href={`/artikelgruppen/${encodeURIComponent(article.group.externalId)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors font-medium text-emerald-700"
                >
                  {article.group.name || article.group.externalId}
                </Link>
              </div>

              {/* Categories (merged article + group categories) */}
              {article.categories && article.categories.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-700">Kategorien:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={category.type === 'Article' 
                          ? `/artikel?category=${encodeURIComponent(category.name)}`
                          : `/artikelgruppen?category=${encodeURIComponent(category.name)}`
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border shadow-sm transition-all hover:shadow-md"
                        style={{ 
                          backgroundColor: category.color + '20',
                          borderColor: category.color,
                          color: category.color 
                        }}
                      >
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {article.updatedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  Aktualisiert: {new Date(article.updatedAt).toLocaleDateString('de-DE', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>

            {/* Image Gallery */}
            <div className="space-y-4">
              {article.media && article.media.length > 0 ? (
                <>
                  {/* Main Image */}
                  <button
                    onClick={() => openLightbox(article.media, 0)}
                    className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 shadow-2xl"
                    aria-label="Bilder anzeigen"
                  >
                    <Image 
                      src={article.media[0]} 
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                        <ExternalLink className="w-6 h-6 text-gray-900" />
                      </div>
                    </div>
                    {article.media.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/70 text-white text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {article.media.length} Bilder
                      </div>
                    )}
                  </button>

                  {/* Thumbnail Grid */}
                  {article.media.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {article.media.slice(1, 5).map((image, idx) => (
                        <button
                          key={idx}
                          onClick={() => openLightbox(article.media, idx + 1)}
                          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-gray-100 shadow-md hover:shadow-xl transition-all"
                          aria-label={`Bild ${idx + 2} anzeigen`}
                        >
                          <Image 
                            src={image} 
                            alt={`${article.title} - Bild ${idx + 2}`}
                            fill
                            sizes="150px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                          {idx === 3 && article.media.length > 5 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white text-lg font-bold">+{article.media.length - 5}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="relative w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-2xl">
                  <ImageIcon className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>
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

      {/* Specifications Section */}
      {article.attributes && Object.keys(article.attributes).length > 0 && (
        <section className="py-16 bg-white">
          <Container>
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100">
                <Info className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold" style={{ color: colors.darkGreen }}>
                Technische Spezifikationen
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Dimensions */}
              {(article.attributes._INNENLAENGE || article.attributes._AUSSENLAENGE) && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
                        <Ruler className="w-5 h-5 text-emerald-600" />
                      </div>
                      <CardTitle>Maße</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {article.attributes._INNENLAENGE && (
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-1">Innenmaß</div>
                        <div className="text-sm text-gray-600 font-mono">
                          {article.attributes._INNENLAENGE} × {article.attributes._INNENBREITE} × {article.attributes._INNENHOEHE} mm
                        </div>
                      </div>
                    )}
                    {article.attributes._AUSSENLAENGE && (
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-1">Außenmaß</div>
                        <div className="text-sm text-gray-600 font-mono">
                          {article.attributes._AUSSENLAENGE} × {article.attributes._AUSSENBREITE} × {article.attributes._AUSSENHOEHE} mm
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Packaging Unit */}
              {(article.attributes._VE2UEBERVERMENGE || article.attributes._VE2UEBERVERPART) && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
                        <Box className="w-5 h-5 text-emerald-600" />
                      </div>
                      <CardTitle>Verpackungseinheit</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {article.attributes._VE2UEBERVERMENGE && (
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-1">Menge</div>
                        <div className="text-sm text-gray-600">{article.attributes._VE2UEBERVERMENGE}</div>
                      </div>
                    )}
                    {article.attributes._VE2UEBERVERPART && (
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-1">Art</div>
                        <div className="text-sm text-gray-600">{article.attributes._VE2UEBERVERPART}</div>
                      </div>
                    )}
                    {article.attributes._VE2UEBERVERPLAENGE && (
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-1">VPE Maß</div>
                        <div className="text-sm text-gray-600 font-mono">
                          {article.attributes._VE2UEBERVERPLAENGE} × {article.attributes._VE2UEBERVERPBREITE} × {article.attributes._VE2UEBERVERPHOEHE} mm
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Pallet */}
              {(article.attributes._VE3VERPACKUNGMENGE || article.attributes._VE3PALETTENLAENGE) && (
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
                        <Layers className="w-5 h-5 text-emerald-600" />
                      </div>
                      <CardTitle>Palettierung</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {article.attributes._VE3VERPACKUNGMENGE && (
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-1">Menge pro Palette</div>
                        <div className="text-sm text-gray-600">{article.attributes._VE3VERPACKUNGMENGE}</div>
                      </div>
                    )}
                    {article.attributes._VE3PALETTENLAENGE && (
                      <div>
                        <div className="text-sm font-semibold text-gray-700 mb-1">Außenmaß</div>
                        <div className="text-sm text-gray-600 font-mono">
                          {article.attributes._VE3PALETTENLAENGE} × {article.attributes._VE3PALETTENBREITE} × {article.attributes._VE3PALETTENHOEHE} mm
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Full Details Table */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="flex items-center gap-3 mb-8">
            <Package className="w-6 h-6 text-emerald-600" />
            <h2 className="text-3xl font-bold" style={{ color: colors.darkGreen }}>
              Vollständige Details
            </h2>
          </div>
          <ArticlesTable articles={[article]}/>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Interesse an diesem Produkt?
            </h2>
            <p className="text-lg text-emerald-50 mb-8">
              Kontaktieren Sie unser Vertriebsteam für weitere Informationen, Preise und Verfügbarkeit. 
              Wir beraten Sie gerne persönlich.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/unternehmen/kontakt">
                <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Jetzt anfragen
                </Button>
              </Link>
              <Link href={`/groups/${encodeURIComponent(article.group.externalId)}`}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-600">
                  Weitere Artikel ansehen
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}