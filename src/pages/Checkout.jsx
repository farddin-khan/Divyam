import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import { useCart } from '../hooks/useCart.jsx';
import { apiUrl } from '../lib/api.js';

const paymentMethods = [
  {
    id: 'card',
    label: 'Card',
    description: 'Visa / Mastercard / RuPay',
  },
  {
    id: 'upi',
    label: 'UPI',
    description: 'Pay using Google Pay, PhonePe or Paytm',
  },
  {
    id: 'scanner',
    label: 'Payment Scanner',
    description: 'Scan the QR code from your UPI app',
  },
];

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    notes: '',
  });

  const shipping = cartTotal > 499 ? 0 : 99;
  const total = cartTotal + shipping;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const finalizePayment = async (razorpayResponse, sessionId, orderDbId) => {
    try {
      const response = await fetch(apiUrl('/api/payment/verify-payment'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          orderDbId,
          formData,
          cartItems: cartItems.map((item) => ({
            product_id: item.product_id,
            product_name: item.product?.name,
            product_price: item.product?.price,
            quantity: item.quantity,
          })),
          shipping,
          total,
          selectedPaymentMethod,
          sessionId,
        }),
      });

      const responseText = await response.text();
      let data = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          data = { raw: responseText };
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message ||
          `Payment verification failed (${response.status} ${response.statusText})` +
          (data?.raw ? `: ${data.raw}` : ''),
        );
      }

      await clearCart();
      setOrderComplete(true);
      setStep(3);
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentError(error.message || 'Unable to verify payment.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');
    setLoading(true);

    if (!selectedPaymentMethod) {
      setPaymentError('Please choose a payment option.');
      setLoading(false);
      return;
    }

    const sessionId = localStorage.getItem('cart_session_id') || '';

    try {
      const response = await fetch(apiUrl('/api/payment/create-order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          cartItems: cartItems.map((item) => ({
            product_id: item.product_id,
            product_name: item.product?.name,
            product_price: item.product?.price,
            quantity: item.quantity,
          })),
          shipping,
          total,
          selectedPaymentMethod,
          sessionId,
        }),
      });

      const responseText = await response.text();
      let data = {};
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          data = { raw: responseText };
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.error || data?.message ||
          `Unable to initialize payment (${response.status} ${response.statusText})` +
          (data?.raw ? `: ${data.raw}` : ''),
        );
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Unable to load payment gateway.');
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Divyam Ayurveda Pvt Ltd',
        description: 'Secure checkout payment',
        order_id: data.orderId,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          payment_method: selectedPaymentMethod,
          session_id: sessionId,
          orderDbId: data.orderDbId,
        },
        handler: async (razorpayResponse) => {
          await finalizePayment(razorpayResponse, sessionId, data.orderDbId);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      setPaymentError(error.message || 'Payment initialization failed.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !orderComplete) {
    navigate('/cart');
    return null;
  }

  if (orderComplete) {
    return (
      <>
        <SEO title="Order Confirmed" description="Your order has been placed successfully. Thank you for shopping with Divyam Ayurvedha Pvt Ltd." />
        <div className="min-h-screen bg-white pt-28 pb-20">
          <div className="section-padding max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="font-bold text-2xl text-text mb-3">Order Confirmed!</h1>
            <p className="text-body text-sm mb-6">
              Thank you for your order. We have sent a confirmation email to {formData.email}. 
              Your Ayurvedic wellness products will be carefully prepared and shipped soon.
            </p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2 text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Checkout" description="Complete your purchase of authentic Ayurvedic products." />
      <div className="min-h-screen bg-white pt-24 pb-20">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-10">
              {['Information', 'Shipping', 'Confirmation'].map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i + 1 <= step ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted'}`}>
                    {i + 1 < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`hidden sm:block text-xs ${i + 1 <= step ? 'text-primary font-semibold' : 'text-text-muted'}`}>{s}</span>
                  {i < 2 && <div className={`w-8 h-0.5 rounded-full ${i + 1 < step ? 'bg-primary' : 'bg-gray-100'}`} />}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-warm rounded-xl p-6">
                  <h2 className="font-bold text-text mb-5 text-sm">Shipping Information</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Address *</label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">City *</label>
                        <input
                          type="text"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">State *</label>
                        <input
                          type="text"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">PIN *</label>
                        <input
                          type="text"
                          name="zip"
                          required
                          value={formData.zip}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Order Notes (Optional)</label>
                      <textarea
                        name="notes"
                        rows="3"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors resize-none text-sm"
                      />
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-4">
                      <h3 className="font-bold text-sm mb-4">Payment Options</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => {
                              setSelectedPaymentMethod(method.id);
                              setPaymentError('');
                            }}
                            className={`rounded-3xl border p-4 text-left transition-colors ${selectedPaymentMethod === method.id ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white hover:border-primary'}`}
                          >
                            <div className="text-sm font-semibold mb-1">{method.label}</div>
                            <p className="text-[11px] text-text-muted leading-5">{method.description}</p>
                          </button>
                        ))}
                      </div>

                      {selectedPaymentMethod === 'card' && (
                        <div className="mt-4 space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-text-muted">
                          <p className="font-semibold text-xs text-text">Card payment will be completed securely in the Razorpay checkout pop-up.</p>
                          <p>You can use Visa, Mastercard, or RuPay card details when the secure payment window opens.</p>
                        </div>
                      )}

                      {selectedPaymentMethod === 'upi' && (
                        <div className="mt-4 space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-text-muted">
                          <p className="font-semibold text-xs text-text">UPI payment is handled by Razorpay.</p>
                          <p>After order creation, select your UPI app inside the Razorpay checkout screen to complete payment.</p>
                        </div>
                      )}

                      {selectedPaymentMethod === 'scanner' && (
                        <div className="mt-4 space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-text-muted">
                          <p className="font-semibold text-xs text-text">Payment Scanner uses UPI QR checkout.</p>
                          <p>The Razorpay payment window will open securely, and you can scan the QR code with your UPI app.</p>
                        </div>
                      )}

                      {paymentError && <p className="text-sm text-red-500 mt-3">{paymentError}</p>}
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <Link to="/cart" className="text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1.5 text-sm font-semibold">
                        <ArrowLeft className="w-4 h-4" /> Back to Cart
                      </Link>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" /> Place Order
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-warm rounded-xl p-5">
                  <h3 className="font-bold text-text mb-4 text-sm">Order Summary</h3>
                  <div className="space-y-3 mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-2.5">
                        <img
                          src={item.product?.images?.[0]}
                          alt={item.product?.name}
                          className="w-12 h-12 object-cover rounded-lg bg-white"
                        />
                        <div className="flex-1">
                          <p className="text-xs font-semibold line-clamp-1">{item.product?.name}</p>
                          <p className="text-[10px] text-text-muted">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-semibold">₹{(item.product?.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-3 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Subtotal</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-text-muted">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="font-bold text-sm">Total</span>
                      <span className="font-bold text-primary text-base">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-[10px] text-text-muted">
                    <Truck className="w-3 h-3" />
                    Free shipping on orders over ₹499
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
