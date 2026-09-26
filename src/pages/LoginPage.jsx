import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Store,
  ChefHat,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, currentUser, DEMO_ACCOUNTS } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedDemoRole, setSelectedDemoRole] = useState(null);

  // If redirected from another page, take them back after login
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email or username');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      const destination = from || res.redirect;
      navigate(destination, { replace: true });
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickDemoLogin = async (roleKey) => {
    setSelectedDemoRole(roleKey);
    setErrorMessage('');
    const account = DEMO_ACCOUNTS[roleKey];
    if (!account) return;

    setEmail(account.email);
    setPassword('sweetbite123');

    const res = await login(account.email, 'sweetbite123');
    if (res.success) {
      const destination = from || res.redirect;
      navigate(destination, { replace: true });
    } else {
      setErrorMessage(res.error);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-[#321E1E] relative overflow-hidden">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#116D6E]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#CD1818]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#116D6E]/5 blur-[120px] pointer-events-none" />

      {/* Main Login Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-soft-lg border border-[#4E3636]/15 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 animate-in fade-in duration-300">
        {/* Left Side: Brand Atmosphere & Highlights (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-[#116D6E] p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background motif */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

          {/* Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-md">
                <ChefHat className="w-7 h-7" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold tracking-tight">SweetBite</h1>
                <p className="text-[11px] text-white/80 font-medium uppercase tracking-widest">
                  Artisan Bakery &amp; Patisserie
                </p>
              </div>
            </div>

            <div className="space-y-3 mt-8">
              <h2 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
                Unified Bakery POS &amp; Cloud ERP Suite
              </h2>
              <p className="text-xs text-white/85 leading-relaxed">
                Seamlessly manage live counter billing, advance custom cake orders, dynamic sales-driven customer records, and financial tax reports.
              </p>
            </div>
          </div>

          {/* Operational Status Badges */}
          <div className="relative z-10 my-8 space-y-2.5">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="font-bold block">Downtown Main Branch</span>
                <span className="text-[10px] text-white/70">Register POS-01 Active &bull; GST Online</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3 text-xs">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <p className="text-[11px] text-white/90">
                100% Sales-driven customer ledger &amp; advance payments sync
              </p>
            </div>
          </div>

          {/* Footer Motto */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70">
            <span>&ldquo;Freshly Baked Happiness&rdquo;</span>
            <span>v2.4 Enterprise</span>
          </div>
        </div>

        {/* Right Side: Form & Quick Role Selectors (7 cols on desktop) */}
        <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#116D6E]/10 text-[#116D6E] border border-[#116D6E]/20 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Secure Terminal Authentication</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#321E1E]">
                Sign In to Terminal
              </h2>
              <p className="text-xs text-[#4E3636] mt-0.5">
                Select a quick role demo or enter your staff account credentials
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-[#CD1818]/10 border border-[#CD1818]/25 rounded-xl text-xs text-[#CD1818] flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#CD1818]" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* 1-Click Demo Profiles */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4E3636] mb-2">
                1-Click Quick Demo Sign In:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Admin Card */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  disabled={isLoading}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    email === DEMO_ACCOUNTS.admin.email
                      ? 'border-[#116D6E] bg-[#116D6E]/5 ring-2 ring-[#116D6E]/20 shadow-xs'
                      : 'border-[#4E3636]/15 hover:border-[#116D6E]/60 bg-[#FDFBF7]'
                  }`}
                >
                  <img
                    src={DEMO_ACCOUNTS.admin.avatar}
                    alt="Chef Marie"
                    className="w-10 h-10 rounded-xl object-cover border border-[#116D6E]/30"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#321E1E] truncate">
                        {DEMO_ACCOUNTS.admin.name}
                      </span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-[#116D6E] text-white">
                        Admin
                      </span>
                    </div>
                    <span className="text-[10px] text-[#4E3636] block truncate">
                      Full Store &amp; Reports Access
                    </span>
                  </div>
                </button>

                {/* Cashier Card */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('cashier')}
                  disabled={isLoading}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    email === DEMO_ACCOUNTS.cashier.email
                      ? 'border-[#116D6E] bg-[#116D6E]/5 ring-2 ring-[#116D6E]/20 shadow-xs'
                      : 'border-[#4E3636]/15 hover:border-[#116D6E]/60 bg-[#FDFBF7]'
                  }`}
                >
                  <img
                    src={DEMO_ACCOUNTS.cashier.avatar}
                    alt="Priya Sharma"
                    className="w-10 h-10 rounded-xl object-cover border border-[#116D6E]/30"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#321E1E] truncate">
                        {DEMO_ACCOUNTS.cashier.name}
                      </span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-[#4E3636] text-white">
                        Cashier
                      </span>
                    </div>
                    <span className="text-[10px] text-[#4E3636] block truncate">
                      POS Register Terminal
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#4E3636]/15" />
              </div>
              <span className="relative bg-white px-3 text-[11px] font-semibold text-[#4E3636] uppercase tracking-wider">
                Or Sign In with Credentials
              </span>
            </div>

            {/* Standard Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#321E1E] mb-1.5">
                  Email or Staff Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#4E3636]/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@sweetbite.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/20 text-xs font-semibold text-[#321E1E] placeholder-[#4E3636]/40 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#321E1E]">
                    Password
                  </label>
                  <span className="text-[10px] text-[#116D6E] hover:underline cursor-pointer">
                    Forgot Key?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#4E3636]/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter terminal access PIN / password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FDFBF7] rounded-xl border border-[#4E3636]/20 text-xs font-semibold text-[#321E1E] placeholder-[#4E3636]/40 focus:outline-none focus:border-[#116D6E] focus:ring-2 focus:ring-[#116D6E]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E3636]/60 hover:text-[#321E1E] p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#116D6E] focus:ring-[#116D6E] border-[#4E3636]/30 accent-[#116D6E]"
                  />
                  <span className="text-[#4E3636] font-medium text-[11px]">Keep this terminal signed in</span>
                </label>
                <span className="text-[11px] text-[#4E3636]">Shift: Morning #01</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-[#116D6E] hover:bg-[#0e5859] active:scale-[0.99] text-white text-xs font-bold shadow-teal flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to Terminal</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer note */}
          <div className="mt-8 pt-4 border-t border-[#4E3636]/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#4E3636] gap-2">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#116D6E]" />
              <span>Admin: <code>admin@sweetbite.com</code></span>
            </span>
            <span className="text-[10px] text-[#4E3636]/70">
              Cashier: <code>cashier@sweetbite.com</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
