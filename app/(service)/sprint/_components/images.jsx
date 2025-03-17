import React from 'react';

const ImageGallery = () => {
  const images = [
    '/assets/images/image-1.jpg',
    '/assets/images/image-3.jpg',
    '/assets/images/image-2.jpg',
  ];

  return (
    <div className="py-4 px-4 lg:py-12">
      <div className=" mx-auto">
        <div className="overflow-hidden max-lg:overflow-x-auto hidden-scrollbar">
          <div className="flex space-x-6 md:gap-6 md:overflow-visible">
            {images.map((src, index) => (
              <div 
                key={index} 
                className="flex-shrink-0 max-lg:h-[22vh] w-full rounded-lg overflow-hidden lg:w-[40vw] lg:max-h-[70vh]"
              >
                <img 
                  src={src} 
                  alt={`Gallery image ${index + 1}`} 
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;