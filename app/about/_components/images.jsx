import React from 'react';

const ImageSection = () => {

  return (
    <div className="py-4 max-lg:px-4 lg:py-12">
      <div className=" mx-auto">
        <div className="overflow-hidden max-lg:overflow-x-auto hidden-scrollbar">
          <div className="flex space-x-6 md:gap-6 md:overflow-visible">
              <div 
                className="flex-shrink-0 max-lg:h-[22vh] w-full max-lg:rounded-lg overflow-hidden lg:max-h-screen"
              >
                <img 
                  src='/assets/images/image-1.jpg'
                  alt="" 
                  className="w-full h-auto object-cover"
                />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSection;