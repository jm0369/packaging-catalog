"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { ArticlesTable } from '@/components/articles-table';
import Container from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Package, ArrowLeft, ArrowRight, X, Ruler, Filter } from "lucide-react";
import { colors } from "@/lib/colors";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Category = {
  id: string;
  name: string;
  type: string;
  color: string;
};

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const q = searchParams.get('q') || undefined;
  const categoryName = searchParams.get('category') || undefined;
  const lengthParam = searchParams.get('length') || undefined;
  const widthParam = searchParams.get('width') || undefined;
  const heightParam = searchParams.get('height') || undefined;
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 24)));
  const offset = Math.max(0, Number(searchParams.get('offset') ?? 0));

  useEffect(() => {
    setSearchQuery(q || "");
    setLength(lengthParam || "");
    setWidth(widthParam || "");
    setHeight(heightParam || "");
  }, [q, lengthParam, widthParam, heightParam]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const sp = new URLSearchParams();
        if (q) sp.set('q', q);
        if (categoryName) sp.set('category', categoryName);
        if (lengthParam) sp.set('length', lengthParam);
        if (widthParam) sp.set('width', widthParam);
        if (heightParam) sp.set('height', heightParam);
        sp.set('limit', String(limit));
        sp.set('offset', String(offset));

        const [articlesRes, categoriesRes] = await Promise.all([
          fetch(`${API}/api/articles?${sp}`),
          fetch(`${API}/api/categories`),
        ]);

        if (articlesRes.ok) {
          const data = await articlesRes.json();
          setArticles(data.data || []);
          setTotal(data.total || 0);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          // Store all categories
          setAllCategories(Array.isArray(categoriesData) ? categoriesData : []);
          // Filter to only show Article type categories for this page
          const articleCategories = Array.isArray(categoriesData) 
            ? categoriesData.filter((c: Category) => c.type === 'Article') 
            : [];
          setCategories(articleCategories);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [q, categoryName, lengthParam, widthParam, heightParam, limit, offset]);

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit;
  const selectedCategory = categories.find(c => c.name === categoryName);

  const buildUrl = (params: { q?: string; category?: string; length?: string; width?: string; height?: string; limit?: number; offset?: number }) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set('q', params.q);
    if (params.category) sp.set('category', params.category);
    if (params.length) sp.set('length', params.length);
    if (params.width) sp.set('width', params.width);
    if (params.height) sp.set('height', params.height);
    if (params.limit) sp.set('limit', String(params.limit));
    if (params.offset) sp.set('offset', String(params.offset));
    return `/artikel?${sp.toString()}`;
  };

  const hasDimensionFilter = lengthParam || widthParam || heightParam;
  const hasAnyFilter = q || categoryName || hasDimensionFilter;

  return (
    <>
      {/* Search & Filters Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-16 border-b">
        <Container>
          <div className="max-w-6xl mx-auto">
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
            <Card className="border-0 shadow-xl mb-8">
              <CardContent className="p-6">
                <form action="/artikel" method="get" className="space-y-4">
                  {/* Text Search */}
                  <div className="flex gap-3">
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
                  </div>

                  {/* Dimension Filters */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Ruler className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Maßfilter (mm) - Findet Artikel, in die Ihr Produkt passt:
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="length" className="block text-xs text-gray-600 mb-1.5">
                          Länge (mm)
                        </label>
                        <input
                          id="length"
                          name="length"
                          type="number"
                          min="0"
                          step="1"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          placeholder="z.B. 100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="width" className="block text-xs text-gray-600 mb-1.5">
                          Breite (mm)
                        </label>
                        <input
                          id="width"
                          name="width"
                          type="number"
                          min="0"
                          step="1"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          placeholder="z.B. 50"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="height" className="block text-xs text-gray-600 mb-1.5">
                          Höhe (mm)
                        </label>
                        <input
                          id="height"
                          name="height"
                          type="number"
                          min="0"
                          step="1"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="z.B. 30"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Hinweis: Die Reihenfolge der Maße spielt keine Rolle. Es werden alle passenden Orientierungen berücksichtigt.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Category Filters */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold">Filter nach Kategorie</h2>
              </div>

              {/* Combined Categories Filter */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/artikel"
                  className={`px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${
                    !categoryName 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' 
                      : 'border-gray-300 hover:border-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  Alle Artikel
                </Link>
                
                {/* Article Categories (current page) */}
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={buildUrl({ q, category: category.name, length: lengthParam, width: widthParam, height: heightParam, limit })}
                    className={`px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all flex items-center gap-2 ${
                      categoryName === category.name
                        ? 'text-white shadow-lg'
                        : 'hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: categoryName === category.name ? category.color : 'white',
                      borderColor: category.color,
                      color: categoryName === category.name ? 'white' : '#374151',
                    }}
                  >
                    <div 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: categoryName === category.name ? 'white' : category.color }}
                    />
                    {category.name}
                  </Link>
                ))}

                {/* Group Categories (cross-link to groups page) */}
                {allCategories
                  .filter(c => c.type === 'Group')
                  .map((category) => (
                    <Link
                      key={category.id}
                      href={`/artikelgruppen?category=${encodeURIComponent(category.name)}`}
                      className="px-5 py-2.5 rounded-full border-2 text-sm font-medium hover:shadow-md transition-all flex items-center gap-2 opacity-75 hover:opacity-100"
                      style={{
                        backgroundColor: 'white',
                        borderColor: category.color,
                        color: '#374151',
                      }}
                    >
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </Link>
                  ))}
              </div>

              {/* Active Filter Display */}
              {(selectedCategory || q || hasDimensionFilter) && (
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-sm text-gray-600">Aktive Filter:</span>
                  {selectedCategory && (
                    <Link
                      href={buildUrl({ q, length: lengthParam, width: widthParam, height: heightParam, limit })}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Kategorie: {selectedCategory.name}
                      <X className="w-4 h-4" />
                    </Link>
                  )}
                  {q && (
                    <Link
                      href={buildUrl({ category: categoryName, length: lengthParam, width: widthParam, height: heightParam, limit })}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Suche: &quot;{q}&quot;
                      <X className="w-4 h-4" />
                    </Link>
                  )}
                  {hasDimensionFilter && (
                    <Link
                      href={buildUrl({ q, category: categoryName, limit })}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 hover:bg-emerald-200 transition-colors"
                    >
                      <Ruler className="w-3 h-3" />
                      Maße: {lengthParam || '?'} × {widthParam || '?'} × {heightParam || '?'} mm
                      <X className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-gray-50">
        <Container>
          {/* Results Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold" style={{ color: colors.darkGreen }}>
                {hasDimensionFilter ? 'Passende Artikel' : q ? 'Suchergebnisse' : 'Alle Artikel'}
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
                  {hasDimensionFilter 
                    ? 'Für die angegebenen Maße wurden keine passenden Artikel gefunden. Versuchen Sie es mit größeren Maßen.' 
                    : q 
                    ? 'Versuchen Sie es mit anderen Suchbegriffen oder entfernen Sie Filter.' 
                    : 'Derzeit sind keine Artikel verfügbar.'}
                </p>
                {hasAnyFilter && (
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
              <ArticlesTable articles={articles} showGroupHeaders={true} />

              {/* Pagination */}
              {total > limit && (
                <div className="mt-12 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Seite {Math.floor(offset / limit) + 1} von {Math.ceil(total / limit)}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={buildUrl({ q, category: categoryName, length: lengthParam, width: widthParam, height: heightParam, limit, offset: prevOffset })}
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
                      href={buildUrl({ q, category: categoryName, length: lengthParam, width: widthParam, height: heightParam, limit, offset: nextOffset })}
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
              <Link href="/artikelgruppen">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-600">
                  Artikelgruppen durchsuchen
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
