"use client";
import React, { useEffect, useState } from "react";

function PhoneCases({ phone }) {
  const [data, setData] = React.useState(null);
  const [startIndex, setStartIndex] = useState(0); // Tracks the starting index of the visible items
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState(null)
  const itemsPerSlide = 4;

  const handleNextSlide = () => {
    if (startIndex + itemsPerSlide < data.length) {
      setStartIndex(startIndex + 1); // Move forward by one item
    }
  };

  const handlePrevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1); // Move backward by one item
    }
  };

  useEffect(() => {
    // filter the phone so that templateImg is not null
    const filteredPhone = phone?.models?.filter((item) => !!item.templateImg);
    setData(filteredPhone);

  }, [phone]);

  useEffect(()=>{

    const random = Math.floor(Math.random()*1000)
    const img = `https://picsum.photos/800/1600?random=${random}`
    setImage(img)
    if(img){
      setLoading(false)
    }
  },[])

  if (data?.length === 0) {
    return null;
  }

  if(loading) return null

  return (
    <div className="flex flex-col  justify-center">
      <h1 className="text-xl font-bold text-black">{phone.name} CASES</h1>
      <div className="relative mt-4 w-full overflow-hidden">
        <div className="grid w-full xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 transition-transform duration-300 ease-in-out transform">
          {data
            ?.slice(startIndex, startIndex + itemsPerSlide) // Show only the visible slice
            .map((item, index) => (
              <div
                key={index}
                className="0 w-full p-2 flex flex-col items-center"
              >
                  <div className="relative bg-gray-400 rounded-md border border-gray-400 flex flex-col items-center">
                    <img
                      src={item.templateImg}
                      alt={item.name}
                      className="h-[420px] object-contain"
                      style={{
                        backgroundImage:!!image && `url(${image + Math.floor(Math.random()*1000) })`,
                        backgroundSize:'cover',
                        backgroundRepeat:'no-repeat',

                      }}
                    />
                    <h2 className="text-sm font-semibold  absolute left-2 bottom-2 text-gray-800">
                      {item.name}
                    </h2>
                  </div>
              </div>
            ))}
        </div>

        <div className="md:hidden flex justify-between p-2 items-center">
        {startIndex > 0 && (
            <button
              onClick={handlePrevSlide}
              className=" bg-black text-white px-2 py-2 h-10 w-10 rounded-full hover:bg-gray-800 transition"
            >
              ←
            </button>
          )}
          {startIndex + itemsPerSlide < data?.length && (
            <button
              onClick={handleNextSlide}
              className=" bg-black text-white px-2 py-2 h-10 w-10 rounded-full hover:bg-gray-800 transition"
            >
              →
            </button>
          )}
            </div>

     
        <div className="md:block hidden">
          {startIndex > 0 && (
            <button
              onClick={handlePrevSlide}
              className="absolute top-1/2 -translate-y-1/2 left-0 bg-black text-white px-2 py-2 h-10 w-10 rounded-full hover:bg-gray-800 transition"
            >
              ←
            </button>
          )}
          {startIndex + itemsPerSlide < data?.length && (
            <button
              onClick={handleNextSlide}
              className="absolute top-1/2 -translate-y-1/2 right-0 bg-black text-white px-2 py-2 h-10 w-10 rounded-full hover:bg-gray-800 transition"
            >
              →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PhoneCases;
