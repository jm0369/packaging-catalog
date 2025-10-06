"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { GroupList } from '@/components/group-list';
import Container from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Package, ArrowLeft, ArrowRight, X } from "lucide-react";
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
  description?: string | null;
  media: string[];
  categories: Category[];
};

export default function GroupsPage() {
  const searchParams = useSearchParams();
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const q = searchParams.get('q') || undefined;
  const categoryName = searchParams.get('category') || undefined;
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 24)));
  const offset = Math.max(0, Number(searchParams.get('offset') ?? 0));

  useEffect(() => {
    setSearchQuery(q || "");
  }, [q]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [groupsRes, categoriesRes] = await Promise.all([
          fetch(`${API}/api/article-groups?${new URLSearchParams({
            ...(q && { q }),
            ...(categoryName && { category: categoryName }),
            limit: String(limit),
            offset: String(offset),
          }).toString()}`),
          fetch(`${API}/api/categories`),
        ]);

        if (groupsRes.ok) {
          const groupsData = await groupsRes.json();
          setGroups(groupsData.data || []);
          setTotal(groupsData.total || 0);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [q, categoryName, limit, offset]);

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit;
  const selectedCategory = categories.find(c => c.name === categoryName);

  const buildSearchUrl = (params: { q?: string; category?: string; limit?: number; offset?: number }) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set('q', params.q);
    if (params.category) sp.set('category', params.category);
    if (params.limit) sp.set('limit', String(params.limit));
    if (params.offset) sp.set('offset', String(params.offset));
    return `/produktgruppen?${sp.toString()}`;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-white py-16">
        <Container>
          <div className="max-w-4xl">
            <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: colors.lightGreen }}>
              Produktgruppen
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6" style={{ color: colors.darkGreen }}>
              Finden Sie die perfekte Verpackungslösung
            </h1>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              Durchsuchen Sie unsere umfangreiche Auswahl an Verpackungsprodukten. 
              Filtern Sie nach Kategorien oder nutzen Sie die Suche, um genau das zu finden, was Sie brauchen.
            </p>

            {/* Search Bar */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6">
                <form action="/produktgruppen" method="get" className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="q"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Produktgruppen durchsuchen..."
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  {categoryName && <input type="hidden" name="category" value={categoryName} />}
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

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <Container>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold">Filter nach Kategorie</h2>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/produktgruppen"
                  className={`px-5 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${
                    !categoryName 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' 
                      : 'border-gray-300 hover:border-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  Alle Produkte
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={buildSearchUrl({ q, category: category.name, limit })}
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
              </div>
            )}

            {/* Active Filter Display */}
            {(selectedCategory || q) && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-sm text-gray-600">Aktive Filter:</span>
                {selectedCategory && (
                  <Link
                    href={buildSearchUrl({ q, limit })}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Kategorie: {selectedCategory.name}
                    <X className="w-4 h-4" />
                  </Link>
                )}
                {q && (
                  <Link
                    href={buildSearchUrl({ category: categoryName, limit })}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Suche: &quot;{q}&quot;
                    <X className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
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
                {selectedCategory ? selectedCategory.name : 'Alle Produktgruppen'}
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              {loading ? (
                "Lädt..."
              ) : (
                <>
                  {groups.length === 0 ? 0 : offset + 1}–{Math.min(offset + limit, total)} von {total} Produkten
                </>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-500">Produkte werden geladen...</p>
            </div>
          ) : groups.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-20 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Keine Produkte gefunden
                </h3>
                <p className="text-gray-600 mb-6">
                  Versuchen Sie es mit anderen Suchbegriffen oder entfernen Sie Filter.
                </p>
                <Link href="/produktgruppen">
                  <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                    Alle Produkte anzeigen
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <GroupList groups={groups} apiBase={API} />

              {/* Pagination */}
              {total > limit && (
                <div className="mt-12 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Seite {Math.floor(offset / limit) + 1} von {Math.ceil(total / limit)}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={buildSearchUrl({ q, category: categoryName, limit, offset: prevOffset })}
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
                      href={buildSearchUrl({ q, category: categoryName, limit, offset: nextOffset })}
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
              Unser Expertenteam hilft Ihnen gerne bei der Auswahl der richtigen Verpackungslösung 
              oder entwickelt eine individuelle Lösung für Ihre Bedürfnisse.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/unternehmen/kontakt">
                <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Kontakt aufnehmen
                </Button>
              </Link>
              <Link href="/leistungen">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-600">
                  Unsere Leistungen
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}