import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCreditCard, FiCheck } from "react-icons/fi";
import { createOrder } from "../store/slices/orderSlice";
import { clearCartState } from "../store/slices/cartSlice";
import { formatPrice } from "../utils/formatPrice";
import toast from "react-hot-toast";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.orders);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
  });

  const shippingPrice = totalPrice > 999 ? 0 : 99;
  const taxPrice = Math.round(totalPrice * 0.18);
  const grandTotal = totalPrice + shippingPrice + taxPrice;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    try {
      await dispatch(
        createOrder({
          shippingAddress: address,
          paymentIntentId: "demo_payment_" + Date.now(),
        }),
      ).unwrap();
      dispatch(clearCartState());
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error(err || "Failed to place order");
    }
  };

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 ">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {[
          { num: 1, label: "Shipping", icon: <FiMapPin /> },
          { num: 2, label: "Payment", icon: <FiCreditCard /> },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 ${step >= s.num ? "text-amber-500" : "text-neutral-400"}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step > s.num ? "bg-emerald-500 text-white" : step === s.num ? "bg-amber-500 text-neutral-900" : "bg-neutral-200"}`}
              >
                {step > s.num ? <FiCheck /> : s.icon}
              </div>
              <span className="font-medium text-sm hidden sm:block">
                {s.label}
              </span>
            </div>
            {s.num < 2 && (
              <div
                className={`w-12 md:w-24 h-0.5 ${step > 1 ? "bg-amber-500" : "bg-neutral-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl p-6 md:p-8">
              <h2 className="font-sans text-xl font-bold mb-6">
                Shipping Address
              </h2>
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white text-neutral-900 placeholder:text-neutral-400"
                    placeholder="123 Main Street"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white text-neutral-900 placeholder:text-neutral-400"
                      placeholder="Mumbai"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) =>
                        setAddress({ ...address, state: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white text-neutral-900 placeholder:text-neutral-400"
                      placeholder="Maharashtra"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={(e) =>
                        setAddress({ ...address, zipCode: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white text-neutral-900 placeholder:text-neutral-400"
                      placeholder="400001"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white text-neutral-900 placeholder:text-neutral-400"
                      placeholder="+91 9999999999"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-amber-500 text-neutral-900 font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full mt-2"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl p-6 md:p-8">
              <h2 className="font-sans text-xl font-bold mb-6">Payment</h2>
              <div className="bg-amber-50 border border-amber-500/20 rounded-xl p-4 mb-6">
                <p className="text-sm font-medium text-amber-600">
                  💳 Stripe Payment integration is ready. For demo, click "Place
                  Order" to complete.
                </p>
              </div>
              <div className="mb-6 p-4 bg-neutral-100 rounded-xl">
                <h3 className="font-semibold text-sm mb-2">Shipping to:</h3>
                <p className="text-sm text-neutral-400">
                  {address.street}, {address.city}, {address.state} -{" "}
                  {address.zipCode}
                </p>
                <p className="text-sm text-neutral-400">
                  Phone: {address.phone}
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="text-amber-500 text-sm mt-2 hover:underline"
                >
                  Change address
                </button>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="bg-amber-500 text-neutral-900 font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {loading
                  ? "Placing Order..."
                  : `Place Order • ${formatPrice(grandTotal)}`}
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl p-6 sticky top-24">
            <h3 className="font-sans font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-neutral-400">
                      Size {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <hr className="my-4 border-neutral-200" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Shipping</span>
                <span>
                  {shippingPrice === 0 ? "FREE" : formatPrice(shippingPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Tax (GST)</span>
                <span>{formatPrice(taxPrice)}</span>
              </div>
              <hr className="border-neutral-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
