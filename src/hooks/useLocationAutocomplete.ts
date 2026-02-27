/**
 * useLocationAutocomplete Hook
 * Manages city autocomplete search with lazy loading
 */

import { useState, useCallback } from 'react';
import type { CityData } from '../models/form';

let citiesCache: CityData[] | null = null;
let citiesCachePromise: Promise<CityData[]> | null = null;

/**
 * Load cities data from file
 */
async function loadCities(): Promise<CityData[]> {
  if (citiesCache) return citiesCache;
  if (citiesCachePromise) return citiesCachePromise;

  citiesCachePromise = (async () => {
    try {
      const response = await fetch('/cities.generated.json');
      if (!response.ok) throw new Error('Failed to load cities data');
      const rawData = await response.json();
      // Transform lat/lon to latitude/longitude to match CityData interface
      const data = rawData.map((city: Record<string, unknown>) => transformCityData(city));
      citiesCache = data;
      citiesCachePromise = null;
      return data;
    } catch (error) {
      console.error('Failed to load cities data:', error);
      citiesCachePromise = null;
      return [];
    }
  })();

  return citiesCachePromise;
}

/**
 * Transform city data from JSON format (lat/lon) to CityData format (latitude/longitude)
 */
function transformCityData(city: Record<string, unknown>): CityData {
  return {
    id: String(city.id ?? ''),
    name: String(city.name ?? ''),
    country: String(city.country ?? ''),
    latitude: Number(city.latitude ?? city.lat ?? 0),
    longitude: Number(city.longitude ?? city.lon ?? 0),
    timeZone: String(city.timeZone ?? ''),
    admin1: city.admin1 != null ? String(city.admin1) : undefined,
    population: city.population != null ? Number(city.population) : undefined,
  };
}

/**
 * Normalize string for searching (remove diacritics)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
}

/**
 * Filter and sort cities based on query
 */
function filterCities(cities: CityData[], query: string): CityData[] {
  if (!query || query.length < 1) return [];

  const normalizedQuery = normalizeString(query);

  const filtered = cities
    .filter((city) => {
      const normalizedName = normalizeString(city.name);
      const normalizedCountry = normalizeString(city.country);
      return (
        normalizedName.includes(normalizedQuery) || normalizedCountry.includes(normalizedQuery)
      );
    })
    .sort((a, b) => {
      const normalizedAName = normalizeString(a.name);
      const normalizedBName = normalizeString(b.name);

      // Prefer exact prefix matches
      const aStarts = normalizedAName.startsWith(normalizedQuery);
      const bStarts = normalizedBName.startsWith(normalizedQuery);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // Then sort by population (if available)
      if (a.population && b.population) {
        return b.population - a.population;
      }

      // Default alphabetical
      return a.name.localeCompare(b.name);
    })
    .slice(0, 50); // Limit to 50 results

  return filtered;
}

export function useLocationAutocomplete() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Handle query change
   */
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setIsOpen(true);

    if (!newQuery || newQuery.length < 1) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    loadCities().then((cities) => {
      const filtered = filterCities(cities, newQuery);
      setSuggestions(filtered);
      setIsLoading(false);
    });
  }, []);

  /**
   * Handle city selection
   */
  const handleSelectCity = useCallback((city: CityData) => {
    setQuery(city.name);
    setIsOpen(false);
    setSuggestions([]);
    return city;
  }, []);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  }, []);

  /**
   * Close suggestions
   */
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Open suggestions
   */
  const open = useCallback(() => {
    if (query) {
      setIsOpen(true);
    }
  }, [query]);

  return {
    query,
    suggestions,
    isLoading,
    isOpen,
    handleQueryChange,
    handleSelectCity,
    clearSearch,
    close,
    open,
  };
}
