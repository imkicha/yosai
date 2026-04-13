import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Scissors, Truck, Ruler, Sparkles, Phone, CheckCircle, Star } from "lucide-react";
import api from "@/lib/api";

const features = [
  { icon: Scissors, title: "Expert Tailoring", desc: "Skilled tailors with 10+ years of experience crafting perfect fits" },
  { icon: Ruler, title: "Custom Measurements", desc: "Precision measurements for a silhouette that's uniquely yours" },
  { icon: Truck, title: "Pickup & Delivery", desc: "We collect your fabric and deliver the finished outfit to your door" },
  { icon: Sparkles, title: "Premium Finish", desc: "High-quality stitching with attention to every last detail" },
];

const steps = [
  { num: "01", title: "Book a Consultation", desc: "Schedule a free consultation with our expert designer" },
  { num: "02", title: "Share Your Design", desc: "Tell us your vision — bring a reference or let us suggest styles" },
  { num: "03", title: "Get Measured", desc: "We take precise measurements at your home or our studio" },
  { num: "04", title: "Receive Your Outfit", desc: "Your perfectly tailored outfit is delivered to your doorstep" },
];

export default function StitchService() {
  const [formData, setFormData] = useState({ name: "", phoneno: "" });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.name.trim()) return setError("Please enter your name");
    if (formData.phoneno.replace(/\s/g, "").length !== 10) return setError("Please enter a valid 10-digit number");
    setLoading(true);
    try {
      await api.post("/services/callback", formData);
      setSuccess(`We'll call you at ${formData.phoneno} shortly!`);
      setTimeout(() => { setLoading(false); setSuccess(""); setIsOpen(false); setFormData({ name: "", phoneno: "" }); setError(""); }, 3000);
    } catch {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* ===== HERO ===== */}
      {/* Desktop: full background image */}
      <section className="relative bg-gray-900 overflow-hidden -mt-16 sm:-mt-24 sm:pt-24">
        {/* Mobile: image on top, text below */}
        <div className="sm:hidden">
          <div className="relative">
            <img src="/0002.jpg" alt="Tailoring" className="w-full object-contain" onError={(e) => { e.target.style.display = "none"; }} />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
          </div>
          <div className="px-5 pb-10 -mt-16 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/10">
                <Scissors className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-xs text-pink-300 font-medium">Premium Tailoring Service</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3 leading-[1.1] tracking-tight">
                Tailored to<br />
                <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Perfection</span>
              </h1>
              <p className="text-gray-400 text-sm max-w-sm mb-5 leading-relaxed">
                Custom tailoring with doorstep pickup, expert craftsmanship, and delivery that fits your schedule.
              </p>
              <div className="flex gap-3">
                <Link to="/service-booking">
                  <motion.button whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 font-semibold rounded-full text-xs shadow-lg">
                    Book Stitching <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </Link>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-5 py-2.5 border border-white/25 text-white font-semibold rounded-full text-xs">
                  <Phone className="w-3.5 h-3.5" /> Consultation
                </motion.button>
              </div>
              <div className="flex items-center gap-3 mt-5">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                  </div>
                  <span className="text-[10px] text-gray-400 ml-1">4.9/5</span>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <span className="text-[10px] text-gray-400">500+ Customers</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Desktop: full background with right-aligned text */}
        <div className="hidden sm:block relative h-screen">
          <img src="/0001.jpg" alt="Tailoring" className="absolute inset-0 w-full h-full object-cover object-center" onError={(e) => { e.target.style.display = "none"; }} />
          <div className="absolute inset-0 bg-gradient-to-l from-gray-900/95 via-gray-900/50 to-gray-900/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />

          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
              <div className="max-w-xl ml-auto text-right">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/10">
                    <Scissors className="w-4 h-4 text-pink-400" />
                    <span className="text-sm text-pink-300 font-medium">Premium Tailoring Service</span>
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.1] tracking-tight">
                    Tailored to<br />
                    <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Perfection</span>
                  </h1>
                  <p className="text-gray-300 text-lg ml-auto max-w-md mb-8 leading-relaxed">
                    Experience the art of custom tailoring with doorstep pickup, expert craftsmanship, and delivery that fits your schedule.
                  </p>
                  <div className="flex gap-3 justify-end">
                    <Link to="/service-booking">
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-semibold rounded-full text-sm hover:bg-gray-100 transition-colors shadow-xl shadow-black/20">
                        Book Stitching <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-7 py-3.5 border border-white/25 text-white font-semibold rounded-full text-sm hover:bg-white/10 transition-colors backdrop-blur-sm">
                      <Phone className="w-4 h-4" /> Free Consultation
                    </motion.button>
                  </div>
                  <div className="flex items-center gap-5 mt-10 justify-end">
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                      </div>
                      <span className="text-xs text-gray-400 ml-1">4.9/5</span>
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <span className="text-xs text-gray-400">500+ Happy Customers</span>
                    <div className="w-px h-4 bg-white/20" />
                    <span className="text-xs text-gray-400">Free Pickup & Delivery</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
            <span className="text-xs uppercase tracking-[0.25em] text-pink-600 font-medium">Why Choose Us</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Crafted With Care</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-500/5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center mb-4 group-hover:bg-pink-100 group-hover:scale-110 transition-all">
                  <Icon className="w-5 h-5 text-pink-600" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
              <span className="text-xs uppercase tracking-[0.25em] text-pink-600 font-medium">How It Works</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Simple 4-Step Process</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(50%+24px)] right-[-calc(50%-24px)] w-[calc(100%-48px)] h-px border-t-2 border-dashed border-pink-200" />
                )}
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center mx-auto mb-4 text-white font-bold text-sm shadow-lg shadow-pink-500/25">
                    {s.num}
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-1.5">{s.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-[200px] mx-auto">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col lg:flex-row items-center gap-8 p-8 sm:p-12">
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to Get Started?</h3>
              <p className="text-gray-400 text-sm sm:text-base max-w-md">
                Book a free consultation with our designer and bring your dream outfit to life.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/service-booking">
                <button className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-gray-900 font-semibold rounded-full text-sm hover:bg-gray-100 transition-colors shadow-lg">
                  Book Stitching
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center gap-2 px-7 py-3.5 border border-white/25 text-white font-semibold rounded-full text-sm hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Me Back
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONSULTATION POPUP ===== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md sm:max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col sm:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left: Image */}
              <div className="relative sm:w-[45%] h-40 sm:h-auto sm:min-h-[460px] flex-shrink-0">
                <img src="/ConsultImage.png" alt="Consultation" className="w-full h-full object-cover object-top" onError={(e) => { e.target.style.display = "none"; }} />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-pink-600 rounded-full mb-1.5">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wide">Free</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">Bring Your Design to Life</h3>
                  <p className="text-gray-300 text-[11px] sm:text-xs mt-0.5 hidden sm:block">Professional designer consultation</p>
                </div>
              </div>

              {/* Right: Form */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col">
                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                >
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>

                <div className="mb-4 sm:mb-5 sm:pr-6">
                  <h4 className="text-base font-bold text-gray-900">Request a Callback</h4>
                  <p className="text-xs text-gray-400 mt-0.5">We'll connect you with a designer</p>
                </div>

                {success && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl mb-3">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-700 font-medium">{success}</p>
                  </motion.div>
                )}
                {error && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-red-50 border border-red-200 rounded-xl mb-3">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3 flex-1 flex flex-col">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Your Name</label>
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full h-10 px-3.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Mobile Number</label>
                    <input
                      name="phoneno"
                      type="tel"
                      value={formData.phoneno}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      required
                      className="w-full h-10 px-3.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all placeholder-gray-400"
                    />
                  </div>

                  <div className="flex-1" />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-pink-500/20"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Arranging...
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4" />
                        Arrange Free Callback
                      </>
                    )}
                  </button>

                  <p className="text-center text-[10px] text-gray-400">
                    We'll call you within 30 minutes during business hours
                  </p>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
