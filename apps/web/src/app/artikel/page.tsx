"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { ArticlesTable } from '@/components/articles-table';
import Container from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Package, ArrowLeft, ArrowRight, X } from "lucide-react";
import { colors } from "@/lib/colors";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Article = {
  id: string;
  externalId: string;
  title: string;
  description: string | null;
  sku: string | null;
  ean: string | null;
  uom: string | null;
  attributes: Record<string, string> | null;
  media: string[];
  group: {
    id: string;
    externalId: string;
    name: string;
  };
};

export default function ArticlesPage() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const q = searchParams.get('q') || undefined;
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 24)));
  const offset = Math.max(0, Number(searchParams.get('offset') ?? 0));

  useEffect(() => {
    setSearchQuery(q || "");
  }, [q]);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      try {
        const sp = new URLSearchParams();
        if (q) sp.set('q', q);
        sp.set('limit', String(limit));
        sp.set('offset', String(offset));

        const r = await fetch(`${API}/api/artikel?${sp}`);
        if (r.ok) {
          const data = await r.json();
          setArticles(data.data || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [q, limit, offset]);

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit;

  const buildUrl = (params: { q?: string; limit?: number; offset?: number }) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set('q', params.q);
    if (params.limit) sp.set('limit', String(params.limit));
    if (params.offset) sp.set('offset', String(params.offset));
    return `/artikel?${sp.toString()}`;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-16">
        <Container>
          <div className="max-w-4xl">
            <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
              Artikel
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Alle Artikel durchsuchen
            </h1>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              Durchsuchen Sie unser komplettes Sortiment. Finden Sie genau den Artikel, den Sie benötigen, 
              mit unserer leistungsstarken Suchfunktion.
            </p>

            {/* Search Bar */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6">
                <form action="/artikel" method="get" className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="q"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Nach Titel, SKU oder EAN suchen..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <input type="hidden" name="limit" value={String(limit)} />
                  <Button type="submit" size="lg" className="bg-emerald-600 hover:bg-emerald-700 px-8">
                    Suchen
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Active Search Display */}
      {q && (
        <section className="py-6 bg-white border-b">
          <Container>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Aktive Suche:</span>
              <Link
                href="/artikel"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                &quot;{q}&quot;
                <X className="w-4 h-4" />
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Results Section */}
      <section className="py-12 bg-gray-50">
        <Container>
          {/* Results Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold" style={{ color: colors.darkGreen }}>
                {q ? 'Suchergebnisse' : 'Alle Artikel'}
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              {loading ? (
                "Lädt..."
              ) : (
                <>
                  {articles.length === 0 ? 0 : offset + 1}–{Math.min(offset + limit, total)} von {total}
                </>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-500">Artikel werden geladen...</p>
            </div>
          ) : articles.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-20 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Keine Artikel gefunden
                </h3>
                <p className="text-gray-600 mb-6">
                  {q 
                    ? 'Versuchen Sie es mit anderen Suchbegriffen oder entfernen Sie Filter.' 
                    : 'Derzeit sind keine Artikel verfügbar.'}
                </p>
                {q && (
                  <Link href="/artikel">
                    <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                      Alle Artikel anzeigen
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <ArticlesTable articles={articles} />

              {/* Pagination */}
              {total > limit && (
                <div className="mt-12 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Seite {Math.floor(offset / limit) + 1} von {Math.ceil(total / limit)}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={buildUrl({ q, limit, offset: prevOffset })}
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
                      href={buildUrl({ q, limit, offset: nextOffset })}
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
              Können Sie nicht finden, was Sie suchen?
            </h2>
            <p className="text-lg text-emerald-50 mb-8">
              Unser Expertenteam hilft Ihnen gerne bei der Suche nach dem richtigen Artikel 
              oder berät Sie zu alternativen Lösungen für Ihre Anforderungen.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/unternehmen/kontakt">
                <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Kontakt aufnehmen
                </Button>
              </Link>
              <Link href="/produktgruppen">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-600">
                  Produktgruppen durchsuchen
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
