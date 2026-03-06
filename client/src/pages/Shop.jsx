import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiX, FiChevronDown } from "react-icons/fi";
import {
  fetchProducts,
  fetchCategories,
  fetchBrands,
} from "../store/slices/productSlice";
import ProductCard from "../components/organisms/ProductCard";
import Loader from "../components/atoms/Loader";
import { GENDERS, SHOE_SIZES, SORT_OPTIONS } from "../utils/constants";
const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    products,
    totalProducts,
    totalPages,
    currentPage,
    categories,
    brands,
    loading,
  } = useSelector((state) => state.products);
  const [showFilters, setShowFilters] = useState(false);
  const filters = {
    keyword: searchParams.get("keyword") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    gender: searchParams.get("gender") || "",
    size: searchParams.get("size") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "-createdAt",
    page: searchParams.get("page") || "1",
  };
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);
  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    dispatch(fetchProducts(params));
  }, [searchParams, dispatch]);
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };
  const clearAllFilters = () => {
    setSearchParams({});
  };
  const hasActiveFilters =
    filters.category ||
    filters.brand ||
    filters.gender ||
    filters.size ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.keyword;
  const setPage = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="">
      {" "}
      {/* Header */}{" "}
      <div className="bg-neutral-900 py-8 md:py-12">
        {" "}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {" "}
          <h1 className="font-sans text-3xl md:text-4xl font-bold text-white">
            {" "}
            {filters.keyword
              ? `Results for "${filters.keyword}"`
              : "Shop All Shoes"}{" "}
          </h1>{" "}
          <p className="text-neutral-400 mt-2">
            {totalProducts} products found
          </p>{" "}
        </div>{" "}
      </div>{" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {" "}
        {/* Toolbar */}{" "}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          {" "}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto lg:hidden bg-transparent text-neutral-900 font-semibold rounded-xl border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 active:scale-95 py-2 px-4 text-sm flex items-center justify-center gap-2"
            aria-label="Toggle filters"
          >
            {" "}
            <FiFilter /> Filters{" "}
          </button>{" "}
          <div className="flex items-center gap-3 ml-auto">
            {" "}
            <select
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white text-neutral-900 placeholder:text-neutral-400 !w-auto py-2 text-sm cursor-pointer"
            >
              {" "}
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}{" "}
            </select>{" "}
          </div>{" "}
        </div>{" "}
        {/* Active Filters */}{" "}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {" "}
            <span className="text-sm text-neutral-400">Active:</span>{" "}
            {filters.keyword && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 flex items-center gap-1">
                {" "}
                "{filters.keyword}"{" "}
                <FiX
                  className="cursor-pointer"
                  onClick={() => updateFilter("keyword", "")}
                />{" "}
              </span>
            )}{" "}
            {filters.gender && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 flex items-center gap-1">
                {" "}
                {filters.gender}{" "}
                <FiX
                  className="cursor-pointer"
                  onClick={() => updateFilter("gender", "")}
                />{" "}
              </span>
            )}{" "}
            {filters.brand && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 flex items-center gap-1">
                {" "}
                {filters.brand}{" "}
                <FiX
                  className="cursor-pointer"
                  onClick={() => updateFilter("brand", "")}
                />{" "}
              </span>
            )}{" "}
            {filters.size && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 flex items-center gap-1">
                {" "}
                Size {filters.size}{" "}
                <FiX
                  className="cursor-pointer"
                  onClick={() => updateFilter("size", "")}
                />{" "}
              </span>
            )}{" "}
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-500 hover:underline"
            >
              Clear all
            </button>{" "}
          </div>
        )}{" "}
        <div className="flex gap-8">
          {" "}
          {/* Sidebar Filters */}{" "}
          <aside
            className={`${showFilters ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto w-full h-full" : "hidden"} lg:block lg:relative lg:w-64 lg:h-auto lg:flex-shrink-0`}
          >
            {" "}
            <div className="flex items-center justify-between lg:hidden mb-6 sticky top-0 bg-white pb-2 z-10 border-b border-neutral-100">
              {" "}
              <h3 className="font-sans font-bold text-xl">Filters</h3>{" "}
              <button onClick={() => setShowFilters(false)} aria-label="Close filters" className="p-2 bg-neutral-100 rounded-lg">
                <FiX className="w-5 h-5" />
              </button>{" "}
            </div>{" "}
            <div className="space-y-6">
              {" "}
              {/* Gender */}{" "}
              <div>
                {" "}
                <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-neutral-600">
                  Gender
                </h4>{" "}
                <div className="space-y-2">
                  {" "}
                  {GENDERS.map((g) => (
                    <label
                      key={g.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      {" "}
                      <input
                        type="radio"
                        name="gender"
                        checked={filters.gender === g.value}
                        onChange={() =>
                          updateFilter(
                            "gender",
                            filters.gender === g.value ? "" : g.value,
                          )
                        }
                        className="accent-amber-500"
                      />{" "}
                      <span className="text-sm group-hover:text-primary transition-colors">
                        {g.label}
                      </span>{" "}
                    </label>
                  ))}{" "}
                </div>{" "}
              </div>{" "}
              {/* Category */}{" "}
              <div>
                {" "}
                <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-neutral-600">
                  Category
                </h4>{" "}
                <div className="space-y-2">
                  {" "}
                  {categories.map((cat) => (
                    <label
                      key={cat._id}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      {" "}
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat._id}
                        onChange={() =>
                          updateFilter(
                            "category",
                            filters.category === cat._id ? "" : cat._id,
                          )
                        }
                        className="accent-amber-500"
                      />{" "}
                      <span className="text-sm group-hover:text-primary transition-colors">
                        {cat.name}
                      </span>{" "}
                    </label>
                  ))}{" "}
                </div>{" "}
              </div>{" "}
              {/* Brand */}{" "}
              <div>
                {" "}
                <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-neutral-600">
                  Brand
                </h4>{" "}
                <div className="space-y-2">
                  {" "}
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      {" "}
                      <input
                        type="radio"
                        name="brand"
                        checked={filters.brand === brand}
                        onChange={() =>
                          updateFilter(
                            "brand",
                            filters.brand === brand ? "" : brand,
                          )
                        }
                        className="accent-amber-500"
                      />{" "}
                      <span className="text-sm group-hover:text-primary transition-colors">
                        {brand}
                      </span>{" "}
                    </label>
                  ))}{" "}
                </div>{" "}
              </div>{" "}
              {/* Size */}{" "}
              <div>
                {" "}
                <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-neutral-600">
                  Size
                </h4>{" "}
                <div className="flex flex-wrap gap-2">
                  {" "}
                  {SHOE_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        updateFilter(
                          "size",
                          filters.size === size.toString()
                            ? ""
                            : size.toString(),
                        )
                      }
                      className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all ${filters.size === size.toString() ? "bg-amber-500 text-neutral-900 border-amber-500" : "border-neutral-200 hover:border-primary"}`}
                    >
                      {" "}
                      {size}{" "}
                    </button>
                  ))}{" "}
                </div>{" "}
              </div>{" "}
              {/* Price Range */}{" "}
              <div>
                {" "}
                <h4 className="font-semibold text-sm mb-3 uppercase tracking-wider text-neutral-600">
                  Price Range
                </h4>{" "}
                <div className="flex gap-2">
                  {" "}
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter("minPrice", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white text-neutral-900 placeholder:text-neutral-400 py-2 text-sm w-1/2"
                  />{" "}
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter("maxPrice", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white text-neutral-900 placeholder:text-neutral-400 py-2 text-sm w-1/2"
                  />{" "}
                </div>{" "}
              </div>{" "}
              {/* Mobile Apply Button */}{" "}
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden bg-amber-500 text-neutral-900 font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {" "}
                Apply Filters{" "}
              </button>{" "}
            </div>{" "}
          </aside>{" "}
          {/* Product Grid */}{" "}
          <div className="flex-1">
            {" "}
            {loading ? (
              <Loader />
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                {" "}
                <p className="text-6xl mb-4">👟</p>{" "}
                <h3 className="font-sans font-bold text-xl mb-2">
                  No products found
                </h3>{" "}
                <p className="text-neutral-400">
                  Try adjusting your filters or search terms
                </p>{" "}
                <button
                  onClick={clearAllFilters}
                  className="bg-amber-500 text-neutral-900 font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  Clear Filters
                </button>{" "}
              </div>
            ) : (
              <>
                {" "}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {" "}
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}{" "}
                </div>{" "}
                {/* Pagination */}{" "}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {" "}
                    <button
                      onClick={() => setPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="bg-transparent text-neutral-900 font-semibold px-6 py-3 rounded-xl border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 active:scale-95 py-2 px-4 text-sm disabled:opacity-30"
                    >
                      {" "}
                      Prev{" "}
                    </button>{" "}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setPage(page)}
                          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === currentPage ? "bg-amber-500 text-neutral-900" : "hover:bg-light-100"}`}
                        >
                          {" "}
                          {page}{" "}
                        </button>
                      ),
                    )}{" "}
                    <button
                      onClick={() => setPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="bg-transparent text-neutral-900 font-semibold px-6 py-3 rounded-xl border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 active:scale-95 py-2 px-4 text-sm disabled:opacity-30"
                    >
                      {" "}
                      Next{" "}
                    </button>{" "}
                  </div>
                )}{" "}
              </>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default Shop;
