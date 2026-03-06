import { Link, useLocation } from 'react-router-dom';
import { FiXCircle, FiRefreshCw, FiArrowLeft } from 'react-icons/fi';

const PaymentError = () => {
    const location = useLocation();

    // Fallback logic if reached directly
    const errorMessage = location.state?.error || "Your transaction could not be completed at this time.";

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-red-100">
                <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiXCircle className="text-4xl" />
                </div>

                <h1 className="text-3xl font-black text-neutral-900 mb-2">Payment Failed</h1>
                <p className="text-neutral-500 mb-8 mt-2">
                    {errorMessage}
                </p>

                <div className="bg-red-50/50 rounded-2xl p-4 mb-8 text-sm text-red-600 text-left">
                    <strong>Possible reasons:</strong>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Insufficient funds in the account</li>
                        <li>Incorrect card details entered</li>
                        <li>Your bank declined the transaction</li>
                        <li>The session expired</li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/checkout"
                        className="flex-1 bg-amber-500 text-neutral-900 font-semibold px-6 py-3.5 rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-md"
                    >
                        <FiRefreshCw />
                        Try Again
                    </Link>
                    <Link
                        to="/cart"
                        className="flex-1 bg-white border-2 border-neutral-200 text-neutral-700 font-semibold px-6 py-3.5 rounded-xl hover:bg-neutral-50 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <FiArrowLeft />
                        Return to Cart
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentError;
