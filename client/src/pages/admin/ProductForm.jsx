import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiTrash2, FiUpload, FiCheck, FiX } from 'react-icons/fi';
import { fetchProductDetail, createProduct, updateProduct, fetchCategories, clearProductDetail } from '../../store/slices/productSlice';
import Loader from '../../components/atoms/Loader';
import { GENDERS, SHOE_SIZES } from '../../utils/constants';
import toast from 'react-hot-toast';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isEdit = !!id;

    const { product, loading, detailLoading, categories } = useSelector((state) => state.products);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        mrp: '',
        brand: '',
        category: '',
        color: '',
        gender: 'unisex',
        featured: false,
    });

    const [sizes, setSizes] = useState([{ size: 8, stock: 0 }]);
    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        dispatch(fetchCategories());
        if (isEdit) {
            dispatch(fetchProductDetail(id));
        } else {
            dispatch(clearProductDetail());
        }
    }, [dispatch, id, isEdit]);

    useEffect(() => {
        if (isEdit && product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                mrp: product.mrp,
                brand: product.brand,
                category: product.category?._id || product.category,
                color: product.color,
                gender: product.gender,
                featured: product.featured,
            });
            setSizes(product.sizes.length > 0 ? product.sizes.map(s => ({ size: s.size, stock: s.stock })) : [{ size: 8, stock: 0 }]);
            setPreviewImages(product.images.map(img => img.url));
        }
    }, [isEdit, product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSizeChange = (index, field, value) => {
        const newSizes = [...sizes];
        newSizes[index][field] = parseInt(value) || 0;
        setSizes(newSizes);
    };

    const addSizeRow = () => {
        setSizes([...sizes, { size: 8, stock: 0 }]);
    };

    const removeSizeRow = (index) => {
        setSizes(sizes.filter((_, i) => i !== index));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(prev => [...prev, ...files]);

        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...previews]);
    };

    const removeImage = (index, isNew) => {
        if (isNew) {
            setImages(prev => prev.filter((_, i) => i !== index));
            setPreviewImages(prev => prev.filter((_, i) => i !== index));
        } else {
            // Logic for removing existing images from product (might need backend update)
            setPreviewImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('sizes', JSON.stringify(sizes));
        images.forEach(img => data.append('images', img));

        try {
            if (isEdit) {
                await dispatch(updateProduct({ id, productData: data })).unwrap();
                toast.success('Product updated successfully');
            } else {
                await dispatch(createProduct(data)).unwrap();
                toast.success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (err) {
            toast.error(err || 'Operation failed');
        }
    };

    if (isEdit && detailLoading) return <Loader fullScreen message="Loading product data..." />;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/admin/products" className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors mb-6 group">
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-widest">Back to Products</span>
            </Link>

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black text-neutral-900">
                    {isEdit ? 'Edit Product' : 'Add New Product'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-neutral-100 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Product Name</label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Nike Air Max"
                                    className="w-full px-4 py-3 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-neutral-900 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Brand</label>
                                <input
                                    required
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    placeholder="e.g. Nike"
                                    className="w-full px-4 py-3 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-neutral-900 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Description</label>
                            <textarea
                                required
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the product..."
                                className="w-full px-4 py-3 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-neutral-900 transition-all font-medium resize-none"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Price (Sale)</label>
                                <input
                                    required
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-neutral-900 transition-all font-black text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">MRP (Original)</label>
                                <input
                                    required
                                    type="number"
                                    name="mrp"
                                    value={formData.mrp}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-neutral-900 transition-all font-black text-neutral-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Color</label>
                                <input
                                    required
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    placeholder="Black/White"
                                    className="w-full px-4 py-3 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-neutral-900 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stock & Sizes */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-neutral-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FiPlus className="text-amber-500" /> Inventory & Sizes
                            </h2>
                            <button
                                type="button"
                                onClick={addSizeRow}
                                className="text-sm font-bold text-amber-600 flex items-center gap-1 hover:text-amber-700"
                            >
                                <FiPlus /> Add Size
                            </button>
                        </div>
                        <div className="space-y-3">
                            {sizes.map((s, index) => (
                                <div key={index} className="flex gap-4 items-end animate-in fade-in slide-in-from-left-2 duration-300">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">Size (UK/US)</label>
                                        <select
                                            className="w-full px-4 py-3 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-neutral-900 font-bold"
                                            value={s.size}
                                            onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                                        >
                                            {SHOE_SIZES.map(sz => <option key={sz} value={sz}>{sz}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">Stock Quantity</label>
                                        <input
                                            type="number"
                                            placeholder="QTY"
                                            className="w-full px-4 py-3 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-neutral-900 font-bold"
                                            value={s.stock}
                                            onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSizeRow(index)}
                                        className="p-3.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        disabled={sizes.length === 1}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Categories & Gender */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Category</label>
                            <select
                                required
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-neutral-900 font-bold"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-700 uppercase tracking-wider ml-1">Gender Group</label>
                            <select
                                required
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-neutral-50 border-none rounded-xl focus:ring-2 focus:ring-neutral-900 font-bold"
                            >
                                {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                            </select>
                        </div>
                        <label className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl cursor-pointer group">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
                            />
                            <span className="font-bold text-neutral-700 group-hover:text-neutral-900 transition-colors">Mark as Featured</span>
                        </label>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 space-y-4">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <FiUpload className="text-amber-500" /> Product Images
                        </h3>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {previewImages.map((src, index) => (
                                <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-neutral-100 shadow-sm bg-neutral-50">
                                    <img src={src} className="w-full h-full object-cover" alt="Preview" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index, index >= (isEdit ? product.images.length : 0))}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            ))}
                            {previewImages.length < 5 && (
                                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl hover:border-amber-500 hover:bg-amber-50/30 transition-all cursor-pointer group">
                                    <FiPlus className="text-3xl text-neutral-300 group-hover:text-amber-500 transition-colors" />
                                    <span className="text-[10px] font-black text-neutral-300 mt-2 uppercase tracking-widest group-hover:text-amber-500">Upload</span>
                                    <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
                                </label>
                            )}
                        </div>
                        <p className="text-[10px] text-neutral-400 text-center uppercase font-black tracking-widest">Max 5 images / JPG, PNG</p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-neutral-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-neutral-200 hover:bg-neutral-800 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 h-16 flex items-center justify-center gap-3"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FiCheck className="text-xl" />}
                        {isEdit ? 'Save Changes' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
