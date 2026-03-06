import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../store/slices/orderSlice';
import { clearCartState } from '../../store/slices/cartSlice';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const CheckoutForm = ({ grandTotal, address, onBack }) => {
    const stripe = useStripe();
    const elements = useElements();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/orders`,
                payment_method_data: {
                    billing_details: {
                        name: 'Customer', // Use user name if available
                        address: {
                            line1: address.street,
                            city: address.city,
                            state: address.state,
                            postal_code: address.zipCode,
                            country: 'IN' // Optional, replace if not always India
                        }
                    }
                }
            },
            redirect: 'if_required',
        });

        if (error) {
            setIsProcessing(false);
            navigate('/payment-error', { state: { error: error.message } });
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            try {
                const newOrder = await dispatch(createOrder({
                    shippingAddress: address,
                    paymentIntentId: paymentIntent.id
                })).unwrap();

                dispatch(clearCartState());
                navigate('/success', { state: { orderDetails: newOrder.order || newOrder } });
            } catch (err) {
                setIsProcessing(false);
                navigate('/payment-error', { state: { error: err || "Failed to finalize order on our servers." } });
            }
        } else {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement className="mb-6" />
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={isProcessing}
                    className="px-6 py-3 rounded-xl border border-neutral-200 text-neutral-900 font-semibold hover:bg-neutral-50 transition-colors w-1/3"
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={isProcessing || !stripe || !elements}
                    className="flex-1 bg-amber-500 text-neutral-900 font-semibold px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-300 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? "Processing..." : `Pay ${formatPrice(grandTotal)}`}
                </button>
            </div>
        </form>
    );
};

export default CheckoutForm;
