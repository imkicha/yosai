import { useState } from "react";
import { Phone, Mail, MapPin, Send, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+91 9361663823", href: "tel:+919361663823", color: "bg-pink-50 text-pink-600" },
  { icon: Mail, label: "Email", value: "support@yosai.org", href: "mailto:support@yosai.org", color: "bg-purple-50 text-purple-600" },
  { icon: MapPin, label: "Location", value: "Tamil Nadu, India", href: null, color: "bg-blue-50 text-blue-600" },
  { icon: Clock, label: "Hours", value: "Mon – Sat, 9AM – 7PM", href: null, color: "bg-amber-50 text-amber-600" },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phoneno: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/services/contact", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", phoneno: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 -mt-16 pt-16 sm:-mt-24 sm:pt-24">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="absolute top-0 right-0 w-64 lg:w-96 h-64 lg:h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-52 lg:w-72 h-52 lg:h-72 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-pink-500" />
              <span className="text-xs uppercase tracking-[0.25em] text-pink-400 font-medium">Get in Touch</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-pink-500" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
              We'd Love to Hear<br className="hidden sm:block" /> From You
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto mb-8 sm:mb-10">
              Have questions about our products or services? Drop us a message and we'll get back to you as soon as possible.
            </p>

            {/* Contact Info Ribbon — inside hero */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex flex-wrap justify-center items-center bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-full border border-white/10 px-2 py-2 sm:px-3 sm:py-2 gap-1 sm:gap-2"
            >
              {contactInfo.map((item, i) => {
                const Icon = item.icon;
                const content = (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + 0.08 * i, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-full hover:bg-white/10 transition-colors duration-200 cursor-pointer group"
                  >
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-widest font-semibold leading-none mb-0.5">{item.label}</p>
                      <p className="text-[10px] sm:text-xs font-semibold text-white truncate group-hover:text-pink-300 transition-colors">{item.value}</p>
                    </div>
                  </motion.div>
                );
                return item.href ? (
                  <a key={item.label} href={item.href}>{content}</a>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Form + Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Left: Image + Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden flex-1 min-h-[300px] sm:min-h-[400px]">
              <img
                src="/contactlogo.jpeg"
                alt="Contact Yosai"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
                  Let's Start a Conversation
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 max-w-xs">
                  Questions about collections, sizing, or stitching? We're here to help.
                </p>
                <div className="space-y-2.5">
                  {[
                    { title: "Quick Response", desc: "Reply within 24 hours" },
                    { title: "Expert Support", desc: "Dedicated support team" },
                    { title: "Secure & Private", desc: "Your info stays confidential" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white">{item.title}</span>
                        <span className="text-[10px] text-gray-400">· {item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Send a Message</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Fill in the form and we'll get back to you</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                  <Send className="w-4.5 h-4.5 text-pink-600" />
                </div>
              </div>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 flex items-center gap-2 p-3.5 bg-green-50 border border-green-200 rounded-xl"
                >
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-700 font-medium">Message sent successfully! We'll get back to you soon.</p>
                </motion.div>
              )}

              <form onSubmit={sendMessage} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      name="phoneno"
                      value={formData.phoneno}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      required
                      className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    required
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all placeholder-gray-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-gray-900/10"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>

      {/* FAQ Teaser */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Still Have Questions?</h3>
            <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto mb-6">
              Can't find the answer you're looking for? Our team is just a call away.
            </p>
            <a
              href="tel:+919361663823"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-100 transition-all shadow-lg shadow-black/20 active:scale-95"
            >
              <Phone className="w-4 h-4" />
              Call Us Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
