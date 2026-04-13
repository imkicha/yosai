import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VendorPending() {
  const { vendor, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/vendor/onboarding", { replace: true });
    if (vendor?.status === "approved") navigate("/vendor/dashboard", { replace: true });
  }, [user, vendor]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-pink-50 flex items-center justify-center px-4">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-200/40 to-purple-200/40 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-amber-200/40 to-orange-200/40 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] left-[60%] w-[250px] h-[250px] rounded-full bg-gradient-to-br from-blue-100/30 to-cyan-100/30 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 md:p-10 text-center">
          {/* Animated clock icon */}
          <div className="relative mx-auto w-24 h-24 mb-6">
            {/* Outer spinning ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-pink-400 border-r-amber-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            {/* Middle pulsing ring */}
            <motion.div
              className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-50 to-pink-50"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Inner icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="url(#clockGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <defs>
                  <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10" />
                <motion.line
                  x1="12" y1="12" x2="12" y2="7"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "12px 12px" }}
                />
                <motion.line
                  x1="12" y1="12" x2="15.5" y2="14"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "12px 12px" }}
                />
              </motion.svg>
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-3"
          >
            Under Verification
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="text-gray-500 text-sm md:text-base leading-relaxed mb-2"
          >
            Your Registration for Seller is Pending. The Verification Process will take upto 1-7 working days
          </motion.p>

          {/* Progress dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 my-6"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-400"
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="space-y-3 pt-2"
          >
            <Button
              className="w-full h-12 rounded-xl bg-gray-900 hover:bg-gray-800 text-white gap-2 text-sm font-semibold shadow-lg shadow-gray-900/20 transition-all hover:shadow-xl hover:shadow-gray-900/30"
              onClick={() => window.open("https://wa.me/919361663823?text=Hi%20Yosai%2C%20I%20have%20submitted%20my%20seller%20application%20and%20want%20to%20check%20the%20status.", "_blank")}
            >
              <MessageCircle className="h-5 w-5" /> Contact Support
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 gap-2 text-sm font-semibold transition-all"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" /> LogOut
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
