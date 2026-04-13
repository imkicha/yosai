import { MdWhatsapp } from "react-icons/md";
import { useLocation } from "react-router-dom";

const WhatsappButton = () => {
  const message = "Hello! I need assistance with your services.";
  const encodedMessage = encodeURIComponent(message);
  const location = useLocation();
  const path = location.pathname;
  const isHome = path === "/" || path === "/stitch-service";

  return (
    <a
      href={`https://wa.me/919361663823?text=${encodedMessage}`}
      className={`fixed md:bottom-16 md:right-5 z-50 bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors ${isHome ? "bottom-24 right-5 md:block" : "hidden md:block"}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <MdWhatsapp className="text-4xl" />
    </a>
  );
};

export default WhatsappButton;
