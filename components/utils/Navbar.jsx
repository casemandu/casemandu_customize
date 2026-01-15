'use client'
import Link from 'next/link';
import React, { useRef, useEffect } from 'react';
import {useCart} from '@/context/cartContext'
import Sidebar from './Sidebar';

function Navbar() {
  const {cartItems, setOpenSidebarCallback} = useCart()
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const mobileMenuRef = useRef(null);

  // Register callback to open sidebar when items are added to cart
  useEffect(() => {
    setOpenSidebarCallback(() => () => {
      setShowSidebar(true);
    });
    // Cleanup function to remove callback when component unmounts
    return () => {
      setOpenSidebarCallback(null);
    };
  }, [setOpenSidebarCallback]);

  const closeMobileMenu = (e, forceClose = false) => {
    if (forceClose || (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target))) {
      const menu = document.querySelector('.mobile-menu-slide');
      if (menu) {
        menu.classList.remove('slideIn');
        menu.classList.add('slideOut');
        setTimeout(() => {
          setShowMobileMenu(false);
        }, 500);
      }
    }
  };

  return (
    <>
      <div className="flex justify-between items-center px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-white via-white to-gray-200 shadow-md relative z-40">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <img
            src="https://www.casemandu.com.np/_next/image?url=%2Fimages%2Flogo%2Flogo.jpg&w=256&q=75"
            alt="logo"
            className="h-8 sm:h-10 md:h-12 md:block hidden object-contain rounded-2xl overflow-hidden"
          />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black uppercase font-poppins">
           Customise
          </h1>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <a
            href="https://www.casemandu.com.np"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 lg:px-4 py-1.5 lg:py-2 bg-transparent border-2 border-black rounded-md text-black hover:bg-black hover:text-white transition duration-300 text-sm lg:text-base whitespace-nowrap"
          >
            Back to Casemandu
          </a>
          <Link href="https://www.casemandu.com.np/order/track" target='_blank' className="text-black hover:text-gray-700 transition text-sm lg:text-base whitespace-nowrap">
            Track Order
          </Link>
          <Link href="/" className="text-black hover:text-gray-700 transition">
            <svg className='h-5 w-5 lg:h-6 lg:w-6' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12Z" fill="#000000"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M7.4 8.55C7.64853 8.21863 8.11863 8.15147 8.45 8.4L10.45 9.9C10.6389 10.0416 10.75 10.2639 10.75 10.5C10.75 10.7361 10.6389 10.9584 10.45 11.1L8.45 12.6C8.11863 12.8485 7.64853 12.7814 7.4 12.45C7.15147 12.1186 7.21863 11.6485 7.55 11.4L8.75 10.5L7.55 9.6C7.21863 9.35147 7.15147 8.88137 7.4 8.55Z" fill="#000000"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M16.6 8.55C16.3515 8.21863 15.8814 8.15147 15.55 8.4L13.55 9.9C13.3611 10.0416 13.25 10.2639 13.25 10.5C13.25 10.7361 13.3611 10.9584 13.55 11.1L15.55 12.6C15.8814 12.8485 16.3515 12.7814 16.6 12.45C16.8485 12.1186 16.7814 11.6485 16.45 11.4L15.25 10.5L16.45 9.6C16.7814 9.35147 16.8485 8.88137 16.6 8.55Z" fill="#000000"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M15.5303 16.5303C15.2374 16.8232 14.7626 16.8232 14.4697 16.5303L14 16.0607L13.5303 16.5303C13.3897 16.671 13.1989 16.75 13 16.75C12.8011 16.75 12.6103 16.671 12.4697 16.5303L12 16.0607L11.5303 16.5303C11.3897 16.671 11.1989 16.75 11 16.75C10.8011 16.75 10.6103 16.671 10.4697 16.5303L10 16.0607L9.53033 16.5303C9.23744 16.8232 8.76256 16.8232 8.46967 16.5303C8.17678 16.2374 8.17678 15.7626 8.46967 15.4697L9.46967 14.4697C9.61032 14.329 9.80109 14.25 10 14.25C10.1989 14.25 10.3897 14.329 10.5303 14.4697L11 14.9393L11.4697 14.4697C11.6103 14.329 11.8011 14.25 12 14.25C12.1989 14.25 12.3897 14.329 12.5303 14.4697L13 14.9393L13.4697 14.4697C13.6103 14.329 13.8011 14.25 14 14.25C14.1989 14.25 14.3897 14.329 14.5303 14.4697L15.5303 15.4697C15.8232 15.7626 15.8232 16.2374 15.5303 16.5303Z" fill="#000000"></path>
              </g>
            </svg>
          </Link>
          <div
            onClick={() => {
              cartItems.length > 0 && setShowSidebar(!showSidebar);
            }}
            className="relative cursor-pointer hover:-translate-y-1 duration-300">
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6 inline-block text-black"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#000"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M7.2998 5H22L20 12H8.37675M21 16H9L7 3H4M4 8H2M5 11H2M6 14H2M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20Z"
                  stroke="#000"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Menu Button & Cart */}
        <div className="flex md:hidden items-center gap-3">
          <div
            onClick={() => {
              cartItems.length > 0 && setShowSidebar(!showSidebar);
            }}
            className="relative cursor-pointer">
            <svg
              className="w-6 h-6 text-black"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#000"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M7.2998 5H22L20 12H8.37675M21 16H9L7 3H4M4 8H2M5 11H2M6 14H2M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20Z"
                  stroke="#000"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>
          
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-1 text-black focus:outline-none"
            aria-label="Toggle menu"
          >
            {showMobileMenu ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          onClick={(e) => closeMobileMenu(e, false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden fadeIn"
        >
          <div
            ref={mobileMenuRef}
            className="mobile-menu-slide slideIn fixed top-0 right-0 h-full w-64 bg-white shadow-lg"
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold">Menu</h2>
                <button
                  onClick={(e) => closeMobileMenu(e, true)}
                  className="text-black hover:text-gray-700 p-1"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-4">
                <a
                  href="https://www.casemandu.com.np"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => closeMobileMenu(e, true)}
                  className="block px-4 py-3 bg-transparent border-2 border-black rounded-md text-black hover:bg-black hover:text-white transition duration-300 text-center"
                >
                  Back to Casemandu
                </a>
                <Link
                  href="https://www.casemandu.com.np/order/track"
                  target="_blank"
                  onClick={(e) => closeMobileMenu(e, true)}
                  className="block px-4 py-3 text-black hover:bg-gray-100 rounded-md transition text-center"
                >
                  Track Order
                </Link>
                <Link
                  href="/"
                  onClick={(e) => closeMobileMenu(e, true)}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-black hover:bg-gray-100 rounded-md transition"
                >
                  <svg className='h-5 w-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12Z" fill="#000000"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M7.4 8.55C7.64853 8.21863 8.11863 8.15147 8.45 8.4L10.45 9.9C10.6389 10.0416 10.75 10.2639 10.75 10.5C10.75 10.7361 10.6389 10.9584 10.45 11.1L8.45 12.6C8.11863 12.8485 7.64853 12.7814 7.4 12.45C7.15147 12.1186 7.21863 11.6485 7.55 11.4L8.75 10.5L7.55 9.6C7.21863 9.35147 7.15147 8.88137 7.4 8.55Z" fill="#000000"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M16.6 8.55C16.3515 8.21863 15.8814 8.15147 15.55 8.4L13.55 9.9C13.3611 10.0416 13.25 10.2639 13.25 10.5C13.25 10.7361 13.3611 10.9584 13.55 11.1L15.55 12.6C15.8814 12.8485 16.3515 12.7814 16.6 12.45C16.8485 12.1186 16.7814 11.6485 16.45 11.4L15.25 10.5L16.45 9.6C16.7814 9.35147 16.8485 8.88137 16.6 8.55Z" fill="#000000"></path>
                      <path fillRule="evenodd" clipRule="evenodd" d="M15.5303 16.5303C15.2374 16.8232 14.7626 16.8232 14.4697 16.5303L14 16.0607L13.5303 16.5303C13.3897 16.671 13.1989 16.75 13 16.75C12.8011 16.75 12.6103 16.671 12.4697 16.5303L12 16.0607L11.5303 16.5303C11.3897 16.671 11.1989 16.75 11 16.75C10.8011 16.75 10.6103 16.671 10.4697 16.5303L10 16.0607L9.53033 16.5303C9.23744 16.8232 8.76256 16.8232 8.46967 16.5303C8.17678 16.2374 8.17678 15.7626 8.46967 15.4697L9.46967 14.4697C9.61032 14.329 9.80109 14.25 10 14.25C10.1989 14.25 10.3897 14.329 10.5303 14.4697L11 14.9393L11.4697 14.4697C11.6103 14.329 11.8011 14.25 12 14.25C12.1989 14.25 12.3897 14.329 12.5303 14.4697L13 14.9393L13.4697 14.4697C13.6103 14.329 13.8011 14.25 14 14.25C14.1989 14.25 14.3897 14.329 14.5303 14.4697L15.5303 15.4697C15.8232 15.7626 15.8232 16.2374 15.5303 16.5303Z" fill="#000000"></path>
                    </g>
                  </svg>
                  <span>Home</span>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}

      <Sidebar show={showSidebar} setShow={setShowSidebar} />
    </>
  );
}

export default Navbar;
