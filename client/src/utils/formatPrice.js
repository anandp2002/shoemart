export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getDiscountPercent = (mrp, price) => {
    if (mrp <= 0) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
};
