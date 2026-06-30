import SEO from '../components/SEO.jsx';

export default function Shipping() {
  return (
    <>
      <SEO title="Shipping Information" description="Shipping information for Divyam Ayurveda orders across India." />

      <div className="bg-primary pt-28 pb-14">
        <div className="section-padding text-center">
          <span className="text-secondary uppercase text-sm tracking-[0.32em] font-semibold">Shipping</span>
          <h1 className="heading-lg text-white mt-4">Shipping Information</h1>
          <p className="text-white/70 max-w-3xl mx-auto mt-4 text-sm">
            At Divyam Ayurveda, we are committed to delivering your orders quickly, safely, and efficiently.
          </p>
        </div>
      </div>

      <div className="py-20 bg-cream">
        <div className="section-padding max-w-5xl mx-auto space-y-10 text-text">
          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Order Processing</h2>
            <ul className="list-disc list-inside space-y-3 text-sm leading-relaxed text-body">
              <li>Orders are processed within <strong>24–48 hours</strong> of confirmation.</li>
              <li>Orders placed on weekends or public holidays will be processed on the next business day.</li>
            </ul>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Delivery Timeline</h2>
            <ul className="list-disc list-inside space-y-3 text-sm leading-relaxed text-body">
              <li><strong>Metro Cities:</strong> 2–5 business days</li>
              <li><strong>Other Locations:</strong> 3–7 business days</li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-body">
              Delivery timelines may vary depending on the delivery location and unforeseen circumstances.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Shipping Charges</h2>
            <p className="text-sm leading-relaxed text-body mb-4">
              Shipping charges, if applicable, will be displayed during checkout before payment confirmation. Free shipping may be available on selected products or promotional offers.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Order Tracking</h2>
            <p className="text-sm leading-relaxed text-body">
              Once your order is dispatched, you will receive a tracking link via email or SMS to monitor your shipment in real time.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Delivery Issues</h2>
            <p className="text-sm leading-relaxed text-body mb-4">
              If your order is delayed, damaged, or you have not received your package within the expected timeframe, please contact us at:</p>
            <p className="text-sm font-semibold text-text">Email: <a href="mailto:care@divyamayurveda.in" className="text-secondary hover:text-secondary/80">care@divyamayurveda.in</a></p>
            <p className="mt-4 text-sm leading-relaxed text-body">
              Divyam Ayurveda – Natural Wellness, Delivered with Care.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
