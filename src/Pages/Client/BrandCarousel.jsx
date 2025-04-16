export default function BrandMarquee() {
  const brands = [
    { img: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', name: 'Apple' },
    { img: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', name: 'Google' },
    { img: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', name: 'Amazon' },
    { img: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg', name: 'Facebook' },
    { img: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', name: 'Microsoft' },
    { img: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', name: 'Netflix' },
    { img: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', name: 'Apple' },
    { img: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', name: 'Google' },
    { img: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', name: 'Amazon' },
    { img: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg', name: 'Facebook' },
    { img: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg', name: 'Microsoft' },
    { img: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', name: 'Netflix' },
    // Add more as needed
  ];

  return (
    <div className="w-full bg-white py-4 overflow-hidden mt-5">
      <h4 className="text-center text-4xl font-bold tracking-tight text-gray-900">Our Brands</h4>
      <marquee behavior="scroll" direction="left" scrollamount="5" className="flex gap-6">
        {brands.map((brand, index) => (
          <div key={index} className="mx-4 inline-block">
            <img
              src={brand.img}
              alt={brand.name}
              className="h-10 sm:h-12 md:h-13 object-contain grayscale hover:grayscale-0 transition duration-300"
            />
          </div>
        ))}
      </marquee>
    </div>
  );
}
