"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Search, MapPin, Map, Loader2, Navigation } from 'lucide-react';
import { useLocationSearch, LocationSearchResult } from '@/hooks/useLocationSearch';

interface LocationSearchBarProps {
  onLocationSelect?: (location: LocationSearchResult) => void;
  placeholder?: string;
  className?: string;
}

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({ 
  onLocationSelect, 
  placeholder = "Search by area, pincode, or shortcut (e.g. 'KP')...",
  className = ""
}) => {
  const { query, setQuery, results, isLoading, error } = useLocationSearch(300);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (location: LocationSearchResult) => {
    // Fill the input with the beautiful name
    setQuery(`${location.name}, ${location.city.name}`);
    setIsOpen(false);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* Search Input Container */}
      <div className="relative flex items-center w-full group">
        <div className="absolute left-4 text-gray-400 group-focus-within:text-blue-500 transition-colors">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 text-lg bg-white border-2 border-gray-100 rounded-2xl shadow-sm outline-none transition-all duration-300 focus:border-blue-500 focus:shadow-[0_8px_30px_rgb(59,130,246,0.12)] text-gray-800 placeholder:text-gray-400"
          autoComplete="off"
        />
        
        {/* Optional Action Button */}
        <button 
          className="absolute right-3 p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center"
          title="Use current location"
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Results Dropdown */}
      {isOpen && query.length > 1 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 transform origin-top animate-in fade-in slide-in-from-top-2 duration-200">
          
          {isLoading && results.length === 0 && (
            <div className="p-6 text-center text-gray-500 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <p>Searching locations...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="p-4 text-center text-red-500 bg-red-50">
              Oops! Something went wrong while searching.
            </div>
          )}

          {!isLoading && !error && results.length === 0 && query.length >= 2 && (
            <div className="p-6 text-center text-gray-500">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-gray-300" />
              <p>No locations found for "<span className="font-medium text-gray-700">{query}</span>"</p>
              <p className="text-sm mt-1">Try a different area, pincode, or city.</p>
            </div>
          )}

          {results.length > 0 && (
            <ul className="max-h-[360px] overflow-y-auto overscroll-contain py-2">
              {results.map((result) => (
                <li key={result.id}>
                  <button
                    onClick={() => handleSelect(result)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50/50 transition-colors flex items-start gap-3 group"
                  >
                    <div className="mt-1 p-2 bg-gray-50 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors text-gray-400">
                      {result.matchType === 'pincode' ? (
                        <Map className="w-4 h-4" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800 text-base">
                          {result.name}
                        </span>
                        {result.matchType === 'alias' && result.matchedAlias && (
                          <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                            Matches "{result.matchedAlias}"
                          </span>
                        )}
                        {result.matchType === 'pincode' && (
                          <span className="text-xs font-medium px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                            {result.pincode}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                        <span>{result.city.name}</span>
                        <span className="text-gray-300">•</span>
                        <span>{result.state.name}</span>
                        {result.matchType !== 'pincode' && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span>{result.pincode}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
