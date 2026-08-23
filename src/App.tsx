import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';

// Dashboard layout & pages
import { SidebarNav } from './components/dashboard/SidebarNav';
import { DashboardOverviewPage } from './pages/dashboard/DashboardOverviewPage';
import { MyBookingsPage } from './pages/dashboard/MyBookingsPage';
import { MyMessagesPage } from './pages/dashboard/MyMessagesPage';
import { MyReviewsPage } from './pages/dashboard/MyReviewsPage';
import { MyFavoritesPage } from './pages/dashboard/MyFavoritesPage';
import { PaymentsPage } from './pages/dashboard/PaymentsPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { NotificationsPage } from './pages/dashboard/NotificationsPage';
import { SupportPage } from './pages/dashboard/SupportPage';

// Admin & Staff pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ReceptionDashboardPage } from './pages/reception/ReceptionDashboardPage';
import { ManagerDashboardPage } from './pages/manager/ManagerDashboardPage';
import { StaffLoginPage } from './pages/staff/StaffLoginPage';
import { NotificationToast } from './components/common/NotificationToast';
import { PwaInstallBanner } from './components/common/PwaInstallBanner';

import { VerticalType, User } from './types';
import { dataService } from './lib/supabase';

import { AuthModal } from './components/auth/AuthModal';
import { ShieldCheck } from 'lucide-react';

const ProtectedDashboardGate: React.FC<{ onLoginSuccess: (user: User) => void }> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl border border-purple-100 space-y-4">
        <div className="w-16 h-16 rounded-full bg-purple-50 text-[#2E0854] mx-auto flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-[#2E0854]" />
        </div>
        <h2 className="text-xl font-black text-[#2E0854]">Authentication Required</h2>
        <p className="text-xs text-gray-500 font-medium">
          Please log in or create an account to access your dashboard, view active bookings, and contact concierge.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-3.5 rounded-xl bg-[#2E0854] hover:bg-black text-white font-black text-xs shadow-md active:scale-95 transition-all"
        >
          Log In / Create Account
        </button>
      </div>

      {showModal && (
        <AuthModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            navigate('/');
          }}
          initialMode="login"
          onSuccess={(user) => {
            onLoginSuccess(user);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeVertical, setActiveVertical] = useState<VerticalType>('stays');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    dataService.getCurrentUser().then(setCurrentUser);
  }, []);

  const handleLogout = async () => {
    const isStaffUser = currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager' || currentUser.role === 'receptionist');
    const isStaffRoute =
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/manager') ||
      location.pathname.startsWith('/reception') ||
      location.pathname.startsWith('/portal');

    const wasAdmin = currentUser?.role === 'admin' || location.pathname.startsWith('/admin');

    await dataService.logout();
    setCurrentUser(null);

    // Automatically redirect admin/staff to login page on logout
    if (wasAdmin) {
      navigate('/admin/login', { replace: true });
    } else if (isStaffUser || isStaffRoute) {
      navigate('/portal/login', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const isAuthPage =
    location.pathname === '/admin/login' ||
    location.pathname === '/portal/login';

  const isDashboardRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/manager') ||
    location.pathname.startsWith('/reception') ||
    location.pathname.startsWith('/dashboard');

  const showFooter = !isAuthPage && !isDashboardRoute;

  return (
    <div className="min-h-screen flex flex-col bg-pattern">
      {/* Navigation Bar - Hidden on Admin & Staff Login Pages */}
      {!isAuthPage && (
        <Navbar
          activeVertical={activeVertical}
          onVerticalChange={setActiveVertical}
          currentUser={currentUser}
          onLogout={handleLogout}
          onLoginSuccess={setCurrentUser}
        />
      )}

      {/* Main Body */}
      <div className="flex-1">
        <Routes>
          {/* Public Hub */}
          <Route
            path="/"
            element={
              <HomePage
                activeVertical={activeVertical}
                onVerticalChange={setActiveVertical}
              />
            }
          />
          <Route path="/stays/:id" element={<PropertyDetailPage />} />
          <Route path="/cars/:id" element={<PropertyDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/booking/:id/confirmation" element={<BookingConfirmationPage currentUser={currentUser} onLoginSuccess={setCurrentUser} />} />

          {/* Admin & Staff Console Routes */}
          <Route path="/portal/login" element={<StaffLoginPage onLoginSuccess={setCurrentUser} />} />
          <Route path="/admin/login" element={<AdminLoginPage onLoginSuccess={setCurrentUser} />} />
          <Route path="/admin" element={<AdminDashboardPage adminUser={currentUser} />} />
          <Route path="/reception" element={<ReceptionDashboardPage receptionUser={currentUser} />} />
          <Route path="/manager" element={<ManagerDashboardPage managerUser={currentUser} />} />

          {/* Authenticated Dashboard Nested Routes */}
          <Route
            path="/dashboard/*"
            element={
              currentUser ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <SidebarNav user={currentUser} onLogout={handleLogout} />
                    <div className="flex-1 min-w-0">
                      <Routes>
                        <Route index element={<DashboardOverviewPage user={currentUser} />} />
                        <Route path="bookings" element={<MyBookingsPage />} />
                        <Route path="messages" element={<MyMessagesPage />} />
                        <Route path="reviews" element={<MyReviewsPage />} />
                        <Route path="favorites" element={<MyFavoritesPage />} />
                        <Route path="payments" element={<PaymentsPage />} />
                        <Route path="profile" element={<ProfilePage user={currentUser} onUpdateUser={setCurrentUser} />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="support" element={<SupportPage />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                      </Routes>
                    </div>
                  </div>
                </div>
              ) : (
                <ProtectedDashboardGate onLoginSuccess={setCurrentUser} />
              )
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* PWA Install Banner & Toast */}
      <PwaInstallBanner />
      <NotificationToast />

      {/* Footer - Hidden on Auth Pages & All Dashboards */}
      {showFooter && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
