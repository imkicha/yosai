import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal, X, LayoutGrid, Rows3, Search, PackageOpen,
  Sparkles, TrendingUp, ArrowDownWideNarrow, ArrowUpWideNarrow, Clock,
} from "lucide-react";

const SORT_OPTIONS = [
  { value: "default", label: "Featured", icon: Sparkles },
  { value: "newest", label: "New In", icon: Clock },
  { value: "price-low", label: "Price: Low", icon: ArrowUpWideNarrow },
  { value: "price-high", label: "Price: High", icon: ArrowDownWideNarrow },
  { value: "popular", label: "Popular", icon: TrendingUp },
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredCategory, setFilteredCategory] = useState(searchParams.get("category") || "All");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [openFilter, setOpenFilter] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const catScrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);
        setProducts(Array.isArray(productsRes) ? productsRes : productsRes.data || []);
        setCategories(Array.isArray(categoriesRes) ? categoriesRes : categoriesRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setFilteredCategory(cat);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => filteredCategory === "All" || p.category?._id === filteredCategory || p.category === filteredCategory)
      .filter(p => {
        const price = p.variants?.[0]?.price ?? p.price ?? 0;
        return price >= priceRange[0] && price <= priceRange[1];
      })
      .filter(p => !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        const aP = a.variants?.[0]?.price ?? a.price ?? 0;
        const bP = b.variants?.[0]?.price ?? b.price ?? 0;
        if (sortBy === "price-low") return aP - bP;
        if (sortBy === "price-high") return bP - aP;
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "popular") return (b.reviewCount || 0) - (a.reviewCount || 0);
        return 0;
      });
  }, [products, filteredCategory, priceRange, sortBy, searchQuery]);

  const activeFilters = (filteredCategory !== "All" ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0) + (searchQuery ? 1 : 0);

  const clearAll = () => {
    setFilteredCategory("All");
    setPriceRange([0, 10000]);
    setSortBy("default");
    setSearchQuery("");
  };

  const activeCatName = filteredCategory === "All"
    ? null
    : categories.find(c => c._id === filteredCategory)?.name || filteredCategory;

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* ===== HERO BANNER ===== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 -mt-16 pt-16 sm:-mt-24 sm:pt-24">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="absolute top-0 right-0 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 sm:w-52 lg:w-64 h-40 sm:h-52 lg:h-64 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <div className="h-px flex-1 max-w-[30px] sm:max-w-[40px] bg-gradient-to-r from-pink-500 to-transparent" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-pink-400 font-medium">Shop Collection</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
              {activeCatName || "Explore Our Store"}
            </h1>
            <p className="text-gray-400 text-[11px] sm:text-sm max-w-md">
              Discover handpicked styles crafted for every occasion
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mt-3 sm:mt-4 max-w-lg"
          >
            <div className={`relative transition-all duration-300 ${searchFocused ? "scale-[1.02]" : ""}`}>
              <Search className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 transition-colors ${searchFocused ? "text-pink-400" : "text-gray-500"}`} />
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full h-10 sm:h-11 lg:h-12 pl-10 sm:pl-12 pr-10 text-sm bg-white/10 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/15 focus:border-pink-500/40 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== CATEGORY BAR ===== */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 py-2 sm:py-2.5 overflow-x-auto no-scrollbar" ref={catScrollRef}>
            <button
              onClick={() => setFilteredCategory("All")}
              className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                filteredCategory === "All"
                  ? "bg-gray-900 text-white shadow-lg shadow-gray-900/25"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat._id}
                onClick={() => setFilteredCategory(cat._id)}
                className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  filteredCategory === cat._id
                    ? "bg-gray-900 text-white shadow-lg shadow-gray-900/25"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
            <div className="flex-1 min-w-[8px]" />
            <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3 border-l border-gray-200">
              <button
                onClick={() => setOpenFilter(true)}
                className="lg:hidden flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-all relative"
              >
                <SlidersHorizontal className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span className="hidden sm:inline">Filter</span>
                {activeFilters > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{activeFilters}</span>
                )}
              </button>
              <div className="hidden sm:flex items-center bg-gray-100 rounded-full p-0.5">
                <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-full transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-gray-900" : "text-gray-400"}`}>
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-full transition-all ${viewMode === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-400"}`}>
                  <Rows3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="py-3 sm:py-4">
        <div className="flex">

          {/* ===== DESKTOP SIDEBAR ===== */}
          <aside className="hidden lg:block w-[230px] xl:w-[260px] flex-shrink-0 border-r border-gray-200 pl-4 sm:pl-6 lg:pl-8 pr-5">
            {/* Sort */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5">Sort By</p>
            {SORT_OPTIONS.map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`w-full flex items-center gap-2 py-[7px] text-sm transition-colors ${
                    sortBy === opt.value
                      ? "text-pink-700 font-semibold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {opt.label}
                </button>
              );
            })}

            <div className="h-px bg-gray-200 my-4" />

            {/* Price */}
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">Price Range</p>
            <Slider min={0} max={10000} step={100} value={priceRange} onValueChange={setPriceRange} className="mb-3" />
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-gray-700">₹{priceRange[0].toLocaleString()}</span>
              <span className="text-gray-300">—</span>
              <span className="font-semibold text-gray-700">₹{priceRange[1].toLocaleString()}</span>
            </div>

            {activeFilters > 0 && (
              <>
                <div className="h-px bg-gray-200 my-4" />
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em]">Active</p>
                  <button onClick={clearAll} className="text-xs text-pink-600 font-medium hover:underline">Clear</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {filteredCategory !== "All" && (
                    <span className="inline-flex items-center gap-1 bg-gray-900 text-white text-[11px] px-2.5 py-1 rounded-full">
                      {activeCatName}
                      <button onClick={() => setFilteredCategory("All")} className="hover:text-pink-300"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                    <span className="inline-flex items-center gap-1 bg-gray-900 text-white text-[11px] px-2.5 py-1 rounded-full">
                      ₹{priceRange[0]}–₹{priceRange[1]}
                      <button onClick={() => setPriceRange([0, 10000])} className="hover:text-pink-300"><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              </>
            )}

            <div className="h-px bg-gray-200 my-4" />
            <p className="text-xs text-gray-400">
              <span className="text-gray-900 font-semibold">{filteredProducts.length}</span> of {products.length} products
            </p>
          </aside>

          {/* ===== PRODUCT GRID ===== */}
          <main className="flex-1 min-w-0 px-3 sm:px-6 lg:pl-5 lg:pr-8">
            {/* Mobile sort pills */}
            <div className="lg:hidden flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar mb-3 sm:mb-4 -mx-1 px-1 pb-1">
              {SORT_OPTIONS.map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`flex-shrink-0 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
                      sortBy === opt.value
                        ? "bg-pink-600 text-white shadow-md shadow-pink-600/25"
                        : "bg-white text-gray-500 border border-gray-200"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile results bar */}
            {!loading && filteredProducts.length > 0 && (
              <div className="lg:hidden flex items-center justify-between mb-3 sm:mb-4">
                <p className="text-xs text-gray-400">
                  <span className="text-gray-700 font-medium">{filteredProducts.length}</span> products
                </p>
                {activeFilters > 0 && (
                  <button onClick={clearAll} className="text-[11px] text-pink-600 font-medium flex items-center gap-1">
                    <X className="w-3 h-3" /> Clear filters
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className={`grid gap-2.5 sm:gap-3 md:gap-4 ${viewMode === "list" ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"}`}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden">
                    <div className={`skeleton ${viewMode === "list" ? "h-32 sm:h-36" : "aspect-[3/4]"}`} />
                    <div className="p-3 sm:p-4 space-y-2">
                      <div className="h-2.5 sm:h-3 skeleton rounded w-1/3" />
                      <div className="h-3.5 sm:h-4 skeleton rounded w-2/3" />
                      <div className="h-4 sm:h-5 skeleton rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 sm:py-24 text-center px-4"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-5 sm:mb-6">
                  <PackageOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">No products found</h3>
                <p className="text-xs sm:text-sm text-gray-400 max-w-xs mb-5 sm:mb-6">We couldn't find anything matching your criteria. Try different filters.</p>
                <button onClick={clearAll} className="px-5 sm:px-6 py-2 sm:py-2.5 bg-gray-900 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/20 active:scale-95">
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              <div className={`grid gap-2.5 sm:gap-3 md:gap-4 ${viewMode === "list" ? "grid-cols-1 max-w-3xl" : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"}`}>
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, i) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.2) }}
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ===== MOBILE FILTER SHEET ===== */}
      <Sheet open={openFilter} onOpenChange={setOpenFilter}>
        <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] p-0">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          <div className="flex items-center justify-between px-5 sm:px-6 py-3 border-b border-gray-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Filters</h2>
              <p className="text-[11px] sm:text-xs text-gray-400">{filteredProducts.length} results</p>
            </div>
            <div className="flex items-center gap-3">
              {activeFilters > 0 && (
                <button onClick={clearAll} className="text-xs text-pink-600 font-semibold">Reset</button>
              )}
              <button onClick={() => setOpenFilter(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="px-5 sm:px-6 py-4 sm:py-5 space-y-6 overflow-y-auto max-h-[calc(85vh-100px)]">
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setFilteredCategory("All"); setOpenFilter(false); }}
                  className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                    filteredCategory === "All" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat._id}
                    onClick={() => { setFilteredCategory(cat._id); setOpenFilter(false); }}
                    className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                      filteredCategory === cat._id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">Price Range</h3>
              <Slider min={0} max={10000} step={100} value={priceRange} onValueChange={setPriceRange} className="mb-4" />
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 text-center">
                  <span className="text-[10px] text-gray-400 block leading-none mb-0.5">Min</span>
                  <span className="text-sm font-bold text-gray-900">₹{priceRange[0].toLocaleString()}</span>
                </div>
                <div className="w-4 h-px bg-gray-300" />
                <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 text-center">
                  <span className="text-[10px] text-gray-400 block leading-none mb-0.5">Max</span>
                  <span className="text-sm font-bold text-gray-900">₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">Sort By</h3>
              <div className="grid grid-cols-2 gap-2">
                {SORT_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setOpenFilter(false); }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                        sortBy === opt.value
                          ? "bg-pink-50 text-pink-700 border-2 border-pink-200"
                          : "bg-gray-50 text-gray-600 border-2 border-transparent"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
