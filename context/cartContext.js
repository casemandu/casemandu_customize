"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Create the context
const CartContext = createContext();

// Provide the context to the component tree
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  // Store custom images and coordinates separately (can't store File in localStorage)
  const [customImages, setCustomImages] = useState(new Map());
  const [customCoordinates, setCustomCoordinates] = useState(new Map());
  // Callback to open sidebar when item is added
  const [openSidebarCallback, setOpenSidebarCallback] = useState(null);

  // Load cart data from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem("cartItems");
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
      // Load custom coordinates from localStorage
      const storedCoordinates = localStorage.getItem("customCoordinates");
      if (storedCoordinates) {
        try {
          setCustomCoordinates(new Map(JSON.parse(storedCoordinates)));
        } catch (e) {
          console.error("Error loading custom coordinates:", e);
        }
      }
    }
  }, []);

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      // Save custom coordinates to localStorage (File objects are stored in memory only)
      const coordinatesArray = Array.from(customCoordinates.entries());
      localStorage.setItem("customCoordinates", JSON.stringify(coordinatesArray));
    }
  }, [cartItems, customCoordinates]);

  // Function to add an item to the cart
  const addItemToCart = (item, customImage = null, customCaseCoordinates = null) => {
    setCartItems((prevItems) => [...prevItems, item]);
    // Store custom image and coordinates if provided
    if (customImage && item.id) {
      setCustomImages((prev) => {
        const newMap = new Map(prev);
        newMap.set(item.id, customImage);
        return newMap;
      });
    }
    if (customCaseCoordinates && item.id) {
      setCustomCoordinates((prev) => {
        const newMap = new Map(prev);
        newMap.set(item.id, customCaseCoordinates);
        return newMap;
      });
    }
    // Open sidebar when item is added
    if (openSidebarCallback) {
      openSidebarCallback();
    }
  };

  // remove all items from cart
  const clearCart = () => {
    setCartItems([]);
    setCustomImages(new Map());
    setCustomCoordinates(new Map());
  };

  // Function to remove an item from the cart
  const removeItemFromCart = (itemId, itemName = "item") => {
    // Show confirmation toast with action buttons
    toast("Are you sure you want to remove this item from the cart?", {
      action: {
        label: "Remove",
        onClick: () => {
          setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
          // Clean up custom image and coordinates
          setCustomImages((prev) => {
            const newMap = new Map(prev);
            newMap.delete(itemId);
            return newMap;
          });
          setCustomCoordinates((prev) => {
            const newMap = new Map(prev);
            newMap.delete(itemId);
            return newMap;
          });
          toast.success("Item removed from cart");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      duration: 5000,
    });
  };

  // Function to get custom image for a cart item
  const getCustomImage = (itemId) => {
    return customImages.get(itemId) || null;
  };

  // Function to get custom coordinates for a cart item
  const getCustomCoordinates = (itemId) => {
    return customCoordinates.get(itemId) || null;
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addItemToCart, 
        removeItemFromCart, 
        clearCart,
        getCustomImage,
        getCustomCoordinates,
        customImages,
        customCoordinates,
        setOpenSidebarCallback
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
