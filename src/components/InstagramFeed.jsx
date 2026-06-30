import { Instagram } from 'lucide-react';

export default function InstagramFeed() {
  const images = [
    'https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/5240672/pexels-photo-5240672.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/4465828/pexels-photo-4465828.jpeg?auto=compress&cs=tinysrgb&w=400',
  ];

  return (
    <section className="py-16 bg-warm">
      <div className="text-center mb-10 section-padding">
        <span className="text-primary text-sm font-semibold uppercase tracking-wider">Follow Us</span>
        <h2 className="heading-md text-text mt-1">@divyamayurveda_official</h2>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-1">
        {images.map((img, index) => (
          <a
            key={index}
            href="https://www.instagram.com/divyamayurveda_official/m"
            target="_blank"
            rel="noopener noreferrer"
            className="relative aspect-square overflow-hidden group"
          >
            <img
              src={img}
              alt={`Instagram post ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
