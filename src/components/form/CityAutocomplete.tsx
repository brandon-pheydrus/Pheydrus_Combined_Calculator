/**
 * CityAutocomplete Component
 * City search input with dropdown suggestions
 */

import { useRef, useEffect } from 'react';
import type { CityData } from '../../models/form';
import { useLocationAutocomplete } from '../../hooks/useLocationAutocomplete';

interface CityAutocompleteProps {
  value: CityData | null;
  onChange: (city: CityData) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

export function CityAutocomplete({
  value,
  onChange,
  placeholder = 'Search city...',
  label = 'City',
  error,
}: CityAutocompleteProps) {
  const { query, suggestions, isLoading, isOpen, handleQueryChange, handleSelectCity, close } =
    useLocationAutocomplete();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        close();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  const handleSelect = (city: CityData) => {
    handleSelectCity(city);
    onChange(city);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value ? value.name : query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => handleQueryChange(query || '')}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-64 overflow-y-auto shadow-lg"
          >
            {isLoading && (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                Loading cities...
              </div>
            )}

            {!isLoading && suggestions.length === 0 && query && (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                No cities found
              </div>
            )}

            {suggestions.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => handleSelect(city)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm transition-colors"
              >
                <div className="font-medium">{city.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {city.country} {city.admin1 ? `• ${city.admin1}` : ''}{' '}
                  {city.population ? `• ${city.population.toLocaleString()}` : ''}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
