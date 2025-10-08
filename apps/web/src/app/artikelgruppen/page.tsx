"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from 'next/link';
import { GroupList } from '@/components/group-list';
import { SearchFilters } from '@/components/search-filters';
import Container from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft, ArrowRight } from "lucide-react";
import { colors } from "@/lib/colors";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Category = {
  id: string;
  name: string;
  type: string;
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

function GroupsPageContent() {
  const searchParams = useSearchParams();
  const [groups, setGroups] = useState<GroupData[]>([]);
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
          // Store all categories
          setAllCategories(Array.isArray(categoriesData) ? categoriesData : []);
          // Filter to only show Group type categories for this page
          const groupCategories = Array.isArray(categoriesData) 
            ? categoriesData.filter((c: Category) => c.type === 'Group') 
            : [];
          setCategories(groupCategories);
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

  const buildSearchUrl = (params: { q?: string; category?: string; length?: string; width?: string; height?: string; limit?: number; offset?: number }) => {
    const sp = new URLSearchParams();
    if (params.q) sp.set('q', params.q);
    if (params.category) sp.set('category', params.category);
    if (params.length) sp.set('length', params.length);
    if (params.width) sp.set('width', params.width);
    if (params.height) sp.set('height', params.height);
    if (params.limit) sp.set('limit', String(params.limit));
    if (params.offset) sp.set('offset', String(params.offset));
    return `/artikelgruppen?${sp.toString()}`;
  };

  return (
    <>
      {/* Search & Filters Section */}
      <SearchFilters
        pageType="groups"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        allCategories={allCategories}
        selectedCategory={selectedCategory}
        length={length}
        setLength={setLength}
        width={width}
        setWidth={setWidth}
        height={height}
        setHeight={setHeight}
        buildUrl={buildSearchUrl}
        q={q}
        categoryName={categoryName}
        lengthParam={lengthParam}
        widthParam={widthParam}
        heightParam={heightParam}
        limit={limit}
        showDimensionFilters={true}
      />

      {/* Results Section */}
      <section className="py-12 bg-gray-50">
        <Container>
          {/* Results Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-emerald-600" />
              <h2 className="text-2xl font-bold break-words hyphens-auto" style={{ color: colors.darkGreen, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {selectedCategory ? selectedCategory.name : 'Alle Artikelgruppen'}
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
                <Link href="/artikelgruppen">
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

export default function GroupsPage() {
  return (
    <Suspense fallback={
      <Container>
        <div className="py-8">Loading...</div>
      </Container>
    }>
      <GroupsPageContent />
    </Suspense>
  );
}
