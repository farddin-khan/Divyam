import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, Package } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import { useCart } from '../hooks/useCart.jsx';

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  const shipping = cartTotal > 499 ? 0 : 99;
  const total = cartTotal + shipping;

  if (cartItems.length === 0) {
    return (
      <>
        <SEO title="Shopping Cart" description="Your shopping cart is empty. Browse our collection of authentic Ayurvedic products." />
        <div className="min-h-screen bg-white pt-28 pb-20">
          <div className="section-padding text-center">
            <Package className="w-14 h-14 text-text-muted mx-auto mb-5" />
            <h1 className="font-bold text-2xl text-text mb-3">Your Cart is Empty</h1>
            <p className="text-body text-sm mb-6 max-w-md mx-auto">
              Discover our collection of authentic Ayurvedic products crafted with pure, natural ingredients.
            </p>
            <Link to="/shop" className="btn-primary inline-flex items-center gap-2 text-sm">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Shopping Cart" description="Review your selected Ayurvedic products and proceed to checkout." />
      <div className="min-h-screen bg-white pt-24 pb-20">
        <div className="section-padding">
          <h1 className="font-bold text-2xl text-text mb-6">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-2">
              <div className="bg-warm rounded-xl overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border-b border-white last:border-0">
                    <Link to={`/product/${item.product?.slug}`} className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                      <img
                        src={item.product?.images?.[0]}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link to={`/product/${item.product?.slug}`} className="font-semibold text-sm text-text hover:text-primary transition-colors">
                            {item.product?.name}
                          </Link>
                          <p className="text-text-muted text-xs mt-0.5">{item.product?.category?.name}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-text-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1.5 hover:bg-warm"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1.5 text-xs font-semibold min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1.5 hover:bg-warm"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-primary text-sm">
                          ₹{(item.product?.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Link to="/shop" className="text-primary font-semibold text-sm hover:text-primary-dark transition-colors inline-flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4 rotate-180" /> Continue Shopping
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-warm rounded-xl p-5">
                <h2 className="font-bold text-text mb-4 text-sm">Order Summary</h2>
                <div className="space-y-2.5 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Shipping</span>
                    <span className="font-semibold">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[10px] text-secondary">
                      Add ₹{(499 - cartTotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                  <div className="border-t border-gray-200 pt-2.5 flex justify-between">
                    <span className="font-bold text-sm">Total</span>
                    <span className="font-bold text-primary text-lg">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                >
                  Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-text-muted">
                  <ShoppingBag className="w-3 h-3" />
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
