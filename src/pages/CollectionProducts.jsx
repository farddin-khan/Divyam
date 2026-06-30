import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useProducts } from '../hooks/useProducts.jsx';

export default function CollectionProducts() {
  const { slug } = useParams();
  const { categories, loading, products, fetchProducts } = useProducts();
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    const activeCollection = categories.find((cat) => cat.slug === slug);
    setCollection(activeCollection || null);
    if (activeCollection) {
      fetchProducts({ category: activeCollection.id });
    }
  }, [categories, fetchProducts, slug]);

  const collectionProducts = products || [];

  return (
    <>
      <SEO
        title={collection ? `${collection.name} Collection` : 'Collection'}
        description={collection ? collection.description : 'Browse products by collection.'}
      />

      <div className="bg-primary pt-28 pb-12">
        <div className="section-padding text-center">
          <h1 className="heading-lg text-white mb-3">
            {collection ? collection.name : 'Collection'}
          </h1>
          <p className="text-white/70 max-w-xl mx-auto text-sm">
            {collection ? collection.description : 'Discover products from this collection.'}
          </p>
        </div>
      </div>

      <div className="py-12 bg-warm min-h-screen">
        <div className="section-padding">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-text-muted">
                <Link to="/collections" className="text-primary hover:underline">Collections</Link>
                <span className="mx-2">/</span>
                <span>{collection?.name || 'Unknown Collection'}</span>
              </p>
              <h2 className="text-3xl font-bold text-text mt-3">
                {collection ? `${collection.name} Products` : 'Collection products'}
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : collectionProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-muted">No products found in this collection.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {collectionProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
