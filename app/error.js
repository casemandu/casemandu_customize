"use client";
import Link from "next/link";
import React from "react";

function Error({ error }) {
  console.log(error);
  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'url("https://hispanaglobal.net/wp-content/uploads/2020/05/Personalized-Cell-Phone-Cases-Sample-2-4.jpg")',
      }}
    >
      <div class="flex h-full w-full justify-center items-center bg-black backdrop-blur-sm bg-opacity-40">
        <div className="max-w-md mx-auto text-center bg-white backdrop-blur-md bg-opacity-90 p-8 rounded-lg shadow-lg">
          <div className="text-9xl font-bold text-indigo-600 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">{error?.message}</p>
          <Link
            href="/"
            className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Error;
