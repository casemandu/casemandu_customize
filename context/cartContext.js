"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Helper function to convert File to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to convert base64 to Blob (which can be used like a File)
const base64ToBlob = (base64, mimeType = 'image/png') => {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
};

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
      let loadedCartItems = [];
      if (storedCart) {
        try {
          loadedCartItems = JSON.parse(storedCart);
        } catch (e) {
          console.error("Error loading cart items:", e);
        }
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

      // Load custom images from localStorage (stored as base64)
      const storedImages = localStorage.getItem("customImages");
      if (storedImages) {
        try {
          const imagesArray = JSON.parse(storedImages);
          const imagesMap = new Map();
          // Convert base64 strings back to File objects and restore image URLs
          for (const [itemId, imageData] of imagesArray) {
            if (imageData && imageData.base64) {
              const blob = base64ToBlob(imageData.base64, imageData.mimeType || 'image/png');
              // Create a File-like object from Blob
              const file = new File([blob], imageData.name || 'custom-image.png', {
                type: imageData.mimeType || 'image/png'
              });
              imagesMap.set(itemId, file);

              // Restore the image URL in the cart item (use base64 data URL directly)
              const cartItem = loadedCartItems.find(item => item.id === itemId);
              if (cartItem) {
                cartItem.image = imageData.base64; // Use base64 data URL directly
              }
            }
          }
          setCustomImages(imagesMap);
          // Update cart items with restored image URLs
          if (loadedCartItems.length > 0) {
            setCartItems(loadedCartItems);
          }
        } catch (e) {
          console.error("Error loading custom images:", e);
          // Still set cart items even if image loading fails
          if (loadedCartItems.length > 0) {
            setCartItems(loadedCartItems);
          }
        }
      } else {
        // No images to load, just set cart items
        if (loadedCartItems.length > 0) {
          setCartItems(loadedCartItems);
        }
      }
    }
  }, []);

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      // Save custom coordinates to localStorage
      const coordinatesArray = Array.from(customCoordinates.entries());
      localStorage.setItem("customCoordinates", JSON.stringify(coordinatesArray));

      // Save custom images to localStorage as base64
      if (customImages.size > 0) {
        const saveImages = async () => {
          const imagesArray = [];
          for (const [itemId, file] of customImages.entries()) {
            if (file instanceof File || file instanceof Blob) {
              try {
                const base64 = await fileToBase64(file);
                imagesArray.push([
                  itemId,
                  {
                    base64,
                    mimeType: file.type || 'image/png',
                    name: file.name || 'custom-image.png'
                  }
                ]);
              } catch (error) {
                console.error(`Error converting image for item ${itemId}:`, error);
              }
            }
          }
          localStorage.setItem("customImages", JSON.stringify(imagesArray));
        };
        saveImages();
      } else {
        // Clear images from localStorage if map is empty
        localStorage.removeItem("customImages");
      }
    }
  }, [cartItems, customCoordinates, customImages]);

  // Function to add an item to the cart
  const addItemToCart = async (item, customImage = null, customCaseCoordinates = null) => {
  // If there's a custom image, convert it to base64 and update item.image
    if (customImage && item.id) {
      try {
        const base64 = await fileToBase64(customImage);
        // Update item.image to use base64 data URL instead of blob URL
        // Create a new item object to avoid mutating the original
        const updatedItem = { ...item, image: base64 };

        // Store the File object in customImages Map
        setCustomImages((prev) => {
          const newMap = new Map(prev);
          newMap.set(item.id, customImage);
          return newMap;
        });

        // Add the item with base64 image to cart
        setCartItems((prevItems) => [...prevItems, updatedItem]);
      } catch (error) {
        console.error("Error converting image to base64:", error);
      // Fallback: keep the blob URL but still store the File object
        setCustomImages((prev) => {
          const newMap = new Map(prev);
          newMap.set(item.id, customImage);
          return newMap;
        });
        setCartItems((prevItems) => [...prevItems, item]);
      }
    } else {
      // No custom image, just add the item as is
      setCartItems((prevItems) => [...prevItems, item]);
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem("customImages");
    }
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
          // Also remove from localStorage
          if (typeof window !== 'undefined') {
            const storedImages = localStorage.getItem("customImages");
            if (storedImages) {
              try {
                const imagesArray = JSON.parse(storedImages);
                const filtered = imagesArray.filter(([id]) => id !== itemId);
                if (filtered.length > 0) {
                  localStorage.setItem("customImages", JSON.stringify(filtered));
                } else {
                  localStorage.removeItem("customImages");
                }
              } catch (e) {
                console.error("Error removing image from localStorage:", e);
              }
            }
          }
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
