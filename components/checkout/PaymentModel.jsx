"use client";
import { createOrder } from "@/functions/createOrder";
import { useState } from "react";
import { useCart } from "@/context/cartContext";
import { toast } from "sonner";

export default function PaymentModal({
  isOpen,
  onClose,
  payments,
  paymentType,
  promo,
  grandTotal,
  data,
  cart,
}) {
  const [file, setFile] = useState(null);
  const paymentQr = payments[paymentType - 1];
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [order, setOrder] = useState(null);
  const { clearCart, getCustomImage, getCustomCoordinates } = useCart();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please upload the payment screenshot");
      return;
    }
    
    setLoading(true);

    // Collect all custom images and coordinates for each cart item
    const customImagesArray = [];
    for (const item of cart) {
      const img = getCustomImage(item.id);
      const coords = getCustomCoordinates(item.id);
      if (img) {
        customImagesArray.push({
          itemId: item.id,
          file: img,
          coordinates: coords || { height: 0, width: 0, x: 0, y: 0 },
        });
      }
    }

    try {
      // Validate cart before sending
      if (!cart || !Array.isArray(cart) || cart.length === 0) {
        toast.error("Your cart is empty. Please add items to cart before placing order.");
        setLoading(false);
        return;
      }

      // Validate cart items have required fields (handle object values)
      const validCartItems = cart.filter(item => {
        if (!item) return false;
        const itemName = typeof item.name === 'object' ? item.name?.name : item.name;
        const itemPrice = typeof item.price === 'object' ? item.price?.price : item.price;
        return itemName && itemPrice !== undefined && itemPrice !== null && !isNaN(Number(itemPrice));
      });

      if (validCartItems.length === 0) {
        toast.error("No valid order items. Please check your cart items have name and price.");
        setLoading(false);
        return;
      }

      // Use validated cart items with all custom images
      const res = await createOrder(
        data,
        validCartItems,
        promo,
        grandTotal,
        file,
        paymentQr.name,
        customImagesArray
      );

      if (res && res.data._id) {
        setSuccess(true);
        setOrder(res);
        clearCart();
        toast.success("Order placed successfully!");
        setTimeout(() => {
          window.location.href = ("https://casemandu.com.np/order/" + res.data._id);
        }, 1500);
      } else {
        toast.error("Order creation failed. Please try again.");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(error.message || "Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2 sm:p-4 md:p-5">
      <div
        className="max-w-3xl w-full max-h-[95vh] overflow-y-auto"
        bis_skin_checked={1}
      >
        {!success && (
          <div
            className="relative h-auto bg-white rounded-lg p-4 sm:p-5 md:p-6 mx-auto"
            bis_skin_checked={1}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              onClick={() => {
                onClose(false);
              }}
              strokeWidth={0}
              viewBox="0 0 24 24"
              className="rotate-45 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 absolute right-2 top-2 sm:right-3 sm:top-3 md:right-4 md:top-4 cursor-pointer hover:text-black/75 hover:bg-black/10 rounded-full duration-300 z-40"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11.75 4.5a.75.75 0 0 1 .75.75V11h5.75a.75.75 0 0 1 0 1.5H12.5v5.75a.75.75 0 0 1-1.5 0V12.5H5.25a.75.75 0 0 1 0-1.5H11V5.25a.75.75 0 0 1 .75-.75Z" />
            </svg>
            <h1 className="text-xl sm:text-2xl font-medium pr-8 sm:pr-10">
              Pay Now with
              <span className="text-primary"> {paymentQr.name}</span>
            </h1>
            <p className="text-xs sm:text-sm mt-2 sm:mt-3 text-gray-900">
              "Pay <span className="font-semibold">Rs 300</span> per cover in
              advance to confirm your order (e.g.,{" "}
              <span className="font-semibold">Rs 600</span> for{" "}
              <span className="font-semibold">2</span> covers), and settle the
              rest upon delivery!"
            </p>
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start mt-4 sm:mt-5"
              bis_skin_checked={1}
            >
              <div className="flex flex-col items-center sm:items-start" bis_skin_checked={1}>
                <h2 className="text-sm sm:text-base text-gray-900 font-medium w-full text-center sm:text-left">Payment Method</h2>
                <div className="w-full flex justify-center sm:justify-start mt-3 sm:mt-5">
                  <img
                    className="w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px] aspect-square border border-black object-contain rounded-lg"
                    src={paymentQr.qr}
                    alt="Khalti"
                    width={710}
                    height={710}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-start" bis_skin_checked={1}>
                <h2 className="text-sm sm:text-base text-gray-900 font-medium w-full text-center sm:text-left">
                  Upload your Payment Screenshot{" "}
                  <span className="ms-1 text-red-500">*</span>
                </h2>
                <label
                  htmlFor="paymentImage"
                  className="w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px] aspect-square mt-3 sm:mt-5 flex flex-col items-center justify-center border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 hover:bg-gray-100 rounded-lg"
                >
                  {(!file && (
                    <div
                      className="flex flex-col items-center justify-center pt-5 pb-6 px-4"
                      bis_skin_checked={1}
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 16 16"
                        className="w-5 h-5 sm:w-6 sm:h-6 mb-3 sm:mb-4 text-gray-500"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
                      </svg>
                      <p className="mb-2 text-xs sm:text-sm text-gray-500 text-center">
                        Click to upload
                      </p>
                    </div>
                  )) || (
                    <img
                      disabled={loading}
                      onDoubleClick={() => {
                        setFile(null);
                      }}
                      className="w-full h-full object-cover rounded-lg"
                      src={URL.createObjectURL(file)}
                      alt="payment"
                    />
                  )}
                  <input
                    disabled={loading}
                    accept="image/*"
                    onChange={handleFileChange}
                    id="paymentImage"
                    className="hidden"
                    type="file"
                  />
                </label>
              </div>
            </div>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-purple text-white hover:bg-purple/90 h-10 sm:h-11 px-4 py-2 mt-4 sm:mt-5 w-full"
            >
              {loading ? "Creating Order" : "Confirm Payment"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
