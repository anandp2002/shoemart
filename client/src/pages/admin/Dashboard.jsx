import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPackage, FiDollarSign, FiUsers, FiBox, FiTrendingUp, FiEye } from 'react-icons/fi';
import API from '../../api/axios';
import Loader from '../../components/atoms/Loader';
import { formatPrice } from '../../utils/formatPrice';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/orders/stats');
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Loader />;

    const statCards = [
        {
            icon: <FiDollarSign />,
            label: 'Total Revenue',
            value: formatPrice(stats?.totalRevenue || 0),
            color: 'bg-green-50 text-green-600',
        },
        {
            icon: <FiPackage />,
            label: 'Total Orders',
            value: stats?.totalOrders || 0,
            color: 'bg-blue-50 text-blue-600',
        },
        {
            icon: <FiBox />,
            label: 'Products',
            value: stats?.totalProducts || 0,
            color: 'bg-purple-50 text-purple-600',
        },
        {
            icon: <FiUsers />,
            label: 'Customers',
            value: stats?.totalUsers || 0,
            color: 'bg-orange-50 text-orange-600',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-neutral-900">Admin Dashboard</h1>
                    <p className="text-neutral-500 mt-1">Manage your store and grow your business</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-neutral-100 transition-all duration-300">
                        <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4 text-xl`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-2xl font-black text-neutral-900 leading-tight">{stat.value}</p>
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Link to="/admin/products" className="bg-white border-2 border-neutral-100 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-2 group hover:border-neutral-900 hover:shadow-xl hover:shadow-neutral-100 hover:scale-[1.02] transition-all shadow-sm">
                    <FiBox className="text-4xl text-amber-500 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-black mt-2 text-neutral-900">Manage Products</h3>
                    <p className="text-xs text-neutral-500 font-medium">Add, edit, or remove inventory</p>
                </Link>
                <Link to="/admin/orders" className="bg-white border-2 border-neutral-100 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-2 group hover:border-neutral-900 hover:shadow-xl hover:shadow-neutral-100 hover:scale-[1.02] transition-all shadow-sm">
                    <FiPackage className="text-4xl text-amber-500 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-black mt-2 text-neutral-900">Manage Orders</h3>
                    <p className="text-xs text-neutral-500 font-medium">Process and ship customer packages</p>
                </Link>
                <Link to="/admin/users" className="bg-white border-2 border-neutral-100 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-2 group hover:border-neutral-900 hover:shadow-xl hover:shadow-neutral-100 hover:scale-[1.02] transition-all shadow-sm">
                    <FiUsers className="text-4xl text-amber-500 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-black mt-2 text-neutral-900">Manage Users</h3>
                    <p className="text-xs text-neutral-500 font-medium">Review and manage user accounts</p>
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    <h3 className="text-xl font-black text-neutral-900 flex items-center gap-2">
                        <FiTrendingUp className="text-emerald-500" /> Recent Activity
                    </h3>
                    <Link to="/admin/orders" className="text-xs font-black uppercase text-amber-600 hover:text-amber-700">View All</Link>
                </div>
                {stats?.recentOrders?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse"><thead><tr className="bg-neutral-50 text-neutral-500 text-[10px] font-black uppercase tracking-widest border-b border-neutral-100"><th className="px-6 py-4">Order ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Amount</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Date</th></tr></thead><tbody className="divide-y divide-neutral-100">{stats.recentOrders.map((order) => (<tr key={order._id} className="hover:bg-neutral-50/50 transition-colors"><td className="px-6 py-4 font-mono text-xs font-bold text-neutral-400">#{order._id.slice(-8).toUpperCase()}</td><td className="px-6 py-4 font-bold text-neutral-900">{order.user?.name || 'Guest'}</td><td className="px-6 py-4 font-black text-neutral-900">{formatPrice(order.totalPrice)}</td><td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight ${order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{order.orderStatus}</span></td><td className="px-6 py-4 text-right text-neutral-400 font-bold text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td></tr>))}</tbody></table>
                    </div>
                ) : (
                    <div className="py-20 text-center text-neutral-400 font-bold">
                        No recent activity recorded
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;