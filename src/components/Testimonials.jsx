import { useState, useEffect } from 'react';
import { Star, Quote, Clock } from 'lucide-react';

const STORAGE_KEY = 'divyam_reviews';
const USER_ID_KEY = 'divyam_review_user_id';
const APPROVAL_EMAIL = 'farddinkhan18@gmail.com';

const initialTestimonials = [
  {
    id: 'initial-1',
    name: 'Priya M.',
    location: 'Delhi, India',
    rating: 5,
    text: 'The Ashwagandha Capsules have transformed my evenings. I feel calmer, more balanced, and my sleep has improved.',
    product: 'Ashwagandha Capsules',
    timestamp: '2024-06-10T10:00:00.000Z',
    status: 'approved',
  },
  {
    id: 'initial-2',
    name: 'Sarah K.',
    location: 'Mumbai, India',
    rating: 5,
    text: 'The Vitamin C Face Serum is on another level. My skin has never looked brighter, and the glow stays all day.',
    product: 'Vitamin C Face Serum',
    timestamp: '2024-06-05T14:30:00.000Z',
    status: 'approved',
  },
  {
    id: 'initial-3',
    name: 'Michael B.',
    location: 'Bangalore, India',
    rating: 5,
    text: 'Taking Ashwagandha Capsules daily has helped me manage stress so much better. I feel more energized and focused.',
    product: 'Ashwagandha Capsules',
    timestamp: '2024-05-26T09:15:00.000Z',
    status: 'approved',
  },
];

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) + ' • ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ name: '', rating: 5, text: '' });
  const [submitted, setSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [userId] = useState(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(USER_ID_KEY);
    if (saved) return saved;
    const generated = `user-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem(USER_ID_KEY, generated);
    return generated;
  });

  const isAdmin = typeof window !== 'undefined' && window.location.search.includes('admin=1');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch {
        setReviews(initialTestimonials);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTestimonials));
      }
    } else {
      setReviews(initialTestimonials);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTestimonials));
    }
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    }
  }, [reviews]);

  const pendingReviews = reviews.filter((review) => review.status === 'pending');
  const visibleReviews = reviews.filter((review) => {
    if (review.userId && review.userId === userId) return true;
    return review.status === 'approved' && !review.privateReview;
  });
  const shownReviews = showAllReviews ? visibleReviews : visibleReviews.slice(0, 3);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const ratingValue = Number(form.rating);
    const isNegative = ratingValue < 3;
    const newReview = {
      id: `review-${Date.now()}`,
      userId,
      name: form.name.trim() || 'Anonymous',
      location: 'India',
      rating: ratingValue,
      text: form.text.trim(),
      product: 'Divyam product',
      timestamp: new Date().toISOString(),
      status: 'pending',
      privateReview: isNegative,
    };

    setReviews((prev) => [newReview, ...prev]);
    setForm({ name: '', rating: 5, text: '' });
    setSubmitted(true);
    setEmailSent(false);
    setSubmitError(null);

    try {
      const response = await fetch('/api/reviews/request-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });

      if (response.ok) {
        setEmailSent(true);
      } else {
        const errorData = await response.json().catch(() => null);
        setSubmitError(errorData?.error || 'Unable to send review approval request.');
      }
    } catch (error) {
      setSubmitError(error.message || 'Unable to send review approval request.');
    }
  };

  const approveReview = (id) => {
    setReviews((prev) => prev.map((review) => (review.id === id ? { ...review, status: 'approved' } : review)));
  };

  return (
    <section className="py-16 bg-primary text-white">
      <div className="section-padding">
        <div className="text-center mb-12">
          <span className="text-secondary text-sm font-semibold uppercase tracking-wider">Customer Reviews</span>
          <h2 className="heading-md mt-1">Trusted by Real Customers</h2>
          <p className="mt-3 text-white/70 max-w-2xl mx-auto">
            Read genuine customer experiences with Divyam products. Every new review is checked before it appears publicly.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-10">
          <div className="grid gap-6">
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6">
                <div>
                  <p className="text-sm text-white/70">Overall Rating</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <p className="text-5xl font-bold text-white">{visibleReviews.length ? (visibleReviews.reduce((sum, review) => sum + review.rating, 0) / visibleReviews.length).toFixed(1) : '0.0'}</p>
                      <p className="text-sm text-white/60">Based on {visibleReviews.length} reviews</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => {
                        const value = index + 1;
                        const ratingValue = visibleReviews.length ? Math.round(visibleReviews.reduce((sum, review) => sum + review.rating, 0) / visibleReviews.length) : 0;
                        return (
                          <Star
                            key={value}
                            className={`w-5 h-5 ${value <= ratingValue ? 'text-secondary fill-secondary' : 'text-white/30'}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 w-full md:w-[340px]">
                  {[5, 4, 3, 2, 1].map((value) => {
                    const count = visibleReviews.filter((review) => review.rating === value).length;
                    const percentage = visibleReviews.length ? Math.round((count / visibleReviews.length) * 100) : 0;
                    return (
                      <div key={value} className="flex items-center gap-3 text-xs text-white/80">
                        <span className="w-10 font-semibold">{value} star</span>
                        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full bg-secondary" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="w-10 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {visibleReviews.length > 0 ? (
              shownReviews.map((testimonial) => (
                <div key={testimonial.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-3xl">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Quote className="w-7 h-7 text-secondary/50" />
                      <div>
                        <p className="text-sm font-semibold">{testimonial.name}</p>
                        <p className="text-[11px] text-white/60">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-white/70">
                      <Clock className="w-4 h-4" />
                      {formatDate(testimonial.timestamp)}
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, index) => {
                      const value = index + 1;
                      return (
                        <Star
                          key={value}
                          fill={value <= testimonial.rating ? 'currentColor' : 'none'}
                          className={`w-4 h-4 ${value <= testimonial.rating ? 'text-secondary' : 'text-white/30'}`}
                        />
                      );
                    })}
                  </div>
                  <p className="text-white/85 leading-relaxed mb-4">"{testimonial.text}"</p>
                  <p className="text-secondary text-[11px]">Purchased: {testimonial.product}</p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl bg-white/10 p-6 text-center">
                <p className="text-white/80">No approved reviews yet. Be the first to submit a review.</p>
              </div>
            )}
            {visibleReviews.length > 3 && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllReviews((prev) => !prev)}
                  className="inline-flex items-center rounded-full border border-secondary bg-secondary/10 px-5 py-2 text-sm font-semibold text-secondary hover:bg-secondary/15 transition-colors"
                >
                  {showAllReviews ? 'View less reviews' : `View more reviews (${visibleReviews.length - 3} more)`}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white text-black p-6 text-text shadow-xl">
              <div className="flex items-center text-black justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-2xl font-semibold">Submit a review</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Share your experience with Divyam products. Your review will appear after approval.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="grid gap-2 text-sm font-medium">
                  Name
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <div className="grid gap-3 text-sm font-medium">
                  <span>Rating</span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, rating: value }))}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-all"
                      >
                        <Star
                          className={`w-8 h-8 ${value <= (hoverRating || form.rating) ? 'text-secondary fill-secondary' : 'text-gray-300'}`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <label className="grid gap-2 text-sm font-medium">
                  Review
                  <textarea
                    name="text"
                    value={form.text}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Write your review here"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                  Submit review
                </button>

                {submitted && (
                  <div className="space-y-2">
                    <p className="text-sm text-emerald-600">
                      Thank you! Your review has been submitted and will appear once approved.
                    </p>
                    {emailSent && (
                      <p className="text-sm text-gray-500">Approval request email sent to {APPROVAL_EMAIL}.</p>
                    )}
                    {submitError && (
                      <p className="text-sm text-red-600">{submitError}</p>
                    )}
                  </div>
                )}
              </form>
            </div>

            {isAdmin && pendingReviews.length > 0 && (
              <div className="rounded-3xl bg-white p-6 text-text shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Pending reviews</h3>
                  <span className="text-sm text-gray-500">Admin mode</span>
                </div>
                <div className="space-y-4">
                  {pendingReviews.map((review) => (
                    <div key={review.id} className="rounded-2xl border border-gray-200 p-4">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold">{review.name || 'Anonymous'}</p>
                          <p className="text-xs text-gray-500">{formatDate(review.timestamp)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => approveReview(review.id)}
                          className="rounded-full bg-secondary px-3 py-2 text-xs font-semibold text-white"
                        >
                          Approve
                        </button>
                      </div>
                      <p className="text-sm text-text-muted">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
