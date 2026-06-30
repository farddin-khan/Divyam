import SEO from '../components/SEO.jsx';

export default function Terms() {
  return (
    <>
      <SEO title="Terms & Conditions" description="Terms and conditions for using the Divyam Ayurveda website and services." />

      <div className="bg-primary pt-28 pb-14">
        <div className="section-padding text-center">
          <span className="text-secondary uppercase text-sm tracking-[0.32em] font-semibold">Terms</span>
          <h1 className="heading-lg text-white mt-4">Terms & Conditions</h1>
          <p className="text-white/70 max-w-3xl mx-auto mt-4 text-sm">
            Divyam Ayurveda is committed to providing transparent, trustworthy terms that protect your rights and our services.
          </p>
        </div>
      </div>

      <div className="py-20 bg-cream">
        <div className="section-padding max-w-5xl mx-auto space-y-10 text-text">
          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <p className="text-sm text-body">Effective Date: June 27, 2026</p>
            <p className="mt-4 text-sm leading-relaxed text-body">
              At Divyam Ayurveda, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard the information you share with us while using our website and services.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed text-body">
              <li>Name, email address, phone number, and shipping address</li>
              <li>Billing and payment information</li>
              <li>Order history and transaction details</li>
              <li>Information provided when you contact customer support</li>
              <li>Website usage data, including cookies and analytics information</li>
            </ul>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed text-body">
              <li>Process and deliver your orders</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send order updates and important notifications</li>
              <li>Improve our products, services, and website experience</li>
              <li>Prevent fraud and maintain website security</li>
              <li>Send promotional offers and marketing communications (with your consent where required)</li>
            </ul>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p className="text-sm leading-relaxed text-body">
              We do not sell, rent, or trade your personal information. We may share information only with trusted payment gateways and logistics partners for order fulfillment, service providers assisting in website operations and customer support, or government authorities when required by applicable laws.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-sm leading-relaxed text-body">
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or misuse.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="text-sm leading-relaxed text-body">
              Our website may use cookies and similar technologies to enhance your browsing experience, remember preferences, and analyze website performance.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-sm leading-relaxed text-body">
              You may request to access, update, or correct your personal information, opt out of marketing communications, or request deletion of your personal information, subject to legal and operational requirements.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Links</h2>
            <p className="text-sm leading-relaxed text-body">
              Our website may contain links to third-party websites. Divyam Ayurveda is not responsible for the privacy practices or content of such external websites.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-sm leading-relaxed text-body">
              We reserve the right to update this policy at any time. Any changes will be posted on this page with the updated effective date.
            </p>
          </div>

          <div className="rounded-[32px] bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-sm leading-relaxed text-body">
              For any questions regarding these terms or your personal information, please contact us at:
            </p>
            <p className="mt-4 text-sm font-semibold text-text">Email: <a href="mailto:care@divyamayurveda.in" className="text-secondary hover:text-secondary/80">care@divyamayurveda.in</a></p>
            <p className="mt-4 text-sm leading-relaxed text-body">
              Divyam Ayurveda – Committed to Protecting Your Privacy and Delivering Wellness with Trust.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
