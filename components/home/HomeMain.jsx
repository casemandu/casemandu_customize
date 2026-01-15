"use client";
import React, { useEffect, useState } from "react";
import HomeTYpes from "./HomeTYpes";
import HomeFeatures from "./HomeFeatures";
import PhoneCases from "./Cases";
import { GetAllPhone } from "@/functions/GetAllPhone";

const Types = [
  {
    image:
      "https://i.pinimg.com/originals/a7/45/ba/a745ba950094af9f7a7e9370bc6eed13.png",
    title: "Airpods",
    link: "/c/airpods",
  },
  {
    image: "https://static.thenounproject.com/png/63390-200.png",
    title: "Mouse Pads",
    link: "/c/mousepads",
  },
  {
    image: "https://cdn2.iconfinder.com/data/icons/device-26/100/01-512.png",
    title: "Phone Cases",
    link: "/c/phonecases",
  },
  {
    image:
      "https://cdn3.iconfinder.com/data/icons/bags-thick-outline/100/Notebook-512.png",
    title: "Laptop Sleevess",
    link: "/c/laptopsleeves",
  },
  {
    image:
      "https://i.pinimg.com/originals/1c/db/2d/1cdb2d68b9f6451a434b68511e2e3748.png",
    title: "Popsockets",
    link: "/c/popsockets",
  },
];

function HomeMain() {
  const [cases, setCases] = useState([]);

  async function fetchCases() {
   const res = await GetAllPhone();
    setCases(res)
  }


  useEffect(() => {
    fetchCases();

  }, []);

  function scrollToTypes(){
    const element = document.getElementById('types');
    const offset = 100;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });

    // make the type zoom in and out when clicked
    document.getElementById('types').classList.add('animate-bounce')
    setTimeout(() => {
      document.getElementById('types').classList.remove('animate-bounce')
    }, 1800)
  }

  return (
    <div className=" flex flex-col ">
      {/* topbar */}
      <div className="relative flex h-[70vh]">
        <div
          className="flex"
          style={{
            backgroundImage: `url('https://www.customenvy.com/cdn/shop/files/download.jpg?v=1704960108&width=1400')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
          }}
        ></div>
        <div className="absolute top-0 left-0 bg-black bg-opacity-30 flex gap-5 items-start justify-center flex-col h-full w-full px-5">
          <h1 className="text-4xl text-white font-bold">
            Customise Your Design
          </h1>
          <p className="text-white">
            Takes less than 5 minutes to create your own design. Delivers in 3-5
            days. Awesome quality.
          </p>
          <button
            onClick={scrollToTypes}
          className="bg-red-600 rounded-full text-white shadow-md px-5 py-2  mt-5">
            Start Customising
          </button>
        </div>
      </div>
      {/* types */}
      <HomeTYpes Types={Types} />
      <HomeFeatures />

      <div className="flex flex-col gap-5">
        {!!cases && cases.length > 0 && (
          <div className="flex flex-col gap-4 justify-center items-center py-5 px-3 bg-gray-100">
            <h1 className="text-3xl font-bold">Customise Your Phone Case</h1>
            <div className="flex flex-wrap gap-5 justify-center py-5 px-3">
              {cases.map((phone, index) => (
                <PhoneCases key={index} phone={phone} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeMain;
