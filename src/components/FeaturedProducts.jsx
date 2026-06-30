import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts.jsx';
import { useEffect } from 'react';

const featuredFallback = [
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

export default function FeaturedProducts() {
  const { products, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts({ featured: true });
  }, [fetchProducts]);

  const excludedSlugs = ['kumkumadi-face-serum', 'ashwagandha-wellness-powder'];
  const displayProducts = [...featuredFallback, ...products]
    .filter((product) => !excludedSlugs.includes(product.slug))
    .filter((product, index, self) => self.findIndex((item) => item.slug === product.slug) === index);

  return (
    <section className="py-16 bg-warm">
      <div className="section-padding">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Handpicked</span>
            <h2 className="heading-md text-text mt-1">Featured Products</h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-primary-dark transition-colors group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
