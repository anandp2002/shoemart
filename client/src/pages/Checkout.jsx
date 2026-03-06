import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiCreditCard, FiCheck } from "react-icons/fi";
import { formatPrice } from "../utils/formatPrice";
import toast from "react-hot-toast";

// Stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import API from '../api/axios';
import CheckoutForm from '../components/organisms/CheckoutForm';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalPrice } = useSelector((state) => state.cart);
    const [step, setStep] = useState(1);
    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        phone: "",
    });

    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const [paymentLoading, setPaymentLoading] = useState(false);

    const shippingPrice = totalPrice > 999 ? 0 : 99;
    const taxPrice = Math.round(totalPrice * 0.18);
    const grandTotal = totalPrice + shippingPrice + taxPrice;

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setPaymentLoading(true);
        setStep(2); // Optimistically move to step 2

        try {
            // 1. Fetch publishable key
            const { data: configData } = await API.get('/payment/config');
            if (configData.publishableKey) {
                setStripePromise(loadStripe(configData.publishableKey));
            } else {
                throw new Error("Missing Stripe configuration from server");
            }

            // 2. Create PaymentIntent
            const { data: intentData } = await API.post('/payment/create-intent', { amount: grandTotal });
            setClientSecret(intentData.clientSecret);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to initialize payment gateway");
            setStep(1); // Revert to step 1 on failure
        } finally {
            setPaymentLoading(false);
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

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#f59e0b',
        },
    };

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
                                    disabled={paymentLoading}
                                    className="bg-amber-500 text-neutral-900 font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full mt-2 flex justify-center items-center"
                                >
                                    {paymentLoading ? "Connecting to secure payment gateway..." : "Continue to Payment"}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl p-6 md:p-8">
                            <h2 className="font-sans text-xl font-bold mb-6">Secure Payment</h2>

                            <div className="mb-6 p-4 bg-neutral-100 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-sm">Shipping to:</h3>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-amber-500 text-sm hover:underline font-medium"
                                    >
                                        Change address
                                    </button>
                                </div>
                                <p className="text-sm text-neutral-500">
                                    {address.street}, {address.city}, {address.state} -{" "}
                                    {address.zipCode}
                                </p>
                                <p className="text-sm text-neutral-500 mt-1">
                                    Phone: {address.phone}
                                </p>
                            </div>

                            {clientSecret && stripePromise ? (
                                <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                                    <CheckoutForm grandTotal={grandTotal} address={address} onBack={() => { setStep(1); setClientSecret(""); }} />
                                </Elements>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-8 h-8 rounded-full border-4 border-amber-500 border-t-amber-200 animate-spin mx-auto mb-4"></div>
                                    <p className="text-neutral-500">Loading secure payment gateway...</p>
                                </div>
                            )}
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
