import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, Utensils } from 'lucide-react';
import { Product, ProductCategory, AllergenType } from '../types';
import { ProductCard } from './ProductCard';

interface MenuSectionProps {
  products: Product[];
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

const CATEGORIES: { id: ProductCategory | 'todos'; label: string }[] = [
  { id: 'todos', label: 'All Dishes' },
  { id: 'entradas', label: 'Starters' },
  { id: 'principales', label: 'Main Courses' },
  { id: 'postres', label: 'Desserts' },
  { id: 'bebidas', label: 'Beverages' },
];

export const MenuSection: React.FC<MenuSectionProps> = ({
  products,
  onOpenDetails,
  onQuickAdd,
  onCustomize,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGlutenFree, setFilterGlutenFree] = useState(false);
  const [filterDairyFree, setFilterDairyFree] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category match
      if (selectedCategory !== 'todos' && prod.category !== selectedCategory) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesDesc = prod.description.toLowerCase().includes(query);
        const matchesIng = prod.ingredients.some((i) => i.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }

      // Gluten-free filter
      if (filterGlutenFree && prod.allergens.includes('Gluten')) {
        return false;
      }

      // Dairy-free filter
      if (filterDairyFree && prod.allergens.includes('Lácteos')) {
        return false;
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery, filterGlutenFree, filterDairyFree]);

  return (
    <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-[#3F7A4D]/15 text-[#8ED09E] border border-[#3F7A4D]/30">
          <Utensils className="w-3.5 h-3.5" />
          <span>Our Culinary Selection</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-5xl text-[#F3EFE6]">
          OSO FUSIÓN <span className="gold-text-gradient">MENU</span>
        </h2>
        <p className="text-sm text-[#CFCBC0] font-light leading-relaxed">
          Every dish is freshly crafted to order, combining prime Colombian ingredients with ancestral Asian culinary techniques. You can customize house sauces and exclude ingredients according to your preference.
        </p>
      </div>

      {/* Categories & Search Controls */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#C59B4B] to-[#E5B869] text-[#111412] shadow-lg shadow-[#E5B869]/20'
                  : 'bg-[#181F1A] border border-white/5 text-[#CFCBC0] hover:text-white hover:border-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar & Dietary Filter Chips */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dish or ingredient..."
              className="w-full rounded-2xl bg-[#161D18] border border-white/10 px-4 py-2.5 pl-10 text-xs text-[#F3EFE6] placeholder-[#A6A298]/50 focus:border-[#E5B869] focus:outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-[#CFCBC0]/50 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-[#CFCBC0] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Dietary Filters */}
          <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
            <span className="text-xs text-[#CFCBC0]/60 hidden md:inline">Filter:</span>
            <button
              type="button"
              onClick={() => setFilterGlutenFree(!filterGlutenFree)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all whitespace-nowrap ${
                filterGlutenFree
                  ? 'bg-[#E5B869]/20 border-[#E5B869] text-[#E5B869]'
                  : 'bg-[#181F1A] border-white/10 text-[#CFCBC0] hover:border-white/25'
              }`}
            >
              🌾 Gluten-Free
            </button>
            <button
              type="button"
              onClick={() => setFilterDairyFree(!filterDairyFree)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all whitespace-nowrap ${
                filterDairyFree
                  ? 'bg-[#E5B869]/20 border-[#E5B869] text-[#E5B869]'
                  : 'bg-[#181F1A] border-white/10 text-[#CFCBC0] hover:border-white/25'
              }`}
            >
              🥛 Dairy-Free
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-[#161D18]/50 border border-white/5 space-y-3">
          <p className="font-display font-medium text-lg text-[#F3EFE6]">
            No dishes found matching your search criteria.
          </p>
          <p className="text-xs text-[#CFCBC0]/70 max-w-sm mx-auto">
            Try clearing filters or searching for terms like "Pork", "Gyozas", "Bowl", "Cheesecake", or "Coffee".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('todos');
              setFilterGlutenFree(false);
              setFilterDairyFree(false);
            }}
            className="mt-2 text-xs font-semibold text-[#E5B869] hover:underline"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetails={onOpenDetails}
              onQuickAdd={onQuickAdd}
              onCustomize={onCustomize}
            />
          ))}
        </div>
      )}
    </section>
  );
};
