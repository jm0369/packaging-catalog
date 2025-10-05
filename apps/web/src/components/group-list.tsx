'use client';

import { useState } from 'react';
import { ArticlesTable } from './articles-table';
import { Lightbox } from './lightbox';
import Link from 'next/link';
import Image from 'next/image';

type Group = {
  id: string;
  externalId: string;
  name: string;
  description?: string | null;
  media: string[];
  articles?: Article[];
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

  const toggleGroup = async (groupId: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    
    if (newExpandedGroups.has(groupId)) {
      // Collapse
      newExpandedGroups.delete(groupId);
    } else {
      // Expand
      newExpandedGroups.add(groupId);
    }
    setExpandedGroups(newExpandedGroups);
  };

  return (
    <div className="space-y-4">
      {groups.length === 0 ? (
        <p className="text-gray-500">No groups found.</p>
      ) : (
        <ul className="space-y-4">
          {groups.map((group) => {
            const isExpanded = expandedGroups.has(group.id);
            const articles = group.articles || [];
            
            return (
              <li key={group.id} className="border rounded overflow-hidden">
                <div className="flex items-center gap-4 p-4 hover:bg-gray-50">
                  {group.media && group.media.length > 0 ? (
                    <button
                      onClick={() => openLightbox(group.media, 0)}
                      className="relative w-44 h-33 flex-shrink-0 rounded overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      aria-label="View images"
                    >
                      <Image 
                        src={group.media[0]} 
                        alt={group.name}
                        fill
                        sizes="176px"
                        className="object-cover"
                      />
                    </button>
                  ) : (
                    <div className="w-44 h-33 flex-shrink-0 rounded bg-gray-100" />
                  )}
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/groups/${encodeURIComponent(group.externalId)}`}
                        className="text-xl font-semibold hover:underline"
                      >
                        {group.externalId}
                      </Link>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {group.name}
                    </p>
                    
                  </div>

                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="flex-shrink-0 px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
                    aria-label={isExpanded ? 'Collapse articles' : 'Expand articles'}
                  >
                    {isExpanded ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4">
                    <ArticlesTable articles={articles} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
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
