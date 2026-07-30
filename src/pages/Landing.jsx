import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Twitter, Instagram, Linkedin, Github, Star, BarChart3, Target, BrainCircuit, TrendingUp, ClipboardList, Bell, MessageCircle, Lightbulb, PieChart, UserPlus, Database, Sparkles, DollarSign, Wallet, CreditCard, PiggyBank, Landmark, Receipt, Coins, BadgeDollarSign, Menu, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const features = [
  { icon: <BarChart3 size={28} className="text-green-600 dark:text-green-400" />, title: 'Smart Tracking', desc: 'Automatically categorize and track all your income and expenses in real-time.' },
  { icon: <Target size={28} className="text-green-600 dark:text-green-400" />, title: 'Budget Management', desc: 'Set spending limits and get alerts when you approach your budget thresholds.' },
  { icon: <BrainCircuit size={28} className="text-green-600 dark:text-green-400" />, title: 'AI Insights', desc: 'Get personalized financial advice. Let AI guide your financial decisions.' },
  { icon: <TrendingUp size={28} className="text-green-600 dark:text-green-400" />, title: 'Visual Reports', desc: 'Beautiful charts and graphs to understand your financial patterns.' },
  { icon: <ClipboardList size={28} className="text-green-600 dark:text-green-400" />, title: 'Debt Tracking', desc: 'Keep track of money owed to you and debts you need to pay.' },
  { icon: <Bell size={28} className="text-green-600 dark:text-green-400" />, title: 'Smart Alerts', desc: 'Never miss a payment or budget limit with intelligent notifications.' },
];

const steps = [
  { icon: <UserPlus size={24} />, title: 'Create Account', desc: 'Sign up in seconds with your email address.' },
  { icon: <Database size={24} />, title: 'Add Your Data', desc: 'Enter your income, expenses, and financial goals.' },
  { icon: <Sparkles size={24} />, title: 'Get Insights', desc: 'Let AI analyze your finances and provide recommendations.' },
];

const testimonials = [
  { name: 'Adebayo O.', role: 'Freelance Developer', rating: 5, text: "I used to lose track of client payments all the time. Akanti keeps everything in one place — I finally know where my money goes each month." },
  { name: 'Chioma N.', role: 'Boutique Owner', rating: 5, text: "Running a small shop in Lagos means every naira counts. The budget alerts have saved me from overspending on inventory more than once." },
  { name: 'Emeka A.', role: 'University Student', rating: 4, text: "My allowance used to disappear by week two. Now I actually make it to the end of the month, and the expense breakdowns keep me honest." },
];

const demoChartData = [
  { month: 'Jan', income: 450000, expenses: 320000 },
  { month: 'Feb', income: 520000, expenses: 380000 },
  { month: 'Mar', income: 480000, expenses: 350000 },
  { month: 'Apr', income: 610000, expenses: 420000 },
  { month: 'May', income: 550000, expenses: 390000 },
  { month: 'Jun', income: 670000, expenses: 450000 },
  { month: 'Jul', income: 720000, expenses: 480000 },
  { month: 'Aug', income: 690000, expenses: 510000 },
  { month: 'Sep', income: 750000, expenses: 470000 },
  { month: 'Oct', income: 800000, expenses: 530000 },
  { month: 'Nov', income: 780000, expenses: 520000 },
  { month: 'Dec', income: 850000, expenses: 560000 },
];

const typewriterWords = ['Income', 'Expenses', 'Budget', 'Savings', 'Debts'];

export default function Landing() {
  const { token, logout } = useAuth();
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef(null);
  const [chartData, setChartData] = useState(demoChartData);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (token) logout();
  }, []);

  useEffect(() => {
    const currentWord = typewriterWords[wordIndex];

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, 100);
      } else {
        timeoutRef.current = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % typewriterWords.length);
      }
    }

    return () => clearTimeout(timeoutRef.current);
  }, [displayText, isDeleting, wordIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => prev.map(item => ({
        ...item,
        income: item.income + (Math.random() - 0.48) * 30000,
        expenses: item.expenses + (Math.random() - 0.48) * 20000,
      })));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/akanti-logo.jpeg" alt="Akanti" className="h-10 w-10 sm:h-14 sm:w-14 rounded-lg object-cover" />
            <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">Akanti</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">Home</a>
            <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors">About</a>
            {token ? (
              <Link to="/dashboard" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">Get Started</Link>
              </>
            )}
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-600 dark:text-gray-300">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-4 space-y-3">
            <a href="#" className="block text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium">Home</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium">About</a>
            {token ? (
              <Link to="/dashboard" className="block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium text-center">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">Login</Link>
                <Link to="/register" className="block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium text-center">Get Started</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 bg-gradient-to-br from-green-800 to-green-600 dark:from-gray-900 dark:to-gray-800">
        {/* Floating finance icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { Icon: DollarSign, top: '10%', left: '5%', size: 28, delay: '0s', duration: '6s' },
            { Icon: Wallet, top: '20%', right: '8%', size: 32, delay: '1s', duration: '7s' },
            { Icon: CreditCard, top: '60%', left: '3%', size: 26, delay: '2s', duration: '5s' },
            { Icon: PiggyBank, top: '70%', right: '5%', size: 30, delay: '0.5s', duration: '8s' },
            { Icon: TrendingUp, top: '40%', left: '8%', size: 28, delay: '1.5s', duration: '6.5s' },
            { Icon: Landmark, top: '15%', left: '25%', size: 24, delay: '3s', duration: '7.5s' },
            { Icon: Receipt, top: '80%', left: '15%', size: 26, delay: '2.5s', duration: '5.5s' },
            { Icon: Coins, top: '50%', right: '15%', size: 28, delay: '0.8s', duration: '6.8s' },
            { Icon: BarChart3, top: '30%', right: '25%', size: 24, delay: '1.2s', duration: '7.2s' },
            { Icon: BadgeDollarSign, top: '75%', right: '30%', size: 30, delay: '3.5s', duration: '5.8s' },
            { Icon: PieChart, top: '5%', right: '35%', size: 26, delay: '2.2s', duration: '6.2s' },
            { Icon: Wallet, top: '85%', left: '40%', size: 24, delay: '1.8s', duration: '7.8s' },
          ].map(({ Icon, size, delay, duration, ...pos }, i) => (
            <div
              key={i}
              className="absolute text-white opacity-40"
              style={{ ...pos, animation: `float ${duration} ease-in-out ${delay} infinite` }}
            >
              <Icon size={size} />
            </div>
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Every <span className="text-green-300">{displayText}</span><span className="text-green-300 animate-pulse">|</span><br />
              <em className="text-green-100 font-normal">Tracked.</em>
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-xl">
              AI-powered personal finance management designed for everyone. Track income, manage budgets, and get smart insights.
            </p>
            <div className="flex items-center gap-4 md:justify-start justify-center">
              {token ? (
                <Link to="/dashboard" className="bg-white hover:bg-green-50 text-green-800 px-8 py-3 rounded-lg font-medium text-lg transition-colors">Go to Dashboard</Link>
              ) : (
                <Link to="/register" className="bg-white hover:bg-green-50 text-green-800 px-8 py-3 rounded-lg font-medium text-lg transition-colors">Start Free Today</Link>
              )}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/austin-hervias-VLpWpv3oDB4-unsplash.jpg" alt="Finance" className="w-full max-w-lg rounded-2xl shadow-2xl object-cover" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '10k+', label: 'Active Users' },
            { value: '50k+', label: 'Transactions Tracked' },
            { value: '99.9%', label: 'Uptime' },
            { value: '4.8', label: 'User Rating' },
          ].map((s, i) => (
            <div key={i} className="space-y-1">
              <p className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Akanti */}
      <section className="px-6 py-20 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-4">Why Akanti</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Smarter Than a Spreadsheet</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Most finance apps just track what you spend. Akanti understands it — and helps you make better decisions.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-5"><MessageCircle size={26} className="text-green-600 dark:text-green-400" /></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Chat in Plain English</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">Ask "How much did I spend on food this month?" or "Give me budgeting tips" — the AI understands and answers from your actual data.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-5"><Lightbulb size={26} className="text-green-600 dark:text-green-400" /></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">AI That Knows You</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">Every insight is personalized — based on your income, your spending, your goals. No generic advice, no one-size-fits-all tips.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-5"><PieChart size={26} className="text-green-600 dark:text-green-400" /></div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Full Picture Dashboard</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">Income, expenses, budgets, debts, cash flow, reports — everything in one place. Beautiful charts make your finances easy to understand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Chart */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">See Your Money Flow</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Track income vs expenses over time with beautiful, interactive charts. Spot trends, identify overspending, and make smarter financial decisions.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">Income vs Expenses</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Demo Data — 2026</span>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
                <Legend />
                <Area type="monotone" dataKey="income" name="Income" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#dc2626" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* About / Features */}
      <section id="about" className="px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Everything You Need</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-green-300 dark:hover:border-green-600 cursor-pointer">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="text-center transition-all duration-300 hover:-translate-y-1 cursor-pointer flex-1 min-w-[200px]">
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-bold mb-3 uppercase tracking-wide">Step {i + 1}</span>
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">{s.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block text-green-400 dark:text-green-500">
                  <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">What Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-green-300 dark:hover:border-green-600 cursor-pointer">
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className={j < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">{t.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-green-600 dark:bg-green-700 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Start?</h2>
        <p className="text-green-100 mb-8 text-lg">Join thousands of users managing their finances smarter with Akanti.</p>
        {token ? (
          <Link to="/dashboard" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block">Go to Dashboard</Link>
        ) : (
          <Link to="/register" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg transition-colors inline-block">Create Free Account</Link>
        )}
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="/akanti-logo.jpeg" alt="Akanti" className="h-8 w-8 rounded-lg object-cover" />
              <span className="text-xl font-bold text-green-600 dark:text-green-400">Akanti</span>
            </div>
            <p className="text-gray-400 text-sm">Track. Budget. Grow.</p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-500 transition-colors"><Twitter size={18} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-500 transition-colors"><Instagram size={18} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-500 transition-colors"><Linkedin size={18} /></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-500 transition-colors"><Github size={18} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-gray-400 hover:text-green-500 transition-colors">Features</a></li>
              <li><Link to="/docs" className="text-gray-400 hover:text-green-500 transition-colors">Documentation</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-gray-400 hover:text-green-500 transition-colors">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Blog</a></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-green-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-green-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/docs" className="text-gray-400 hover:text-green-500 transition-colors">Help Center</Link></li>
              <li><a href="mailto:support@akanti.com" className="text-gray-400 hover:text-green-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-500 transition-colors">Status</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">&copy; 2026 Akanti. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
