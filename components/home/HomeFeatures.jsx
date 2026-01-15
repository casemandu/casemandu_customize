"use client";
import React from "react";

const FeaturesSection = () => {
  return (
    <div className="bg-gray-900 py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
        {/* Feature 1 */}
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 flex items-center justify-center bg-white rounded-full">
            {/* Replace with actual icon */}
            <span className="text-black text-2xl">😊</span>
          </div>
          <h3 className="mt-4 text-lg font-bold">Easy to Design</h3>
          <p className="mt-2 text-sm">
            Takes less than 5 minutes to create your own design.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 flex items-center justify-center bg-white rounded-full">
            {/* Replace with actual icon */}
            <span className="text-black text-2xl">😍</span>
          </div>
          <h3 className="mt-4 text-lg font-bold">Premium Quality</h3>
          <p className="mt-2 text-sm">
            The best quality products delivered to your doorstep.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 flex items-center justify-center bg-white rounded-full">
            {/* Replace with actual icon */}
            <span className="text-black text-2xl">📦</span>
          </div>
          <h3 className="mt-4 text-lg font-bold">Fast Delivery</h3>
          <p className="mt-2 text-sm">
            Delivery takes 2-3 days inside the valley, 4-5 days outside, with
            possible delays.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
