import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, Truck, Shield, Headphones, Star, Quote, ChevronRight, Scissors, Users, Package } from "lucide-react";
import api from "@/lib/api";
import ImageCarousel from "@/components/ImageCarousel";
import CategoriesComp from "@/components/CategoriesComp";
import FeaturedLayout from "@/components/FeaturedLayout";
import InstallButton from "@/components/InstallButton";

const testimonials = [
  { name: "Sai Priya", location: "Chennai", quote: "The convenience of pickup and delivery combined with top-notch tailoring is unbeatable. I am a customer for life!", rating: 5 },
  { name: "Anandhi", location: "Hyderabad", quote: "Their attention to detail is impressive. My blouses have never fit better, and the service is always prompt.", rating: 5 },
  { name: "Vinitha Rao", location: "Mumbai", quote: "I love how they can bring my creative ideas to life. The quality of their work is consistently excellent.", rating: 5 },
];

function AnimatedCounter({ target, suffix = "" }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v) + suffix);
  const [display, setDisplay] = useState("0" + suffix);

  useEffect(() => {
    const unsub = rounded.on("change", setDisplay);
    return unsub;
  }, [rounded]);

  return (
    <motion.span
      onViewportEnter={() => animate(count, target, { duration: 2, ease: "easeOut" })}
      viewport={{ once: true }}
    >
      {display}
    </motion.span>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error("Failed to fetch home data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured || p.featured).slice(0, 10);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 10);
  const newArrivals = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

  return (
    <div className="bg-white">

      {/* ===== HERO CAROUSEL ===== */}
      <section>
        <ImageCarousel />
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
          <div className="grid grid-cols-3 divide-x divide-gray-200">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
              { icon: Shield, title: "Secure Payment", desc: "100% secure checkout" },
              { icon: Headphones, title: "24/7 Support", desc: "Dedicated customer care" },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-center gap-2 md:gap-3 px-2"
              >
                <f.icon className="h-5 w-5 md:h-6 md:w-6 text-pink-600 flex-shrink-0" />
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
                <span className="sm:hidden text-xs font-medium text-gray-700">{f.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-12 md:py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
            <span className="text-xs uppercase tracking-[0.25em] text-pink-600 font-medium">Categories</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Shop by Category</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">Browse our curated collections</p>
        </motion.div>
        {loading ? (
          <div className="flex space-x-4 overflow-x-auto no-scrollbar px-4 py-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="h-20 w-20 md:h-28 md:w-28 rounded-full skeleton" />
                <div className="h-3 w-16 rounded skeleton" />
              </div>
            ))}
          </div>
        ) : (
          <CategoriesComp categories={categories} />
        )}
      </section>

      {/* ===== PROMO SPLIT — Readymades ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {/* Left — Big Image Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/readymades" className="group block relative overflow-hidden rounded-3xl h-[320px] sm:h-[400px] md:h-full md:min-h-[420px]">
              <img src="/b1.jpg" alt="Collection" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => { e.target.style.display = "none"; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] uppercase tracking-widest text-white font-semibold mb-3">Exclusive</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">New Collection</h3>
                <p className="text-white/60 text-sm mb-4 max-w-xs">Handpicked styles for every occasion — shop the latest trends.</p>
                <span className="inline-flex items-center gap-2 text-white text-sm font-semibold group-hover:gap-3 transition-all">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Right — Two stacked cards */}
          <div className="grid grid-rows-2 gap-4 md:gap-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link to="/readymades" className="group block relative overflow-hidden rounded-3xl h-[180px] sm:h-[200px] md:h-full">
                <img src="/b2.jpg" alt="Trending" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => { e.target.style.display = "none"; }} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-1">Trending Styles</h4>
                  <span className="inline-flex items-center gap-1.5 text-white/70 text-xs font-medium group-hover:text-white transition-colors">
                    Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/readymades" className="group block relative overflow-hidden rounded-3xl h-[180px] sm:h-[200px] md:h-full">
                <img src="/b4.jpg" alt="New Arrivals" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => { e.target.style.display = "none"; }} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                  <h4 className="text-lg sm:text-xl font-bold text-white mb-1">New Arrivals</h4>
                  <span className="inline-flex items-center gap-1.5 text-white/70 text-xs font-medium group-hover:text-white transition-colors">
                    Discover <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
            <span className="text-xs uppercase tracking-[0.25em] text-pink-600 font-medium">Handpicked for You</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Featured Products</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">Our most popular items chosen by our stylists</p>
        </motion.div>
        {loading ? (
          <div className="flex space-x-5 overflow-x-auto no-scrollbar px-6 py-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-52 md:w-64 h-80 skeleton rounded-2xl" />
            ))}
          </div>
        ) : (
          <FeaturedLayout products={displayProducts} />
        )}
        <div className="text-center mt-8">
          <Link
            to="/readymades"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            View All Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ===== STITCHING CTA — Full Width ===== */}
      <section className="relative overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[400px] md:min-h-[480px]">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative h-[280px] md:h-auto"
          >
            <img src="/0001.jpg" alt="Custom Tailoring" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900/30 hidden md:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent md:hidden" />
          </motion.div>

          {/* Right — Content */}
          <div className="bg-gray-900 relative flex items-center">
            <div className="absolute top-0 left-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl" />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative px-6 sm:px-10 lg:px-14 py-10 md:py-0 -mt-10 md:mt-0"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-5 border border-white/10">
                <Scissors className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-xs text-pink-300 font-medium">Custom Tailoring</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight leading-tight">
                Your Perfect Fit,<br />Delivered to You
              </h3>
              <p className="text-gray-400 text-sm sm:text-base max-w-sm mb-8 leading-relaxed">
                Expert tailoring with doorstep pickup & delivery. From measurements to the final stitch — we handle everything.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/stitch-service">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-semibold rounded-full text-sm hover:bg-gray-100 transition-colors shadow-xl"
                  >
                    Book Stitching <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </Link>
                <Link to="/stitch-service" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/20 text-white font-medium rounded-full text-sm hover:bg-white/5 transition-colors">
                  Learn More
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      {newArrivals.length > 0 && (
        <section className="py-12 md:py-16 bg-[#fdf2f8]/40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
              <span className="text-xs uppercase tracking-[0.25em] text-pink-600 font-medium">Just In</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">New Arrivals</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">Fresh styles just added to our collection</p>
          </motion.div>
          {loading ? (
            <div className="flex space-x-5 overflow-x-auto no-scrollbar px-6 py-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-52 md:w-64 h-80 skeleton rounded-2xl" />
              ))}
            </div>
          ) : (
            <FeaturedLayout products={newArrivals} />
          )}
        </section>
      )}

      {/* ===== STATS ===== */}
      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Users, value: 500, suffix: "+", label: "Happy Customers" },
              { icon: Package, value: 1000, suffix: "+", label: "Orders Delivered" },
              { icon: Scissors, value: 50, suffix: "+", label: "Expert Tailors" },
              { icon: Star, value: 4.9, suffix: "", label: "Customer Rating", isDecimal: true },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-pink-50 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-pink-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  {stat.isDecimal ? (
                    <span>{stat.value}</span>
                  ) : (
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  )}
                </div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-14 md:py-20 px-4 bg-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12 relative"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
            <span className="text-xs uppercase tracking-[0.2em] text-pink-400 font-semibold">Testimonials</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">Loved by Customers</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">Don't take our word for it — hear from our happy customers</p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 px-2 md:px-4 relative">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="relative bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Quote className="absolute top-5 right-5 h-7 w-7 text-white/10" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Install App CTA */}
      <div className="pb-8">
        <InstallButton />
      </div>
    </div>
  );
}
