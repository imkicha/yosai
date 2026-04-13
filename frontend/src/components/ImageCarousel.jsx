import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const ImageCarousel = () => {
  const images = [
    { img: "/Banner2.jpeg" },
    { img: "/Banner1.jpeg" },
    { img: "/Banner3.jpeg" },
  ];

  return (
    <div className="w-full overflow-hidden">
      <Carousel
        plugins={[Autoplay({ delay: 4000 })]}
        opts={{ loop: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {images.map((item, index) => (
            <CarouselItem key={index} className="pl-0">
              <Link to="/readymades" className="block">
                <img
                  className="w-full h-auto block"
                  src={item.img}
                  alt={`Banner_${index}`}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
