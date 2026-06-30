import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts.jsx';

export default function CategorySection() {
  const { categories } = useProducts();

  return (
    <section className="py-16 bg-white">
      <div className="section-padding">
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Browse Categories</span>
          <h2 className="heading-md text-text mt-2">Ayurvedic Essentials</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className="group relative overflow-hidden rounded-xl aspect-square bg-warm"
            >
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-sm">{category.name}</h3>
                <span className="inline-flex items-center gap-1 text-secondary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                  Shop Now <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
