import { Link } from 'react-router-dom';

export default function Terms() {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Last updated: July 29, 2026</p>

        <div className="space-y-6 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Acceptance of Terms</h2>
            <p>By accessing or using Akanti ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Description of Service</h2>
            <p>Akanti is an AI-powered personal finance management application that helps users track income, manage expenses, create budgets, monitor debts, and receive financial insights. The Service is provided "as is" and may be updated or modified at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Use the Service in compliance with all applicable laws</li>
              <li>Not attempt to disrupt, hack, or compromise the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Data Accuracy</h2>
            <p>You are solely responsible for the accuracy of financial data you enter into the Service. Akanti provides analytical tools and AI recommendations based on your data but does not guarantee the accuracy, completeness, or usefulness of any generated insights. AI-powered financial suggestions are informational only and do not constitute professional financial advice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Limitation of Liability</h2>
            <p>Akanti and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. This includes but is not limited to financial losses, data loss, or business interruption.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Account Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or misuse the Service. You may delete your account at any time through your profile settings or by contacting support.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Intellectual Property</h2>
            <p>The Service, including its codebase, design, branding, and content, is the intellectual property of Akanti. You may not copy, modify, distribute, or create derivative works without explicit permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Changes to Terms</h2>
            <p>We may update these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms. We will notify users of material changes via email or in-app notification.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:support@akanti.com" className="text-green-600 hover:underline">support@akanti.com</a>.</p>
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
