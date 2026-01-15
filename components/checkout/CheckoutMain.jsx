"use client";
import { useCart } from "@/context/cartContext";
import React, { useEffect } from "react";
import Payment from "./Payment";
import { verifyPromo } from "@/functions/VerifyPromo";
import PaymentModal from "./PaymentModel";
import { toast } from "sonner";

function CheckoutMain() {
  const { cartItems } = useCart();
  const [activePayment, setActivePayment] = React.useState(null);
  const [grandTotal, setGrandTotal] = React.useState(0);
  const [promo, setPromo] = React.useState([]);
  const [showPop, setShowPop] = React.useState(false);
  const [promodDiscount, setPromoDiscount] = React.useState(0);

  const [data, setData] = React.useState({
    name: "",
    phone: "",
    district: "",
    address: "",
    promo: "",
    additionalInfo: "Customise",
    paymentMethod: "",
    email: "",
  });

  const districts = [
    "Achham",
    "Arghakhanchi",
    "Baglung",
    "Baitadi",
    "Bajhang",
    "Bajura",
    "Banke",
    "Bara",
    "Bardiya",
    "Bhaktapur",
    "Bhojpur",
    "Chitwan",
    "Dadeldhura",
    "Darchula",
    "Dhading",
    "Dhankuta",
    "Dhanusha",
    "Dolakha",
    "Dolpa",
    "Doti",
    "East Rukum",
    "Gorkha",
    "Gulmi",
    "Humla",
    "Ilam",
    "Jhapal",
    "Jumla",
    "Kailali",
    "Kalikot",
    "Kanchanpur",
    "Kapilvastu",
    "Kaski",
    "Kathmandu",
    "Kavrepalanchok",
    "Khotang",
    "Lalitpur",
    "Lamjung",
    "Mahottari",
    "Makwanpur",
    "Manang",
    "Morang",
    "Mugu",
    "Mustang",
    "Myagdi",
    "Nawalpur",
    "Nuwakot",
    "Okhaldhunga",
    "Palpa",
    "Parbat",
    "Parsa",
    "Panchthar",
    "Pyuthan",
    "Ramechhap",
    "Rasuwa",
    "Rautahat",
    "Rolpa",
    "Rupandehi",
    "Salyan",
    "Sankhuwasabha",
    "Saptari",
    "Sarlahi",
    "Sindhuli",
    "Sindhupalchok",
    "Siraha",
    "Solukhumbu",
    "Sunsari",
    "Surkhet",
    "Syangja",
    "Tanahun",
    "Taplejung",
    "Terhathum",
    "Udayapur",
    "West Rukum",
  ];

  const payments = [
    {
      id: 1,
      name: "Esewa",
      image: "https://www.casemandu.com.np/images/payments/esewa.png",
      qr: "https://www.casemandu.com.np/images/payments/esewa-qr.png",
    },
    {
      id: 2,
      name: "Khalti",
      image: "https://www.casemandu.com.np/images/payments/khalti.jpg",
      qr: "https://www.casemandu.com.np/images/payments/khalti-qr.png",
    },
    {
      id: 3,
      name: "GBIME Bank",
      image: "https://www.casemandu.com.np/images/payments/gbime.png",
      qr: "https://www.casemandu.com.np/images/payments/gbime-qr.png",
    },
  ];

  async function verpromo() {
    if (!promo) return;
    const res = await verifyPromo(data.promo);
    if (res) {
      toast.success("Promo code applied successfully");
      setPromo(res);
    } else {
      toast.error("Promo code not valid");
    }
  }

  useEffect(() => {
    let dis =
      (grandTotal * promo?.discount) / 100 > promo?.maxAmount
        ? promo?.maxAmount
        : (grandTotal * promo?.discount) / 100;
    setPromoDiscount(dis);
  }, [promo]);

  function checkIfFormFIlled() {
    if (
      data.name === "" ||
      data.phone === "" ||
      data.district === "" ||
      data.address === "" ||
      data.email === ""
    ) {
      toast.error("Please fill all the required fields");
      return false;
    }
    if (activePayment === null) {
      toast.error("Please select a payment method");
      return false;
    }
    setShowPop(true);
  }

  useEffect(() => {
    let grand = cartItems.reduce((acc, item) => {
      const itemPrice = typeof item.price === 'object' ? item.price?.price : item.price;
      return acc + (Number(itemPrice) || 0);
    }, 0);
    setGrandTotal(grand);
  }, [cartItems]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      {cartItems.length === 0 ? (
        <div className="text-2xl">No items in cart</div>
      ) : (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8 p-4 pt-12 w-full">
          {/* Order Summary */}
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <p className="text-gray-600/60 mb-4">
              Check your items and select a suitable payment method.
            </p>
            <div className="flex flex-col gap-3">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="border p-4 rounded-md mb-4 flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={typeof item.name === 'object' ? item.name?.name || 'Product' : item.name}
                      className="w-20 h-20 object-cover rounded-md mr-4"
                    />
                    <div className="flex flex-col gap-2">
                      <p>
                        <span className="font-semibold capitalize">
                          {typeof item.name === 'object' ? item.name?.name || 'Product' : item.name}
                        </span>
                      </p>
                      <p className="text-gray-600/60">
                        {typeof item.variant === 'object' ? item.variant?.name || 'Custom Design' : item.variant}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold">Rs {typeof item.price === 'object' ? item.price?.price : item.price}</p>
                </div>
              ))}
            </div>

            {/* Payment Method */}
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="flex gap-4">
              {payments.map((payment) => (
                <Payment
                  key={payment.id}
                  payment={payment}
                  activePayment={activePayment}
                  setActivePayment={setActivePayment}
                />
              ))}
            </div>
          </div>

          {/* Shipping Details */}
          <div className="w-full mt-6 bg-gray-100 p-8">
            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
            <div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Full Name *</label>
                <input
                  onChange={(e) => {
                    setData({ ...data, name: e.target.value });
                  }}
                  type="text"
                  placeholder="Eg. John Doe"
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">
                  Email *
                </label>
                <input
                  onChange={(e) => {
                    setData({ ...data, email: e.target.value });
                  }}
                  type="email"
                  placeholder="Eg. john.doe@gmail.com"
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">
                  Phone Number *
                </label>
                <input
                  onChange={(e) => {
                    setData({ ...data, phone: e.target.value });
                  }}
                  type="text"
                  placeholder="98XXXXXXXX"
                  className="w-full border rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">
                  District / City *
                </label>
                <select
                  onChange={(e) => {
                    setData({ ...data, district: e.target.value });
                  }}
                  className="w-full border rounded-md p-2"
                >
                  <option value={""}>Select a district...</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Address *</label>
                <input
                  onChange={(e) => {
                    setData({ ...data, address: e.target.value });
                  }}
                  type="text"
                  placeholder="Enter your address"
                  className="w-full border rounded-md p-2"
                />
              </div>
              <p className="text-gray-600 mb-4">
                Delivery time: 2-3 days inside the valley, 4-5 days outside.
              </p>

              <div className="mb-4">
                <label className="block text-gray-600 mb-1">Promo Code </label>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    onChange={(e) => {
                      setData({ ...data, promo: e.target.value });
                    }}
                    type="text"
                    placeholder="Enter promo code"
                    className=" border rounded-md p-2 w-9/12"
                  />
                  <button
                    onClick={(e) => {
                      verpromo(e);
                    }}
                    className="bg-purple text-white px-4 py-2 rounded-md w-3/12"
                  >
                    Apply Promo
                  </button>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <p>Subtotal</p>
                  <p>Rs {grandTotal}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p>Shipping</p>
                  <p>Rs 150</p>
                </div>
                {!!promo?.code && (
                  <div className="flex justify-between mb-2">
                    <p>Promocode ({promo?.code})</p>
                    <p>Rs {promodDiscount}</p>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  {(!promodDiscount && <p>Rs {grandTotal + 150}</p>) || (
                    <p>Rs {grandTotal + 150 - promodDiscount}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  checkIfFormFIlled();
                }}
                className="bg-purple hover:bg-purple/80 duration-300 text-white w-full py-2 mt-4 rounded-md"
              >
                Place Order
              </button>
            </div>
          </div>
          {showPop && (
            <PaymentModal
              payments={payments}
              paymentType={activePayment}
              data={data}
              grandTotal={grandTotal}
              promo={promo}
              onClose={setShowPop}
              isOpen={showPop}
              cart={cartItems}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default CheckoutMain;
