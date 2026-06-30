import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Minus, Plus, Truck, RotateCcw, ShieldCheck, ChevronRight, Leaf, Award } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../hooks/useCart.jsx';
import { useProducts } from '../hooks/useProducts.jsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const { fetchProductBySlug, products, fetchProducts } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductBySlug(slug);
      if (data) {
        setProduct(data);
        setSelectedImage(0);
        setQuantity(1);
      }
    };
    loadProduct();
    window.scrollTo(0, 0);
  }, [slug, fetchProductBySlug]);

  useEffect(() => {
    if (product) {
      const categoryId = product.category_id ?? product.category?.id;
      if (categoryId) {
        fetchProducts({ category: categoryId });
      }
    }
  }, [product, fetchProducts]);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const relatedProducts = (products ?? []).filter(p => p.id !== product?.id).slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const averageRating = product.reviews?.length
    ? (product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length).toFixed(1)
    : 0;

  const formatINR = (value) => {
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    return Number.isFinite(amount)
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount)
      : '₹0';
  };

  return (
    <>
      <SEO
        title={product.name}
        description={product.short_description || product.description}
        type="product"
        image={product.images?.[0]}
        price={product.price}
        availability={product.stock_quantity > 0 ? 'instock' : 'outofstock'}
        brand="Divyam Ayurvedha"
        sku={product.sku}
      />

      {/* Breadcrumb */}
      <div className="bg-warm pt-24 pb-3">
        <div className="section-padding">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="py-8 bg-white">
        <div className="section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Images */}
            <div>
              <div className="aspect-square rounded-xl overflow-hidden bg-warm border border-gray-100">
                <img
                  src={product.images?.[selectedImage] || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-gray-200'}`}
                    >
                      <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary text-[10px] font-bold uppercase tracking-wider">{product.category?.name}</span>
                {product.new_arrival && (
                  <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full">New</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(averageRating) ? 'text-secondary fill-secondary' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-text-muted">{averageRating} ({product.reviews?.length || 0} reviews)</span>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl font-bold text-primary">{formatINR(product.price)}</span>
                {product.compare_price && (
                  <>
                    <span className="text-base text-text-muted line-through">{formatINR(product.compare_price)}</span>
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Save {discount}%</span>
                  </>
                )}
              </div>

              <p className="text-body text-sm mb-6">{product.short_description}</p>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-warm transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-4 py-2 min-w-[2.5rem] text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-warm transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                {product.stock_quantity > 0 ? (
                  <span className="text-xs text-green-600 flex items-center gap-1 font-medium">
                    <Leaf className="w-3 h-3" /> In Stock
                  </span>
                ) : (
                  <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className={`flex-1 btn-primary flex items-center justify-center gap-2 text-sm ${addedToCart ? 'bg-green-600' : ''} ${product.stock_quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {addedToCart ? 'Added!' : 'Add to Cart'}
                </button>
                <button className="w-12 h-12 border-2 border-gray-200 rounded-full flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 bg-warm rounded-lg">
                  <Truck className="w-5 h-5 text-primary mx-auto mb-1" />
                  <span className="text-[10px] text-text-muted">Free Shipping Rs. 499+</span>
                </div>
                <div className="text-center p-3 bg-warm rounded-lg">
                  <RotateCcw className="w-5 h-5 text-primary mx-auto mb-1" />
                  <span className="text-[10px] text-text-muted">7-Day Returns</span>
                </div>
                <div className="text-center p-3 bg-warm rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-primary mx-auto mb-1" />
                  <span className="text-[10px] text-text-muted">Secure Payment</span>
                </div>
              </div>

              <div className="text-xs text-text-muted">
                <span>SKU: {product.sku}</span>
                {product.weight && <span className="ml-3">Weight: {product.weight}</span>}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12">
            <div className="flex gap-6 border-b border-gray-100 mb-6 overflow-x-auto">
              {['description', 'ingredients', 'how-to-use', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-primary' : 'text-text-muted hover:text-text'}`}
                >
                  {tab.replace(/-/g, ' ')}
                  {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
                </button>
              ))}
            </div>

            <div className="bg-warm p-6 rounded-xl">
              {activeTab === 'description' && (
                <div>
                  <p className="text-body text-sm leading-relaxed">{product.description}</p>
                  {product.benefits && (
                    <div className="mt-5">
                      <h4 className="font-bold text-text text-sm mb-3">Key Benefits</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {product.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Award className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                            <span className="text-xs text-text-light">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'ingredients' && (
                <div>
                  <h4 className="font-bold text-text text-sm mb-3">Ingredients</h4>
                  <p className="text-body text-sm">{product.ingredients}</p>
                </div>
              )}
              {activeTab === 'how-to-use' && (
                <div>
                  <h4 className="font-bold text-text text-sm mb-3">How to Use</h4>
                  <p className="text-body text-sm">{product.how_to_use}</p>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div>
                  <h4 className="font-bold text-text text-sm mb-4">Customer Reviews</h4>
                  {product.reviews?.length > 0 ? (
                    <div className="space-y-4">
                      {product.reviews.map((review, i) => (
                        <div key={i} className="border-b border-gray-200 pb-4 last:border-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary text-xs font-bold">{review.customer_name.charAt(0)}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-xs">{review.customer_name}</span>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-secondary fill-secondary' : 'text-gray-200'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-body text-xs">{review.review_text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-muted text-sm">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="py-14 bg-warm">
          <div className="section-padding">
            <h2 className="font-bold text-xl text-text mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
