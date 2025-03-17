import React from 'react';

const ProductsSection = () => {
  const services = [
    'Website Design',
    'Product Design',
    'Landing Page Design',
    'Social Media Assets',
    'Logotypes',
    'Brand Books',
    'Pitch Decks',
    'Design Systems',
    'Brand Applications',
    'Icons',
    'Event assets',
    'Newsletter Design',
    'Print Media',
    '& more'
  ];

  return (
    <div className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-10">
          Brand, marketing, product & more
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {services.map((service) => (
            <div 
              key={service} 
              className="bg-neutral-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all"
            >
              {service}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;