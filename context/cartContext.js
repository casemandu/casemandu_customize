"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Helper function to convert File to base64 with timeout for mobile
const fileToBase64 = (file, timeout = 30000) => {
  return new Promise((resolve, reject) => {
    // Check if file exists and is valid
    if (!file || !(file instanceof File || file instanceof Blob)) {
      reject(new Error("Invalid file object"));
      return;
    }

    const reader = new FileReader();
    let timeoutId;

    // Set timeout for mobile devices
    timeoutId = setTimeout(() => {
      reader.abort();
      reject(new Error("Image conversion timed out. Please try again with a smaller image."));
    }, timeout);

    reader.onload = () => {
      clearTimeout(timeoutId);
      if (reader.result) {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = (error) => {
      clearTimeout(timeoutId);
      reject(new Error("Error reading file. Please try again."));
    };

    reader.onabort = () => {
      clearTimeout(timeoutId);
      reject(new Error("File reading was aborted"));
    };

    try {
      reader.readAsDataURL(file);
    } catch (error) {
      clearTimeout(timeoutId);
      reject(new Error("Failed to process image. Please try a different image."));
    }
  });
};

// Helper function to convert base64 to Blob (which can be used like a File)
const base64ToBlob = (base64, mimeType = 'image/png') => {
  try {
    if (!base64 || typeof base64 !== 'string') {
      throw new Error('Invalid base64 string');
    }
    
    // Handle data URL format (data:image/png;base64,...)
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
    
    if (!base64Data) {
      throw new Error('No base64 data found');
    }
    
    // Check if atob is available (should be in browsers)
    if (typeof atob === 'undefined') {
      throw new Error('atob is not available');
    }
    
    const byteString = atob(base64Data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  } catch (error) {
    console.error('Error converting base64 to blob:', error);
    throw new Error('Failed to convert image data. Please try uploading again.');
  }
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
    if (typeof window === 'undefined') return;
    
    try {
      // Check if localStorage is available and accessible
      if (!window.localStorage) {
        console.warn('localStorage is not available');
        return;
      }

      const storedCart = localStorage.getItem("cartItems");
      let loadedCartItems = [];
      if (storedCart) {
        try {
          loadedCartItems = JSON.parse(storedCart);
          // Validate loaded items
          if (!Array.isArray(loadedCartItems)) {
            loadedCartItems = [];
          }
        } catch (e) {
          console.error("Error loading cart items:", e);
          // Clear corrupted data
          try {
            localStorage.removeItem("cartItems");
          } catch (clearError) {
            console.error("Error clearing corrupted cart data:", clearError);
          }
        }
      }

      // Load custom coordinates from localStorage
      try {
        const storedCoordinates = localStorage.getItem("customCoordinates");
        if (storedCoordinates) {
          try {
            const parsed = JSON.parse(storedCoordinates);
            if (Array.isArray(parsed)) {
              setCustomCoordinates(new Map(parsed));
            }
          } catch (e) {
            console.error("Error loading custom coordinates:", e);
            // Clear corrupted data
            try {
              localStorage.removeItem("customCoordinates");
            } catch (clearError) {
              console.error("Error clearing corrupted coordinates:", clearError);
            }
          }
        }
      } catch (e) {
        console.error("Error accessing customCoordinates:", e);
      }

      // Load custom images from localStorage (stored as base64)
      try {
        const storedImages = localStorage.getItem("customImages");
        if (storedImages) {
          try {
            const imagesArray = JSON.parse(storedImages);
            if (!Array.isArray(imagesArray)) {
              throw new Error('Invalid images array format');
            }
            
            const imagesMap = new Map();
            // Convert base64 strings back to File objects and restore image URLs
            for (const [itemId, imageData] of imagesArray) {
              if (imageData && imageData.base64 && itemId) {
                try {
                  const blob = base64ToBlob(imageData.base64, imageData.mimeType || 'image/png');
                  // Create a File-like object from Blob
                  const file = new File([blob], imageData.name || 'custom-image.png', {
                    type: imageData.mimeType || 'image/png'
                  });
                  imagesMap.set(itemId, file);

                  // Restore the image URL in the cart item (use base64 data URL directly)
                  const cartItem = loadedCartItems.find(item => item && item.id === itemId);
                  if (cartItem) {
                    cartItem.image = imageData.base64; // Use base64 data URL directly
                  }
                } catch (imageError) {
                  console.error(`Error processing image for item ${itemId}:`, imageError);
                  // Skip this image but continue with others
                }
              }
            }
            setCustomImages(imagesMap);
          } catch (e) {
            console.error("Error loading custom images:", e);
            // Clear corrupted image data
            try {
              localStorage.removeItem("customImages");
            } catch (clearError) {
              console.error("Error clearing corrupted images:", clearError);
            }
          }
        }
      } catch (e) {
        console.error("Error accessing customImages:", e);
      }
      
      // Update cart items with restored image URLs
      if (loadedCartItems.length > 0) {
        setCartItems(loadedCartItems);
      }
    } catch (error) {
      console.error("Critical error in cart initialization:", error);
      // Don't crash the app, just log the error
    }
  }, []);

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Check if localStorage is available
      if (!window.localStorage) {
        console.warn('localStorage is not available');
        return;
      }

      // Save cart items
      try {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
      } catch (e) {
        console.error("Error saving cart items:", e);
        // Handle quota exceeded error
        if (e.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded, clearing old data');
          try {
            localStorage.removeItem("customImages");
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
          } catch (clearError) {
            console.error("Error clearing localStorage:", clearError);
          }
        }
      }

      // Save custom coordinates to localStorage
      try {
        const coordinatesArray = Array.from(customCoordinates.entries());
        localStorage.setItem("customCoordinates", JSON.stringify(coordinatesArray));
      } catch (e) {
        console.error("Error saving custom coordinates:", e);
      }

      // Save custom images to localStorage as base64
      if (customImages.size > 0) {
        const saveImages = async () => {
          try {
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
            
            // Try to save, handle quota errors
            try {
              localStorage.setItem("customImages", JSON.stringify(imagesArray));
            } catch (saveError) {
              if (saveError.name === 'QuotaExceededError') {
                console.warn('localStorage quota exceeded for images, skipping save');
              } else {
                throw saveError;
              }
            }
          } catch (error) {
            console.error("Error saving custom images:", error);
          }
        };
        saveImages();
      } else {
        // Clear images from localStorage if map is empty
        try {
          localStorage.removeItem("customImages");
        } catch (e) {
          console.error("Error removing custom images:", e);
        }
      }
    } catch (error) {
      console.error("Critical error saving to localStorage:", error);
    }
  }, [cartItems, customCoordinates, customImages]);

  // Function to add an item to the cart
  const addItemToCart = async (item, customImage = null, customCaseCoordinates = null) => {
    try {
      // If there's a custom image, convert it to base64 and update item.image
      if (customImage && item.id) {
        try {
          // Validate file size (max 10MB for mobile compatibility)
          const maxSize = 10 * 1024 * 1024; // 10MB
          if (customImage.size > maxSize) {
            throw new Error("Image size is too large. Please use an image smaller than 10MB.");
          }

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
          // Re-throw the error so the calling function can handle it
          throw error;
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
    } catch (error) {
      // Re-throw to let the calling function handle the error
      throw error;
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
