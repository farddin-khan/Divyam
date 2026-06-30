import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle,
  ClipboardList,
  IndianRupee,
  LogOut,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react';
import SEO from '../components/SEO.jsx';
import { apiUrl, readJsonResponse } from '../lib/api.js';

const ADMIN_SECRET_KEY = 'divyam_admin_secret';
const ADMIN_USER_ID_KEY = 'divyam_admin_user_id';

// const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function readApiResponse(response) {
  const text = await response.text();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error(
      'Backend API connected nahi hai. VITE_API_URL check karo aur backend server live/running hona chahiye.'
    );
  }

  return text ? JSON.parse(text) : {};
}

const emptyOrder = {
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  total_amount: '',
  payment_method: 'manual',
  payment_status: 'pending',
  shiprocket_order_id: '',
  shiprocket_status: 'created',
  notes: '',
  items: [{ product_id: '', product_name: '', product_price: '', quantity: 1 }],
};

const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
const trackingStatuses = ['created', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

const trackingSteps = [
  { key: 'created', label: 'Created', icon: ClipboardList },
  { key: 'packed', label: 'Packed', icon: PackageCheck },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const statusRank = {
  created: 0,
  packed: 1,
  shipped: 2,
  out_for_delivery: 3,
  delivered: 4,
};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return 'Manual';
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getOrderStatus(order) {
  return order.shiprocket_status || order.payment_status || 'created';
}

function statusLabel(value = '') {
  return value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AdminOrders() {
  const [userId, setUserId] = useState('');
  const [secret, setSecret] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [newOrder, setNewOrder] = useState(emptyOrder);
  const [trackingForm, setTrackingForm] = useState({
    payment_status: 'pending',
    shiprocket_status: 'created',
    shiprocket_order_id: '',
    notes: '',
  });

  useEffect(() => {
    const savedUserId = localStorage.getItem(ADMIN_USER_ID_KEY) || '';
    const savedSecret = localStorage.getItem(ADMIN_SECRET_KEY) || '';
    setUserId(savedUserId);
    setSecret(savedSecret);

    if (savedSecret) {
      validateAdmin(savedSecret, savedUserId);
    }
  }, []);

  const selectedOrder = useMemo(
    () => orders.find((order) => String(order.id) === String(selectedOrderId)) || orders[0],
    [orders, selectedOrderId]
  );

  useEffect(() => {
    if (!selectedOrder) return;

    setSelectedOrderId(selectedOrder.id);
    setTrackingForm({
      payment_status: selectedOrder.payment_status || 'pending',
      shiprocket_status: selectedOrder.shiprocket_status || 'created',
      shiprocket_order_id: selectedOrder.shiprocket_order_id || '',
      notes: selectedOrder.notes || '',
    });
  }, [selectedOrder?.id]);

  const stats = useMemo(() => {
    const revenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
    const paid = orders.filter((order) => order.payment_status === 'paid').length;
    const moving = orders.filter((order) =>
      ['packed', 'shipped', 'out_for_delivery'].includes(order.shiprocket_status)
    ).length;
    const delivered = orders.filter((order) => order.shiprocket_status === 'delivered').length;

    return { revenue, paid, moving, delivered };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const currentStatus = getOrderStatus(order);
      const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;
      const haystack = [
        order.id,
        order.customer_name,
        order.customer_phone,
        order.customer_email,
        order.shiprocket_order_id,
        order.payment_status,
        order.shiprocket_status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return matchesStatus && (!query || haystack.includes(query));
    });
  }, [orders, searchTerm, statusFilter]);

  const validateAdmin = async (secretValue = secret, userIdValue = userId) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(apiUrl('/api/admin/validate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: String(secretValue || '').trim(), userId: String(userIdValue || '').trim() }),
      });

      const data = await readJsonResponse(response);
      if (!response.ok || !data.valid) {
        throw new Error(data.error || `Admin validation failed (${response.status}). Check that the backend is running with the updated server/index.js.`);
      }

      localStorage.setItem(ADMIN_USER_ID_KEY, String(userIdValue || '').trim());
      localStorage.setItem(ADMIN_SECRET_KEY, String(secretValue || '').trim());
      setAuthorized(true);
      await loadOrders(secretValue, userIdValue);
    } catch (error) {
      setAuthorized(false);
      setMessage(error.message || 'Unable to validate admin access.');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (secretValue = secret, userIdValue = userId) => {
    setLoading(true);
    setMessage('');

    try {
      const params = new URLSearchParams({ secret: secretValue, userId: userIdValue });
      const response = await fetch(apiUrl(`/api/admin/orders?${params.toString()}`));
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || `Unable to load orders (${response.status}).`);
      }

      setOrders(data.orders || []);
      if (!selectedOrderId && data.orders?.[0]) {
        setSelectedOrderId(data.orders[0].id);
      }
    } catch (error) {
      setMessage(error.message || 'Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();
    validateAdmin(secret, userId);
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_USER_ID_KEY);
    localStorage.removeItem(ADMIN_SECRET_KEY);
    setAuthorized(false);
    setSecret('');
    setUserId('');
    setOrders([]);
  };

  const handleOrderChange = (event) => {
    const { name, value } = event.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setNewOrder((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addOrderItem = () => {
    setNewOrder((prev) => ({
      ...prev,
      items: [...prev.items, { product_id: '', product_name: '', product_price: '', quantity: 1 }],
    }));
  };

  const createOrder = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(apiUrl('/api/admin/orders'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, userId, order: newOrder }),
      });
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || `Unable to create order (${response.status}).`);
      }

      setOrders((prev) => [data.order, ...prev]);
      setSelectedOrderId(data.order.id);
      setNewOrder(emptyOrder);
      setMessage('Order added successfully.');
    } catch (error) {
      setMessage(error.message || 'Unable to create order.');
    } finally {
      setLoading(false);
    }
  };

  const updateTracking = async (event) => {
    event.preventDefault();
    if (!selectedOrder) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(apiUrl(`/api/admin/orders/${selectedOrder.id}/tracking`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, userId, updates: trackingForm }),
      });
      const data = await readJsonResponse(response);

      if (!response.ok) {
        throw new Error(data.error || `Unable to update tracking (${response.status}).`);
      }

      setOrders((prev) => prev.map((order) => (order.id === data.order.id ? data.order : order)));
      setMessage('Tracking updated successfully.');
    } catch (error) {
      setMessage(error.message || 'Unable to update tracking.');
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (order) => {
    const confirmed = window.confirm(`Remove order #${order.id}?`);
    if (!confirmed) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(apiUrl(`/api/admin/orders/${order.id}`), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, userId }),
      });
      const data = await readApiResponse(response).catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Unable to delete order.');
      }

      setOrders((prev) => prev.filter((item) => item.id !== order.id));
      setSelectedOrderId(null);
      setMessage('Order removed successfully.');
    } catch (error) {
      setMessage(error.message || 'Unable to delete order.');
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) {
    return (
      <>
        <SEO title="Admin Orders" description="Protected Divyam Ayurveda order administration." />
        <section className="min-h-screen bg-warm pt-28 pb-16">
          <div className="section-padding mx-auto max-w-xl">
            <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
                    Admin Panel
                  </p>
                  <h1 className="text-2xl font-bold text-text">Order Access</h1>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  placeholder="Admin user ID"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="password"
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                  placeholder="Admin secret"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
                >
                  <ShieldCheck className="h-4 w-4" />
                  {loading ? 'Checking...' : 'Open Admin Panel'}
                </button>
                {message && <p className="text-sm text-red-600">{message}</p>}
              </form>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO title="Order Admin Panel" description="Manage Divyam Ayurveda orders and tracking." />
      <section className="min-h-screen bg-[#f4f7f3] pt-24 pb-12">
        <div className="section-padding">
          <div className="grid min-w-0 gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <img src="/logo.png" alt="Divyam Ayurveda" className="h-10 w-auto" />
                <div>
                  <p className="text-sm font-bold text-primary">Divyam Admin</p>
                  <p className="text-xs text-text-muted">{userId || 'Administrator'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <button className="flex w-full items-center gap-3 rounded-xl bg-primary/10 px-4 py-3 text-left text-sm font-semibold text-primary">
                  <ClipboardList className="h-4 w-4" />
                  Orders
                </button>
                <Link
                  to="/admin/products"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-text-muted transition hover:bg-warm hover:text-primary"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Products
                </Link>
                <Link
                  to="/"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-text-muted transition hover:bg-warm hover:text-primary"
                >
                  <PackageCheck className="h-4 w-4" />
                  Storefront
                </Link>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-8 flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-text transition hover:border-primary hover:text-primary"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </aside>

            <div className="min-w-0 space-y-6">
              <div className="overflow-hidden rounded-2xl bg-primary text-white shadow-lg">
                <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
                      Order Dashboard
                    </p>
                    <h1 className="mt-2 text-3xl font-bold">Manage Orders & Tracking</h1>
                    <p className="mt-2 max-w-2xl text-sm text-white/75">
                      Review incoming orders, create manual orders, update courier status, and remove cancelled entries.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadOrders(secret, userId)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-secondary hover:text-white"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Total orders', value: orders.length, icon: ClipboardList, tone: 'text-primary bg-primary/10' },
                  { label: 'Paid orders', value: stats.paid, icon: CheckCircle, tone: 'text-emerald-600 bg-emerald-50' },
                  { label: 'In movement', value: stats.moving, icon: Truck, tone: 'text-amber-600 bg-amber-50' },
                  { label: 'Revenue', value: formatCurrency(stats.revenue), icon: IndianRupee, tone: 'text-secondary bg-secondary/10' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                          {item.label}
                        </p>
                        <p className="mt-3 text-2xl font-bold text-text">{item.value}</p>
                      </div>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.tone}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {message && (
                <div className="flex items-center gap-2 rounded-2xl border border-primary/10 bg-white px-4 py-3 text-sm text-primary shadow-sm">
                  <AlertCircle className="h-4 w-4" />
                  {message}
                </div>
              )}

              <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-100 p-5">
                    <div className="grid gap-3 md:grid-cols-[1fr_180px]">
                      <label className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <Search className="h-4 w-4 text-text-muted" />
                        <input
                          value={searchTerm}
                          onChange={(event) => setSearchTerm(event.target.value)}
                          placeholder="Search order, phone, customer"
                          className="w-full bg-transparent text-sm outline-none"
                        />
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                      >
                        <option value="all">All status</option>
                        {trackingStatuses.map((status) => (
                          <option key={status} value={status}>{statusLabel(status)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-3 p-4">
  {filteredOrders.map((order) => (
    <div
      key={order.id}
      onClick={() => setSelectedOrderId(order.id)}
      className={`grid cursor-pointer gap-4 rounded-2xl border p-4 transition hover:bg-warm lg:grid-cols-[1fr_1fr_120px_120px_160px_48px] lg:items-center ${
        String(selectedOrder?.id) === String(order.id)
          ? 'border-primary bg-primary/5'
          : 'border-gray-100 bg-white'
      }`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Order
        </p>
        <p className="mt-1 font-semibold text-text">#{order.id}</p>
        <p className="text-xs text-text-muted">{formatDate(order.created_at)}</p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Customer
        </p>
        <p className="mt-1 font-semibold text-text">
          {order.customer_name || 'Customer'}
        </p>
        <p className="break-words text-xs text-text-muted">{order.customer_phone}</p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Amount
        </p>
        <p className="mt-1 font-semibold text-primary">
          {formatCurrency(order.total_amount)}
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Payment
        </p>
        <span className="mt-2 inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-text">
          {statusLabel(order.payment_status || 'pending')}
        </span>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Tracking
        </p>
        <span className="mt-2 inline-flex rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
          {statusLabel(order.shiprocket_status || 'created')}
        </span>
        {order.shiprocket_order_id && (
          <p className="mt-1 break-words text-xs text-text-muted">
            {order.shiprocket_order_id}
          </p>
        )}
      </div>

      <div className="flex justify-end lg:justify-center">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            deleteOrder(order);
          }}
          className="inline-flex items-center justify-center rounded-full border border-red-100 p-2 text-red-500 transition hover:bg-red-50"
          aria-label="Delete order"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  ))}
</div>

                  {filteredOrders.length === 0 && (
                    <div className="p-8 text-center text-sm text-text-muted">
                      No orders found.
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                          Tracking
                        </p>
                        <h2 className="text-xl font-bold text-text">
                          {selectedOrder ? `Order #${selectedOrder.id}` : 'Select an order'}
                        </h2>
                      </div>
                      <Truck className="h-6 w-6 text-primary" />
                    </div>

                    {selectedOrder ? (
                      <>
                        <div className="mb-5 space-y-3">
                          {trackingSteps.map((step) => {
                            const complete =
                              statusRank[getOrderStatus(selectedOrder)] >= statusRank[step.key] ||
                              getOrderStatus(selectedOrder) === 'delivered';
                            const StepIcon = step.icon;

                            return (
                              <div key={step.key} className="flex items-center gap-3">
                                <div
                                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                    complete ? 'bg-primary text-white' : 'bg-gray-100 text-text-muted'
                                  }`}
                                >
                                  <StepIcon className="h-4 w-4" />
                                </div>
                                <span className={`text-sm font-semibold ${complete ? 'text-text' : 'text-text-muted'}`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <form onSubmit={updateTracking} className="space-y-3">
                          <select
                            value={trackingForm.payment_status}
                            onChange={(event) =>
                              setTrackingForm((prev) => ({ ...prev, payment_status: event.target.value }))
                            }
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
                          >
                            {paymentStatuses.map((status) => (
                              <option key={status} value={status}>{statusLabel(status)}</option>
                            ))}
                          </select>
                          <select
                            value={trackingForm.shiprocket_status}
                            onChange={(event) =>
                              setTrackingForm((prev) => ({ ...prev, shiprocket_status: event.target.value }))
                            }
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
                          >
                            {trackingStatuses.map((status) => (
                              <option key={status} value={status}>{statusLabel(status)}</option>
                            ))}
                          </select>
                          <input
                            value={trackingForm.shiprocket_order_id}
                            onChange={(event) =>
                              setTrackingForm((prev) => ({ ...prev, shiprocket_order_id: event.target.value }))
                            }
                            placeholder="Tracking / Shiprocket ID"
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                          <textarea
                            value={trackingForm.notes}
                            onChange={(event) =>
                              setTrackingForm((prev) => ({ ...prev, notes: event.target.value }))
                            }
                            placeholder="Admin notes"
                            rows={3}
                            className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary"
                          />
                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
                          >
                            Update Tracking
                          </button>
                        </form>
                      </>
                    ) : (
                      <p className="text-sm text-text-muted">Select an order from the list.</p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                        <Plus className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                          Manual Entry
                        </p>
                        <h2 className="text-xl font-bold text-text">Add Order</h2>
                      </div>
                    </div>

                    <form onSubmit={createOrder} className="space-y-3">
                      <input name="customer_name" value={newOrder.customer_name} onChange={handleOrderChange} placeholder="Customer name" className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary" required />
                      <div className="grid grid-cols-2 gap-3">
                        <input name="customer_phone" value={newOrder.customer_phone} onChange={handleOrderChange} placeholder="Phone" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary" required />
                        <input name="total_amount" value={newOrder.total_amount} onChange={handleOrderChange} placeholder="Total" type="number" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary" required />
                      </div>
                      <input name="customer_email" value={newOrder.customer_email} onChange={handleOrderChange} placeholder="Email" className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary" />
                      <input name="address" value={newOrder.address} onChange={handleOrderChange} placeholder="Address" className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary" />
                      <div className="grid grid-cols-3 gap-3">
                        <input name="city" value={newOrder.city} onChange={handleOrderChange} placeholder="City" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary" />
                        <input name="state" value={newOrder.state} onChange={handleOrderChange} placeholder="State" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary" />
                        <input name="zip" value={newOrder.zip} onChange={handleOrderChange} placeholder="PIN" className="rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-primary" />
                      </div>

                      {newOrder.items.map((item, index) => (
                        <div key={index} className="grid gap-2 rounded-2xl bg-gray-50 p-3">
                          <input value={item.product_name} onChange={(event) => handleItemChange(index, 'product_name', event.target.value)} placeholder="Product name" className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary" />
                          <div className="grid grid-cols-3 gap-2">
                            <input value={item.product_id} onChange={(event) => handleItemChange(index, 'product_id', event.target.value)} placeholder="Product ID" className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary" />
                            <input value={item.product_price} onChange={(event) => handleItemChange(index, 'product_price', event.target.value)} placeholder="Price" type="number" className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary" />
                            <input value={item.quantity} onChange={(event) => handleItemChange(index, 'quantity', event.target.value)} placeholder="Qty" type="number" className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary" />
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={addOrderItem}
                        className="w-full rounded-2xl border border-primary/20 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
                      >
                        Add item row
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-semibold text-white transition hover:bg-secondary/90 disabled:opacity-60"
                      >
                        Create Order
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
