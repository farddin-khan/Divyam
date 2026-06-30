import SEO from '../components/SEO.jsx';
import Hero from '../components/Hero.jsx';
import CategorySection from '../components/CategorySection.jsx';
import FeaturedProducts from '../components/FeaturedProducts.jsx';
import BestSellers from '../components/BestSellers.jsx';
import AboutSection from '../components/AboutSection.jsx';
import Testimonials from '../components/Testimonials.jsx';
import BenefitsBanner from '../components/BenefitsBanner.jsx';
import InstagramFeed from '../components/InstagramFeed.jsx';

export default function Home() {
  return (
    <>
      <SEO
        title="Divyam Ayurveda - Authentic Ayurvedic Wellness Products"
        description="Discover authentic Ayurvedic beauty and wellness products. Handcrafted with pure, natural ingredients for hair care, skin care, and holistic wellness."
        keywords="Ayurveda, Divyam Ayurveda, natural products, organic skincare, hair care, essential oils, wellness, herbal remedies, India"
      />
      <Hero />
      <BenefitsBanner />
      <CategorySection />
      <FeaturedProducts />
      <AboutSection />
      <BestSellers />
      <Testimonials />
      <InstagramFeed />
    </>
  );
}
