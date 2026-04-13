import { Link, useLocation } from "react-router-dom";
import { FiPhone, FiMail, FiInstagram } from "react-icons/fi";

export default function Footer() {
  const location = useLocation();
  const path = location.pathname;

  // On mobile, only show footer on home/service/policy pages
  const isHome =
    path === "/" ||
    path === "/stitch-service" ||
    path === "/privacy-policy" ||
    path === "/terms-and-conditions" ||
    path === "/refund-policy" ||
    path === "/return-policy" ||
    path === "/shipping-policy";

  return (
    <footer className={`bg-gray-800 text-gray-300 py-12 ${!isHome ? "hidden md:block" : ""}`}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Link to="tel:+919361663823" className="flex items-center">
                  <FiPhone className="mr-2 text-pink-500 text-lg" />
                  <span>+91 9361663823</span>
                </Link>
              </li>
              <li className="flex items-center">
                <Link to="mailto:support@yosai.org" className="flex items-center">
                  <FiMail className="mr-2 text-pink-500 text-lg" />
                  <span>support@yosai.org</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/readymades" className="hover:text-white">Products</Link></li>
              <li><Link to="/stitch-service" className="hover:text-white">Services</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Our Policy</h3>
            <ul className="space-y-2">
              <li><Link to="/terms-and-conditions" className="hover:text-white">Terms and Conditions</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/return-policy" className="hover:text-white">Return Policy</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white">Refund Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/yosai.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <FiInstagram className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Yosai Developer. All rights reserved.</p>
          <p>Designed by <Link to="/" className="text-pink-500 hover:text-pink-400">Yosai India</Link>.</p>
        </div>
      </div>
    </footer>
  );
}
