"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Lightbox } from '@/components/lightbox';
import { ArticlesTable } from '@/components/articles-table';
import Container from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, ArrowRight, Package, Tag, ExternalLink, ImageIcon } from "lucide-react";
import { colors } from "@/lib/colors";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Category = {
  id: string;
  name: string;
  color: string;
};

type GroupData = {
  id: string;
  externalId: string;
  name: string;
  description: string | null;
  media: string[];
  categories: Category[];
  articles: Array<{
    id: string;
    externalId: string;
    title: string;
    sku: string | null;
    attributes: Record<string, string> | null;
    media: string[];
  }>;
};

type GroupPageProps = {
  params: Promise<{ externalId: string }>;
};

export default function GroupPage({ params }: GroupPageProps) {
  const searchParams = useSearchParams();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [externalId, setExternalId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
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

  const q = searchParams.get('q') || undefined;
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 24)));
  const offset = Math.max(0, Number(searchParams.get('offset') ?? 0));

  useEffect(() => {
    params.then((p) => setExternalId(p.externalId));
  }, [params]);

  useEffect(() => {
    setSearchQuery(q || "");
  }, [q]);

  useEffect(() => {
    if (!externalId) return;

    async function fetchGroup() {
      setLoading(true);
      try {
        const r = await fetch(`${API}/api/article-groups/${externalId}`);
        if (r.status === 404) {
          setGroup(null);
        } else if (r.ok) {
          const data = await r.json();
          setGroup(data);
        }
      } catch (error) {
        console.error('Failed to fetch group:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchGroup();
  }, [externalId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500">Artikelgruppe wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return notFound();
  }

  // Filter articles by search query if provided
  let filteredArticles = group.articles;
  if (q) {
    const lowerQ = q.toLowerCase();
    filteredArticles = group.articles.filter(article => 
      article.title.toLowerCase().includes(lowerQ) ||
      article.externalId.toLowerCase().includes(lowerQ) ||
      (article.sku && article.sku.toLowerCase().includes(lowerQ))
    );
  }

  // Paginate the filtered results
  const total = filteredArticles.length;
  const data = filteredArticles.slice(offset, offset + limit);

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit;

  const buildUrl = (params: { q?: string }) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set('q', params.q);
    return `/artikelgruppen/${externalId}?${sp.toString()}`;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-16">
        <Container>
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/artikelgruppen"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zu allen Artikelgruppen
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
                Produktgruppe
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: colors.darkGreen }}>
                {group.name}
              </h1>

              <p className="text-sm text-gray-500 mb-6 font-mono">
                Art.-Nr.: {decodeURIComponent(externalId)}
              </p>

              {group.description && (
                <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                  {group.description}
                </p>
              )}

              {/* Categories */}
              {group.categories && group.categories.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-700">Kategorien:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/produkte/${category.id}`}
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

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="w-4 h-4" />
                <span className="font-semibold">{total} Artikel verfügbar</span>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="space-y-4">
              {group.media && group.media.length > 0 ? (
                <>
                  {/* Main Image */}
                  <button
                    onClick={() => openLightbox(group.media, 0)}
                    className="relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer group bg-gray-100 shadow-2xl"
                    aria-label="Bilder anzeigen"
                  >
                    <Image 
                      src={group.media[0]} 
                      alt={group.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                        <ExternalLink className="w-6 h-6 text-gray-900" />
                      </div>
                    </div>
                    {group.media.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/70 text-white text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {group.media.length} Bilder
                      </div>
                    )}
                  </button>

                  {/* Thumbnail Grid */}
                  {group.media.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {group.media.slice(1, 5).map((image, idx) => (
                        <button
                          key={idx}
                          onClick={() => openLightbox(group.media, idx + 1)}
                          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-gray-100 shadow-md hover:shadow-xl transition-all"
                          aria-label={`Bild ${idx + 2} anzeigen`}
                        >
                          <Image 
                            src={image} 
                            alt={`${group.name} - Bild ${idx + 2}`}
                            fill
                            sizes="150px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                          {idx === 3 && group.media.length > 5 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white text-lg font-bold">+{group.media.length - 5}</span>
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

      {/* Articles Section */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold" style={{ color: colors.darkGreen }}>
                Verfügbare Artikel
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              {data.length === 0 ? 0 : offset + 1}–{Math.min(offset + limit, total)} von {total}
            </div>
          </div>

          {data.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-20 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Keine Artikel gefunden
                </h3>
                <p className="text-gray-600 mb-6">
                  {q ? 'Versuchen Sie es mit anderen Suchbegriffen.' : 'Für diese Artikelgruppe sind derzeit keine Artikel verfügbar.'}
                </p>
                {q && (
                  <Link href={`/artikelgruppen/${externalId}`}>
                    <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                      Alle Artikel anzeigen
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <ArticlesTable articles={data} />

              {/* Pagination */}
              {total > limit && (
                <div className="mt-12 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Seite {Math.floor(offset / limit) + 1} von {Math.ceil(total / limit)}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={buildUrl({ q })}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 font-medium transition-all ${
                        offset === 0 
                          ? 'pointer-events-none opacity-40 border-gray-300' 
                          : 'border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Zurück
                    </Link>
                    <Link
                      href={buildUrl({ q })}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 font-medium transition-all ${
                        nextOffset >= total 
                          ? 'pointer-events-none opacity-40 border-gray-300' 
                          : 'border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      Weiter
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Haben Sie Fragen zu unseren Produkten?
            </h2>
            <p className="text-lg text-emerald-50 mb-8">
              Unser Expertenteam berät Sie gerne bei der Auswahl der richtigen Verpackungslösung 
              und beantwortet alle Ihre Fragen zu unseren Produkten.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/unternehmen/kontakt">
                <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Kontakt aufnehmen
                </Button>
              </Link>
              <Link href="/artikelgruppen">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-600">
                  Weitere Artikelgruppen
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}