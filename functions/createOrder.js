/**
 * Create order with multiple custom images
 * @param {Object} data - Customer data (name, email, phone, address, district, additionalInfo)
 * @param {Array} cart - Cart items array
 * @param {Object} promo - Promo code object
 * @param {Number} grandTotal - Total amount
 * @param {File} paymentImage - Payment screenshot file
 * @param {String} paymentMethod - Payment method name
 * @param {Array} customImagesArray - Array of {itemId, file, coordinates} for each custom item
 */
export async function createOrder(
  data,
  cart,
  promo,
  grandTotal,
  paymentImage,
  paymentMethod,
  customImagesArray = []
) {
  // Create FormData for multipart/form-data request
  const formData = new FormData();

  // Append all order fields individually
  if (data.name) formData.append("name", data.name);
  if (data.email) formData.append("email", data.email);
  if (data.phone) formData.append("phone", data.phone);
  if (data.address) formData.append("shippingAddress", data.address);
  if (data.district) formData.append("city", data.district);
  if (data.additionalInfo) formData.append("additionalInfo", data.additionalInfo);
  if (paymentMethod) formData.append("paymentMethod", paymentMethod);
  
  // Format and stringify orderItems - backend requires this field
  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    console.error("Cart is empty or invalid:", cart);
    throw new Error("Cart is empty. Please add items to cart before placing order.");
  }

  // Create a map of itemId to custom data for quick lookup
  const customDataMap = new Map();
  if (Array.isArray(customImagesArray)) {
    customImagesArray.forEach((customData) => {
      if (customData && customData.itemId) {
        customDataMap.set(customData.itemId, customData);
      }
    });
  }

  // Transform cart items to match backend expected format
  // Each item includes: qty, price, variant, isCustom, customImage (URL placeholder), customCaseCoordinates
  const orderItems = cart
    .filter((item) => {
      // More detailed validation
      if (!item) {
        console.warn("Found null/undefined item in cart");
        return false;
      }
      // Handle name being either string or object
      const itemName = typeof item.name === 'object' ? item.name?.name : item.name;
      if (!itemName || (typeof itemName === 'string' && itemName.trim() === "")) {
        console.warn("Item missing name:", item);
        return false;
      }
      // Handle price being either number or object
      const itemPrice = typeof item.price === 'object' ? item.price?.price : item.price;
      if (itemPrice === undefined || itemPrice === null || isNaN(Number(itemPrice))) {
        console.warn("Item missing or invalid price:", item);
        return false;
      }
      return true;
    })
    .map((item) => {
      // Check if this item has custom image data
      const customData = customDataMap.get(item.id);
      const hasCustomImage = !!customData && !!customData.file;
      
      // Handle cases where name, variant, or price might be objects instead of primitives
      const itemName = typeof item.name === 'object' ? (item.name?.name || 'Product') : item.name;
      const itemVariant = typeof item.variant === 'object' ? (item.variant?.name || 'Custom Design') : (item.variant || 'Custom Design');
      const itemPrice = typeof item.price === 'object' ? Number(item.price?.price) : Number(item.price);
      
      // Backend expects orderItems with: qty, price, variant, isCustom, customCaseCoordinates
      const formattedItem = {
        name: itemName,
        qty: Number(item.qty) || 1,
        price: itemPrice || 0,
        variant: itemVariant,
        isCustom: hasCustomImage,
      };
      
      // Include customCaseCoordinates if available
      if (customData && customData.coordinates) {
        formattedItem.customCaseCoordinates = {
          height: customData.coordinates.height || 0,
          width: customData.coordinates.width || 0,
          x: customData.coordinates.x || 0,
          y: customData.coordinates.y || 0,
        };
      } else {
        formattedItem.customCaseCoordinates = {
          height: 0,
          width: 0,
          x: 0,
          y: 0,
        };
      }
      
      // Include product ID if available (for phone cases)
      if (item.productId || item.product) {
        formattedItem.product = item.productId || item.product;
      }
      
      // Include brand and model info for better order tracking
      if (item.brandName) {
        formattedItem.brandName = item.brandName;
      }
      if (item.modelName) {
        formattedItem.modelName = item.modelName;
      }
      if (item.caseType) {
        formattedItem.caseType = item.caseType;
      }
      if (item.productType) {
        formattedItem.productType = item.productType;
      }
      
      return formattedItem;
    });

  // Validate that we have at least one valid order item
  if (orderItems.length === 0) {
    console.error("No valid order items after transformation. Original cart:", cart);
    throw new Error("No valid items in cart. Please check your cart items have name and price.");
  }

  // Always append orderItems (backend requires this field)
  // Ensure it's a valid JSON string
  const orderItemsJson = JSON.stringify(orderItems);
  
  // Verify the JSON is valid before appending
  try {
    const parsed = JSON.parse(orderItemsJson); // Validate JSON is parseable
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("orderItems must be a non-empty array");
    }
  } catch (e) {
    console.error("Failed to validate orderItems JSON:", e);
    throw new Error("Failed to format order items. Please try again.");
  }
  
  // Append orderItems - backend requires this field
  formData.append("orderItems", orderItemsJson);

  
  if (promo && promo.code) {
    formData.append("priceSummary", JSON.stringify({
      promoCode: promo.code,
      total: grandTotal,
      deliveryCharge: 150,
    }));
  } else {
    formData.append("priceSummary", JSON.stringify({
      promoCode: null,
      total: grandTotal,
      deliveryCharge: 150,
    }));
  }

  // Append payment image as binary file directly (not uploaded to imgbb)
  if (paymentImage && (paymentImage instanceof File || paymentImage instanceof Blob)) {
    formData.append("paymentImage", paymentImage, paymentImage.name || "payment-proof");
  }

  // Append multiple customImage files - one for each custom order item
  // Files are appended in the same order as orderItems for backend to match them
  cart.forEach((item) => {
    const customData = customDataMap.get(item.id);
    if (customData && customData.file && (customData.file instanceof File || customData.file instanceof Blob)) {
      formData.append("customImage", customData.file, customData.file.name || `custom-${item.id}`);
    }
  });

  const api = process.env.NEXT_PUBLIC_API_URL ||"https://casemandu-api.onrender.com";

  if (!api) {
    throw new Error("NEXT_PUBLIC_BACKEND environment variable is not set");
  }

  try {
    
    const res = await fetch(api + "/api/orders", {
      method: "POST",
      // Don't set Content-Type header - browser will set it with boundary for FormData
      body: formData,
    });

    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.json();
      } catch (e) {
        const text = await res.text();
        errorData = { message: text || "Unknown error" };
      }
      
      // Check if the error is specifically about order items
      const errorMessage = errorData.message || errorData.error || `Order creation failed with status ${res.status}`;
      if (errorMessage.toLowerCase().includes("order item") || errorMessage.toLowerCase().includes("no order")) {
        console.error("Backend reported no order items. Sent orderItems:", orderItems);
      }
      
      throw new Error(errorMessage);
    }

  const val = await res.json();
  return val;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}
