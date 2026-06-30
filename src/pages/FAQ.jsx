import SEO from '../components/SEO.jsx';

const faqs = [
  {
    question: 'What is Divyam Ayurveda?',
    answer:
      'Divyam Ayurveda is a premium e-commerce brand offering high-quality Ayurvedic and herbal wellness products designed to support a healthy and balanced lifestyle.',
  },
  {
    question: 'Are your products natural and authentic?',
    answer:
      'Yes. We are committed to providing products made with carefully selected ingredients and manufactured under strict quality standards.',
  },
  {
    question: 'Do you deliver across India?',
    answer: 'Yes, we deliver our products across India through reliable shipping partners.',
  },
  {
    question: 'How can I place an order?',
    answer:
      'You can easily place an order through our website by selecting your desired products, adding them to your cart, and completing the secure checkout process.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Orders are typically delivered within 3–7 business days, depending on your location.',
  },
  {
    question: 'Are online payments secure?',
    answer: 'Absolutely. We use secure payment gateways to ensure safe and hassle-free transactions.',
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes. Once your order is shipped, you will receive a tracking link via email or SMS.',
  },
  {
    question: 'What should I do if I receive a damaged or incorrect product?',
    answer:
      'Please contact our customer support team within 48 hours of delivery, and we will assist you with a replacement or resolution.',
  },
  {
    question: 'Do you offer customer support?',
    answer: 'Yes. Our support team is available to help with product inquiries, orders, and after-sales assistance.',
  },
  {
    question: 'How can I contact Divyam Ayurveda?',
    answer:
      'You can reach us through our website, email, or customer support number for any questions or assistance.',
  },
];

export default function FAQ() {
  return (
    <>
      <SEO title="FAQs" description="Frequently asked questions about Divyam Ayurveda products, delivery, support, and ordering." />

      <div className="bg-primary pt-28 pb-14">
        <div className="section-padding text-center">
          <span className="text-secondary text-sm uppercase tracking-[0.32em] font-semibold">Need help?</span>
          <h1 className="heading-lg text-white mt-4">Frequently Asked Questions</h1>
          <p className="text-white/70 max-w-3xl mx-auto mt-4 text-sm">
            Find quick answers to common questions about Divyam Ayurveda, our products, ordering, delivery, and support.
          </p>
        </div>
      </div>

      <div className="py-20 bg-cream">
        <div className="section-padding">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.6fr] items-start max-w-6xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-[32px] border border-gray-200 bg-white p-8 shadow-xl">
                  <h2 className="text-xl font-semibold text-text mb-3">{faq.question}</h2>
                  <p className="text-body text-sm leading-relaxed text-text-muted">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[32px] bg-primary text-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
              <span className="text-secondary uppercase text-sm tracking-[0.3em] font-semibold">Quick support</span>
              <h2 className="mt-5 text-3xl font-bold">Still have questions?</h2>
              <p className="mt-4 text-white/80 text-sm leading-relaxed">
                Our customer care team is ready to help you with orders, product details, delivery tracking, and support.
              </p>
              <div className="mt-8 space-y-5 text-sm">
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:care@divyamayurveda.com" className="text-white/80 hover:text-white">care@divyamayurveda.com</a>
                </div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <a href="tel:+919217872866" className="text-white/80 hover:text-white">+91 92178 72866</a>
                </div>
                <div>
                  <p className="font-semibold">Delivery support</p>
                  <p className="text-white/80">Track your order and get help within 48 hours of delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
