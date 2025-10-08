"use client";

import React from "react";
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type Category = {
    id: string;
    name: string;
    color: string;
    type: string;
    description?: string;
    groupCount: number;
    articleCount: number;
    media: string[];
};

type CategoryGridProps = {
    categories: Category[];
    maxItems?: number;
    showMoreButton?: boolean;
    loading?: boolean;
};

export function CategoryGrid({
    categories,
    maxItems,
    showMoreButton = false,
    loading = false
}: CategoryGridProps) {
    const displayCategories = maxItems ? categories.slice(0, maxItems) : categories;

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Kategorien werden geladen...</p>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Keine Kategorien verfügbar.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayCategories.map((category) => {
                    const firstImage = category.media?.[0];
                    const imageUrl = firstImage || null;

                    return (
                        <Link
                            key={category.id}
                            href={`/verpackungskategorien/${encodeURIComponent(category.name)}`}
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
                                        <h2 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors break-words hyphens-auto" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
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
                                            {category.type === 'Article'
                                                ? `${category.articleCount} ${category.articleCount === 1 ? 'Artikel' : 'Artikel'}`
                                                : `${category.groupCount} ${category.groupCount === 1 ? 'Produkt' : 'Produkte'}`
                                            }
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>

            {/* Show More Button */}
            {showMoreButton && maxItems && categories.length > maxItems && (
                <div className="text-center">
                    <Link href="/verpackungskategorien">
                        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                            Alle Verpackungskategorien anzeigen
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
