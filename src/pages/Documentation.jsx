import { Link } from 'react-router-dom';

const sections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: (
      <div className="space-y-4">
        <p>Akanti helps you take control of your personal finances with AI-powered insights. Here's how to begin:</p>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <div><strong className="text-gray-900 dark:text-white">Create an account</strong><p className="text-sm mt-0.5">Sign up with your email at the registration page. No credit card required.</p></div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <div><strong className="text-gray-900 dark:text-white">Add your first transaction</strong><p className="text-sm mt-0.5">Navigate to Income or Expenses to start recording your financial data.</p></div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <div><strong className="text-gray-900 dark:text-white">Set budgets</strong><p className="text-sm mt-0.5">Create spending limits per category and get alerts when you approach them.</p></div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
            <div><strong className="text-gray-900 dark:text-white">Explore AI insights</strong><p className="text-sm mt-0.5">Ask the AI assistant questions about your finances and get personalized recommendations.</p></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'features',
    title: 'Features',
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Income & Expense Tracking</h3>
          <p>Record all your transactions with categories, dates, and descriptions. View totals and trends over time. Edit or delete records as needed.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Budget Management</h3>
          <p>Create monthly, weekly, or yearly budgets per category. Track your spending against limits and receive alerts when you're close to exceeding them.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Debt Tracking</h3>
          <p>Track money you owe and money owed to you. Set due dates, enable email reminders, and record partial payments. View upcoming debts in a 30-day window.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Assistant</h3>
          <p>Chat with an AI trained on your financial data. Ask questions like "How much did I spend on food this month?" or "Give me budgeting tips." Get personalized insights based on your actual spending patterns.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cash Flow & Reports</h3>
          <p>Visualize income vs expenses with interactive charts. View spending breakdowns by category and download CSV reports for offline analysis.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notifications</h3>
          <p>Get notified about budget alerts, debt reminders, and system announcements. Mark individual notifications as read or clear all at once.</p>
        </div>
      </div>
    )
  },
  {
    id: 'api',
    title: 'API Reference',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Base URL: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-green-600 text-xs">https://akanti-backend.onrender.com/api</code></p>
        <p className="text-sm mb-4">All endpoints except <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">/auth</code> require a JWT token in the <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">Authorization: Bearer</code> header.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Method</th>
                <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Endpoint</th>
                <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                ['POST', '/auth/register', 'Create a new account'],
                ['POST', '/auth/login', 'Log in and receive JWT'],
                ['POST', '/auth/verify-email', 'Verify email with code'],
                ['POST', '/auth/forgot-password', 'Request password reset'],
                ['POST', '/auth/reset-password', 'Reset password with code'],
                ['GET', '/income', 'List all income records'],
                ['POST', '/income', 'Add new income record'],
                ['GET', '/expense', 'List all expenses'],
                ['POST', '/expense', 'Add new expense record'],
                ['GET', '/budget', 'List all budgets'],
                ['POST', '/budget', 'Create a new budget'],
                ['GET', '/debt', 'List all debts'],
                ['POST', '/debt', 'Add a new debt record'],
                ['GET', '/debt/upcoming', 'Upcoming debts (30 days)'],
                ['POST', '/debt/:id/payment', 'Record a payment'],
                ['GET', '/notification', 'List notifications'],
                ['GET', '/dashboard', 'Dashboard summary data'],
                ['GET', '/category', 'List categories'],
                ['POST', '/aiassistant/chat', 'Send AI chat message'],
                ['GET', '/aiassistant/health-score', 'Get financial health score'],
              ].map(([method, path, desc], i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-2 px-3">
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      method === 'GET' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      method === 'POST' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>{method}</span>
                  </td>
                  <td className="py-2 px-3 font-mono text-xs text-gray-600 dark:text-gray-400">{path}</td>
                  <td className="py-2 px-3 text-gray-500 dark:text-gray-400">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    id: 'faq',
    title: 'FAQ',
    content: (
      <div className="space-y-4">
        {[
          { q: 'Is Akanti free to use?', a: 'Yes, Akanti is currently free. We may introduce premium features in the future, but the core functionality will remain free.' },
          { q: 'Is my financial data secure?', a: 'Yes. Passwords are hashed using SHA-256. All data is encrypted in transit via HTTPS and at rest in our database. We never share your financial data with third parties.' },
          { q: 'Can I export my data?', a: 'Yes. The Reports page allows you to download a CSV file containing all your income and expense records.' },
          { q: 'How does the AI work?', a: 'The AI assistant uses Groq\'s LLaMA 3.3 70B model. It analyzes your actual financial data to provide personalized insights and recommendations.' },
          { q: 'What if I forget my password?', a: 'Use the "Forgot Password" link on the login page to receive a reset code via email.' },
          { q: 'Can I delete my account?', a: 'Yes. Contact support or use the profile settings to request account deletion. All your data will be permanently removed.' },
        ].map(({ q, a }, i) => (
          <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">{q}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{a}</p>
          </div>
        ))}
      </div>
    )
  }
];

export default function Documentation() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">Documentation</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Everything you need to know about using Akanti.</p>

        <div className="flex flex-col lg:flex-row gap-8">
          <nav className="lg:w-56 flex-shrink-0">
            <div className="sticky top-20 space-y-1">
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium">
                  {s.title}
                </a>
              ))}
            </div>
          </nav>

          <div className="flex-1 min-w-0 space-y-12">
            {sections.map(s => (
              <section key={s.id} id={s.id}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{s.title}</h2>
                {s.content}
              </section>
            ))}
          </div>
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
