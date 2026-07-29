import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src="/akanti-logo.jpeg" alt="Akanti" className="h-10 w-10 sm:h-10 sm:w-10 rounded-lg object-cover" />
            <span className="text-xl font-bold text-green-600 dark:text-green-400">Akanti</span>
          </Link>
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">← Back to Home</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Last updated: July 29, 2026</p>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Introduction</h2>
            <p>Akanti ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our personal finance management application.</p>
            <p>By using Akanti, you agree to the collection and use of information in accordance with this policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Information We Collect</h2>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Personal Data</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name and email address</li>
              <li>Phone number (optional)</li>
              <li>Account credentials (hashed passwords)</li>
              <li>Financial transaction data you enter</li>
            </ul>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-4 mb-1">Usage Data</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Pages visited and features used</li>
              <li>Device and browser information</li>
              <li>Time and duration of sessions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and generate reports</li>
              <li>Send AI-powered financial insights and recommendations</li>
              <li>Communicate updates, security alerts, and support messages</li>
              <li>Detect and prevent fraudulent or unauthorized activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Data Security</h2>
            <p>We implement industry-standard security measures including encryption at rest and in transit, secure password hashing, and regular security audits. Your financial data is stored securely and accessed only by you.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Data Retention</h2>
            <p>We retain your data for as long as your account is active. You may request deletion of your account and associated data at any time by contacting our support team.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Third-Party Services</h2>
            <p>Akanti uses the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Supabase</strong> — Cloud database hosting (PostgreSQL)</li>
              <li><strong>Render</strong> — Backend application hosting</li>
              <li><strong>Vercel</strong> — Frontend hosting</li>
              <li><strong>Groq</strong> — AI model inference for financial insights</li>
            </ul>
            <p className="mt-2">Each service provider has their own privacy policy governing the handling of data processed through their infrastructure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Your Rights</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your personal data at any time</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Delete your account and associated data</li>
              <li>Export your financial data (coming soon)</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
            <p>For privacy-related inquiries, please contact us at <a href="mailto:support@akanti.com" className="text-green-600 hover:underline">support@akanti.com</a>.</p>
          </section>
        </div>
      </div>

      <footer className="px-6 py-8 bg-gray-900 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">&copy; 2026 Akanti. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
