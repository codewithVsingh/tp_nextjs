import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LocationSearchResult {
  id: number;
  name: string;
  slug: string;
  pincode: string;
  city: {
    id: number;
    name: string;
    slug: string;
  };
  state: {
    id: number;
    name: string;
    slug: string;
  };
  matchedAlias?: string;
  // Type of match to help UI (e.g., highlight if it matched a pincode or alias)
  matchType: 'name' | 'pincode' | 'alias';
}

export function useLocationSearch(debounceMs: number = 300) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Debounce the input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Perform the search
  useEffect(() => {
    async function performSearch() {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Strip quotes to prevent breaking PostgREST double-quote escaping
        const safeQuery = debouncedQuery.replace(/"/g, '');
        const searchTerm = `%${safeQuery}%`;

        // 1. Search direct areas by name or pincode
        // Use double quotes around values in .or() to prevent commas from breaking the logic tree
        const { data: areasData, error: areasError } = await supabase
          .from('areas')
          .select(`
            id,
            name,
            slug,
            pincode,
            cities (
              id,
              name,
              slug,
              states (
                id,
                name,
                slug
              )
            )
          `)
          .or(`name.ilike."${searchTerm}",pincode.ilike."${searchTerm}"`)
          .limit(10);

        if (areasError) throw areasError;

        // 2. Search aliases (high-intent shortcuts like 'KP' or 'SoBo')
        const { data: aliasesData, error: aliasesError } = await supabase
          .from('location_aliases')
          .select(`
            alias,
            areas (
              id,
              name,
              slug,
              pincode,
              cities (
                id,
                name,
                slug,
                states (
                  id,
                  name,
                  slug
                )
              )
            )
          `)
          .ilike('alias', searchTerm)
          .limit(5);

        if (aliasesError) throw aliasesError;

        // 3. Consolidate, format, and deduplicate results
        const consolidatedMap = new Map<number, LocationSearchResult>();

        // Process direct area matches
        (areasData || []).forEach((area: any) => {
          if (!area.cities || !area.cities.states) return;
          
          const isPincodeMatch = area.pincode.includes(debouncedQuery);
          
          consolidatedMap.set(area.id, {
            id: area.id,
            name: area.name,
            slug: area.slug,
            pincode: area.pincode,
            city: area.cities,
            state: area.cities.states,
            matchType: isPincodeMatch ? 'pincode' : 'name'
          });
        });

        // Process alias matches (these usually have high intent, so they can overwrite or merge)
        (aliasesData || []).forEach((aliasMatch: any) => {
          const area = aliasMatch.areas;
          if (!area || !area.cities || !area.cities.states) return;

          // If we already found this area via direct search, we can just update the matchType if desired,
          // but usually, alias matches are very specific so we want to feature them.
          if (!consolidatedMap.has(area.id)) {
            consolidatedMap.set(area.id, {
              id: area.id,
              name: area.name,
              slug: area.slug,
              pincode: area.pincode,
              city: area.cities,
              state: area.cities.states,
              matchedAlias: aliasMatch.alias,
              matchType: 'alias'
            });
          } else {
             // If it exists, let's just add the matched alias info
             const existing = consolidatedMap.get(area.id)!;
             existing.matchedAlias = aliasMatch.alias;
             consolidatedMap.set(area.id, existing);
          }
        });

        // Convert map to array and sort (optional: could prioritize alias matches or exact matches)
        const finalResults = Array.from(consolidatedMap.values()).sort((a, b) => {
           // Simple prioritization: Aliases first, then exact name starts, then the rest
           if (a.matchType === 'alias' && b.matchType !== 'alias') return -1;
           if (b.matchType === 'alias' && a.matchType !== 'alias') return 1;
           return a.name.localeCompare(b.name);
        });

        setResults(finalResults.slice(0, 10)); // Keep it UI friendly (max 10 results)

      } catch (err: any) {
        console.error("Location search error:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error
  };
}
