import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Carousle() {
  const [index, setIndex] = useState(0);

  const slide = [
    {
      img: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1718366437/Croma%20Assets/CMS/Homepage%20Banners/HP%20Rotating/2024/June/15062024/Desktop/HP_Rotating_Oneplus_15june24_o6nplq.jpg',
      name: 'i Phone'
    },
    {
      img: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1718366437/Croma%20Assets/CMS/Homepage%20Banners/HP%20Rotating/2024/June/15062024/Desktop/HP_Rotating_Samsung_15june24_jo0cfr.jpg',
      name: 'Nike Shoes'
    },
    {
      img: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1718366438/Croma%20Assets/CMS/Homepage%20Banners/HP%20Rotating/2024/June/15062024/Desktop/HP_Rotating_SW_15june24_xw2s3h.jpg',
      name: 'Smart Watch'
    },
    {
      img: 'https://img.freepik.com/free-psd/running-shoes-banner-template_23-2148681438.jpg',
      name: 'Nike Running Shoes'
    }
  ];

  const prevSlide = () => {
    setIndex((prevIndex) => (prevIndex - 1 + slide.length) % slide.length);
  };

  const nextSlide = () => {
    setIndex((prevIndex) => (prevIndex + 1) % slide.length);
  };

  return (
    <div className="relative max-w-full mx-5 overflow-hidden h-80 mt-20">
      {/* Carousel Container */}
      <div className="relative h-full flex items-center justify-center">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute cursor-pointer left-4 text-white text-3xl p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition"
        >
              <ArrowLeftIcon className="h-4 w-4" />
        </button>

        {/* Carousel Image */}
        <div className="w-full h-full flex justify-center items-center">
          <img
            src={slide[index].img}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute cursor-pointer right-4 text-white text-3xl p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition"
        >
         <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Image Caption */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white py-2 px-4 rounded-lg">
        <span className="text-lg font-semibold">{slide[index].name}</span>
      </div>
    </div>
  );
}
