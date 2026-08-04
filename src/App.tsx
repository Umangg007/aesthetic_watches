import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAppState } from './hooks/useAppState';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import { HomePage } from './pages/Home';
import { AboutPage } from './pages/About';
import { AdminDashboard } from './pages/Admin';

// UI Components
import ImageLightbox from './components/ui/ImageLightbox';

// Modals
import {
  ContactModal,
  AuthModal,
  CartModal,
  CheckoutModal,
  OrdersModal
} from './components/modals';

function MainLayout() {
  const appState = useAppState();
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="relative min-h-screen bg-stone-950 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Full-Page Background Image with Luxury Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed scale-105"
          style={{ backgroundImage: "url('/palace_background.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/85 to-stone-950/95" />
      </div>

      <div className="relative z-10">
        {/* Global Notifications */}
        {appState.toastMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-stone-900/90 backdrop-blur-md border border-amber-500/50 text-white px-6 py-3 rounded-full shadow-[0_0_40px_rgba(217,119,6,0.2)] text-sm font-bold flex items-center gap-3 animate-[fade-in-down_0.3s_ease-out]">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {appState.toastMessage}
          </div>
        )}

      {/* Navigation Layer */}
      {!isAdmin && (
        <Navbar
          logoError={appState.logoError}
          setLogoError={appState.setLogoError}
          isMenuOpen={appState.isMenuOpen}
          setIsMenuOpen={appState.setIsMenuOpen}
          cartItemCount={appState.cartItemCount}
          user={appState.user}
          setIsCartOpen={appState.setIsCartOpen}
          setIsAuthModalOpen={appState.setIsAuthModalOpen}
          handleOpenContactModal={appState.handleOpenContactModal}
          productList={appState.productList}
          searchQuery={appState.searchQuery}
          setSearchQuery={appState.setSearchQuery}
          handleLogout={appState.handleLogout}
        />
      )}

      {/* Page Content Routing */}
      <div className={isAdmin ? '' : 'pt-0'}>
        <Routes>
          <Route path="/" element={<HomePage {...appState} />} />
          <Route path="/about" element={<AboutPage handleOpenContactModal={appState.handleOpenContactModal} />} />
          <Route path="/admin" element={
            appState.user?.role === 'admin' ? (
              <AdminDashboard
                productList={appState.productList}
                setProductList={appState.setProductList}
                customizationRequests={appState.customizationRequests}
              />
            ) : (
              <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-white bg-stone-950">
                <div className="bg-stone-900 border border-amber-600/30 p-12 rounded-2xl text-center max-w-md">
                  <h2 className="text-3xl font-serif text-amber-500 mb-4">Access Denied</h2>
                  <p className="text-stone-400">You do not have administrator privileges to view this page.</p>
                </div>
              </div>
            )
          } />
        </Routes>
      </div>

      {/* Modals & Overlays */}
      <ImageLightbox
        zoomedImage={appState.zoomedImage}
        setZoomedImage={appState.setZoomedImage}
        handleAddToCart={appState.handleAddToCart}
        handleOpenContactModal={appState.handleOpenContactModal}
      />

      <ContactModal
        isOpen={appState.isContactModalOpen}
        onClose={() => appState.setIsContactModalOpen(false)}
        contactForm={appState.contactForm}
        setContactForm={appState.setContactForm}
        handleContactSubmit={appState.handleContactSubmit}
        productList={appState.productList}
      />

      <AuthModal
        isOpen={appState.isAuthModalOpen}
        onClose={() => appState.setIsAuthModalOpen(false)}
        authTab={appState.authTab}
        setAuthTab={appState.setAuthTab}
        authFormData={appState.authFormData}
        setAuthFormData={appState.setAuthFormData}
        handleLoginSubmit={appState.handleLoginSubmit}
      />

      <CartModal
        isOpen={appState.isCartOpen}
        onClose={() => appState.setIsCartOpen(false)}
        cartItems={appState.cartItems}
        cartTotal={appState.cartTotal}
        updateQuantity={appState.updateQuantity}
        removeFromCart={appState.removeFromCart}
        startCheckout={appState.startCheckout}
      />

      <CheckoutModal
        isOpen={appState.isCheckoutOpen}
        onClose={() => appState.setIsCheckoutOpen(false)}
        checkoutStep={appState.checkoutStep}
        setCheckoutStep={appState.setCheckoutStep}
        shippingAddress={appState.shippingAddress}
        setShippingAddress={appState.setShippingAddress}
        paymentMethod={appState.paymentMethod}
        setPaymentMethod={appState.setPaymentMethod}
        cartItems={appState.cartItems}
        cartTotal={appState.cartTotal}
        placedOrder={appState.placedOrder}
        handleCompleteOrder={appState.handleCompleteOrder}
        setIsOrdersModalOpen={appState.setIsOrdersModalOpen}
        setToastMessage={appState.setToastMessage}
      />

      <OrdersModal
        isOpen={appState.isOrdersModalOpen}
        onClose={() => appState.setIsOrdersModalOpen(false)}
        userOrders={appState.userOrders}
      />

      {/* Footer Layer */}
      {!isAdmin && (
        <Footer
          logoError={appState.logoError}
          productList={appState.productList}
          handleOpenContactModal={appState.handleOpenContactModal}
        />
      )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}
