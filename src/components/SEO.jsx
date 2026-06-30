import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SEO({ title, description, keywords, image, type = 'website', price, availability, brand, sku }) {
  const location = useLocation();
  const url = `https://divyamayurveda.com${location.pathname}`;
  const defaultImage = 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=1200';

  useEffect(() => {
    document.title = title ? `${title} | Divyam Ayurveda` : 'Divyam Ayurveda - Authentic Ayurvedic Wellness Products';

    const setMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMeta('description', description || 'Discover authentic Ayurvedic beauty and wellness products. Handcrafted with pure, natural ingredients.');
    setMeta('keywords', keywords || 'Ayurveda, Divyam Ayurveda, natural products, organic skincare, hair care, essential oils, wellness');
    setMeta('og:title', title || 'Divyam Ayurveda');
    setMeta('og:description', description || 'Discover authentic Ayurvedic beauty and wellness products.');
    setMeta('og:type', type);
    setMeta('og:url', url);
    setMeta('og:image', image || defaultImage);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title || 'Divyam Ayurveda');
    setMeta('twitter:description', description || 'Discover authentic Ayurvedic beauty and wellness products.');
    setMeta('twitter:image', image || defaultImage);

    if (type === 'product') {
      setMeta('og:price:amount', price || '');
      setMeta('og:price:currency', 'USD');
      setMeta('og:availability', availability || 'instock');
      setMeta('og:brand', brand || 'Divyam Ayurveda');
      setMeta('product:price:amount', price || '');
      setMeta('product:price:currency', 'USD');
      setMeta('product:availability', availability || 'instock');
      setMeta('product:brand', brand || 'Divyam Ayurveda');
      setMeta('product:sku', sku || '');
    }

    let script = document.getElementById('structured-data');
    if (!script) {
      script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const structuredData = type === 'product' ? {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: title,
      description: description,
      image: image || defaultImage,
      brand: { '@type': 'Brand', name: brand || 'Divyam Ayurveda' },
      sku: sku,
      offers: {
        '@type': 'Offer',
        url: url,
        priceCurrency: 'USD',
        price: price,
        availability: availability === 'instock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      }
    } : {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Divyam Ayurveda',
      url: 'https://divyamayurveda.com',
      description: description || 'Discover authentic Ayurvedic beauty and wellness products.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://divyamayurveda.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    };

    script.textContent = JSON.stringify(structuredData);

    return () => {};
  }, [title, description, keywords, image, type, price, availability, brand, sku, url]);

  return null;
}
