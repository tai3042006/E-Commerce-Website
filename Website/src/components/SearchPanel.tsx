import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/clofit/ProductCard';
import { useNavigate } from "react-router-dom";

export const SearchPanel = ({ onCloseSearch }: { onCloseSearch: () => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Mock data for trending, recent, etc.
  const trendingSearches = ['nike air max', 'adidas ultraboost', 'puma suede', 'new balance 990'];
  const recentSearches = ['hoodie', 'tee', 'shoes'];
  const popularCategories = ['Hoodies', 'Tees', 'Shoes', 'Accessories'];
  const recommendedCollections = ['Spring Drop', 'Summer Essentials', 'Athleisure'];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        onCloseSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCloseSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(value.toLowerCase()) ||
      product.category.toLowerCase().includes(value.toLowerCase()) ||
      product.tagline.toLowerCase().includes(value.toLowerCase())
    );

    setResults(filtered.slice(0, 8)); // Limit to 8 results
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (e.target instanceof HTMLElement && !e.target.closest('.search-panel-content')) {
      setIsOpen(false);
      onCloseSearch();
    }
  }, [onCloseSearch]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, handleClickOutside]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl p-6">
        <div className="relative">
          <button
            onClick={() => {
              setIsOpen(false);
              onCloseSearch();
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="search-panel-content">
            <div className="mb-8">
              <label htmlFor="search-input" className="sr-only">Search products</label>
              <input
                ref={inputRef}
                type="text"
                id="search-input"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search for products, brands, and more..."
                className="w-full pl-12 pr-4 py-3 text-lg bg-white/10 backdrop-blur rounded-xl border border-white/20 focus:outline-none focus:border-white/50 text-white placeholder-gray-400"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>

            {/* Trending Searches */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Trending searches</h3>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      handleSearchChange({ target: { value: term } } as unknown as React.ChangeEvent<HTMLInputElement>);
                    }}
                    className="px-3 py-1.5 text-sm bg-white/10 backdrop-blur rounded hover:bg-white/20 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Recent searches</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      handleSearchChange({ target: { value: term } } as unknown as React.ChangeEvent<HTMLInputElement>);
                    }}
                    className="px-3 py-1.5 text-sm bg-white/10 backdrop-blur rounded hover:bg-white/20 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Popular categories</h3>
              <div className="grid grid-cols-2 gap-3">
                {popularCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setQuery(category.toLowerCase());
                      handleSearchChange({ target: { value: category.toLowerCase() } } as unknown as React.ChangeEvent<HTMLInputElement>);
                      navigate(`/shop?category=${category.toLowerCase()}`);
                      setIsOpen(false);
                      onCloseSearch();
                    }}
                    className="flex items-center px-4 py-3 bg-white/10 backdrop-blur rounded hover:bg-white/20 transition-colors"
                  >
                    <span className="mr-3">{category}</span>
                    <span className="ml-auto text-sm text-gray-400">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Products */}
            {query.length > 0 && (
              <>
                <h3 className="text-sm font-medium text-gray-400 mb-4">
                  Suggested products ({results.length})
                </h3>
                <div className="grid gap-4">
                  {results.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      className="hover:scale-[1.02] transition-transform"
                    />
                  ))}
                </div>
              </>
            )}

            {/* Recommended Collections */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Recommended collections</h3>
              <div className="flex flex-wrap gap-3">
                {recommendedCollections.map(collection => (
                  <button
                    key={collection}
                    onClick={() => {
                      navigate('/shop');
                      setIsOpen(false);
                      onCloseSearch();
                    }}
                    className="px-4 py-3 bg-white/10 backdrop-blur rounded hover:bg-white/20 transition-colors"
                  >
                    {collection}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};