import { useMemo, useState } from 'react';
import { CheckCircle, Clock, Package, Search, Truck } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import { apiUrl, readJsonResponse } from '../lib/api.js';

const trackingSteps = [
  { key: 'created', label: 'Order Placed', icon: CheckCircle },
  { key: 'packed', label: 'Packed', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out For Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const statusRank = {
  created: 0,
  packed: 1,
  shipped: 2,
  out_for_delivery: 3,
  delivered: 4,
};

function statusLabel(value = 'created') {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return 'Processing';
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const currentStatus = order?.shiprocket_status || order?.payment_status || 'created';

  const orderItems = useMemo(() => order?.items || [], [order]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setOrder(null);

    try {
      const params = new URLSearchParams({
        orderId: orderId.trim(),
        phone: phone.trim(),
      });

      const response = await fetch(apiUrl(`/api/orders/track?${params.toString()}`));
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || 'Unable to track order.');
      }

      setOrder(data.order);
    } catch (error) {
      setMessage(error.message || 'Unable to track order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Track Order" description="Track your Divyam Ayurveda order status." />
      <section className="min-h-screen bg-warm pt-28 pb-16">
        <div className="section-padding mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
              Order Tracking
            </span>
            <h1 className="mt-3 text-4xl font-bold text-text">Track Your Order</h1>
            <p className="mt-3 text-sm text-text-muted">
              Use your order ID or tracking ID with the phone number used at checkout.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 grid max-w-3xl gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xl md:grid-cols-[1fr_1fr_auto]"
          >
            <input
              type="text"
              placeholder="Order ID / Tracking ID"
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />

            <input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              {loading ? 'Checking...' : 'Track'}
            </button>
          </form>

          {message && (
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-red-100 bg-white px-5 py-4 text-sm text-red-600 shadow-sm">
              {message}
            </div>
          )}

          {order && (
            <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-[1fr_0.8fr]">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Order #{order.id}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-text">
                      {statusLabel(currentStatus)}
                    </h2>
                    <p className="mt-1 text-sm text-text-muted">
                      Placed on {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-primary/10 px-4 py-3 text-right">
                    <p className="text-xs text-text-muted">Total</p>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {trackingSteps.map((step, index) => {
                    const complete =
                      statusRank[currentStatus] >= statusRank[step.key] ||
                      currentStatus === 'delivered';
                    const StepIcon = step.icon;

                    return (
                      <div key={step.key} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              complete ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted'
                            }`}
                          >
                            <StepIcon className="h-5 w-5" />
                          </div>
                          {index < trackingSteps.length - 1 && (
                            <div
                              className={`mt-2 h-8 w-px ${
                                complete ? 'bg-primary/50' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>
                        <div>
                          <p className={`font-semibold ${complete ? 'text-text' : 'text-text-muted'}`}>
                            {step.label}
                          </p>
                          <p className="mt-1 text-xs text-text-muted">
                            {complete ? 'Updated by Divyam team' : 'Waiting for update'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
                  <div className="mb-4 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-secondary" />
                    <h3 className="text-lg font-bold text-text">Order Details</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-text-muted">Customer</span>
                      <span className="font-semibold text-text">{order.customer_name}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-text-muted">Payment</span>
                      <span className="font-semibold text-text">
                        {statusLabel(order.payment_status || 'pending')}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-text-muted">Tracking ID</span>
                      <span className="font-semibold text-text">
                        {order.shiprocket_order_id || 'Not assigned'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
                  <h3 className="mb-4 text-lg font-bold text-text">Items</h3>
                  {orderItems.length > 0 ? (
                    <div className="space-y-3">
                      {orderItems.map((item) => (
                        <div key={item.id || item.product_name} className="rounded-2xl bg-gray-50 p-4">
                          <p className="font-semibold text-text">{item.product_name}</p>
                          <p className="mt-1 text-xs text-text-muted">
                            Qty {item.quantity} x {formatCurrency(item.product_price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted">No item details available.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
