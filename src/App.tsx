import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

import { VerticalType, User } from './types';
import { dataService } from './lib/supabase';

export const App: React.FC = () => {
  const [activeVertical, setActiveVertical] = useState<VerticalType>('stays');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    dataService.getCurrentUser().then(setCurrentUser);
  }, []);

  const handleLogout = async () => {
    await dataService.logout();
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-pattern">
        {/* Navigation Bar */}
        <Navbar
          activeVertical={activeVertical}
          onVerticalChange={setActiveVertical}
          currentUser={currentUser}
          onLogout={handleLogout}
          onLoginSuccess={setCurrentUser}
        />

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
            <Route path="/booking/:id/confirmation" element={<BookingConfirmationPage />} />

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
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Footer & Global Notification Toast */}
        <NotificationToast />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
