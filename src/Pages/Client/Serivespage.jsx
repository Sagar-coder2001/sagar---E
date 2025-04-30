import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { useSelector } from 'react-redux';

const items = [
  <div className="rounded-lg shadow-lg shadow-amber-200 p-6 text-center m-2" key="1">
    <h3 className="text-xl font-semibold mb-2">🚚 Free Shipping</h3>
    <p className="">Enjoy free shipping on all orders over $50!</p>
  </div>,
  <div className="rounded-lg shadow-lg shadow-amber-200 p-6 text-center m-2" key="2">
    <h3 className="text-xl font-semibold mb-2">👕 Premium T-Shirts</h3>
    <p className="">High-quality cotton T-shirts in all sizes.</p>
  </div>,
  <div className="rounded-lg shadow-lg shadow-amber-200 p-6 text-center m-2" key="3">
    <h3 className="text-xl font-semibold mb-2">🎁 Existing Offers</h3>
    <p>Check out our current deals and discounts.</p>
  </div>,
];

const Serivespage = () => {
    const bgcolor = useSelector((state) => state.theme.value)
    const txtcolor = useSelector((state) => state.theme.textcolor)

  return (
    <div className="max-w-full mx-auto py-10 px-4"  style={{ backgroundColor: bgcolor, color: txtcolor }}>
      <AliceCarousel
        autoPlay
        autoPlayInterval={2500}
        infinite
        disableButtonsControls
        disableDotsControls
        items={items}
        responsive={{
          0: { items: 1 },
          640: { items: 1 },
          768: { items: 2 },
          1024: { items: 3 },
        }}
      />
    </div>
  );
};

export default Serivespage;
