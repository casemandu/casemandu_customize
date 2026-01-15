"use client";
import React, { useRef, useEffect } from "react";
import { useCart } from "@/context/cartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function Sidebar({ show, setShow }) {
  const { cartItems, removeItemFromCart } = useCart();
  const ref = useRef(null);
  const router = useRouter();

  // Calculate total price (handle both primitive and object price values)
  const totalPrice = cartItems.reduce((sum, item) => {
    const itemPrice = typeof item?.price === 'object' ? item?.price?.price : item?.price;
    return sum + (Number(itemPrice) || 0);
  }, 0);

  // Handle body scroll lock when sidebar is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show) {
    return null;
  }

  function closeSidebar(e, force = false) {
    if (force || (ref.current && !ref.current.contains(e.target))) {
      const sidebar = document.querySelector(".slideIn");
      if (sidebar) {
        sidebar.classList.remove("slideIn");
        sidebar.classList.add("slideOut");
      }
      setTimeout(() => {
        setShow(false);
      }, 300);
    }
  }

  const handleCheckout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    closeSidebar(e, true);
    setTimeout(() => {
      router.push("/checkout");
    }, 300);
  };

  return (
    <div
      onClick={(e) => closeSidebar(e, false)}
      className="fixed inset-0 z-50 fadeIn"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Sidebar Panel */}
      <div
        ref={ref}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl slideIn flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple/10 rounded-full">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-purple"
              >
                <path
                  d="M7.5 7.67V6.7c0-2.25 1.81-4.46 4.06-4.67a4.5 4.5 0 0 1 4.94 4.48v1.38"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 22h6c4.02 0 4.74-1.61 4.95-3.57l.75-6c.27-2.44-.43-4.43-4.7-4.43H8c-4.27 0-4.97 1.99-4.7 4.43l.75 6C4.26 20.39 4.98 22 9 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.495 12h.01M8.495 12h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
              <p className="text-sm text-gray-500">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeSidebar(e, true);
            }}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close cart"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 text-gray-400"
                >
                  <path
                    d="M7.5 7.67V6.7c0-2.25 1.81-4.46 4.06-4.67a4.5 4.5 0 0 1 4.94 4.48v1.38"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 22h6c4.02 0 4.74-1.61 4.95-3.57l.75-6c.27-2.44-.43-4.43-4.7-4.43H8c-4.27 0-4.97 1.99-4.7 4.43l.75 6C4.26 20.39 4.98 22 9 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs">
                Looks like you haven't added any custom designs yet. Start creating!
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeSidebar(e, true);
                }}
                className="px-6 py-2.5 bg-purple text-white rounded-lg font-medium hover:bg-purple/90 transition-colors duration-200"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item, index) => (
                <li
                  key={item.id || index}
                  className="group flex gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  {/* Product Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={item?.image}
                      alt={item?.name || "Product"}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {item?.qty || 1}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 capitalize truncate">
                      {typeof item?.name === 'object' ? item?.name?.name || 'Product' : item?.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">
                      {typeof item?.variant === 'object' ? item?.variant?.name || 'Custom Design' : item?.variant}
                    </p>
                    <p className="text-purple font-bold mt-2">
                      NPR {(typeof item?.price === 'object' ? item?.price?.price : item?.price)?.toLocaleString()}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItemFromCart(item.id, item.name);
                    }}
                    className="self-start p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                    aria-label="Remove item"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                    >
                      <path
                        d="M10 12L14 16M14 12L10 16M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-white">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-lg font-bold text-gray-900">
                NPR {totalPrice.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Shipping and taxes calculated at checkout
            </p>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-purple text-white rounded-xl font-semibold hover:bg-purple/90 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Continue Shopping */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeSidebar(e, true);
              }}
              className="w-full py-3 text-gray-600 font-medium hover:text-purple transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
