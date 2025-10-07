'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lightbox } from './lightbox';
import { Card, CardContent } from './ui/card';
import { ExternalLink, Package, Ruler, Box, Layers, Tag } from 'lucide-react';
import Image from 'next/image';

type Category = {
  id: string;
  name: string;
  color: string;
  type: string;
};

type Article = {
  externalId: string;
  title: string;
  sku?: string | null;
  media?: string[];
  categories?: Category[];
  attributes?: {
    _INNENLAENGE?: string;
    _INNENBREITE?: string;
    _INNENHOEHE?: string;
    _AUSSENLAENGE?: string;
    _AUSSENBREITE?: string;
    _AUSSENHOEHE?: string;
    Gewicht?: string;
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
};

type ArticlesTableProps = {
  articles: Article[];
};

export function ArticlesTable({ articles }: ArticlesTableProps) {
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

  if (articles.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardContent className="py-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Keine Artikel gefunden.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Desktop View - Table */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-emerald-50 to-emerald-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">Bild</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider" colSpan={2}>Artikel</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider" colSpan={3}>Maße (mm)</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider" colSpan={3}>VPE</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider" colSpan={2}>Palette</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-emerald-900 uppercase tracking-wider">Kategorien</th>
              </tr>
              <tr className="bg-emerald-50/50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600"></th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Titel</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">SKU</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Innen</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Außen</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Gewicht</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Menge</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Art</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Maß</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Menge</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Außenmaß</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => {
                const allImages = article.media || [];
                const imageUrl = allImages[0] || null;
                
                return (
                  <tr key={article.externalId} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-4 py-3">
                      {imageUrl ? (
                        <button
                          onClick={() => openLightbox(allImages, 0)}
                          className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer group bg-gray-100"
                          aria-label="Bild anzeigen"
                        >
                          <Image 
                            src={imageUrl} 
                            alt={article.title}
                            fill
                            sizes="80px"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <ExternalLink className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          {allImages.length > 1 && (
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                              +{allImages.length - 1}
                            </div>
                          )}
                        </button>
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link 
                        href={`/artikel/${encodeURIComponent(article.externalId)}`}
                        className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline inline-flex items-center gap-1 group"
                      >
                        {article.title}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{article.sku || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono whitespace-nowrap">
                      {article.attributes?._INNENLAENGE || '—'} × {article.attributes?._INNENBREITE || '—'} × {article.attributes?._INNENHOEHE || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono whitespace-nowrap">
                      {article.attributes?._AUSSENLAENGE || '—'} × {article.attributes?._AUSSENBREITE || '—'} × {article.attributes?._AUSSENHOEHE || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{article.attributes?.Gewicht || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{article.attributes?._VE2UEBERVERMENGE || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{article.attributes?._VE2UEBERVERPART || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono whitespace-nowrap">
                      {article.attributes?._VE2UEBERVERPLAENGE || '—'} × {article.attributes?._VE2UEBERVERPBREITE || '—'} × {article.attributes?._VE2UEBERVERPHOEHE || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{article.attributes?._VE3VERPACKUNGMENGE || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono whitespace-nowrap">
                      {article.attributes?._VE3PALETTENLAENGE || '—'} × {article.attributes?._VE3PALETTENBREITE || '—'} × {article.attributes?._VE3PALETTENHOEHE || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {article.categories && article.categories.length > 0 ? (
                          article.categories.map((category) => (
                            <Link
                              key={category.id}
                              href={category.type === 'Article' 
                                ? `/artikel?category=${encodeURIComponent(category.name)}`
                                : `/artikelgruppen?category=${encodeURIComponent(category.name)}`
                              }
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all hover:scale-105 hover:shadow-md"
                              style={{ 
                                backgroundColor: category.color,
                                color: 'white'
                              }}
                              title={`Filter nach ${category.name}`}
                            >
                              {category.name}
                            </Link>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet View - Cards */}
      <div className="lg:hidden space-y-4">
        {articles.map((article) => {
          const allImages = article.media || [];
          const imageUrl = allImages[0] || null;
          
          return (
            <Card key={article.externalId} className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  {/* Image */}
                  {imageUrl ? (
                    <button
                      onClick={() => openLightbox(allImages, 0)}
                      className="relative w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group bg-gray-100"
                      aria-label="Bild anzeigen"
                    >
                      <Image 
                        src={imageUrl} 
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 128px"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      {allImages.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          +{allImages.length - 1}
                        </div>
                      )}
                    </button>
                  ) : (
                    <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-grow space-y-3">
                    <div>
                      <Link 
                        href={`/articles/${encodeURIComponent(article.externalId)}`}
                        className="text-lg font-bold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-2 group"
                      >
                        {article.title}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      {article.sku && (
                        <p className="text-sm text-gray-500 mt-1 font-mono">
                          SKU: {article.sku}
                        </p>
                      )}
                    </div>

                    {/* Categories */}
                    {article.categories && article.categories.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Tag className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm flex-1">
                          <span className="font-medium text-gray-700 block mb-1.5">Kategorien:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {article.categories.map((category) => (
                              <Link
                                key={category.id}
                                href={category.type === 'Article' 
                                  ? `/artikel?category=${encodeURIComponent(category.name)}`
                                  : `/artikelgruppen?category=${encodeURIComponent(category.name)}`
                                }
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all hover:scale-105 hover:shadow-md"
                                style={{ 
                                  backgroundColor: category.color,
                                  color: 'white'
                                }}
                                title={`Filter nach ${category.name}`}
                              >
                                {category.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Specifications */}
                    <div className="space-y-2">
                      {/* Dimensions */}
                      {(article.attributes?._INNENLAENGE || article.attributes?._AUSSENLAENGE || article.attributes?.Gewicht) && (
                        <div className="flex items-start gap-2">
                          <Ruler className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Maße:</span>
                            <div className="text-gray-600 space-y-1 mt-1">
                              {article.attributes?._INNENLAENGE && (
                                <div className="font-mono text-xs">
                                  Innen: {article.attributes._INNENLAENGE} × {article.attributes._INNENBREITE} × {article.attributes._INNENHOEHE} mm
                                </div>
                              )}
                              {article.attributes?._AUSSENLAENGE && (
                                <div className="font-mono text-xs">
                                  Außen: {article.attributes._AUSSENLAENGE} × {article.attributes._AUSSENBREITE} × {article.attributes._AUSSENHOEHE} mm
                                </div>
                              )}
                              {article.attributes?.Gewicht && (
                                <div className="text-xs">
                                  Gewicht: {article.attributes.Gewicht} g
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Packaging Unit */}
                      {(article.attributes?._VE2UEBERVERMENGE || article.attributes?._VE2UEBERVERPART) && (
                        <div className="flex items-start gap-2">
                          <Box className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">VPE:</span>
                            <div className="text-gray-600 space-y-1 mt-1">
                              {article.attributes?._VE2UEBERVERMENGE && (
                                <div className="text-xs">Menge: {article.attributes._VE2UEBERVERMENGE}</div>
                              )}
                              {article.attributes?._VE2UEBERVERPART && (
                                <div className="text-xs">Art: {article.attributes._VE2UEBERVERPART}</div>
                              )}
                              {article.attributes?._VE2UEBERVERPLAENGE && (
                                <div className="font-mono text-xs">
                                  Maß: {article.attributes._VE2UEBERVERPLAENGE} × {article.attributes._VE2UEBERVERPBREITE} × {article.attributes._VE2UEBERVERPHOEHE} mm
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Pallet */}
                      {(article.attributes?._VE3VERPACKUNGMENGE || article.attributes?._VE3PALETTENLAENGE) && (
                        <div className="flex items-start gap-2">
                          <Layers className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <span className="font-medium text-gray-700">Palette:</span>
                            <div className="text-gray-600 space-y-1 mt-1">
                              {article.attributes?._VE3VERPACKUNGMENGE && (
                                <div className="text-xs">Menge: {article.attributes._VE3VERPACKUNGMENGE}</div>
                              )}
                              {article.attributes?._VE3PALETTENLAENGE && (
                                <div className="font-mono text-xs">
                                  Außenmaß: {article.attributes._VE3PALETTENLAENGE} × {article.attributes._VE3PALETTENBREITE} × {article.attributes._VE3PALETTENHOEHE} mm
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {lightboxImages && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
