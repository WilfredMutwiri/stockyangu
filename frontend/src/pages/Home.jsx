import React from 'react';
import homeImg from '../assets/8122f8ca330a38efebba8f6870951960.jpg';
import homeImg2 from '../assets/5846d5c1461797b4cb4ad0cdc16424a2.jpg';
import homeImg3 from '../assets/7e5f672a71009d7aa4cb59af7e10b7cf.jpg';
import homeImg4 from '../assets/d27286bfab30f866096ecf1eca8612d8.jpg';

import { Button,} from 'flowbite-react';
import { Rating } from "flowbite-react";

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
export default function Home() {
  const homeBannerImages = [homeImg, homeImg2, homeImg3, homeImg4];
  return (
    <div>
      <div className='relative bg-gray-100'>
        <header>
          <div className='max-w-[1400px] w-full m-auto'>
            {/* home carousel */}
            <div className="">
              <Carousel showThumbs={false} autoPlay={true} infiniteLoop={true}>
                {homeBannerImages.map((image, idx) => (
                  <div key={idx} className='max-w-[100%] h-[700px]'>
                    <img className='w-full h-[700px] object-cover' src={image} alt={`Banner ${idx + 1}`} />
                  </div>
                ))}
              </Carousel>

              {/* dark overlay */}
              <div className='relative inset-0 bg-black bg-opacity-50 z-10 max-w-[1400px] h-[720px] md:h-[720px] -mt-[720px] w-full m-auto'></div>

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
                <div className='pt-10'>
                  <Button gradientDuoTone="purpleToBlue" outline className='mx-auto w-[300px]'>Get Started</Button>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main>
          {/* solutions section */}
          <section className='pt-10 pb-10'>
            <h2 className='font-semibold pl-5 md:pl-10 text-xl'>Solutions</h2>
            {/* visible on large devices */}
            <div className="hidden md:flex flex-col gap-12 md:flex-row justify-between w-11/12 mx-auto pt-5">
              <div className=' bg-purple-300 mx-auto w-full md:w-72 h-72 shadow-md rounded-md border-2 shadow-gray-300 relative'>
                  <div className='p-5 rounded-md w-full md:w-72 h-72 leading-relaxed'>
                  <h2 className='text-center font-semibold text-lg text-cyan-700 mb-2'>Sales Monitoring</h2>
                    <hr />
                    <p className='pt-4'>
                      With Stock Yangu app, you can now keep track of sales in your business, making sure that you keep all transactions in check!
                    </p>
                    <Button className='w-44 mx-auto mt-4' gradientDuoTone="purpleToBlue" outline>Get Started</Button>
                  </div>
              </div>
              <div  className='mx-auto w-full md:w-72 h-72 shadow-md rounded-md border-2 inset-1 shadow-gray-300 relative mt-14 md:mt-0'>
                  <div className=' bg-purple-300 rounded-md  w-full md:w-72  h-72 p-5 leading-relaxed'>
                    <h2 className='text-center font-semibold text-lg text-cyan-700 mb-2'>Stock Management</h2>
                    <hr />
                    <p className='pt-4 leading-relaxed p-5'>
                      With Stock Yangu app, you can efficiently manage your stock, ensuring that your inventory is always up to date.
                    </p>
                    <Button className='w-44 mx-auto mt-10 md:mt-0' gradientDuoTone="purpleToBlue" outline>Get Started</Button>
                  </div>
              </div>
              <div className='mx-auto w-full md:w-72 h-72 shadow-md rounded-md border-2 shadow-gray-300 relative mt-14 md:mt-0'>
                  <div className=' bg-purple-300 rounded-md w-full md:w-72 h-[300px] md:h-72 p-5 leading-relaxed'>
                    <h2 className='text-center font-semibold text-lg text-cyan-700 mb-2'>Report Generation</h2>
                    <hr />
                    <p className='pt-4 leading-relaxed p-5'>
                      With Stock Yangu app, you can generate comprehensive reports that help you understand your business performance.
                    </p>
                    <Button className='w-44 mx-auto mt-10 md:mt-0' gradientDuoTone="purpleToBlue" outline>Get Started</Button>
                  </div>
              </div>
            </div>
            {/* visible on small devices */}
            <div className='block md:hidden w-11/12 mx-auto'>
            <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true}>
            <div className='mx-auto w-full md:w-72 h-72 shadow-md rounded-md border-2 shadow-gray-300 relative mt-14 md:mt-0'>
                  <div className=' bg-purple-300 p-5 rounded-md w-full md:w-72 h-72 leading-relaxed'>
                  <h2 className='text-center font-semibold text-lg text-cyan-700 mb-2'>Sales Monitoring</h2>
                    <hr />
                    <p className='pt-4 leading-relaxed p-5'>
                      With Stock Yangu app, you can now keep track of sales in your business, making sure that you keep all transactions in check!
                    </p>
                    <Button className='w-44 mx-auto mt-4' gradientDuoTone="purpleToBlue" outline>Get Started</Button>
                  </div>
              </div>

              <div  className='mx-auto w-full md:w-72 h-72 shadow-md rounded-md border-2 shadow-gray-300 relative mt-14 md:mt-0'>
                  <div className=' bg-purple-300 rounded-md  w-full md:w-72  h-72 p-5 leading-relaxed'>
                    <h2 className='text-center font-semibold text-lg text-cyan-700 mb-2'>Stock Management</h2>
                    <hr />
                    <p className='pt-4 leading-relaxed p-5'>
                      With Stock Yangu app, you can efficiently manage your stock, ensuring that your inventory is always up to date.
                    </p>
                    <Button className='w-44 mx-auto mt-10 md:mt-0' gradientDuoTone="purpleToBlue" outline>Get Started</Button>
                  </div>
              </div>

              <div className='mx-auto w-full md:w-72 h-72 shadow-md rounded-md border-2 shadow-gray-300 relative mt-14 md:mt-0'>
                  <div className=' bg-purple-300 rounded-md w-full md:w-72 md:h-72 p-5 leading-relaxed'>
                    <h2 className='text-center font-semibold text-lg text-cyan-700 mb-2'>Report Generation</h2>
                    <hr />
                    <p className='pt-4 leading-relaxed p-5'>
                      With Stock Yangu app, you can generate comprehensive reports that help you understand your business performance.
                    </p>
                    <Button className='w-44 mx-auto mt-10 md:mt-0' gradientDuoTone="purpleToBlue" outline>Get Started</Button>
                  </div>
              </div>
            </Carousel>
            </div>
          </section>
          <hr />
          {/* reviews section */}
          <section>
            <h2 className='font-semibold pl-5 md:pl-10 text-xl pt-10'>Latest Reviews</h2>
            <div className='pt-10 pb-10 hidden md:flex flex-row gap-12 w-11/12 mx-auto '>
              <div className='flex flex-col gap-1 bg-violet-400 p-5 rounded-md shadow-md shadow-gray-300'>
                <div>
                <Rating>
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star filled={false} />
                  </Rating>
                </div>
                <div>
                <h2 className='font-semibold text-lg pb-4'>Revolutionized My Business!</h2>
                <p>
                StockYAngu has completely transformed how I manage my stock and sales. It’s incredibly user-friendly and ensures that I never miss a sale. The real-time monitoring feature helps me stay on top of everything, and I love how smooth the reporting is!
                </p>
                <h3 className='text-white'>@Samuel K. <span className='text-red-600 text-sm pl-3'>12/9/2024</span></h3>  
                </div>
              </div>
              <div className='flex flex-col gap-1 bg-violet-400 p-5 rounded-md shadow-md shadow-gray-300'>
                <div>
                <Rating>
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  </Rating>
                </div>
                <div>
                <h2 className='font-semibold text-lg pb-4'>Efficient and Easy to Use</h2>
                <p>
                Managing my inventory used to be stressful, but with StockYAngu, everything is so much easier. The app keeps everything organized and up to date, saving me time and energy. I highly recommend this to anyone in retail!
                </p>
                <h3 className='text-white'>@Mary N<span className='text-red-600 text-sm pl-3'>12/9/2024</span></h3>  
                </div>
              </div>
              <div className='flex flex-col gap-1 bg-violet-400 p-5 rounded-md shadow-md shadow-gray-300'>
                <div>
                <Rating>
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star filled={false}/>
                  <Rating.Star filled={false} />
                  </Rating>
                </div>
                <div>
                <h2 className='font-semibold text-lg pb-4'>The Perfect Business Companion</h2>
                <p>
                StockYAngu has made managing my sales and stock a breeze. I can track everything in one place, and the detailed reports give me insights that help grow my business. A must-have for every small business owner!
                </p>
                <h3 className='text-white'>@Alex M<span className='text-red-600 text-sm pl-3'>12/9/2024</span></h3>  
                </div>
              </div>
            </div>
            {/* visible on small devices */}
            <div className='pt-10 pb-10 gap-12 w-11/12 mx-auto block md:hidden'>
            <Carousel showThumbs={false} autoPlay={true} infiniteLoop={true}>
            <div className='flex flex-col gap-1 bg-violet-400 p-5 rounded-md shadow-md shadow-gray-300'>
                <div>
                <Rating>
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star filled={false} />
                  </Rating>
                </div>
                <div>
                <h2 className='font-semibold text-lg pb-4'>Revolutionized My Business!</h2>
                <p>
                StockYAngu has completely transformed how I manage my stock and sales. It’s incredibly user-friendly and ensures that I never miss a sale. The real-time monitoring feature helps me stay on top of everything, and I love how smooth the reporting is!
                </p>
                <h3 className='text-white'>@Samuel K. <span className='text-red-600 text-sm pl-3'>12/9/2024</span></h3>  
                </div>
              </div>

              <div className='flex flex-col gap-1 bg-violet-400 p-5 rounded-md shadow-md shadow-gray-300'>
                <div>
                <Rating>
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star filled={false}/>
                  <Rating.Star filled={false} />
                  </Rating>
                </div>
                <div>
                <h2 className='font-semibold text-lg pb-4'>The Perfect Business Companion</h2>
                <p>
                StockYAngu has made managing my sales and stock a breeze. I can track everything in one place, and the detailed reports give me insights that help grow my business. A must-have for every small business owner!
                </p>
                <h3 className='text-white'>@Alex M<span className='text-red-600 text-sm pl-3'>12/9/2024</span></h3>  
                </div>
              </div>

              <div className='flex flex-col gap-1 bg-violet-400 p-5 rounded-md shadow-md shadow-gray-300'>
                <div>
                <Rating>
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star />
                  <Rating.Star filled={false}/>
                  <Rating.Star filled={false} />
                  </Rating>
                </div>
                <div>
                <h2 className='font-semibold text-lg pb-4'>The Perfect Business Companion</h2>
                <p>
                StockYAngu has made managing my sales and stock a breeze. I can track everything in one place, and the detailed reports give me insights that help grow my business. A must-have for every small business owner!
                </p>
                <h3 className='text-white'>@Alex M<span className='text-red-600 text-sm pl-3'>12/9/2024</span></h3>  
                </div>
              </div>

            </Carousel>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
