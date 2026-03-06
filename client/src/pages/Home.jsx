import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
    FiArrowRight,
    FiTruck,
    FiShield,
    FiRefreshCw,
    FiHeadphones,
} from "react-icons/fi";
import {
    fetchFeaturedProducts,
    fetchCategories,
} from "../store/slices/productSlice";
import ProductCard from "../components/organisms/ProductCard";
import Loader from "../components/atoms/Loader";
const Home = () => {
    const dispatch = useDispatch();
    const { featuredProducts, categories, loading } = useSelector(
        (state) => state.products,
    );
    useEffect(() => {
        dispatch(fetchFeaturedProducts());
        dispatch(fetchCategories());
    }, [dispatch]);
    const features = [
        {
            icon: <FiTruck className="w-6 h-6" />,
            title: "Free Shipping",
            desc: "On orders above ₹999",
        },
        {
            icon: <FiShield className="w-6 h-6" />,
            title: "100% Authentic",
            desc: "Genuine products only",
        },
        {
            icon: <FiRefreshCw className="w-6 h-6" />,
            title: "Easy Returns",
            desc: "7-day return policy",
        },
        {
            icon: <FiHeadphones className="w-6 h-6" />,
            title: "24/7 Support",
            desc: "WhatsApp & call support",
        },
    ];
    return (
        <div className="">
            {" "}
            {/* Hero Section */}{" "}
            <section className="relative bg-neutral-900 overflow-hidden min-h-[80vh] flex items-center">
                {" "}
                {/* Background Image */}{" "}
                <div className="absolute inset-0 z-0">
                    {" "}
                    <img
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2000&auto=format&fit=crop"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-40"
                    />{" "}
                </div>{" "}
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-dark/80 to-transparent z-0" />{" "}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] z-0" />{" "}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 md:py-32 w-full">
                    {" "}
                    <div className="max-w-2xl">
                        {" "}
                        <span className="inline-block px-4 py-1.5 bg-primary/20 text-amber-500 rounded-full text-sm font-semibold mb-6 ">
                            {" "}
                            NEW ARRIVALS 2026{" "}
                        </span>{" "}
                        <h1
                            className="font-sans text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] "
                            style={{ animationDelay: "0.1s" }}
                        >
                            {" "}
                            Step Into
                            <br />{" "}
                            <span className="text-amber-500 mt-2 block">Style</span>{" "}
                        </h1>{" "}
                        <p
                            className="text-neutral-400 text-lg md:text-xl mt-8 max-w-lg leading-relaxed "
                            style={{ animationDelay: "0.2s" }}
                        >
                            {" "}
                            Discover premium footwear from Nike, Adidas, Puma, and more. Your
                            perfect pair is just a click away.{" "}
                        </p>{" "}
                        <div
                            className="flex flex-wrap gap-4 mt-8 "
                            style={{ animationDelay: "0.3s" }}
                        >
                            {" "}
                            <Link
                                to="/shop"
                                className="bg-amber-500 text-neutral-900 font-semibold rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base md:text-lg px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto"
                            >
                                {" "}
                                Shop Now <FiArrowRight />{" "}
                            </Link>{" "}
                            <Link
                                to="/shop?featured=true"
                                className="bg-transparent font-semibold rounded-xl border-2 transition-all duration-300 active:scale-95 border-white text-white hover:bg-white hover:text-neutral-900 text-base md:text-lg px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto text-center"
                            >
                                {" "}
                                Featured{" "}
                            </Link>{" "}
                        </div>{" "}
                    </div>{" "}
                </div>{" "}
            </section>{" "}
            {/* Features Bar */}{" "}
            <section className="bg-white border-b border-neutral-200">
                {" "}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {" "}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {" "}
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                {" "}
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                                    {" "}
                                    {feature.icon}{" "}
                                </div>{" "}
                                <div>
                                    {" "}
                                    <p className="font-semibold text-sm">{feature.title}</p>{" "}
                                    <p className="text-xs text-neutral-400">
                                        {feature.desc}
                                    </p>{" "}
                                </div>{" "}
                            </div>
                        ))}{" "}
                    </div>{" "}
                </div>{" "}
            </section>{" "}
            {/* Categories */}{" "}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                {" "}
                <div className="flex items-center justify-between mb-10">
                    {" "}
                    <div>
                        {" "}
                        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
                            Shop by Category
                        </h2>{" "}
                        <p className="text-neutral-400 mt-2">
                            Find the perfect shoes for any occasion
                        </p>{" "}
                    </div>{" "}
                    <Link
                        to="/shop"
                        className="hidden md:flex items-center gap-2 text-amber-500 font-semibold hover:gap-3 transition-all"
                    >
                        {" "}
                        View All <FiArrowRight />{" "}
                    </Link>{" "}
                </div>{" "}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {" "}
                    {categories.map((cat) => (
                        <Link
                            key={cat._id}
                            to={`/shop?category=${cat._id}`}
                            className="group relative overflow-hidden rounded-2xl aspect-square bg-neutral-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                        >
                            {" "}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent z-10" />{" "}
                            {cat.image?.url && (
                                <img
                                    src={cat.image.url}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            )}{" "}
                            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                                {" "}
                                <h3 className="text-white font-sans font-bold text-lg">
                                    {cat.name}
                                </h3>{" "}
                            </div>{" "}
                        </Link>
                    ))}{" "}
                </div>{" "}
            </section>{" "}
            {/* Featured Products */}{" "}
            <section className="bg-neutral-100 py-16 md:py-20">
                {" "}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {" "}
                    <div className="flex items-center justify-between mb-10">
                        {" "}
                        <div>
                            {" "}
                            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
                                Featured Products
                            </h2>{" "}
                            <p className="text-neutral-400 mt-2">
                                Handpicked just for you
                            </p>{" "}
                        </div>{" "}
                        <Link
                            to="/shop?featured=true"
                            className="hidden md:flex items-center gap-2 text-amber-500 font-semibold hover:gap-3 transition-all"
                        >
                            {" "}
                            View All <FiArrowRight />{" "}
                        </Link>{" "}
                    </div>{" "}
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {" "}
                            {featuredProducts.slice(0, 8).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}{" "}
                        </div>
                    )}{" "}
                </div>{" "}
            </section>{" "}
            {/* CTA Banner */}{" "}
            <section className="relative bg-neutral-900 overflow-hidden my-20">
                {" "}
                {/* Background Image */}{" "}
                <div className="absolute inset-0 z-0">
                    {" "}
                    <img
                        src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=2000&auto=format&fit=crop"
                        alt="CTA Background"
                        className="w-full h-full object-cover opacity-30"
                    />{" "}
                </div>{" "}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-dark/90 z-0" />{" "}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 md:py-28 text-center bg-dark/40 backdrop-blur-sm rounded-3xl border border-white/10 my-10 shadow-2xl">
                    {" "}
                    <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.2]">
                        {" "}
                        Get <span className="text-amber-500">10% Off</span>
                        <br className="md:hidden" /> Your First Order{" "}
                    </h2>{" "}
                    <p className="text-neutral-100 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
                        {" "}
                        Join ShoeMart today and enjoy exclusive discounts, early access to
                        new arrivals, and members-only perks.{" "}
                    </p>{" "}
                    <Link
                        to="/register"
                        className="bg-amber-500 text-neutral-900 font-semibold rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 md:px-10 md:py-4 text-lg md:text-xl inline-flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 w-full sm:w-auto"
                    >
                        {" "}
                        Sign Up Now <FiArrowRight className="w-5 h-5 md:w-6 md:h-6" />{" "}
                    </Link>{" "}
                </div>{" "}
            </section>{" "}
            {/* Brands */}{" "}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {" "}
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 text-center mb-10">
                    Brands We Carry
                </h2>{" "}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50">
                    {" "}
                    {[
                        "Nike",
                        "Adidas",
                        "Puma",
                        "New Balance",
                        "Reebok",
                        "Converse",
                        "Skechers",
                        "Timberland",
                    ].map((brand) => (
                        <Link
                            key={brand}
                            to={`/shop?brand=${brand}`}
                            className="font-sans font-bold text-xl md:text-2xl text-neutral-600 hover:text-primary hover:opacity-100 transition-all"
                        >
                            {" "}
                            {brand}{" "}
                        </Link>
                    ))}{" "}
                </div>{" "}
            </section>{" "}
        </div>
    );
};
export default Home;
