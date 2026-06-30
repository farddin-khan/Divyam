import { useState } from 'react';
import { Link } from 'react-router-dom';

function downloadJsonFile(filename, data) {
  const jsonText = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      type: 'login',
      savedAt: new Date().toISOString(),
      email: formData.email,
      password: formData.password,
    };
    downloadJsonFile(`login-details-${Date.now()}.txt`, payload);
    setSaved(true);
  };

  return (
    <div className="section-padding py-16">
      <div className="max-w-3xl mx-auto rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-text">Login to your account</h1>
          <p className="mt-3 text-sm text-gray-500">
            Enter your email and password to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <label className="grid gap-2 text-sm font-medium text-text">
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-text">
            Password
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <button
            type="submit"
            className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
          >
            Save details
          </button>

          {saved && (
            <p className="text-sm text-green-600">Your login details have been downloaded as a JSON text file.</p>
          )}
        </form>

        <p className="mt-6 text-sm text-gray-600">
          New here?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
