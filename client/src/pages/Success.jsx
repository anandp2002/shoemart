import { useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheckCircle, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';
import { fetchOrderByPaymentIntent } from '../store/slices/orderSlice';
import Loader from '../components/atoms/Loader';

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const { order: reduxOrder, loading } = useSelector((state) => state.orders);

    // 1. Try to get from location state (internal navigation)
    // 2. Fallback to redux order (fetched via thunk)
    const orderDetails = location.state?.orderDetails || reduxOrder;

    const paymentIntentId = searchParams.get('payment_intent');

    useEffect(() => {
        // If we don't have order details in state, but we have a payment intent in URL (Stripe redirect)
        if (!location.state?.orderDetails && paymentIntentId) {
            dispatch(fetchOrderByPaymentIntent(paymentIntentId));
        }
    }, [dispatch, paymentIntentId, location.state]);

    useEffect(() => {
        // Automatically redirect to orders if after 10s we still have nothing
        if (!orderDetails && !loading && !paymentIntentId) {
            const timer = setTimeout(() => {
                navigate('/orders');
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [orderDetails, loading, navigate, paymentIntentId]);

    if (loading) return <Loader fullScreen message="Verifying your payment..." />;

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

                {!orderDetails && !loading && (
                    <div className="bg-neutral-50/50 rounded-2xl p-4 mb-8">
                        <p className="text-sm text-neutral-400">Finalizing your order details...</p>
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
