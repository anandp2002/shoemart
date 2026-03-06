import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiEye, FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import Loader from '../../components/atoms/Loader';
import { formatPrice } from '../../utils/formatPrice';
import { ORDER_STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

const OrderList = () => {
    const dispatch = useDispatch();
    const { orders, loading, totalPages, total } = useSelector((state) => state.orders);

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        dispatch(fetchAllOrders({ page, orderStatus: statusFilter, keyword: searchTerm }));
    }, [dispatch, page, searchTerm, statusFilter]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await dispatch(updateOrderStatus({ id, status })).unwrap();
            toast.success(`Order status updated to ${status}`);
        } catch (err) {
            toast.error(err || 'Failed to update status');
        }
    };

    const getStatusStyles = (status) => {
        return ORDER_STATUSES.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-neutral-900">Manage Orders</h1>
                <p className="text-neutral-500 mt-1">Total {total} orders in system</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID..."
                        className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-neutral-900 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>
                <select
                    className="px-6 py-3 bg-neutral-50 text-neutral-600 rounded-xl font-bold border-none focus:ring-2 focus:ring-neutral-900"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                >
                    <option value="">All Statuses</option>
                    {ORDER_STATUSES.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse"><thead><tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider font-bold"><th className="px-6 py-4">Order Details</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-neutral-100">{loading ? (<tr><td colSpan="5" className="py-20 text-center"><Loader /></td></tr>) : orders.length === 0 ? (<tr><td colSpan="5" className="py-20 text-center text-neutral-400 font-bold">No orders found</td></tr>) : (orders.map((order) => (<tr key={order._id} className="hover:bg-neutral-50/50 transition-colors group"><td className="px-6 py-4"><p className="font-mono text-xs font-bold text-neutral-400">#{order._id.toUpperCase()}</p><p className="text-xs text-neutral-500 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p></td><td className="px-6 py-4"><p className="font-bold text-neutral-900">{order.user?.name || 'Guest'}</p><p className="text-xs text-neutral-400">{order.user?.email || 'N/A'}</p></td><td className="px-6 py-4"><p className="font-black text-neutral-900 text-lg">{formatPrice(order.totalPrice)}</p><p className="text-[10px] text-neutral-400 uppercase font-black tracking-widest">{order.items.length} items</p></td><td className="px-6 py-4"><select className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none transition-all ${getStatusStyles(order.orderStatus)}`} value={order.orderStatus} onChange={(e) => handleStatusUpdate(order._id, e.target.value)}>{ORDER_STATUSES.map(s => <option key={s.value} value={s.value}>{s.value}</option>)}</select></td><td className="px-6 py-4 text-right"><Link to={`/orders/${order._id}`} className="inline-flex items-center gap-2 p-2.5 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-900 hover:text-white transition-all active:scale-95" title="View Details"><FiEye /><span className="text-xs font-black uppercase tracking-wider pr-1">View</span></Link></td></tr>)))}</tbody></table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                        <p className="text-sm text-neutral-500 font-medium">Page {page} of {totalPages}</p>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="p-2 bg-white border border-neutral-200 rounded-xl shadow-sm disabled:opacity-50 hover:bg-white transition-all"
                            ><FiChevronLeft /></button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className="p-2 bg-white border border-neutral-200 rounded-xl shadow-sm disabled:opacity-50 hover:bg-white transition-all"
                            ><FiChevronRight /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderList;
