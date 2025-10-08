"use client";

import React from "react";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Package, Filter, Ruler, X } from "lucide-react";
import { colors } from "@/lib/colors";
import Container from "./container";

type Category = {
    id: string;
    name: string;
    type: string;
    color: string;
};

type SearchFiltersProps = {
    // Page type determines which categories are primary and which are cross-links
    pageType: 'articles' | 'groups';

    // Current filter values
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    categories: Category[];
    allCategories: Category[];
    selectedCategory?: Category;

    // Dimension filters (only for articles page)
    length?: string;
    setLength?: (value: string) => void;
    width?: string;
    setWidth?: (value: string) => void;
    height?: string;
    setHeight?: (value: string) => void;

    // URL building function
    buildUrl: (params: {
        q?: string;
        category?: string;
        length?: string;
        width?: string;
        height?: string;
        limit?: number;
        offset?: number;
    }) => string;

    // Current URL params
    q?: string;
    categoryName?: string;
    lengthParam?: string;
    widthParam?: string;
    heightParam?: string;
    limit: number;

    // Show dimension filters
    showDimensionFilters?: boolean;
};

export function SearchFilters({
    pageType,
    searchQuery,
    setSearchQuery,
    categories,
    allCategories,
    selectedCategory,
    length,
    setLength,
    width,
    setWidth,
    height,
    setHeight,
    buildUrl,
    q,
    categoryName,
    lengthParam,
    widthParam,
    heightParam,
    limit,
    showDimensionFilters = false,
}: SearchFiltersProps) {
    const hasDimensionFilter = lengthParam || widthParam || heightParam;
    const hasAnyFilter = q || categoryName || hasDimensionFilter;

    const baseUrl = pageType === 'articles' ? '/artikel' : '/artikelgruppen';
    const allButtonText = pageType === 'articles' ? 'Alle' : 'Alle Produkte';
    const pageTitle = pageType === 'articles' ? 'Artikel durchsuchen' : 'Artikelgruppen durchsuchen';
    const pageDescription = pageType === 'articles'
        ? 'Finden Sie genau den Artikel, den Sie benötigen – durchsuchen Sie unser komplettes Sortiment.'
        : 'Entdecken Sie unsere Produktgruppen und finden Sie die passende Verpackungslösung.';

    // Determine which categories are cross-links
    const crossLinkCategories = allCategories.filter(c =>
        pageType === 'articles' ? c.type === 'Group' : c.type === 'Article'
    );
    const crossLinkUrl = pageType === 'articles' ? '/artikelgruppen' : '/artikel';

    return (
        <section className="relative bg-gradient-to-br from-emerald-50 to-white py-12 border-b">
            <Container>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Package className="w-8 h-8 text-emerald-600" />
                            <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: colors.darkGreen }}>
                                {pageTitle}
                            </h1>
                        </div>
                        <p className="text-foreground/70">
                            {pageDescription}
                        </p>
                    </div>

                    {/* Search & Filters Card */}
                    <Card className="border-0 shadow-xl">
                        <CardContent className="p-6">
                            <form action={baseUrl} method="get" className="space-y-6">
                                {/* Search and Dimension Filters Row */}
                                <div className={`items-end grid grid-cols-1 ${showDimensionFilters ? 'lg:grid-cols-3' : ''} gap-6`}>
                                    {/* Text Search */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <Search className="w-4 h-4" />
                                            Textsuche
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                name="q"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Titel, SKU oder EAN..."
                                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                            />
                                            <input type="hidden" name="limit" value={String(limit)} />

                                        </div>
                                    </div>

                                    {/* Dimension Filters - Only show on articles page or when explicitly enabled */}
                                    {showDimensionFilters && setLength && setWidth && setHeight && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Ruler className="w-4 h-4" />
                                                {pageType === 'groups' ? (
                                                    <span>
                                                        Maßfilter (mm) –{' '}
                                                        <Link href="/artikel" className="text-emerald-600 hover:underline">
                                                            zu Artikeln wechseln
                                                        </Link>
                                                    </span>
                                                ) : (
                                                    'Maßfilter (mm) – findet passende Verpackungen'
                                                )}
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    id="length"
                                                    name="length"
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={length}
                                                    onChange={(e) => setLength(e.target.value)}
                                                    placeholder="Länge"
                                                    className="min-w-0 flex-1 px-2 sm:px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                                />
                                                <input
                                                    id="width"
                                                    name="width"
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={width}
                                                    onChange={(e) => setWidth(e.target.value)}
                                                    placeholder="Breite"
                                                    className="min-w-0 flex-1 px-2 sm:px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                                />
                                                <input
                                                    id="height"
                                                    name="height"
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={height}
                                                    onChange={(e) => setHeight(e.target.value)}
                                                    placeholder="Höhe"
                                                    className="min-w-0 flex-1 px-2 sm:px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                                                />

                                            </div>
                                        </div>
                                    )}
                                    <Button type="submit" size="default" className="bg-emerald-600 hover:bg-emerald-700">
                                        Suchen
                                    </Button>
                                </div>

                                {/* Category Filters */}
                                <div className="border-t pt-4 space-y-3">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Filter className="w-4 h-4" />
                                        Kategorien
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            href={baseUrl}
                                            className={`px-4 py-1.5 rounded-full border text-xs font-medium transition-all ${!categoryName
                                                ? 'bg-emerald-600 text-white border-emerald-600'
                                                : 'border-gray-300 hover:border-emerald-600 hover:bg-emerald-50'
                                                }`}
                                        >
                                            {allButtonText}
                                        </Link>

                                        {/* Primary Categories (current page) */}
                                        {categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={buildUrl({ q, category: category.name, length: lengthParam, width: widthParam, height: heightParam, limit })}
                                                className={`px-4 py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-1.5 ${categoryName === category.name ? 'text-white' : 'hover:shadow-sm'
                                                    }`}
                                                style={{
                                                    backgroundColor: categoryName === category.name ? category.color : 'white',
                                                    borderColor: category.color,
                                                    color: categoryName === category.name ? 'white' : '#374151',
                                                }}
                                            >
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: categoryName === category.name ? 'white' : category.color }}
                                                />
                                                {category.name}
                                            </Link>
                                        ))}

                                        {/* Cross-link Categories */}
                                        {crossLinkCategories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`${crossLinkUrl}?category=${encodeURIComponent(category.name)}`}
                                                className="px-4 py-1.5 rounded-full border text-xs font-medium hover:shadow-sm transition-all flex items-center gap-1.5 opacity-60 hover:opacity-100"
                                                style={{
                                                    backgroundColor: 'white',
                                                    borderColor: category.color,
                                                    color: '#374151',
                                                }}
                                            >
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                />
                                                {category.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Filters */}
                                {hasAnyFilter && (
                                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
                                        <span className="text-xs font-medium text-gray-500">Aktiv:</span>
                                        {q && (
                                            <Link
                                                href={buildUrl({ category: categoryName, length: lengthParam, width: widthParam, height: heightParam, limit })}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                                            >
                                                &quot;{q}&quot;
                                                <X className="w-3 h-3" />
                                            </Link>
                                        )}
                                        {selectedCategory && (
                                            <Link
                                                href={buildUrl({ q, length: lengthParam, width: widthParam, height: heightParam, limit })}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                                            >
                                                {selectedCategory.name}
                                                <X className="w-3 h-3" />
                                            </Link>
                                        )}
                                        {hasDimensionFilter && (
                                            <Link
                                                href={pageType === 'groups'
                                                    ? `/artikel?${new URLSearchParams({
                                                        ...(lengthParam && { length: lengthParam }),
                                                        ...(widthParam && { width: widthParam }),
                                                        ...(heightParam && { height: heightParam }),
                                                    }).toString()}`
                                                    : buildUrl({ q, category: categoryName, limit })
                                                }
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 hover:bg-emerald-200 transition-colors"
                                            >
                                                {lengthParam || '?'}×{widthParam || '?'}×{heightParam || '?'} mm
                                                <X className="w-3 h-3" />
                                            </Link>
                                        )}
                                        <Link
                                            href={baseUrl}
                                            className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
                                        >
                                            Alle zurücksetzen
                                        </Link>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </section>
    );
}
