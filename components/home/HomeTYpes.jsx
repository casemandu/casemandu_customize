'use client'
import Link from 'next/link'
import React from 'react'

function HomeTYpes({
    Types
}) {
  return (
    <div
    className="flex flex-col gap-4
    justify-center items-center py-5 px-3 bg-gray-100 
    "
    id='types'
  >
    <h1 className="text-3xl font-bold ">Types of Customisation</h1>
    <div className="flex flex-wrap gap-5 justify-center py-5 px-3 ">
      {Types.map((type, index) => (
        <div
          key={index}
          className="flex flex-col items-center gap-3 border border-gray-500
            bg-white p-5 rounded-md shadow-md hover:shadow-lg transition duration-300 cursor-pointer hover:bg-gray-200 hover:scale-105
          "
          style={{ width: "200px" }}
        >
          <img src={type.image} alt={type.title} className="h-20" />
          <h1 className="text-lg font-bold">{type.title}</h1>
            <Link href={type.link}>
          <button className="bg-red-600 rounded-full text-white shadow-md px-5 py-2">
            Customise
          </button>
            </Link>
        </div>
      ))}
    </div>
  </div>
  )
}

export default HomeTYpes