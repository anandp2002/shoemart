import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    FiHeart,
    FiShoppingBag,
    FiArrowLeft,
    FiTrash2,
    FiArrowRight,
} from 'react-icons/fi';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { loadUser } from '../store/slices/authSlice';
import Loader from '../components/atoms/Loader';
import { formatPrice, getDiscountPercent } from '../utils/formatPrice';
import toast from 'react-hot-toast';

const Wishlist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated, loading: authLoading } = useSelector(
        (state) => state.auth
    );
    const { togglingId } = useSelector((state) => state.wishlist);

    const wishlist = user?.wishlist || [];

    // Wishlist data is populated globally via App.jsx loadUser or upon login.

    const handleRemove = async (productId) => {
        try {
            await dispatch(toggleWishlist(productId)).unwrap();
            toast.success('Removed from wishlist');
        } catch (err) {
            toast.error(err || 'Failed to remove from wishlist');
        }
    };

    if (authLoading) return <Loader fullScreen />;

    if (!isAuthenticated) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
                        <FiHeart className="text-4xl text-neutral-300" />
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900 mb-3">
                        Your Wishlist Awaits
                    </h2>
                    <p className="text-neutral-500 mb-8 leading-relaxed">
                        Sign in to save your favourite shoes and never miss a deal.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-neutral-200"
                    >
                        Sign In <FiArrowRight />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[70vh]">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                        <FiHeart className="text-red-500 text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-neutral-900">
                            My Wishlist
                        </h1>
                        <p className="text-neutral-400 text-sm mt-0.5">
                            {wishlist.length}{' '}
                            {wishlist.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-neutral-400 hover:text-neutral-900 font-medium transition-colors text-sm"
                >
                    <FiArrowLeft className="text-lg" /> Back
                </button>
            </div>

            {wishlist.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-32 h-32 mb-8 rounded-full bg-neutral-50 border-2 border-dashed border-neutral-200 flex items-center justify-center">
                        <FiHeart className="text-5xl text-neutral-200" />
                    </div>
                    <h2 className="text-2xl font-black text-neutral-900 mb-3">
                        Nothing here yet
                    </h2>
                    <p className="text-neutral-400 mb-8 max-w-sm text-center leading-relaxed">
                        Tap the heart on any product you love and it'll show up here
                        for easy access later.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-neutral-200"
                    >
                        <FiShoppingBag /> Start Shopping <FiArrowRight />
                    </Link>
                </div>
            ) : (
                /* Wishlist Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((item) => {
                        const product = typeof item === 'object' ? item : null;
                        if (!product) return null;

                        const isRemoving = togglingId === product._id;
                        const discount = getDiscountPercent(product.mrp, product.price);
                        const totalStock = product.sizes?.reduce((sum, size) => sum + size.stock, 0) || 0;
                        const inStock = totalStock > 0;

                        return (
                            <div
                                key={product._id}
                                className="bg-white rounded-2xl border border-neutral-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                {/* Image */}
                                <Link to={`/product/${product._id}`} className="block relative">
                                    <div className="relative overflow-hidden bg-neutral-50 aspect-square">
                                        <img
                                            src={
                                                product.images?.[0]?.url ||
                                                'https://via.placeholder.com/400'
                                            }
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />

                                        {/* Discount badge */}
                                        {discount > 0 && (
                                            <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                                                {discount}% off
                                            </span>
                                        )}

                                        {/* Out of stock overlay */}
                                        {!inStock && (
                                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                                <span className="bg-neutral-900 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}

                                        {/* Remove button (top right) */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleRemove(product._id);
                                            }}
                                            disabled={isRemoving}
                                            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                            title="Remove from wishlist"
                                        >
                                            {isRemoving ? (
                                                <svg
                                                    className="animate-spin h-4 w-4"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        fill="none"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                    />
                                                </svg>
                                            ) : (
                                                <FiTrash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </Link>

                                {/* Info */}
                                <div className="p-4 flex flex-col flex-1">
                                    {product.brand && (
                                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold mb-1">
                                            {product.brand}
                                        </p>
                                    )}
                                    <Link to={`/product/${product._id}`}>
                                        <h3 className="font-bold text-neutral-900 line-clamp-1 hover:text-amber-600 transition-colors text-sm">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    {/* Price */}
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="font-black text-lg text-neutral-900">
                                            {formatPrice(product.price)}
                                        </span>
                                        {product.mrp > product.price && (
                                            <span className="text-neutral-400 text-xs line-through">
                                                {formatPrice(product.mrp)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Stock status */}
                                    <div className="mt-2  flex items-center gap-1.5">
                                        <div
                                            className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-red-400'
                                                }`}
                                        ></div>
                                        <span
                                            className={`text-[11px] font-medium ${inStock
                                                ? 'text-emerald-600'
                                                : 'text-red-400'
                                                }`}
                                        >
                                            {inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>

                                    {/* Action */}
                                    <div className="mt-auto pt-4">
                                        <Link
                                            to={`/product/${product._id}`}
                                            className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all active:scale-[0.98]"
                                        >
                                            <FiShoppingBag className="text-sm" /> View Product
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Continue Shopping CTA */}
            {wishlist.length > 0 && (
                <div className="mt-12 text-center">
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-900 font-medium transition-colors text-sm group"
                    >
                        Continue Shopping{' '}
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
