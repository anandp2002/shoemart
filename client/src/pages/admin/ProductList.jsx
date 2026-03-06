import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { fetchProducts, deleteProduct } from '../../store/slices/productSlice';
import Loader from '../../components/atoms/Loader';
import ConfirmModal from '../../components/atoms/ConfirmModal';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const ProductList = () => {
    const dispatch = useDispatch();
    const { products, loading, totalPages, currentPage } = useSelector((state) => state.products);

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [deleting, setDeleting] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        productId: null,
        productName: '',
    });

    useEffect(() => {
        dispatch(fetchProducts({ page, keyword: searchTerm }));
    }, [dispatch, page, searchTerm]);

    const openDeleteConfirm = (id, name) => {
        setDeleteModal({ isOpen: true, productId: id, productName: name });
    };

    const closeDeleteModal = () => {
        if (!deleting) setDeleteModal((prev) => ({ ...prev, isOpen: false }));
    };

    const handleConfirmDelete = async () => {
        setDeleting(true);
        try {
            await dispatch(deleteProduct(deleteModal.productId)).unwrap();
            toast.success('Product deleted successfully');
            setDeleteModal((prev) => ({ ...prev, isOpen: false }));
        } catch (err) {
            toast.error(err || 'Failed to delete product');
            setDeleteModal((prev) => ({ ...prev, isOpen: false }));
        } finally {
            setDeleting(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-neutral-900">Manage Products</h1>
                    <p className="text-neutral-500 mt-1">Total {products.length} products found</p>
                </div>
                <Link
                    to="/admin/products/new"
                    className="bg-neutral-900 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-neutral-200"
                >
                    <FiPlus className="text-lg" />
                    Add Product
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-12 pr-4 py-3 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-neutral-900 transition-all"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <button className="px-6 py-3 bg-neutral-50 text-neutral-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-100 transition-all">
                    <FiFilter />
                    Filters
                </button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <Loader />
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center text-neutral-400">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="hover:bg-neutral-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={product.images[0]?.url || 'https://via.placeholder.com/150'}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded-lg object-cover bg-neutral-100 border border-neutral-100"
                                                />
                                                <div>
                                                    <p className="font-bold text-neutral-900 line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-neutral-400 font-mono">#{product._id.slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs font-bold uppercase tracking-tight">
                                                {product.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-black text-neutral-900">{formatPrice(product.price)}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                                <span className="text-sm font-medium text-neutral-600">{product.stock} in stock</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/products/edit/${product._id}`}
                                                    className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Edit Product"
                                                >
                                                    <FiEdit2 />
                                                </Link>
                                                <button
                                                    onClick={() => openDeleteConfirm(product._id, product.name)}
                                                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete Product"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-6 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                        <p className="text-sm text-neutral-500">
                            Page <span className="font-bold text-neutral-900">{currentPage}</span> of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setPage(page - 1)}
                                className="p-2 bg-white border border-neutral-200 rounded-lg shadow-sm disabled:opacity-50 hover:bg-neutral-50 transition-all font-bold text-neutral-600"
                            >
                                <FiChevronLeft />
                            </button>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setPage(page + 1)}
                                className="p-2 bg-white border border-neutral-200 rounded-lg shadow-sm disabled:opacity-50 hover:bg-neutral-50 transition-all font-bold text-neutral-600"
                            >
                                <FiChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone.`}
                confirmText="Delete Product"
                cancelText="Cancel"
                variant="danger"
                loading={deleting}
            />
        </div>
    );
};

export default ProductList;
