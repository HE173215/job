import React, { useState } from 'react';
import { Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Lock, User, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export function AdminLoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Nếu đã đăng nhập thì tự động chuyển vào dashboard
  if (isLoading) {
    return (
      <div className="min-h-screen bg-army-black flex items-center justify-center text-army-gold">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-army-gold" />
          <span className="font-serif text-sm tracking-wider uppercase">Đang kiểm tra phiên làm việc...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      await login({ username: username.trim(), password });
      navigate('/admin', { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
      setPassword(''); // Xóa mật khẩu khi đăng nhập thất bại
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-hero-radial pointer-events-none" />

      {/* Decorative Vignette */}
      <div className="absolute inset-0 vignette-overlay pointer-events-none" />

      {/* Back to Public Site Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-serif uppercase tracking-wider text-army-ivory/80 hover:text-army-gold transition-colors py-1 px-3 rounded bg-army-black/50 border border-army-gold/30 hover:border-army-gold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về trang chủ</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-military bg-army-maroon/85 border border-army-gold/40 shadow-2xl backdrop-blur-md">
        {/* Top Emblem */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-army-black border-2 border-army-gold flex items-center justify-center text-army-gold mb-3 shadow-gold-glow">
            <Shield className="w-7 h-7 fill-army-gold/20" />
          </div>
          <span className="text-[10px] text-army-gold font-serif uppercase tracking-widest font-semibold">
            HỆ THỐNG QUẢN TRỊ NỘI DUNG
          </span>
          <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-army-white uppercase tracking-wider mt-1">
            TRƯỜNG SĨ QUAN CHÍNH TRỊ
          </h1>
          <div className="w-16 h-0.5 bg-army-gold/60 mt-3" />
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded bg-army-red/50 border border-army-red-light text-army-white text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-army-gold shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-xs uppercase tracking-wider font-serif font-bold text-army-gold mb-1.5"
            >
              Tên đăng nhập
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-army-gold/60">
                <User className="w-4 h-4" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tài khoản quản trị..."
                className="w-full pl-10 pr-4 py-2.5 rounded bg-army-black/80 border border-army-gold/30 text-army-white placeholder:text-army-muted/40 focus:border-army-gold focus:outline-none focus:ring-1 focus:ring-army-gold/50 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider font-serif font-bold text-army-gold mb-1.5"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-army-gold/60">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded bg-army-black/80 border border-army-gold/30 text-army-white placeholder:text-army-muted/40 focus:border-army-gold focus:outline-none focus:ring-1 focus:ring-army-gold/50 text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 rounded-military bg-army-gold text-army-maroon font-serif font-extrabold text-sm uppercase tracking-wider hover:bg-army-gold-light active:bg-army-gold-soft transition-all duration-200 shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <span>Đăng nhập hệ thống</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-army-gold/15 text-center text-[11px] text-army-muted">
          Khu vực bảo mật nội bộ • Cấm truy cập trái phép
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
