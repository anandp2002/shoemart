import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPackage, FiMapPin, FiCreditCard, FiArrowLeft, FiClock, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { fetchOrderDetail } from '../store/slices/orderSlice';
import Loader from '../components/atoms/Loader';
import { formatPrice } from '../utils/formatPrice';
import { ORDER_STATUSES } from '../utils/constants';

const OrderDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { order, loading, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrderDetail(id));
    }, [dispatch, id]);

    const getStatusColor = (status) => {
        return ORDER_STATUSES.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Processing': return <FiClock className="text-amber-500" />;
            case 'Confirmed': return <FiCheckCircle className="text-blue-500" />;
            case 'Shipped': return <FiTruck className="text-purple-500" />;
            case 'Delivered': return <FiCheckCircle className="text-emerald-500" />;
            case 'Cancelled': return <FiPackage className="text-red-500" />;
            default: return <FiPackage />;
        }
    };

    if (loading) return <Loader fullScreen message="Fetching order details..." />;

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl max-w-md text-center">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p className="mb-6">{error}</p>
                    <Link to="/orders" className="bg-neutral-900 text-white px-6 py-2.5 rounded-xl font-semibold">
                        Back to My Orders
                    </Link>
                </div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <Link to="/orders" className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors mb-4 group">
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-semibold">Back to Orders</span>
                    </Link>
                    <div className="flex items-center gap-4 flex-wrap">
                        <h1 className="text-2xl md:text-3xl font-black text-neutral-900">
                            Order <span className="text-neutral-400 font-mono text-xl">#{order._id.toUpperCase()}</span>
                        </h1>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                            {getStatusIcon(order.orderStatus)}
                            {order.orderStatus}
                        </span>
                    </div>
                    <p className="text-neutral-500 mt-2 text-sm">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                        <div className="p-6 border-b border-neutral-100 flex items-center gap-2">
                            <FiPackage className="text-amber-500" />
                            <h2 className="font-bold text-lg">Order Items</h2>
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {order.items.map((item) => (
                                <div key={item._id} className="p-6 flex gap-4 md:gap-6 items-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover bg-neutral-50 border border-neutral-100"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-neutral-900 text-lg mb-1">{item.name}</h3>
                                        <div className="flex gap-4 text-sm text-neutral-500">
                                            <span>Size: <b className="text-neutral-900">{item.size}</b></span>
                                            <span>Qty: <b className="text-neutral-900">{item.quantity}</b></span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-neutral-900 text-lg">{formatPrice(item.price * item.quantity)}</p>
                                        <p className="text-xs text-neutral-400 mt-1">{formatPrice(item.price)} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-6">
                            <div className="flex items-center gap-2 mb-4 text-neutral-900">
                                <FiMapPin className="text-amber-500" />
                                <h3 className="font-bold">Shipping Address</h3>
                            </div>
                            <div className="text-neutral-600 space-y-1 text-sm leading-relaxed">
                                <p className="font-bold text-neutral-900">{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                <p>{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
                                <p className="pt-2">Phone: <b className="text-neutral-900">{order.shippingAddress.phone}</b></p>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-6">
                            <div className="flex items-center gap-2 mb-4 text-neutral-900">
                                <FiCreditCard className="text-amber-500" />
                                <h3 className="font-bold">Payment Details</h3>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-neutral-500">Method</span>
                                    <span className="font-semibold px-2 py-0.5 bg-neutral-100 rounded text-neutral-700">Card</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-neutral-500">Status</span>
                                    <span className={`font-bold ${order.paymentInfo.status === 'paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {order.paymentInfo.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="pt-2">
                                    <span className="text-neutral-500 text-xs">Transaction ID</span>
                                    <p className="font-mono text-xs text-neutral-400 mt-1 truncate">
                                        {order.paymentInfo.stripePaymentIntentId || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Price Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 sticky top-24">
                        <h2 className="font-black text-xl mb-6">Order Summary</h2>
                        <div className="space-y-4 text-sm mb-6">
                            <div className="flex justify-between text-neutral-500">
                                <span>Subtotal ({order.items.length} items)</span>
                                <span className="font-semibold text-neutral-900">{formatPrice(order.itemsPrice)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-500">
                                <span>Shipping Fee</span>
                                <span className="font-semibold text-neutral-900">
                                    {order.shippingPrice === 0 ? "FREE" : formatPrice(order.shippingPrice)}
                                </span>
                            </div>
                            <div className="flex justify-between text-neutral-500">
                                <span>Tax (GST 18%)</span>
                                <span className="font-semibold text-neutral-900">{formatPrice(order.taxPrice)}</span>
                            </div>
                        </div>
                        <div className="border-t border-dashed border-neutral-200 pt-6">
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-neutral-900">Total Amount</span>
                                <span className="text-2xl font-black text-amber-500">{formatPrice(order.totalPrice)}</span>
                            </div>
                        </div>
                        <div className="mt-8">
                            <button onClick={() => window.print()} className="w-full py-3 rounded-xl border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                Download Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
