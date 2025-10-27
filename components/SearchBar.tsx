'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface SearchFilters {
  searchTerm: string;
  categories: string[];
  tags: string[];
  showHidden: boolean;
  previewOnly: boolean;
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  availableCategories: string[];
  availableTags: string[];
}

export function SearchBar({ onSearch, availableCategories, availableTags }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showHidden, setShowHidden] = useState(false);
  const [previewOnly, setPreviewOnly] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('linkboard-search-history');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load search history', e);
      }
    }
  }, []);

  useEffect(() => {
    onSearch({
      searchTerm,
      categories: selectedCategories,
      tags: selectedTags,
      showHidden,
      previewOnly,
    });
  }, [searchTerm, selectedCategories, selectedTags, showHidden, previewOnly, onSearch]);

  const handleSearchSubmit = () => {
    if (searchTerm.trim() && !searchHistory.includes(searchTerm.trim())) {
      const newHistory = [searchTerm.trim(), ...searchHistory].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('linkboard-search-history', JSON.stringify(newHistory));
    }
    setShowHistory(false);
  };

  const handleHistorySelect = (term: string) => {
    setSearchTerm(term);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('linkboard-search-history');
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedTags.length > 0 ||
    showHidden ||
    previewOnly;

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedTags([]);
    setShowHidden(false);
    setPreviewOnly(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              } else if (e.key === 'Escape') {
                setSearchTerm('');
                searchInputRef.current?.blur();
              }
            }}
            placeholder="Search links by name, URL, or description..."
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}

          {showHistory && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs font-medium text-gray-500">Recent Searches</span>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              </div>
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleHistorySelect(term)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <MagnifyingGlassIcon className="w-4 h-4 inline mr-2 text-gray-400" />
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <FunnelIcon className="w-5 h-5" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {selectedCategories.length + selectedTags.length + (showHidden ? 1 : 0) + (previewOnly ? 1 : 0)}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Filters</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-auto py-1 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {availableCategories.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2">Categories</h5>
                  <div className="space-y-2">
                    {availableCategories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="text-sm cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availableTags.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2">Tags</h5>
                  <div className="space-y-2">
                    {availableTags.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => toggleTag(tag)}
                        />
                        <Label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h5 className="text-sm font-medium mb-2">Display Options</h5>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="show-hidden"
                      checked={showHidden}
                      onCheckedChange={(checked) => setShowHidden(!!checked)}
                    />
                    <Label htmlFor="show-hidden" className="text-sm cursor-pointer">
                      Show hidden links
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="preview-only"
                      checked={previewOnly}
                      onCheckedChange={(checked) => setPreviewOnly(!!checked)}
                    />
                    <Label htmlFor="preview-only" className="text-sm cursor-pointer">
                      Preview mode only
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
