import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Volume2, VolumeX } from "lucide-react";

function ReelCard({ product }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const handleToggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const firstVariant = product.variants?.[0];
  const price = firstVariant?.price;
  const mrp = firstVariant?.mrp;
  const thumb = product.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="flex-shrink-0 w-[200px] sm:w-[240px] relative group"
    >
      <div
        className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-gray-900 shadow-lg shadow-pink-500/10 cursor-pointer ring-1 ring-pink-100"
        onMouseEnter={() => { videoRef.current?.play(); setPlaying(true); }}
        onMouseLeave={() => { videoRef.current?.pause(); videoRef.current && (videoRef.current.currentTime = 0); setPlaying(false); }}
        onClick={handleToggle}
      >
        <video
          ref={videoRef}
          src={product.videoUrl}
          poster={thumb}
          muted={muted}
          loop
          playsInline
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Play className="w-6 h-6 text-gray-900 fill-gray-900 ml-0.5" />
            </div>
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); setMuted((m) => !m); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        <div className="absolute top-3 left-3 px-2.5 py-1 bg-pink-600 rounded-full z-10">
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Popular</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h4 className="text-white text-sm font-semibold line-clamp-1 mb-1.5">{product.name}</h4>
          {price != null && (
            <div className="flex items-baseline gap-2">
              <span className="text-white font-bold text-lg">₹{price}</span>
              {mrp && mrp > price && (
                <span className="text-white/50 text-xs line-through">₹{mrp}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <Link
        to={`/viewproduct/${product._id}`}
        className="absolute inset-0 rounded-3xl"
        aria-label={`View ${product.name}`}
      />

      <Link
        to={`/viewproduct/${product._id}`}
        className="mt-3 block text-center text-xs font-semibold text-pink-600 hover:text-pink-700 transition-colors relative z-10"
      >
        Shop Now →
      </Link>
    </motion.div>
  );
}

export default function ProductReels({ products }) {
  const reelProducts = products.filter((p) => p.videoUrl && p.videoUrl.trim()).slice(0, 12);

  if (reelProducts.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-pink-50/60 via-white to-pink-50/40 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8 md:mb-10 relative"
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
          <span className="text-xs uppercase tracking-[0.25em] text-pink-600 font-medium">Watch & Shop</span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
        </div>
        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Popular Products</h2>
        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">Tap a video to play — shop your favorites in seconds</p>
      </motion.div>

      <div className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar px-4 sm:px-6 py-4 scroll-smooth relative">
        {reelProducts.map((p) => (
          <ReelCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
