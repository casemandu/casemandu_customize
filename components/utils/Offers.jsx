"use client";
import React, { useState, useEffect } from "react";
import PromoCountdown from "./PromoCountDown";

function Offers() {
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);
  const [promos, setPromos] = useState([]);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [countdown, setCountdown] = useState("");
  const [hydrate, setHydrate] = useState(false);

  function fetchPromos() {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      "https://server.casemandu.com.np/api/promocodes",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setPromos(result);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    fetchPromos();
    setHydrate(true);
  }, []);

  if (!hydrate) {
    return null;
  }

  if (loading) {
    return null;
  }

  if (promos.length === 0) {
    return null;
  }

  if (!show) {
    return null;
  }

  return (
    <div className="flex trems-center justify-between bg-purple text-white px-5 p-2 items-center">
      <div className="flex"></div>
      <div className="flex items-center gap-2 justify-between w-full px-5">
      {promos.length == 1 && (
          <div className="">
          </div>
        )}
        {promos.length > 1 && (
          <button
            onClick={() =>
              setCurrentPromo(
                (currentPromo - 1 + promos.length) % promos.length
              )
            }
            className="p-2 h-10 w-10 font-bold bg-pink-500/30 border hover:bg-purple duration-300 cursor-pointer border-gray-600  text-white rounded-full"
          >
            &lt;
          </button>
        )}
        <div className="flex  gap-2 flex-col items-center">
          <h1 className=" font-bold text-white uppercase tracking-wider">
            {promos[currentPromo].title}
          </h1>
          <PromoCountdown promos={promos} currentPromo={currentPromo} />
        </div>
        {promos.length > 1 && (
          <button
            onClick={() => setCurrentPromo((currentPromo + 1) % promos.length)}
            className="p-2 h-10 w-10 font-bold  bg-pink-500/30 border hover:bg-purple duration-300 cursor-pointer border-gray-600  text-white rounded-full"
          >
            &gt;
          </button>
        )}

{promos.length == 1 && (
          <div className="">
          </div>
        )}
      </div>

      <div
        onClick={() => setShow(!show)}
        className="flex rotate-45 hover:text-red-800 ease-in-out duration-300 cursor-pointer border border-white rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
    </div>
  );
}

export default Offers;
