import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function ProductImageGallery({ images = [], productName = "Product" }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const displayImages = images.length > 0 ? images : ["/placeholder.svg"];
  const lightboxImages = displayImages.map((src) => ({ src }));

  const handlePrevImage = () => setCurrentImageIndex((prev) => prev === 0 ? displayImages.length - 1 : prev - 1);
  const handleNextImage = () => setCurrentImageIndex((prev) => prev === displayImages.length - 1 ? 0 : prev + 1);

  const openLightbox = () => {
    setLightboxIndex(currentImageIndex);
    setLightboxOpen(true);
  };

  return (
    <div className="flex flex-col">
      {/* Main Image */}
      <div className="relative mb-4 bg-white rounded-lg overflow-hidden border border-gray-200">
        <div className="aspect-square">
          <TransformWrapper initialScale={1} minScale={1} maxScale={3} wheel={{ step: 0.1 }} centerOnInit centerZoomedOut doubleClick={{ mode: "reset" }} panning={{ disabled: false, velocityDisabled: true }}>
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%" }}>
                  <img
                    src={displayImages[currentImageIndex] || "/placeholder.svg"}
                    alt={`${productName} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                </TransformComponent>
                <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                  <button onClick={openLightbox} className="bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all" aria-label="Zoom">
                    <ZoomIn className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
              </>
            )}
          </TransformWrapper>
        </div>
        {displayImages.length > 1 && (
          <>
            <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 z-10">
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full shadow-md hover:bg-opacity-100 z-10">
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${currentImageIndex === index ? "border-pink-500" : "border-gray-200 hover:border-gray-300"}`}
            >
              <img src={image || "/placeholder.svg"} alt={`${productName} - Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxImages}
        plugins={[Zoom, Thumbnails]}
        zoom={{ maxZoomPixelRatio: 3, zoomInMultiplier: 1.2, doubleTapDelay: 300 }}
        thumbnails={{ position: "bottom", width: 120, height: 80, gap: 16 }}
        carousel={{ finite: displayImages.length <= 1 }}
        render={{ iconPrev: () => <ChevronLeft className="h-6 w-6" />, iconNext: () => <ChevronRight className="h-6 w-6" />, iconClose: () => <X className="h-6 w-6" /> }}
        on={{ view: ({ index }) => setLightboxIndex(index), exited: () => setCurrentImageIndex(lightboxIndex) }}
      />
    </div>
  );
}
