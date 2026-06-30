import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import { apiUrl, readJsonResponse } from '../lib/api.js';

const ADMIN_SECRET_KEY = 'divyam_admin_secret';
const ADMIN_USER_ID_KEY = 'divyam_admin_user_id';

export default function AdminProducts() {
  const [userId, setUserId] = useState('');
  const [secret, setSecret] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    compare_price: '',
    sku: '',
    stock_quantity: '',
    weight: '',
    category_id: '',
    images: '',
    featured: false,
    best_seller: false,
    new_arrival: false,
    ingredients: '',
    how_to_use: '',
    benefits: '',
    meta_title: '',
    meta_description: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_SECRET_KEY);
    const savedUserId = localStorage.getItem(ADMIN_USER_ID_KEY);
    if (savedUserId) {
      setUserId(savedUserId);
    }
    if (saved) {
      setSecret(saved);
      validateAdmin(saved, savedUserId || '');
    }
  }, []);

  const validateAdmin = async (secretValue, userIdValue = userId) => {
    try {
      const response = await fetch(apiUrl('/api/admin/validate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: secretValue, userId: userIdValue }),
      });
      const data = await readJsonResponse(response);
      if (response.ok && data.valid) {
        setAuthorized(true);
        setMessage('Admin access granted.');
        loadCategories();
      } else {
        setAuthorized(false);
        setMessage('Invalid admin secret.');
      }
    } catch (error) {
      setAuthorized(false);
      setMessage('Unable to validate admin secret.');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(apiUrl('/api/admin/categories'));
      const data = await readJsonResponse(response);
      if (response.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSecretSubmit = async (event) => {
    event.preventDefault();
    localStorage.setItem(ADMIN_USER_ID_KEY, userId);
    localStorage.setItem(ADMIN_SECRET_KEY, secret);
    validateAdmin(secret, userId);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    setMessage('');
    try {
      const response = await fetch(apiUrl('/api/admin/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, userId, product }),
      });
      const data = await readJsonResponse(response);
      if (response.ok) {
        setMessage('Product created successfully.');
        setProduct({
          name: '',
          slug: '',
          description: '',
          short_description: '',
          price: '',
          compare_price: '',
          sku: '',
          stock_quantity: '',
          weight: '',
          category_id: '',
          images: '',
          featured: false,
          best_seller: false,
          new_arrival: false,
          ingredients: '',
          how_to_use: '',
          benefits: '',
          meta_title: '',
          meta_description: '',
        });
      } else {
        setMessage(data.error || 'Unable to create product.');
      }
    } catch (error) {
      setMessage('Unable to create product.');
    }
  };

  return (
    <>
      <SEO title="Admin Product Management" description="Admin access to add new products to Divyam Ayurveda." />
      <div className="bg-primary pt-28 pb-14">
        <div className="section-padding text-center">
          <span className="text-secondary uppercase text-sm tracking-[0.32em] font-semibold">Admin Portal</span>
          <h1 className="heading-lg text-white mt-4">Product Management</h1>
          <p className="text-white/70 max-w-3xl mx-auto mt-4 text-sm">
            Only the website owner with the admin secret can add new products with image, price, and description.
          </p>
        </div>
      </div>

      <div className="py-20 bg-cream">
        <div className="section-padding max-w-5xl mx-auto">
          {!authorized ? (
            <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
              <h2 className="text-2xl font-semibold mb-4">Enter Admin Secret</h2>
              <form onSubmit={handleSecretSubmit} className="grid gap-4">
                <input
                  type="text"
                  name="userId"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  placeholder="Admin user ID"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <input
                  type="password"
                  name="secret"
                  value={secret}
                  onChange={(event) => setSecret(event.target.value)}
                  placeholder="Admin secret"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button type="submit" className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                  Unlock Admin
                </button>
                {message && <p className="text-sm text-red-600">{message}</p>}
              </form>
            </div>
          ) : (
            <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-2xl font-semibold">Add New Product</h2>
                <Link to="/" className="text-sm text-primary hover:underline">Go back to store</Link>
              </div>
              <form onSubmit={handleCreateProduct} className="grid gap-4">
                <div className="grid gap-4 lg:grid-cols-2">
                  <input name="name" value={product.name} onChange={handleChange} placeholder="Product name" className="rounded-2xl border border-gray-200 px-4 py-3" required />
                  <input name="slug" value={product.slug} onChange={handleChange} placeholder="Product slug" className="rounded-2xl border border-gray-200 px-4 py-3" required />
                  <input name="price" value={product.price} onChange={handleChange} placeholder="Price" className="rounded-2xl border border-gray-200 px-4 py-3" required type="number" step="0.01" />
                  <input name="compare_price" value={product.compare_price} onChange={handleChange} placeholder="Compare price" className="rounded-2xl border border-gray-200 px-4 py-3" type="number" step="0.01" />
                  <input name="sku" value={product.sku} onChange={handleChange} placeholder="SKU" className="rounded-2xl border border-gray-200 px-4 py-3" />
                  <input name="stock_quantity" value={product.stock_quantity} onChange={handleChange} placeholder="Stock quantity" className="rounded-2xl border border-gray-200 px-4 py-3" type="number" />
                  <input name="weight" value={product.weight} onChange={handleChange} placeholder="Weight" className="rounded-2xl border border-gray-200 px-4 py-3" />
                  <select name="category_id" value={product.category_id} onChange={handleChange} className="rounded-2xl border border-gray-200 px-4 py-3">
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <textarea name="short_description" value={product.short_description} onChange={handleChange} placeholder="Short description" className="rounded-2xl border border-gray-200 px-4 py-3" rows={3} />
                <textarea name="description" value={product.description} onChange={handleChange} placeholder="Full description" className="rounded-2xl border border-gray-200 px-4 py-3" rows={5} />
                <textarea name="ingredients" value={product.ingredients} onChange={handleChange} placeholder="Ingredients" className="rounded-2xl border border-gray-200 px-4 py-3" rows={3} />
                <textarea name="how_to_use" value={product.how_to_use} onChange={handleChange} placeholder="How to use" className="rounded-2xl border border-gray-200 px-4 py-3" rows={3} />
                <textarea name="benefits" value={product.benefits} onChange={handleChange} placeholder="Benefits (comma separated)" className="rounded-2xl border border-gray-200 px-4 py-3" rows={2} />
                <textarea name="images" value={product.images} onChange={handleChange} placeholder="Image URLs (comma separated)" className="rounded-2xl border border-gray-200 px-4 py-3" rows={2} />
                <div className="grid gap-4 lg:grid-cols-3">
                  <input name="meta_title" value={product.meta_title} onChange={handleChange} placeholder="Meta title" className="rounded-2xl border border-gray-200 px-4 py-3" />
                  <input name="meta_description" value={product.meta_description} onChange={handleChange} placeholder="Meta description" className="rounded-2xl border border-gray-200 px-4 py-3" />
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 text-sm">
                      <input name="featured" checked={product.featured} onChange={handleChange} type="checkbox" />
                      Featured
                    </label>
                    <label className="flex items-center gap-3 text-sm">
                      <input name="best_seller" checked={product.best_seller} onChange={handleChange} type="checkbox" />
                      Best Seller
                    </label>
                    <label className="flex items-center gap-3 text-sm">
                      <input name="new_arrival" checked={product.new_arrival} onChange={handleChange} type="checkbox" />
                      New Arrival
                    </label>
                  </div>
                </div>
                <button type="submit" className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                  Create Product
                </button>
                {message && <p className="text-sm text-text-muted">{message}</p>}
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
