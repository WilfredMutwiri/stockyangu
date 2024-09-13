import React from 'react';
import homeImg from '../assets/8122f8ca330a38efebba8f6870951960.jpg';
import homeImg2 from '../assets/5846d5c1461797b4cb4ad0cdc16424a2.jpg';
import homeImg3 from '../assets/7e5f672a71009d7aa4cb59af7e10b7cf.jpg';
import homeImg4 from '../assets/d27286bfab30f866096ecf1eca8612d8.jpg';
import { Button } from 'flowbite-react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function Home() {
  const homeBannerImages = [homeImg, homeImg2, homeImg3, homeImg4];

  return (
    <div>
      <div className='relative'>
        <header>
          <div className='max-w-[1400px] w-full m-auto'>
            {/* home carousel */}
            <div className="">
              <Carousel showThumbs={false} autoPlay={true} infiniteLoop={true}>
                {
                  homeBannerImages.map((image, idx) => (
                    <div key={idx} className='max-w-[100%] h-[700px]'>
                      <img className='w-full h-[700px] object-cover' src={image} alt={`Banner ${idx + 1}`} />
                    </div>
                  ))
                }
              </Carousel>

              {/* dark overlay */}
              <div className='absolute inset-0 bg-black bg-opacity-50 z-10 max-w-[1400px] h-[720px] md:h-[720px] w-full m-auto'></div>

              {/* text overlay */}
              <div className="absolute inset-0 flex flex-col text-white z-50">
                <div className='flex w-full md:w-96 mx-auto pt-0 md:pt-20'>
                  <div className='w-full mx-auto p-0 md:p-3 font-bold'>
                    <h1 className='text-center font-bold text-7xl md:text-8xl pt-24 md:pt-0 z-50  '>ST<span className='text-red-600'>O</span>CK YA<span className='text-red-600'>N</span>GU</h1>
                  </div>
                </div>
                <h2 className='text-cyan-300 text-center font-serif text-xl md:text-3xl pt-5'>Your all-in-one Merchandise management solutions
                </h2>
                <h3 className='text-center font-semibold pt-5 text-xl'>Always keeping your business <span className='text-cyan-300'>ON</span></h3>
                <div className=' pt-10'>
                  <Button gradientDuoTone="purpleToBlue" outline className='mx-auto w-[300px]'>Get Started</Button>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
