import React, { useState, useEffect } from 'react';
import { defaultProducts } from '../data/products';
import type {
  Product, CartItem, User, ShippingAddress, Order,
  ContactForm, AuthFormData, Page, PaymentMethod, AuthTab, ViewAngle
} from '../types';

export function useAppState() {
  // ── Navigation ──────────────────────────────────────────────────────────────
  const [activePage, setActivePage] = useState<Page>('home');

  // ── Products & Requests (Backend connected) ───────────────────────────────
  const [productList, setProductList] = useState<Product[]>(defaultProducts);
  const [customizationRequests, setCustomizationRequests] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProductList(data);
            return;
          } else {
            // Seed initial products
            const seedRes = await fetch('/api/products/seed', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(defaultProducts)
            });
            if (seedRes.ok) {
              const seededData = await seedRes.json();
              if (Array.isArray(seededData) && seededData.length > 0) {
                setProductList(seededData);
                return;
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
      setProductList(defaultProducts);
    };
    
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('dharohar_token');
        if (!token) return;
        
        const res = await fetch('/api/requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setCustomizationRequests(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };

    fetchProducts();
    fetchRequests();
  }, []);

  // ── UI State ─────────────────────────────────────────────────────────────────
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [activeCategory, setActiveCategory] = useState('All Watches');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [zoomedImage, setZoomedImage] = useState<Product | null>(null);
  const [showcaseAngle, setShowcaseAngle] = useState<ViewAngle>('front');
  const [activeViewAngle, setActiveViewAngle] = useState<ViewAngle>('front');
  const [logoError, setLogoError] = useState(false);

  // ── Auth State ───────────────────────────────────────────────────────────────
  const [user, setUser] = useState<User | null>(null);
  
  // Fetch user on load if token exists
  useEffect(() => {
    const token = localStorage.getItem('dharohar_token');
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            localStorage.removeItem('dharohar_token');
          }
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      };
      fetchUser();
    }
  }, []);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('login');
  const [authFormData, setAuthFormData] = useState<AuthFormData>({ name: '', email: '', phone: '', password: '' });

  // ── Contact Modal State ──────────────────────────────────────────────────────
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '', phone: '', email: '',
    watchModel: 'Chittorgarh Fort Edition',
    customNotes: '', preferredContact: 'WhatsApp'
  });

  // ── Checkout State ───────────────────────────────────────────────────────────
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3 | 4>(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '', mobileNumber: '', pincode: '', flatAddress: '',
    landmark: '', city: '', state: '', deliveryNotes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  // ── Fetch user orders ────────────────────────────────────────────────────────
  useEffect(() => {
    if (user && user.email) {
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem('dharohar_token');
          if (!token) return;
          const res = await fetch(`/api/orders?email=${user.email}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUserOrders(Array.isArray(data) ? data : []);
          }
        } catch (err) {
          console.error('Error fetching orders:', err);
        }
      };
      fetchOrders();
    } else {
      setUserOrders([]);
    }
  }, [user]);

  // ── Auto-fill on login ───────────────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({ ...prev, fullName: user.name || prev.fullName, mobileNumber: user.phone || prev.mobileNumber }));
      setContactForm(prev => ({ ...prev, name: user.name || prev.name, email: user.email || prev.email, phone: user.phone || prev.phone }));
      
      if (user.role === 'admin') {
        const fetchRequests = async () => {
          try {
            const token = localStorage.getItem('dharohar_token');
            if (!token) return;
            const res = await fetch('/api/requests', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const data = await res.json();
              setCustomizationRequests(Array.isArray(data) ? data : []);
            }
          } catch (err) {}
        };
        fetchRequests();
      }
    }
  }, [user]);

  // ── Derived Values ───────────────────────────────────────────────────────────
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Filter and Search
  let filteredProducts = activeCategory === 'All Watches'
    ? productList
    : productList.filter(p => p.category === activeCategory);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.region.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sortOrder === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleOpenContactModal = (product?: Product) => {
    if (product) setContactForm(prev => ({ ...prev, watchModel: product.name }));
    setIsContactModalOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone || !contactForm.customNotes) {
      setToastMessage('Please enter your name, phone number, and custom watch details.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    
    try {
      const newRequest = { ...contactForm, date: new Date().toLocaleDateString() };
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest)
      });
      const savedRequest = await res.json();
      
      setIsContactModalOpen(false);
      setCustomizationRequests(prev => [savedRequest, ...prev]);
      setToastMessage('Customization request received! Our master artisan will contact you within 24 hours.');
      setTimeout(() => setToastMessage(''), 5000);
    } catch (err) {
      console.error('Error saving request:', err);
      setToastMessage('Error saving request.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setToastMessage(`${product.name} added to your collection.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const updateQuantity = (id: number | string, delta: number) =>
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));

  const removeFromCart = (id: number | string) =>
    setCartItems(prev => prev.filter(item => item.id !== id));

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authFormData.email || !authFormData.password) {
      setToastMessage('Please enter your email and password.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    
    try {
      const endpoint = authTab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authFormData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setToastMessage(data.message || 'Authentication failed');
        setTimeout(() => setToastMessage(''), 3000);
        return;
      }
      
      // Save token and set user
      localStorage.setItem('dharohar_token', data.token);
      setUser(data.user);
      setIsAuthModalOpen(false);
      setToastMessage(`Welcome ${authTab === 'login' ? 'back' : ''}, ${data.user.name}!`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch (err) {
      console.error('Auth error:', err);
      setToastMessage('An error occurred during authentication.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleDemoLogin = () => {
    const demoUser: User = { name: 'Pranshav Rathod', email: 'pranshav.rathod@dharohar.com', phone: '+91 98250 12345' };
    setUser(demoUser);
    setShippingAddress({ fullName: 'Pranshav Rathod', mobileNumber: '+91 98250 12345', pincode: '380015', flatAddress: '702, Heritage Heights, Satellite Road', landmark: 'Opp. Iskcon Temple', city: 'Ahmedabad', state: 'Gujarat', deliveryNotes: 'Ring doorbell upon arrival.' });
    setIsAuthModalOpen(false);
    setToastMessage('Signed in as Demo User: Pranshav Rathod');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('dharohar_token');
    setUser(null);
    setToastMessage('Signed out successfully.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleMakeAdmin = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('dharohar_token');
      if (token) {
        await fetch('/api/auth/make-admin', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error(err);
    }
    setUser({ ...user, role: 'admin' });
    setToastMessage('You have been granted Admin privileges!');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const startCheckout = () => {
    if (!user) {
      setToastMessage('Please sign in to proceed with home delivery checkout.');
      setTimeout(() => setToastMessage(''), 3000);
      setIsAuthModalOpen(true);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    setCheckoutStep(1);
  };

  const handleCompleteOrder = async () => {
    if (!shippingAddress.fullName || !shippingAddress.flatAddress || !shippingAddress.city || !shippingAddress.pincode) {
      setToastMessage('Please fill in complete home delivery address.');
      setTimeout(() => setToastMessage(''), 3000);
      setCheckoutStep(1);
      return;
    }
    
    const orderId = `DHAR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      orderId,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...cartItems],
      totalAmount: cartTotal,
      address: { ...shippingAddress },
      paymentMethod,
      status: 'Order Placed',
      deliveryStatus: 'Processing & Quality Check',
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      timeline: [
        { title: 'Order Placed & Verified', time: 'Just now', completed: true },
        { title: 'Heritage Quality Inspection', time: 'In Progress', completed: false },
        { title: 'Dispatched from Atelier', time: 'Expected tomorrow', completed: false },
        { title: 'Out for Home Delivery', time: 'Expected 3 days', completed: false },
        { title: 'Delivered to Home Address', time: 'Final Step', completed: false }
      ],
      userEmail: user?.email
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      const savedOrder = await res.json();
      
      setPlacedOrder(savedOrder);
      setUserOrders(prev => [savedOrder, ...prev]);
      setCartItems([]);
      setCheckoutStep(4);
      setToastMessage('Order placed successfully! Preparing home delivery.');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err) {
      console.error('Error saving order:', err);
      setToastMessage('Error placing order.');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return {
    // Navigation
    activePage, setActivePage,
    // Products
    productList, setProductList,
    customizationRequests,
    // UI
    isMenuOpen, setIsMenuOpen,
    isCartOpen, setIsCartOpen,
    searchQuery, setSearchQuery,
    sortOrder, setSortOrder,
    cartItems, cartTotal, cartItemCount,
    toastMessage, setToastMessage,
    activeCategory, setActiveCategory,
    currentPage, setCurrentPage,
    totalPages, paginatedProducts, filteredProducts,
    zoomedImage, setZoomedImage,
    showcaseAngle, setShowcaseAngle,
    activeViewAngle, setActiveViewAngle,
    logoError, setLogoError,
    // Auth
    user,
    isAuthModalOpen, setIsAuthModalOpen,
    authTab, setAuthTab,
    authFormData, setAuthFormData,
    // Contact
    isContactModalOpen, setIsContactModalOpen,
    contactForm, setContactForm,
    // Checkout
    isCheckoutOpen, setIsCheckoutOpen,
    checkoutStep, setCheckoutStep,
    shippingAddress, setShippingAddress,
    paymentMethod, setPaymentMethod,
    placedOrder,
    userOrders,
    isOrdersModalOpen, setIsOrdersModalOpen,
    // Handlers
    handleOpenContactModal,
    handleContactSubmit,
    handleAddToCart,
    updateQuantity,
    removeFromCart,
    handleLoginSubmit,
    handleDemoLogin,
    handleLogout,
    handleMakeAdmin,
    startCheckout,
    handleCompleteOrder,
  };
}
