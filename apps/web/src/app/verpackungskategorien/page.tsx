"use client";

import React, { useEffect, useState } from "react";
import Link from 'next/link';
import Container from "@/components/container";
import SectionTitle from "@/components/section-title";
import { CategoryGrid } from "@/components/category-grid";
import { Button } from "@/components/ui/button";

const API = process.env.NEXT_PUBLIC_API_BASE!;

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

export default function ProduktePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const r = await fetch(`${API}/api/categories`);
        if (r.ok) {
          const data = await r.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <>
      {/* Products Categories Section */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <SectionTitle 
              title="Verpackungskategorien" 
              kicker="Wählen Sie aus unseren spezialisierten Verpackungskategorien"
              center
            />
          </div>

          <CategoryGrid 
            categories={categories} 
            loading={loading}
          />
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Finden Sie nicht die passende Lösung?
            </h2>
            <p className="text-lg text-emerald-50 mb-8">
              Wir entwickeln gerne eine individuelle Verpackungslösung speziell für Ihre Anforderungen. 
              Kontaktieren Sie unser Expertenteam für eine kostenlose Beratung.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/unternehmen/kontakt">
                <Button size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Jetzt Kontakt aufnehmen
                </Button>
              </Link>
              <Link href="/leistungen/verpackungsentwicklung">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-emerald-600">
                  Individuelle Entwicklung
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
