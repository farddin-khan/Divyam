import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO.jsx';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    'Phone No.': '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', 'Phone No.': '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Divyam Ayurvedha Pvt Ltd. We are here to help with your wellness journey."
      />

      <div className="bg-primary pt-28 pb-14">
        <div className="section-padding text-center">
          <h1 className="heading-lg text-white mb-3">Get in Touch</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-sm">
            We would love to hear from you. Whether you have a question about our products,
            need wellness advice, or just want to say hello.
          </p>
        </div>
      </div>

      <div className="py-16 bg-white">
        <div className="section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="lg:col-span-1">
              <h2 className="font-bold text-xl text-text mb-6">Contact Information</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text text-sm">Our Address</h4>
                    <p className="text-body text-xs mt-1">A-142 Transport Nagar<br />Noida, Uttar Pradesh<br />India 201301</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text text-sm">Call Us</h4>
                    <a href="tel:+919217872866" className="text-body text-xs mt-1 hover:text-primary transition-colors">+91 92178 72866</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text text-sm">Email Us</h4>
                    <a href="mailto:care@divyamayurvedha.com" className="text-body text-xs mt-1 hover:text-primary transition-colors">care@divyamayurvedha.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text text-sm">Working Hours</h4>
                    <p className="text-body text-xs mt-1">Monday - Saturday: 9am - 6pm<br />Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-warm p-6 rounded-xl">
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="font-bold text-xl text-text mb-2">Message Sent!</h3>
                    <p className="text-body text-sm">Thank you for reaching out. We will get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">Your Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your Full Name"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">Your Email *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your Email ID"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                        />
                      </div>
                      {/* Phone No */}
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">
                          Phone No. *
                        </label>

                        <input
                          type="tel"
                          name="Phone No."
                          required
                          value={formData["Phone No."]}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 10);

                            setFormData((prev) => ({
                              ...prev,
                              ["Phone No."]: value,
                            }));
                          }}
                          maxLength={10}
                          pattern="[0-9]{10}"
                          inputMode="numeric"
                          placeholder="Enter 10-digit phone number"
                          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                        />
                      </div>

                    </div>
                    {/* <div>
                      <label className="block text-xs font-semibold mb-1.5">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors text-sm"
                      />
                    </div> */}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5">Message *</label>
                      <textarea
                        name="message"
                        rows="4"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Enter your Additional Message"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-primary outline-none transition-colors resize-none text-sm"
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                      <Send className="w-4 h-4" /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
