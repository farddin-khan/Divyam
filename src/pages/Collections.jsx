import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import { useProducts } from '../hooks/useProducts.jsx';

export default function Collections() {
  const { categories, loading } = useProducts();

  return (
    <>
      <SEO
        title="Collections - Divyam Ayurveda"
        description="Browse our product collections and discover Ayurvedic care for hair, skin, body, wellness, and essential oils."
      />

      <div className="bg-primary pt-28 pb-12">
        <div className="section-padding text-center">
          <h1 className="heading-lg text-white mb-3">Collections</h1>
          <p className="text-white/70 max-w-xl mx-auto text-sm">
            Explore our curated product collections by category. Choose a collection to view all available products.
          </p>
        </div>
      </div>

      <div className="py-12 bg-warm min-h-screen">
        <div className="section-padding">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/collections/${category.slug}`}
                  className="group block overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden bg-warm">
                    <img
                      src={category.image_url || 'https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs uppercase tracking-[0.24em] text-primary font-semibold">Collection</span>
                    <h2 className="mt-3 text-xl font-semibold text-text">
                      {category.name}
                    </h2>
                    <p className="mt-3 text-sm text-text-muted leading-relaxed line-clamp-3">
                      {category.description || 'Browse premium Ayurvedic products curated for your needs.'}
                    </p>
                    <div className="mt-5 text-sm font-semibold text-primary">
                      View products →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
