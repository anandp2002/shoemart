import { useEffect, useRef } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'warning', // 'warning' | 'danger'
    loading = false,
}) => {
    const modalRef = useRef(null);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && !loading) onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose, loading]);

    // Close on backdrop click
    const handleBackdrop = (e) => {
        if (e.target === modalRef.current && !loading) onClose();
    };

    if (!isOpen) return null;

    const variantStyles = {
        warning: {
            icon: 'bg-amber-100 text-amber-600',
            button: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-300',
        },
        danger: {
            icon: 'bg-red-100 text-red-600',
            button: 'bg-red-500 hover:bg-red-600 focus:ring-red-300',
        },
    };

    const styles = variantStyles[variant] || variantStyles.warning;

    return (
        <div
            ref={modalRef}
            onClick={handleBackdrop}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 animate-in fade-in"
            style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                style={{ animation: 'scaleIn 0.2s ease-out' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                    <h3 className="text-lg font-black text-neutral-900">{title}</h3>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${styles.icon}`}>
                        <FiAlertTriangle size={28} />
                    </div>
                    <p className="text-neutral-600 font-medium leading-relaxed">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-5 bg-neutral-50 border-t border-neutral-100">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-bold text-sm hover:bg-neutral-100 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2.5 text-white rounded-xl font-bold text-sm transition-colors focus:ring-2 focus:ring-offset-2 disabled:opacity-70 flex items-center justify-center gap-2 ${styles.button}`}
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default ConfirmModal;
