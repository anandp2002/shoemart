import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Fallback logic if reached directly without state
    const orderDetails = location.state?.orderDetails;

    useEffect(() => {
        // Automatically redirect to orders if no order details state (they refreshed or typed the URL)
        if (!orderDetails) {
            const timer = setTimeout(() => {
                navigate('/orders');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [orderDetails, navigate]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-neutral-100">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCheckCircle className="text-4xl" />
                </div>

                <h1 className="text-3xl font-black text-neutral-900 mb-2">Payment Successful!</h1>
                <p className="text-neutral-500 mb-8 mt-2">
                    Thank you for your purchase. Your order has been received and is being processed.
                </p>

                {orderDetails && (
                    <div className="bg-neutral-50 rounded-2xl p-6 mb-8 text-left border border-neutral-100">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-neutral-500 text-sm">Order ID</span>
                            <span className="font-mono text-xs font-semibold bg-white px-2 py-1 rounded border border-neutral-200">
                                {orderDetails._id.slice(-8).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-neutral-500 text-sm">Total Amount</span>
                            <span className="font-bold text-neutral-900">
                                {formatPrice(orderDetails.totalPrice)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-500 text-sm">Payment Method</span>
                            <span className="text-neutral-900 text-sm font-medium">Card</span>
                        </div>
                    </div>
                )}

                {!orderDetails && (
                    <div className="bg-neutral-50/50 rounded-2xl p-4 mb-8">
                        <p className="text-sm text-neutral-400">Redirecting to your orders...</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/orders"
                        className="flex-1 bg-neutral-900 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-neutral-800 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <FiShoppingBag />
                        View Orders
                    </Link>
                    <Link
                        to="/shop"
                        className="flex-1 bg-amber-500 text-neutral-900 font-semibold px-6 py-3.5 rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                    >
                        Continue Shopping
                        <FiArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Success;
