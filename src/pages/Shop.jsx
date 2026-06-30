import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useProducts } from '../hooks/useProducts.jsx';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, loading, fetchProducts } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  useEffect(() => {
    const categorySlug = searchParams.get('category');
    if (categorySlug) {
      const cat = categories.find(c => c.slug === categorySlug);
      if (cat) {
        setSelectedCategory(cat.id.toString());
      }
    }
  }, [searchParams, categories]);

  useEffect(() => {
    const filters = {};
    if (selectedCategory) {
      filters.category = parseInt(selectedCategory);
    }
    fetchProducts(filters);
  }, [selectedCategory, fetchProducts]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      const cat = categories.find(c => c.id.toString() === categoryId);
      if (cat) {
        setSearchParams({ category: cat.slug });
      }
    } else {
      setSearchParams({});
    }
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const filteredProducts = sortedProducts.filter(p => {
    return p.price >= priceRange[0] && p.price <= priceRange[1];
  });

  const currentCategory = categories.find(c => c.id.toString() === selectedCategory);

  return (
    <>
      <SEO
        title={currentCategory ? `${currentCategory.name} - Shop Ayurvedic Products` : 'Shop All Ayurvedic Products'}
        description={currentCategory ? currentCategory.description : 'Browse our complete collection of authentic Ayurvedic products. Natural hair care, skin care, wellness supplements, and essential oils.'}
      />

      {/* Page Header */}
      <div className="bg-primary pt-28 pb-12">
        <div className="section-padding text-center">
          <h1 className="heading-lg text-white mb-3">
            {currentCategory ? currentCategory.name : 'All Products'}
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-sm">
            {currentCategory ? currentCategory.description : 'Discover our complete collection of authentic Ayurvedic products, crafted with pure ingredients.'}
          </p>
        </div>
      </div>

      <div className="py-10 bg-warm min-h-screen">
        <div className="section-padding">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-56 flex-shrink-0 ${filterOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-sm">Filters</h3>
                  <button onClick={() => setFilterOpen(false)} className="lg:hidden">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Categories</h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${!selectedCategory ? 'bg-primary text-white' : 'hover:bg-warm'}`}
                    >
                      All Products
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id.toString())}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${selectedCategory === cat.id.toString() ? 'bg-primary text-white' : 'hover:bg-warm'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Price Range</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-text-muted">Rs. {priceRange[0]}</span>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="flex-1 accent-primary h-1"
                    />
                    <span className="text-xs text-text-muted">Rs. {priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm text-xs font-medium border border-gray-100"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </button>
                  <span className="text-text-muted text-xs">
                    {filteredProducts.length} products
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-white rounded-lg shadow-sm text-xs outline-none border border-gray-100"
                  >
                    <option value="default">Sort by: Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                  <div className="hidden sm:flex gap-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white border border-gray-100'}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white border border-gray-100'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <Filter className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <h3 className="font-bold text-text mb-1">No products found</h3>
                  <p className="text-text-muted text-sm">Try adjusting your filters or browse all products.</p>
                </div>
              ) : (
                <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
