import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Loader2 } from 'lucide-react';

export function ProtectedAdminRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-army-black flex flex-col items-center justify-center p-4 text-army-gold">
        <div className="w-14 h-14 rounded-full bg-army-maroon border-2 border-army-gold flex items-center justify-center mb-4 shadow-gold-glow">
          <Shield className="w-7 h-7 text-army-gold" />
        </div>
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-5 h-5 animate-spin text-army-gold" />
          <span className="font-serif font-bold text-sm tracking-widest uppercase">
            Kiểm tra quyền truy cập...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Lưu lại vị trí đang cố truy cập để redirect sau khi login thành công
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedAdminRoute;
