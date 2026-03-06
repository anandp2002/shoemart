import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { FiUser, FiSearch, FiMenu, FiX, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { logoutUser } from '../../store/slices/authSlice';
import { toggleMobileMenu, closeMobileMenu, toggleSearch } from '../../store/slices/uiSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { totalItems } = useSelector((state) => state.cart);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { mobileMenuOpen: isMobileMenuOpen, searchOpen: isSearchOpen } = useSelector((state) => state.ui);

    const wishlistCount = user?.wishlist?.length || 0;

    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        dispatch(closeMobileMenu());
    }, [location, dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 backdrop-blur-sm shadow-sm py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex flex-col">
                        <span className="text-2xl font-black tracking-tight text-neutral-900">
                            SHOE<span className="text-amber-500">MART</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className={`font-medium hover:text-amber-500 transition-colors ${location.pathname === '/' ? 'text-amber-500' : 'text-neutral-700'}`}>Home</Link>
                        <Link to="/shop" className={`font-medium hover:text-amber-500 transition-colors ${location.pathname === '/shop' && !location.search ? 'text-amber-500' : 'text-neutral-700'}`}>Shop</Link>
                        <Link to="/shop?category=men" className="font-medium text-neutral-700 hover:text-amber-500 transition-colors">Men</Link>
                        <Link to="/shop?category=women" className="font-medium text-neutral-700 hover:text-amber-500 transition-colors">Women</Link>
                        <Link to="/shop?category=kids" className="font-medium text-neutral-700 hover:text-amber-500 transition-colors">Kids</Link>
                    </div>

                    {/* Search Bar (Desktop) */}
                    <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search shoes..."
                            className="w-64 pl-10 pr-4 py-2 rounded-xl bg-neutral-100 border border-transparent focus:border-amber-500 focus:bg-white focus:outline-none transition-all text-sm text-neutral-900"
                        />
                        <FiSearch className="absolute left-3 text-neutral-400" />
                    </form>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                        {/* Search Toggle */}
                        <button
                            onClick={() => dispatch(toggleSearch())}
                            className="p-2 rounded-full text-neutral-900 hover:bg-neutral-100/50 transition-colors lg:hidden"
                            aria-label="Toggle search"
                        >
                            <FiSearch className="text-xl" />
                        </button>

                        {/* Wishlist Link */}
                        {isAuthenticated && (
                            <Link to="/wishlist" className="flex p-2 hover:bg-neutral-100 rounded-full transition-colors relative text-neutral-900">
                                <FiHeart className="text-xl" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-[10px] font-bold px-1 ring-2 ring-white">
                                        {wishlistCount > 99 ? '99+' : wishlistCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative group">
                                <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-neutral-100/50 transition-colors text-neutral-900" aria-label="User menu">
                                    <FiUser className="text-xl" />
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                    <div className="p-4 border-b border-neutral-100">
                                        <p className="text-sm font-semibold text-neutral-900 truncate">{user?.name}</p>
                                        <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                                    </div>
                                    <div className="p-2">
                                        {user?.role === 'admin' && (
                                            <Link to="/admin" className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg">
                                                <span>Dashboard</span>
                                            </Link>
                                        )}
                                        <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg">
                                            <span>Profile</span>
                                        </Link>
                                        <Link to="/orders" className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg">
                                            <span>Orders</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                dispatch(logoutUser());
                                                navigate('/');
                                            }}
                                            className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-amber-500 text-neutral-900 font-semibold px-5 py-2 rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 shadow-md text-sm hidden sm:block">Login</Link>
                        )}

                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 rounded-full hover:bg-neutral-100/50 transition-colors text-neutral-900">
                            <FiShoppingCart className="text-xl" />
                            {totalItems > 0 && (
                                <span className="absolute right-0 top-0 w-5 h-5 bg-amber-500 text-neutral-900 text-xs font-bold rounded-full flex items-center justify-center -translate-y-1 translate-x-1">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => dispatch(toggleMobileMenu())}
                            className="md:hidden p-2 rounded-full hover:bg-neutral-100/50 transition-colors text-neutral-900"
                            aria-label="Toggle mobile menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 overflow-y-auto ${isMobileMenuOpen ? 'max-h-[80vh] opacity-100 border-t border-neutral-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 space-y-2">
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search shoes..."
                                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white text-neutral-900 placeholder:text-neutral-400 pl-10"
                            />
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        </div>
                    </form>
                    <Link to="/" onClick={() => dispatch(toggleMobileMenu())} className="block px-4 py-3 text-neutral-900 font-medium hover:bg-neutral-50 rounded-xl">Home</Link>
                    <Link to="/shop" onClick={() => dispatch(toggleMobileMenu())} className="block px-4 py-3 text-neutral-900 font-medium hover:bg-neutral-50 rounded-xl">Shop All</Link>
                    <Link to="/shop?category=men" onClick={() => dispatch(toggleMobileMenu())} className="block px-4 py-3 text-neutral-900 font-medium hover:bg-neutral-50 rounded-xl">Men</Link>
                    <Link to="/shop?category=women" onClick={() => dispatch(toggleMobileMenu())} className="block px-4 py-3 text-neutral-900 font-medium hover:bg-neutral-50 rounded-xl">Women</Link>
                    {!isAuthenticated ? (
                        <Link to="/login" onClick={() => dispatch(toggleMobileMenu())} className="block px-4 py-3 text-center bg-amber-500 text-neutral-900 font-medium rounded-xl mt-4">Login to Account</Link>
                    ) : (
                        <div className="mt-4 pt-4 border-t border-neutral-100">
                            <p className="px-4 text-sm font-semibold text-neutral-900 mb-2">My Account</p>
                            {user?.role === 'admin' && (
                                <Link to="/admin" onClick={() => dispatch(toggleMobileMenu())} className="block px-4 py-3 text-neutral-900 font-medium hover:bg-neutral-50 rounded-xl">Dashboard</Link>
                            )}
                            <Link to="/profile" onClick={() => dispatch(toggleMobileMenu())} className="block px-4 py-3 text-neutral-900 font-medium hover:bg-neutral-50 rounded-xl">Profile</Link>
                            <Link to="/orders" onClick={() => dispatch(toggleMobileMenu())} className="block px-4 py-3 text-neutral-900 font-medium hover:bg-neutral-50 rounded-xl">Orders</Link>
                            <button
                                onClick={() => {
                                    dispatch(toggleMobileMenu());
                                    dispatch(logoutUser());
                                    navigate('/');
                                }}
                                className="w-full text-left px-4 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;