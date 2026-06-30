import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useCart } from '../hooks/useCart.jsx';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300">
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-warm">
          <img
            src={product.images?.[0] || 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.new_arrival && (
            <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white shadow-sm"
            style={{ right: discount > 0 ? '3.5rem' : '0.75rem' }}
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <span className="text-primary text-[10px] font-bold uppercase tracking-wider">
            {product.category?.name}
          </span>
          <h3 className="font-semibold text-sm text-text mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[40px]">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-secondary fill-secondary' : 'text-gray-200'}`} />
            ))}
            <span className="text-[10px] text-text-muted ml-1">(4.5)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-primary">₹{product.price}</span>
              {product.compare_price && (
                <span className="text-xs text-text-muted line-through">₹{product.compare_price}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
