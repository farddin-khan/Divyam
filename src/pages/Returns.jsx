import SEO from '../components/SEO.jsx';

export default function Returns() {
  return (
    <>
      <SEO title="Returns & Exchanges" description="Learn how to request a return or exchange for Divyam Ayurveda orders." />

      <div className="bg-primary pt-28 pb-14">
        <div className="section-padding text-center">
          <span className="text-secondary uppercase text-sm tracking-[0.32em] font-semibold">Customer Care</span>
          <h1 className="heading-lg text-white mt-4">Return & Exchange Policy</h1>
          <p className="text-white/70 max-w-3xl mx-auto mt-4 text-sm">
            At Divyam Ayurveda, customer satisfaction is our priority. We strive to deliver premium-quality products in perfect condition.
          </p>
        </div>
      </div>

      <div className="py-20 bg-cream">
        <div className="section-padding max-w-5xl mx-auto space-y-10 text-text">
          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Returns & Exchanges</h2>
            <p className="text-sm leading-relaxed text-body mb-4">
              Products can be returned or exchanged only if they are damaged, defective, or incorrect at the time of delivery. To request a return or exchange, please contact our customer support team within 48 hours of receiving your order.
            </p>
            <p className="text-sm leading-relaxed text-body">
              Customers are required to share clear photos or videos of the damaged or incorrect product and its packaging for verification.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Non-Returnable Items</h2>
            <p className="text-sm leading-relaxed text-body mb-4">
              For hygiene and safety reasons, we do not accept returns or exchanges for:</p>
            <ul className="list-disc list-inside text-sm leading-relaxed text-body space-y-2">
              <li>Opened or used products</li>
              <li>Products with tampered packaging</li>
              <li>Items returned after the specified return period</li>
              <li>Products purchased during special promotions or clearance sales (unless damaged or incorrect)</li>
            </ul>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
            <p className="text-sm leading-relaxed text-body">
              Once the returned item is inspected and approved, a replacement or refund will be processed within 5–7 business days to the original payment method.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-sm leading-relaxed text-body">
              For any return, exchange, or support-related queries, please contact us at:
            </p>
            <p className="mt-4 text-sm font-semibold text-text">Email: <a href="mailto:care@divyamayurveda.in" className="text-secondary hover:text-secondary/80">care@divyamayurveda.in</a></p>
            <p className="mt-4 text-sm leading-relaxed text-body">
              Divyam Ayurveda – Delivering Wellness with Trust and Care.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
