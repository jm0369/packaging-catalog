'use client';

import { useState } from 'react';
import { ArticlesTable } from './articles-table';
import { Lightbox } from './lightbox';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { ChevronDown, ChevronUp, Package, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

type Category = {
  id: string;
  name: string;
  color: string;
};

type Group = {
  id: string;
  externalId: string;
  name: string;
  description?: string | null;
  media: string[];
  categories?: Category[];
};

type Article = {
  id: string;
  externalId: string;
  title: string;
  sku?: string | null;
  media?: string[];
  attributes?: Record<string, string> | null;
};

type GroupListProps = {
  groups: Group[];
  apiBase: string;
};

export function GroupList({ groups, apiBase }: GroupListProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [articlesCache, setArticlesCache] = useState<Record<string, Article[]>>({});
  const [loadingGroups, setLoadingGroups] = useState<Set<string>>(new Set());
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

  const toggleGroup = async (groupId: string, externalId: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    
    if (newExpandedGroups.has(groupId)) {
      // Collapse
      newExpandedGroups.delete(groupId);
      setExpandedGroups(newExpandedGroups);
    } else {
      // Expand
      newExpandedGroups.add(groupId);
      setExpandedGroups(newExpandedGroups);
      
      // Fetch articles if not cached
      if (!articlesCache[groupId]) {
        setLoadingGroups(new Set(loadingGroups).add(groupId));
        
        try {
          const sp = new URLSearchParams();
          sp.set('group', externalId);
          sp.set('limit', '100');
          const response = await fetch(`${apiBase}/api/articles?${sp.toString()}`);
          const data = await response.json();
          
          setArticlesCache({ ...articlesCache, [groupId]: data.data });
        } catch (error) {
          console.error('Failed to fetch articles:', error);
          setArticlesCache({ ...articlesCache, [groupId]: [] });
        } finally {
          const newLoadingGroups = new Set(loadingGroups);
          newLoadingGroups.delete(groupId);
          setLoadingGroups(newLoadingGroups);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {groups.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-16 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Keine Produktgruppen gefunden.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {groups.map((group) => {
            const isExpanded = expandedGroups.has(group.id);
            const isLoading = loadingGroups.has(group.id);
            const articles = articlesCache[group.id] || [];

            return (
              <Card key={group.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    {/* Image Section */}
                    {group.media && group.media.length > 0 ? (
                      <button
                        onClick={() => openLightbox(group.media, 0)}
                        className="relative w-full md:w-56 h-48 md:h-40 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group/image bg-gray-100"
                        aria-label="Bilder anzeigen"
                      >
                        <Image 
                          src={group.media[0]} 
                          alt={group.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 224px"
                          className="object-cover group-hover/image:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover/image:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                            <ExternalLink className="w-5 h-5 text-gray-900" />
                          </div>
                        </div>
                        {group.media.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                            +{group.media.length - 1}
                          </div>
                        )}
                      </button>
                    ) : (
                      <div className="w-full md:w-56 h-48 md:h-40 flex-shrink-0 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Content Section */}
                    <div className="flex-grow min-w-0 space-y-3">
                      <div>
                        <Link 
                          href={`/produktgruppen/${encodeURIComponent(group.externalId)}`}
                          className="text-2xl font-bold text-gray-900 hover:text-emerald-600 transition-colors inline-flex items-center gap-2 group/link"
                        >
                          {group.name}
                          <ExternalLink className="w-5 h-5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </Link>
                        <p className="text-sm text-gray-500 mt-1 font-mono">
                          Art.-Nr.: {group.externalId}
                        </p>
                      </div>

                      {group.categories && group.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {group.categories.map((category) => (
                            <span
                              key={category.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                              style={{ 
                                backgroundColor: category.color + '20',
                                borderColor: category.color,
                                borderWidth: '1px',
                                color: category.color 
                              }}
                            >
                              <span 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              {category.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {group.description && (
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                          {group.description}
                        </p>
                      )}

                      {/* Action Button */}
                      <div className="pt-2">
                        <Button
                          onClick={() => toggleGroup(group.id, group.externalId)}
                          variant="outline"
                          className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-2" />
                              Artikel ausblenden
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-2" />
                              Artikel anzeigen
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Articles Section */}
                  {isExpanded && (
                    <div className="border-t bg-gradient-to-b from-gray-50 to-white">
                      {isLoading ? (
                        <div className="text-center py-12">
                          <div className="inline-block w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
                          <p className="text-gray-500">Artikel werden geladen...</p>
                        </div>
                      ) : articles.length === 0 ? (
                        <div className="text-center py-12">
                          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">Keine Artikel verfügbar.</p>
                        </div>
                      ) : (
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              Verfügbare Artikel ({articles.length})
                            </h3>
                          </div>
                          <ArticlesTable articles={articles} />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {lightboxImages && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
}
