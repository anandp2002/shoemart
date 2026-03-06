import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiShoppingBag,
  FiHeart,
  FiShare2,
  FiMinus,
  FiPlus,
  FiChevronRight,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import {
  fetchProductDetail,
  clearProductDetail,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import Rating from "../components/atoms/Rating";
import Loader from "../components/atoms/Loader";
import { formatPrice, getDiscountPercent } from "../utils/formatPrice";
import { WHATSAPP_NUMBER } from "../utils/constants";
import toast from "react-hot-toast";
const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, detailLoading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    dispatch(fetchProductDetail(id));
    return () => dispatch(clearProductDetail());
  }, [dispatch, id]);
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    dispatch(
      addToCart({ productId: product._id, size: selectedSize, quantity }),
    )
      .unwrap()
      .then(() => toast.success("Added to cart!"))
      .catch((err) => toast.error(err));
  };
  const handleShare = () => {
    const url = window.location.href;
    const text = `Check out ${product.name} on ShoeMart!`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      "_blank",
    );
  };
  if (detailLoading) return <Loader fullScreen />;
  if (!product)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-xl font-bold">Product not found</h2>
      </div>
    );
  const discount = getDiscountPercent(product.mrp, product.price);
  return (
    <div className="">
      {" "}
      {/* Breadcrumb */}{" "}
      <div className="bg-neutral-100 py-3">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-sm text-neutral-400">
          {" "}
          <Link to="/" className="hover:text-primary">
            Home
          </Link>{" "}
          <FiChevronRight className="w-3 h-3" />{" "}
          <Link to="/shop" className="hover:text-primary">
            Shop
          </Link>{" "}
          <FiChevronRight className="w-3 h-3" />{" "}
          <span className="text-neutral-900 truncate">{product.name}</span>{" "}
        </div>{" "}
      </div>{" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {" "}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {" "}
          {/* Images */}{" "}
          <div className="space-y-4">
            {" "}
            <div className="aspect-square bg-neutral-100 rounded-2xl overflow-hidden relative group">
              {" "}
              <img
                src={
                  product.images?.[selectedImage]?.url ||
                  "https://via.placeholder.com/600"
                }
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />{" "}
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  {" "}
                  -{discount}% OFF{" "}
                </span>
              )}{" "}
            </div>{" "}
            {/* Thumbnails */}{" "}
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {" "}
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? "border-amber-500" : "border-transparent"}`}
                  >
                    {" "}
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />{" "}
                  </button>
                ))}{" "}
              </div>
            )}{" "}
          </div>{" "}
          {/* Details */}{" "}
          <div>
            {" "}
            <p className="text-amber-500 font-semibold uppercase tracking-wider text-sm">
              {product.brand}
            </p>{" "}
            <h1 className="font-sans text-2xl md:text-3xl font-bold mt-2">
              {product.name}
            </h1>{" "}
            <div className="mt-3">
              {" "}
              <Rating value={product.ratings} count={product.numReviews} />{" "}
            </div>{" "}
            {/* Price */}{" "}
            <div className="mt-6 flex items-baseline gap-3">
              {" "}
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
              </span>{" "}
              {product.mrp > product.price && (
                <>
                  {" "}
                  <span className="text-xl text-neutral-400 line-through">
                    {formatPrice(product.mrp)}
                  </span>{" "}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                    -{discount}%
                  </span>{" "}
                </>
              )}{" "}
            </div>{" "}
            <p className="text-xs text-neutral-400 mt-1">
              Inclusive of all taxes
            </p>{" "}
            {/* Size Selection */}{" "}
            <div className="mt-8">
              {" "}
              <div className="flex items-center justify-between mb-3">
                {" "}
                <h3 className="font-semibold">Select Size</h3>{" "}
              </div>{" "}
              <div className="flex flex-wrap gap-3">
                {" "}
                {product.sizes?.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                    disabled={s.stock === 0}
                    className={`w-14 h-14 rounded-xl border-2 font-semibold transition-all relative ${selectedSize === s.size ? "border-amber-500 bg-amber-500 text-neutral-900" : s.stock === 0 ? "border-neutral-200 text-neutral-400 cursor-not-allowed line-through opacity-50" : "border-neutral-200 hover:border-primary"}`}
                  >
                    {" "}
                    {s.size}{" "}
                    {s.stock > 0 && s.stock <= 3 && (
                      <span
                        className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                        title={`Only ${s.stock} left`}
                      />
                    )}{" "}
                  </button>
                ))}{" "}
              </div>{" "}
            </div>{" "}
            {/* Quantity */}{" "}
            <div className="mt-6">
              {" "}
              <h3 className="font-semibold mb-3">Quantity</h3>{" "}
              <div className="flex items-center gap-3">
                {" "}
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center hover:bg-light-100"
                >
                  {" "}
                  <FiMinus />{" "}
                </button>{" "}
                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>{" "}
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center hover:bg-light-100"
                >
                  {" "}
                  <FiPlus />{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            {/* Actions */}{" "}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {" "}
              <button
                onClick={handleAddToCart}
                className="bg-amber-500 text-neutral-900 font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-1 flex items-center justify-center gap-2 py-4 text-lg"
              >
                {" "}
                <FiShoppingBag /> Add to Cart{" "}
              </button>{" "}
              <button className="bg-transparent text-neutral-900 font-semibold px-6 py-3 rounded-xl border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 active:scale-95 py-4 !px-6">
                {" "}
                <FiHeart className="w-5 h-5" />{" "}
              </button>{" "}
              <button
                onClick={handleShare}
                className="bg-transparent text-neutral-900 font-semibold px-6 py-3 rounded-xl border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 active:scale-95 py-4 !px-6"
              >
                {" "}
                <FaWhatsapp className="w-5 h-5" />{" "}
              </button>{" "}
            </div>{" "}
            {/* Description */}{" "}
            <div className="mt-10 border-t border-neutral-200 pt-8">
              {" "}
              <h3 className="font-sans font-bold text-lg mb-3">
                Description
              </h3>{" "}
              <p className="text-neutral-400 leading-relaxed">
                {product.description}
              </p>{" "}
            </div>{" "}
            {/* Details */}{" "}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {" "}
              <div className="p-4 bg-neutral-100 rounded-xl">
                {" "}
                <p className="text-xs text-neutral-400 uppercase">Brand</p>{" "}
                <p className="font-semibold">{product.brand}</p>{" "}
              </div>{" "}
              <div className="p-4 bg-neutral-100 rounded-xl">
                {" "}
                <p className="text-xs text-neutral-400 uppercase">Color</p>{" "}
                <p className="font-semibold">{product.color}</p>{" "}
              </div>{" "}
              <div className="p-4 bg-neutral-100 rounded-xl">
                {" "}
                <p className="text-xs text-neutral-400 uppercase">
                  Gender
                </p>{" "}
                <p className="font-semibold capitalize">
                  {product.gender}
                </p>{" "}
              </div>{" "}
              <div className="p-4 bg-neutral-100 rounded-xl">
                {" "}
                <p className="text-xs text-neutral-400 uppercase">
                  In Stock
                </p>{" "}
                <p className="font-semibold">{product.totalStock} units</p>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default ProductDetail;
