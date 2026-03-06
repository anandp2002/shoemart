import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import Rating from '../atoms/Rating';
import { formatPrice, getDiscountPercent } from '../../utils/formatPrice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { togglingId } = useSelector((state) => state.wishlist);

    const isWishlisted = user?.wishlist?.some(
        (item) => (typeof item === 'object' ? item._id : item) === product._id
    );
    const isToggling = togglingId === product._id;

    const discount = getDiscountPercent(product.mrp, product.price);

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error('Please login to add to wishlist');
            navigate('/login');
            return;
        }
        dispatch(toggleWishlist(product._id))
            .unwrap()
            .then(() => {
                toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
            })
            .catch((err) => toast.error(err));
    };

    return (
        <div
            className="bg-white rounded-2xl shadow-md overflow-hidden group cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            id={`product-${product._id}`}
        >
            <Link to={`/product/${product._id}`}>
                {/* Image */}
                <div className="relative overflow-hidden bg-neutral-100 aspect-square">
                    <img
                        src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />
                    {/* Discount Badge */}
                    {discount > 0 && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                            -{discount}%
                        </span>
                    )}
                    {/* Wishlist Button */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <button
                            onClick={handleWishlistToggle}
                            disabled={isToggling}
                            className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-colors disabled:opacity-50 ${isWishlisted
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-white text-neutral-600 hover:bg-red-50 hover:text-red-500'
                                }`}
                        >
                            {isToggling ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <FiHeart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                            )}
                        </button>
                    </div>
                    {/* Quick View */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <button className="w-full bg-neutral-900 text-white py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-dark-200 transition-colors">
                            <FiShoppingBag className="w-4 h-4" /> Quick View
                        </button>
                    </div>
                </div>
                {/* Info */}
                <div className="p-4">
                    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">{product.brand}</p>
                    <h3 className="font-semibold text-sm md:text-base line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <div className="mt-1.5">
                        <Rating value={product.ratings} count={product.numReviews} size="text-xs" />
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                        {product.mrp > product.price && (
                            <span className="text-neutral-400 text-sm line-through">{formatPrice(product.mrp)}</span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;