import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts.jsx';
import { useEffect } from 'react';

const bestSellerFallback = [
  {
    id: 'vitamin-c-face-serum-local',
    name: 'Vitamin C Face Serum',
    slug: 'vitamin-c-face-serum',
    price: 45.99,
    compare_price: 55.0,
    images: ['https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=800'],
    category: { name: 'Skin Care' },
    new_arrival: true,
    featured: true,
    best_seller: true,
  },
  {
    id: 'ashwagandha-capsules-local',
    name: 'Ashwagandha Capsules',
    slug: 'ashwagandha-capsules',
    price: 34.99,
    compare_price: 42.0,
    images: ['https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800'],
    category: { name: 'Wellness' },
    new_arrival: false,
    featured: true,
    best_seller: true,
  },
];

export default function BestSellers() {
  const { products, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts({ bestSeller: true });
  }, [fetchProducts]);

  const excludedSlugs = ['kumkumadi-face-serum', 'ashwagandha-wellness-powder'];
  const displayProducts = [...bestSellerFallback, ...products]
    .filter((product) => !excludedSlugs.includes(product.slug))
    .filter((product, index, self) => self.findIndex((item) => item.slug === product.slug) === index);

  return (
    <section className="py-16 bg-white">
      <div className="section-padding">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
            <TrendingUp className="w-4 h-4" />
            <span>Most Popular</span>
          </div>
          <h2 className="heading-md text-text">Best Sellers</h2>
          <p className="text-body mt-3 max-w-lg mx-auto">
            Our most loved products, trusted by thousands of customers for their transformative results.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/shop" className="btn-outline inline-flex items-center gap-2 text-sm">
            Shop All Best Sellers
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
