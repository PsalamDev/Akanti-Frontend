import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Twitter, Instagram, Linkedin, Github, Star, BarChart3, Target, BrainCircuit, TrendingUp, ClipboardList, Bell, MessageCircle, Lightbulb, PieChart, UserPlus, Database, Sparkles, Menu, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const features = [
  { icon: <BarChart3 size={28} className="text-[#10B981]" />, title: 'Smart Tracking', desc: 'Automatically categorize and track all your income and expenses in real-time.' },
  { icon: <Target size={28} className="text-[#10B981]" />, title: 'Budget Management', desc: 'Set spending limits and get alerts when you approach your budget thresholds.' },
  { icon: <BrainCircuit size={28} className="text-[#10B981]" />, title: 'AI Assistant', desc: 'Ask questions in plain language and get answers grounded in your own totals.' },
  { icon: <TrendingUp size={28} className="text-[#10B981]" />, title: 'Visual Reports', desc: 'Beautiful charts and graphs to understand your financial patterns.' },
  { icon: <ClipboardList size={28} className="text-[#10B981]" />, title: 'Debt Tracking', desc: 'Keep track of money owed to you and debts you need to pay.' },
  { icon: <Bell size={28} className="text-[#10B981]" />, title: 'Smart Alerts', desc: 'Never miss a payment or budget limit with intelligent notifications.' },
];

const steps = [
  { icon: <UserPlus size={24} />, title: 'Create Account', desc: 'Sign up in seconds with your email address.' },
  { icon: <Database size={24} />, title: 'Add Your Data', desc: 'Enter your income, expenses, and financial goals.' },
  { icon: <Sparkles size={24} />, title: 'Ask Akanti', desc: 'Ask the assistant about your spending and get advice you can act on.' },
];

const testimonials = [
  { name: 'Adebayo O.', role: 'Freelance Developer', rating: 5, text: "I used to lose track of client payments all the time. Akanti keeps everything in one place - I finally know where my money goes each month." },
  { name: 'Chioma N.', role: 'Boutique Owner', rating: 5, text: "Running a small shop means every naira counts. The budget alerts have saved me from overspending on inventory more than once." },
  { name: 'Emeka A.', role: 'University Student', rating: 5, text: "My allowance used to disappear by week two. Now I actually make it to the end of the month, and the expense breakdowns keep me honest." },
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
    <div className="min-h-screen bg-[#071A17] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#071A17]/95 backdrop-blur-lg border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/akanti-logo.jpeg" alt="Akanti" className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover" />
            <span className="text-xl sm:text-2xl font-bold text-[#10B981]">Akanti</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-300 hover:text-[#10B981] font-medium transition-colors">Home</a>
            <a href="#features" className="text-gray-300 hover:text-[#10B981] font-medium transition-colors">Features</a>
            <a href="#about" className="text-gray-300 hover:text-[#10B981] font-medium transition-colors">About</a>
            {token ? (
              <Link to="/dashboard" className="bg-[#10B981] hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-emerald-500/20">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-[#10B981] hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-emerald-500/20">Get Started</Link>
              </>
            )}
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-300">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-emerald-900/40 px-4 py-4 space-y-3 bg-[#071A17]">
            <a href="#home" className="block text-gray-300 hover:text-[#10B981] font-medium">Home</a>
            <a href="#features" className="block text-gray-300 hover:text-[#10B981] font-medium">Features</a>
            <a href="#about" className="block text-gray-300 hover:text-[#10B981] font-medium">About</a>
            {token ? (
              <Link to="/dashboard" className="block bg-[#10B981] text-white px-4 py-2 rounded-lg font-medium text-center">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="block text-gray-300 font-medium">Login</Link>
                <Link to="/register" className="block bg-[#10B981] text-white px-4 py-2 rounded-lg font-medium text-center">Get Started</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative px-4 sm:px-6 pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#10B981]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                <Sparkles size={16} className="text-[#10B981]" />
                <span className="text-sm text-[#10B981] font-medium">AI-Powered Personal Finance</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Take Control of Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-emerald-400">
                  {displayText}
                </span>
                <span className="animate-pulse">|</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl">
                Akanti helps you track, budget, and grow your finances with intelligent insights. 
                Get AI-powered advice tailored to your spending patterns and financial goals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {token ? (
                  <Link to="/dashboard" className="group bg-[#10B981] hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium text-lg transition-all hover:shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2">
                    Go to Dashboard
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="group bg-[#10B981] hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium text-lg transition-all hover:shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2">
                      Get Started Free
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/login" className="px-8 py-3 rounded-lg font-medium text-lg border border-emerald-500/40 hover:border-[#10B981] hover:bg-emerald-500/10 transition-all flex items-center justify-center">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981] to-emerald-600 border-2 border-[#071A17] flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">Trusted by 10k+ users</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#10B981]/20 to-transparent rounded-2xl blur-2xl"></div>
              <div className="relative bg-[#0a231f]/80 backdrop-blur-sm rounded-2xl border border-emerald-500/30 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Income vs Expenses</h3>
                  <span className="text-sm text-gray-400">Live Preview</span>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f4d42" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value) => `₦${Number(value).toLocaleString()}`}
                      contentStyle={{ backgroundColor: '#071A17', border: '1px solid #10B981', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 py-24 bg-gradient-to-b from-[#071A17] to-[#0a231f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-sm text-[#10B981] font-medium mb-6">Features</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Everything You Need to Manage Money</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">Powerful tools to help you understand, track, and optimize your finances all in one place.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group bg-[#0a231f]/50 backdrop-blur-sm rounded-xl p-6 border border-emerald-900/40 hover:border-[#10B981]/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Akanti Section */}
      <section id="about" className="px-4 sm:px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Why Choose Akanti</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">Smarter than a spreadsheet. More personal than traditional finance apps.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#0a231f] to-[#071A17] rounded-xl p-8 border border-emerald-500/30 hover:border-[#10B981]/60 transition-all duration-300">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center mb-5">
                <MessageCircle size={26} className="text-[#10B981]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Chat in Plain English</h3>
              <p className="text-gray-400 leading-relaxed">Ask "How much did I spend on food this month?" and get instant answers from your actual financial data.</p>
            </div>
            <div className="bg-gradient-to-br from-[#0a231f] to-[#071A17] rounded-xl p-8 border border-emerald-500/30 hover:border-[#10B981]/60 transition-all duration-300">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center mb-5">
                <Lightbulb size={26} className="text-[#10B981]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI That Knows You</h3>
              <p className="text-gray-400 leading-relaxed">Every insight is personalized based on your income, spending, and goals. No generic advice.</p>
            </div>
            <div className="bg-gradient-to-br from-[#0a231f] to-[#071A17] rounded-xl p-8 border border-emerald-500/30 hover:border-[#10B981]/60 transition-all duration-300">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center mb-5">
                <PieChart size={26} className="text-[#10B981]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Complete Financial Picture</h3>
              <p className="text-gray-400 leading-relaxed">Income, expenses, budgets, debts, cash flow, reports - everything unified in one beautiful dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 py-24 bg-gradient-to-b from-[#071A17] to-[#0a231f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Get Started in Minutes</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">Three simple steps to financial clarity</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center">
                {/* The badge straddles the card's top edge, so it has to stack above
                    the card's own background. Without z-10 the card paints over the
                    lower half of the circle and hides the number. */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/30">
                  {i + 1}
                </div>
                <div className="bg-[#0a231f]/50 backdrop-blur-sm rounded-xl p-8 pt-12 border border-emerald-900/40 hover:border-[#10B981]/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <div className="text-[#10B981]">{s.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
                  <p className="text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Loved by Users</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">See what our users have to say about Akanti</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gradient-to-br from-[#0a231f] to-[#071A17] rounded-xl p-6 border border-emerald-900/40 hover:border-[#10B981]/50 transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#10B981] to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-[#10B981] to-emerald-600 rounded-2xl p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Ready to Transform Your Finances?</h2>
              <p className="text-lg sm:text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have taken control of their money with Akanti. Start for free today.
              </p>
              {token ? (
                <Link to="/dashboard" className="inline-flex items-center gap-2 bg-white text-[#10B981] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:shadow-lg">
                  Go to Dashboard
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <Link to="/register" className="inline-flex items-center gap-2 bg-white text-[#10B981] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:shadow-lg">
                  Create Free Account
                  <ArrowRight size={20} />
                </Link>
              )}
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-emerald-50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Instant setup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-12 border-t border-emerald-900/40 bg-[#071A17]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/akanti-logo.jpeg" alt="Akanti" className="h-10 w-10 rounded-lg object-cover" />
                <span className="text-xl font-bold text-[#10B981]">Akanti</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">Your intelligent financial companion. Track, budget, and grow your wealth with AI-powered insights.</p>
              <div className="flex items-center gap-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#0a231f] rounded-lg flex items-center justify-center text-gray-400 hover:text-[#10B981] hover:bg-emerald-500/10 transition-all">
                  <Twitter size={18} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#0a231f] rounded-lg flex items-center justify-center text-gray-400 hover:text-[#10B981] hover:bg-emerald-500/10 transition-all">
                  <Instagram size={18} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#0a231f] rounded-lg flex items-center justify-center text-gray-400 hover:text-[#10B981] hover:bg-emerald-500/10 transition-all">
                  <Linkedin size={18} />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#0a231f] rounded-lg flex items-center justify-center text-gray-400 hover:text-[#10B981] hover:bg-emerald-500/10 transition-all">
                  <Github size={18} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-[#10B981] transition-colors">Features</a></li>
                <li><Link to="/docs" className="text-gray-400 hover:text-[#10B981] transition-colors">Documentation</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-[#10B981] transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-[#10B981] transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-[#10B981] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-[#10B981] transition-colors">Terms of Service</Link></li>
                <li><a href="mailto:support@akanti.com" className="text-gray-400 hover:text-[#10B981] transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-emerald-900/40 text-center">
            <p className="text-gray-500">&copy; 2026 Akanti. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
